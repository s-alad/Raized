import React, { useState } from "react";

import s from "./image.module.scss";
import { Control, Controller, FieldError, FieldErrors } from "react-hook-form";

interface ImageInputProps {
    name: string
    control: Control<any>;
    error: FieldError | undefined;
    label?: string;
    previewimg: string;
    callback: (s: string) => void;
}


export default function ImageInput({ label, name, control, error, previewimg, callback }: ImageInputProps) {

    return (
        <div>
        {label && <label htmlFor={name} className={s.label}>{label}</label>}
        <Controller
            name={name}
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
                <div className={s.photo}>
                    <label htmlFor={name} className={s.upload}>
                        +
                    </label>
                    <input
                        id={name}
                        type="file"
                        accept="image/*"
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => {
                            const file = e.target.files![0];
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                callback(e.target!.result as string);
                            }
                            reader.readAsDataURL(file);
                            console.log(e.target.files?.[0])
                            onChange(e.target.files?.[0])
                        }}
                    />
                    {
                        previewimg && <img src={previewimg} alt="preview" />
                    }
                    {error && <span className={s.error}>*{error.message}</span>}
                </div>
            )}
        />
        </div>
    )
}