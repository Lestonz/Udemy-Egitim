import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DexLestonz, DexLestonz__factory, LestonzToken, LestonzToken__factory } from "../typechain-types";

describe("DexLestonz", function() {
  let odulToken: any;
  let dex: any;
  let sahip: any;
  let trader1: any;
  let trader2: any;

  const _zaman:any = 2592000;
  const _odul:any = ethers.utils.parseUnits("387", 15);

  before("Kontrat Basıldı", async function() {
      [sahip, trader1, trader2] = await ethers.getSigners();

      const lestonzTokenFactory:LestonzToken__factory = await ethers.getContractFactory("LestonzToken", sahip);
      odulToken = (await lestonzTokenFactory.deploy()) as LestonzToken;
      await odulToken.deployed();

      const dexFactory:DexLestonz__factory = await ethers.getContractFactory("DexLestonz")
      dex = (await dexFactory.deploy(odulToken.address, _zaman, _odul));
      await dex.deployed()

  })

  it("Odul kontratı basıldı mı?",async () => {
      expect(odulToken.address).to.not.equal(0)
  })

  it("Dex kontratı basıldı mı?", async () => {
    expect(dex.address).to.not.equal(0)
  })

  it("Odul Tokeni bakiyesi doğru mu?",async () => {
     expect(await odulToken.connect(sahip).balanceOf(sahip.address)).to.equal(ethers.utils.parseUnits("5000000", 18)) 
  })

  it("trader 1 için transfer kontrolü",async () => {
    await odulToken.connect(sahip).transfer(trader1.address, ethers.utils.parseUnits("1000", 18))
    expect(await odulToken.balanceOf(trader1.address)).to.equal(ethers.utils.parseUnits("1000", 18))
  })


  it("trader 2 için transfer kontrolü",async () => {
    await odulToken.connect(sahip).transfer(trader2.address, ethers.utils.parseUnits("1000", 18))
    expect(await odulToken.balanceOf(trader2.address)).to.equal(ethers.utils.parseUnits("1000", 18))
  })


  it("Dex için transfer kontrolü",async () => {
    await odulToken.connect(sahip).transfer(dex.address, ethers.utils.parseUnits("10000", 18))
    expect(await odulToken.balanceOf(dex.address)).to.equal(ethers.utils.parseUnits("10000", 18))
  })

  it("Approve verme ", async function() {
    await odulToken.connect(sahip).approve(dex.address,ethers.utils.parseUnits("10000", 18))
    await odulToken.connect(trader1).approve(dex.address,ethers.utils.parseUnits("1000", 18))
    await odulToken.connect(trader2).approve(dex.address,ethers.utils.parseUnits("1000", 18))
  })

  it("Approve kontrol",async () => {
    let allowances = [
      await odulToken.allowance(trader1.address, dex.address),
      await odulToken.allowance(trader2.address, dex.address)
    ]
    expect(allowances[0]).to.be.equal(ethers.utils.parseUnits("1000", 18))
    expect(allowances[0]).to.be.equal(allowances[1]);
  })

  it("Pozisyon Açma",async () => {
    await dex.connect(trader1).pozisyonAc(ethers.utils.parseUnits("250", 18))
    await dex.connect(trader2).pozisyonAc(ethers.utils.parseUnits("200", 18))

    const kumulatifMarketHacmi = await dex.kumulatifMarketHacmi();

    expect(kumulatifMarketHacmi).to.equal(ethers.utils.parseUnits("450", 18))
  })

  it("Pozisyon kapatmak",async () => {
    const kumulatifMarketHacmiOnceki = await dex.kumulatifMarketHacmi();
    const oncekiBakiyeTrader1 = await odulToken.balanceOf(trader1.address)
    const oncekiBakiyeTrader2 = await odulToken.balanceOf(trader2.address)

    await dex.connect(trader1).pozisyonKapat(ethers.utils.parseUnits("50", 18))
    await dex.connect(trader2).pozisyonKapat(ethers.utils.parseUnits("100", 18))

    const kumulatifMarketHacmiSonraki = await dex.kumulatifMarketHacmi();
    const sonrakiBakiyeTrader1 = await odulToken.balanceOf(trader1.address)
    const sonrakikiBakiyeTrader2 = await odulToken.balanceOf(trader2.address)

    expect(kumulatifMarketHacmiOnceki).to.not.equal(kumulatifMarketHacmiSonraki)
    expect(oncekiBakiyeTrader1).to.not.equal(sonrakiBakiyeTrader1)
    expect(oncekiBakiyeTrader2).to.not.equal(sonrakikiBakiyeTrader2)
  })

  it("Odul Talebi", async () => {
    const oncekiBakiyeTrader1 = await odulToken.balanceOf(trader1.address)
    const oncekiBakiyeTrader2 = await odulToken.balanceOf(trader2.address)

    const oncekiOdulTokeniTrader1 = await dex.connect(trader1).totalOdul(trader1.address)
    const oncekiOdulTokeniTrader2 = await dex.connect(trader2).totalOdul(trader2.address)

    const kumulatifMarketHacmiOnceki = await dex.kumulatifMarketHacmi();

    await dex.connect(trader1).odulCekme();
    await dex.connect(trader2).odulCekme();

    const sonrakiBakiyeTrader1 = await odulToken.balanceOf(trader1.address)
    const sonrakiBakiyeTrader2 = await odulToken.balanceOf(trader2.address)

    const sonrakiOdulTokeniTrader1 = await dex.connect(trader1).totalOdul(trader1.address)
    const sonrakiOdulTokeniTrader2 = await dex.connect(trader2).totalOdul(trader2.address)

    const kumulatifMarketHacmiSonraki = await dex.kumulatifMarketHacmi();

    expect(sonrakiBakiyeTrader1).to.not.equal(oncekiBakiyeTrader1)
    expect(sonrakiBakiyeTrader2).to.not.equal(oncekiBakiyeTrader2)

    expect(sonrakiOdulTokeniTrader1).to.not.equal(oncekiOdulTokeniTrader1)
    expect(sonrakiOdulTokeniTrader2).to.not.equal(oncekiOdulTokeniTrader2)
    
    expect(kumulatifMarketHacmiSonraki).to.equal(kumulatifMarketHacmiOnceki)
  })

})
