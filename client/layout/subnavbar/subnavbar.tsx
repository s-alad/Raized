import React from "react";
import s from "./subnavbar.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubNavbar() {
    const router = useRouter();

    return (
        <nav className={s.subnav}>
            <div className={`${s.sub} ${router.pathname === "/explore" ? s.active : ""}`}>
                <Link href="/explore">Explore</Link>
            </div>
            <div className={`${s.sub} ${router.pathname === "/projects" ? s.active : ""}`}>
                <Link href="/projects">My Projects</Link>
            </div>
            <div className={`${s.sub} ${router.pathname === "/funded" ? s.active : ""}`}>
                <Link href="/funded">Projects I've Funded</Link>
            </div>
        </nav>
    )
}