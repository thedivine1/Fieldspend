import type { Language } from "@/types";

const STORAGE_KEY = "sep_language";

// ─── Translation Map ──────────────────────────────────────────────────────────

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    "app.name": "SalesExpense Pro",
    "app.tagline": "Expense tracking made easy",

    // Navigation
    "nav.home": "Home",
    "nav.gallery": "Gallery",
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    "nav.upload": "Upload",

    // Categories
    "cat.cab": "Cab",
    "cat.train": "Train",
    "cat.bus": "Bus",
    "cat.flight": "Flight",
    "cat.hotel": "Hotel",
    "cat.meal": "Meal",
    "cat.other": "Other",

    // Actions
    "action.upload": "Upload Receipt",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.delete": "Delete",
    "action.edit": "Edit",
    "action.generate": "Generate Report",
    "action.share": "Share",
    "action.download": "Download PDF",
    "action.upgrade": "Upgrade to Premium",

    // Upload
    "upload.camera": "Camera",
    "upload.gallery": "Gallery",

    // Status
    "status.limit_reached": "Daily limit of 10 receipts reached",
    "status.beta_active": "Beta period active — enjoy full access!",
    "status.premium_required": "Premium required for this feature",
    "status.uploading": "Uploading…",
    "status.processing": "Processing receipt…",
    "status.saved": "Saved successfully",
    "status.deleted": "Receipt deleted",
    "status.no_receipts": "No receipts yet",

    // Onboarding
    "onboard.step1.title": "Welcome to SalesExpense Pro",
    "onboard.step1.desc":
      "Capture receipts instantly with your phone camera. We handle the rest.",
    "onboard.step2.title": "Smart Categorization",
    "onboard.step2.desc":
      "OCR auto-detects dates and expense categories — Cab, Meal, Hotel and more.",
    "onboard.step3.title": "Generate PDF Reports",
    "onboard.step3.desc":
      "Create professional expense reports in seconds and share via WhatsApp or Email.",
    "onboard.get_started": "Get Started",
    "onboard.next": "Next",
    "onboard.skip": "Skip",

    // Report
    "report.title": "Expense Report",
    "report.summary": "Summary",
    "report.total": "Grand Total",
    "report.month": "Month",
    "report.receipts": "Receipts",

    // Profile
    "profile.name": "Your Name",
    "profile.company": "Company (optional)",
    "profile.save": "Save Profile",

    // Premium
    "premium.title": "Go Premium",
    "premium.monthly": "₹99/month",
    "premium.annual": "₹49/month (annual)",
    "premium.beta_days_left": "Beta days remaining",
    "premium.watermark": "SAMPLE - FREE VERSION",
  },

  hi: {
    // App
    "app.name": "सेल्सएक्सपेंस प्रो",
    "app.tagline": "खर्च ट्रैकिंग आसान",

    // Navigation
    "nav.home": "होम",
    "nav.gallery": "गैलरी",
    "nav.reports": "रिपोर्ट्स",
    "nav.settings": "सेटिंग्स",
    "nav.upload": "अपलोड",

    // Categories
    "cat.cab": "कैब",
    "cat.train": "ट्रेन",
    "cat.bus": "बस",
    "cat.flight": "फ्लाइट",
    "cat.hotel": "होटल",
    "cat.meal": "भोजन",
    "cat.other": "अन्य",

    // Actions
    "action.upload": "रसीद अपलोड करें",
    "action.save": "सहेजें",
    "action.cancel": "रद्द करें",
    "action.delete": "हटाएं",
    "action.edit": "संपादित करें",
    "action.generate": "रिपोर्ट बनाएं",
    "action.share": "शेयर करें",
    "action.download": "PDF डाउनलोड करें",
    "action.upgrade": "प्रीमियम में अपग्रेड करें",

    // Upload
    "upload.camera": "कैमरा",
    "upload.gallery": "गैलरी",

    // Status
    "status.limit_reached": "आज की 10 रसीद की सीमा पूरी हो गई",
    "status.beta_active": "बीटा अवधि सक्रिय — पूरा एक्सेस लें!",
    "status.premium_required": "इस फीचर के लिए प्रीमियम जरूरी है",
    "status.uploading": "अपलोड हो रहा है…",
    "status.processing": "रसीद प्रोसेस हो रही है…",
    "status.saved": "सफलतापूर्वक सहेजा गया",
    "status.deleted": "रसीद हटाई गई",
    "status.no_receipts": "अभी कोई रसीद नहीं",

    // Onboarding
    "onboard.step1.title": "सेल्सएक्सपेंस प्रो में आपका स्वागत है",
    "onboard.step1.desc": "अपने फोन कैमरे से तुरंत रसीद कैप्चर करें। बाकी हम संभालते हैं।",
    "onboard.step2.title": "स्मार्ट कैटेगरी",
    "onboard.step2.desc":
      "OCR खुद तारीख और खर्च की श्रेणी पहचानता है — कैब, भोजन, होटल आदि।",
    "onboard.step3.title": "PDF रिपोर्ट बनाएं",
    "onboard.step3.desc":
      "कुछ ही सेकंड में पेशेवर खर्च रिपोर्ट बनाएं और WhatsApp या Email पर शेयर करें।",
    "onboard.get_started": "शुरू करें",
    "onboard.next": "अगला",
    "onboard.skip": "छोड़ें",

    // Report
    "report.title": "खर्च रिपोर्ट",
    "report.summary": "सारांश",
    "report.total": "कुल योग",
    "report.month": "महीना",
    "report.receipts": "रसीदें",

    // Profile
    "profile.name": "आपका नाम",
    "profile.company": "कंपनी (वैकल्पिक)",
    "profile.save": "प्रोफ़ाइल सहेजें",

    // Premium
    "premium.title": "प्रीमियम लें",
    "premium.monthly": "₹99/माह",
    "premium.annual": "₹49/माह (वार्षिक)",
    "premium.beta_days_left": "बीटा दिन शेष",
    "premium.watermark": "नमूना - निःशुल्क संस्करण",
  },

  mr: {
    // App
    "app.name": "सेल्सएक्स्पेन्स प्रो",
    "app.tagline": "खर्च ट्रॅकिंग सोपे",

    // Navigation
    "nav.home": "होम",
    "nav.gallery": "गॅलरी",
    "nav.reports": "रिपोर्ट्स",
    "nav.settings": "सेटिंग्ज",
    "nav.upload": "अपलोड",

    // Categories
    "cat.cab": "कॅब",
    "cat.train": "ट्रेन",
    "cat.bus": "बस",
    "cat.flight": "फ्लाइट",
    "cat.hotel": "हॉटेल",
    "cat.meal": "जेवण",
    "cat.other": "इतर",

    // Actions
    "action.upload": "पावती अपलोड करा",
    "action.save": "जतन करा",
    "action.cancel": "रद्द करा",
    "action.delete": "हटवा",
    "action.edit": "संपादित करा",
    "action.generate": "अहवाल तयार करा",
    "action.share": "शेअर करा",
    "action.download": "PDF डाउनलोड करा",
    "action.upgrade": "प्रीमियमवर अपग्रेड करा",

    // Upload
    "upload.camera": "कॅमेरा",
    "upload.gallery": "गॅलरी",

    // Status
    "status.limit_reached": "आजची 10 पावत्यांची मर्यादा संपली",
    "status.beta_active": "बीटा कालावधी सक्रिय — पूर्ण ॲक्सेस घ्या!",
    "status.premium_required": "या फीचरसाठी प्रीमियम आवश्यक आहे",
    "status.uploading": "अपलोड होत आहे…",
    "status.processing": "पावती प्रक्रिया होत आहे…",
    "status.saved": "यशस्वीरित्या जतन केले",
    "status.deleted": "पावती हटवली",
    "status.no_receipts": "अद्याप कोणत्याही पावत्या नाहीत",

    // Onboarding
    "onboard.step1.title": "सेल्सएक्स्पेन्स प्रोमध्ये आपले स्वागत आहे",
    "onboard.step1.desc":
      "आपल्या फोन कॅमेऱ्याने त्वरित पावत्या कॅप्चर करा. बाकी आम्ही सांभाळतो.",
    "onboard.step2.title": "स्मार्ट वर्गीकरण",
    "onboard.step2.desc":
      "OCR स्वतः तारीख आणि खर्चाची श्रेणी ओळखतो — कॅब, जेवण, हॉटेल इ.",
    "onboard.step3.title": "PDF अहवाल तयार करा",
    "onboard.step3.desc":
      "काही सेकंदात व्यावसायिक खर्च अहवाल तयार करा आणि WhatsApp किंवा Email वर शेअर करा.",
    "onboard.get_started": "सुरू करा",
    "onboard.next": "पुढे",
    "onboard.skip": "वगळा",

    // Report
    "report.title": "खर्च अहवाल",
    "report.summary": "सारांश",
    "report.total": "एकूण",
    "report.month": "महिना",
    "report.receipts": "पावत्या",

    // Profile
    "profile.name": "तुमचे नाव",
    "profile.company": "कंपनी (पर्यायी)",
    "profile.save": "प्रोफाइल जतन करा",

    // Premium
    "premium.title": "प्रीमियम घ्या",
    "premium.monthly": "₹99/महिना",
    "premium.annual": "₹49/महिना (वार्षिक)",
    "premium.beta_days_left": "बीटा दिवस शिल्लक",
    "premium.watermark": "नमुना - मोफत आवृत्ती",
  },
};

// ─── Functions ────────────────────────────────────────────────────────────────

export function getCurrentLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && ["en", "hi", "mr"].includes(stored)) return stored;
  return "en";
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function t(key: string): string {
  const lang = getCurrentLanguage();
  return translations[lang][key] ?? translations.en[key] ?? key;
}

export const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
  { value: "mr", label: "Marathi", native: "मराठी" },
];
