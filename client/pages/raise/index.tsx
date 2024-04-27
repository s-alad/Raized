import React from "react";

import s from './raise.module.scss'
import { useAuth } from "@/authentication/authcontext";

export default function Raise() {

    const {user} = useAuth()

    if (!user) {
        return (
            <main>
                <h1>Raise money for your future unicorn</h1>
                <h2>lets get you signed up</h2>
            </main>
        )
    }

    return (
        <main>
            <h1>Let's get you started</h1>
        </main>
    )
}