import React, { createContext, useState, useContext, useEffect } from "react";
import { authenticationApi } from "../api/authentication-api";
import { Keys } from "../consts/enums";
import { useMessage } from "./message-provider";
import { lightTheme, darkTheme } from "../theme/themes";
import ThemeSwitcher from "../theme/theme-switcher";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import noTranslation from "../locales/no.json";

const AuthContext = createContext();
const useApp = () => useContext(AuthContext);

const AppProvider = ({ children }) => {
    if (!localStorage.getItem(Keys.LanguageKey)) localStorage.setItem(Keys.LanguageKey, "en");
    if (!localStorage.getItem(Keys.Theme)) localStorage.setItem(Keys.Theme, "light");

    const userSelectedLanguage = localStorage.getItem(Keys.LanguageKey);

    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const { ShowLoading, HideLoading } = useMessage();
    const [direction, setDirection] = useState();

    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem(Keys.Theme) === "light" ? lightTheme : darkTheme);
    const [currentLanguage, setCurrentLanguage] = useState(userSelectedLanguage);

    const isBrowser = typeof document !== "undefined";
    let insertionPoint;

    if (isBrowser) {
        const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
        insertionPoint = emotionInsertionPoint ?? undefined;
    }

    const toggleTheme = () => {
        const newTheme = currentTheme === lightTheme ? darkTheme : lightTheme;
        setCurrentTheme(newTheme);
        localStorage.setItem(Keys.Theme, newTheme);
    };

    useEffect(() => {
        if (isAuthenticated) return;
        ShowLoading();
        const token = localStorage.getItem(Keys.TokenKey);
        if (token) {
            checkUserInfo();
        } else {
            HideLoading();
            setIsAuthenticated(false);
        }
    }, [isAuthenticated]);

    const checkUserInfo = () => {
        authenticationApi
            .userInfo()
            .then((result) => {
                setUserInfo(result);
                setIsAuthenticated(true);
            })
            .catch((error) => {
                logout();
            })
            .finally(() => {
                HideLoading();
            });
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(Keys.TokenKey);
    };

    const cacheRtl = createCache({
        key: "mui-style-rtl",
        stylisPlugins: [prefixer, rtlPlugin],
        insertionPoint,
    });

    const cacheLtr = createCache({
        key: "mui-style-ltr",
        insertionPoint,
    });

    useEffect(() => {
        document.body.dir = i18n.dir();
        document.documentElement.setAttribute("dir", i18n.dir());
    });

    i18n.use(initReactI18next).init({
        resources: {
            en: { translation: enTranslation },
            no: { translation: noTranslation },
        },
        lng: userSelectedLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

    return (
        <>
            {isAuthenticated == null && <div>loading</div>}
            {isAuthenticated !== null && (
                <CacheProvider value={i18n.dir() === "rtl" ? cacheRtl : cacheLtr}>
                    <ThemeSwitcher currentTheme={currentTheme}>
                        <AuthContext.Provider
                            value={{
                                isAuthenticated,
                                logout,
                                userInfo,
                                checkUserInfo,
                                setCurrentLanguage,
                                toggleTheme,
                                currentLanguage,
                                direction,
                                setDirection,
                            }}>
                            {children}
                        </AuthContext.Provider>
                    </ThemeSwitcher>
                </CacheProvider>
            )}
        </>
    );
};

export { AppProvider, useApp };
