// ==UserScript==
// @name         LSSTools Loader (jsDelivr)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Lädt lsstools_modules.js über jsDelivr
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const repoOwner = 'NR1986';
    const repoName = 'lsstools';
    const filePath = 'lsstools_modules.js';
    const branch = 'main';

    const scriptUrl = `https://cdn.jsdelivr.net/gh/${repoOwner}/${repoName}@${branch}/${filePath}`;
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
    console.log(`[LSSTools Loader] lsstools_modules.js geladen von branch: ${branch}`);
})();
