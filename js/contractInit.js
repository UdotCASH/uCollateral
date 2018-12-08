

var ucashContract,uCollateralContract,ucashFaucetContract,ProxyContributorContract;
var uCollateralContractAddress = '0x8287171bcC085aACfBe57637fb2bb3E91402BDF0';
var ucashContractAddress = '0xbd52c5265b94f727f0616f831b011c17e1f235a2';
var ucashFaucetAddress = '0x2Ab14D282D7D72603582256fd4b629f34Fb1FAA8';
var ProxyContributorAddress;
var ucashABI = [{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var uCollateralABI = [{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"amountReclaimed","type":"uint256"},{"indexed":false,"name":"amountPenalty","type":"uint256"}],"name":"Reclaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"amountContributed","type":"uint256"},{"indexed":false,"name":"amountBounty","type":"uint256"},{"indexed":false,"name":"maturationDate","type":"uint256"}],"name":"Contribution","type":"event"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"addFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"contributor","type":"address"},{"name":"contribution","type":"uint256"}],"name":"contributeByOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"contributor","type":"address"},{"name":"contribution","type":"uint256"}],"name":"contributeByProxyContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"iterations","type":"uint256"}],"name":"recirculateLateFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"reclaim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"removeFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"BountyPool","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CalculateAllocatedUcash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calculateAllReclaimedNow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contribution","type":"uint256"}],"name":"calculateBounty","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"getLateFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"ifClaimedNow","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ifClaimedNowPublic","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"isLateBy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ListofLoans","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Loans","outputs":[{"name":"totalContribution","type":"uint256"},{"name":"bounty","type":"uint256"},{"name":"contractTime","type":"uint256"},{"name":"start","type":"uint256"},{"name":"recirculated","type":"uint256"},{"name":"arrayIndex","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nowwww","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numLoans","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Proxy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"RemainingInStage","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contributor","type":"address"}],"name":"secondsLeft","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"secondsLeftPublic","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"StageAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"StageValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"UCASHAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
var ucashFaucetABI =
[{"constant":false,"inputs":[],"name":"dispenseUCASH","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastDispensed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
var ProxyContributorABI = [{"constant":false,"inputs":[],"name":"contribute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var signer;
var provider;
var privkey = "0x484b5098bf87bfb72cfc79bd36d789aeb143fed0256f9e7dd6b4a4b73d818403"
let wallet = new ethers.Wallet(privkey);


function initialize(_ethers, accounts){
  provider = new _ethers.providers.Web3Provider(web3.currentProvider,'rinkeby');

  signer = provider.getSigner(accounts[0]);
  var _address;

console.log(signer._address);
  if(signer._address>0){
    ucashContract = new _ethers.Contract(ucashContractAddress, ucashABI, signer);
    uCollateralContract = new _ethers.Contract(uCollateralContractAddress,uCollateralABI,signer);
    ucashFaucetContract = new _ethers.Contract(ucashFaucetAddress,ucashFaucetABI,signer);

    let getProxyAddressPromise = uCollateralContract.Proxy();
    getProxyAddressPromise.then(function(result){
      ProxyContributorAddress = result;
      ProxyContributorContract = new ethers.Contract(ProxyContributorAddress,ProxyContributorABI,signer)
    });
  }else{
    ucashContract = new _ethers.Contract(ucashContractAddress, ucashABI, provider);
    uCollateralContract = new _ethers.Contract(uCollateralContractAddress,uCollateralABI,provider);
    ucashFaucetContract = new _ethers.Contract(ucashFaucetAddress,ucashFaucetABI,provider);

    console.log(ucollateralcontract);
    let getProxyAddressPromise = uCollateralContract.Proxy();
    getProxyAddressPromise.then(function(result){
      ProxyContributorAddress = result;
      ProxyContributorContract = new ethers.Contract(ProxyContributorAddress,ProxyContributorABI,provider)
    });
  };



  document.getElementById("ContractAddressLabel").innerHTML = "<span><B>Ucollateral Contract Address: </b><a href='https://etherscan.io/address/"+uCollateralContractAddress+"'>" +uCollateralContractAddress+ "</a></span>";
  document.getElementById("UCASHAddressLabel").innerHTML = "<span><B>UCASH Contract Address: </b><a href='https://etherscan.io/address/"+ucashContractAddress+"'>" +ucashContractAddress+ "</a></span>";


console.log(ucashContract);

}
