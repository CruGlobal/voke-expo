import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: "en", // Localization.locale,
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "Welcome to React": "Welcome to React and react-i18next",
        },
      },
    },
  });

export default i18n;
