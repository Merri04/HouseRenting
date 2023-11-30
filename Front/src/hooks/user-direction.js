import i18n from "i18next";
export const useDirection = () => {
    const direction = i18n.dir();
    const getLanguageDirection = (lng) => (lng === "en" ? "ltr" : "ltr");

    return { direction, getLanguageDirection };
};
