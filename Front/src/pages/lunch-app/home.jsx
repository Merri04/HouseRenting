import { useEffect, useState } from "react";
import T from "../../basic-components/text";

import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Container,
    Stack,
    CardMedia,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    FormControl,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Section } from "../../basic-components/section";
import classes from "../../consts/classes";
import { homeApi } from "../../api/home-api";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../basic-components/loading";
import { InitFailed } from "../../basic-components/init-failed";
import { Money, TypeSpecimenOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { FormikTextView } from "../../basic-components/formik-inputs";
import { FormikDateView } from "../../basic-components/formik-inputs/formik-date-view";
import { FormikSelectView } from "../../basic-components/formik-inputs/formik-select-view";
import { LoadingButton } from "@mui/lab";

export const Home = () => {
    const [model, setModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const init = (fromDate = "", toDate = "", typeId = "") => {
        var dto = {
            fromDate: fromDate,
            toDate: toDate,
            typeId: typeId,
        };
        homeApi
            .initHome(dto)
            .then(setModel)
            .catch(setModel)
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (model) return;
        init();
    }, [model]);

    if (model instanceof Error) return <InitFailed ex={model} onRetry={() => setModel(null)} hideGoBack={false} />;
    if (!model) return <Loading />;

    return (
        <Container sx={{ p: 0 }}>
            <Formik
                initialValues={{
                    fromDate: "",
                    toDate: "",
                    typeId: "", // Set your default typeId here
                }}
                onSubmit={(values) => {
                    setIsLoading(true);
                    init(values.fromDate, values.toDate, values.typeId);
                }}>
                {(formik) => (
                    <Form>
                        <Section
                            as="body1"
                            title={t("filter")}
                            elevation={5}
                            Control={
                                <LoadingButton variant="outlined" size="small" type="submit" loading={isLoading}>
                                    <T>search</T>
                                </LoadingButton>
                            }>
                            <Grid container spacing={2}>
                                <Grid item xs={12} xl={4}>
                                    <FormikDateView name="fromDate" label="from-date" className="full-width" />
                                </Grid>
                                <Grid item xs={12} xl={4}>
                                    <FormikDateView name="toDate" label="to-date" className="full-width" />
                                </Grid>
                                <Grid item xs={12} xl={4}>
                                    <FormikSelectView items={model.houseTypes} name="typeId" label="type" formik={formik} />
                                </Grid>
                            </Grid>
                        </Section>
                    </Form>
                )}
            </Formik>

            <Section as="body1" title={t("houses")} elevation={5}>
                {model.homesWithImages.length === 0 && (
                    <Stack flex justifyContent="center" alignItems="center">
                        <T>no-result-found</T>
                    </Stack>
                )}
                {model.homesWithImages.length > 0 && (
                    <Grid container>
                        {model.homesWithImages.map((x) => (
                            <Grid item key={x.house.id} xs={12} md={4} xl={4} sx={{ padding: 1, display: "flex" }}>
                                <Card sx={{ ...classes.Card }} variant="outlined">
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 200, width: 400 }}
                                        src={`data:image/png;base64,${x.image.imageUrl}`}
                                    />
                                    <CardContent>
                                        <Stack>
                                            <T as="subtitle1">{x.house.title}</T>
                                        </Stack>
                                        <Divider />
                                        <List>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Money />
                                                </ListItemIcon>
                                                <ListItemText variant="subtitle2" primary={`Price : ${x.house.price} $`} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <TypeSpecimenOutlined />
                                                </ListItemIcon>
                                                <ListItemText variant="subtitle2" primary={`Type : ${x.house.typeTitle}`} />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="outlined" size="small" onClick={() => navigate(`/House/${x.house.id}`)}>
                                            <T as="subtitle2">view</T>
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Section>
        </Container>
    );
};
