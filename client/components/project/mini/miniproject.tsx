import React from "react";
import s from "./miniproject.module.scss";

export default function MiniProject() {
    return (
        <div className={s.miniproject}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5gvUTFXtZL2XOhaE_0sYxGqsm-T56bbJ1A&s" />
            <div className={s.name}>Project Name</div>
            <div className={s.creator}>Creator Name</div>
            <div className={s.expiry}>20 days left</div>
        </div>
    )
}