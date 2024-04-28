import React from "react";
import { useEffect, useState } from "react";

import s from "./edit.module.scss";
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";
import Project from "@/models/project";
import Loader from "@/components/loader/loader";
import { CreateProjectFormData } from "@/validation/form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@/validation/schema";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import ImageInput from "@/components/image/image";
import { base64ToBlob, blobToFile } from "@/utils/conversion";

import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
/* import { readFileSync } from "fs"; */

export default function Projects() {
    const router = useRouter();
    const { projectuid } = router.query;

    const { user, raiser } = useAuth();
    const [project, setProject] = useState<Project>();

    const [previewImage, setPreviewImage] = useState<string>("");

    async function onSubmit(data: CreateProjectFormData) {
        console.log(data);

        // encode the image into base64
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result?.toString();
            console.log(data);
            const uploadres = await fetch(`${CVAR}/projects/upload-project?projectuid=${projectuid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "publickey": `${raiser?.publickey}`,
                    "signature": `${raiser?.signature}`
                },
                body: JSON.stringify({
                    projectuid,
                    projectpunchline: data.projectpunchline,
                    projectdescription: data.projectdescription,
                    projectdisplayimage: base64,
                    expiry: data.expiry,
                    fundinggoal: data.fundinggoal,
                    milestones: data.milestones
                })
            })

            console.log(uploadres);

            if (uploadres.ok) {
                console.log("project uploaded successfully");

                /* const campaignres = await fetch(`${CVAR}/contract`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }); */
                const campaignres = await fetch('/Campaign.clar')

                const campagin = await (await campaignres.text()).toString();
                console.log(campagin);

                const network = new StacksTestnet();
                const txOptions = {
                    contractName: 'contract_name',
                    codeBody: campagin,
                    senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
                    network,
                    anchorMode: AnchorMode.Any,
                };

                console.log(txOptions);
                const transaction = await makeContractDeploy(txOptions);

                const broadcastResponse = await broadcastTransaction(transaction, network);
                const txId = broadcastResponse.txid;
            }
        }
        reader.onerror = error => console.log(error);
        reader.readAsDataURL(data.projectdisplayimage);
    }

    const { register, handleSubmit, reset, control, formState: { errors } } =
        useForm<CreateProjectFormData>({
            resolver: zodResolver(createProjectSchema),
            defaultValues: {
                milestones: [{ milestonename: "", milestonedescription: "" }]
            }
        });

    const { fields, append, remove, update, } = useFieldArray({ control, name: "milestones" });


    async function getProject() {
        const res = await fetch(`${CVAR}/projects/get-project?projectuid=${projectuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`
            },
        });

        const data = await res.json();
        console.log(data);
        const proj = data.project as Project;
        setProject(proj);

        let imageBlob; let imageFile;
        if (proj.projectdisplayimage) {
            console.log(proj.projectdisplayimage);
            imageBlob = base64ToBlob(proj.projectdisplayimage, 'image/jpeg');
            imageFile = blobToFile(imageBlob, 'project_display_image.jpg');
        }
        console.log(imageFile);
        setPreviewImage(proj.projectdisplayimage);

        reset({
            projectpunchline: proj.projectpunchline,
            projectdescription: proj.projectdescription,
            fundinggoal: proj.fundinggoal,
            projectdisplayimage: imageFile,
            expiry: proj.expiry,
            milestones: proj.milestones
        });
    }

    useEffect(() => {
        if (user && projectuid) { getProject(); }
    }, [user, projectuid])

    if (!user || !projectuid) { return <Loader /> }
    if (project && project.creator !== raiser?.publickey) { return (<>you do not own this project</>) }
    if (project && project.deployed) { return (<>this project has already been deployed</>) }

    return (
        <main className={s.edit}>
            {
                project &&
                <div className={s.project}>
                    <div className={s.projectname}>{project.projectname}</div>
                    <div className={s.creator}>{project.creator}</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input<CreateProjectFormData>
                            name="projectpunchline"
                            label="Project Punchline"
                            register={register}
                            control={control}
                            error={errors.projectpunchline}
                            type="text"
                            placeholder="Enter the punchline of your project"
                        />
                        <Input<CreateProjectFormData>
                            name="projectdescription"
                            label="Project Description"
                            register={register}
                            control={control}
                            error={errors.projectdescription}
                            type="text"
                            inputstyle="textarea"
                            placeholder="Enter the description of your project"
                        />
                        <ImageInput
                            name="projectdisplayimage"
                            control={control}
                            error={errors.projectdisplayimage}
                            label="Project Display Image"
                            previewimg={previewImage}
                            callback={setPreviewImage}
                        />
                        <div className={s.milestones}>
                            <label>Milestones</label>
                            {
                                fields.map((field, index) => {
                                    console.log(field);
                                    return (
                                        <div className={s.milestone} key={index}>
                                            <label className={s.mile}>{index + 1}</label>
                                            <div className={s.stone}>
                                                <Input<CreateProjectFormData>
                                                    type={"text"}
                                                    placeholder={"Enter the name of the milestone"}
                                                    register={register}
                                                    name={`milestones.${index}.milestonename` as const}
                                                    control={control}
                                                    error={errors.milestones?.[index]?.milestonename}
                                                />
                                                <Input<CreateProjectFormData>
                                                    type={"text"}
                                                    placeholder={"Enter the description of the milestone"}
                                                    register={register}
                                                    name={`milestones.${index}.milestonedescription` as const}
                                                    control={control}
                                                    error={errors.milestones?.[index]?.milestonedescription}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className={s.functionality}>
                                <div className={s.add} onClick={() => {
                                    if (fields.length < 5) {
                                        append({ milestonename: "", milestonedescription: "" });
                                    }
                                }}>
                                    + Add Milestone
                                </div>
                                <div className={s.remove} onClick={() => {
                                    if (fields.length > 1) {
                                        remove(fields.length - 1);
                                    }
                                }}>
                                    - Remove Milestone
                                </div>
                            </div>
                        </div>
                        <div className={s.goal}>
                            <Input<CreateProjectFormData>
                                name="fundinggoal"
                                label="Funding Goal"
                                register={register}
                                control={control}
                                error={errors.fundinggoal}
                                type="number"
                                placeholder="Enter the funding goal of your project"
                            />
                        </div>
                        <Input<CreateProjectFormData>
                            name="expiry"
                            label="Duration"
                            register={register}
                            control={control}
                            error={errors.expiry}
                            type="date"
                            placeholder="Enter the duration of your fundraising"
                        />
                        <Button text="DEPLOY" type="submit"
                            onClick={() => {
                                console.log("deploying project")
                                console.log(errors.expiry)
                            }}
                        />
                    </form>
                </div>
            }
        </main>
    )
} 