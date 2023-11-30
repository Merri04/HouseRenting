import { FormikInputView } from "./formik-input-view";

export const FormikPasswordView = ({ name, label, className, formik }) => (
    <FormikInputView label={label} className={className} name={name} type="password" formik={formik} />
);
