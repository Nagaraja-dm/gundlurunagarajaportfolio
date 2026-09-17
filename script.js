// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Contact form =====
// This form emails submissions straight to your inbox using FormSubmit
// (https://formsubmit.co) — a free service that needs no backend of your own.
//
// ONE-TIME SETUP: the very first time someone submits this form, FormSubmit
// sends a confirmation email to nagaraja.g126@gmail.com asking you to click
// "activate". Click that link once, and every submission after that arrives
// directly in your inbox automatically.
//
// If you'd rather log leads into a Google Sheet as well (same pattern you
// used for Cognitec), see README.md for the Google Apps Script version —
// you can swap it in later without changing the HTML.

const FORM_ENDPOINT = "https://formsubmit.co/ajax/nagaraja.g126@gmail.com";

const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('thankYouModal');
const closeModal = document.getElementById('closeModal');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const payload = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    message: formData.get('message'),
    _subject: `Portfolio contact from ${formData.get('name')}`
  };

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      contactForm.reset();
      modal.classList.add('open');
    } else {
      throw new Error('Form service returned an error');
    }
  } catch (err) {
    // Fallback if FormSubmit is unreachable: open a pre-filled email instead.
    const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
    const body = encodeURIComponent(
      `Name: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`
    );
    window.location.href = `mailto:nagaraja.g126@gmail.com?subject=${subject}&body=${body}`;
    contactForm.reset();
    modal.classList.add('open');
  }

  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('open');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});
