import React from "react";
import { useEffect, useState } from "react";

import s from "./projectid.module.scss";
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";
export default function Projects() {
    const router = useRouter();
    const {projectid} = router.query;

    const {user, raiser} = useAuth();

    const [project, setProject] = useState();
    

    async function getProject() {
        const res = await fetch(`${CVAR}/projects/get-project?projectuid=${projectid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`
            },
        });

        const data = await res.json();  
        console.log(data);
    }

    useEffect(() => {
        if (user && projectid) {
            getProject();
        }
    }, [user, projectid])


    return (
        <main className={s.projectid}>
            {projectid}

        </main>
    )
} 