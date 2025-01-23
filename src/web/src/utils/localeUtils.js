export async function toggleLocale(VueInstance) {
    const savedLocale = VueInstance.$cookies.get("locale") || "en"; // Default to English if missing
    const routeLocale = VueInstance.$route.params.locale;

    if (savedLocale !== routeLocale) {
        try {
            VueInstance.$cookies.set("locale", routeLocale); // Save to cookie
            VueInstance.$i18n.locale = routeLocale; // Set locale in Vue I18n
            if (typeof VueInstance.loadLocale === "function") {
                await VueInstance.loadLocale(routeLocale);
            } else {
                console.warn("loadLocale is not a function on VueInstance");
            }
            
            // Redirect to update the URL only if it doesn't match
            if (VueInstance.$route.params.locale !== routeLocale) {
                VueInstance.$router.replace({
                    params: { ...VueInstance.$route.params, locale: routeLocale }
                });
            }
        } catch (error) {
            console.error("Error loading locale:", error);
        }
    }
}