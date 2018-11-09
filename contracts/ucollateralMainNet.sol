pragma solidity ^0.4.24;

//TODO:
//
//test - contributions, reclaims, fallback function, multiple loans
//do we need a true start time?
// allow people to contribute more than 99 million on the app

contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ProxyContributor{

    UCOLLATERAL U;

    address public UCASHAddress;

    constructor (address _UCASHAddress) public{
        U = UCOLLATERAL(msg.sender);
        UCASHAddress = _UCASHAddress;
    }

    function contribute() public {
        uint allowedAmount = ERC20(UCASHAddress).allowance(msg.sender,this);
        ERC20(UCASHAddress).transferFrom(msg.sender,this,allowedAmount);
        ERC20(UCASHAddress).transfer(U,allowedAmount);

        U.contributeByProxyContract(msg.sender,allowedAmount);

    }
}

contract UCOLLATERAL {
    uint public StageAmount = 1*10**6*10**8;  //Amount of UCASH in each stage
    uint public RemainingInStage = StageAmount; //Amount remaining in current stage
    uint BPNumerator = 5; // Bounty Percentage Numerator
    uint BPDenominator = 100; // Bounty Percentage Denominator
    uint public StageValue = BPNumerator*BountyPool/BPDenominator;  // Total value allocated to current Stage
    uint public BountyPool; //Total UCASH available in the Bounty Pool

    uint periods = 26;              //how many periods this loan lasts
    uint period = 1 weeks;       //period length

    uint minContribution = 10000*10**8;
    uint maxContribution = 100000*10**8;

    uint specialReclaimValue = 110000; //Special Value to send contract, that triggers reclaim of loan. currently 0.0011 UCASH or 110000 wei

    uint recirculationIndex; //Index to keep track of which loans have been auto reclaimed. For lateFeesToBountyPool function. Loops back to 0 when it reaches the end of ListofLoans

    address public UCASHAddress;
    uint decimals = 8;

    address public owner;
    ProxyContributor P;
    address public Proxy;


modifier onlyOwner()
    {
        require(msg.sender==owner);
        _;
    }

    event Contribution(address contributor, uint amountContributed, uint amountBounty, uint maturationDate);
    event Reclaimed(address contributor, uint amountReclaimed, uint amountPenalty);

struct Loan {
    uint activeContribution;
    uint bounty;
    uint contractTime;
    uint start;
    uint recirculated;
    uint arrayIndex;
    uint inactiveContribution;
}

mapping(address=>Loan) public Loans;
address[] public ListofLoans;

constructor() public {
    CalculateStageValue();
    owner = msg.sender;
    UCASHAddress = 0x92e52a1A235d9A103D970901066CE910AAceFD37;

    P = new ProxyContributor(UCASHAddress);
    Proxy = P;
}

//Reclaim your loan by sending a transaction
function() public payable{
    if(loanMatured(msg.sender) || msg.value == specialReclaimValue){
        reclaimInternal(msg.sender);
    }
}

function contributeByProxyContract(address contributor, uint contribution) public {
    require(msg.sender==Proxy);
    contributeInternal(contributor,contribution);
}

//oracle calls this function everytime a UCASH transfer is made to the contract address
function contributeByOracle(address contributor, uint contribution) public onlyOwner{
    contributeInternal(contributor,contribution);
}

function contributeInternal(address contributor, uint contribution) internal returns(bool){
    if (loanMatured(contributor) || contribution == specialReclaimValue){
        reclaimInternal(contributor);
    }

    Loan memory memLoan = Loans[contributor];

    uint totalContributed = contribution + memLoan.inactiveContribution + memLoan.activeContribution;

    if((totalContributed)<minContribution){
        memLoan.inactiveContribution = totalContributed;
        return false;
    } else {
        contribution = totalContributed;
    }

    if((totalContributed)>maxContribution){
        contribution = maxContribution;
        memLoan.inactiveContribution = totalContributed - maxContribution;
    }

    if (memLoan.start == 0){
        memLoan.start = now;
        memLoan.contractTime = periods * period;
        memLoan.arrayIndex = ListofLoans.length;
        ListofLoans.push(contributor);
    }

    uint timeElapsed = now - memLoan.start;
    uint rollBackTime = (contribution*timeElapsed)/(memLoan.activeContribution+contribution);

    uint Bounty;

    uint amountMemory = contribution;

    while(amountMemory > RemainingInStage){
        Bounty += RemainingInStage*StageValue/StageAmount;
        amountMemory -=RemainingInStage;
        BountyPool -= RemainingInStage*StageValue/StageAmount;

        CalculateStageValue();
        RemainingInStage = StageAmount;
    }

    Bounty += amountMemory*StageValue/StageAmount;
    RemainingInStage -= amountMemory;
    BountyPool -= amountMemory*StageValue/StageAmount;

    memLoan.activeContribution += contribution;
    memLoan.bounty += Bounty;
    memLoan.start += rollBackTime;
    emit Contribution(contributor, contribution, memLoan.bounty, memLoan.start+memLoan.contractTime);

    Loans[contributor] = memLoan;

}

function reclaim() public{
    reclaimInternal(msg.sender);
}

function reclaimInactive() public {
    reclaimInactive(msg.sender);
}

function reclaimInactive(address contributor) public{
     //send back any contributed UCASH not considered an active part of the loan
    uint UCASHtoSend = Loans[contributor].inactiveContribution;
    transferUCASH(contributor, UCASHtoSend);
    Loans[contributor].inactiveContribution = 0;
}

function reclaimInternal(address contributor) internal{


    uint UCASHtoSend;
    uint penalty;

    (UCASHtoSend,penalty) = ifClaimedNow(contributor);

    UCASHtoSend += Loans[contributor].inactiveContribution;

    transferUCASH(contributor,UCASHtoSend);

    if(!loanMatured(contributor)){
        BountyPool += Loans[contributor].bounty;
    }
    BountyPool += penalty;
    BountyPool -= Loans[contributor].recirculated;

    emit Reclaimed(contributor, UCASHtoSend, penalty);


    //re-arrange Array. Replace current element with last element, and delete last element.
    uint currentArrayIndex = Loans[contributor].arrayIndex;
    address replacingLoan = ListofLoans[ListofLoans.length - 1];
    Loans[replacingLoan].arrayIndex = currentArrayIndex;
    ListofLoans[currentArrayIndex] = replacingLoan;

    delete Loans[contributor];
    ListofLoans.length--;

    CalculateStageValue();
}

function ifClaimedNowPublic() public view returns(uint,uint){
    return ifClaimedNow(msg.sender);
}

function ifClaimedNow(address contributor) public view returns(uint ,uint){
    Loan memory memLoan = Loans[contributor];
    if (memLoan.start == 0){
        return (0,0);
    }
    uint CancellationFee; //fraction out of 1000000
    uint penalty;

    if (!loanMatured(contributor)){
         if((now - memLoan.start)/1 seconds <= 15){
            CancellationFee = 0;
       }else {
            uint elapsedPeriods = (now-memLoan.start)/(period);
            CancellationFee = 210000*(periods-elapsedPeriods)/periods;
       }
        penalty = (memLoan.activeContribution*CancellationFee)/1000000;
        memLoan.bounty = 0;
    } else{
        penalty = getLateFee(contributor);
    }

    uint UCASHtoSend = memLoan.activeContribution + memLoan.bounty - penalty;
    return (UCASHtoSend,penalty);
}

function CalculateStageValue() public{
    StageValue = BPNumerator*BountyPool/BPDenominator;
}

function loanMatured(address contributor) private view returns (bool){
    if(Loans[contributor].start == 0){
        return false;
    }

    if((now > (Loans[contributor].start+Loans[contributor].contractTime))){
        return true;
    } else {
        return false;
    }
}



function contractBalance() public view returns(uint){
    return ERC20(UCASHAddress).balanceOf(this);
}

function secondsLeftPublic() public view returns(uint){
    return secondsLeft(msg.sender);
}

function secondsLeft(address contributor) public view returns(uint){
    if(loanMatured(contributor)){
        return 0;
    } else if(Loans[contributor].start ==0) {
        return 0;
    } else{
        return (Loans[contributor].start + Loans[contributor].contractTime - now);
    }
}


function getLateFee(address contributor) internal view returns(uint){
    require(loanMatured(contributor));
    Loan memory memLoan = Loans[contributor];

    uint periodsLateBy = isLateBy(contributor);
        if (periodsLateBy>=100){
            return(memLoan.activeContribution+memLoan.bounty);
        } else {
            return(periodsLateBy*(memLoan.activeContribution+memLoan.bounty)/100);
        }
}

function isLateBy(address contributor) public view returns(uint){
    if(Loans[contributor].start == 0){
        return 0;
    }
     uint endDate = Loans[contributor].start + Loans[contributor].contractTime;
     if(now<endDate){
        return 0;
     }else{
        return  (now - endDate)/period;
     }

}

function numLoans() public view returns (uint) {
    return ListofLoans.length;
}

function nowwww() public view  returns(uint){
   return now;
}

function calculateBounty(uint contribution) public view returns(uint){
    uint Bounty;
    uint _BountyPool = BountyPool;
    uint _RemainingInStage = RemainingInStage;
    uint _StageValue = StageValue;

    while(contribution > _RemainingInStage){
        Bounty += _RemainingInStage*_StageValue/StageAmount;
        contribution -= _RemainingInStage;
        _BountyPool -= _RemainingInStage*_StageValue/StageAmount;

        _StageValue = BPNumerator*_BountyPool/BPDenominator;
        _RemainingInStage = StageAmount;
    }

    Bounty += contribution*_StageValue/StageAmount;

    return Bounty;
}



function addFunds(uint _amount) public payable onlyOwner{
    BountyPool+= _amount;
    CalculateStageValue();
}

function removeFunds(uint _amount) onlyOwner public {
    BountyPool -= _amount;
    transferUCASH(owner,_amount);
    CalculateStageValue();
}


function transferUCASH(address _recipient, uint _amount) private{
    ERC20(UCASHAddress).transfer(_recipient,_amount);
}

function calculateAllReclaimedNow() public view returns(uint){
    uint total;
    uint i;
    for(i=0;i<ListofLoans.length;i++){
        uint reclaimable;
        (reclaimable,) = ifClaimedNow(ListofLoans[i]);
        total += reclaimable;
    }
    return total;
}

function CalculateAllocatedUcash() public view returns(uint){
     uint total;
    uint i;
    for(i=0;i<ListofLoans.length;i++){
        total += Loans[ListofLoans[i]].activeContribution + Loans[ListofLoans[i]].bounty;
    }
    return total;
}

//Recirculate All Late fees to the bountyPool, and AutoReclaim loans more than 100 periods late.
function recirculateLateFees(uint iterations) public {
    if(recirculationIndex>=ListofLoans.length){
        recirculationIndex = 0;
    }
    uint i = recirculationIndex;
    uint j;
    if (i+iterations>ListofLoans.length){
        j = ListofLoans.length;
    } else{
        j = i + iterations;
    }
    for(i;i<j;i++){
        address contributor = ListofLoans[i];
        if(isLateBy(contributor)>=100){
            reclaimInternal(contributor);       //autoreclaim the loan if the loan is late by more than 100 periods
            //reclaimInternal deletes ListofLoans[i] and moves last element of ListofLoans into ListofLoans[i]
            i--; j--;                           //shift the loop back by one interval, shorten loop by one interval.  Number of loops remains the same.
        }else if(loanMatured(contributor)){
             uint amountToRecirculate = getLateFee(contributor) - Loans[contributor].recirculated;
             Loans[contributor].recirculated += amountToRecirculate;
             BountyPool += amountToRecirculate;
           }
        }

    recirculationIndex = j;
    }
}
