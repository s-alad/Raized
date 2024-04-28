import React from "react";
import { useEffect, useState } from "react";

import s from "./projects.module.scss";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";

interface SampleProject {
    projectname: string;
    projectuid: string;
    creator: string;
}

export default function Projects() {
    const {user, raiser, disconnect, connect} = useAuth()

    const [projects, setProjects] = useState<SampleProject[]>([]);

    async function getmyprojects() {
        const projectres = await fetch(`${CVAR}/projects/get-my-projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`
            },
        });
        const projectdata = await projectres.json();
        const projects = projectdata.projects;

        console.log(projects);
        let nprojects: SampleProject[] = [];
        for (let project of projects) {
            nprojects.push(project as SampleProject)
            console.log(project);
        }
        setProjects(nprojects);
    }

    // get my projects
    useEffect(() => {
        if (user?.isUserSignedIn()) {
            getmyprojects();
        }
    }, [user])
        
    if (!user) {
        return (
            <main className={s.projects}>
                <div className={s.projects}>
                    <div className={s.project}>
                        <div className={s.projectname}>You are not signed in</div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={s.projects}>
            {
                projects.map((project, index) => {
                    return (
                        <div key={index} className={s.project}>
                            <div className={s.projectname}>{project.projectname}</div>
                            <div className={s.creator}>{project.creator}</div>
                        </div>
                    )
                })
            }
        </main>
    )
}