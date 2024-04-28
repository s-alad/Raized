import React, { useEffect, useState } from "react";
import s from "./statistics.module.scss";
import { CVAR } from "@/utils/constant";
export default function Statistics() {

    let [statistics, setStatistics] = useState([
        { quantity: "250,000", label: "projects funded" },
        { quantity: "100,000 STX", label: "raised" },
        { quantity: "100,000", label: "funders" },
    ]);

    async function getlength() {
        const response = await fetch(`${CVAR}/projects/get-stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data
    }

    useEffect(() => {
        console.log("Statistics component mounted");
        getlength().then((data) => {
            setStatistics([
                { quantity: data.projects, label: "projects funded" },
                { quantity: data.amount, label: "raised" },
                { quantity: data.users, label: "funders" },
            ]);
        });
    }, []);
    return (
        <section className={s.statistics}>
            {
                statistics.map((stat, i) => (
                    <div className={s.stat} key={i}>
                        <div className={s.quantity}>{stat.quantity}</div>
                        <div className={s.label}>{stat.label}</div>
                    </div>
                ))
            }
        </section>
    )
}