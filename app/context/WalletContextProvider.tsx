'use client'

import { SendBsv, SendBsvResponse, usePandaWallet } from "panda-wallet-provider";
import { createContext, useContext, useEffect, useState } from "react";
import { createNewUser } from "../actions";

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletContextType {
  handleConnect: () => Promise<boolean>
  identityPubKey: string | undefined
  bsvAddress: string | undefined
  satoshiBalance: number
  sendBsv: (paymentParams: SendBsv[]) => Promise<SendBsvResponse | undefined>; 
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("an error occured in the wallet provider");
  }
  return context;
};

export function WalletContextProvider({ children }: {
  children: React.ReactNode
}) {
  const wallet = usePandaWallet();

  const [identityPubKey, setIdentityPubKey] = useState<string | undefined>(undefined)
  const [bsvAddress, setbsvAddress] = useState<string | undefined>(undefined)
  const [satoshiBalance, setSatoshiBalance] = useState<number>(0)


  const handleConnect = async () => {
    const isReady = wallet?.isReady;
    if (!isReady) {
      window.open(
        "https://chromewebstore.google.com/detail/panda-wallet/mlbnicldlpdimbjdcncnklfempedeipj",
        "_blank"
      );
      return false;
    };

    if (isReady) {
      const identityPubKey = await wallet.connect();

      if (identityPubKey) {
        setIdentityPubKey(identityPubKey);
        createNewUser(identityPubKey)
        console.log(identityPubKey);

        const balances = await wallet.getBalance();

        if (balances) {
          setSatoshiBalance(balances.satoshis)
        }

        const addresses = await wallet.getAddresses();
        const bsvAddress = addresses?.bsvAddress
        console.log(bsvAddress)
        setbsvAddress(bsvAddress)
      }
    };
    return false
  };

  const sendBsv = async (paymentParams: SendBsv[]): Promise<SendBsvResponse | undefined> => {
    try {
      const broadcast = await wallet.sendBsv(paymentParams);

      if (broadcast) {
        return broadcast
      }

    } catch (err) {
      throw err;
    }
  }

  return (

    <WalletContext.Provider value={{ handleConnect, identityPubKey, bsvAddress, satoshiBalance, sendBsv }}>
      {children}
    </WalletContext.Provider>

  );
}

