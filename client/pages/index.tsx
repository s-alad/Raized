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
import { CVAR } from "@/utils/constant";
import { useAuth } from "@/authentication/authcontext";
import Project from "@/models/project";

export default function Home() {

  const {user, raiser} = useAuth();
  const [featuredProject, setFeaturedProject] = useState<Project>();
  const [projects, setProjects] = useState<Project[]>();
  const [loading, setLoading] = useState(false);

  // hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { 
    setIsClient(true);
    if (user) {
      getfeaturedproject()
    }
  }, [user]);
  // end hydration

  const statistics = [
    { quantity: "250,000", label: "projects funded" },
    { quantity: "$100,000,000", label: "raised" },
    { quantity: "100,000", label: "wallets" },
  ]

  async function getprojects(fid: string) {
    const response = await fetch(`${CVAR}/projects/get-projects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "publickey": `${raiser?.publickey}`,
          "signature": `${raiser?.signature}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setProjects((data.projects as Project[]).filter((project: Project) => project.projectuid !== fid));
    setLoading(false);
    return data;
  }

  async function getfeaturedproject() {
    setLoading(true);
    const response = await fetch(`${CVAR}/projects/get-featured-project`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "publickey": `${raiser?.publickey}`,
          "signature": `${raiser?.signature}`,
        },
      }
    );
    const data = await response.json();
    setFeaturedProject(data.project as Project);
    getprojects((data.project as Project).projectuid);
    return data;
  }

  if (!isClient || loading) return (<Loader />)

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
          Raize the next big thing.
        </h1>
        <Statistics />
        <section className={s.projects}>
          <div className={s.left}>
            <div className={s.det}>Featured Project:</div>
            <FullProject project={featuredProject} />
          </div>
          <div className={s.right}>
              <div className={s.det}>Recommended Projects:</div>
              <div className={s.recommended}>
                {
                  projects?.splice(0, 4).map((project, index) => (
                    <div className={s.project}><MiniProject key={index} project={project} /></div>
                  ))
                }
              </div>
          </div>
        </section>
        {/* <ContractCallVote /> */}
      </main>
    </Connect>
  );
}

