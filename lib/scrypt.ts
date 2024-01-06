"use client";

import { hash160, bsv, ByteString } from "scrypt-ts";

import { Lockup } from "@/src/contracts/timestamp-lock";
import artifact from "@/artifacts/timestamp-lock.json";


Lockup.loadArtifact(artifact);

const getLockupScript = async (nLockTime: number, pubKey: ByteString) => {
  const instance = new Lockup(hash160(pubKey), BigInt(nLockTime));

  return instance.lockingScript.toHex();
};

export { getLockupScript };