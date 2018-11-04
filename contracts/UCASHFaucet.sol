pragma solidity ^0.4.24;
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

contract UCASHFaucet {
    address ucashAddress = 0xbD52C5265B94f727f0616f831b011c17e1f235A2;
    uint cooldownTime = 24 hours;
    mapping(address=>uint) public lastDispensed;

    function dispenseUCASH() public{
        require((lastDispensed[msg.sender]+cooldownTime)<now);
        uint balance = contractBalance();
        ERC20(ucashAddress).transfer(msg.sender, balance/100);
        lastDispensed[msg.sender] = now;

    }
    function contractBalance() public view returns(uint){
        return ERC20(ucashAddress).balanceOf(this);
    }

}
