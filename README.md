# uCollateral
v1.0
uCollateral is a dapp that lets people receive bounties for providing UCASH collateral to the smart contract.  

The collateral provided will be used as a signal of long-term support for the UCASH ecosystem.  3rd party providers will use this information towards issuance of digital currency liquidity to vetted UCASH converters globally.  Although this contract refers to the UCASH input as "collateral", in true usage, only the UCASH liquidity bounty pool will pay any "defaults" in this Version 0.9 of the uCollateral contract.  All user funds input are inaccessible to anyone but the smart-contract and can be reclaimed by the depositing user only (plus/minus any fees accrued).

Periodically, the liquidity bounty pool (not user input funds), will be adjusted to increase or decrease the amount of UCASH in the pool according to liquidity fees, user fees, or defaults received.  Version 1.0 will have additional features which will make this process more effective and streamlined.

---------------------------------------------------------------------------
# try the Dapp

- Simply go to https://udotcash.github.io/uCollateral/uCollateral.html

# run the Dapp without an oracle

- clone the repository

```python -m SimpleHTTPServer 8080```
to serve uCollateral.html

- or simply go to https://udotcash.github.io/uCollateral/uCollateral.html. 



---------------------------------------------------------------------------

# run the Dapp with an oracle
The oracle allows the user send UCASH directly to the uCollateral contract without a web3 provider (e.g. Metamask).

- clone the repository

- deploy your own instance of UCOLLATERAL.sol

```python -m SimpleHTTPServer 8080```
to serve ucollateral.html

- import your private key into oracle.js

```node oracle.js```
to run the oracle

---------------------------------------------------------------------------

# main link for the dapp: <a href="https://udotcash.github.io/uCollateral/ucollateral.html">Github Link</a>

---------------------------------------------------------------------------
