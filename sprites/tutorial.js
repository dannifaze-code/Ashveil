/* ═══════════════════════════════════════════
   Ashveil — Tutorial System
   Shows new-player onboarding with tutorial images
   ═══════════════════════════════════════════ */

const Tutorial = (function () {
  'use strict';

  const STEPS = [
    { key: 'movement',    title: 'Movement',    text: 'Use WASD or Arrow Keys to move your character through the world.' },
    { key: 'interaction', title: 'Interaction',  text: 'Press E near NPCs to interact, or F to gather resources.' },
    { key: 'fight',       title: 'Combat',       text: 'Press SPACE or Left-click to attack enemies. Use SHIFT to dash.' },
    { key: 'quests',      title: 'Quests',       text: 'Talk to NPCs to receive quests. Check your Journal (J) for progress.' }
  ];

  let currentStep = 0;
  let overlay = null;
  let onComplete = null;

  function build() {
    overlay = document.createElement('div');
    overlay.id = 'tutorialOverlay';
    overlay.innerHTML = `
      <div class="tut-box">
        <div class="tut-header">
          <span class="tut-step-label"></span>
          <button class="tut-skip">Skip Tutorial</button>
        </div>
        <div class="tut-img-wrap"><img class="tut-img" alt="Tutorial"></div>
        <h3 class="tut-title"></h3>
        <p class="tut-text"></p>
        <div class="tut-nav">
          <button class="tut-prev" disabled>← Previous</button>
          <button class="tut-next">Next →</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector('.tut-skip').onclick = close;
    overlay.querySelector('.tut-prev').onclick = () => go(currentStep - 1);
    overlay.querySelector('.tut-next').onclick = () => {
      if (currentStep >= STEPS.length - 1) close();
      else go(currentStep + 1);
    };
  }

  function go(idx) {
    currentStep = Math.max(0, Math.min(idx, STEPS.length - 1));
    const s = STEPS[currentStep];
    const img = GameAssets.get('tut.' + s.key);
    overlay.querySelector('.tut-step-label').textContent = `Step ${currentStep + 1} / ${STEPS.length}`;
    overlay.querySelector('.tut-title').textContent = s.title;
    overlay.querySelector('.tut-text').textContent = s.text;
    const imgEl = overlay.querySelector('.tut-img');
    if (img) imgEl.src = img.src;
    overlay.querySelector('.tut-prev').disabled = currentStep === 0;
    const nextBtn = overlay.querySelector('.tut-next');
    nextBtn.textContent = currentStep >= STEPS.length - 1 ? 'Finish ✓' : 'Next →';
  }

  function open(completeCb) {
    onComplete = completeCb || null;
    if (!overlay) build();
    overlay.style.display = 'flex';
    go(0);
  }

  function close() {
    if (overlay) overlay.style.display = 'none';
    if (onComplete) onComplete();
  }

  return { open, close, STEPS };
})();
