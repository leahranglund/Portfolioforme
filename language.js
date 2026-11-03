const languageStorageKey = "portfolio-language";
const supportedLanguages = ["en", "no"];

const translations = {
    en: {
        common: {
            home: "Home",
            cv: "CV",
            gallery: "Gallery",
            about: "About me",
            certifications: "Certifications and courses",
            projects: "Projects",
            mainMenu: "Main menu",
            funFact: "Did you know?",
            closeFunFact: "Close fun fact"
        },
        index: {
            title: "My portfolio",
            heroLabel: "Highlands landscape",
            cardLabel: "Business card",
            contact: "Contact me",
            email: "Email:",
            phone: "Phone:",
            funFactAria: "Fun fact about the front page",
            funFact: "Vancouver uses “sea to sky” to advertise a range of gondolas. We should have moved Galdhøpiggen to the Oslo Fjord."
        },
        portfolio: {
            title: "My portfolio",
            heading: "Welcome to my portfolio",
            intro: "Explore my work, experience and skills.",
            funFactAria: "Fun fact about the portfolio",
            funFact: "The portfolio is built with HTML, CSS and JavaScript."
        },
        cv: {
            title: "CV - My portfolio",
            heading: "CV",
            intro: "Here you can read about my experience, education and skills.",
            funFactAria: "Fun fact about my CV",
            funFact: "My CV can be opened as a PDF from the menu above."
        },
        gallery: {
            title: "Gallery - My portfolio",
            carouselAria: "3D image carousel. Use the left and right arrow keys or drag to browse.",
            lightboxAria: "Enlarged image",
            funFactAria: "Fun fact about the gallery",
            funFact: "The gallery contains 22 images that can be opened in a larger view."
        },
        about: {
            title: "About me - My portfolio",
            heading: "About me",
            text: "Hi, I’m Leah. I combine creativity and technology, and my goal is to work where marketing and tech meet.\n\nI am studying digital marketing at Kristiania University College, with a background in sociology and one year of cybersecurity. This gives me an unusual combination: an understanding of what makes people take action, and an interest in the technology that makes it possible to reach them.\n\nI want to move further into the technology side of marketing, and this portfolio is proof of that. I coded the entire website myself using HTML, CSS and JavaScript.\n\nI use AI as a professional work tool. I assess what is actually more time-efficient to do manually and let AI handle repetitive and time-consuming tasks, so I can focus on strategy, creative choices and quality assurance. I lead the process and make the final decisions myself.\n\nYou can find my LinkedIn profile and CV in the menu.",
            contact: "Contact me",
            spotifyControls: "Spotify controls",
            previousTrack: "Previous song",
            toggleTrack: "Play or pause",
            nextTrack: "Next song",
            funFactAria: "Fun fact about the music",
            funFact: "My weakest point is chocolate cake."
        },
        certifications: {
            title: "Certifications - My portfolio",
            heading: "Certifications and courses",
            intro: "Leah Ranglund has completed or is currently taking the following certifications and courses:",
            funFactAria: "Fun fact about the certifications",
            funFact: "The course list ranges from Google Skillshop to Claude Academy.",
            loadingError: "Certifications and courses could not be loaded.",
            empty: "No certifications or courses have been added yet."
        },
        projects: {
            title: "Projects - My portfolio",
            heading: "Projects",
            intro: "This page presents some of the projects I have worked on. More work is still under construction and will be added here.",
            ocean: "I participated in the student category of the competition. Two of my ideas reached the top: the jury selected “Violence has no fight day” as the winning entry, while “This Christmas, Mum got...” came third. Both entries were developed for Vold og Overgrepslinjen.",
            vaga: "Advertisement published on the Instagram account of Løplabbet Sandvika for VÅGA caps.",
            travel: "The travel magazine was produced in Adobe InDesign as part of a publishing course at Kristiania University College.",
            newspaper: "The newspaper spread was produced in Adobe InDesign as part of a publishing course at Kristiania University College.",
            magazineLoading: "Loading magazine ...",
            spreadLoading: "Loading spread ...",
            funFactAria: "Fun fact about the projects",
            funFact: "The projects demonstrate different types of visual communication and design work."
        },
        admin: {
            title: "Admin - Certifications and courses",
            home: "Home",
            mainMenu: "Main menu",
            heading: "Admin: Certifications and courses",
            intro: "Log in to add, edit, publish or remove items.",
            yourItems: "Your certifications and courses",
            logOut: "Log out",
            englishTitle: "English name",
            englishDescription: "English description"
        }
    },
    no: {
        common: {
            home: "Hovedside",
            cv: "CV",
            gallery: "Galleri",
            about: "Om meg",
            certifications: "Sertifiseringer og kurs",
            projects: "Prosjekter",
            mainMenu: "Hovedmeny",
            funFact: "Visste du at?",
            closeFunFact: "Lukk fun fact"
        }
    }
};

