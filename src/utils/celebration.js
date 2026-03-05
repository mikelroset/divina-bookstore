import confetti from "canvas-confetti";

const CELEBRATION_MESSAGES = [
  "Enhorabona! Has acabat el llibre.",
  "Brutal! Llibre completat.",
  "Objectiu aconseguit. Ben fet!",
];

function randomMessage() {
  return CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
}

/** Dispara confeti moderat (~3s), no bloqueja la UI */
export function triggerConfetti() {
  const count = 150;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  confetti({ ...defaults, particleCount: count, spread: 80 });
  confetti({ ...defaults, particleCount: count * 0.6, angle: 60, spread: 55 });
  confetti({ ...defaults, particleCount: count * 0.6, angle: 120, spread: 55 });
}

const TOAST_DURATION_MS = 4000;

/** Mostra celebració: confeti + toast que desapareix automàticament. No modal, no bloqueja. */
export function showCelebration() {
  triggerConfetti();

  const msg = randomMessage();
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.style.cssText = `
    position: fixed;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, rgb(34 197 94), rgb(22 163 74));
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: celebrationToastFadeIn 0.3s ease-out;
  `;

  toast.textContent = msg;
  document.body.appendChild(toast);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes celebrationToastFadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes celebrationToastFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const remove = () => {
    toast.style.animation = "celebrationToastFadeOut 0.3s ease-in forwards";
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 300);
  };

  setTimeout(remove, TOAST_DURATION_MS);
}

/**
 * Comprova si l'actualització de progrés correspon a una transició a "llibre acabat".
 * @param {number} prevCurrentPage - Valor anterior de currentPage
 * @param {number} newCurrentPage - Nou valor
 * @param {number} totalPages - Total de pàgines (ha de ser > 0)
 * @returns {boolean}
 */
export function isCompletionTransition(prevCurrentPage, newCurrentPage, totalPages) {
  if (totalPages == null || typeof totalPages !== "number" || Number.isNaN(totalPages) || totalPages <= 0) return false;
  const prev = prevCurrentPage ?? 0;
  const next = newCurrentPage ?? 0;
  return prev < totalPages && next === totalPages;
}
