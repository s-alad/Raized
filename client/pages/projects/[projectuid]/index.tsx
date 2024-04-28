import React from "react";
import { useEffect, useState } from "react";

import s from "./projectid.module.scss";
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";
import Project from "@/models/project";
import Loader from "@/components/loader/loader";
import { CreateProjectFormData } from "@/validation/form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@/validation/schema";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import ImageInput from "@/components/image/image";
import { getDaysUntilExpiry } from "@/utils/conversion";
export default function Projects() {
    const router = useRouter();
    const { projectuid } = router.query;

    const {user, raiser} = useAuth();
    const [project, setProject] = useState<Project>();

    

    async function getProject() {
        const res = await fetch(`${CVAR}/projects/get-project?projectuid=${projectuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`
            },
        });

        const data = await res.json();  
        console.log(data);
        const proj = data.project as Project;
        setProject(proj);
    }

    useEffect(() => {
        if (user && projectuid) {
            getProject();
        }
    }, [user, projectuid])

    if (!user || !projectuid) { return <Loader /> }
    if (!project) { return <Loader /> }

    if (!project.deployed) {
        return (<main className={s.notdeployed}>project not deployed.</main>)
    }

    return (
        <main className={s.projectid}>
            {
                project &&
                <div className={s.project}>
                    <div className={s.info}>
                        <div className={s.left}>
                            <div className={s.projectname}>{project.projectname}</div>
                            <div className={s.punchline}>{project.projectpunchline}</div>
                            <div className={s.creator}>stx.{project.ownerstacksaddress}</div>
                        </div>
                        <div className={s.right}>
                            <button className={s.fund}>fund!</button>
                        </div>
                    </div>
                    <div className={s.content}>
                        <img src={project.projectdisplayimage} alt={project.projectname} />
                        <div className={s.details}>
                            <div className={s.detail}>
                                <label>description:</label>
                                <p>{project.projectdescription}</p>
                            </div>
                            <div className={s.detail}>
                                <label>duration:</label>
                                <p>{project.expiry}</p>
                                <p>ending in {getDaysUntilExpiry(project.expiry)} days from now</p>
                            </div>
                            <div className={s.detail}>
                                <label>raised:</label>
                                <div className={s.raised}>
                                    <div className={s.bar}>
                                        <div className={s.fill} style={{ 
                                            width: project.amountraised === 0 ? "3%" : `${(project.amountraised / project.fundinggoal) * 100}%`
                                        }}>
                                        </div>
                                    </div>
                                    <p>{project.amountraised} / {project.fundinggoal} STX</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={s.milestones}>
                        {
                            project.milestones.map((milestone, index) => {
                                return (
                                    <div className={s.milestone} key={index}>
                                        <div className={s.mile}>
                                            <div>milestone</div>
                                            <label>{index + 1}</label></div>
                                        <div className={s.stone}>
                                            <div className={s.name}>{milestone.milestonename}</div>
                                            <div className={s.desc}>{milestone.milestonedescription}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>


                </div>
            }
        </main>
    )
} 