import React from "react";
import { useEffect, useState } from "react";

import s from "./projects.module.scss";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";
import Project from "@/models/project";
import { useRouter } from "next/router";

export default function Projects() {
    const {user, raiser, disconnect, connect} = useAuth()
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);

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
        let nprojects: Project[] = [];
        for (let project of projects) {
            nprojects.push(project as Project)
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
                            <div className={s.left}>
                                <img src={project.projectdisplayimage ?? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"} alt="project" />
                            </div>
                            <div className={s.content}>
                                <div className={s.projectname}>{project.projectname}</div>
                                <div className={s.creator}>{project.creator}</div>
                                <div className={s.description}>{project.projectdescription}</div>
                                <div className={`${s.deployed} ${project.deployed ? s.live : s.draft}`}>{project.deployed ? "deployed" : "draft"}</div>
                            </div>
                            <div className={s.right}>
                                <button className={s.edit}
                                    onClick={() => {
                                        router.push(`/projects/edit/${project.projectuid}`)
                                    }}
                                >enter</button>
                            </div>
                        </div>
                    )
                })
            }
        </main>
    )
}