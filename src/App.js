import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner'
import React from 'react'
import Web3 from './web3'
import Config from './Config.json'
import {ethers} from 'ethers'

export default class App extends React.Component{
  constructor(props){
    super(props)
    const web3 = new Web3();
    const {provider,signer} = web3.initWeb3();
    this.state = {
      web3,
      provider,
      signer,
      account: null,
      wallet: null,
      spinner:false
    }
  }

  componentDidMount(){
    this.state.web3.getUserAccount(this.signer)
    .then(account=>{
      this.setState({account})
    })
    .catch(err=>{
      this.metamaskLogin()
    })
    this.state.web3.getWallet(Config.private_key, this.state.provider)
    .then(wallet=>{
      this.setState({wallet})
    })
    .catch(err=>console.log(err))
  }

  metamaskLogin(){
    this.state.web3.metamaskLogin()
    .then(account=>{
      this.setState({account})
    })
  }

  getEth(){
    if(this.state.wallet && this.state.account){
      this.setState({spinner:true})
      const tx = {
        to: this.state.account,
        value: ethers.utils.parseEther("2.0")
      }
      this.state.wallet.sendTransaction(tx)
      .then(()=>this.setState({spinner:false}))
      .catch(()=>this.setState({spinner:false}))
    }
  }

  render(){
    return(
      <div className="container text-center">
        {
          (!this.state.account && <Button variant="primary" className="mx-auto col-6" onClick={this.metamaskLogin.bind(this)}>Login</Button>) || (
          <Stack gap={2}>
          <h3>{this.state.account}</h3>
          {this.state.wallet && 
          ((this.state.spinner && <Spinner animation="border" className="mx-auto" role="status" />) ||
          <Button variant="primary" className="mx-auto col-6" onClick={this.getEth.bind(this)}>Get Eth</Button>)
          }
          </Stack>
          )}
      </div>
    )
  }
}