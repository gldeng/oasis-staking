import { address, quantity } from '@oasisprotocol/client'

export const uint2hex = (uint: Uint8Array) => Array.from(uint).map(i => ('0' + i.toString(16)).slice(-2)).join('');
export function hex2uint(hexString: string) {
  if (hexString.length % 2 !== 0) {
    throw "Invalid hexString";
  }
  var arrayBuffer = new Uint8Array(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    var byteValue = parseInt(hexString.substr(i, 2), 16);
    if (isNaN(byteValue)) {
      throw "Invalid hexString";
    }
    arrayBuffer[i / 2] = byteValue;
  }

  return arrayBuffer;
}

export const shortPublicKey = async (publicKey: Uint8Array) => {
  return await address.fromData('oasis-core/address: staking', 0, publicKey)
}

export const publicKeyToAddress = async (publicKey: Uint8Array) => {
  const data = await address.fromData('oasis-core/address: staking', 0, publicKey)
  return address.toBech32('oasis', data)
}

export const addressToPublicKey = async (addr: string) => {
  // const data = await address.fromData('oasis-core/address: staking', 0, publicKey)
  return address.fromBech32('oasis', addr)
}

export const uint2bigintString = (uint: Uint8Array) => quantity.toBigInt(uint).toString()
export const stringBigint2uint = (number: string) => quantity.fromBigInt(BigInt(number))

export function concat(...parts: Uint8Array[]) {
  let length = 0
  for (const part of parts) {
    length += part.length
  }
  let result = new Uint8Array(length)
  let pos = 0
  for (const part of parts) {
    result.set(part, pos)
    pos += part.length
  }
  return result
}

export const parseNumberToBigInt = (value: number) => BigInt(Math.round(value * 10 ** 9))
