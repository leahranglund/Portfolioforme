const analyticsId = "G-W4219BJLY5";
const consentStorageKey = "portfolio-analytics-consent";
const languageStorageKey = "portfolio-language";
const cookieCopy = {
    no: {
        title: "Informasjonskapsler",
        message: "Her skulle man kanskje ønske at det ble servert en deilig, varm cookie. Dessverre er det bare jeg som gjerne ønsker å følge analysen av eget nettsted med Google Analytics.",
        accept: "Godkjenn",
        decline: "Avslå"
    },
    en: {
        title: "Cookies",
        message: "You might hope for a delicious, warm cookie here. Unfortunately, I would simply like to use Google Analytics to understand how my own website is used.",
        accept: "Accept",
        decline: "Decline"
    }
};

function getLanguage() {
    return window.localStorage.getItem(languageStorageKey) === "en" ? "en" : "no";
}

function getStoredConsent() {
    try {
        return window.localStorage.getItem(consentStorageKey);
    } catch (error) {
        console.error("Kunne ikke lese samtykke for Google Analytics:", error);
        return null;
    }
}

function storeConsent(value) {
    try {
        window.localStorage.setItem(consentStorageKey, value);
    } catch (error) {
        console.error("Kunne ikke lagre samtykke for Google Analytics:", error);
    }
}

function loadAnalytics() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.append(script);
}

function removeBanner(banner) {
    banner.remove();
}

function showFunFacts() {
    document.body.classList.remove("cookie-consent-pending");
    document.body.classList.add("cookie-consent-resolved");
}

function createBanner() {
    const copy = cookieCopy[getLanguage()];
    const banner = document.createElement("aside");
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "cookie-consent-title");
    banner.setAttribute("aria-describedby", "cookie-consent-message");

    const image = document.createElement("img");
    image.src = "Bilder/cookie.png";
    image.alt = "";
    image.className = "cookie-consent-image";

    const content = document.createElement("div");
    content.className = "cookie-consent-content";
    const title = document.createElement("h2");
    title.id = "cookie-consent-title";
    title.textContent = copy.title;
    const message = document.createElement("p");
    message.id = "cookie-consent-message";
    message.textContent = copy.message;
    content.append(title, message);

    const actions = document.createElement("div");
    actions.className = "cookie-consent-actions";
    const acceptButton = document.createElement("button");
    acceptButton.type = "button";
    acceptButton.className = "cookie-consent-accept";
    acceptButton.textContent = copy.accept;
    const declineButton = document.createElement("button");
    declineButton.type = "button";
    declineButton.className = "cookie-consent-decline";
    declineButton.textContent = copy.decline;
    actions.append(acceptButton, declineButton);
    banner.append(image, content, actions);
    document.body.append(banner);

    acceptButton.addEventListener("click", () => {
        storeConsent("granted");
        removeBanner(banner);
        showFunFacts();
        loadAnalytics();
    });
    declineButton.addEventListener("click", () => {
        storeConsent("denied");
        removeBanner(banner);
        showFunFacts();
    });
}

const consent = getStoredConsent();
if (consent === "granted") {
    showFunFacts();
    loadAnalytics();
} else if (consent !== "denied") {
    createBanner();
} else {
    showFunFacts();
}
