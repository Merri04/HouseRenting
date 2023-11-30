import { FormikInputView } from "./formik-input-view";

export const FormikEmailView = ({ name, label, className, formik, focused }) => (
    <FormikInputView label={label} className={className} name={name} type="email" formik={formik} focused={focused} />
);
