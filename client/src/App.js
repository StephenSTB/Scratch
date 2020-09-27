import React, { Component } from "react";
import ScratchToken from "./contracts/ScratchToken.json";
import ScratchTokenSale from "./contracts/ScratchTokenSale.json";
import LinkTokenInterface from "./contracts/LinkTokenInterface.json";
import Scratch from "./contracts/Scratch.json";
import ScratchCardRound from "./contracts/ScratchCardRound.json";
import getWeb3 from "./getWeb3";

import Web3 from "web3"

import "./App.css";

import {
  Route,
  HashRouter,
} from "react-router-dom";

import TopBar from "./components/TopBar/TopBar";

import Main from "./components/Main/Main";

import About from "./components/About/About";

import Redeem from "./components/Redeem/Redeem";
//import { networks } from "../../truffle-config";

class App extends Component {
  state = { web3: null, accounts: null, scratchContract: null, scratchTokenContract: null, cardRoundContract: null, linkContract: null, tokenSaleContract: null};

  constructor(){
    super();
    this.updateWeb3 = this.updateWeb3.bind(this);
  }

  updateWeb3 = async () =>{
    if (window.ethereum) {
      const web3  = new Web3(window.ethereum);
        
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = ScratchToken.networks[networkId];
      const tokenInstance = new web3.eth.Contract( ScratchToken.abi, deployedNetwork && deployedNetwork.address,);

      console.log("Scratch Token Address: " + tokenInstance.options.address);

      const linkInstance = new web3.eth.Contract(LinkTokenInterface.abi, "0xa36085F69e2889c224210F603D836748e7dC0088");

      var saleTokenAddress = await tokenInstance.methods.tokenSale.call().call();

      console.log("Token Sale Address: " + saleTokenAddress);

      const saleInstance = new web3.eth.Contract(ScratchTokenSale.abi, saleTokenAddress);

      /*
      var saleOver = await saleInstance.methods.saleOver().call();
      console.log("sale over " + saleOver);
      if(saleOver){
        await tokenInstance.methods.endSale().send({from: accounts[0]});
      }*/
     
      var scratchAddress = await tokenInstance.methods.scratch.call().call();

      console.log("Scratch Address: " + scratchAddress);

      var scratchInstance  = new web3.eth.Contract(Scratch.abi, scratchAddress);

      var cardRoundAddress = await scratchInstance.methods.getCardRound().call();
      console.log("Card Round Address: " + cardRoundAddress);

      var cardRoundInstance = new web3.eth.Contract(ScratchCardRound.abi, cardRoundAddress);
      
      this.setState({ web3, accounts, scratchContract: scratchInstance, cardRoundContract: cardRoundInstance, scratchTokenContract: tokenInstance, linkContract: linkInstance, tokenSaleContract: saleInstance });
      //this.setState({ web3, accounts, scratchTokenContract: tokenInstance, linkContract: linkInstance, tokenSaleContract: saleInstance });

      window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
        window.location.reload();
      })

      
      try{
        await window.ethereum.enable();
      }
      catch(error){
        console.error(error);
      }
    }

  }

  /*
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ScratchToken.networks[networkId];
      const instance = new web3.eth.Contract(
        ScratchToken.abi,
        deployedNetwork && deployedNetwork.address,
      );

      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        window.location.reload();
      })
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });//, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };*/

/*
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };*/



  render() {

    var account = this.state.accounts ?  this.state.accounts[0] : "Connect Account";

    return (
      <div className="App">
        <HashRouter>
         <TopBar {...this.state} updateWeb3 = {this.updateWeb3} account = {account}></TopBar>
         <Route exact path="/" render = {(routeProps)=>(<Main {...routeProps} {...this.state}/>)}/>
         <Route exact path="/About" render = {(routeProps)=>(<About {...routeProps} {...this.state}/>)}/> 
         <Route exact path="/Redeem" render = {(routeProps)=>(<Redeem {...routeProps} {...this.state}/>)}/> 
        </HashRouter> 
        <p id="copyright">&copy; 2020 Scratch</p>
      </div>
    );
  }
}

export default App;
