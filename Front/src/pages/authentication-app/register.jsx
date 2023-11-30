import { Grid, Paper } from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { FormikPasswordView, FormikTextView } from "../../basic-components/formik-inputs";
import { LoadingBtn } from "../../basic-components/buttons/loading-button";
import T from "../../basic-components/text";
import Flex from "../../basic-components/display/flex";
import { useApp } from "../../providers/app-provider";
import { useNotify } from "../../hooks/use-notify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authenticationApi } from "../../api/authentication-api";

export const Register = () => {
    const { isAuthenticated } = useApp();
    const navigate = useNavigate();
    const notify = useNotify();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = (values) => {
        setIsLoading(true);
        authenticationApi
            .register(values)
            .then((result) => {
                if (result.registered) {
                    //localStorage.setItem(Keys.TokenKey, result.registerData.token);
                    navigate("/login");
                    notify.success(t(result.message));
                } else {
                    notify.error(t(result.message));
                }
            })
            .catch((error) => {
                notify.error(t(error.message));
            })
            .finally(() => setIsLoading(false));
    };

    const validationSchema = Yup.object({
        email: Yup.string().required(t("required")),
        firstname: Yup.string().required(t("required")),
        lastname: Yup.string().required(t("required")),
        password: Yup.string().required(t("required")),
    });

    if (isAuthenticated) return <Navigate to={"/dashboard"} replace={true} />;

    return (
        <Paper sx={{ padding: 2 }} variant="elevation" elevation={5}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                            firstname: "",
                            lastname: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        {(formik) => (
                            <Form>
                                <FormikTextView name="firstname" label="firstname" className="mt-1" formik={formik} />
                                <FormikTextView name="lastname" label="lastname" className="mt-1" formik={formik} />
                                <FormikTextView name="email" label="email" className="mt-1" formik={formik} />
                                <FormikPasswordView name="password" label="password" className="mt-1" formik={formik} />

                                <LoadingBtn className="full-width mt-1" size="large" type="submit" isLoading={isLoading}>
                                    <T>register</T>
                                </LoadingBtn>

                                <Flex className="mt-1" gap="1rem" alignItems="start" direction="column">
                                    <T>have-an-account</T>
                                    <Link className="text-link" to="/login">
                                        <T>login-to-your-account</T>
                                    </Link>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </Paper>
    );
};
