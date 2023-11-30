import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { authenticationApi } from "../../api/authentication-api";
import { FormikPasswordView, FormikTextView } from "../../basic-components/formik-inputs";
import { Keys } from "../../consts/enums";
import { Link, Navigate } from "react-router-dom";
import { useApp } from "../../providers/app-provider";
import { useNotify } from "../../hooks/use-notify";
import { useQuery } from "../../hooks/use-query";
import { Grid, Paper } from "@mui/material";
import { LoadingBtn } from "../../basic-components/buttons/loading-button";
import T from "../../basic-components/text";
import { useTranslation } from "react-i18next";
import Flex from "../../basic-components/display/flex";

export const Login = () => {
    const { checkUserInfo, isAuthenticated } = useApp();
    const query = useQuery();
    const url = query.get(Keys.ReturnUrl);
    const notify = useNotify();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = (values) => {
        setIsLoading(true);
        authenticationApi
            .login(values)
            .then((result) => {
                if (result.loggedIn) {
                    localStorage.setItem(Keys.TokenKey, result.loginData.token);
                    checkUserInfo();
                    notify.success(t("login-success"));
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
        password: Yup.string().required(t("required")),
    });

    if (isAuthenticated) return <Navigate to={url ?? "/"} replace={true} />;
    return (
        <Paper sx={{ padding: 2 }} variant="elevation" elevation={5}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        {(formik) => (
                            <Form>
                                <FormikTextView name="email" label="email" className="mt-1" formik={formik} />
                                <FormikPasswordView name="password" label="password" className="mt-1" formik={formik} />

                                <LoadingBtn className="full-width mt-1" size="large" type="submit" isLoading={isLoading}>
                                    <T>login</T>
                                </LoadingBtn>

                                <Flex className="mt-1" gap="1rem" alignItems="start" direction="column">
                                    <T>dont-have-account</T>
                                    <Link className="text-link" to="/register">
                                        <T>create-an-account</T>
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
