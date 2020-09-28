import React, { Component} from "react";

import "./Main.css";

import questionLogo from "../../logos/ScratchCard/QuestionLogoLINK.png";
import xLogo from "../../logos/ScratchCard/xImage.png";

import scratchLogo from "../../logos/Logo/ScratchLogo.png";

import Canvas from "./Canvas.js";

var MainVar;

class Main extends Component{

    state = {account: null, cardImages:[questionLogo, questionLogo, questionLogo, questionLogo, questionLogo, questionLogo, questionLogo], 
             winThreshold: [197388, 232338, 244388, 248338, 249858, 249958, 249998, 250000],
             transactionMessage: 'Waiting for Transaction...',
             scratchTokens: '0'};

    constructor(props){
        super();
        this.props = props;
        MainVar = this;
        setInterval(() => {
            this.getTokens();
        }, 10000);
    }

    getTokens = async () =>{
        if(this.props.web3 !== null){
            var tokens = await this.props.scratchTokenContract.methods.balanceOf(this.props.accounts[0]).call();
            tokens = this.props.web3.utils.fromWei(tokens);
            //console.log("tokens: " + tokens);
            this.setState({scratchTokens: tokens});
        }
    }
    
    buyCard = async () =>{
        if(this.props.web3 !== null){
            var web3 = this.props.web3;
            var scratch = this.props.scratchContract;
            var cardRound = this.props.cardRoundContract;
            var link = this.props.linkContract;

            this.setState({transactionMessage: 'Approving Link to be used...'});

            console.log("approve link of " + web3.utils.toWei('.2', 'ether') + " to " + scratch.options.address);
            await link.methods.approve(scratch.options.address, web3.utils.toWei('.2', 'ether')).send({from: this.props.accounts[0]});

            // Approve link to be used for the transaction.
            await link.methods.allowance(this.props.accounts[0], scratch.options.address).call().then(function(result){
                console.log("allowance " + result)
            });

            this.setState({transactionMessage: 'Buying Scratch Card...'});
            // Buy card with approved link.
            var transaction = await scratch.methods.buyScatchCard(100000000).send({from: this.props.accounts[0]});

            var RequestID = transaction.events.RequestID.returnValues.requestId;

            console.log("RequestID: " + RequestID);



            var number;

            cardRound.events.PrizeClaim({fromBlock: transaction.blockNumber, toBlock: 'latest'}).on('data',function(event){
                if(event.returnValues.requestId === RequestID){
                    number = event.returnValues.number;
                    console.log(number);
                    MainVar.modifyCard(number);
                    MainVar.setState({transactionMessage:'Time to Scratch!'});
                }
            });

        }
        else{
            console.log("web3 was null");
        }  
    }

    modifyCard(number){
        console.log("Modify card " + number);

        var images = [xLogo, xLogo, xLogo, xLogo, xLogo, xLogo, xLogo];

        // Scratch Card Image manipulation.
        if(number < 197388){
            this.setState({cardImages: images});
            return;
        }
        var i = 0;
        for(i; i < 7; i++){
            if(number >= this.state.winThreshold[i] && number < this.state.winThreshold[i+1])
            {
                var winCount = 0;
                while(winCount < i+1){
                    var winIndex = Math.floor(Math.random() * 7);
                    if(images[winIndex] === scratchLogo){
                        continue;
                    }
                    console.log(winIndex);
                    images[winIndex] = scratchLogo;
                    winCount++;
                }
                this.setState({cardImages: images});
            }
        }
    }
    
    
    render(){
        return(
            <div className="Main">
                <div className = "Greeting"><p id="greetStart">Buy a card and</p><h4 id="greetScratch">scratch</h4>  <p id="greetEnd">the boxes to reveal a prize.</p></div>
                <div id ="ScratchSlots">
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[0]}/></div>
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[1]}/></div>
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[2]}/></div>
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[3]}/></div>
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[4]}/></div>
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[5]}/></div>
                    <div id="slot"><img id="slotImage" alt="" src={this.state.cardImages[6]}/></div>
                    <Canvas />
                </div>
                <div className="BuyCard">
                    <div id="buyButton" onClick = {this.buyCard}><p id="buyText">Buy Card</p></div>
                    <div id="transactionMessage">{this.state.transactionMessage}</div>

                    <div id="tokensText">Scratch Tokens: {this.state.scratchTokens}</div>
                </div>
            </div>
        ) 
    }
    
}

export default Main;