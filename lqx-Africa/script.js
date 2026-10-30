/* =========================================================
   LQX AFRICA — GLOBAL JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. MOBILE NAVIGATION
       ===================================================== */

    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {

        navToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("active");

            navToggle.classList.toggle("active", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        /* Close menu when clicking a link */
        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =====================================================
       2. STICKY HEADER / SCROLL STATE
       ===================================================== */

    const header = document.querySelector(".site-header");

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       3. SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });

    });


    /* =====================================================
       4. FAQ ACCORDION
       ===================================================== */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.setAttribute("aria-expanded", "false");

        question.addEventListener("click", function () {

            const isOpen = item.classList.contains("active");

            /* Close all other FAQs */
            faqItems.forEach(function (otherItem) {

                if (otherItem !== item) {

                    otherItem.classList.remove("active");

                    const otherQuestion =
                        otherItem.querySelector(".faq-question");

                    if (otherQuestion) {
                        otherQuestion.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }

            });

            /* Toggle selected FAQ */
            item.classList.toggle("active", !isOpen);

            question.setAttribute(
                "aria-expanded",
                !isOpen ? "true" : "false"
            );

        });

    });


    /* =====================================================
       5. LIQUIDITY DESK
       ===================================================== */

    const deskCards = document.querySelectorAll(".liquidity-option");
    const deskButtons = document.querySelectorAll(".option-select");

    const submissionType =
        document.getElementById("submissionType");

    const formTitle =
        document.getElementById("formTitle");

    const formIntro =
        document.getElementById("formIntro");

    const submitButton =
        document.getElementById("submitButton");

    const commercialSection =
        document.getElementById("commercialSection");

    const capitalSection =
        document.getElementById("capitalSection");

    const liquidityForm =
        document.getElementById("liquidityForm");

    const formMessage =
        document.getElementById("formMessage");


    function updateDesk(type, updateUrl = true) {

        if (!type) {
            type = "liquidity";
        }

        /* -----------------------------------------------
           Configuration
        ------------------------------------------------ */

        const deskConfig = {

            liquidity: {
                title: "Submit a Liquidity Requirement",
                intro:
                    "Tell us about the commercial transaction, contract, invoice or business requirement for which liquidity is being considered.",
                button:
                    "SUBMIT LIQUIDITY REQUIREMENT"
            },

            opportunity: {
                title: "Submit a Commercial Opportunity",
                intro:
                    "Share a commercial opportunity that may require structured liquidity, capital or appropriate transaction support.",
                button:
                    "SUBMIT COMMERCIAL OPPORTUNITY"
            },

            capital: {
                title: "Join the LQX Capital Network",
                intro:
                    "Provide your institution or investment profile so LQX can understand your capital mandate, preferences and participation requirements.",
                button:
                    "SUBMIT CAPITAL PROVIDER PROFILE"
            }

        };

        const config = deskConfig[type] || deskConfig.liquidity;


        /* -----------------------------------------------
           Update hidden type
        ------------------------------------------------ */

        if (submissionType) {
            submissionType.value = type;
        }


        /* -----------------------------------------------
           Update form heading
        ------------------------------------------------ */

        if (formTitle) {
            formTitle.textContent = config.title;
        }

        if (formIntro) {
            formIntro.textContent = config.intro;
        }

        if (submitButton) {
            submitButton.textContent = config.button;
        }


        /* -----------------------------------------------
           Show / hide relevant sections
        ------------------------------------------------ */

        if (commercialSection) {
            commercialSection.style.display =
                type === "capital"
                    ? "none"
                    : "";
        }

        if (capitalSection) {
            capitalSection.style.display =
                type === "capital"
                    ? ""
                    : "none";
        }


        /* -----------------------------------------------
           Highlight selected card
        ------------------------------------------------ */

        deskCards.forEach(function (card) {

            card.classList.toggle(
                "active",
                card.dataset.type === type
            );

        });


        /* -----------------------------------------------
           Update URL
        ------------------------------------------------ */

        if (updateUrl && window.history && window.history.replaceState) {

            const url =
                new URL(window.location.href);

            url.searchParams.set("type", type);

            window.history.replaceState(
                {},
                "",
                url.toString()
            );
        }

    }


    /* -----------------------------------------------
       Liquidity Desk buttons
    ------------------------------------------------ */

    deskButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const card =
                this.closest(".liquidity-option");

            if (!card) return;

            const type =
                card.dataset.type;

            updateDesk(type);

            const formSection =
                document.getElementById("liquidity-form");

            if (formSection) {

                const headerHeight =
                    header ? header.offsetHeight : 0;

                const position =
                    formSection.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight -
                    20;

                window.scrollTo({
                    top: position,
                    behavior: "smooth"
                });
            }

        });

    });


    /* -----------------------------------------------
       Load type from URL
    ------------------------------------------------ */

    if (submissionType || deskCards.length) {

        const params =
            new URLSearchParams(window.location.search);

        const requestedType =
            params.get("type");

        const validTypes =
            ["liquidity", "opportunity", "capital"];

        if (validTypes.includes(requestedType)) {
            updateDesk(requestedType, false);
        } else {
            updateDesk("liquidity", false);
        }

    }


    /* =====================================================
       6. LIQUIDITY DESK FORM VALIDATION
       ===================================================== */

    if (liquidityForm) {

        liquidityForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (formMessage) {
                    formMessage.className = "form-message";
                    formMessage.textContent = "";
                }


                /* ---------------------------------------
                   Basic validation
                --------------------------------------- */

                const requiredFields =
                    liquidityForm.querySelectorAll(
                        "[required]"
                    );

                let valid = true;
                let firstInvalid = null;

                requiredFields.forEach(function (field) {

                    const value =
                        field.value.trim();

                    if (!value) {

                        valid = false;

                        field.classList.add("input-error");

                        if (!firstInvalid) {
                            firstInvalid = field;
                        }

                    } else {

                        field.classList.remove(
                            "input-error"
                        );

                    }

                });


                /* ---------------------------------------
                   Email validation
                --------------------------------------- */

                const email =
                    liquidityForm.querySelector(
                        'input[type="email"]'
                    );

                if (email && email.value.trim()) {

                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!emailPattern.test(
                        email.value.trim()
                    )) {

                        valid = false;

                        email.classList.add(
                            "input-error"
                        );

                        if (!firstInvalid) {
                            firstInvalid = email;
                        }

                    }

                }


                /* ---------------------------------------
                   Stop if invalid
                --------------------------------------- */

                if (!valid) {

                    if (formMessage) {

                        formMessage.className =
                            "form-message error";

                        formMessage.textContent =
                            "Please complete the required fields and check your information before submitting.";
                    }

                    if (firstInvalid) {
                        firstInvalid.focus();
                    }

                    return;
                }


                /* ---------------------------------------
                   Prevent duplicate submissions
                --------------------------------------- */

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "SUBMITTING...";
                }


                /* ---------------------------------------
                   Current front-end confirmation
                   Backend can be connected later
                --------------------------------------- */

                setTimeout(function () {

                    if (formMessage) {

                        formMessage.className =
                            "form-message success";

                        formMessage.innerHTML =
                            "<strong>Submission received.</strong><br>" +
                            "Thank you for contacting LQX AFRICA. " +
                            "Our team will review the information provided " +
                            "and respond where appropriate.";
                    }


                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "SUBMISSION RECEIVED";
                    }

                    liquidityForm.reset();

                }, 800);

            }
        );

    }


    /* =====================================================
       7. REMOVE INPUT ERROR WHEN USER STARTS TYPING
       ===================================================== */

    document.querySelectorAll(
        "input, select, textarea"
    ).forEach(function (field) {

        field.addEventListener("input", function () {

            this.classList.remove(
                "input-error"
            );

        });

        field.addEventListener("change", function () {

            this.classList.remove(
                "input-error"
            );

        });

    });


    /* =====================================================
       8. SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".card, .process-step, .section-header, " +
            ".sidebar-card, .resource-download-card, " +
            ".news-card, .ecosystem-card"
        );

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(function (element) {

            element.classList.add(
                "reveal-on-scroll"
            );

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       9. ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    document.querySelectorAll(
        ".nav-menu a"
    ).forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const cleanHref =
            href.split("?")[0]
                .split("#")[0]
                .split("/")
                .pop()
                .toLowerCase();

        if (
            cleanHref &&
            cleanHref === currentPage &&
            !link.classList.contains("nav-cta")
        ) {

            link.classList.add("current-page");

        }

    });


    /* =====================================================
       10. BACK TO TOP
       ===================================================== */

    let backToTop =
        document.querySelector(".back-to-top");

    if (!backToTop) {

        backToTop =
            document.createElement("button");

        backToTop.className =
            "back-to-top";

        backToTop.type = "button";

        backToTop.setAttribute(
            "aria-label",
            "Back to top"
        );

        backToTop.innerHTML =
            '<i class="fa-solid fa-arrow-up"></i>';

        document.body.appendChild(
            backToTop
        );

    }


    function updateBackToTop() {

        if (window.scrollY > 600) {

            backToTop.classList.add(
                "visible"
            );

        } else {

            backToTop.classList.remove(
                "visible"
            );

        }

    }

    updateBackToTop();

    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =====================================================
       11. WHATSAPP BUTTON
       ===================================================== */

    const whatsappButtons =
        document.querySelectorAll(
            ".whatsapp-float, .whatsapp-button"
        );

    whatsappButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                /* Tracking hook */
                if (
                    typeof gtag === "function"
                ) {

                    gtag(
                        "event",
                        "whatsapp_click",
                        {
                            event_category:
                                "engagement",
                            event_label:
                                "LQX WhatsApp"
                        }
                    );

                }

            }
        );

    });


    /* =====================================================
       12. EXTERNAL LINKS
       ===================================================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(function (link) {

        const rel =
            link.getAttribute("rel") || "";

        if (!rel.includes("noopener")) {

            link.setAttribute(
                "rel",
                (rel + " noopener noreferrer").trim()
            );

        }

    });


    /* =====================================================
       13. NEWS / INSIGHT CARDS
       ===================================================== */

    document.querySelectorAll(
        ".news-card"
    ).forEach(function (card) {

        const link =
            card.querySelector("a");

        if (!link) return;

        card.style.cursor = "pointer";

        card.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.closest("a")
                ) {
                    return;
                }

                link.click();

            }
        );

    });


    /* =====================================================
       14. ACCESSIBILITY — KEYBOARD FOCUS
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Tab") {
                document.body.classList.add(
                    "keyboard-user"
                );
            }

        }
    );


    /* =====================================================
       15. CONSOLE CONFIRMATION
       ===================================================== */

    console.log(
        "LQX AFRICA website scripts loaded successfully."
    );

});