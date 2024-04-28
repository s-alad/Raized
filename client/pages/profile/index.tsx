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
            {raiser?.email ? <p className={s.email}><i>{raiser?.email}</i></p> : ''}
            <p className={s.address}><i>{raiser?.stacksaddress}</i></p>
            <button onClick={disconnect}>Sign Out</button>
        </main>
    )
}   