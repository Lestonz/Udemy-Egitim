import React, {useEffect, useState} from 'react';
import Web3 from 'web3'
import './App.css';
import ABI from '../src/assets/abi.json'
const gif = require('../src/assets/gif.gif');

function App() {
  const [hesap, setHesap] = useState([])
  const [smartContract, setSmartContrat] = useState(null)
  const [okumaVerisi, setOkumaVerisi] = useState({
    name: "",
    symbol:"",
    totalSupply: "",
    maxArz:"",
    maxMintTx:"",
    fiyat:""
  })
  const [mintMiktari, setMintMiktari] = useState(1)
  const [mintUcreti, setMintUcreti] = useState(0)

  const web3 = new Web3( Web3.givenProvider || "https://sepolia.infura.io/v3/SENIN_INFURA_API")

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
      const kontratABI = ABI.abi
      const kontratAdresi = "0x0e44Cb66f6f0FA27Ed4D2B5521e5b7f20e02Ed6b"

      const kontrat = new web3.eth.Contract(kontratABI, kontratAdresi)
      setSmartContrat(kontrat) 
      
    } catch (error) {
      console.log(error)
    }
  }

  const veriOkuma = async () => {
    if(smartContract) {
      try {
        const name = await smartContract.methods.name().call()
        const symbol = await smartContract.methods.symbol().call()
        const totalSupply = await smartContract.methods.totalSupply().call()
        const maxArz = await smartContract.methods.maxArz().call()
        const maxMintTx = await smartContract.methods.maxMintPerTX().call()
        const fiyat = await smartContract.methods.fiyat().call()
        
        setMintUcreti(fiyat)
        const ucret = web3.utils.fromWei(fiyat, "ether")
        setOkumaVerisi({
          name: name,
          symbol:symbol,
          totalSupply: totalSupply,
          maxArz:maxArz,
          maxMintTx:maxMintTx,
          fiyat:ucret
        })
      } catch (error) {
        console.log(error)
      }
      

    } else {
      console.log("Kontrat yüklenemedi veya bulunamadı.")
    }
  }

  const mintMiktariAzalt = () => {
    setMintMiktari(e => Math.max(1, e - 1))
  }

  const mintMiktariCogalt = () => {
    setMintMiktari(e => e + 1)
  }

  const mint = async() => {
    if(smartContract) {
        try {
          const value = mintMiktari * mintUcreti;
          await smartContract.methods.mint(mintMiktari).send({from : hesap[0], value:value })
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

  useEffect(() => {
    veriOkuma()
  },[smartContract])

  return (
    <div className="app">
      <div className='app-img-container' >
          <img src={gif} className='img-box' />
      </div>
      <div className='main-cointer' >
        <div>
          <p className='text-title' >Lestonz EV NFTs Koleksiyonu</p>
          <p className='text-body' >Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <div>
            <p className='text-body'> {okumaVerisi.totalSupply} / {okumaVerisi.maxArz} </p>
        </div>
        <div className='name-box' >
            <p > {okumaVerisi.name} - {okumaVerisi.symbol} </p>
        </div>

    { hesap.length > 0 ? (
      <div className='second-container' >
          <p className='text-body'> {okumaVerisi.fiyat} ETH </p>
          <div className='mint-container' >
              <button className="mint-button" onClick={mint} >MINT</button>
              <div className='mint-control' >
                <button  onClick={mintMiktariAzalt}  className='mint-decr' >-</button>
                <p className='mint-text'>{mintMiktari}</p>
                <button onClick={mintMiktariCogalt}  className='mint-incr' >+</button>
              </div>
          </div>
        </div>
    ) : (
      <button onClick={cuzdanBagla} className='connect-button' >
          Cüzdan Bağla
        </button>
    )}


      </div>
    </div>
  );
}

export default App;
