import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export const FormikInputView = ({
    name,
    label,
    focused,
    disabled,
    className,
    variant = "outlined",
    items = [],
    type,
    select = false,
    minWith = 200,
    formik,
}) => {
    const { t } = useTranslation();
    return (
        <>
            {!formik && <div style={{ border: "1px solid red", color: "red" }}>pass parent formik variable</div>}
            {formik && (
                <TextField
                    sx={{ minWidth: minWith }}
                    disabled={disabled}
                    fullWidth
                    autoFocus={focused}
                    className={className}
                    variant={variant}
                    label={t(label) || t(name)}
                    id={name}
                    name={name}
                    select={select}
                    type={type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[name]}
                    error={formik.touched[name] && Boolean(formik.errors[name])}
                    helperText={formik.touched[name] && formik.errors[name]}>
                    {items.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                            {x.title}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        </>
    );
};
