// ==UserScript==
// @name         [LSSTools] Verband Probezeit-Prüfung mit Freischalt-Button
// @namespace    https://www.leitstellenspiel.de/
// @version      0.5
// @description  Prüft automatisch die Probezeit eines Nutzers und zeigt einen Button an, um ihn manuell freizuschalten
// @author       Dein Name
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[LSS-Script] Lade Verbandsinformationen...');

    fetch('https://www.leitstellenspiel.de/api/allianceinfo')
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Abrufen der Verband-API');
            return response.json();
        })
        .then(data => {
            console.log('[LSS-Script] Verbandsdaten geladen:', data);

            const mitglieder = data.users;
            if (!mitglieder) {
                console.error('[LSS-Script] Mitgliederliste nicht gefunden. API-Antwort:', data);
                return;
            }

            const jetzt = new Date();
            let freischaltbar = 0;

            mitglieder.forEach(member => {
                const probezeitEnde = new Date(member.trial_end_at);
                if (!probezeitEnde) return;

                if (probezeitEnde <= jetzt) {
                    freischaltbar++;
                    console.log(`[LSS-Script] Probezeit vorbei für ${member.username} → Button wird angezeigt`);

                    const button = document.createElement('button');
                    button.textContent = `Freischalten: ${member.username}`;
                    button.style.margin = '5px';
                    button.style.padding = '5px 10px';
                    button.style.backgroundColor = '#4CAF50';
                    button.style.color = 'white';
                    button.style.border = 'none';
                    button.style.borderRadius = '4px';
                    button.style.cursor = 'pointer';

                    button.onclick = () => {
                        console.log(`[LSS-Script] Rechte für ${member.username} vergeben...`);
                        fetch(`/user/${member.id}/setRank`, {
                            method: 'POST',
                            body: JSON.stringify({ rank: 'Lehrgangsmeister' }),
                            headers: { 'Content-Type': 'application/json' }
                        })
                        .then(resp => {
                            if(resp.ok){
                                console.log(`[LSS-Script] ${member.username} erfolgreich freigeschaltet!`);
                                alert(`${member.username} wurde freigeschaltet.`);
                            } else {
                                console.error(`[LSS-Script] Fehler beim Freischalten von ${member.username}`);
                                alert(`Fehler beim Freischalten von ${member.username}`);
                            }
                        })
                        .catch(err => console.error(err));
                    };

                    document.body.appendChild(button);
                }
            });

            // Meldung nur einmal pro Tag anzeigen, wenn kein Mitglied freigeschaltet werden muss
            if (freischaltbar === 0) {
                const lastShown = localStorage.getItem('LSSNoTrialMessageDate');
                const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
                if (lastShown !== today) {
                    localStorage.setItem('LSSNoTrialMessageDate', today);
                    console.log('[LSS-Script] Kein Mitglied hat die Probezeit beendet. Zeige Meldung.');

                    const info = document.createElement('div');
                    info.textContent = '✅ Momentan gibt es keine Mitglieder, die die Probezeit beendet haben.';
                    info.style.position = 'fixed';
                    info.style.top = '10px';
                    info.style.left = '50%';
                    info.style.transform = 'translateX(-50%)';
                    info.style.padding = '15px 25px';
                    info.style.backgroundColor = '#e0f7fa';
                    info.style.color = '#00796b';
                    info.style.fontWeight = 'bold';
                    info.style.fontSize = '16px';
                    info.style.border = '2px solid #00796b';
                    info.style.borderRadius = '8px';
                    info.style.zIndex = 9999;
                    info.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    info.style.cursor = 'pointer';
                    document.body.appendChild(info);

                    info.addEventListener('click', () => {
                        info.remove();
                        console.log('[LSS-Script] Meldung wurde durch Klick entfernt.');
                    });

                    setTimeout(() => {
                        if (document.body.contains(info)) {
                            info.style.transition = 'opacity 0.5s';
                            info.style.opacity = '0';
                            setTimeout(() => info.remove(), 500);
                        }
                    }, 15000);
                } else {
                    console.log('[LSS-Script] Meldung bereits heute angezeigt, überspringe.');
                }
            }
        })
        .catch(err => console.error('[LSS-Script] Fehler:', err));

})();
