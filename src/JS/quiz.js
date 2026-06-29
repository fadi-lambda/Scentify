// quiz.js — Fragrance Finder Quiz

document.addEventListener('DOMContentLoaded', () => {

  const TOTAL_STEPS = 5;
  let currentStep = 1;
  const answers = {};

  const progressFill  = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const backBtn       = document.getElementById('backBtn');
  const retakeBtn     = document.getElementById('retakeBtn');

  // Product recommendations keyed by budget then scent
  const recommendations = {
    'under1000': {
      default:  { name: 'White Oudh', desc: 'A classy, dense fragrance at an accessible price point.', price: 'Rs. 999', img: '../Images/White Oud.webp', link: '#' }
    },
    '1000-2000': {
      woody:    { name: 'Black & Silver Oud', desc: 'Bold woody-musky attar — long lasting and masculine.', price: 'Rs. 1,899', img: '../Images/Black & Silver Oud.webp', link: '#' },
      musky:    { name: 'Black & Silver Platinum', desc: 'Rich musky oriental — an upgrade for your collection.', price: 'Rs. 1,499', img: '../Images/Black & Silver Platinum.webp', link: '#' },
      default:  { name: 'Black & Silver Platinum', desc: 'A versatile concentrated attar for everyday luxury.', price: 'Rs. 1,499', img: '../Images/Black & Silver Platinum.webp', link: '#' }
    },
    '2000+': {
      default:  { name: 'Sultan E Ameer', desc: 'Floral-woody with musk and citrus — the signature of royalty.', price: 'Rs. 2,199', img: '../Images/Sultan A1.webp', link: 'Sultan_Ameer_Detail_Page.html' }
    }
  };

  function getRecommendation() {
    const budget = answers[5] || '1000-2000';
    const scent  = answers[2] || 'default';
    const group  = recommendations[budget] || recommendations['1000-2000'];
    return group[scent] || group['default'];
  }

  function updateProgress() {
    const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
    if (progressFill)  progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = `Question ${currentStep} of ${TOTAL_STEPS}`;
    if (backBtn) backBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  }

  function showStep(n) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(n <= TOTAL_STEPS ? `step${n}` : 'stepResult');
    if (target) target.classList.add('active');
    currentStep = n;
    updateProgress();
  }

  function showResult() {
    if (progressFill)  progressFill.style.width = '100%';
    if (progressLabel) progressLabel.textContent = 'Your result is ready!';
    if (backBtn) backBtn.style.display = 'none';

    const rec = getRecommendation();
    const img  = document.getElementById('resultImage');
    const name = document.getElementById('resultName');
    const desc = document.getElementById('resultDesc');
    const price= document.getElementById('resultPrice');
    const link = document.getElementById('resultLink');

    if (img)   { img.src = rec.img; img.alt = rec.name; }
    if (name)  name.textContent  = rec.name;
    if (desc)  desc.textContent  = rec.desc;
    if (price) price.textContent = rec.price;
    if (link)  link.href         = rec.link;

    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const resultEl = document.getElementById('stepResult');
    if (resultEl) resultEl.classList.add('active');
  }

  // Option click → record answer → auto-advance
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = parseInt(btn.dataset.q);
      const val = btn.dataset.value;

      // Mark selected
      document.querySelectorAll(`.quiz-option[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      answers[q] = val;

      // Auto advance after short delay
      setTimeout(() => {
        if (q < TOTAL_STEPS) {
          showStep(q + 1);
        } else {
          showResult();
        }
      }, 300);
    });
  });

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) showStep(currentStep - 1);
    });
  }

  // Retake
  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      Object.keys(answers).forEach(k => delete answers[k]);
      document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
      showStep(1);
    });
  }

  // Init
  showStep(1);
});