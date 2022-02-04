import * as oasis from '@oasisprotocol/client';

type OasisClient = oasis.client.NodeInternal
export type TW<T> = oasis.consensus.TransactionWrapper<T>
export type TxStaking = TW<oasis.types.StakingEscrow>;
export type TxUnstaking = TW<oasis.types.StakingReclaimEscrow>;

export interface PublicProvider {
  public(): Uint8Array;
}

export async function buildAddEscrow(
  nic: OasisClient,
  signer: PublicProvider,
  validatorAddress: string,
  amount: bigint,
): Promise<TxStaking> {
  const tw = oasis.staking.addEscrowWrapper()
  const nonce = await getNonce(nic, signer)
  tw.setNonce(nonce)
  tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
  tw.setBody({
    account: await addressToPublicKey(validatorAddress),
    amount: oasis.quantity.fromBigInt(amount),
  })

  const gas = await tw.estimateGas(nic, signer.public())
  tw.setFeeGas(gas)

  return tw
}

export async function buildReclaimEscrow(
  nic: OasisClient,
  signer: PublicProvider,
  validatorAddress: string,
  amount: bigint,
): Promise<TxUnstaking> {
  const tw = oasis.staking.reclaimEscrowWrapper()
  const nonce = await getNonce(nic, signer)
  tw.setNonce(nonce)
  tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
  tw.setBody({
    account: await addressToPublicKey(validatorAddress),
    shares: oasis.quantity.fromBigInt(amount),
  })

  const gas = await tw.estimateGas(nic, signer.public())
  tw.setFeeGas(gas)

  return tw
}

export async function getUserBalance(nic: OasisClient, address: string) {
  let shortKey = await oasis.staking.addressFromBech32(address)
  // oasisClient.getla()
  let height = 0;
  console.log('latest height=', height)
  console.log('shortKey=', shortKey)
  nic.consensusGetBlock(height).catch(reason => console.log("error=", reason))
  const res = await nic.consensusGetBlock(height);
  console.log(res)

  let account = await nic.stakingAccount({ height: height, owner: shortKey });
  console.log(account);
  let balanceRaw = account && account.general && account.general.balance
  if (balanceRaw) {
    return oasis.quantity.toBigInt(balanceRaw).toString()
  }
  return '0';
}

export interface Staked {
  validator: string;
  amount: bigint;
}

export async function getStaked(nic: OasisClient, address: string): Promise<Staked[]> {
  let shortKey = await oasis.staking.addressFromBech32(address)
  let height = 0;
  let stakedMap = await nic.stakingDelegationsFor({ height: height, owner: shortKey });
  const staked0 = Array.from(stakedMap.entries()).map(async ([k, v]) => {
    const shortPK = await shortPublicKey(k);
    const validator = await publicKeyToAddress(k);
    const amount = oasis.quantity.toBigInt(v.shares)
    return {
      validator,
      amount,
    } as Staked
  });
  const staked = await Promise.all(staked0);
  return staked;
}


export const publicKeyToAddress = async (publicKey: Uint8Array) => {
  const data = await oasis.address.fromData('oasis-core/address: staking', 0, publicKey)
  return oasis.address.toBech32('oasis', data)
}

export const shortPublicKey = async (publicKey: Uint8Array) => {
  return await oasis.address.fromData('oasis-core/address: staking', 0, publicKey)
}

export const addressToPublicKey = async (addr: string) => {
  return oasis.address.fromBech32('oasis', addr)
}

export async function getNonce(nic: OasisClient, signer: PublicProvider): Promise<bigint> {
  const nonce = await nic.consensusGetSignerNonce({
    account_address: await shortPublicKey(signer.public()),
    height: 0,
  })

  return BigInt(nonce || 0)
}
