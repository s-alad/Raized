import { z, ZodEnum, ZodType } from "zod"; // Add new import
import { OnboardingFormData, StartProjectFormData, } from "./form";

// name that is optional, however if given must be min 1 character max 50 characters

export const onboardingSchema: ZodType<OnboardingFormData> = z
    .object({
        name: z.string().optional(),
        email: z.string().optional(),
    })

export const startProjectSchema: ZodType<StartProjectFormData> = z
    .object({
        projectname: z.string().min(1).max(50),
    })