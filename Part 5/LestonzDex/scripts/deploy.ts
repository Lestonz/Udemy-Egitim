import { ethers } from "hardhat";
import { DexLestonz, DexLestonz__factory, LestonzToken, LestonzToken__factory } from "../typechain-types";


async function main() {
  const _zaman:any = 2592000;
  const _odul:any = ethers.utils.parseUnits("387", 15)

  console.log("Odul Kontratınız basılıyor .....")
  const OdulToken: LestonzToken__factory = await ethers.getContractFactory("LestonzToken")

  const odulToken:any = await OdulToken.deploy() as LestonzToken
  await odulToken.deployed()

  console.log('Odul tokeni kontrat adresi: ', odulToken.address)

  console.log("Dex Kontratınız basılıyor.....")

  const DexLestonz:DexLestonz__factory = await ethers.getContractFactory("DexLestonz")
  const dex:any = await DexLestonz.deploy(odulToken.address, _zaman, _odul) as DexLestonz
  await dex.deployed()

  console.log('DexLestonz kontrat addresi: ', dex.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
