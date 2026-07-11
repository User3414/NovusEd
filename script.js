document.addEventListener('DOMContentLoaded', () => {

  /* ---------- MOBILE NAV ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- SCROLL BUTTONS (Explore Courses / Learn More) ---------- */
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id], .contact-section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${currentId}`) {
        a.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- HEADER SHADOW / SHRINK ON SCROLL ---------- */
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- SCROLL REVEAL ANIMATIONS ---------- */
  const revealTargets = document.querySelectorAll(
    '.card, .feature, .gallery-text, .gallery-images img, .about h2, .about p, .contact-section'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- COURSE DETAIL MODAL ---------- */
  const courseModal = document.getElementById('course-modal');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPoints = document.getElementById('modal-points');
  const courseModalClose = document.getElementById('course-modal-close');
  const modalEnrolBtn = document.getElementById('modal-enrol-btn');

  let selectedCourseTag = 'Accredited';

  document.querySelectorAll('.view-course').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const { title, tag, desc, points } = link.dataset;

      modalTag.textContent = tag;
      modalTag.className = 'tag ' + (tag.toLowerCase().includes('non') ? 'non-accredited' : 'accredited');
      modalTitle.textContent = title;
      modalDesc.textContent = desc;

      modalPoints.innerHTML = '';
      points.split('|').forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        modalPoints.appendChild(li);
      });

      selectedCourseTag = tag;
      openModal(courseModal);
    });
  });

  modalEnrolBtn.addEventListener('click', () => {
    closeModal(courseModal);
    const enrolCourseSelect = document.getElementById('enrol-course');
    [...enrolCourseSelect.options].forEach(opt => {
      if (opt.value === selectedCourseTag) enrolCourseSelect.value = opt.value;
    });
    openModal(document.getElementById('enrol-modal'));
  });

  courseModalClose.addEventListener('click', () => closeModal(courseModal));

  /* ---------- ENROL MODAL ---------- */
  const enrolModal = document.getElementById('enrol-modal');
  const enrolModalClose = document.getElementById('enrol-modal-close');
  const enrolBtn = document.getElementById('enrol-btn');

  enrolBtn.addEventListener('click', () => openModal(enrolModal));
  enrolModalClose.addEventListener('click', () => closeModal(enrolModal));

  /* ---------- MODAL HELPERS ---------- */
  function openModal(modal) {
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    }
  });

  /* ---------- FORM VALIDATION HELPERS ---------- */
  function showError(inputId, message) {
    const errorSpan = document.querySelector(`.error-msg[data-for="${inputId}"]`);
    const input = document.getElementById(inputId);
    if (errorSpan) errorSpan.textContent = message;
    if (input) input.classList.toggle('invalid', !!message);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---------- CONTACT FORM ---------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    let valid = true;

    if (!name.value.trim()) {
      showError('contact-name', 'Please enter your name.');
      valid = false;
    } else {
      showError('contact-name', '');
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      showError('contact-email', 'Please enter a valid email address.');
      valid = false;
    } else {
      showError('contact-email', '');
    }

    if (!message.value.trim()) {
      showError('contact-message', 'Please enter a message.');
      valid = false;
    } else {
      showError('contact-message', '');
    }

    if (!valid) return;

    formSuccess.textContent = `Thanks, ${name.value.trim()}! Your message has been received — we'll be in touch soon.`;
    formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  });

  /* ---------- ENROL FORM ---------- */
  const enrolForm = document.getElementById('enrol-form');
  const enrolSuccess = document.getElementById('enrol-success');

  enrolForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('enrol-name');
    const email = document.getElementById('enrol-email');

    let valid = true;

    if (!name.value.trim()) {
      showError('enrol-name', 'Please enter your name.');
      valid = false;
    } else {
      showError('enrol-name', '');
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      showError('enrol-email', 'Please enter a valid email address.');
      valid = false;
    } else {
      showError('enrol-email', '');
    }

    if (!valid) return;

    enrolSuccess.textContent = `Thanks, ${name.value.trim()}! Your enrolment request has been submitted.`;
    enrolSuccess.classList.add('show');

    setTimeout(() => {
      closeModal(enrolModal);
      enrolForm.reset();
      enrolSuccess.classList.remove('show');
      enrolSuccess.textContent = '';
    }, 2200);
  });

});
