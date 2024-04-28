import React from "react";
import s from "./statistics.module.scss";
export default function Statistics() {

    const statistics = [
        { quantity: "250,000", label: "projects funded" },
        { quantity: "$100,000,000", label: "raised" },
        { quantity: "100,000", label: "wallets" },
    ]

    return (
        <section className={s.statistics}>
            {
                statistics.map((stat, i) => (
                    <div className={s.stat}>
                        <div className={s.quantity}>{stat.quantity}</div>
                        <div className={s.label}>{stat.label}</div>
                    </div>
                ))
            }
        </section>
    )
}