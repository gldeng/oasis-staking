import { useState } from 'react';
import './App.css';
import { getOasisClient } from './oasis';
import { publicKeyToAddress } from './lib/helpers';

import * as oasisExt from '@oasisprotocol/client-ext-utils';
import { ExtContextSigner } from '@oasisprotocol/client-ext-utils/dist/signature';
import { ExtConnection } from '@oasisprotocol/client-ext-utils/dist/connection';
import Stake from './Stake';
import { CHROME_EXTENSION_URL } from './config';
import Unstake from './Unstake';

function App() {

  // TODO: can move to a WalletProvider
  const nic = getOasisClient();
  const [chainContext, setChainContext] = useState<string | null>(null);
  const [conn, setConn] = useState<ExtConnection | null>(null);
  const [signer, setSigner] = useState<ExtContextSigner | null>(null);
  const [address, setAddress] = useState<string>("");
  const connect = async () => {
    const chainContext_ = await nic.consensusGetChainContext();
    const conn_ = await oasisExt.connection.connect(CHROME_EXTENSION_URL);
    const keys_ = await oasisExt.keys.list(conn_);
    const signer_ = await oasisExt.signature.ExtContextSigner.request(conn_, keys_[0].which);
    const address_ = await publicKeyToAddress(signer_.publicKey);
    setChainContext(chainContext_);
    setConn(conn_);
    setSigner(signer_);
    setAddress(address_);
  };

  return (
    <div className="App">
      {
        !!signer && <>
          <div>Network: {signer?.connection.origin}</div>
          <div>Your Address: {signer?.which ?? 'No PubKey'}</div>
        </>
      }
      {
        !signer && <button onClick={connect}>Connect</button>
      }
      <hr />
      {
        !!chainContext && !!conn && !!signer && !!address &&
        <Stake chainContext={chainContext} conn={conn} nic={nic} signer={signer} address={address} />
      }
      <hr />
      {
        !!chainContext && !!conn && !!signer && !!address &&
        <Unstake chainContext={chainContext} conn={conn} nic={nic} signer={signer} address={address} />
      }
    </div>
  );
}

export default App;
