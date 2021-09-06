import {useState} from 'react';
import {ethers} from 'ethers';
import './App.css';
//import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'
const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"

function App() {
  const [greeting, setGreetingValue] = useState()
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()
  const [pod, setPod] = useState()
  //spaja se na Metamsk wallet od korisnika kada se odvija transakcija
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
 
  //poziva se pametni ugovor koji čita trenutni value
  async function fetchGreeting() { 
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)   
        setPod(data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }   
  }
  
  //poziva pametni ugovor i radi update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  function ascii_to_hex(str)
  {
    var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++)      {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push("0x" + hex);
     }
    return arr1.join(' ')
   }

  var data="AB";
  return (
    
    <div className="App">
      <header className="App-header">
         
        <button onClick={fetchGreeting} value="greeting"  >Fetch dog</button>
        <button onClick={setGreeting}>Click to encode from ASCII to Hex character</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Enter to encode"  value={greeting}/>
          <p> vvvv {pod} </p>
          <p> {greeting} </p>

           
          <p>Hex record:  {ascii_to_hex(pod)} </p>
        <br />
         
      
      </header>
    </div>
  );
}

export default App;
/* 
 <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />

*/