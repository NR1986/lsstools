// ==UserScript==
// @name         [LSSTools] Protokol UserID Kopierer
// @namespace    https://leitstellenspiel.de/
// @version      0.7.5
// @description  Fügt einen Button neben Usernamen ein, um die UserID in die Zwischenablage zu kopieren
// @author       NinoRossi
// @match        https://www.leitstellenspiel.de/*
// @match        https://www.leitstellenspiel.de/alliance_logfiles
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    const PROFILE_RE = /\/profile\/(\d+)/;
    function copyToClipboard(text, win) {
        try { if (typeof GM_setClipboard === 'function') GM_setClipboard(text); } catch {}
        try {
            if (win?.navigator?.clipboard) win.navigator.clipboard.writeText(text);
            else if (navigator.clipboard) navigator.clipboard.writeText(text);
        } catch {}
    }
    function insertButton(link, userId, doc, win) {
        if (link.dataset.useridButtonAdded) return;
        link.dataset.useridButtonAdded = 'true';
        const btn = (doc || document).createElement('button');
        btn.type = 'button';
        btn.title = 'UserID kopieren';
        btn.style.width = '20px';
        btn.style.height = '20px';
        btn.style.marginLeft = '5px';
        btn.style.padding = '0';
        btn.style.border = 'none';
        btn.style.borderRadius = '50%';
        btn.style.background = '#ccc';
        btn.style.cursor = 'pointer';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.verticalAlign = 'middle';
        btn.style.transition = 'background 0.2s';
        btn.onmouseover = () => btn.style.background = '#aaa';
        btn.onmouseout = () => btn.style.background = '#ccc';
        btn.innerHTML = `<svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" fill="black" width="12" height="12">
            <path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
        </svg>`;
        btn.addEventListener('click', e => {
            e.preventDefault();
            copyToClipboard(userId, win);
            btn.style.background = '#4caf50';
            setTimeout(() => btn.style.background = '#ccc', 900);
        });
        link.insertAdjacentElement('afterend', btn);
    }
    function scan(root, doc, win) {
        if (!root) return;
        root.querySelectorAll?.('a[href^="/profile/"]').forEach(link => {
            const m = (link.getAttribute('href') || link.href || '').match(PROFILE_RE);
            if (m) insertButton(link, m[1], doc, win);
        });
    }
    function observeElement(root, doc = document, win = window) {
        scan(root, doc, win);
        const obs = new MutationObserver(() => scan(root, doc, win));
        obs.observe(root, { childList: true, subtree: true });
    }
    function observeModal(modal) { if (modal) observeElement(modal); }
    function observeIframe(iframe) {
        if (!iframe.src.includes('/alliance_logfiles')) return;
        const setup = () => {
            const doc = iframe.contentDocument;
            const win = iframe.contentWindow;
            if (!doc) return;
            observeElement(doc.body || doc.documentElement, doc, win);
        };
        if (iframe.contentDocument?.readyState === 'complete') setup();
        else iframe.addEventListener('load', setup, { once: true });
    }
    const outerObs = new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            if (node.tagName === 'IFRAME' && node.src.includes('/alliance_logfiles')) observeIframe(node);
            if (node.classList?.contains('vm--modal')) observeModal(node);
            const nestedIframe = node.querySelector?.('iframe[src*="/alliance_logfiles"]'); if (nestedIframe) observeIframe(nestedIframe);
            const nestedModal = node.querySelector?.('.vm--modal'); if (nestedModal) observeModal(nestedModal);
        }));
    });
    outerObs.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('iframe[src*="/alliance_logfiles"]').forEach(observeIframe);
    document.querySelectorAll('.vm--modal').forEach(observeModal);
    if (window.location.pathname.includes('/alliance_logfiles')) {
        observeElement(document.body);
    }
})();