function getLanguage() {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    return supportedLanguages.includes(storedLanguage) ? storedLanguage : "no";
}

function setLanguage(language) {
    window.localStorage.setItem(languageStorageKey, language);
    window.location.reload();
}

function currentPage() {
    return window.location.pathname.split("/").pop().toLowerCase() || "index.html";
}

function addLanguageSwitcher(language) {
    const navigation = document.querySelector("nav ul");
    if (!navigation || document.querySelector(".language-switcher")) {
        return;
    }

    const item = document.createElement("li");
    item.className = "language-switcher";
    const english = document.createElement("a");
    english.href = "#";
    english.textContent = "EN";
    english.className = language === "en" ? "is-active" : "";
    english.setAttribute("aria-label", "Switch to English");
    english.addEventListener("click", (event) => {
        event.preventDefault();
        setLanguage("en");
    });
    const separator = document.createElement("span");
    separator.textContent = " | ";
    separator.setAttribute("aria-hidden", "true");
    const norwegian = document.createElement("a");
    norwegian.href = "#";
    norwegian.textContent = "NO";
    norwegian.className = language === "no" ? "is-active" : "";
    norwegian.setAttribute("aria-label", "Bytt til norsk");
    norwegian.addEventListener("click", (event) => {
        event.preventDefault();
        setLanguage("no");
    });
    item.append(english, separator, norwegian);
    navigation.prepend(item);
}

function setText(selector, text) {
    const element = document.querySelector(selector);
    if (element && text) {
        element.textContent = text;
    }
}

function translateCommon(language) {
    const common = translations[language].common;
    document.documentElement.lang = language;
    document.querySelector("nav")?.setAttribute("aria-label", common.mainMenu);
    setText(".logo a", common.home);
    document.querySelectorAll("nav li a").forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (href.includes("Galleri.html")) link.textContent = common.gallery;
        if (href.includes("Om-meg.html")) link.textContent = common.about;
        if (href.includes("Sertifiseringer.html")) link.textContent = common.certifications;
        if (href.includes("Prosjekter.html")) link.textContent = common.projects;
        if (href.includes("CV/") || href === "CV.html") {
            link.textContent = common.cv;
            link.href = language === "en" ? "CV.html" : "CV/Leah_Ranglund_CV26.pdf";
        }
    });
    document.querySelectorAll(".fun-fact-label").forEach((element) => {
        element.textContent = common.funFact;
    });
    document.querySelectorAll(".fun-fact-close").forEach((button) => {
        button.setAttribute("aria-label", common.closeFunFact);
    });
}

