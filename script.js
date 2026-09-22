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
// Primary path: your own Google Apps Script — same pattern used for the
// Cognitec campaign. It logs every lead into a Google Sheet AND emails you
// instantly. See apps-script/Code.gs for the script and setup steps.
//
// SETUP: after deploying Code.gs as a Web App, paste the deployment URL
// below as GAS_ENDPOINT. Until you do that, the form automatically falls
// back to FormSubmit (email only, no Sheet log) so nothing is broken in
// the meantime — then to a pre-filled mailto as a last resort.

const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwVCUVpnuhmD_cYTQ4zNPcP1mni0PFiGCu1LkX7gOkRo1JpTIQfiEXBTwDh4boZX3D9/exec";
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
    message: formData.get('message')
  };

  try {
    if (GAS_ENDPOINT) {
      // Apps Script Web Apps don't return CORS headers, so the browser
      // blocks reading the response — but the request itself still goes
      // through and the script still runs (row appended, email sent).
      // mode: 'no-cors' avoids the browser throwing on that blocked read.
      await fetch(GAS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString()
      });
      contactForm.reset();
      modal.classList.add('open');
    } else {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ...payload, _subject: `Portfolio contact from ${payload.name}` })
      });

      if (res.ok) {
        contactForm.reset();
        modal.classList.add('open');
      } else {
        throw new Error('Form service returned an error');
      }
    }
  } catch (err) {
    // Last-resort fallback: open a pre-filled email instead.
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
