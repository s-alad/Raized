import React from "react";
import { useEffect, useState } from "react";

import s from "./owner.module.scss";
import { useRouter } from "next/router";
export default function Index() {
    const router = useRouter();
    const {projectuid} = router.query;


    return (
        <>
            <div className={s.main}>
                <div className={s.left}>
                    <div>
                        <h1>Current Milestone</h1>
                        <p>2/3</p>
                    </div>
                    <div>
                        <h1>Claim Milestone</h1>
                        <button>Claim</button>
                    </div>
                </div>
                <div className={s.right}>
                    <div>
                        <h1>Submit Milestone</h1>
                        <button>Submit</button>
                    </div>
                    <div>
                        <h1>Total Left In Bank</h1>
                        <p>10,000 / 50,0000</p>
                    </div>
                </div>
            </div>

        </>
    );

}