function translatePage(language) {
    const page = currentPage();
    const content = translations[language];
    if (language === "no") {
        return;
    }

    if (page === "index.html") {
        document.title = content.index.title;
        document.querySelector(".home-hero")?.setAttribute("aria-label", content.index.heroLabel);
        document.querySelector(".home-next-section")?.setAttribute("aria-label", content.index.cardLabel);
        setText(".home-business-card-contact-label", content.index.contact);
        document.querySelectorAll(".home-business-card-contact a")[0].textContent = `${content.index.email} leahranglund@icloud.com`;
        document.querySelectorAll(".home-business-card-contact a")[1].textContent = `${content.index.phone} +47 94798567`;
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.index.funFactAria);
        setText(".fun-fact p", content.index.funFact);
    } else if (page === "portfolio.html") {
        document.title = content.portfolio.title;
        setText("h1", content.portfolio.heading);
        setText("main p", content.portfolio.intro);
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.portfolio.funFactAria);
        setText(".fun-fact p", content.portfolio.funFact);
    } else if (page === "cv.html") {
        document.title = content.cv.title;
        setText("h1", content.cv.heading);
        setText("main p", content.cv.intro);
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.cv.funFactAria);
        setText(".fun-fact p", content.cv.funFact);
    } else if (page === "galleri.html") {
        document.title = content.gallery.title;
        document.querySelector(".carousel-stage")?.setAttribute("aria-label", content.gallery.carouselAria);
        document.querySelector(".image-lightbox")?.setAttribute("aria-label", content.gallery.lightboxAria);
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.gallery.funFactAria);
        setText(".fun-fact p", content.gallery.funFact);
    } else if (page === "om-meg.html") {
        document.title = content.about.title;
        setText("h1", content.about.heading);
        setText(".about-copy > p", content.about.text);
        setText(".about-contact-link", content.about.contact);
        document.querySelector(".spotify-controls")?.setAttribute("aria-label", content.about.spotifyControls);
        setText("#previous-track", "⏮");
        setText("#toggle-track", "⏯");
        setText("#next-track", "⏭");
        ["#previous-track", "#toggle-track", "#next-track"].forEach((selector, index) => {
            const labels = [content.about.previousTrack, content.about.toggleTrack, content.about.nextTrack];
            document.querySelector(selector)?.setAttribute("aria-label", labels[index]);
            document.querySelector(selector)?.setAttribute("title", labels[index]);
        });
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.about.funFactAria);
        setText(".fun-fact p", content.about.funFact);
    } else if (page === "sertifiseringer.html") {
        document.title = content.certifications.title;
        setText("h1", content.certifications.heading);
        setText("main section > p", content.certifications.intro);
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.certifications.funFactAria);
        setText(".fun-fact p", content.certifications.funFact);
    } else if (page === "prosjekter.html") {
        document.title = content.projects.title;
        setText("h1", content.projects.heading);
        setText("main section > p", content.projects.intro);
        setText(".project-description-placeholder", content.projects.ocean);
        document.querySelectorAll(".project-description p")[1].textContent = content.projects.vaga;
        document.querySelectorAll(".project-description p")[2].textContent = content.projects.travel;
        document.querySelectorAll(".project-description p")[3].textContent = content.projects.newspaper;
        document.querySelectorAll(".page-counter")[0].textContent = content.projects.magazineLoading;
        document.querySelectorAll(".page-counter")[1].textContent = content.projects.spreadLoading;
        document.querySelector(".fun-fact")?.setAttribute("aria-label", content.projects.funFactAria);
        setText(".fun-fact p", content.projects.funFact);
    } else if (page === "admin.html") {
        document.title = content.admin.title;
        setText(".logo a", content.admin.home);
        setText("h1", content.admin.heading);
        setText("main section > p", content.admin.intro);
        setText(".admin-toolbar h2", content.admin.yourItems);
        setText("#sign-out", content.admin.logOut);
        setText("label[for='admin-email']", "Email");
        setText("label[for='admin-password']", "Password");
        setText("#login-form button", "Log in");
        setText("label[for='certification-title']", "Name");
        setText("label[for='certification-title-en']", content.admin.englishTitle);
        setText("label[for='certification-provider']", "Course provider");
        setText("label[for='certification-description']", "Description");
        setText("label[for='certification-description-en']", content.admin.englishDescription);
        setText("label[for='certification-status']", "Status");
        setText("label[for='certification-date']", "Completion date");
        setText("label[for='certification-url']", "Certificate link");
        setText("label[for='certification-order']", "Order");
        const publishedLabel = document.querySelector(".admin-checkbox");
        if (publishedLabel?.lastChild) {
            publishedLabel.lastChild.textContent = " Show publicly";
        }
        setText("#certification-form button[type='submit']", "Save");
        setText("#cancel-edit", "Cancel editing");
    }
}

const language = getLanguage();
addLanguageSwitcher(language);
translateCommon(language);
translatePage(language);
window.siteLanguage = language;
