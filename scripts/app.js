import { loadFlashcards }      from './storage.js';
import { initFlashcards }      from './flashcards.js';
import { bindModalEvents }     from './modal.js';
import { bindAppEvents }       from './events.js';
import { renderFlashcardsList, updateScore, showCard } from './ui.js';

function init() {
  // 1. Load data
  const loaded = loadFlashcards();
  initFlashcards(loaded);

  // 2. Setup UI & events
  renderFlashcardsList();
  bindModalEvents();
  bindAppEvents();

  // 3. Show first card
  const first = showCard(getNextCard());
  updateScore();
}

init();