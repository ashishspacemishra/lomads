const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const tokensPerMatic = 10;

    const LomadsToken = await ethers.getContractFactory("LomadsToken");
    const lomadsToken = await LomadsToken.deploy();
    console.log("Lomads Contract Address:", lomadsToken.address);

    const Vendor = await ethers.getContractFactory("Vendor");
    const vendor = await Vendor.deploy(lomadsToken.address, tokensPerMatic);
    console.log("Vendor Contract Address:", vendor.address);

    const bal = await lomadsToken.balanceOf(deployer.address);
    console.log(bal);

    const res = await lomadsToken.transfer(vendor.address, ethers.utils.parseEther("10000"));   // '100000000000000000000');    // ethers.utils.parseEther("1000"));
    console.log(await lomadsToken.balanceOf(vendor.address));
    console.log(await lomadsToken.balanceOf(deployer.address));
    await vendor.transferOwnership(deployer.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });