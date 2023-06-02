import React, {useEffect, useState} from 'react';
import Web3 from 'web3'
import ABI from './Abi.json'
import './App.css';

function App() {
  const [hesap, setHesap] = useState([])
  const [smartContract, setSmartContrat] = useState(null)
  const [okumaVerisi, setOkumaVerisi] = useState("")
  const [miktar, setMiktar] = useState()
  const [adres, setAdres] = useState("")
  const web3 = new Web3( Web3.givenProvider || "https://goerli.infura.io/v3/SENIN_INFURA_API")

  // const cuzdanBagla = async () => {
  //   if(window.ethereum) {
  //     try {
  //         await window.ethereum.request({method: "eth_requestAccounts"})
  //         const web3 = new Web3(window.ethereum)

  //         const hesaplar = await web3.eth.getAccounts();
  //         setHesap(hesaplar)
  //     } catch (error) {
  //         console.log(error)
  //     }
  //   }
  // }

  const cuzdanBagla = async () => {
    if(window.ethereum) {
      try {
          await window.ethereum.request({method: "eth_requestAccounts"})
        
          const hesaplar = await web3.eth.getAccounts();
          const mesaj = "Merhaba Hosgeldiniz Bu Websitesine Bağlanmak İstiyormusunuz?"
          await web3.eth.personal.sign(mesaj, hesaplar[0], "")

          setHesap(hesaplar)
      } catch (error) {
          console.log(error)
      }
    } else {
      alert("Lütfen Metamask Yükleyiniz!")
    }
  }

  const kontratBagla = async () => {
    try {
      const kontratABI = ABI
      const kontratAdresi = "0xAd94fb76162dE7c1b26EB9551e54a3e324018Ce3"

      const kontrat = new web3.eth.Contract(kontratABI, kontratAdresi)
      setSmartContrat(kontrat) 
    } catch (error) {
      console.log(error)
    }
  }

  const veriOkuma = async () => {
    if (smartContract) {
      try {
          const sonuc = await smartContract.methods.name().call()
          setOkumaVerisi(sonuc)
      } catch (error) {
        console.log(error)
      }
    } else {
      alert("Kontrat Yüklenemedi veya Bulunamadı!")
    }
  }

  const veriYazma = async () => {
    if (smartContract) {
      try {
          
        const value = web3.utils.toWei(miktar, "ether")

        await smartContract.methods.transfer(adres, value).send({from : hesap[0]})
          
      } catch (error) {
        console.log(error)
      }
    } else {
      alert("Kontrat Yüklenemedi veya Bulunamadı!")
    }
  }

  useEffect(() => {
    kontratBagla()
  },[])

  return (
    <div className="App">
      <div className='main-container' >
          <p>Merhaba Lestonz!</p>
          {
            hesap.length > 0 ? (
              <div className='box-container' >
                <p>Bağlı Hesap: {hesap[0]}</p>
                <p>Symbol: {okumaVerisi}</p>
                <button onClick={veriOkuma} >Veriyi Oku</button>

                <input className='input-container' type='text' value={miktar}  onChange={(e) =>setMiktar(e.target.value) } placeholder='Miktarı' />
                <input className='input-container' type='text' value={adres}  onChange={(e) =>setAdres(e.target.value) } placeholder='Adres' />
                <button onClick={veriYazma} >Veriyi Yaz</button>
              </div>

            ) : (
              <button onClick={cuzdanBagla} >Cüzdan Bağla</button>
            )
          }
      </div>
    </div>
  );
}

export default App;
