import React, { useEffect } from "react";
import s from "./explore.module.scss";
import { useRouter } from "next/router";
import { CVAR } from "@/utils/constant";
import { useAuth } from "@/authentication/authcontext";

export default function Explore() {

    const router = useRouter();

    let { search } = router.query;
    const { user, raiser, connect } = useAuth();

    async function lookup() {
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
    }

    useEffect(() => {
        console.log(search);
        if (search) {
            console.log("searching for " + search);
            lookup()
        }
    }, [search]);

    return (
        <div className={s.explore}>
            <h1>Explore</h1>
        </div>
    )
}