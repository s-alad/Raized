import React from "react";
import { useEffect, useState } from "react";

import s from "./dao.module.scss";
import { useRouter } from "next/router";
export default function Projects() {
    const router = useRouter();
    const {projectuid} = router.query;
    const [frozen, setFrozen] = useState(false);


    return (
        <>
            {frozen ? <p>freeze</p> : 
            
            <div className={s.main}>
                <div className={s.chat}>
                    <h1>Chat</h1>
                    <div>Chat is this real?</div>
                    <input></input>
                    <button>↑</button>
                </div>
                <div className={s.milestones}>
                    <h1>Milestone Submissions</h1>
                    <ul>
                        <li>1</li>
                        <li>2</li>
                    </ul>
                </div>
                <div className={s.voteFreeze}>
                    <h1>Number of votes to freeze</h1>
                    <p>5</p>
                    <button>Freeze Project</button>
                </div>

            </div>
            
            }

        </>
    )
}