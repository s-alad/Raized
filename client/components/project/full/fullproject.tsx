import React from "react";
import s from "./fullproject.module.scss";
import Project from "@/models/project";
import { getDaysUntilExpiry } from "@/utils/conversion";
import { useRouter } from "next/router";

export default function FullProject({ project }: { project: Project | undefined }) {
    const router = useRouter();
    if (!project) {
        return (
            <></>
        )
    }

    return (
        <div className={s.fullproject}
        onClick={() => router.push(`/projects/${project.projectuid}`)}
        >
            {
                project.projectdisplayimage ?
                <img src={project.projectdisplayimage} alt="project"
                    height={300}
                />
                : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5gvUTFXtZL2XOhaE_0sYxGqsm-T56bbJ1A&s" />
            }
            <div className={s.name}>{project.projectname}</div>
            <div className={s.creator}>{project.ownerstacksaddress}</div>
            <div className={s.expiry}>{getDaysUntilExpiry(project.expiry)} days left</div>
            <div className={s.raised}>
                <div className={s.bar}>
                    <div className={s.fill} style={{
                        width: project.amountraised === 0 ? "3%" : `${(project.amountraised / project.fundinggoal) * 100}%`
                    }}>
                    </div>
                </div>
                <p>{project.amountraised} / {project.fundinggoal} STX</p>
            </div>
            <div className={s.description}>{project.projectdescription}</div>
        </div>
    )
}