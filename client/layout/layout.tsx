import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}