// eslint-disable-next-line no-undef
const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
    await deployer.deploy(Voting);
};
