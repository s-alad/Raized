import React from "react";
import s from "./loader.module.scss";

export default function Loader() {
    return (
        <section className={s.loader}>
            <div className={s.spinner}></div>
        </section>
    )
}