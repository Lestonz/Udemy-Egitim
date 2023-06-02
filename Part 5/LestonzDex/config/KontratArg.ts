import { ethers } from "hardhat";

const OdulAdresi:any = "0xBA0969B3892A26a078f864B831E96e62147eddC2"
const _zaman:any = 2592000;
const _odul:any = ethers.utils.parseUnits("387", 15);

const KontratArg = [
    OdulAdresi,
    _zaman,
    _odul
]

export default KontratArg;