function switchProvider(accounts,web3provider){
    var isMetaMask  = web3provider.isMetaMask;
    var isLoggedIn
    var provider = new ethers.providers.Web3Provider(web3.currentProvider,'rinkeby');

    console.log(accounts[0]);

    if (accounts[0] == undefined){
          isLoggedIn = false;
    } else {
          isLoggedIn = true;
    }

    if(isMetaMask){
        if (isLoggedIn){
          console.log("Metamask Logged In");
          metamaskLoggedIn(accounts);
        }  else {
            console.log("Metamask Logged Out");
          metamaskLoggedOut(accounts);
        }
      } else {
          console.log("No Metamask");
        noMetamask(accounts);
      }

  }

  function noMetamask(accounts){
    //reveal
    document.getElementById("noMetamask").hidden = false;

    //hide
    document.getElementById("metamaskLoggedIn").hidden = true;
    document.getElementById("metamaskLoggedOut").hidden = true;



  }
  function metamaskLoggedIn(accounts){
    //SendUCASH
    //ReclaimButton
    //ApproveAndTransfer
    //connectToMetamask

    //reveal
    document.getElementById("metamaskLoggedIn").hidden = false;

    //hide
    document.getElementById("noMetamask").hidden = true;
    document.getElementById("metamaskLoggedOut").hidden = true;


  }
  function metamaskLoggedOut(accounts){

    //reveal
    document.getElementById("metamaskLoggedOut").hidden = false;

    //hide
    document.getElementById("metamaskLoggedIn").hidden = true;
    document.getElementById("noMetamask").hidden = true;

  }
