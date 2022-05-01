const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // const Token = await ethers.getContractFactory("Token");
    // const token = await Token.deploy();
    // console.log("Token address:", token.address);

    // const tokensPerMatic = 10;

    const LomadsToken = await ethers.getContractFactory("LomadsToken");
    const lomadsToken = await LomadsToken.deploy();
    console.log("Lomads Token address:", lomadsToken.address);

    const Vendor = await ethers.getContractFactory("Vendor");
    const vendor = await Vendor.deploy(lomadsToken.address);
    console.log("Vendor address:", vendor.address);

    const bal = await lomadsToken.balanceOf(deployer.address);
    console.log(bal);

    const res = await lomadsToken.transfer(vendor.address, '100000000000000000000');    // ethers.utils.parseEther("1000"));
    console.log(await lomadsToken.balanceOf(vendor.address));
    console.log(await lomadsToken.balanceOf(deployer.address));
    // await vendor.transferOwnership(deployer.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });