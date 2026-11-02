import { isSupabaseConfigured, supabase } from "./supabase-client.js";

const status = document.querySelector("#certification-status");
const list = document.querySelector("#certification-list");
const initialCertifications = [
    {
        title: "Google Skillshop",
        description: "Nettbaserte kurs og opplæring i Googles verktøy for digital markedsføring og analyse.",
        sort_order: 10
    },
    {
        title: "Claude Academy",
        description: "Opplæring i å bruke Claude og generativ kunstig intelligens på en effektiv måte.",
        sort_order: 20
    },
    {
        title: "HubSpot Academy",
        description: "Kurs innen inbound marketing, innholdsproduksjon, salg og CRM.",
        sort_order: 30
    },
    {
        title: "Meta Blueprint",
        description: "Opplæring i annonsering, innholdsstrategi og markedsføring på Metas plattformer.",
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
    addTextElement(summary, "h2", "", certification.title);
    if (certification.provider) {
        addTextElement(summary, "p", "certification-provider", certification.provider);
    }
    if (certification.status) {
        addTextElement(summary, "p", "certification-status-label", certification.status);
    }
    card.append(summary);

    const details = document.createElement("div");
    details.className = "certification-details";

    if (certification.completed_on) {
        const date = new Date(`${certification.completed_on}T00:00:00`);
        addTextElement(details, "p", "certification-date", date.toLocaleDateString("no-NO"));
    }
    if (certification.description) {
        addTextElement(details, "p", "certification-description", certification.description);
    }

    if (certification.credential_url) {
        const link = document.createElement("a");
        link.href = certification.credential_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Se sertifikat";
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
        status.textContent = "Redigering via admin blir tilgjengelig når Supabase er konfigurert.";
        return;
    }

    const { data, error } = await supabase
        .from("certifications")
        .select("id, title, provider, description, status, completed_on, credential_url, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Kunne ikke laste sertifiseringer og kurs:", error);
        status.textContent = "Sertifiseringer og kurs kunne ikke lastes inn.";
        return;
    }

    list.replaceChildren(...data.map(renderCertification));
    status.textContent = data.length === 0 ? "Ingen sertifiseringer eller kurs er lagt til ennå." : "";
}

loadCertifications();
