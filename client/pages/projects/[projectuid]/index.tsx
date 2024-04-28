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
    if (project && project.creator !== raiser?.publickey) { return (<>you do not own this project</>) }
    if (project && project.deployed) { return (<>this project has already been deployed</>) }

    return (
        <main className={s.projectid}>
            {
                project &&
                <div className={s.project}>
                    <div className={s.projectname}>{project.projectname}</div>
                    <div className={s.creator}>{project.creator}</div>
                </div>
            }
        </main>
    )
} 