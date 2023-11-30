import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import T from "../text";
import { Field } from "formik";
import { Stack } from "@mui/material";

export const FormikDateView = ({ name, label, disabled, focused, className }) => (
    <Stack flex flexDirection="row">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Field
                name={name}
                render={({ field, form }) => {
                    return (
                        <DatePicker
                            views={["year", "month", "day"]}
                            className={className}
                            disabled={disabled}
                            autoFocus={focused}
                            label={<T>{label}</T>}
                            onChange={(value) => form.setFieldValue(name, value ?? "")}
                        />
                    );
                }}
            />
        </LocalizationProvider>
    </Stack>
);
