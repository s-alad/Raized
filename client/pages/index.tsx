import React from "react";
import { useEffect, useState } from "react";

import { Connect } from "@stacks/connect-react";
import ConnectWallet, { userSession } from "../components/ConnectWallet";
import ContractCallVote from "../components/ContractCallVote";
import Loader from "@/components/loader/loader";

import s from "./index.module.scss"


export default function Home() {

  // hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true);}, []);
  if (!isClient) return ( <Loader/> )
  // end hydration

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "",
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => { window.location.reload(); },
        userSession,
      }}
    >
      <main className={s.main}>
          <ContractCallVote />
      </main>
    </Connect>
  );
}

