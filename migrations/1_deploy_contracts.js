// Import smart contract "Voting"
const Voting = artifacts.require("Voting");

module.exports = async (deployer) => {
 // Deploy smart contract !
 deployer.deploy(Voting);
}