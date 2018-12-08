# uCollateral
v0.9.1

uCollateral is a dapp that lets people receive bounties for providing UCASH collateral to the smart contract.  

The collateral provided will be used as a signal of long-term support for the UCASH ecosystem.  3rd party providers will use this information towards issuance of digital currency liquidity to vetted UCASH converters globally.  Although this contract refers to the UCASH input as "collateral", in true usage, only the UCASH liquidity bounty pool will pay any "defaults" in this Version 0.9 of the uCollateral contract.  All user UCASH input are inaccessible to anyone but the smart-contract and can be reclaimed by the depositing user only (plus/minus any fees accrued).

Periodically, the liquidity bounty pool will be adjusted to increase or decrease the amount of UCASH in the pool according to liquidity fees, user fees, or defaults received.  Version 1.0 will have additional features which will make this process more effective and streamlined and also have fees on user input UCASH for a more structured collateral type setup.

---------------------------------------------------------------------------
# run the Dapp without an oracle
This option requires the user to call Approve on UCASH contract, then call the uCollateral contract which calls TransferFrom

- go to approveAndTransferFrom

```python -m SimpleHTTPServer 8080```
to serve ucollateral.html

Only works with web3 provider (i.e. metamask)

---------------------------------------------------------------------------

# run the Dapp with an oracle
This option lets the user send UCASH directly to the uCollateral contract.

- go to DirecttTransfers folder

```python -m SimpleHTTPServer 8080```
to serve ucollateral.html

```node oracle.js```
to run the oracle

Works with or without web3 provider. Can send UCASH directly to contract while the oracle is running.

---------------------------------------------------------------------------

# main link for the dapp: <a href="https://udotcash.github.io/uCollateral/ucollateral.html">Github Link</a>

---------------------------------------------------------------------------
