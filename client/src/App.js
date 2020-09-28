import React, { Component } from "react";
import ScratchToken from "./contracts/ScratchToken.json";
import ScratchTokenSale from "./contracts/ScratchTokenSale.json";
import LinkTokenInterface from "./contracts/LinkTokenInterface.json";
import Scratch from "./contracts/Scratch.json";
import ScratchCardRound from "./contracts/ScratchCardRound.json";

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

      var scratchAddress = await tokenInstance.methods.scratch.call().call();

      console.log("Scratch Address: " + scratchAddress);

      var scratchInstance  = new web3.eth.Contract(Scratch.abi, scratchAddress);

      var cardRoundAddress = await scratchInstance.methods.getCardRound().call();
      console.log("Card Round Address: " + cardRoundAddress);

      var cardRoundInstance = new web3.eth.Contract(ScratchCardRound.abi, cardRoundAddress);
      
      this.setState({ web3, accounts, scratchContract: scratchInstance, cardRoundContract: cardRoundInstance, scratchTokenContract: tokenInstance, linkContract: linkInstance, tokenSaleContract: saleInstance });

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
