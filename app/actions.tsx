'use server'

import prisma from './db'
import bsv from 'bsv'


export async function createNewUser(identityPubKey: string) {
  try {
    // Check if a user with the given identityPubKey already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        identityPubKey: identityPubKey
      }
    });

    // If a user already exists, return or handle as needed
    if (existingUser) {
      console.log('User already exists with this identityPubKey');
      return existingUser;
    }

    // If no user exists, create a new user
    const newUser = await prisma.user.create({
      data: {
        identityPubKey: identityPubKey
      }
    });

    return newUser;
  } catch (error) {
    // Handle or log the error appropriately
    console.error("Error in creating new user:", error);
    throw error; // Rethrow the error for the caller to handle
  }
}

interface LockstreamInput {
  userId: string;
  createdAt: Date;
  name: string;
  startDate: string; // Date in 'YYYY-MM-DD' format
  endDate: string; // Date in 'YYYY-MM-DD' format
  unlockTime: string; // Time in 'HH:MM' format
  totalSatoshisLocked: string; // Assuming string to handle large numbers
  satoshisUnlockedPerDay: string; // Assuming string to handle large numbers
  streamPubkey: string;
  fundingAddress: string;
}

export async function createNewLockstream(input: LockstreamInput) {
  const { userId, name, startDate, endDate, unlockTime,
    totalSatoshisLocked, satoshisUnlockedPerDay, streamPubkey, fundingAddress } = input;

  const newLockstream = await prisma.lockstream.create({
    data: {
      userId,
      name,
      streamPubkey,
      fundingAddress,
      startDate: BigInt(startDate),
      endDate: BigInt(endDate),
      totalSatoshisLocked: BigInt(totalSatoshisLocked),
      satoshisUnlockedPerDay: BigInt(satoshisUnlockedPerDay),
      funded: false, // default value
      // txid can be added if available
    }
  });

  return newLockstream;
}

// Function to get a lockstream by ID and identityPubKey
export async function getLockstream(lockstreamId: string, identityPubKey: string) {
  try {
    const lockstream = await prisma.lockstream.findFirst({
      where: {
        id: lockstreamId,
        userId: identityPubKey
      },
    });

    if (!lockstream) {
      throw new Error('Lockstream not found or access denied');
    }

    return lockstream;
  } catch (error) {
    console.error("Error fetching lockstream:", error);
    throw error;
  }
}

export async function getUserLockstreams(identityPubKey: string) {
  try {
    // Retrieve the user along with their lockstreams
    const userWithLockstreams = await prisma.user.findUnique({
      where: {
        identityPubKey: identityPubKey
      },
      include: {
        lockstreams: true, // Include the lockstreams in the response
      },
    });

    // If no user is found, handle or return as needed
    if (!userWithLockstreams) {
      console.log('User not found with this identityPubKey');
      return null;
    }

    // Return the lockstreams of the user
    return userWithLockstreams.lockstreams;
  } catch (error) {
    // Handle or log the error appropriately
    console.error("Error in retrieving user lockstreams:", error);
    throw error; // Rethrow the error for the caller to handle
  }
}

// Function to update the name of a lockstream by ID and identityPubKey
export async function updateLockstreamName(lockstreamId: string, identityPubKey: string, newName: string) {

  try {
    // First, find the lockstream to ensure it exists and belongs to the user
    const lockstream = await prisma.lockstream.findFirst({
      where: {
        id: lockstreamId,
        userId: identityPubKey
      },
    });

    if (!lockstream) {
      throw new Error('Lockstream not found or access denied');
    }

    // Update the lockstream name
    const updatedLockstream = await prisma.lockstream.update({
      where: {
        id: lockstreamId
      },
      data: {
        name: newName
      },
    });


    return updatedLockstream

  } catch (error) {
    console.error("Error updating lockstream:", error);
    throw error; // Rethrow the error so that the caller can handle it
  }
}

// Updated function to accept additional parameters
export async function updateLockstreamDetails(
  lockstreamId: string, 
  identityPubKey: string, 
  txid: string, 
  streamPubkey: string, 
  fundingAddress: string, 
  funded: boolean
) {
  try {
    // Find the lockstream to ensure it exists and belongs to the user
    const lockstream = await prisma.lockstream.findFirst({
      where: {
        id: lockstreamId,
        userId: identityPubKey
      },
    });

    if (!lockstream) {
      throw new Error('Lockstream not found or access denied');
    }

    // Update the lockstream details
    const updatedLockstream = await prisma.lockstream.update({
      where: { id: lockstreamId },
      data: {
        txid: txid,
        streamPubkey: streamPubkey,
        fundingAddress: fundingAddress,
        funded: funded
      },
    });

    return updatedLockstream;

  } catch (error) {
    console.error("Error updating lockstream:", error);
    throw error;
  }
}

interface Vout {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
}

interface ScriptPubKey {
  asm: string;
  hex: string;
  reqSigs: number;
  type: number;
  addresses: string[];
  opReturn: null | string;
  isTruncated: boolean;
}

export type VoutInfo = {
  index: number;
  value: number;
  timestamp: number;
};

export async function getTransactionInfoforTable(txid: string): Promise<VoutInfo[]> {
  const url = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching transaction: ${response.statusText}`);
    }
    const txInfo = await response.json();

    // Extract and format the desired data from each vout
    const voutData: VoutInfo[] = txInfo.vout.map((vout: Vout) => {
      const lockedScript = bsv.Script.fromHex(vout.scriptPubKey.hex);
      const timestampHex = lockedScript.chunks[18]?.buf?.toString("hex") ?? "0";
      const timestamp = hex2Int(timestampHex);

      return {
        index: vout.n,
        value: vout.value,
        scriptPubKeyAsm: vout.scriptPubKey.asm,
        timestamp: timestamp
      };
    });

    // Filter out vouts that don't have a valid timestamp (excluding 0 and NaN)
    const validVouts = voutData.filter(vout => vout.timestamp !== 0 && !isNaN(vout.timestamp));
    
    return validVouts;
  } catch (error) {
    console.error('Error in getTransactionInfoforTable:', error);
    throw error;
  }
}


const hex2Int = (hex: string) => {
  const reversedHex = changeEndianness(hex);
  return parseInt(reversedHex, 16);
};

const changeEndianness = (hex: string) => {
  // change endianess of hex value before placing into ASM script
  const result = [];
  let len = hex.length - 2;
  while (len >= 0) {
    result.push(hex.substr(len, 2));
    len -= 2;
  }
  return result.join("");
};


