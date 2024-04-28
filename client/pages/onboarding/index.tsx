import Input from "@/components/input/input";
import { OnboardingFormData } from "@/validation/form";
import { onboardingSchema } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import s from "./onboarding.module.scss";
import { useAuth } from "@/authentication/authcontext";
import { CVAR } from "@/utils/constant";

export default function Onboarding() {

    const {raiser, askToRefresh} = useAuth();

    async function onSubmit(data: OnboardingFormData) {
        console.log(data);

        let res = await fetch(`${CVAR}/users/onboard-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                publickey: raiser?.publickey,
                signature: raiser?.signature,
            }),
        });

        console.log(await res.json());
        askToRefresh();
    }

    const { register, handleSubmit, control, formState: { errors } } =
    useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {}
    });

    return (
        <main className={s.onboarding}>
            <h1>Let's get you started</h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={s.identifier}>
                    <span>Your Stacks Address:</span>
                    <p className={s.address}>{raiser?.stacksaddress}</p>
                </div>

                <Input<OnboardingFormData>
                    type="text"
                    inputstyle="input"
                    label="First Name (optional)"
                    placeholder="First Name"
                    name="name"
                    register={register}
                    error={errors.name}
                />
                <Input<OnboardingFormData>
                    type="email"
                    inputstyle="input"
                    label="Your Email (optional)"
                    placeholder="hello@xyz.com"
                    name="email"
                    register={register}
                    error={errors.email}
                />
                <button type="submit" className={s.submit}>Continue</button>
            </form>
        </main>
    )
}


