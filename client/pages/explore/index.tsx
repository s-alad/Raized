import React, { useEffect, useState } from "react";
import s from "./explore.module.scss";
import { useRouter } from "next/router";
import { CVAR } from "@/utils/constant";
import { useAuth } from "@/authentication/authcontext";
import Project from "@/models/project";
import FullProject from "@/components/project/full/fullproject";
import Loader from "@/components/loader/loader";

export default function Explore() {

    const router = useRouter();

    let { search } = router.query;
    const { user, raiser, connect } = useAuth();
    let [loading, setLoading] = useState(false);
    let [projects, setProjects] = useState<Project[]>();

    async function lookup() {
        setLoading(true);
        console.log("searching for " + search);

        const searchres = await fetch(`${CVAR}/projects/get-projects-by-search?search=${search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`,
            }
        });
        const data = await searchres.json();
        console.log(data);
        setProjects(data.projects as Project[]);
        setLoading(false);
    }

    useEffect(() => {
        console.log(search);
        if (search) {
            console.log("searching for " + search);
            lookup()
        } else {
            setLoading(true);
            fetch(`${CVAR}/projects/get-projects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "publickey": `${raiser?.publickey}`,
                    "signature": `${raiser?.signature}`,
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setProjects(data.projects as Project[]);
                    setLoading(false);
                })
        }
    }, [search]);

    if (loading) {
        return <Loader />
    }

    return (
        <main className={s.explore}>
            <h1>Explore</h1>
            <section className={s.projects}>
                {
                        projects?.map((project: Project) => {
                            return (
                                <div className={s.project}><FullProject key={project.projectuid} project={project} /></div>
                            )
                        })
                }
            </section>
        </main>
    )
}