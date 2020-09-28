import React, { Component } from "react";

import {
  NavLink,
} from "react-router-dom";

import "./TopBar.css";

 
class TopBar extends Component{


    constructor(props){
      super();
      this.props = props;
    }
    
    render(){
      return(
        <div className = "NavBar">
              <NavLink to = "/" id = "ScratchName"> <h2>Scratch</h2></NavLink> 
              <div id = "links">
                <NavLink to = "/About" id = "about">About</NavLink>
                <NavLink to = "/Redeem" id = "redeem">Redeem</NavLink>
              </div>
              <div className="accountBox" title={this.props.account} onClick={this.props.updateWeb3}><p id ="account">{this.props.account}</p></div>
        </div>
      );
    }
}

export default TopBar;