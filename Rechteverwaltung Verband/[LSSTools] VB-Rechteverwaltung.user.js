// ==UserScript==
// @name         [LSSTools] Verband Rechteverwalter
// @namespace    https://leitstellenspiel.de/
// @version      0.9.6
// @description  Rechte-Buttons direkt bei den Mitgliedern in kompakter Toolbar anzeigen inkl. LGM+100%, LGM-0% und Alliance-Buttons
// @author       NinoRossi
// @match        https://www.leitstellenspiel.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// @updateURL   https://github.com/NR1986/lsstools/raw/refs/heads/main/Rechteverwaltung%20Verband/%5BLSSTools%5D%20VB-Rechteverwaltung.user.js
// @downloadURL https://github.com/NR1986/lsstools/raw/refs/heads/main/Rechteverwaltung%20Verband/%5BLSSTools%5D%20VB-Rechteverwaltung.user.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Rechteverwalter Toolbar aktiv");

    const buttonMapping = {
        "Rauswerfen": { text: "Kick", class: "btn-danger" },
        "Als Admin setzen": { text: "VB-A", class: "btn-success" },
        "Als Admin entfernen": { text: "VB-A", class: "btn-danger" },
        "Als Co-Admin setzen": { text: "VB-C", class: "btn-success" },
        "Als Co-Admin entfernen": { text: "VB-C", class: "btn-danger" },
        "Als Sprechwunsch-Admin setzen": { text: "SW-A", class: "btn-success" },
        "Als Sprechwunsch-Admin entfernen": { text: "SW-A", class: "btn-danger" },
        "Als Aufsichtsrat setzen": { text: "AR", class: "btn-success" },
        "Aus dem Aufsichtsrat entfernen": { text: "AR", class: "btn-danger" },
        "Als Finanzminister setzen": { text: "FM", class: "btn-success" },
        "Als Finanzminister entfernen": { text: "FM", class: "btn-danger" },
        "Als Lehrgangsmeister setzen": { text: "LGM", class: "btn-success" },
        "Als Lehrgangsmeister entfernen": { text: "LGM", class: "btn-danger" },
        "Als Personal setzen": { text: "VB-P", class: "btn-success" },
        "Als Personal entfernen": { text: "VB-P", class: "btn-danger" },
        "Als Eventmanager setzen": { text: "EvM", class: "btn-success" },
        "Als Eventmanager entfernen": { text: "EvM", class: "btn-danger" },
        "Als Verbands-Admin setzen": { text: "VB-A", class: "btn-success" },
        "Als Verbands-Admin entfernen": { text: "VB-A", class: "btn-danger" },
        "Als Verbands-Co-Admin setzen": { text: "VB-C", class: "btn-success" },
        "Als Verbands-Co-Admin entfernen": { text: "VB-C", class: "btn-danger" },
        "Als Sprechwunsch-Admin setzen": { text: "SW-A", class: "btn-success" },
        "Als Sprechwunsch-Admin entfernen": { text: "SW-A", class: "btn-danger" },
        "Als Aufsichtsrat setzen": { text: "AR", class: "btn-success" },
        "Als Aufsichtsrat entfernen": { text: "AR", class: "btn-danger" },
        "Als Finanzminister setzen": { text: "FM", class: "btn-success" },
        "Als Finanzminister entfernen": { text: "FM", class: "btn-danger" },
        "Als Lehrgangsmeister setzen": { text: "LGM", class: "btn-success" },
        "Als Lehrgangsmeister entfernen": { text: "LGM", class: "btn-danger" },
        "Als Verbands-Personal setzen": { text: "VB-P", class: "btn-success" },
        "Als Verbands-Personal entfernen": { text: "VB-P", class: "btn-danger" },
        "Als Eventmanager setzen": { text: "EvM", class: "btn-success" },
        "Als Eventmanager entfernen": { text: "EvM", class: "btn-danger" }
    };
    function processButtons() {
        document.querySelectorAll("a.btn_edit_rights[user_id]").forEach(editBtn => {
            const userId = editBtn.getAttribute("user_id");
            const parentTd = editBtn.parentNode;

            let rightsDiv = document.querySelector(`#rights_${userId}`);
            if (!rightsDiv && editBtn.nextElementSibling && editBtn.nextElementSibling.querySelector("a.btn")) {
                rightsDiv = editBtn.nextElementSibling;
            }
            if (!rightsDiv) rightsDiv = parentTd.querySelector("div");
            if (!rightsDiv) return;

            editBtn.remove();

            if (!parentTd.querySelector("div[data-rights-cloned]")) {
                const wrapper = document.createElement("div");
                wrapper.setAttribute("data-rights-cloned", "1");
                wrapper.style.marginTop = "5px";
                wrapper.style.display = "flex";
                wrapper.style.flexWrap = "wrap";
                wrapper.style.gap = "4px";

                rightsDiv.querySelectorAll("a.btn").forEach(origBtn => {
                    const text = origBtn.textContent.trim();
                    if (text && text !== "Schließen") {
                        if (buttonMapping[text]) {
                            origBtn.textContent = buttonMapping[text].text;
                            if (buttonMapping[text].class) {
                                origBtn.className = `btn btn-xs ${buttonMapping[text].class}`;
                            }
                        }

                        if (text === "Als Lehrgangsmeister setzen") {
                            origBtn.addEventListener("click", e => {
                                e.preventDefault();
                                fetch(`/verband/schooling/${userId}/1`, { method: "GET", credentials: "include" })
                                    .then(() => fetch(`/verband/discount/${userId}/10`, { method: "GET", credentials: "include" }))
                                    .then(() => location.reload())
                                    .catch(err => console.error(err));
                            }, { once: true });
                        }

                        if (text === "Als Lehrgangsmeister entfernen") {
                            origBtn.addEventListener("click", e => {
                                e.preventDefault();
                                fetch(`/verband/schooling/${userId}/0`, { method: "GET", credentials: "include" })
                                    .then(() => fetch(`/verband/discount/${userId}/0`, { method: "GET", credentials: "include" }))
                                    .then(() => location.reload())
                                    .catch(err => console.error(err));
                            }, { once: true });
                        }

                        wrapper.appendChild(origBtn);
                    }
                });

                const usernameCell = parentTd.parentNode.querySelector("td:nth-child(1)");
                let username = "";
                if (usernameCell) username = usernameCell.textContent.trim();

                if (username) {
                    const link1 = document.createElement("a");
                    link1.textContent = "Alliance Log (target)";
                    link1.href = `/alliance_logfiles?utf8=✓&target_user=${encodeURIComponent(username)}`;
                    link1.target = "_blank";
                    link1.className = "btn btn-xs btn-info";
                    wrapper.appendChild(link1);

                    const link2 = document.createElement("a");
                    link2.textContent = "Alliance Log (user)";
                    link2.href = `/alliance_logfiles?utf8=✓&user=${encodeURIComponent(username)}`;
                    link2.target = "_blank";
                    link2.className = "btn btn-xs btn-info";
                    wrapper.appendChild(link2);
                }

                parentTd.appendChild(wrapper);
            }
        });
    }

    processButtons();

    const tableBody = document.querySelector("table tbody");
    if (tableBody) {
        const tableObserver = new MutationObserver(() => processButtons());
        tableObserver.observe(tableBody, { childList: true, subtree: true });
    }

    setInterval(() => processButtons(), 1000);

})();
