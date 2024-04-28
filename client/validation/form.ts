import Milestone from "@/models/milestone";
import { Control, FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

export type DefaultFormField = {
    type: string;
    error: FieldError | undefined;
    
    index?: number;
    placeholder?: string;
    disabled?: boolean;
    defaultvalue?: string | undefined;
    label?: string;
    inputstyle?: string;
};

export type OnboardingFormData = {
    name: string;
    email: string;
};

export type StartProjectFormData = {
    projectname: string;
}

export type CreateProjectFormData = {
    projectpunchline: string;
    projectdescription: string;
    /* projectmarkdown: string; */
    projectdisplayimage: File;
    /* projectimages: string[]; */
    /* tags: string[]; */
    expiry: string;
    fundinggoal: number;
    milestones: Milestone[];
};

export interface GenericFormField<T extends FieldValues> extends DefaultFormField{
    register: UseFormRegister<T>;
    control?: Control<T>;
    name: Path<T>;
    customregistername?: Path<string>;
    options?: string[] | number[];
}