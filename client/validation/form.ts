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
    name?: string;
    email?: string;
};

export interface GenericFormField<T extends FieldValues> extends DefaultFormField{
    register: UseFormRegister<T>;
    control?: Control<T>;
    name: Path<T>;
    customregistername?: Path<string>;
    options?: string[] | number[];
}