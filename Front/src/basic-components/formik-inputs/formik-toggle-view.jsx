import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

export const FormikToggleView = ({ name, label, disabled, focused, className, formik }) => {
    const { t } = useTranslation();
    return (
        <FormControlLabel
            label={t(label)}
            className={className}
            control={
                <Checkbox
                    disabled={disabled}
                    autoFocus={focused}
                    variant="standard"
                    name={name}
                    id={name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    checked={formik.values[name]}
                    error={formik.touched[name] && Boolean(formik.errors[name])}
                />
            }
        />
    );
};
