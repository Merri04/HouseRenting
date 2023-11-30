import { FormikInputView } from "./formik-input-view";

export const FormikTextView = ({ name, label, disabled, focused, className, formik }) => (
    <FormikInputView className={className} label={label} name={name} disabled={disabled} type="text" formik={formik} focused={focused} />
);
