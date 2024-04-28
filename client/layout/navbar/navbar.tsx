import React from "react";
import { useEffect, useState } from "react";

import { FaSearch, FaUser } from "react-icons/fa";

import s from "./navbar.module.scss"
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import provesign from "@/utils/sign";

export default function Navbar() {
    const router = useRouter();

    const { user, raiser, connect } = useAuth()

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const shortenString = (str: string): string => {
        if (str.length <= 8) {
            return str;
        }

        const firstPart = str.slice(0, 4);
        const lastPart = str.slice(-2);

        return `${firstPart}...${lastPart}`;
    };


    return (
        <nav className={s.nav}>
            <div className={s.rheo}
                onClick={() => { router.push("/") }}
            >
                Raise
            </div>
            <div className={s.search}>
                <div className={s.magnify}><FaSearch /></div>
                <input
                    type="text"
                    placeholder="Search for projects"
                />
            </div>
            <span>
                <button className={s.cta}
                    onClick={() => { router.push("/raise") }}
                >
                    Get Funded
                </button>
                {/* <Connect /> */}
                {
                    mounted && user?.isUserSignedIn() ?
                        <button className={s.disconnect}>
                            {raiser && raiser.stacksaddress ? shortenString(raiser.stacksaddress) : ''}
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
                            router.push("/profile")
                        }}
                    >
                        <FaUser />
                    </div>
                }
            </span>
        </nav>
    )
}