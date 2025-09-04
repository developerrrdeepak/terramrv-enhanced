import React, { createContext, useContext, useEffect, useState } from "react";

const translations: Record<string, Record<string, string>> = {
  en: {
    appName: "FarmRoots",
    farmerDashboard: "Farmer Dashboard",
    welcome: "Welcome",
    uploadDocuments: "Upload Documents",
    joinProject: "Join Project",
    completeProfile: "Complete Profile",
    pleaseCompleteProfile:
      "Please complete your profile to access all features",
    profileSetup: "Profile Setup",
    farmData: "Farm & Crop Data",
    profileVerified: "Profile Verified",
    farmDataSubmitted: "Farm Data Submitted",
    awaitingVerification: "Awaiting Verification",
    mapPreview: "Farm Map Preview",
    ndvi: "NDVI",
    landcover: "Landcover",
    carbonWallet: "Carbon Wallet",
    sevenDayForecast: "7-day Forecast",
    tasksReminders: "Tasks & Reminders",
    recentPayouts: "Recent Payouts",
    alertsNotifications: "Alerts & Notifications",
    overview: "Overview",
    map: "Map",
    carbon: "Carbon",
    profile: "Profile",
    save: "Save",
    uploadPhoto: "Upload Photo",
    uploadKYC: "Upload KYC",
    addTask: "Add",
    mark: "Mark",
    done: "Done",
    loading: "Loading...",
  },
  hi: {
    appName: "फार्मरूट्स",
    farmerDashboard: "किसान डैशबोर्ड",
    welcome: "स्वागत है",
    uploadDocuments: "दस्तावेज़ अपलोड करें",
    joinProject: "प्रोजेक्ट में शामिल हों",
    completeProfile: "प्रोफ़ाइल पूर्ण करें",
    pleaseCompleteProfile: "सभी सुविधाओं तक पहुँच के लिए प्रोफ़ाइल पूरा करें",
    profileSetup: "प्रोफ़ाइल सेटअप",
    farmData: "फार्म और फसल डेटा",
    profileVerified: "प्रोफ़ाइल सत्यापित",
    farmDataSubmitted: "फार्म डेटा जमा किया गया",
    awaitingVerification: "सत्यापन का इंतज़ार",
    mapPreview: "फार्म मानचित्र पूर्वावलोकन",
    ndvi: "NDVI",
    landcover: "लैंडकवर",
    carbonWallet: "कार्बन वॉलेट",
    sevenDayForecast: "7-दिन की पूर्वानुमान",
    tasksReminders: "कार्य और अनुस्मारक",
    recentPayouts: "हाल के भुगतान",
    alertsNotifications: "अलर्ट और सूचनाएं",
    overview: "ओवरव्यू",
    map: "मानचित्र",
    carbon: "कार्बन",
    profile: "प्रोफ़ाइल",
    save: "सहे��ें",
    uploadPhoto: "प्रोफ़ाइल फोटो अपलोड करें",
    uploadKYC: "KYC अपलोड करें",
    addTask: "जोड़ें",
    mark: "निशान",
    done: "पूर्ण",
    loading: "लोड हो रहा है...",
  },
};

type I18nContextType = {
  lang: string;
  setLang: (l: string) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>(() => {
    try {
      return localStorage.getItem("lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const setLang = (l: string) => setLangState(l);

  const t = (key: string) => {
    return translations[lang]?.[key] ?? translations["en"]?.[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
