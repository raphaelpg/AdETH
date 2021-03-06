const Dai = artifacts.require("Dai");
const AdEthFactory = artifacts.require("AdEthFactory");
const AdEthNFT = artifacts.require("AdEthNFT");

contract("AdEthFactory", (accounts) => {
  let chainId;
  let dai;
  let AdEthFactoryInstance;
  let adEthNFTContractInstance;
  let [adEthFactoryOwner, customer, adCaller, website1, website2, visitor] = accounts;
  let cpc = 10;

  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
    AdEthFactoryInstance = await AdEthFactory.deployed();
    adEthNFTContractInstance = await AdEthNFT.deployed();
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const currentOwner = await AdEthFactoryInstance.owner.call();
      assert.equal(currentOwner, adEthFactoryOwner, "Current owner should be equal to adEthFactoryOwner");
    });
  });

  describe("set new fee", async () => {
    it("can set a new fee value", async () => {
      const newFee = 10;
      const initialFee = await AdEthFactoryInstance.fee.call();
      await AdEthFactoryInstance.setFee(newFee, { from: adEthFactoryOwner });
      const contractFee = await AdEthFactoryInstance.fee.call();

      assert.equal(parseInt(newFee), parseInt(contractFee), "The new fee should be set");
    });
  });

  describe("test createAdEthNFT function", async () => {
    it("can create an AdEthNFT contract and keep the fee percentage", async () => {
      const uri = "https://bafyreie2meg7d5xgtsll2sllrhi4bnhdwcqtamwbebbih3vmgrnoxuuqnu.ipfs.dweb.link/metadata.json"
      const ethAmount = web3.utils.toWei("1", "ether");
      await AdEthFactoryInstance.sendTransaction({ from: adEthFactoryOwner, value: ethAmount})
      const budget = 5000;
      const factoryFee = await AdEthFactoryInstance.fee.call();
      const initialFactoryBalance = await dai.balanceOf(AdEthFactoryInstance.address);
      
      await dai.mint(customer, budget * 2, { from: adEthFactoryOwner });
      
      await dai.approve(AdEthFactoryInstance.address, budget, { from: customer});
      
      await AdEthFactoryInstance.createAdEthNFT(budget, adCaller, uri, 10, { from: customer });

      const newFactoryBalance = await dai.balanceOf(AdEthFactoryInstance.address);
      assert.equal(parseInt(newFactoryBalance), (parseInt(initialFactoryBalance) + (budget * factoryFee / 100)), "Factory erc20 balance should be the remaining fee percentage");
    });

    it("the adCaller address eth balance should not be 0", async () => {
      const ethTankAmount = await AdEthFactoryInstance.ethTank.call();
      const adCallerEthBalance = await web3.eth.getBalance(adCaller);
      assert.equal(adCallerEthBalance, 100000000000000000000 + parseInt(ethTankAmount), "Balance should not be 0");
    });

    it("the AdEthNFT created should have the budget minus fee erc20 balance", async () => {
      const budget = 5000;
      const factoryFee = await AdEthFactoryInstance.fee.call();
      
      await dai.mint(customer, 10000, { from: adEthFactoryOwner });
      
      await dai.approve(AdEthFactoryInstance.address, budget, { from: customer});
      
      await AdEthFactoryInstance.createAdEthNFT(budget, adCaller, "uri", 10, { from: customer });

      const lastId = await AdEthFactoryInstance.idCounter.call();
      const adEthNFTAddress = await AdEthFactoryInstance.AdEthNFTs.call(lastId);
      const adEthNFTBalance = await dai.balanceOf(adEthNFTAddress);
      assert.equal(parseInt(adEthNFTBalance), (budget - (budget * factoryFee / 100)), "The adEthNFT balance should be equal to the budget minus the fee percentage");
    });

    it("the AdEthNFT owner should be the customer", async () => {
      const budget = 5000;
      await dai.mint(customer, 10000, { from: adEthFactoryOwner });
      
      await dai.approve(AdEthFactoryInstance.address, budget, { from: customer});
      
      await AdEthFactoryInstance.createAdEthNFT(budget, adCaller, "uri", 10, { from: customer });

      const lastId = await AdEthFactoryInstance.idCounter.call();
      const adEthNFTAddress = await AdEthFactoryInstance.AdEthNFTs.call(lastId);
      const newAdEthNFTInstance = await AdEthNFT.at(adEthNFTAddress);

      const adEthNFTOwner = await newAdEthNFTInstance.owner.call();
      assert.equal(adEthNFTOwner, customer, "The adEthNFT owner should be the customer");
    });
  });
});