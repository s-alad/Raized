import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import SubNavbar from "./subnavbar/subnavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <SubNavbar />
            {children}
        </>
    )
}