const modal = document.getElementById('manage-modal');
const openBtn = document.getElementById('open-manage');
const closeBtn= document.getElementById('close-modal');

export function bindModalEvents() {
  openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  window.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}