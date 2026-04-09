// script.js - Enhanced Animations + EmailJS with Auto Reply

document.addEventListener('DOMContentLoaded', () => {

  // Initialize EmailJS - REPLACE THESE WITH YOUR REAL VALUES
  emailjs.init("1fKxCgjxGucQLCePE");   // ← Your EmailJS Public Key

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Section Reveal Animation
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => observer.observe(section));

  // 3D Phone Hover Effect
  const phone = document.querySelector('.phone-img');
  if (phone) {
    phone.addEventListener('mousemove', (e) => {
      const rect = phone.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      phone.style.transform = `rotateY(${x * 25}deg) rotateX(${-y * 25}deg) scale(1.07)`;
    });

    phone.addEventListener('mouseleave', () => {
      phone.style.transform = 'rotateY(12deg) rotateX(8deg) scale(1.06)';
    });
  }

  // Clan Form Submission with Email + Auto Reply
  const form = document.getElementById('clanForm');
  const submitBtn = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-3">⟳</span> 
        SENDING APPLICATION...
      `;
      submitBtn.disabled = true;

      // Collect form data
      const formData = {
        full_name: form.querySelector('[name="full_name"]').value,
        user_email: form.querySelector('[name="user_email"]').value,
        why_join: form.querySelector('[name="why_join"]').value,
        what_bring: form.querySelector('[name="what_bring"]').value,
        other_clan: form.querySelector('[name="other_clan"]').value,
        main_account: form.querySelector('[name="main_account"]:checked')?.value || 'Not specified',
        loyal: form.querySelector('[name="loyal"]:checked')?.value || 'Not specified',
        from_name: "MgaWalangBitaw Giveaway"
      };

      // 1. Send to YOU (Admin)
      emailjs.send("service_g5q4on8", "template_524awkf", formData)
        .then(() => {
          // 2. Send Auto Reply to the applicant
          emailjs.send("service_g5q4on8", "template_524awkf", {
            to_email: formData.user_email,
            to_name: formData.full_name
          });

          // Success Animation
          submitBtn.innerHTML = "✅ APPLICATION SENT SUCCESSFULLY!";
          submitBtn.classList.add('!bg-emerald-600');

          setTimeout(() => {
            alert(`Thank you, ${formData.full_name}!\n\nYour application has been received.\nA confirmation email has been sent to you.`);

            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('!bg-emerald-600');
            submitBtn.disabled = false;
          }, 2200);

        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          alert("Failed to send application. Please try again later.");
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    });
  }

});