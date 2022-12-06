const Marketplace = artifacts.require("MarketPlace");

module.exports = function (deployer) {
  deployer.deploy(Marketplace, {
    from: "0x95386f0C61d661570765594aBf720322ace827d3",
  });
};
