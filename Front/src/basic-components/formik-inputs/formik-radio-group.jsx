import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import T from "../text";
import { Field } from "formik";

export const FormikRadioGroup = ({ name, label, className, defaultValue = "", minWidth = 200, list = [] }) => {
    return (
        <FormControl sx={{ minWidth: minWidth }} className={className}>
            <FormLabel>
                <T>{label}</T>
            </FormLabel>
            <Field
                name={name}
                render={({ field, form }) => (
                    <RadioGroup row defaultValue={defaultValue} name={name}>
                        {list.map((x, index) => (
                            <FormControlLabel
                                key={`radio_${index}`}
                                value={x.id}
                                control={<Radio />}
                                onChange={() => form.setFieldValue(name, x.id)}
                                label={x.title}
                            />
                        ))}
                    </RadioGroup>
                )}
            />
        </FormControl>
    );
};
