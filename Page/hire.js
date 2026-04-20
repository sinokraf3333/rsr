/* ===== CURSOR ===== */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, label, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ===== STEP LOGIC ===== */
let currentStep = 1;
const totalSteps = 3;

function goStep(n) {
  // Validate before proceeding forward
  if (n > currentStep && !validateStep(currentStep)) return;

  // Hide current
  document.getElementById(`step${currentStep}`).classList.remove('active');
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('done');

  // Show new
  currentStep = n;
  const stepEl = document.getElementById(`step${currentStep}`);
  stepEl.classList.add('active');

  // Reset animation
  stepEl.style.animation = 'none';
  stepEl.offsetHeight; // reflow
  stepEl.style.animation = '';

  // Update step indicators
  document.querySelectorAll('.step').forEach(s => {
    const sn = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (sn === currentStep) s.classList.add('active');
    else if (sn < currentStep) s.classList.add('done');
  });

  // Progress bar
  const pct = (currentStep / totalSteps) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `Langkah ${currentStep} dari ${totalSteps}`;

  // Scroll to top of form
  document.querySelector('.form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== VALIDATION ===== */
function validateStep(step) {
  if (step === 1) {
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!name) { shake('name'); showError('name', 'Nama wajib diisi'); return false; }
    if (!email || !email.includes('@')) { shake('email'); showError('email', 'Email tidak valid'); return false; }
    return true;
  }
  if (step === 2) {
    const service = document.querySelector('input[name="service"]:checked');
    const budget  = document.querySelector('input[name="budget"]:checked');
    if (!service) { showToast('Pilih jenis layanan terlebih dahulu'); return false; }
    if (!budget)  { showToast('Pilih estimasi budget'); return false; }
    return true;
  }
  if (step === 3) {
    const desc = document.getElementById('desc').value.trim();
    if (!desc) { shake('desc'); showError('desc', 'Deskripsi proyek wajib diisi'); return false; }
    return true;
  }
  return true;
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(shakeStyle);

function showError(id, msg) {
  const el = document.getElementById(id);
  clearError(id);
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = msg;
  err.style.cssText = 'display:block;font-size:.68rem;color:#c0392b;margin-top:.3rem;letter-spacing:.04em;';
  el.parentElement.appendChild(err);
  el.addEventListener('input', () => clearError(id), { once: true });
}

function clearError(id) {
  const el = document.getElementById(id);
  const existing = el.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
}

/* ===== TOAST ===== */
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    background:var(--ink); color:#f5f1eb;
    padding:.7rem 1.4rem; font-size:.78rem; letter-spacing:.06em;
    z-index:9999; animation:toastIn .3s ease;
    font-family:var(--font-sans); white-space:nowrap;
  `;
  const toastAnim = document.createElement('style');
  toastAnim.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
  document.head.appendChild(toastAnim);
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ===== SUBMIT ===== */
function submitForm() {
  if (!validateStep(3)) return;

  const btn = document.getElementById('submitBtn');
  const txt = document.getElementById('submitText');
  btn.classList.add('loading');
  txt.textContent = 'Mengirim...';

  // Simulate sending
  setTimeout(() => {
    document.getElementById('step3').classList.remove('active');
    document.querySelector('.progress-bar').style.display = 'none';
    document.querySelector('.steps').style.display = 'none';
    const success = document.getElementById('successState');
    success.classList.add('show');

    // Confetti-like dots
    spawnConfetti();
  }, 1800);
}

/* ===== CONFETTI ===== */
function spawnConfetti() {
  const colors = ['#2d5a3d', '#c4a882', '#4a8a60', '#1a1814', '#e8ddd0'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const dot = document.createElement('div');
      const size = Math.random() * 8 + 4;
      dot.style.cssText = `
        position:fixed; z-index:9998; pointer-events:none;
        width:${size}px; height:${size}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}vw; top:-10px;
        opacity:${Math.random() * 0.8 + 0.2};
        animation: confettiFall ${Math.random() * 2 + 1.5}s ease-in forwards;
      `;
      document.body.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    }, i * 60);
  }
}
const confStyle = document.createElement('style');
confStyle.textContent = `@keyframes confettiFall{to{transform:translateY(110vh) rotate(${Math.random()*360}deg);opacity:0}}`;
document.head.appendChild(confStyle);

/* ===== CHAR COUNTER ===== */
const desc = document.getElementById('desc');
const counter = document.getElementById('charCount');
if (desc && counter) {
  desc.addEventListener('input', () => {
    const len = desc.value.length;
    counter.textContent = len;
    if (len > 900) counter.style.color = '#c0392b';
    else counter.style.color = '';
    if (desc.value.length > 1000) desc.value = desc.value.slice(0, 1000);
  });
}

/* ===== DONE STEP FIX: step dot checkmark ===== */
const doneStyle = document.createElement('style');
doneStyle.textContent = `.step.done .step-dot::after{content:'✓';font-size:11px;}`;
document.head.appendChild(doneStyle);
