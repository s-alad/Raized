import React from "react";
import { useEffect, useState } from "react";

import { AppConfig, showConnect, SignatureData, SignatureRequestOptions, UserSession } from "@stacks/connect";
import { openSignatureRequestPopup } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { useConnect } from "@stacks/connect-react";
import Connect, { userSession } from "@/authentication/authentication";

import s from "./navbar.module.scss"

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);


    return (
        <nav className={s.nav}>
            <div className={s.rheo}>
                RHEO
            </div>
            {
                mounted && userSession.isUserSignedIn() ? "signed in" : "not signed in"
            }
            <span> 
                <button className={s.cta}>
                    get funded
                </button>
                <Connect />
            </span>
        </nav>
    )
}