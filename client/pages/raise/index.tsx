import React from "react";

import s from './raise.module.scss'
import { useAuth } from "@/authentication/authcontext";
import Input from "@/components/input/input";
import { StartProjectFormData } from "@/validation/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startProjectSchema } from "@/validation/schema";

export default function Raise() {

    const {user, connect} = useAuth()

    const faq = [
        {
            question: "What can I raise with Raze?",
            answer: "You can raise funds for your project, idea, or business. We support projects in all categories."
        },
        {
            question: "How does Raze work?",
            answer: "You can create a project, set a funding goal, and share it with the world. People can contribute to your project and help you reach your goal."
        },
        {
            question: "How do I get started?",
            answer: "You can connect your wallet and start creating your project. You can also browse projects and contribute to them."
        }
    ]

    async function onSubmit(data: StartProjectFormData) {
        console.log(data);
    }

    const { register, handleSubmit, control, formState: { errors } } =
    useForm<StartProjectFormData>({
        resolver: zodResolver(startProjectSchema),
        defaultValues: {}
    });


    if (!user) {
        return (
            <main className={s.raise}>
                <h1>Raise money for your future project</h1>
                <button className={s.getstarted}
                    onClick={connect}
                >
                    Connect Wallet & Get Started
                </button>
                <div className={s.divider}></div>
                <div className={s.faq}>
                    {
                        faq.map((q, i) => (
                            <div key={i} className={s.aq}>
                                <div className={s.question}>{q.question}</div>
                                <div className={s.answer}>{q.answer}</div>
                            </div>
                        ))
                    }
                </div>
            </main>
        )
    }

    return (
        <main className={s.raise}>
            <h1>Let's get your project on the moon </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <Input<StartProjectFormData>
                    type="text"
                    inputstyle="input"
                    label="What Will Be Your Project's Name?"
                    placeholder="EasyA"
                    name="projectname"
                    register={register}
                    error={errors.projectname}
                />
                <button type="submit" className={s.submit}>Start!</button>
            </form>

        </main>
    )
}