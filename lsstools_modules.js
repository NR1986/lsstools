// LSSTools Modules v1.0
(function() {
    'use strict';

    const CONFIG = {
        debug: true,
        version: 'v1.0',
        modules: {}
    };

    const log = (...args) => CONFIG.debug && console.log('[LSSTools]', ...args);

    /********** MODULE **********/
    // Mission Timer
    CONFIG.modules['Mission Timer'] = (container) => {
        const timerBox = document.createElement('div');
        timerBox.textContent = 'Mission Timer: 00:00';
        container.appendChild(timerBox);

        let seconds = 0;
        setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2,'0');
            const secs = String(seconds % 60).padStart(2,'0');
            timerBox.textContent = `Mission Timer: ${mins}:${secs}`;
        }, 1000);
    };

    // Aktuelle Einsätze
    CONFIG.modules['Aktuelle Einsätze'] = (container) => {
        const list = document.createElement('div');
        list.innerHTML = '<strong>Aktuelle Einsätze:</strong>';
        const missions = document.querySelectorAll('.mission'); // Beispiel: Einsätze
        if (missions.length === 0) {
            list.innerHTML += '<br>Keine Einsätze gefunden.';
        } else {
            const ul = document.createElement('ul');
            missions.forEach(m => {
                const li = document.createElement('li');
                li.textContent = m.textContent.trim();
                ul.appendChild(li);
            });
            list.appendChild(ul);
        }
        container.appendChild(list);
    };

    // Krankenhaus
    CONFIG.modules['Krankenhaus'] = (container) => {
        const box = document.createElement('div');
        box.innerHTML = '<strong>Krankenhaus-Status:</strong>';
        const patients = document.querySelectorAll('#hospital .patient'); 
        box.innerHTML += `<br>Patienten: ${patients.length}`;
        container.appendChild(box);
    };

    // Fahrzeuge
    CONFIG.modules['Fahrzeuge'] = (container) => {
        const box = document.createElement('div');
        box.innerHTML = '<strong>Fahrzeug-Status:</strong>';
        const vehicles = document.querySelectorAll('#vehicles .vehicle');
        box.innerHTML += `<br>Verfügbare Fahrzeuge: ${vehicles.length}`;
        container.appendChild(box);
    };

    /********** Lightbox **********/
    const showLSSToolsLightbox = () => {
        let overlay = document.getElementById('lsstools-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'lsstools-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = 10000;
            document.body.appendChild(overlay);

            overlay.addEventListener('click', () => {
                overlay.remove();
                const popup = document.getElementById('lsstools-popup');
                if (popup) popup.remove();
            });
        }

        let popup = document.getElementById('lsstools-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'lsstools-popup';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#ffffff';
            popup.style.color = '#000000';
            popup.style.border = '2px solid #007bff';
            popup.style.borderRadius = '6px';
            popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
            popup.style.padding = '10px';
            popup.style.width = '500px';
            popup.style.maxHeight = '80vh';
            popup.style.overflowY = 'auto';
            popup.style.zIndex = 10001;
            document.body.appendChild(popup);

            const header = document.createElement('div');
            header.textContent = 'LSSTools';
            header.style.fontWeight = 'bold';
            header.style.fontSize = '18px';
            header.style.marginBottom = '10px';
            popup.appendChild(header);

            const tabs = document.createElement('div');
            tabs.id = 'lsstools-tabs';
            tabs.style.display = 'flex';
            tabs.style.borderBottom = '1px solid #ccc';
            tabs.style.marginBottom = '10px';
            popup.appendChild(tabs);

            const content = document.createElement('div');
            content.id = 'lsstools-popup-content';
            popup.appendChild(content);

            const footer = document.createElement('div');
            footer.id = 'lsstools-footer';
            footer.style.marginTop = '10px';
            footer.style.fontSize = '12px';
            footer.style.color = '#666';
            footer.style.borderTop = '1px solid #ccc';
            footer.style.paddingTop = '5px';
            footer.innerHTML = `LSSTools ${CONFIG.version} &copy; 2025`;
            popup.appendChild(footer);

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Schließen';
            closeBtn.style.marginTop = '10px';
            closeBtn.style.padding = '5px 10px';
            closeBtn.style.backgroundColor = '#007bff';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '4px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.addEventListener('click', () => {
                overlay.remove();
                popup.remove();
            });
            popup.appendChild(closeBtn);
        }

        renderTabsAndContent();
    };

    /********** Tabs & Content **********/
    const renderTabsAndContent = () => {
        const tabsContainer = document.getElementById('lsstools-tabs');
        const contentContainer = document.getElementById('lsstools-popup-content');
        tabsContainer.innerHTML = '';
        contentContainer.innerHTML = '';

        const appstoreTab = document.createElement('div');
        appstoreTab.textContent = 'Appstore';
        appstoreTab.style.padding = '5px 10px';
        appstoreTab.style.cursor = 'pointer';
        appstoreTab.addEventListener('click', () => renderAppstore());
        tabsContainer.appendChild(appstoreTab);

        Object.keys(CONFIG.modules).forEach(modName => {
            if (GM_getValue(`module_${modName}`, true)) {
                const tab = document.createElement('div');
                tab.textContent = modName;
                tab.style.padding = '5px 10px';
                tab.style.cursor = 'pointer';
                tab.addEventListener('click', () => renderModule(modName));
                tabsContainer.appendChild(tab);
            }
        });

        renderAppstore();
    };

    const renderAppstore = () => {
        const content = document.getElementById('lsstools-popup-content');
        content.innerHTML = '<h4>Appstore</h4><p>Aktiviere oder deaktiviere Module:</p>';

        Object.keys(CONFIG.modules).forEach(modName => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '3px';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = GM_getValue(`module_${modName}`, true);
            checkbox.addEventListener('change', e => {
                GM_setValue(`module_${modName}`, e.target.checked);
                renderTabsAndContent();
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + modName));
            content.appendChild(label);
        });
    };

    const renderModule = (modName) => {
        const content = document.getElementById('lsstools-popup-content');
        content.innerHTML = `<h4>${modName}</h4>`;
        CONFIG.modules[modName](content);
    };

    /********** Link neben Täglicher Login **********/
    const addCustomPopupLink = () => {
        const observer = new MutationObserver((mutations, obs) => {
            const loginLi = document.getElementById('daily-bonus');
            if (loginLi && !document.getElementById('lsstools-custom-li')) {
                const customLi = document.createElement('li');
                customLi.id = 'lsstools-custom-li';
                customLi.style.display = 'inline-block';
                customLi.style.marginRight = '5px';

                const customA = document.createElement('a');
                customA.href = '#';
                customA.className = 'lsstools-link';
                customA.style.color = '#ffffff';
                customA.style.textDecoration = 'none';
                customA.innerHTML = `<span class="glyphicon glyphicon-wrench" style="margin-right:2px;"></span><span>LSSTools</span>`;
                customA.addEventListener('mouseenter', () => { customA.style.color = '#000000'; });
                customA.addEventListener('mouseleave', () => { customA.style.color = '#ffffff'; });
                customA.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    showLSSToolsLightbox();
                });

                customLi.appendChild(customA);
                loginLi.parentNode.insertBefore(customLi, loginLi);
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const main = () => {
        log('LSSTools Modules geladen!');
        addCustomPopupLink();
    };

    window.addEventListener('load', main);

})();
