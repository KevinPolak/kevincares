// ─── LANGUAGE SYSTEM ───
function t(key) {
  const lang = window.currentLang || 'en';
  return (window.translations[lang] && window.translations[lang][key])
    || (window.translations['en'] && window.translations['en'][key])
    || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  // Update html lang attr
  document.documentElement.lang = window.currentLang;
}

function setLang(lang) {
  window.currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  applyTranslations();
  localStorage.setItem('kc-lang', lang);
}

// Attach language buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
});

// On load, detect saved or browser language
(function() {
  const saved = localStorage.getItem('kc-lang');
  const browser = (navigator.language || 'en').slice(0,2).toLowerCase();
  const supported = ['en','zh','nl','fr','es'];
  const initial = saved || (supported.includes(browser) ? browser : 'en');
  setLang(initial);
})();

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── CURRICULUM TABS ───
function showPart(index) {
  document.querySelectorAll('.part-content').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.part-tab').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

// ─── PAYMENT MODAL ───
const KEVIN_EMAIL = 'guanjeu@mail.com';
// Replace YOUR_PAYPAL_USERNAME below with your actual PayPal.me username
// e.g. if your PayPal email is k.polak@me.com, go to paypal.com/paypalme and create your link
const PAYPAL_LINK = 'https://www.paypal.me/Calines';

const prices = {
  part1: { cny: '¥616', usd: '$86' },
  full:  { cny: '¥1,848', usd: '$260' },
  intl:  { cny: '$260', usd: '$260' }
};

const paypalAmounts = {
  part1: '86',
  full:  '260',
  intl:  '260'
};

const courseNames = {
  part1: { en: 'Part I — Lessons 1–7', zh: '第一部分（第1-7课）', nl: 'Deel I — Lessen 1–7', fr: 'Partie I — Leçons 1–7', es: 'Parte I — Lecciones 1–7' },
  full:  { en: 'Full Course — 21 Lessons', zh: '完整课程（21课）', nl: 'Volledige Cursus — 21 lessen', fr: 'Cours Complet — 21 leçons', es: 'Curso Completo — 21 lecciones' },
  intl:  { en: 'International Full Course', zh: '国际学员完整课程', nl: 'Internationaal — Volledige Cursus', fr: 'International — Cours Complet', es: 'Internacional — Curso Completo' }
};

function scanLabel(lang) {
  return lang === 'zh' ? '扫描二维码支付' :
         lang === 'nl' ? 'Scan de QR-code om te betalen' :
         lang === 'fr' ? 'Scannez le code QR pour payer' :
         lang === 'es' ? 'Escanea el código QR para pagar' :
         'Scan the QR code to pay';
}

function confirmLabel(lang) {
  return lang === 'zh' ? '支付后，请将截图发至：' :
         lang === 'nl' ? 'Stuur na betaling een screenshot naar:' :
         lang === 'fr' ? 'Après paiement, envoyez une capture d\'écran à :' :
         lang === 'es' ? 'Tras el pago, envía una captura de pantalla a:' :
         'After paying, send a screenshot to:';
}

function openPayment(course, method) {
  const modal = document.getElementById('paymentModal');
  const content = document.getElementById('modalContent');
  const lang = window.currentLang || 'en';
  const price = prices[course];
  const courseName = courseNames[course][lang] || courseNames[course]['en'];

  let html = '';

  // ── WeChat Pay ──
  if (method === 'wechat') {
    html = `
      <h3>💚 ${lang === 'zh' ? '微信支付' : 'WeChat Pay'}</h3>
      <div class="modal-price">${price.cny}</div>
      <p style="font-size:14px; color:var(--gold); margin-bottom:20px;">${courseName}</p>
      <p style="font-size:14px; color:var(--muted); margin-bottom:16px;">${scanLabel(lang)}</p>
      <div style="background:#fff; padding:16px; display:flex; justify-content:center; margin-bottom:20px; border-radius:4px;">
        <img src="images/wechat-qr.jpg" alt="WeChat Pay QR Code — Kevin Polak"
          style="width:100%; max-width:260px; height:auto; display:block;">
      </div>
      <p style="font-size:13px; color:var(--muted); margin-bottom:6px;">${confirmLabel(lang)}</p>
      <a href="mailto:${KEVIN_EMAIL}?subject=${encodeURIComponent('WeChat Payment — ' + courseName)}&body=${encodeURIComponent('Hi Kevin,\n\nI have paid via WeChat Pay for: ' + courseName + '\n\nPlease find my payment screenshot attached.\n\nThank you!')}"
        class="contact-link" style="margin-top:12px;">
        ${lang === 'zh' ? '📧 发邮件给Kevin确认' :
          lang === 'nl' ? '📧 E-mail Kevin ter bevestiging' :
          lang === 'fr' ? '📧 E-mail Kevin pour confirmer' :
          lang === 'es' ? '📧 Email Kevin para confirmar' :
          '📧 Email Kevin to confirm'}
      </a>
      <p style="font-size:12px; color:var(--very-muted); text-align:center; margin-top:12px;">
        ${lang === 'zh' ? 'Kevin Polak 凯文·伯拉克 (***N)' : 'Kevin Polak 凯文·伯拉克 (***N)'}
      </p>
    `;
  }

  // ── Alipay ──
  if (method === 'alipay') {
    html = `
      <h3>🔵 ${lang === 'zh' ? '支付宝' : 'Alipay'}</h3>
      <div class="modal-price">${price.cny}</div>
      <p style="font-size:14px; color:var(--gold); margin-bottom:20px;">${courseName}</p>
      <p style="font-size:14px; color:var(--muted); margin-bottom:16px;">${scanLabel(lang)}</p>
      <div style="background:#fff; padding:16px; display:flex; justify-content:center; margin-bottom:20px; border-radius:4px;">
        <img src="images/alipay-qr.jpg" alt="Alipay QR Code — Kevin Polak"
          style="width:100%; max-width:260px; height:auto; display:block;">
      </div>
      <p style="font-size:13px; color:var(--muted); margin-bottom:6px;">${confirmLabel(lang)}</p>
      <a href="mailto:${KEVIN_EMAIL}?subject=${encodeURIComponent('Alipay Payment — ' + courseName)}&body=${encodeURIComponent('Hi Kevin,\n\nI have paid via Alipay for: ' + courseName + '\n\nPlease find my payment screenshot attached.\n\nThank you!')}"
        class="contact-link" style="margin-top:12px;">
        ${lang === 'zh' ? '📧 发邮件给Kevin确认' :
          lang === 'nl' ? '📧 E-mail Kevin ter bevestiging' :
          lang === 'fr' ? '📧 E-mail Kevin pour confirmer' :
          lang === 'es' ? '📧 Email Kevin para confirmar' :
          '📧 Email Kevin to confirm'}
      </a>
      <p style="font-size:12px; color:var(--very-muted); text-align:center; margin-top:12px;">
        kevin挖心人 (* KEVIN)
      </p>
    `;
  }

  // ── PayPal ──
  if (method === 'paypal') {
    const amount = paypalAmounts[course];
    const paypalUrl = `${PAYPAL_LINK}/${amount}USD`;
    html = `
      <h3>🌐 PayPal</h3>
      <div class="modal-price">${price.usd}</div>
      <p style="font-size:14px; color:var(--gold); margin-bottom:20px;">${courseName}</p>
      <p style="font-size:14px; color:var(--muted); margin-bottom:24px;">
        ${lang === 'zh' ? '点击下方按钮通过PayPal安全付款。付款后请发邮件确认。' :
          lang === 'nl' ? 'Klik hieronder om veilig via PayPal te betalen. Stuur daarna een e-mail ter bevestiging.' :
          lang === 'fr' ? 'Cliquez ci-dessous pour payer en toute sécurité via PayPal. Envoyez ensuite un e-mail de confirmation.' :
          lang === 'es' ? 'Haz clic abajo para pagar de forma segura con PayPal. Luego envía un email de confirmación.' :
          'Click below to pay securely via PayPal. Then send Kevin a confirmation email.'}
      </p>
      <a href="${paypalUrl}" target="_blank" rel="noopener" class="contact-link"
        style="background:#0070BA; display:block; text-align:center; padding:18px; color:white; text-decoration:none; font-weight:500; font-size:16px; letter-spacing:1px; margin-bottom:16px;">
        💳 ${lang === 'zh' ? '通过PayPal支付 ' + price.usd : 'Pay ' + price.usd + ' via PayPal'}
      </a>
      <p style="font-size:13px; color:var(--muted); margin-bottom:8px; text-align:center;">
        ${lang === 'zh' ? '付款后请发邮件至：' :
          lang === 'nl' ? 'Na betaling, e-mail naar:' :
          lang === 'fr' ? 'Après paiement, envoyez un e-mail à :' :
          lang === 'es' ? 'Tras el pago, escribe a:' :
          'After paying, email:'}
      </p>
      <a href="mailto:${KEVIN_EMAIL}?subject=${encodeURIComponent('PayPal Payment — ' + courseName)}&body=${encodeURIComponent('Hi Kevin,\n\nI have paid via PayPal for: ' + courseName + '\n\nAmount: $' + amount + ' USD\n\nPlease confirm receipt and send my first lesson.\n\nThank you!')}"
        style="display:block; text-align:center; font-size:15px; color:var(--gold); padding:10px; text-decoration:none; border:1px solid rgba(201,168,76,0.3);">
        ${KEVIN_EMAIL}
      </a>
      <p style="font-size:11px; color:var(--very-muted); text-align:center; margin-top:16px;">
        ${lang === 'zh' ? 'Kevin在收到确认邮件后24小时内发送第一课' :
          lang === 'nl' ? 'Kevin stuurt je eerste les binnen 24 uur na ontvangst van je e-mail' :
          lang === 'fr' ? 'Kevin vous envoie votre première leçon dans les 24h après réception de votre e-mail' :
          lang === 'es' ? 'Kevin te envía tu primera lección en 24 horas tras recibir tu email' :
          'Kevin sends your first lesson within 24 hours of receiving your email'}
      </p>
    `;
  }

  content.innerHTML = html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.getElementById('paymentModal').addEventListener('click', function(e) {
  if (e.target === this) closePayment();
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePayment();
});

// ─── SMOOTH SCROLL for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── SCROLL REVEAL (simple, no library) ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pillar, .lesson-card, .pricing-card, .faq-item, .audience-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
