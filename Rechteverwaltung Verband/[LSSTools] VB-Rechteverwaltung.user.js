// ==UserScript==
// @name         [LSSTools] Verband Rechteverwalter
// @namespace    https://leitstellenspiel.de/
// @version      0.9.2
// @description  Zeigt die Rechte-Buttons direkt bei den Mitgliedern an (ohne "Rechte bearbeiten" klicken zu müssen)
// @author       NinoRossi
// @match        https://www.leitstellenspiel.de/verband/mitglieder*
// @match        https://www.leitstellenspiel.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("Rechteverwalter Script aktiv");
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
                rightsDiv.querySelectorAll("a.btn").forEach(origBtn => {
                    const text = origBtn.textContent.trim();
                    if (text && text !== "Schließen") {
                        if (buttonMapping[text]) {
                            origBtn.textContent = buttonMapping[text].text;
                            if (buttonMapping[text].class) {origBtn.className = `btn btn-xs ${buttonMapping[text].class}`;}
                        }
                        if (text === "Als Lehrgangsmeister setzen") {
                            origBtn.addEventListener("click", e => {
                                e.preventDefault();
                                fetch(`/verband/schooling/${userId}/1`, { method: "GET", credentials: "include" })
                                    .then(() => fetch(`/verband/discount/${userId}/10`, { method: "GET", credentials: "include" }))
                                    .then(() => location.reload())
                                    .catch(err => console.error(err));
                            });
                        }
                        if (text === "Als Lehrgangsmeister entfernen") {
                            origBtn.addEventListener("click", e => {
                                e.preventDefault();
                                fetch(`/verband/schooling/${userId}/0`, { method: "GET", credentials: "include" })
                                    .then(() => fetch(`/verband/discount/${userId}/0`, { method: "GET", credentials: "include" }))
                                    .then(() => location.reload())
                                    .catch(err => console.error(err));
                            });
                        }
                        wrapper.appendChild(origBtn);
                    }
                });
                const copyBtn = document.createElement("button");
                copyBtn.textContent = "UserID";
                copyBtn.className = "btn btn-xs btn-secondary btn-info";
                copyBtn.style.marginRight = "4px";
                copyBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(userId)
                        .then(() => console.log(`UserID ${userId} kopiert`))
                        .catch(err => console.error("Kopieren fehlgeschlagen:", err));
                });
                wrapper.appendChild(copyBtn);
                parentTd.appendChild(wrapper);
            }
        });
    }
    processButtons();
    const observer = new MutationObserver(() => processButtons());
    observer.observe(document.body, { childList: true, subtree: true });
})();
