import * as React from "react";
import { IconButton, ListItemIcon, Tooltip, Box, AppBar, Toolbar, MenuItem, Menu, Button, Stack } from "@mui/material";
import T from "../../basic-components/text";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import {
    DarkModeOutlined,
    WbSunnyOutlined,
    Language,
    Settings,
    Dashboard,
    PowerOff,
    Power,
    Person2,
    HouseOutlined,
    HouseSiding,
    MoreVert,
} from "@mui/icons-material";
import { Keys } from "../../consts/enums";
import { useApp } from "../../providers/app-provider";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { useDirection } from "../../hooks/user-direction";

export const PublicHeader = () => {
    const { t } = useTranslation();
    const { logout, toggleTheme, setCurrentLanguage, isAuthenticated } = useApp();
    const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [currentTheme, setCurrentTheme] = React.useState(localStorage.getItem(Keys.Theme));
    const navigate = useNavigate();
    const theme = useTheme();
    const { getLanguageDirection } = useDirection();

    React.useEffect(() => {
        localStorage.setItem(Keys.Theme, currentTheme);
    }, [currentTheme]);

    const userLanguage = localStorage.getItem(Keys.LanguageKey);

    const toggleLng = () => {
        var newLanguage = localStorage.getItem(Keys.LanguageKey) === "en" ? "no" : "en";
        localStorage.setItem(Keys.LanguageKey, newLanguage);
        i18n.changeLanguage(newLanguage);
        theme.direction = getLanguageDirection(newLanguage);
        setCurrentLanguage(newLanguage);
        setMoreAnchorEl(null);
    };

    const getDirection = () => {
        return userLanguage === "en" ? "right" : "left";
    };

    const toggleCurrentTheme = () => {
        setCurrentTheme(currentTheme === "dark" ? "light" : "dark");
        toggleTheme();
        setMoreAnchorEl(null);
    };

    return (
        <>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <Box sx={{ display: { xs: "block", sm: "none" } }}>
                        <Link to="/" className="text-link-white">
                            <T color="inherit">mobile-app-name</T>
                        </Link>
                    </Box>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Link to="/" className="text-link-white">
                            <T color="inherit">desktop-app-name</T>
                        </Link>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                    {!isAuthenticated && (
                        <Button variant="outlined" size="small" color="inherit" startIcon={<Power />} href="/login">
                            <T>login-or-register</T>
                        </Button>
                    )}
                    {isAuthenticated && (
                        <Stack flex flexDirection="row" justifyContent="end" gap={1} sx={{ display: { xs: "none", md: "flex" } }}>
                            <Button size="small" variant="outlined" color="inherit" href="/houses" startIcon={<HouseSiding />}>
                                <T>my-houses</T>
                            </Button>
                            <Button size="small" variant="outlined" color="inherit" href="/RentedHouses" startIcon={<HouseOutlined />}>
                                <T>my-rented-houses</T>
                            </Button>
                        </Stack>
                    )}
                    <Stack flex flexDirection="row" alignItems="center">
                        {isAuthenticated && (
                            <Tooltip title={t("logout")}>
                                <IconButton variant="outlined" size="small" color="inherit" onClick={logout}>
                                    <PowerOff />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title={t("settings")}>
                            <IconButton color="inherit" onClick={(event) => setMoreAnchorEl(event.currentTarget)}>
                                <Settings />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t("menu")} sx={{ display: { xs: "inline-flex", md: "none" } }}>
                            <IconButton color="inherit" onClick={(event) => setMobileMoreAnchorEl(event.currentTarget)}>
                                <MoreVert />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            open={moreAnchorEl != null}
                            onClose={() => setMoreAnchorEl(null)}
                            anchorEl={moreAnchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: getDirection(),
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: getDirection(),
                            }}>
                            <MenuItem onClick={toggleCurrentTheme}>
                                <ListItemIcon>{currentTheme === "dark" ? <WbSunnyOutlined /> : <DarkModeOutlined />}</ListItemIcon>
                                <T>change-theme</T>
                            </MenuItem>
                            <MenuItem onClick={toggleLng}>
                                <ListItemIcon>
                                    <Language />
                                </ListItemIcon>
                                <T>{`change-to-${localStorage.getItem(Keys.LanguageKey) === "en" ? "norway" : "english"}`}</T>
                            </MenuItem>
                        </Menu>
                        <Menu
                            open={mobileMoreAnchorEl != null}
                            onClose={() => setMobileMoreAnchorEl(null)}
                            anchorEl={mobileMoreAnchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: getDirection(),
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: getDirection(),
                            }}>
                            <MenuItem onClick={() => navigate("/houses")}>
                                <ListItemIcon>
                                    <HouseOutlined />
                                </ListItemIcon>
                                <T>my-houses</T>
                            </MenuItem>
                            <MenuItem onClick={() => navigate("/RentedHouses")}>
                                <ListItemIcon>
                                    <HouseSiding />
                                </ListItemIcon>
                                <T>my-rented-houses</T>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    );
};
