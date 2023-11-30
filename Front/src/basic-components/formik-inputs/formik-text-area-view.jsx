import styled from "@emotion/styled";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { FormControl, FormLabel } from "@mui/material";
import T from "../text";

export const FormikTextAreaView = ({ name, label, disabled, focused, minWidth = "100%", className, formik }) => {
    const blue = {
        100: "#DAECFF",
        200: "#b6daff",
        400: "#3399FF",
        500: "#007FFF",
        600: "#0072E5",
        900: "#003A75",
    };

    const grey = {
        50: "#F3F6F9",
        100: "#E5EAF2",
        200: "#DAE2ED",
        300: "#C7D0DD",
        400: "#B0B8C4",
        500: "#9DA8B7",
        600: "#6B7A90",
        700: "#434D5B",
        800: "#303740",
        900: "#1C2025",
    };

    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
    width: 100%;
    min-width: ${minWidth};
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 4px 4px 0 4px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
    );

    return (
        <FormControl sx={{ minWidth: minWidth }} className={className}>
            <FormLabel>
                <T>{label}</T>
            </FormLabel>
            <Textarea
                label={label}
                name={name}
                disabled={disabled}
                focused={focused}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
            />
        </FormControl>
    );
};
