// ==UserScript==
// @name         [LSSTools] Verband Rechteverwalter
// @namespace    https://leitstellenspiel.de/
// @version      0.6
// @description  Zeigt die Rechte-Buttons direkt bei den Mitgliedern an (ohne "Rechte bearbeiten" klicken zu müssen)
// @author       NinoRossi
// @match        https://www.leitstellenspiel.de/verband/mitglieder/*
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
        "Als Eventmanager entfernen": { text: "EvM", class: "btn-danger" }
    };
    document.querySelectorAll("a.btn_edit_rights").forEach(editBtn => {
        const userId = editBtn.getAttribute("user_id");
        const rightsDiv = document.querySelector(`#rights_${userId}`);
        if (!rightsDiv) return;
        editBtn.style.display = "none";
        const newDiv = document.createElement("div");
        newDiv.style.marginTop = "5px";
        rightsDiv.querySelectorAll("a.btn").forEach(btn => {
            const originalText = btn.textContent.trim();
            if (originalText === "Schließen") return;
            const clone = btn.cloneNode(true);
            clone.style.marginRight = "4px";
            if (buttonMapping[originalText]) {
                clone.textContent = buttonMapping[originalText].text;
                if (buttonMapping[originalText].class) {clone.className = "btn btn-xs " + buttonMapping[originalText].class;}
            }
            newDiv.appendChild(clone);
        });
        editBtn.parentNode.appendChild(newDiv);
    });
})();
