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
// To make this form actually deliver submissions to Google Sheets + email:
// 1. Create a Google Sheet with columns: Timestamp | Name | Phone | Email | Message
// 2. In the Sheet, go to Extensions > Apps Script and paste a doPost(e) function
//    that appends e.parameter values as a new row and sends yourself an email.
// 3. Deploy that script as a Web App (Execute as: Me, Access: Anyone).
// 4. Paste the deployment URL below as FORM_ENDPOINT.
// Since this is a static site (GitHub Pages / Vercel), Apps Script is the backend.

const FORM_ENDPOINT = ""; // <-- paste your Google Apps Script Web App URL here

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

  if (FORM_ENDPOINT) {
    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      contactForm.reset();
      modal.classList.add('open');
    } catch (err) {
      alert('Something went wrong sending your details. Please email me directly at nagaraja.g126@gmail.com.');
    }
  } else {
    // Fallback while FORM_ENDPOINT isn't configured yet: open a pre-filled email.
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const message = formData.get('message');
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`
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
