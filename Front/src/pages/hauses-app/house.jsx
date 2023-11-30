import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { houseApi } from "../../api/house-api";
import { Loading } from "../../basic-components/loading";
import { InitFailed } from "../../basic-components/init-failed";
import { Button, Card, CardHeader, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import T from "../../basic-components/text";
import { CalendarMonth, MergeType, Money, NumbersRounded, TypeSpecimenOutlined } from "@mui/icons-material";
import { useApp } from "../../providers/app-provider";
import { ManageRentedHouse } from "../rented-house/manage-rented-house";

export const House = () => {
    const [model, setModel] = useState();
    const [showRentedHouse, setShowRentedHouse] = useState();

    const { isAuthenticated, userInfo } = useApp();

    var params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (model) return;
        houseApi.detail(params.id).then(setModel).catch(setModel);
    }, [model]);

    if (!model) return <Loading />;
    if (model instanceof Error) return <InitFailed ex={model} onRetry={() => setModel(null)} hideGoBack={false} />;

    return (
        <Card variant="elevation" elevation={5} sx={{ mt: 1 }}>
            <Grid container sx={{ p: 2 }}>
                <Grid item md={8} xs={12}>
                    <CardHeader title={model.house.title} />
                    <Carousel autoPlay>
                        {model.images.map((image, index) => (
                            <img alt="" src={`data:image/png;base64,${image.imageUrl}`} />
                        ))}
                    </Carousel>
                </Grid>
                <Grid item md={4} xs={12} sx={{ p: 2 }}>
                    <T variant="body1" sx={{ mb: 1 }}>
                        house-info
                    </T>
                    <Divider />
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Money />
                            </ListItemIcon>
                            <ListItemText variant="subtitle2" primary={`Price : ${model.house.price} $`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <MergeType />
                            </ListItemIcon>
                            <ListItemText variant="subtitle2" primary={model.house.address} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <TypeSpecimenOutlined />
                            </ListItemIcon>
                            <ListItemText variant="subtitle2" primary={`Type : ${model.house.typeTitle}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CalendarMonth />
                            </ListItemIcon>
                            <ListItemText variant="subtitle2" primary={`from : ${model.house.fromDate}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CalendarMonth />
                            </ListItemIcon>
                            <ListItemText variant="subtitle2" primary={`to : ${model.house.toDate}`} />
                        </ListItem>
                        <ListItem>{model.house.description}</ListItem>
                    </List>
                    {isAuthenticated && model.rentedHauses && (
                        <>
                            <Divider />
                            <Typography sx={{ mt: 1 }}>Rent Information</Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarMonth />
                                    </ListItemIcon>
                                    <ListItemText variant="subtitle2" primary={`from : ${model.rentedHauses.fromDate}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarMonth />
                                    </ListItemIcon>
                                    <ListItemText variant="subtitle2" primary={`to : ${model.rentedHauses.toDate}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <NumbersRounded />
                                    </ListItemIcon>
                                    <ListItemText variant="subtitle2" primary={model.rentedHauses.numbers} />
                                </ListItem>
                                <Stack flex flexDirection="column" justifyContent="start">
                                    <Button color="secondary" variant="contained" onClick={() => setShowRentedHouse(true)}>
                                        <T>modify</T>
                                    </Button>
                                </Stack>
                            </List>
                        </>
                    )}
                    {isAuthenticated && !model.rentedHauses && (
                        <Stack flex flexDirection="column" justifyContent="start" gap={1}>
                            <Divider />
                            <T sx={{ mt: 1 }}>you-can-rent-this-house</T>
                            <Button color="secondary" variant="contained" onClick={() => setShowRentedHouse(true)}>
                                <T>rent-house</T>
                            </Button>
                        </Stack>
                    )}
                    {!isAuthenticated && (
                        <Stack flex flexDirection="column" justifyContent="start" gap={1}>
                            <Divider />
                            <T sx={{ mt: 1 }}>login-to-rent</T>
                            <Button color="secondary" variant="contained" href={`/login?returnUrl=/House/${params.id}`}>
                                <T>login-or-register</T>
                            </Button>
                        </Stack>
                    )}
                </Grid>
                <ManageRentedHouse
                    house={model.house}
                    rentedHouse={model.rentedHauses || { userId: userInfo?.userId, hauseId: model?.house?.id }}
                    open={showRentedHouse}
                    onClose={(rentedHause, deleted) => {
                        if (rentedHause) {
                            setModel({
                                ...model,
                                rentedHauses: {
                                    ...rentedHause,
                                    fromDate: rentedHause.fromDate.split("T")[0],
                                    toDate: rentedHause.toDate.split("T")[0],
                                },
                            });
                        } else if (deleted) {
                            setModel({ ...model, rentedHauses: null });
                        }
                        setShowRentedHouse(false);
                    }}
                />
            </Grid>
        </Card>
    );
};
