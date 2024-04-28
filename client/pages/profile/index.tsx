import React from "react";
import { useAuth } from "@/authentication/authcontext";
import s from "./profile.module.scss";


export default function Profile() {

    const {user, raiser, disconnect, connect} = useAuth()

    if (!user) {
        return (
            <main>
                ...
            </main>
        )
    }

    return (
        <main className={s.main}>
            <h1>Profile</h1>
            <p className={s.name}>{raiser?.name}</p>
            {raiser?.email ? <p className={s.email}>{raiser?.email}</p> : ''}
            <p className={s.address}>{raiser?.stacksaddress}</p>
            <button onClick={disconnect}>Sign Out</button>
        </main>
    )
}   