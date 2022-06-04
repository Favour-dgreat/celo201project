const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GtasNFT", function () {
  this.timeout(50000);

  let gtasNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const GtasNFT = await ethers.getContractFactory("GTASNFT");
    [owner, acc1, acc2] = await ethers.getSigners();

    gtasNFT = await GtasNFT.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await gtasNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    // expect(await gtasNFT.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";
    const price = ethers.utils.parseUnits("1", "ether");
    await gtasNFT.connect(owner).safeMint(tokenURI, price);
    await gtasNFT;

    // expect(await gtasNFT.balanceOf(acc1.address)).to.equal(1);
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    const price = ethers.utils.parseUnits("1", "ether");

    const tx1 = await gtasNFT
      .connect(owner)
      .safeMint(tokenURI_1, price);
    await tx1.wait();
    const tx2 = await gtasNFT
      .connect(owner)
      .safeMint(tokenURI_2, price);
    await tx2.wait();

    expect(await gtasNFT.tokenURI(0)).to.equal(tokenURI_1);
    expect(await gtasNFT.tokenURI(1)).to.equal(tokenURI_2);
  });
  it("Should buy and transfer the NFT", async function(){
    const price = ethers.utils.parseUnits("1", "ether");
    await gtasNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await gtasNFT
    .connect(acc1)
    .buyImage(0, {value: price});
    await gtasNFT.connect(acc1).makeTransfer(acc1.address, owner.address,0);
    const _owner = await gtasNFT.ownerOf(0);
    console.log(_owner, owner.address);
    await gtasNFT.connect(owner).sellImage(0)  
  })
  it("Should sell the nft", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await gtasNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await gtasNFT
    .connect(acc1)
    .buyImage( 0, {value: price});
    await gtasNFT.connect(acc1).sellImage(0)
  })
  it("Should get the nft", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await gtasNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await gtasNFT
    .connect(acc1)
    .getImage(0);
  })
});
