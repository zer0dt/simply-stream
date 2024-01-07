

import * as bip39 from "bip39";
import { bsv } from "scrypt-ts";

const callRedeem = (
  unlockOutput,
  streamTxHex,
  mnemonic
) => {
  try {

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdPrivateKey = bsv.HDPrivateKey.fromSeed(seed, bsv.Networks.mainnet);

    const simplyCashPriv = hdPrivateKey.deriveChild("m/44'/145'/0'/0/0");

    const simplyCashPrivateKey = simplyCashPriv.privateKey;

    // paymail public key of the `paymail privateKey`
    const simplyCashPublicKey = simplyCashPrivateKey.publicKey;

    //relayX Address
    const simplyCashAddress = simplyCashPrivateKey.publicKey.toAddress(
      bsv.Networks.mainnet
    );
    const receiveAddress = simplyCashAddress.toString();
    console.log("receiving address: ", receiveAddress);

    const utxo = getUTXO(streamTxHex, unlockOutput);

      const lockedScript = bsv.Script(utxo.script);
      const pubKeyHex = lockedScript.chunks[17].buf.toString("hex"); // Replace with the actual property name

      console.log(pubKeyHex)
   

    // create new tx
    let bsvtx = new bsv.Transaction();
    let timestampToUse = 0;
    let satoshiSumToUnlock = 0;


      bsvtx.addInput(
        new bsv.Transaction.Input({
          prevTxId: utxo.txid,
          outputIndex: utxo.vout,
          script: new bsv.Script(),
        }),
        lockedScript,
        utxo.satoshis
      );

      const timestampHex = lockedScript.chunks[18].buf
        ? lockedScript.chunks[18].buf.toString("hex")
        : 0;
      const timestamp = hex2Int(timestampHex);
      if (timestampToUse < timestamp) {
        timestampToUse = timestamp;
      }
      satoshiSumToUnlock += utxo.satoshis;
   

    bsvtx.lockUntilDate(timestampToUse);

    const txSize = bsvtx.inputs.length*1000 // estimate 1000 bytes for input (it's around 900 something)
    const feeRate = 10/1000 // 3 sat/KB
    const fee = Math.ceil(txSize*feeRate)
    if (satoshiSumToUnlock<fee) {
      console.error("Amount to unlock is too low");
      return
    }

    bsvtx.to(receiveAddress, satoshiSumToUnlock - fee); // subtract 1 satoshi to pay the transaction fee

    const i = 0
      const solution = unlockLockScript(
        bsvtx,
        i,
        utxo.script,
        utxo.satoshis,
        simplyCashPrivateKey
      );
      bsvtx.inputs[i].setScript(solution);
 

    console.log("tx to broadcast: " +  bsvtx.toString())
  } catch (error) {
    console.error("An error occurred:", error);
  }
};


const getUTXO = (rawtx, idx) => {
  const bsvtx = new bsv.Transaction(rawtx);

  return {
    satoshis: bsvtx.outputs[idx].satoshis,
    vout: idx,
    txid: bsvtx.hash,
    script: bsvtx.outputs[idx].script.toHex(),
  };
};

// build the solution to the locking script by constructing the pre image and signature
const unlockLockScript = (
  tx,
  inputIndex,
  lockTokenScript,
  satoshis,
  privkey
) => {
  const sighashType =
    bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
  const scriptCode = bsv.Script.fromHex(lockTokenScript);
  const value = new bsv.crypto.BN(satoshis);
  // create preImage of current transaction with valid nLockTime
  const preimg = bsv.Transaction.Sighash.sighashPreimage(
    tx,
    sighashType,
    inputIndex,
    scriptCode,
    value
  ).toString("hex");
  let s;
  if (privkey) {
    // sign transaction with private key tied to public key locked in script
    s = bsv.Transaction.Sighash.sign(
      tx,
      privkey,
      sighashType,
      inputIndex,
      scriptCode,
      value
    ).toTxFormat();
  }
  return bsv.Script.fromASM(
    `${s.toString("hex")} ${privkey.toPublicKey().toHex()} ${preimg}`
  ).toHex();
};

const hex2Int = (hex) => {
  const reversedHex = changeEndianness(hex);
  return parseInt(reversedHex, 16);
};

const changeEndianness = (hex) => {
  // change endianess of hex value before placing into ASM script
  const result = [];
  let len = hex.length - 2;
  while (len >= 0) {
    result.push(hex.substr(len, 2));
    len -= 2;
  }
  return result.join("");
};


callRedeem(
  Enter output number here,
 "Enter rawtx here", 
 "enter mnemonic here"
 )