import React from "react";
import { useAuth } from "@/authentication/authcontext";

export default function Profile() {

    const {user} = useAuth()

    if (!user) {
        return (
            <main>
                ...
            </main>
        )
    }

    return (
        <main>
            <h1>Profile</h1>
        </main>
    )
}   