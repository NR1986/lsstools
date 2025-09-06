// core.js
console.log("[MiniLSSM] gestartet", window.MiniLSSM_Info);

const state = {
    modules: {},
    store: {}, // hier könntest du z.B. Fahrzeuge oder Credits speichern
};

// Funktion um Module zu registrieren
function registerModule(name, loader) {
    state.modules[name] = { loader, active: false };
}

// Modul starten
async function startModule(name) {
    if (!state.modules[name]) return console.warn(`Modul ${name} nicht gefunden!`);
    const mod = await state.modules[name].loader();
    mod.init(state); // Modul bekommt Zugriff auf den State
    state.modules[name].active = true;
    console.log(`[MiniLSSM] Modul ${name} gestartet`);
}

// Beispiel-Modul registrieren
registerModule("helloWorld", async () => import("./modules/helloWorld.js"));

// Testweise sofort starten
startModule("helloWorld");
