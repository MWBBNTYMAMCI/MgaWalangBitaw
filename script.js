// script.js - Fixed & Clean Version for MgaWalangBitaw

document.addEventListener('DOMContentLoaded', () => {

  // Initialize EmailJS
  emailjs.init("1fKxCgjxGucQLCePE");

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
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
        }, index * 100);
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

  // Form Submission
  const form = document.getElementById('clanForm');
  const submitBtn = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-3">⟳</span> 
        SENDING APPLICATION...
      `;
      submitBtn.disabled = true;

      const formData = {
        full_name: form.querySelector('[name="full_name"]').value || "No Name",
        user_email: form.querySelector('[name="user_email"]').value,
        why_join: form.querySelector('[name="why_join"]').value,
        what_bring: form.querySelector('[name="what_bring"]').value,
        other_clan: form.querySelector('[name="other_clan"]').value,
        main_account: form.querySelector('[name="main_account"]:checked')?.value || 'Not specified',
        loyal: form.querySelector('[name="loyal"]:checked')?.value || 'Not specified'
      };

      console.log("Form Data being sent:", formData); // For debugging

      // Send to YOU (Admin) - using your current template
      emailjs.send("service_g5q4on8", "template_524awkf", formData)
        .then((response) => {
          console.log("Email sent successfully!", response);
          
          submitBtn.innerHTML = "✅ APPLICATION SENT SUCCESSFULLY!";
          submitBtn.classList.add('!bg-emerald-600');

          setTimeout(() => {
            alert(`Thank you, ${formData.full_name}!\n\nYour application has been received.\nWe will review it soon.`);
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('!bg-emerald-600');
            submitBtn.disabled = false;
          }, 2000);
        })
        .catch((error) => {
          console.error("EmailJS Error Details:", error);
          alert("Failed to send application.\nPlease try again later.\n\nError: " + (error.text || error));
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    });
  }
});