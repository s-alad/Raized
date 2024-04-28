import React from "react";
import s from "./fullproject.module.scss";

export default function FullProject() {
    return (
        <div className={s.fullproject}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5gvUTFXtZL2XOhaE_0sYxGqsm-T56bbJ1A&s" />
            <div className={s.name}>Project Name</div>
            <div className={s.creator}>Creator Name</div>
            <div className={s.expiry}>20 days left</div>
            <div className={s.progress}>69% funded - 69,000/100,000 </div>
            <div className={s.description}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus rerum perspiciatis officia animi facilis quasi eveniet quis doloremque? Reprehenderit qui nesciunt perspiciatis sunt mollitia vitae fugit unde eos dignissimos neque!</div>
        </div>
    )
}