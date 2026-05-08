// =====================
// THEME TOGGLE
// =====================
const themeBtn = document.getElementById('theme-button');
 
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode')
        ? '☀️ Light Mode'
        : '🌙 Dark Mode';
});
 
// =====================
// REDUCE MOTION TOGGLE (stretch)
// =====================
const reduceBtn = document.getElementById('reduce-motion-button');
let reduceMotion = false;
 
reduceBtn.addEventListener('click', () => {
    reduceMotion = !reduceMotion;
    document.body.classList.toggle('reduce-motion', reduceMotion);
    reduceBtn.classList.toggle('active', reduceMotion);
    reduceBtn.textContent = reduceMotion ? '✅ Motion Off' : '⚡ Reduce Motion';
});
 
// =====================
// SCROLL REVEAL ANIMATION (extra)
// =====================
const revealEls = document.querySelectorAll('.scroll-reveal');
 
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (document.body.classList.contains('reduce-motion')) return;
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Remove visible so animation replays on scroll up
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.12 });
 
revealEls.forEach(el => observer.observe(el));
 
// =====================
// RSVP FORM + MODAL
// =====================
const form            = document.getElementById('rsvp-form');
const participantList = document.getElementById('participants');
const rsvpCount       = document.getElementById('rsvp-count');
const modal           = document.getElementById('rsvp-modal');
const modalMessage    = document.getElementById('modal-message');
const modalClose      = document.getElementById('modal-close');
const timerFill       = document.getElementById('modal-timer-fill');
 
let modalTimeout = null;
 
function updateCount() {
    const count = participantList.querySelectorAll('li').length;
    rsvpCount.textContent = `${count} attendee${count !== 1 ? 's' : ''} registered`;
}
 
function showModal(name, city) {
    // Set personalised message
    modalMessage.textContent =
        `Thanks, ${name}! You're officially on the list. We can't wait to welcome you from ${city} to the Community Tech & AI Summit. See you there! 🚀`;
 
    // Open modal
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
 
    // Restart timer bar
    timerFill.classList.remove('draining');
    // Force reflow so transition restarts
    void timerFill.offsetWidth;
    timerFill.classList.add('draining');
 
    // Auto-dismiss after 4 seconds (matching timer bar)
    clearTimeout(modalTimeout);
    modalTimeout = setTimeout(closeModal, 4000);
}
 
function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    clearTimeout(modalTimeout);
    timerFill.classList.remove('draining');
}
 
// Stretch: close button dismisses modal early
modalClose.addEventListener('click', closeModal);
 
// Close if user clicks the dark overlay outside the box
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
 
// ----------------------
// Form submission
// ----------------------
form.addEventListener('submit', (e) => {
    e.preventDefault();
 
    const inputs     = form.querySelectorAll('input');
    const nameInput  = inputs[0];
    const emailInput = inputs[1];
    const cityInput  = inputs[2];
 
    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const city  = cityInput.value.trim();
 
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
    let isValid = true;
 
    // Reset previous errors
    [nameInput, emailInput, cityInput].forEach(input => {
        input.classList.remove('input-error');
    });
 
    if (!name) {
        nameInput.classList.add('input-error');
        isValid = false;
    }
    if (!email || !emailValid) {
        emailInput.classList.add('input-error');
        isValid = false;
    }
    if (!city) {
        cityInput.classList.add('input-error');
        isValid = false;
    }
 
    // Invalid: do NOT show modal, do NOT add to list
    if (!isValid) return;
 
    // Valid: add to list, update count, show modal
    const li = document.createElement('li');
    li.textContent = `${name} from ${city}`;
    participantList.appendChild(li);
 
    updateCount();
    form.reset();
    showModal(name, city);
});
 
// Clear errors as user types
form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('input-error');
    });
});
 
// Set initial count
updateCount();
