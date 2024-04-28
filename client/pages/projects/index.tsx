import React from "react";
import { useEffect, useState } from "react";

import s from "./projects.module.scss";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";

export default function Projects() {
    const {user, raiser, disconnect, connect} = useAuth()

    async function getmyprojects() {
        const projectres = await fetch(`${CVAR}/projects/get-my-projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`
            },
        });
        const projectdata = await projectres.json();
        console.log(projectdata);
    }

    // get my projects
    useEffect(() => {
        if (user?.isUserSignedIn()) {
            getmyprojects();
        }
    }, [user])
        

    return (
        <></>
    )
}