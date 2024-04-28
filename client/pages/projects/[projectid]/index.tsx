import React from "react";
import { useEffect, useState } from "react";

import s from "./projects.module.scss";
import { useRouter } from "next/router";
export default function Projects() {
    const router = useRouter();
    const {projectid} = router.query;
    return (
        <>{projectid}</>
    )
} 