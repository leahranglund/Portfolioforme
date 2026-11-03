import { isSupabaseConfigured, supabase } from "./supabase-client.js";

const status = document.querySelector("#certification-status");
const list = document.querySelector("#certification-list");
const language = window.localStorage.getItem("portfolio-language") === "en" ? "en" : "no";
const initialCertifications = [
    {
        title: "Google Skillshop",
        title_en: "Google Skillshop",
        description: "Nettbaserte kurs og opplæring i Googles verktøy for digital markedsføring og analyse.",
        description_en: "Online courses and training in Google's tools for digital marketing and analytics.",
        sort_order: 10
    },
    {
        title: "Claude Academy",
        title_en: "Claude Academy",
        description: "Opplæring i å bruke Claude og generativ kunstig intelligens på en effektiv måte.",
        description_en: "Training in using Claude and generative AI effectively.",
        sort_order: 20
    },
    {
        title: "HubSpot Academy",
        title_en: "HubSpot Academy",
        description: "Kurs innen inbound marketing, innholdsproduksjon, salg og CRM.",
        description_en: "Courses in inbound marketing, content creation, sales and CRM.",
        sort_order: 30
    },
    {
        title: "Meta Blueprint",
        title_en: "Meta Blueprint",
        description: "Opplæring i annonsering, innholdsstrategi og markedsføring på Metas plattformer.",
        description_en: "Training in advertising, content strategy and marketing on Meta platforms.",
        sort_order: 40
    }
];

function addTextElement(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    element.textContent = text;
    parent.append(element);
    return element;
}

function renderCertification(certification) {
    const card = document.createElement("details");
    card.className = "certification-card";

    const summary = document.createElement("summary");
    addTextElement(summary, "h2", "", language === "en" && certification.title_en ? certification.title_en : certification.title);
    if (certification.provider) {
        addTextElement(summary, "p", "certification-provider", certification.provider);
    }
    if (certification.status) {
        const status = language === "en"
            ? { Fullført: "Completed", Pågående: "In progress" }[certification.status] || certification.status
            : certification.status;
        addTextElement(summary, "p", "certification-status-label", status);
    }
    card.append(summary);

    const details = document.createElement("div");
    details.className = "certification-details";

    if (certification.completed_on) {
        const date = new Date(`${certification.completed_on}T00:00:00`);
        addTextElement(details, "p", "certification-date", date.toLocaleDateString(language === "en" ? "en-GB" : "no-NO"));
    }
    const description = language === "en" && certification.description_en
        ? certification.description_en
        : certification.description;
    if (description) {
        addTextElement(details, "p", "certification-description", description);
    }

    if (certification.credential_url) {
        const link = document.createElement("a");
        link.href = certification.credential_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = language === "en" ? "View certificate" : "Se sertifikat";
        details.append(link);
    }

    if (details.children.length > 0) {
        card.append(details);
    }
    return card;
}

async function loadCertifications() {
    if (!isSupabaseConfigured || !supabase) {
        list.replaceChildren(...initialCertifications.map(renderCertification));
        status.textContent = language === "en"
            ? "Editing will be available when Supabase is configured."
            : "Redigering via admin blir tilgjengelig når Supabase er konfigurert.";
        return;
    }

    const translatedQuery = supabase
        .from("certifications")
        .select("id, title, title_en, provider, description, description_en, status, completed_on, credential_url, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    let { data, error } = await translatedQuery;
    if (error && /title_en|description_en|column/i.test(error.message || "")) {
        console.warn("Engelske kursfelt mangler i Supabase. Viser standardfeltene inntil migreringen er kjørt.");
        ({ data, error } = await supabase
            .from("certifications")
            .select("id, title, provider, description, status, completed_on, credential_url, sort_order")
            .eq("is_published", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false }));
    }

    if (error || !data) {
        console.error("Kunne ikke laste sertifiseringer og kurs:", error);
        status.textContent = language === "en"
            ? "Certifications and courses could not be loaded."
            : "Sertifiseringer og kurs kunne ikke lastes inn.";
        return;
    }

    list.replaceChildren(...data.map(renderCertification));
    status.textContent = data.length === 0
        ? (language === "en"
            ? "No certifications or courses have been added yet."
            : "Ingen sertifiseringer eller kurs er lagt til ennå.")
        : "";
}

loadCertifications();
