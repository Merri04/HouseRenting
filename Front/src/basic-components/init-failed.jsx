import { useNavigate } from "react-router-dom";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Stack } from "@mui/material";
import { Close, ErrorOutline, Sync, Wifi } from "@mui/icons-material";
import T from "./text";

export const InitFailed = ({ ex, onRetry, hideGoBack }) => {
    const history = useNavigate();

    if (ex instanceof Error) ex = ex.message;

    return (
        <Grid container justifyContent="center">
            <Grid item md={4} xs={12}>
                <Card sx={{ p: 2 }} variant="elevation" elevation={10}>
                    <CardHeader
                        title={
                            <>
                                <Stack flex flexDirection="row" alignItems="center" justifyContent="start" gap={2} className="mb-1">
                                    <ErrorOutline color="error" />
                                    <T as="subtitle1" maxWidth={600} style={{ maxWidth: 600 }}>
                                        {"error-in-loading"}
                                    </T>
                                </Stack>
                                <Divider />
                            </>
                        }
                    />
                    <CardContent>
                        <Stack flex flexDirection="row" alignItems="center" justifyContent="start" gap={2}>
                            {ex === "network-error" ? (
                                <>
                                    <Wifi color="error" />
                                    <T as="subtitle2" maxWidth={600} style={{ maxWidth: 600 }}>
                                        {ex}
                                    </T>
                                </>
                            ) : (
                                <>
                                    <ErrorOutline color="error" />
                                    <T as="subtitle2" maxWidth={600} style={{ maxWidth: 600 }}>
                                        {ex}
                                    </T>
                                </>
                            )}
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Stack flex gap={2} flexDirection="row" justifyContent="start" alignItems="center" className="mt-1">
                            {onRetry && (
                                <Button
                                    color="error"
                                    size="small"
                                    sx={{ maxWidth: 200 }}
                                    onClick={onRetry}
                                    variant="outlined"
                                    startIcon={<Sync />}>
                                    <T>retry</T>
                                </Button>
                            )}
                            {!hideGoBack && (
                                <Button size="small" color="primary" variant="outlined" onClick={() => history(-1)} startIcon={<Close />}>
                                    <T>go-back</T>
                                </Button>
                            )}
                        </Stack>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};
