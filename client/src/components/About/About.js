import React, { Component} from "react";

import "./About.css";

class About extends Component{

    state = {unclaimedPrizes: [[39600, 12000, 4000, 1500, 120, 40, 2], ['0','0','0','0','0','0','0']], cardPrice: '0'}
    constructor(props){
        super();
        this.props = props;
        setInterval(() => {
            this.updateCardInfo();
        },10000);
    }

    componentDidMount = async () => {
        if(this.props.web3 !== null){
            var cardRound = this.props.cardRoundContract;
            var transactionResult =  await cardRound.methods.unclaimedPrizes().call();
            var i;
            for( i = 0; i < 7; i++){
                transactionResult[1][i] = this.props.web3.utils.fromWei(transactionResult[1][i]);
            }
            var cardPriceResult = await cardRound.methods.getCardPrice().call();
            this.setState({unclaimedPrizes: transactionResult});
        }
    }

    updateCardInfo = async() =>{
        if(this.props.web3 !== null){
            var cardRound = this.props.cardRoundContract;
            var transactionResult =  await cardRound.methods.unclaimedPrizes().call();
            var i;
            for( i = 0; i < 7; i++){
                transactionResult[1][i] = this.props.web3.utils.fromWei(transactionResult[1][i]);
            }
            
            var cardPriceResult = await cardRound.methods.getCardPrice().call();
            cardPriceResult = this.props.web3.utils.fromWei(cardPriceResult);
            this.setState({unclaimedPrizes: transactionResult, cardPrice: cardPriceResult});
        }
    }

    render(){
        return(
            <div className="About">
                <div id="ScratchDesc">
                    <p id="MainP">Scratch is a scratch card game powered by <p id="vrf"> Chainlink VRF</p> for provably fair random number generation.</p>
                    <br/>
                    <p id="RoundText">Current Card Round Stats.</p>
                    <table>
                        <tr>
                            <td>
                                Winning Tickets 
                            </td>
                            <td>
                                Win Base
                            </td>
                            <td>
                                Pay
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][0]} of 39000
                            </td>
                            <td>
                                .5x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][0]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][1]} of 12000 
                            </td>
                            <td>
                                1x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][1]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][2]} of 4000
                            </td>
                            <td>
                                2x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][2]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][3]} of 1500
                            </td>
                            <td>
                                10x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][3]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][4]} of 120
                            </td>
                            <td>
                                30x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][4]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][5]} of 40
                            </td>
                            <td>
                                100x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][5]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.unclaimedPrizes[0][6]} of 2
                            </td>
                            <td>
                                5000x
                            </td>
                            <td>
                                {this.state.unclaimedPrizes[1][6]}
                            </td>
                        </tr>
                    </table>
                    <p id="cardProbText"> Probability of a winning card 1:4.365</p>
                    <h3 id="cardPrice">Current card price: {this.state.cardPrice}</h3>
                    <p id="distribution"> 60% of the link collected by the contract each round is distributed to the participants.
                    <p> 28.96% of the link collected by the contract each round is utilized for the next rounds prize pool.</p>
                    <p> 11.04% of the link collected by the contract each round remains in the contract for future rounds.</p></p>
                
                </div>
            </div>
        )
    }
}

export default About;