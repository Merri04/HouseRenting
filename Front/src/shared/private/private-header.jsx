import * as React from "react";
import { IconButton, ListItemIcon, Tooltip, Box, AppBar, Toolbar, MenuItem, Menu, Button } from "@mui/material";
import T from "../../basic-components/text";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { ExitToApp, DarkModeOutlined, WbSunnyOutlined, Language, Settings, Home, PowerOff } from "@mui/icons-material";
import { useApp } from "../../providers/app-provider";
import { Keys } from "../../consts/enums";
import { useTheme } from "@emotion/react";

import { Link, useNavigate } from "react-router-dom";
import { useDirection } from "../../hooks/user-direction";

export const PrivateHeader = () => {
    const { t } = useTranslation();
    const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
    const [currentTheme, setCurrentTheme] = React.useState(localStorage.getItem(Keys.Theme));
    const { logout, toggleTheme, setCurrentLanguage } = useApp();
    const theme = useTheme();
    const { getLanguageDirection } = useDirection();

    const navigate = useNavigate();
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
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <Link to="/" className="text-link-white">
                        <T>mobile-app-name</T>
                    </Link>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Link to="/" className="text-link-white">
                        <T>desktop-app-name</T>
                    </Link>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title={t("home")}>
                    <Button variant="outlined" color="inherit" onClick={(event) => navigate("/")} startIcon={<Home />}>
                        <T>home</T>
                    </Button>
                </Tooltip>
                <Tooltip title={t("logout")}>
                    <IconButton variant="outlined" size="small" color="inherit" onClick={logout}>
                        <PowerOff />
                    </IconButton>
                </Tooltip>

                <Box>
                    <Tooltip title={t("settings")}>
                        <IconButton color="inherit" onClick={(event) => setMoreAnchorEl(event.currentTarget)}>
                            <Settings />
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
                        <MenuItem onClick={logout}>
                            <ListItemIcon>
                                <ExitToApp />
                            </ListItemIcon>
                            <T>logout</T>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
