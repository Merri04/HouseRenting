import React from "react";
import i18n from "i18next";

import { ThemeProvider, createTheme } from "@mui/material";

const ThemeSwitcher = ({ children, currentTheme }) => {
    const theme = createTheme(currentTheme);
    theme.direction = i18n.dir();
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeSwitcher;
