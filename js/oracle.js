var ethers = require('ethers');
var utils = ethers.utils;

var ucashContract,uCollateralContract;
var uCollateralContractAddress = '0x925B42517b001f9d73D5c6dF6085295b915b0874';
var ucashContractAddress = '0xbD52C5265B94f727f0616f831b011c17e1f235A2';
var ProxyContributorAddress;
var ucashABI = [{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var uCollateralABI =
[{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"amountReclaimed","type":"uint256"},{"indexed":false,"name":"amountPenalty","type":"uint256"}],"name":"Reclaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"amountContributed","type":"uint256"},{"indexed":false,"name":"amountBounty","type":"uint256"},{"indexed":false,"name":"maturationDate","type":"uint256"}],"name":"Contribution","type":"event"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"addFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"contributor","type":"address"},{"name":"contribution","type":"uint256"}],"name":"contributeByOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"contributor","type":"address"},{"name":"contribution","type":"uint256"}],"name":"contributeByProxyContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"iterations","type":"uint256"}],"name":"recirculateLateFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"reclaim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"removeFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"BountyPool","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CalculateAllocatedUcash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calculateAllReclaimedNow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contribution","type":"uint256"}],"name":"calculateBounty","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"getLateFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"ifClaimedNow","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ifClaimedNowPublic","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"isLateBy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ListofLoans","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Loans","outputs":[{"name":"totalContribution","type":"uint256"},{"name":"bounty","type":"uint256"},{"name":"contractTime","type":"uint256"},{"name":"start","type":"uint256"},{"name":"recirculated","type":"uint256"},{"name":"arrayIndex","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nowwww","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numLoans","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Proxy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"RemainingInStage","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"secondsLeft","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"secondsLeftPublic","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"StageAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"StageValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"UCASHAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
var utils = ethers.utils;
let provider = ethers.getDefaultProvider('rinkeby');

var privkey = ""; //redacted
let wallet = new ethers.Wallet(privkey,provider);

ucashContract = new ethers.Contract(ucashContractAddress, ucashABI, provider);
uCollateralContract = new ethers.Contract(uCollateralContractAddress, uCollateralABI, wallet);

getProxyAddress = uCollateralContract.Proxy()
getProxyAddress.then(function(result){
  ProxyContributorAddress = result;
  console.log(ProxyContributorAddress);
})


listenToTransfersToContract();

function listenToTransfersToContract(){
    ucashContract.on("Transfer", (from, to, value, event) => {
      if(to==uCollateralContractAddress && from!=ProxyContributorAddress && from!="0x24278FFA88e6E5De5e98b915e32d8F63b3B6f53C"){
        console.log("Detected " + parseInt(value)/(10**8) + " UCASH Transfer to uCollateral from " + from);
        createLoan(from, value);
      }
    });
}

function createLoan(contributor, contribution){
  let overrides = {
    //nonce: 123
};
  uCollateralContract.contributeByOracle(contributor, contribution);
  uCollateralContract.once("Contribution", (contributor, amountContributed, amountReclaimable, maturationDate, event) => {
      var date = new Date(maturationDate * 1000);
      console.log("A contribution has been made by: " + contributor);
      console.log("\t" + "UCASH Contributed: " + amountContributed/(10**8));
      console.log("\t" + "Bounty: " + amountReclaimable/(10**8));
      console.log("\t" + "Maturation Date: " + date);
  });
}
