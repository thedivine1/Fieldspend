import type { Language } from "@/types";

const STORAGE_KEY = "sep_language";

// ─── Translation Map ──────────────────────────────────────────────────────────

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    "app.name": "Fieldspend",
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
    "cat.localBus": "Local Bus",
    "cat.auto": "Auto",
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
    "onboard.step1.title": "Welcome to Fieldspend",
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
    "report.no_receipts": "No receipts for",
    "report.add_first": "Upload Receipts",
    "report.category_breakdown": "Category Breakdown",
    "report.images_attached": "image attached",
    "report.images_attached_plural": "images attached",
    "report.items": "item",
    "report.items_plural": "items",
    "report.categories": "categories",
    "report.generating": "Generating PDF…",
    "report.watermark_note": "Watermark will be added to free version",
    "report.share": "Share Report",
    "report.whatsapp_note":
      "PDF is already downloaded. Attach it manually in WhatsApp.",
    "report.set_profile": "Set your name in",
    "report.set_profile2": "Settings",
    "report.set_profile3": "to generate a report.",
    "report.current_plan": "Current Plan",
    "report.choose_plan": "Choose a Plan",
    "report.upgrade": "Upgrade",

    // Months
    "months.jan": "January",
    "months.feb": "February",
    "months.mar": "March",
    "months.apr": "April",
    "months.may": "May",
    "months.jun": "June",
    "months.jul": "July",
    "months.aug": "August",
    "months.sep": "September",
    "months.oct": "October",
    "months.nov": "November",
    "months.dec": "December",

    // Profile
    "profile.name": "Your Name",
    "profile.email": "Email Address",
    "profile.company": "Company (optional)",
    "profile.save": "Save Profile",

    // Premium
    "premium.title": "Go Premium",
    "premium.monthly": "₹99/month",
    "premium.annual": "₹49/month (annual)",
    "premium.beta_days_left": "Beta days remaining",
    "premium.watermark": "SAMPLE - FREE VERSION",

    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.language": "Language",
    "settings.appearance": "Appearance",
    "settings.about": "About",
    "settings.dark_mode": "Dark Mode",
    "settings.dark_active": "Dark theme active",
    "settings.light_active": "Light theme active",
    "settings.beta_title": "Beta until July 31, 2026 — enjoy full access!",
    "settings.beta_desc":
      "Fieldspend is free with full features until July 31, 2026. After that, free users will see ads. Upgrade to Premium for a clean, ad-free experience.",
    "settings.days_remaining": "days until beta ends (July 31, 2026)",
    "settings.beta_ends_date": "Beta ends July 31, 2026",
    "settings.beta_days_remaining": "days remaining in beta",
    "settings.current_plan": "Current Plan",
    "settings.choose_plan": "Choose a Plan",
    "settings.monthly": "Monthly",
    "settings.annual": "Annual",
    "settings.per_month": "per month",
    "settings.save_50": "Save 50%!",
    "settings.most_popular": "Most Popular",
    "settings.unlimited_receipts": "Unlimited receipts",
    "settings.no_watermark": "No watermark",
    "settings.no_ads": "No ads ever",
    "settings.priority_support": "Priority support",
    "settings.everything_monthly": "Everything in Monthly",
    "settings.best_value": "Best value",
    "settings.premium_active": "You have full premium access — enjoy!",
    "settings.upgrade": "Upgrade",
    "settings.share_app": "Share App",
    "settings.company_optional": "Optional",
    "settings.company_label": "Company Name",
    "settings.saving": "Saving…",
    "settings.name_required": "Name is required",
    "settings.coming_soon": "Coming Soon!",
    "settings.premium_coming":
      "Premium upgrades are coming soon! You'll be notified as soon as payments are available.",
    "settings.beta_access":
      "In the meantime, enjoy full beta access — unlimited receipts, clean PDF exports (no watermark), priority support.",
    "settings.notify_me": "Notify Me",
    "settings.close": "Close",
    "settings.notified": "We'll notify you when premium is available!",
    "settings.lang_set": "Language set to",
    "settings.app_link_copied": "App link copied to clipboard!",

    // Payment / Upgrade
    "upgrade.title": "Upgrade to Premium",
    "upgrade.subtitle": "Unlock unlimited receipts, clean PDFs, zero ads",
    "plan.monthly": "Monthly",
    "plan.annual": "Annual",
    "plan.savings": "Save ₹600/year vs monthly",
    "btn.upgrade": "Pay Now with Razorpay",
    "premium.active": "Premium Active",
    "premium.expiry": "Valid until",
    "payment.processing": "Processing payment…",

    // Ads
    "ad.advertisement": "Advertisement",
    "ad.ends_in": "Ad ends in",
    "ad.seconds": "seconds",
    "ad.continue": "Continue",
    "ad.upgrade_now": "Upgrade to Premium",
    "ad.no_ads_premium": "Go Premium — No Ads, No Limits!",
    "ad.of": "of",
    ad_watch_title: "Unlock your feature — watch this short ad",
    ad_countdown: "Ad completes in",
    ad_claim_reward: "Claim Reward",
    ad_unlocked_message: "5 more uploads unlocked!",
    beta_ends_in: "Beta ends in",
    beta_has_ended: "Beta period has ended — upgrade to continue",
    upgrade_required: "Upgrade Required",
  },

  hi: {
    // App
    "app.name": "Fieldspend",
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
    "cat.localBus": "लोकल बस",
    "cat.auto": "ऑटो",
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
    "onboard.step1.title": "Fieldspend में आपका स्वागत है",
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
    "report.no_receipts": "इस महीने कोई रसीद नहीं",
    "report.add_first": "रसीद अपलोड करें",
    "report.category_breakdown": "श्रेणी सारांश",
    "report.images_attached": "छवि संलग्न",
    "report.images_attached_plural": "छवियाँ संलग्न",
    "report.items": "आइटम",
    "report.items_plural": "आइटम",
    "report.categories": "श्रेणियाँ",
    "report.generating": "PDF बन रहा है…",
    "report.watermark_note": "मुफ़्त संस्करण में वॉटरमार्क जोड़ा जाएगा",
    "report.share": "रिपोर्ट शेयर करें",
    "report.whatsapp_note": "PDF डाउनलोड हो चुका है। WhatsApp में मैन्युअल अटैच करें।",
    "report.set_profile": "रिपोर्ट बनाने के लिए",
    "report.set_profile2": "सेटिंग्स",
    "report.set_profile3": "में अपना नाम सेट करें।",
    "report.current_plan": "वर्तमान प्लान",
    "report.choose_plan": "प्लान चुनें",
    "report.upgrade": "अपग्रेड",

    // Months
    "months.jan": "जनवरी",
    "months.feb": "फरवरी",
    "months.mar": "मार्च",
    "months.apr": "अप्रैल",
    "months.may": "मई",
    "months.jun": "जून",
    "months.jul": "जुलाई",
    "months.aug": "अगस्त",
    "months.sep": "सितंबर",
    "months.oct": "अक्टूबर",
    "months.nov": "नवंबर",
    "months.dec": "दिसंबर",

    // Profile
    "profile.name": "आपका नाम",
    "profile.email": "ईमेल पता",
    "profile.company": "कंपनी (वैकल्पिक)",
    "profile.save": "प्रोफ़ाइल सहेजें",

    // Premium
    "premium.title": "प्रीमियम लें",
    "premium.monthly": "₹99/माह",
    "premium.annual": "₹49/माह (वार्षिक)",
    "premium.beta_days_left": "बीटा दिन शेष",
    "premium.watermark": "नमूना - निःशुल्क संस्करण",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.profile": "प्रोफाइल",
    "settings.language": "भाषा",
    "settings.appearance": "दिखावट",
    "settings.about": "जानकारी",
    "settings.dark_mode": "डार्क मोड",
    "settings.dark_active": "डार्क थीम सक्रिय",
    "settings.light_active": "लाइट थीम सक्रिय",
    "settings.beta_title": "बीटा 31 जुलाई 2026 तक — पूरा एक्सेस लें!",
    "settings.beta_desc":
      "Fieldspend 31 जुलाई 2026 तक मुफ़्त और पूरे फीचर के साथ उपलब्ध है। उसके बाद मुफ़्त यूजर्स को विज्ञापन दिखेंगे। प्रीमियम में अपग्रेड करें।",
    "settings.days_remaining": "दिन शेष (31 जुलाई 2026 तक)",
    "settings.beta_ends_date": "बीटा 31 जुलाई 2026 को समाप्त होगा",
    "settings.beta_days_remaining": "बीटा में दिन शेष",
    "settings.current_plan": "वर्तमान प्लान",
    "settings.choose_plan": "प्लान चुनें",
    "settings.monthly": "मासिक",
    "settings.annual": "वार्षिक",
    "settings.per_month": "प्रति माह",
    "settings.save_50": "50% बचाएं!",
    "settings.most_popular": "सबसे लोकप्रिय",
    "settings.unlimited_receipts": "असीमित रसीदें",
    "settings.no_watermark": "वॉटरमार्क नहीं",
    "settings.no_ads": "कोई विज्ञापन नहीं",
    "settings.priority_support": "प्राथमिकता सहायता",
    "settings.everything_monthly": "मासिक की सब सुविधाएं",
    "settings.best_value": "सर्वोत्तम मूल्य",
    "settings.premium_active": "आपके पास पूर्ण प्रीमियम एक्सेस है — आनंद लें!",
    "settings.upgrade": "अपग्रेड करें",
    "settings.share_app": "ऐप शेयर करें",
    "settings.company_optional": "वैकल्पिक",
    "settings.company_label": "कंपनी का नाम",
    "settings.saving": "सहेजा जा रहा है…",
    "settings.name_required": "नाम आवश्यक है",
    "settings.coming_soon": "जल्द आ रहा है!",
    "settings.premium_coming":
      "प्रीमियम अपग्रेड जल्द उपलब्ध होगा! भुगतान उपलब्ध होते ही आपको सूचित किया जाएगा।",
    "settings.beta_access":
      "इस बीच, पूर्ण बीटा एक्सेस का आनंद लें — असीमित रसीदें, साफ PDF निर्यात, प्राथमिकता सहायता।",
    "settings.notify_me": "मुझे सूचित करें",
    "settings.close": "बंद करें",
    "settings.notified": "प्रीमियम उपलब्ध होने पर हम आपको सूचित करेंगे!",
    "settings.lang_set": "भाषा बदली गई",
    "settings.app_link_copied": "ऐप लिंक क्लिपबोर्ड पर कॉपी हुई!",

    // Payment / Upgrade
    "upgrade.title": "प्रीमियम में अपग्रेड करें",
    "upgrade.subtitle": "असीमित रसीदें, साफ PDF, कोई विज्ञापन नहीं",
    "plan.monthly": "मासिक",
    "plan.annual": "वार्षिक",
    "plan.savings": "मासिक की तुलना में ₹600/वर्ष की बचत",
    "btn.upgrade": "Razorpay से भुगतान करें",
    "premium.active": "प्रीमियम सक्रिय",
    "premium.expiry": "वैध है तक",
    "payment.processing": "भुगतान प्रक्रिया हो रही है…",

    // Ads
    "ad.advertisement": "विज्ञापन",
    "ad.ends_in": "विज्ञापन समाप्त होगा",
    "ad.seconds": "सेकंड में",
    "ad.continue": "जारी रखें",
    "ad.upgrade_now": "प्रीमियम में अपग्रेड करें",
    "ad.no_ads_premium": "प्रीमियम लें — कोई विज्ञापन नहीं, कोई सीमा नहीं!",
    "ad.of": "में से",
    ad_watch_title: "अपना फ़ीचर अनलॉक करें — यह छोटा विज्ञापन देखें",
    ad_countdown: "विज्ञापन समाप्त होता है",
    ad_claim_reward: "इनाम लें",
    ad_unlocked_message: "5 और अपलोड अनलॉक हुए!",
    beta_ends_in: "बीटा समाप्त होगा",
    beta_has_ended: "बीटा अवधि समाप्त — जारी रखने के लिए अपग्रेड करें",
    upgrade_required: "अपग्रेड आवश्यक",
  },

  mr: {
    // App
    "app.name": "Fieldspend",
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
    "cat.localBus": "लोकल बस",
    "cat.auto": "ऑटो",
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
    "onboard.step1.title": "Fieldspend मध्ये आपले स्वागत आहे",
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
    "report.no_receipts": "या महिन्यात कोणत्याही पावत्या नाहीत",
    "report.add_first": "पावती अपलोड करा",
    "report.category_breakdown": "श्रेणी सारांश",
    "report.images_attached": "प्रतिमा जोडली",
    "report.images_attached_plural": "प्रतिमा जोडल्या",
    "report.items": "आयटम",
    "report.items_plural": "आयटम",
    "report.categories": "श्रेण्या",
    "report.generating": "PDF तयार होत आहे…",
    "report.watermark_note": "मोफत आवृत्तीत वॉटरमार्क जोडला जाईल",
    "report.share": "अहवाल शेअर करा",
    "report.whatsapp_note":
      "PDF आधीच डाउनलोड झाला आहे. WhatsApp मध्ये मॅन्युअली जोडा.",
    "report.set_profile": "अहवाल तयार करण्यासाठी",
    "report.set_profile2": "सेटिंग्ज",
    "report.set_profile3": "मध्ये आपले नाव सेट करा.",
    "report.current_plan": "सध्याची योजना",
    "report.choose_plan": "योजना निवडा",
    "report.upgrade": "अपग्रेड करा",

    // Months
    "months.jan": "जानेवारी",
    "months.feb": "फेब्रुवारी",
    "months.mar": "मार्च",
    "months.apr": "एप्रिल",
    "months.may": "मे",
    "months.jun": "जून",
    "months.jul": "जुलै",
    "months.aug": "ऑगस्ट",
    "months.sep": "सप्टेंबर",
    "months.oct": "ऑक्टोबर",
    "months.nov": "नोव्हेंबर",
    "months.dec": "डिसेंबर",

    // Profile
    "profile.name": "तुमचे नाव",
    "profile.email": "ईमेल पत्ता",
    "profile.company": "कंपनी (पर्यायी)",
    "profile.save": "प्रोफाइल जतन करा",

    // Premium
    "premium.title": "प्रीमियम घ्या",
    "premium.monthly": "₹99/महिना",
    "premium.annual": "₹49/महिना (वार्षिक)",
    "premium.beta_days_left": "बीटा दिवस शिल्लक",
    "premium.watermark": "नमुना - मोफत आवृत्ती",

    // Settings
    "settings.title": "सेटिंग्ज",
    "settings.profile": "प्रोफाइल",
    "settings.language": "भाषा",
    "settings.appearance": "देखावा",
    "settings.about": "माहिती",
    "settings.dark_mode": "डार्क मोड",
    "settings.dark_active": "डार्क थीम सक्रिय",
    "settings.light_active": "लाइट थीम सक्रिय",
    "settings.beta_title": "बीटा 31 जुलै 2026 पर्यंत — पूर्ण ॲक्सेस घ्या!",
    "settings.beta_desc":
      "Fieldspend 31 जुलै 2026 पर्यंत मोफत आणि पूर्ण फीचरसह उपलब्ध आहे. त्यानंतर मोफत वापरकर्त्यांना जाहिराती दिसतील. प्रीमियमवर अपग्रेड करा.",
    "settings.days_remaining": "दिवस शिल्लक (31 जुलै 2026 पर्यंत)",
    "settings.beta_ends_date": "बीटा 31 जुलै 2026 रोजी संपेल",
    "settings.beta_days_remaining": "बीटामध्ये दिवस शिल्लक",
    "settings.current_plan": "सध्याची योजना",
    "settings.choose_plan": "योजना निवडा",
    "settings.monthly": "मासिक",
    "settings.annual": "वार्षिक",
    "settings.per_month": "दर महिना",
    "settings.save_50": "50% बचत!",
    "settings.most_popular": "सर्वात लोकप्रिय",
    "settings.unlimited_receipts": "अमर्यादित पावत्या",
    "settings.no_watermark": "वॉटरमार्क नाही",
    "settings.no_ads": "जाहिराती नाहीत",
    "settings.priority_support": "प्राधान्य सहाय्य",
    "settings.everything_monthly": "मासिकातील सर्व सुविधा",
    "settings.best_value": "सर्वोत्तम मूल्य",
    "settings.premium_active": "तुमच्याकडे पूर्ण प्रीमियम ॲक्सेस आहे — आनंद घ्या!",
    "settings.upgrade": "अपग्रेड करा",
    "settings.share_app": "ॲप शेअर करा",
    "settings.company_optional": "पर्यायी",
    "settings.company_label": "कंपनीचे नाव",
    "settings.saving": "जतन होत आहे…",
    "settings.name_required": "नाव आवश्यक आहे",
    "settings.coming_soon": "लवकरच येत आहे!",
    "settings.premium_coming":
      "प्रीमियम अपग्रेड लवकरच उपलब्ध होतील! पेमेंट उपलब्ध होताच तुम्हाला सूचित केले जाईल.",
    "settings.beta_access":
      "दरम्यान, पूर्ण बीटा ॲक्सेस घ्या — अमर्यादित पावत्या, स्वच्छ PDF निर्यात, प्राधान्य सहाय्य.",
    "settings.notify_me": "मला सूचित करा",
    "settings.close": "बंद करा",
    "settings.notified": "प्रीमियम उपलब्ध झाल्यावर आम्ही तुम्हाला सूचित करू!",
    "settings.lang_set": "भाषा बदलली",
    "settings.app_link_copied": "ॲप लिंक क्लिपबोर्डवर कॉपी केली!",

    // Payment / Upgrade
    "upgrade.title": "प्रीमियमवर अपग्रेड करा",
    "upgrade.subtitle": "अमर्यादित पावत्या, स्वच्छ PDF, जाहिराती नाहीत",
    "plan.monthly": "मासिक",
    "plan.annual": "वार्षिक",
    "plan.savings": "मासिकाच्या तुलनेत ₹600/वर्ष बचत",
    "btn.upgrade": "Razorpay ने पेमेंट करा",
    "premium.active": "प्रीमियम सक्रिय",
    "premium.expiry": "वैध आहे पर्यंत",
    "payment.processing": "पेमेंट प्रक्रिया होत आहे…",

    // Ads
    "ad.advertisement": "जाहिरात",
    "ad.ends_in": "जाहिरात संपेल",
    "ad.seconds": "सेकंदात",
    "ad.continue": "पुढे जा",
    "ad.upgrade_now": "प्रीमियमवर अपग्रेड करा",
    "ad.no_ads_premium": "प्रीमियम घ्या — जाहिराती नाहीत, मर्यादा नाहीत!",
    "ad.of": "पैकी",
    ad_watch_title: "आपले फीचर अनलॉक करा — ही छोटी जाहिरात पहा",
    ad_countdown: "जाहिरात संपते",
    ad_claim_reward: "बक्षीस मिळवा",
    ad_unlocked_message: "आणखी 5 अपलोड अनलॉक झाले!",
    beta_ends_in: "बीटा संपतो",
    beta_has_ended: "बीटा कालावधी संपली — पुढे चालू ठेवण्यासाठी अपग्रेड करा",
    upgrade_required: "अपग्रेड आवश्यक",
  },
};

// ─── Month Keys (ordered Jan–Dec) ─────────────────────────────────────────────

export const MONTH_KEYS = [
  "months.jan",
  "months.feb",
  "months.mar",
  "months.apr",
  "months.may",
  "months.jun",
  "months.jul",
  "months.aug",
  "months.sep",
  "months.oct",
  "months.nov",
  "months.dec",
] as const;

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

/** Translate with an explicit language override — useful for reactive components */
export function tLang(key: string, lang: Language): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}

export const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
  { value: "mr", label: "Marathi", native: "मराठी" },
];
