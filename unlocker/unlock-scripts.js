
const unlock = (txid, output, satoshis, script, receiveAddress, mnemonic, derivationPath) => {
    try {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const hdPrivateKey = bsv.HDPrivateKey.fromSeed(seed, bsv.Networks.mainnet);
        const simplyCashPriv = hdPrivateKey.deriveChild(derivationPath);
        const simplyCashPrivateKey = simplyCashPriv.privateKey;

        console.log("receiving address: ", receiveAddress);

        const utxo = {
            txid: txid,
            vout: output,
            satoshis: satoshis,       
            script: script
        };

        console.log(utxo)

        const lockedScript = bsv.Script(utxo.script);
        const pubKeyHex = lockedScript.chunks[17].buf.toString("hex");
        console.log(pubKeyHex);

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

        const timestampHex = lockedScript.chunks[18].buf ? lockedScript.chunks[18].buf.toString("hex") : 0;
        const timestamp = hex2Int(timestampHex);
        if (timestampToUse < timestamp) {
            timestampToUse = timestamp;
        }
        satoshiSumToUnlock += utxo.satoshis;

        bsvtx.lockUntilDate(timestampToUse);
        const txSize = bsvtx.inputs.length * 1000;
        const feeRate = 10 / 1000;
        const fee = Math.ceil(txSize * feeRate);
        if (satoshiSumToUnlock < fee) {
            console.error("Amount to unlock is too low");
            return;
        }

        bsvtx.to(receiveAddress, satoshiSumToUnlock - fee);

        const i = 0;
        const solution = unlockLockScript(
            bsvtx,
            i,
            utxo.script,
            utxo.satoshis,
            simplyCashPrivateKey
        );
        bsvtx.inputs[i].setScript(solution);
        return bsvtx.toString();
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

const unlockLockScript = (tx, inputIndex, lockTokenScript, satoshis, privkey) => {
    const sighashType = bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
    const scriptCode = bsv.Script.fromHex(lockTokenScript);
    const value = new bsv.crypto.BN(satoshis);
    const preimg = bsv.Transaction.Sighash.sighashPreimage(tx, sighashType, inputIndex, scriptCode, value).toString("hex");
    let s;
    if (privkey) {
        s = bsv.Transaction.Sighash.sign(tx, privkey, sighashType, inputIndex, scriptCode, value).toTxFormat();
    }
    return bsv.Script.fromASM(`${s.toString("hex")} ${privkey.toPublicKey().toHex()} ${preimg}`).toHex();
};

const hex2Int = (hex) => {
    const reversedHex = changeEndianness(hex);
    return parseInt(reversedHex, 16);
};

const changeEndianness = (hex) => {
    const result = [];
    let len = hex.length - 2;
    while (len >= 0) {
        result.push(hex.substr(len, 2));
        len -= 2;
    }
    return result.join("");
};
