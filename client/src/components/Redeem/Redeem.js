import React, { Component} from "react";

import "./Redeem.css";

class Redeem extends Component{

    state = {CurrentRound: '0', PlayerRound: '0'}
    constructor(props){
        super();
        this.props = props;
        setInterval(() => {
            this.cardRound();
        },10000);
    }

    cardRound = async () =>{
        if(this.props.web3 !== null){
            var currentRound = await this.props.scratchContract.methods.RoundNumber.call().call();
            console.log(currentRound);
            var playerRound = await this.props.scratchContract.methods.getPlayerRound(this.props.accounts[0]).call();
            console.log(playerRound);
            this.setState({CurrentRound: currentRound, PlayerRound: playerRound})
        }
    }

    RedeemDiv = async () =>{
        if(this.props.web3 !== null){
            var currentRound = await this.props.scratchContract.methods.RoundNumber.call().call();
            console.log(currentRound);
            var playerRound = await this.props.scratchContract.methods.getPlayerRound(this.props.accounts[0]).call();
            console.log(playerRound);
            if(currentRound > playerRound && playerRound){
                var redeemTransaction = await this.props.scratchContract.methods.receiveDividend().send({from: this.props.accounts[0]});
            }
        }
    }

    render(){
        return(
            <div className="Redeem">
                <p id = "TopText">Redeem Round dividends</p>
                <p id="cRound">Current Round: {this.state.CurrentRound}</p>
                <p id="pRound">Player Round: {this.state.PlayerRound}</p>
                <div id="RedeemBtn" onClick={this.RedeemDiv}>Redeem</div>
            </div>
        )
    }
}

export default Redeem;