export function getSavedLocale(VueInstance) {
    return VueInstance.$cookies.get("locale") || "en";
}

export async function updateLocale(VueInstance, newLocale) {
    VueInstance.$cookies.set("locale", newLocale);
    VueInstance.$i18n.locale = newLocale;
console.log(newLocale);
    if (typeof VueInstance.loadLocale === "function") {
        await VueInstance.loadLocale(newLocale);
    }
}

export async function syncLocaleWithRoute(VueInstance) {
    const routeLocale = VueInstance.$route.params.locale;
    
    if (!routeLocale) {
        console.warn("No locale found in route params, defaulting to 'en'");
        return;
    }

    VueInstance.$i18n.locale = routeLocale;
    VueInstance.$cookies.set("locale", routeLocale);
    
    if (typeof VueInstance.loadLocale === "function") {
        await VueInstance.loadLocale(routeLocale);
    }
}

export async function breadcrumbsSyncLocaleWithRoute(context) {
    const routeLocale = context.$route.params.locale || "en";

    if (!context.$i18n) {
        console.warn("Vue I18n instance is missing. Cannot set locale.");
        return;
    }

    context.$i18n.locale = routeLocale;
    context.$cookies.set("locale", routeLocale);

    if (typeof context.loadLocale === "function") {
        await context.loadLocale(routeLocale);
    }

    
}

export async function toggleLocale(VueInstance) {
    const currentLocale = VueInstance.$route.params.locale;
    const newLocale = currentLocale === "en" ? "fr" : "en";

    let newPath = VueInstance.$route.fullPath.replace(/^\/[^/]+/, `/${newLocale}`);

    await updateLocale(VueInstance, newLocale);

    if (VueInstance.$route.params.locale !== newLocale) {
        VueInstance.$router.replace({ path: newPath });
    }
}