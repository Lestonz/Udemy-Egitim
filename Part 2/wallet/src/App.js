import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import './App.css';
import ABI from './abi.json'

function App() {
  const [accounts, setAccounts] = useState([]);
  const [contractInstance, setContractInstance] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState();
  const [data, setData] = useState(null);

  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
    
  const web3 = useMemo(
    () => new Web3( Web3.givenProvider ||"https://goerli.infura.io/v3/SENIN_INFURA_API"),[]
  );


  useEffect(() => {
    connectContract();
  }, []);

  



  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        // MetaMask ile bağlantıyı kur
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Web3 sağlayıcısını al
        // const web3 = new Web3(window.ethereum);

        // Hesapları al
       
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];
        await web3.eth.personal.sign("Merhaba", from, "");
        setAccounts(accounts);
      
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("MetaMask yüklü değil. Lütfen yükleyin.");
    }
  };

  const connectContract = async () => {
    try {
      const contractABI = ABI
      const contractAddress = "0xAd94fb76162dE7c1b26EB9551e54a3e324018Ce3"

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      setContractInstance(contract);
    } catch (error) {
      console.error(error);
    }
  }

  const readData = async () => {
    if (contractInstance) {
      try {
        // Akıllı sözleşmeden veri oku
        const result = await contractInstance.methods.name().call();

        setData(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // const writeData = async () => {
  //   if (window.ethereum) {
  //     try {
    
  //       // const web3 = new Web3("https://goerli.infura.io/v3/1b112fb8001a423899045385933ac530");
  //       //0x97fEcA334dc37f191D77e8465f5E9aeE18941cE3
  //       // Akıllı sözleşmeye veri yaz
  //       const value = web3.utils.toWei(amount, "ether");
  //       // const test = web3.utils.toWei(0.0.toString())._hex;
  //       // console.log(accounts[0] )
  //       const result = await contractInstance.methods.transfer(toAddress, value).encodeABI()
  //       console.log(result)
  //       const tx = {
  //         from: accounts[0], // Required  /* '₺{}' */
  //         to: toAddress , // Required /* '₺{}' */
  //         data: result, // Required /* '₺{}' */
  //         // gasPrice: "0x02540be400", // Optional
  //         // gasLimit: "0x9c40", // Optional
  //         // value: test, // Optional /* '₺{}' */
  //       };
        
  //       await web3.eth.sendTransaction(tx ).then(() => console.log("Merhaba")).catch((e) =>  console.log("Hataa",e))

    
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const writeData = async () => {
    if (window.ethereum) {
      try {
    
        // const web3 = new Web3("https://goerli.infura.io/v3/1b112fb8001a423899045385933ac530");
        //0x97fEcA334dc37f191D77e8465f5E9aeE18941cE3
        // Akıllı sözleşmeye veri yaz
        const value = web3.utils.toWei(amount, "ether");
        // const test = web3.utils.toWei(0.0.toString())._hex;
        // console.log(accounts[0] )
         await contractInstance.methods.transfer(toAddress, value).send({from:accounts[0]})

      
    
      } catch (error) {
        console.error(error);
      }
    }
  };


  return (
    <div className="App">
        <div className='main-container' >
            <p>Merhaba Lestonz</p>
            <button onClick={connectToMetaMask} > Cüzdan Bağla</button>
            {accounts.length > 0 ? (
        <p>Bağlı hesap: {accounts[0]}</p>
      ) : (
        <p>Bağlı hesap bulunamadı.</p>
      )}
      <p>Veri: {data}</p>
      <div className="box-container" >
      <button onClick={readData}>Veriyi Oku</button>
    
        <input type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Adrese" />
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Miktar" />
        <button onClick={writeData} type="submit">Veri Yaz</button>
   
      </div>

        </div>
    </div>
  );
}

export default App;
