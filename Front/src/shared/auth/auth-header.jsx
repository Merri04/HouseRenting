import * as React from "react";
import { IconButton, ListItemIcon, Tooltip, Box, AppBar, Toolbar, MenuItem, Menu } from "@mui/material";
import T from "../../basic-components/text";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { DarkModeOutlined, WbSunnyOutlined, Language, Settings, HomeOutlined } from "@mui/icons-material";
import { Keys } from "../../consts/enums";
import { useTheme } from "@emotion/react";
import { useApp } from "../../providers/app-provider";
import { useNavigate } from "react-router-dom";
import { useDirection } from "../../hooks/user-direction";

export const AuthHeader = () => {
    const { t } = useTranslation();
    const { getLanguageDirection } = useDirection();
    const { toggleTheme, setCurrentLanguage } = useApp();
    const [moreAnchorEl, setMoreAnchorEl, currentTheme] = React.useState(null);
    const theme = useTheme();
    const navigate = useNavigate();

    const userLanguage = localStorage.getItem(Keys.LanguageKey);

    const toggleLng = () => {
        var newLanguage = localStorage.getItem(Keys.LanguageKey) === "en" ? "en" : "en";
        localStorage.setItem(Keys.LanguageKey, newLanguage);
        i18n.changeLanguage(newLanguage);
        theme.direction = getLanguageDirection(newLanguage);
        setCurrentLanguage(newLanguage);
        setMoreAnchorEl(null);
    };

    const getDirection = () => {
        return userLanguage === "en" ? "right" : "left";
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <T as="h6" noWrap sx={{ display: { xs: "block", sm: "none" } }} className="text-link-white">
                    mobile-app-name
                </T>
                <T as="h6" noWrap sx={{ display: { xs: "none", sm: "block" } }} className="text-link-white">
                    desktop-app-name
                </T>
                <Box sx={{ flexGrow: 1 }} />

                <Box>
                    <Tooltip title={t("home")}>
                        <IconButton color="inherit" onClick={(event) => navigate("/")}>
                            <HomeOutlined />
                        </IconButton>
                    </Tooltip>
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
                        <MenuItem
                            onClick={() => {
                                toggleTheme();
                            }}>
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
                </Box>
            </Toolbar>
        </AppBar>
    );
};
