import React from "react";
import { useEffect, useState } from "react";

import s from "./dao.module.scss";
import { useRouter } from "next/router";
export default function Projects() {
    const router = useRouter();
    const {projectid} = router.query;
    const [frozen, setFrozen] = useState(false);


    return (
        <>
            {frozen ? <p>freeze</p> : 
            
            <div className={s.main}>
                <div className={s.chat}>
                    <div>Chat is this real?</div>
                    <input></input>
                    <button>↑</button>
                </div>
            </div>
            
            }

        </>
    )
}