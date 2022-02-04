import React, { useEffect, useState } from 'react';
import { getOasisClient, getUserAccount } from './oasis';
import { publicKeyToAddress, uint2bigintString, uint2hex } from './lib/helpers';
import { buildAddEscrow, buildReclaimEscrow, getStaked, getUserBalance, Staked, TW, TxUnstaking } from './api/helpers';
import { ExtContextSigner } from '@oasisprotocol/client-ext-utils/dist/signature';
import { ExtConnection } from '@oasisprotocol/client-ext-utils/dist/connection';
import { StakingEscrow, StakingReclaimEscrow } from '@oasisprotocol/client/dist/types';
import { AMOUNT_TO_STAKE, AMOUNT_TO_UNSTAKE, TESTNET_VALIDATOR } from './config';
import { NodeInternal } from '@oasisprotocol/client/dist/client';

export interface UnstakeProps {
  chainContext: string;
  conn: ExtConnection;
  nic: NodeInternal;
  signer: ExtContextSigner;
  address: string;
}

interface UnstakingEscrowComponentProps {
  tx: TxUnstaking;
  sn: number;
}

const UnstakingEscrowComponent = ({ tx, sn }: UnstakingEscrowComponentProps) => {
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [sig, setSig] = useState<string>("");
  useEffect(() => {
    const inner = async () => {
      const toAddress_ = await publicKeyToAddress((tx.transaction.body as StakingReclaimEscrow).account);
      setToAddress(toAddress_);
      const amount_ = uint2bigintString((tx.transaction.body as StakingReclaimEscrow).shares);
      setAmount(amount_);
    }
    inner();
  });
  useEffect(() => {

    if (!tx.signedTransaction)
      return;
    if (!tx.signedTransaction.signature)
      return;
    if (!tx.signedTransaction.signature.signature)
      return;
    if (!!tx.signedTransaction?.signature?.signature)
      setSig(uint2hex(tx.signedTransaction.signature.signature));
  }, [tx.signedTransaction?.signature?.signature, sn])

  return <>
    <div>Method: {tx.transaction.method}</div>
    <div>To: {toAddress}</div>
    <div>Amount: {amount}</div>
    <div>Signature: {sig}</div>
  </>;
}

function Unstake({ chainContext, conn, nic, signer, address }: UnstakeProps) {
  const [tx, setTx] = useState<TxUnstaking | null>(null);
  const [sn, setSn] = useState(0);
  const [staked, setStaked] = useState<Staked[]>([]);
  useEffect(() => {
    getStaked(nic, address).then(setStaked);
  });
  useEffect(() => {
    if (!!tx){
      tx.sign(signer, chainContext).then(() => {
        setSn(sn + 1);
      });
      console.log('tx un', tx)
    }
      
  }, [tx]);
  const prepare = () => buildReclaimEscrow(nic, signer, TESTNET_VALIDATOR, BigInt(AMOUNT_TO_UNSTAKE)).then(setTx);
  const send = () => {
    !!tx && !!tx.signedTransaction && tx.submit(nic);
  };
  return (
    <div>
      <h2>Unstake</h2>
      {
        !!staked && staked.length> 0 && staked.map(
          (s)=>
            <div>Staked to {s.validator}: {s.amount.toString()}</div>
        )
      }
      {!!tx && <UnstakingEscrowComponent tx={tx} sn={sn} />}
      <button onClick={() => prepare()} disabled={!!tx}>Prepare</button>
      <button onClick={() => send()} disabled={!tx || !tx.signedTransaction}>Send</button>
    </div>
  );
}

export default Unstake;
