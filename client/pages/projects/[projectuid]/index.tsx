import React from "react";
import { useEffect, useState } from "react";

import s from "./projectid.module.scss";
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";
export default function Projects() {
    const router = useRouter();
    const {projectuid} = router.query;

    const {user, raiser} = useAuth();

    const [project, setProject] = useState();
    

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
    }

    useEffect(() => {
        if (user && projectuid) {
            getProject();
        }
    }, [user, projectuid])


    return (
        <main className={s.projectid}>
            {projectuid}

        </main>
    )
} 