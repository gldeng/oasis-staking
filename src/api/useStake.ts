// import { Coin, LCDClient, MsgDelegate } from '@terra-money/terra.js';
// import { useWallet } from '@terra-money/wallet-provider';
// import { useState, useCallback, FC } from 'react'
// import { useAddress } from './useAddress';
// import { ROCKX_VALIDATOR } from '../config';
// import { Dialog } from '@mui/material';


// import * as oasisExt from '@oasisprotocol/client-ext-utils';

// export default () => {
//     oasisExt.connection.connect()
//     const wallet = useWallet();
//     const address = useAddress();
//     const [data, setData] = useState(null)
//     const [loading, setLoading] = useState<boolean>(false)
//     const [error, setError] = useState<any>(null)
//     const [noted, setNoted] = useState(true)
//     type ExecuteArgs = {
//         validatorAddress: string;
//         ulunaAmount: string | number;
//     }
//     const execute = useCallback(async ({ validatorAddress, ulunaAmount }: ExecuteArgs) => {
//         try {
//             setLoading(true)
//             setData(null)
//             setError(null)
//             if (!wallet)
//                 setError('No valid wallet.');
//             const msg = new MsgDelegate(address, validatorAddress, new Coin('uluna', ulunaAmount));

//             const { result, success } = await wallet.post({
//                 msgs: [msg],
//                 memo: 'Stake to Rock X',
//             });
//             console.log('Tx hash: %s, with error: %s', result.txhash, JSON.stringify(success));
//             setData(data)
//         } catch (error: any) {
//             setError(error)
//         } finally {
//             setLoading(false)
//             setNoted(false)
//         }
//         // eslint-disable-next-line
//     }, [address, wallet])

//     return { data, loading, error, noted, setNoted, execute }
// }
export {}