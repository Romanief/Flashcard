let flashcards = [];
let currentCard = null;
let reviseMode = false;      
export let correctTotal = 0;
export let wrongTotal   = 0;

export function initFlashcards(loaded) {
  flashcards = loaded;
}

export function toggleReviseMode() {
  reviseMode = !reviseMode;
  return reviseMode;
}

export function isReviseMode() {
  return reviseMode;
}

export function addFlashcard(front, back) {
  const newCard = {
    id: Date.now(),
    front, back,
    correctStreak: 0,
    learned: false,
    wrongCount: 0
  };
  flashcards.push(newCard);
  return flashcards;
}

export function removeFlashcard(id) {
  flashcards = flashcards.filter(card => card.id !== id);
  return flashcards;
}

export function markCorrect() {
  if (!currentCard) return;
  currentCard.correctStreak++;
  if (currentCard.correctStreak >= 5) currentCard.learned = true;
  correctTotal++;
}

export function markWrong() {
  if (!currentCard) return;
  currentCard.correctStreak = 0;
  currentCard.wrongCount++;
  wrongTotal++;
}

/**
 * Purely returns the next flashcard based on reviseMode.
 * Returns null if none left.
 */
export function getNextCard() {
  const candidates = flashcards.filter(card =>
    reviseMode ? card.learned : !card.learned
  );
  if (candidates.length === 0) {
    return null;
  }
  candidates.sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0));
  const weighted = candidates.slice(0, Math.min(5, candidates.length));
  currentCard = weighted[Math.floor(Math.random() * weighted.length)];
  return currentCard;
}

export function getFlashcards() {
  return flashcards;
}