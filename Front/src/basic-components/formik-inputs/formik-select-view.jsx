import React from "react";
import { FormikInputView } from "./formik-input-view";

export const FormikSelectView = ({ items, focused, name, label, className, variant = "outlined", formik, minWith }) => (
    <FormikInputView
        minWith={minWith}
        label={label}
        className={className}
        name={name}
        variant={variant}
        type="email"
        formik={formik}
        focused={focused}
        items={items}
        select
    />
);
