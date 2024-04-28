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

    const [search, setSearch] = useState("");

    async function lookup() {
        if (search) {
            // if not currently on /explore page, then navigate to explore with search query in url
            if (!router.pathname.includes("/explore")) {
                setSearch("")
                router.push(`/explore?search=${search}`);
            } else {
                // if currently on /explore page, then update the search query in url
                setSearch("")
                router.replace(`/explore?search=${search}`);
            }
            
        }
    }

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
                Raized
            </div>
            <div className={s.search}>
                <input
                    type="text"
                    placeholder="Search for projects"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={s.magnify}
                    onClick={lookup}
                ><FaSearch /></div>
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