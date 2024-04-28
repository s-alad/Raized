import React from "react";
import s from "./miniproject.module.scss";
import Project from "@/models/project";
import { getDaysUntilExpiry } from "@/utils/conversion";
import { useRouter } from "next/router";

export default function MiniProject({ project }: { project: Project | undefined }) {

    const router = useRouter();

    if (!project) {
        return (
            <></>
        )
    }
    return (
        <div className={s.miniproject}
            onClick={() => router.push(`/projects/${project.projectuid}`)}
        >
            {
                project.projectdisplayimage ?
                <img src={project.projectdisplayimage} alt="project" />
                : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5gvUTFXtZL2XOhaE_0sYxGqsm-T56bbJ1A&s" />
            }
            <div className={s.information}>
            <div className={s.name}>{project.projectname}</div>
            <p className={s.creator}>{project.ownerstacksaddress}</p>
            <div className={s.expiry}>
            <div className={s.expiry}>{getDaysUntilExpiry(project.expiry)} days left</div>
            </div>
            </div>
        </div>
    )
}