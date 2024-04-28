import React from "react";
import { useEffect, useState } from "react";

import { Connect } from "@stacks/connect-react";
import ConnectWallet, { userSession } from "../components/ConnectWallet";
import ContractCallVote from "../components/ContractCallVote";
import Loader from "@/components/loader/loader";

import s from "./index.module.scss"
import Statistics from "@/components/statistics/statistics";
import FullProject from "@/components/project/full/fullproject";
import MiniProject from "@/components/project/mini/miniproject";


export default function Home() {

  // hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  // end hydration

  const statistics = [
    { quantity: "250,000", label: "projects funded" },
    { quantity: "$100,000,000", label: "raised" },
    { quantity: "100,000", label: "wallets" },
  ]

  if (!isClient) return (<Loader />)

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
        <h1 className={s.punchline}>
          Raise the next big thing.
        </h1>
        <Statistics />
        <section className={s.projects}>
          <div className={s.left}>
            <div>Featured Project:</div>
            <FullProject />
          </div>
          <div className={s.right}>
              <div>Recommended Projects:</div>
              <div className={s.recommended}>
                <MiniProject />
                <MiniProject />
                <MiniProject />
                <MiniProject />
              </div>
          </div>
        </section>
        {/* <ContractCallVote /> */}
      </main>
    </Connect>
  );
}

