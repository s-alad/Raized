import React from "react";
import s from "./subnavbar.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";

export default function SubNavbar() {
    const router = useRouter();
    const { user, raiser, disconnect, connect } = useAuth()

    return (
        <nav className={s.subnav}>
            <div className={`${s.sub} ${router.pathname === "/" ? s.active : ""}`}>
                <Link href="/">Featured</Link>
            </div>
            <div className={`${s.sub} ${router.pathname === "/explore" ? s.active : ""}`}>
                <Link href="/explore">Explore</Link>
            </div>
            {
                user?.isUserSignedIn() &&
                <>
                    <div className={`${s.sub} ${router.pathname === "/projects" ? s.active : ""}`}>
                        <Link href="/projects">My Projects</Link>
                    </div>
                   {/*  <div className={`${s.sub} ${router.pathname === "/funded" ? s.active : ""}`}>
                        <Link href="/funded">Projects I've Funded</Link>
                    </div> */}
                </>
            }
        </nav>
    )
}