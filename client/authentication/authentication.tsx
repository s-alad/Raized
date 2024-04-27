"use client";

import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, SignatureData, SignatureRequestOptions, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

import s from "./authentication.module.scss";

function authenticate() {
    showConnect({
        appDetails: {
            name: "rheo",
            icon: window.location.origin + "/logo512.png",
        },
        redirectTo: "/",
        onFinish: () => {
            window.location.reload();
        },
        userSession,
    });
}

function disconnect() { userSession.signUserOut("/"); }

function Connect() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (mounted && userSession.isUserSignedIn()) {
        return (
            <button className={s.disconnect} onClick={disconnect}>
                Disconnect Wallet
            </button>
        );
    }
    "Connect"
    return (
        <button className={s.connect} onClick={authenticate}>
            Connect Wallet
        </button>
    );
};

export default Connect;
