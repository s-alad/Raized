import React from "react";
import { useEffect, useState } from "react";

import { FaSearch, FaUser } from "react-icons/fa";

import s from "./navbar.module.scss"
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import provesign from "@/utils/sign";

export default function Navbar() {
    const router = useRouter();

    const {user, raiser, disconnect, connect} = useAuth()

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);


    return (
        <nav className={s.nav}>
            <div className={s.rheo}>
                Raise
            </div>
            <div className={s.search}>
                <div className={s.magnify}><FaSearch /></div>
                <input />
            </div>
            <span> 
                <button className={s.cta}
                    onClick={() => {router.push("/raise")}}
                >
                    Get Funded
                </button>
                {/* <Connect /> */}
                {
                    mounted && user?.isUserSignedIn() ?
                    <button className={s.disconnect} onClick={disconnect}>
                        Disconnect Wallet
                    </button>
                    : 
                    <button className={s.connect} onClick={connect}>
                        Connect Wallet
                    </button>
                }
                {
                    mounted && user?.isUserSignedIn() && 
                    <div className={s.profile}
                        onClick={() => {
                            console.log(raiser)
                        }}
                    >
                        <FaUser />
                    </div>
                }
            </span>
        </nav>
    )
}