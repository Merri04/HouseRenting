import { useEffect, useState } from "react";
import { Loading } from "../../basic-components/loading";
import { InitFailed } from "../../basic-components/init-failed";
import T from "../../basic-components/text";
import { useNavigate } from "react-router-dom";
import { Section } from "../../basic-components/section";
import { CalendarMonth, Money, TypeSpecimenOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { rentedHouseApi } from "../../api/rented-house-api";
import { ManageRentedHouse } from "./manage-rented-house";
import { Button, Card, CardContent, CardMedia, Grid, List, ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { useApp } from "../../providers/app-provider";

export const RentedHauses = () => {
    const [model, setModel] = useState();
    const [selectedRow, setSelectedRow] = useState();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userInfo } = useApp();

    useEffect(() => {
        if (model) return;
        rentedHouseApi.init().then(setModel).catch(setModel);
    }, [model]);

    if (!model) return <Loading />;
    if (model instanceof Error) return <InitFailed ex={model} onRetry={() => setModel(null)} hideGoBack={false} />;

    return (
        <Section as="subtitle1" title={t("my-rented-houses")} elevation={5} onBack={() => navigate("/")}>
            <Grid container spacing={2}>
                {model.rentedHouses.map((x) => (
                    <Grid item md={4} xs={12}>
                        <Card variant="elevation" elevation={5}>
                            <Card variant="outlined">
                                <CardMedia
                                    component="img"
                                    sx={{ height: 200, width: 400 }}
                                    src={`data:image/png;base64,${x.houseImage.imageUrl}`}
                                />
                                <CardContent>
                                    <Stack>
                                        <T as="subtitle1">{x.house.title}</T>
                                    </Stack>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Money />
                                            </ListItemIcon>
                                            <ListItemText variant="subtitle2" primary={`Price : ${x.totalPrice} $`} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <TypeSpecimenOutlined />
                                            </ListItemIcon>
                                            <ListItemText variant="subtitle2" primary={`Type : ${x.house.typeTitle}`} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CalendarMonth />
                                            </ListItemIcon>
                                            <ListItemText variant="subtitle2" primary={`from : ${x.fromDate}`} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CalendarMonth />
                                            </ListItemIcon>
                                            <ListItemText variant="subtitle2" primary={`to : ${x.toDate}`} />
                                        </ListItem>
                                    </List>
                                    <Stack flex flexDirection="column" justifyContent="start">
                                        <Button
                                            color="secondary"
                                            variant="contained"
                                            onClick={() => setSelectedRow({ ...x, hauseId: x.house.id, userId: userInfo.userId })}>
                                            <T>modify</T>
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <ManageRentedHouse
                open={selectedRow != null}
                rentedHouse={selectedRow}
                onClose={(house, deleted) => {
                    if (house && !deleted) {
                        setModel({
                            ...model,
                            rentedHouses: model.rentedHouses.map((x) =>
                                x.id === house.id
                                    ? {
                                          ...x,
                                          fromDate: house.fromDate,
                                          toDate: house.toDate,
                                          numbers: house.numbers,
                                          totalPrice: house.totalPrice,
                                      }
                                    : x
                            ),
                        });
                    } else if (deleted) setModel({ ...model, rentedHouses: model.rentedHouses.filter((x) => x.id !== selectedRow.id) });
                    setSelectedRow(null);
                }}
            />
        </Section>
    );
};
