import Head from "next/head";
import Image from "next/image";

import s from "./index.module.scss"

import { useEffect, useState } from "react";

import { Connect } from "@stacks/connect-react";
import ConnectWallet, { userSession } from "../components/ConnectWallet";
import ContractCallVote from "../components/ContractCallVote";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "",
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <main>  

        <div>
          {/* ConnectWallet file: `./src/components/ConnectWallet.js` */}
          <ConnectWallet />

          {/* ContractCallVote file: `./src/components/ContractCallVote.js` */}
          <ContractCallVote />
        </div>
      </main>
    </Connect>
  );
}
