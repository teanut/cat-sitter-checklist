// app.js
(() => {
  const todayKey = new Date().toDateString();
  const STORAGE_PREFIX = "catsit_final_v1";
  const STATE_KEY = `${STORAGE_PREFIX}:state:${todayKey}`;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function loadState() {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  function saveState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function updateProgress() {
    const boxes = $$("#checklist input[type='checkbox']");
    const total = boxes.length;
    const done = boxes.filter(b => b.checked).length;

    $("#totalLabel").textContent = total;
    $("#doneLabel").textContent = done;

    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    $("#bar").style.width = `${pct}%`;
  }

  function init() {
    const state = loadState();
    const boxes = $$("#checklist input[type='checkbox']");

    boxes.forEach(box => {
      const id = box.dataset.id;
      box.checked = !!state[id];

      box.addEventListener("change", () => {
        const scrollY = window.scrollY;

        state[id] = box.checked;
        saveState(state);
        updateProgress();

        window.scrollTo({ top: scrollY });
      });
    });

    $("#markAll").addEventListener("click", () => {
      const boxes = $$("#checklist input[type='checkbox']");
      const state = {};

      boxes.forEach(b => {
        b.checked = true;
        state[b.dataset.id] = true;
      });

      saveState(state);
      updateProgress();
    });

    $("#resetToday").addEventListener("click", () => {
      localStorage.removeItem(STATE_KEY);
      $$("#checklist input[type='checkbox']").forEach(b => (b.checked = false));
      updateProgress();
    });

    updateProgress();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
