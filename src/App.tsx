import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getOasisClient, getUserAccount } from './oasis';
import { publicKeyToAddress, uint2bigintString, uint2hex } from './lib/helpers';
import { buildAddEscrow, getUserBalance, TW } from './api/helpers';

import * as oasisExt from '@oasisprotocol/client-ext-utils';
import { ExtContextSigner } from '@oasisprotocol/client-ext-utils/dist/signature';
import { ExtConnection } from '@oasisprotocol/client-ext-utils/dist/connection';
import { StakingEscrow } from '@oasisprotocol/client/dist/types';


const TESTNET_VALIDATOR = 'oasis1qz2tg4hsatlxfaf8yut9gxgv8990ujaz4sldgmzx';
const AMOUNT_TOSTAKE = 100_000_000_000;

function App() {
  const nic = getOasisClient();
  // buildAddEscrow(client)
  const [conn, setConn] = useState<ExtConnection | null>(null);
  const [signer, setSigner] = useState<ExtContextSigner | null>(null);
  const [tx, setTx] = useState<TW<StakingEscrow> | null>(null);
  const [chainContext, setChainContext] = useState<string | null>(null);
  const [sn, setSn] = useState(0);
  const [balance, setBalance] = useState('0');
  useEffect(()=>{
    if(!!signer)
    publicKeyToAddress(signer.publicKey).then(address =>getUserBalance(nic, address).then(setBalance) )
    
  }, [signer]);
  // let chainContext = await nic.consensusGetChainContext()
  // await addEscrow.sign(signer, chainContext)
  /*
      let from = account && account.address ? account.address : ""
    const signer = await oasisExt.signature.ExtContextSigner.request(connection, from).catch(err => err);
    if (signer.error) {
      alert(signer.error)
      return
    }
  */

  useEffect(() => {
    oasisExt.connection.connect('chrome-extension://ppdadbejkmjnefldpcdjhnkpbjkikoip')
      .then(setConn)
    nic.consensusGetChainContext().then(setChainContext);
  });
  useEffect(() => {
    if (!!conn) {
      oasisExt.keys.list(conn).then(keys => {
        oasisExt.signature.ExtContextSigner.request(conn, keys[0].which).then(setSigner);
      });
    }
  }, [conn]);
  // useEffect(() => {
  //   async function fun() {
  //     const account = await getUserAccount('oasis1qpuq6rwrcm9d9khw3nksw9akmcdpc0futukaltxu');
  //     let balance = !!account && !!account.general && uint2bigintString(account.general.balance as Uint8Array) || 0
  //     // if (balance) {
  //     //   balance = oasis.quantity.toBigInt(balance).toString()
  //     // }
  //     let nonce = account && account.general && account.general.nonce || 0
  //     console.log({ balance, nonce });
  //     return { balance, nonce };
  //   }
  //   fun();
  // }, []);
  useEffect(() => {
    if (!!signer)
      buildAddEscrow(nic, signer, TESTNET_VALIDATOR, BigInt(AMOUNT_TOSTAKE)).then(x => {
        console.log('tx', x);
        setTx(x);
      });
  }, [signer]);
  useEffect(() => {
    if (!!tx && !!signer && !!chainContext)
      tx.sign(signer, chainContext).then(() => {
        console.log('signed', tx)
        setSn(sn + 1);
      });
  }, [tx, signer, chainContext]);
  const ready = !!tx && !!tx.signedTransaction;
  const send = () => {
    !!tx && !!tx.signedTransaction && tx.submit(nic);
  };
  return (
    <div className="App">
      <div>Network: {signer?.connection.origin}</div>
      <div>Your Address: {signer?.which ?? 'No PubKey'}</div>
      <div>Balance: {balance}</div>
      <div>Ready: {ready ? "Yes": "No"}</div>
      {/* <div>Tx: {!!tx && !!tx.signedTransaction ? uint2hex(tx.signedTransaction.signature.signature ?? new Uint8Array()) : 'No Sig'}</div> */}
      <div>Tx True: {!!tx ? 'Yes' : 'No'}</div>
      <div>Signed Tx True: {!!tx?.signedTransaction ? 'Yes' : 'No'}</div>
      <button onClick={() => send()} disabled={!tx || !tx.signedTransaction}>Send</button>
    </div>
  );
}

export default App;
