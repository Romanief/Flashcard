export function loadFlashcards() {
  return JSON.parse(localStorage.getItem('flashcards')) || [];
}

export function saveFlashcards(flashcards) {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}