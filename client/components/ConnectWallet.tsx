"use client";

import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, SignatureData, SignatureRequestOptions, UserSession } from "@stacks/connect";

import { openSignatureRequestPopup } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { useConnect } from "@stacks/connect-react";

const appConfig = new AppConfig(["store_write", "publish_data"]);


export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "rheo",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { sign } = useConnect();
  const signmessage = async () => {
    const options: SignatureRequestOptions = {
      message: "authentication",
      appDetails: {
        name: "rheo",
        icon: window.location.origin + "/logo512.png",
      },
      onFinish(data: SignatureData) {
        console.log('Signature of the message', data.signature);
        console.log('User public key:', data.publicKey);
      },
    };
    await sign(options);
  };

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <div className="Container">
        <button className="Connect" onClick={disconnect}>
          Disconnect Wallet
        </button>
        <button className="sign" onClick={signmessage}>
          sign message
        </button>
        <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p>
      </div>
    );
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
