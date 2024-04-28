import { z, ZodEnum, ZodType } from "zod"; // Add new import
import { OnboardingFormData, } from "./form";

// name that is optional, however if given must be min 1 character max 50 characters

export const onboardingSchema: ZodType<OnboardingFormData> = z
    .object({
        name: z.string().optional(),
        email: z.string().optional(),
    })