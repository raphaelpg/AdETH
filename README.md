# AdETH

## Idea:  
AdEth is a project made during ETH Global Web3 Weekend Hackathon, the purpose is to onboard advertising industry into web3 allowing partnership through NFTs.  
The project allows companies to generate an NFT that can be displayed on websites as an ad.  
During the minting process, the company must provide a budget in stablecoin which is added to the NFT, each time a user clics on the ad, the website is rewarded by a portion of the budget.  
AdEth will take a fee on the NFT creation and/or on each click.  
Made in 48h, the contracts are deployed on Polygon testnet (Mumbai) and the NFTs are stored on Filecoin thanks to "NFT Storage" tool.  
Solo project.  

Hackathon presentation [here](https://github.com/raphaelpg/AdETH/blob/main/pres/AdEth.pdf)  


## Process:  

### Minting:  
On the web app, the company provides the NFT datas.  
They will be ask to sign two transactions: one to approve AdEth Factory contract and the second to mint the NFT.  
Companies need to have the DAI amount on their address balance.  
The budget will be transferred from the company address to AdEth Factory address.  

### Whitelisting:  
After minting, the NFT address is provided as well as a KEY.  
The company will have to share them with partner websites who wants to display the NFT.  
Once the company wants to partner with a website, it needs to whitelist the website address on their NFT so the website can receive the rewards.  

### Integration:  
The website has to display the NFT providing the NFT address, the company KEY and their address into AdEth library.  
The NFT comes with an address that will sign the transaction so the process it not visible for the visitor. 
The UX is the same as a regular ad on web2.  


## Behind the scenes:  
This project requires a very low fee transaction network to be reliable, like Matic/Polygon.  
The AdNFT is not a real erc721 but a more complex smart contract that stores a NFT uri string.  
They are two contracts: the Fabric contract that host the "mint NFT" function and the adNFT contract that is the NFT template.  
This adNFT contains:  
- the uri string  
- an onClick function  
- a list of whitelisted addresses  

The uri contains the data of the NFT that are stored on Filecoin thanks to NFT Storage.  

Because the network transaction fees are so low on Polygon, it allow the use of temporary address/key pairs that are created and funded during the NFT minting process.  
The address is stored in the NFT contract and the private key is actually the key provided to the company and shared with the websites.  
When visitors click on the ad/NFT, it executes a function signed and send by the temp address with the private key.  
Only this address is allow to execute the NFT reward function.  
During the minting process, the AdEth Factory contract sent a few amount of native token to that address allowing it to sign thousands of transactions.  
That is the trick of this process.  


## Structure:  
* The contracts: AdEth factory contract that creates sub NFTs contracts.  
* The app allowing companies to mint an NFT.  
* A mock website that will host the newly NFT minted.  


## Built With  

* [Truffle](https://www.trufflesuite.com/docs/truffle/overview) - A world class development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM) - v5.3.4  
* [Solidity](https://docs.soliditylang.org/en/develop/index.html) - Solidity is an object-oriented, high-level language for implementing smart contracts - v0.8.4  
* [web3.js](https://web3js.readthedocs.io/en/v1.3.4/) - web3.js is a collection of libraries that allow you to interact with a local or remote ethereum node using HTTP, IPC or WebSocket - v1.3.6
* [@openzeppelin/test-helpers](https://www.npmjs.com/package/@openzeppelin/test-helpers) - Assertion library for Ethereum smart contract testing - v0.5.11  
* [bignumber.js](https://www.npmjs.com/package/bignumber.js) - A JavaScript library for arbitrary-precision decimal and non-decimal arithmetic - v9.0.1    
* [NFT storage](https://nft.storage/) - Free decentralized storage and bandwidth for NFTs on IPFS and Filecoin. - v1.4.0    
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces - v16.11.0    


## Authors

* **Raphael Pinto Gregorio** - https://github.com/raphaelpg/


## License

[MIT](LICENSE)