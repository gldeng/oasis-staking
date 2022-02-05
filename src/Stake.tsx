import { useEffect, useState } from 'react';
import { publicKeyToAddress, uint2bigintString, uint2hex } from './lib/helpers';
import { buildAddEscrow, getUserBalance, TW } from './api/helpers';
import { ExtContextSigner } from '@oasisprotocol/client-ext-utils/dist/signature';
import { ExtConnection } from '@oasisprotocol/client-ext-utils/dist/connection';
import { StakingEscrow } from '@oasisprotocol/client/dist/types';
import { AMOUNT_TO_STAKE, TESTNET_VALIDATOR } from './config';
import { NodeInternal } from '@oasisprotocol/client/dist/client';

export interface StakeProps {
  chainContext: string;
  conn: ExtConnection;
  nic: NodeInternal;
  signer: ExtContextSigner;
  address: string;
}

interface StakingEscrowComponentProps {
  tx: TW<StakingEscrow>;
  sn: number;
}

const StakingEscrowComponent = ({ tx, sn }: StakingEscrowComponentProps) => {
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [sig, setSig] = useState<string>("");
  useEffect(() => {
    const inner = async () => {
      const toAddress_ = await publicKeyToAddress((tx.transaction.body as StakingEscrow).account);
      setToAddress(toAddress_);
      const amount_ = uint2bigintString((tx.transaction.body as StakingEscrow).amount);
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

function Stake({ chainContext, conn, nic, signer, address }: StakeProps) {
  const [tx, setTx] = useState<TW<StakingEscrow> | null>(null);
  const [sn, setSn] = useState(0);
  const [balance, setBalance] = useState('0');
  useEffect(() => {
    getUserBalance(nic, address).then(setBalance);
  });
  const prepare = () => {
    const inner = async () => {
      const tx_ = await buildAddEscrow(nic, signer, TESTNET_VALIDATOR, BigInt(AMOUNT_TO_STAKE));
      await tx_.sign(signer, chainContext);
      setSn(sn + 1);
      setTx(tx_);
    }
    inner();
  }
  const send = () => {
    !!tx && !!tx.signedTransaction && tx.submit(nic);
  };
  return (
    <div>
      <h2>Stake</h2>
      <div>Balance: {balance}</div>
      {!!tx && <StakingEscrowComponent tx={tx} sn={sn} />}
      <button onClick={() => prepare()} disabled={!!tx}>Prepare</button>
      <button onClick={() => send()} disabled={!tx || !tx.signedTransaction}>Send</button>
    </div>
  );
}

export default Stake;
