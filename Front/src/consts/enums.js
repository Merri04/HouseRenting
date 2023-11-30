const AppProviderStatuses = {
    logging: "logging",
    connecting: "connecting",
    translate: (status) => {
        switch (status) {
            case "connecting":
                return "app-is-connecting";
            case "logging":
                return "app-is-logging-in";
            default:
                return status;
        }
    },
};

const Keys = { LanguageKey: "i18n", TokenKey: "token", ReturnUrl: "returnUrl", Loading: "loading", Theme: "theme" };

export { AppProviderStatuses, Keys };
