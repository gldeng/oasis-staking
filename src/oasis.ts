import * as oasis from '@oasisprotocol/client';

const ROCKX_ADDRESS = 'oasis1qpjuke27se2wnmvx6e8uc4l5h44yjp9h7g2clqfq';
export const getOasisClient = () => new oasis.client.NodeInternal('https://testnet.grpc.oasis.dev');
// const getOasisClient = () => new oasis.client.NodeInternal('https://grpc-mainnet.oasisscan.com');

/*
const a = ()=>{
    
    const addEscrow = oasis.staking.addEscrowWrapper()
    addEscrow.setNonce(sendNonce)

    let lastFeeAmount = sendFeeAmount
    addEscrow.setFeeAmount(oasis.quantity.fromBigInt(BigInt(lastFeeAmount)))

    addEscrow.setBody({
      account: vaildatorAddress,
      amount: addEscrowAmount,
    })
    let feeGas = await addEscrow.estimateGas(oasisClient, publicKey)
    let sendFeeGas = feeGas
    addEscrow.setFeeGas(sendFeeGas)

    let chainContext = await oasisClient.consensusGetChainContext()
    await addEscrow.sign(signer, chainContext)

    try {
      await addEscrow.submit(oasisClient);
    } catch (e) {
      console.error('submit failed', e);
      throw e;
    }
    const tw = oasis.staking.transferWrapper()
    addEscrow.setNonce(sendNonce)
}
*/

/**
 * use grpc get nonce
 * @param {*} address 
 */
// async function getUserBalance(address: string) {
//   const oasisClient = getOasisClient()
//   let shortKey = await oasis.staking.addressFromBech32(address)
//   // oasisClient.getla()
//   let height = 7428391;
//   console.log('latest height=', height)
//   console.log('shortKey=', shortKey)
//   oasisClient.consensusGetBlock(height).catch(reason => console.log("error=", reason))
//   const res = await oasisClient.consensusGetBlock(height);
//   console.log(res)
//   let account = await oasisClient.stakingAccount({ height: height, owner: shortKey });
//   console.log(account);
//   let balance = account && account.general && account.general.balance || 0
//   // if (balance) {
//   //   balance = oasis.quantity.toBigInt(balance).toString()
//   // }
//   let nonce = account && account.general && account.general.nonce || 0
//   return { balance, nonce }
// }

// async function main() {
//   const { balance, nonce } = await getUserBalance('oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p');
//   console.log(balance)
//   console.log(nonce);
// }
  
export async function getUserAccount(address: string) {
  const oasisClient = getOasisClient()
  let shortKey = await oasis.staking.addressFromBech32(address)
  // oasisClient.getla()
  let height = 0;//7428391;
  console.log('latest height=', height)
  console.log('shortKey=', shortKey)
  oasisClient.consensusGetBlock(height).catch(reason => console.log("error=", reason))
  let account = await oasisClient.stakingAccount({ height: height, owner: shortKey });
  console.log(account);
  return account;
}
