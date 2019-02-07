function Calculate(){
  var amount = document.getElementById("calculateAmountInput").value*10**8;
  getAmountPromise = uCollateralContract.calculateBounty(amount);
  getAmountPromise.then(function(result){
    result = parseInt(result);
    result = (result+amount)/10**8;
    document.getElementById("UCASHtoReceive").innerHTML = "You will receive " + result.toLocaleString('en', { maximumFractionDigits: 8 }) + " UCASH after 360 seconds";
  })
}

async function contribute(){

  var amountofUCASH = document.getElementById("AmountofUCASH2").value;

  var parsedInt = parseInt(amountofUCASH*10**8);

  //for Signer to transfer x amount of UCASH to be spent by the collateral contract
  await ucashContract.transfer(uCollateralContractAddress,parsedInt);


}

function getOwnedUCASH(_address){
  var getUCASHPromise = ucashContract.balanceOf(_address);
  getUCASHPromise.then(function(value){
    value = value/(10**8);
    document.getElementById("OwnedUCASH").innerHTML = "<b>You Own: </b> " + value.toLocaleString('en', { maximumFractionDigits: 8 }) + " UCASH";
  })
  var getApprovedAmountPromise = ucashContract.allowance(_address,ProxyContributorAddress)
  getApprovedAmountPromise.then(function(value){
    value = value/(10**8);
    document.getElementById("approvedAmount").innerHTML = value + " UCASH is approved for contribution"
  })
}

async function reclaim(){
  // First 4 bytes of the hash of "fee()" for the sighash selector
  let data = ethers.utils.hexDataSlice(ethers.utils.id('reclaim()'), 0, 4);

  let transaction = {
      to: uCollateralContractAddress,
      data: data,
      gasLimit: _ethers.utils.bigNumberify("500000"),
      data: data
  }

  await signer.sendTransaction(transaction);



}

function updateLoanInfo(_address){
  getLoanInfoPromise = uCollateralContract.Loans(_address);
  getLoanInfoPromise.then(function(result){

    amountDeposited = result['totalContribution']/(10**8); //Loans.initialAmount
    totalReward = amountDeposited + result['bounty']/(10**8); //Loans.value
    document.getElementById("amountDeposited").innerHTML = "<B>Amount Deposited: </B>" + amountDeposited.toLocaleString('en', { maximumFractionDigits: 8 }) + " UCASH";
    document.getElementById("totalReward").innerHTML = "<B>You will receive a total of: </B>" + totalReward.toLocaleString('en', { maximumFractionDigits: 8 }) + " after waiting 3 months";
  });

  ifClaimedNowPromise = uCollateralContract.ifClaimedNow(_address);
  ifClaimedNowPromise.then(function(result){

      var claimable = result[0]/(10**8);
      var penalty = result[1]/(10**8);
      document.getElementById("ifClaimedNow").innerHTML = "<B>You can get: </B>" + claimable.toLocaleString('en', { maximumFractionDigits: 8 }) + " UCASH if you claim right now with a penalty of " + penalty.toLocaleString('en', { maximumFractionDigits: 8 }) + " UCASH";
  });


  getTimeLeftPromise = uCollateralContract.secondsLeft(_address);
  getTimeLeftPromise.then(function(result){
      document.getElementById("timeLeft").innerHTML = "<B>Time Left: </B>" +  result + " seconds";
  });

  getLateByPromise = uCollateralContract.isLateBy(_address);
  getLateByPromise.then(function(result){
    document.getElementById("lateBy").innerHTML = "<B>Late By: </B>" + result + " periods. You will be penalized 2.1% of remaining funds per period.";
  })

}

function updateContractInfo(){


  getBountyPoolPromise = uCollateralContract.BountyPool();
  getBountyPoolPromise.then(function(result){
    result = result/(10**8);
    document.getElementById("BountyPool").innerHTML = "<B>Total Bounty Pool Available: </B>" + result.toLocaleString('en', { maximumFractionDigits: 8 })+ " UCASH";
  })

  contractBalancePromise = ucashContract.balanceOf(uCollateralContractAddress);
  contractBalancePromise.then(function(result){
    result = result/(10**8);
    document.getElementById("ContractBalance").innerHTML = "<B>The Collateral Contract has: </B>" + result.toLocaleString('en', { maximumFractionDigits: 8 }) + " UCASH";
  })

  totalAllocatedPromise = uCollateralContract.CalculateAllocatedUcash();
  totalAllocatedPromise.then(function(result){
    result = result/(10**8);
    document.getElementById("TotalUCASHAllocated").innerHTML = "<B>Total amount allocated to collateral providers: </B>" + result.toLocaleString('en', { maximumFractionDigits: 8 })+ " UCASH";
  })

  totalifClaimedNowPromise = uCollateralContract.calculateAllReclaimedNow();
  totalifClaimedNowPromise.then(function(result){
    result = result/(10**8);
    document.getElementById("TotalifClaimedNow").innerHTML = "<B>Total amount that can be reclaimed right now by all collateral providers: </B>" + result.toLocaleString('en', { maximumFractionDigits: 8 })+ " UCASH";
  })

  numLoans = uCollateralContract.numLoans();
  numLoans.then(function(result){
    document.getElementById("numLoans").innerHTML = "<B>Total amount of loans active: </B>" + result;

  })


}



async function approve(){
  var amountofUCASH = document.getElementById("AmountofUCASH").value;

  var parsedInt = parseInt(amountofUCASH*10**8);

  //for Signer to approve use of x amount of UCASH to be spent by the collateral contract
  await ucashContract.approve(ProxyContributorAddress,parsedInt);



}
async function metamaskContribute(){
  //for Signer to contribute all approved UCASH to the contract
  await ProxyContributorContract.contribute();
}




  function dispenseUCASH(){
    var dispensePromise = ucashFaucetContract.dispenseUCASH();
    dispensePromise.then(function(result){
        alert("You have been sent UCASH! TESTUCASH contract address: 0xbD52C5265B94f727f0616f831b011c17e1f235A2")
    }).catch(function(err){
      alert("You can only get UCASH every 24 hours. TESTUCASH contract address: 0xbD52C5265B94f727f0616f831b011c17e1f235A2")
    });
  }

  async function dispenseETH(){
    let provider = ethers.getDefaultProvider('rinkeby');

    let _nonce = await provider.getTransactionCount(wallet.address);
    let transaction = {

        gasLimit: 21000,
        gasPrice: _ethers.utils.bigNumberify("8000000000"),
        to: signer._address,
        value: _ethers.utils.parseEther("0.21"),
        chainId: ethers.utils.getNetwork('rinkeby').chainId,
        nonce: _nonce
          }

    let signedTransaction = await wallet.sign(transaction)

    console.log(signedTransaction);


    await provider.sendTransaction(signedTransaction);

    alert("You have been sent 0.21 Eth. Please wait a minute.")

  }

  function recirculateLateFees(){
    var recirculatePromise = uCollateralContract.recirculateLateFees(100);
    recirculatePromise.then(function(result){
      console.log("All late fees have been circulated.")
    })
  }

  async function addFunds(){
    let fundsToAdd = document.getElementById("addFundsInput").value;
    await uCollateralContract.addFunds(fundsToAdd);
  }

  async function removeFunds(){
    let fundsToRemove = document.getElementById("removeFundsInput").value;
    await uCollateralContract.addFunds(fundsToRemove);
  }

  async function kill(){
    await uCollateralContract.killswitch();
  }
