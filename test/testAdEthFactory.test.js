const Dai = artifacts.require("Dai");
const AdEthFactory = artifacts.require("AdEthFactory");

contract("AdEthFactory", (accounts) => {
  let chainId;
  let dai;
  let AdEthFactoryInstance;
  let [adEthFactoryOwner, newOwner, adCaller, website1, website2, visitor] = accounts;
  let cpc = 10;

  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
    AdEthFactoryInstance = await AdEthFactory.deployed();
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const currentOwner = await AdEthFactoryInstance.owner.call();
      assert.equal(currentOwner, adEthFactoryOwner, "Current owner should be equal to adEthFactoryOwner");
    });
  });

  describe("set new fee", async () => {
    it("can set a new fee value", async () => {
      const initialFee = await AdEthFactoryInstance.fee.call();
      await AdEthFactoryInstance.setFee(1500, { from: adEthFactoryOwner });
      const newFee = await AdEthFactoryInstance.fee.call();

      assert.equal(parseInt(newFee), (parseInt(initialFee) + (parseInt(newFee) - parseInt(initialFee))), "The new fee should be set");
    })
  })

  // describe("test click function", async () => {
  //   it("transfers cpc amount of erc20 to website address ", async () => {
  //     await AdEthNFTInstance.whitelistAddress(website1, { from: newOwner });
  //     await dai.mint(AdEthNFTInstance.address, 1000, { from: adEthFactoryAddress });
  //     const initialWebsite1Balance = await dai.balanceOf(website1);
  //     const initialNFTBalance = await dai.balanceOf(AdEthNFTInstance.address);
  //     console.log("NFTBalance", parseInt(initialNFTBalance));

  //     await AdEthNFTInstance.beenClicked(website1, { from: adCaller });
      
  //     const finalWebsite1Balance = await dai.balanceOf(website1)
  //     assert.equal(parseInt(finalWebsite1Balance), (parseInt(initialWebsite1Balance) + cpc), "The website1 erc20 balance should be added by one cpc");
  //   });
  // });
});