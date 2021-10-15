

import { ethers } from 'ethers'

export default class Web3{

    initWeb3(){
        //get provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        provider.on("network", (_, oldNetwork) => {
            if (oldNetwork) {
                //reload on network change
                window.location.reload();
            }
        });
        const signer = provider ? provider.getSigner() : null;
        return {provider, signer}
    }

    metamaskLogin(){
        return new Promise((resolve,reject)=>{
            //prompt user to login to metamask
            if(window.ethereum){
                window.ethereum.request({method:"eth_requestAccounts"})
                .then((accounts)=>{
                    if(accounts.length > 0){
                        resolve(accounts[0])
                    }else{
                        reject("No accounts found from eth_requestAccounts")
                    }
                })
                .catch(err=>reject(err))
            }
        })
    }

    getUserAccount(signer){
        return new Promise((resolve,reject)=>{
            //get account from signer if they are logged in already
            if(signer){
                signer.getAddress()
                .then(addr=>resolve(addr))
                .catch(err=>reject("user not logged in"))
            }else{
                reject("signer is null")
            }
        })
        
    }

    getContract(provider, address, abi){
        //create contract from given address and abi
        return new Promise((resolve,reject)=>{
          if(provider){
                try{
                    const contract = new ethers.Contract(address, abi, provider)
                    resolve(contract)
                }catch(err){
                    reject(err)
                }
          }else{
            reject("web3.getContract provider not set")
          }
        })
    }

    getWallet(privateKey, provider){
        return new Promise((resolve,reject)=>{
            try{
                const wallet = new ethers.Wallet(privateKey, provider);
                resolve(wallet)
            }catch(err){
                reject(err)
            }
        })

    }

}