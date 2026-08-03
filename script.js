/* =========================================================
   PORTFOLIO - HUỲNH HỮU BẰNG
   script.js - Xử lý tương tác của website
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------------------
     1. MENU HAMBURGER (MOBILE)
  --------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle("is-open");
    hamburger.classList.toggle("is-active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  };

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    hamburger.classList.remove("is-active");
    hamburger.setAttribute("aria-expanded", "false");
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", toggleMenu);

    // Tự động đóng menu sau khi chọn một mục điều hướng
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------------------------------------------------------
     2. CUỘN MƯỢT ĐẾN SECTION (bổ sung cho scroll-behavior CSS
        để đảm bảo hoạt động tốt trên mọi trình duyệt)
  --------------------------------------------------------- */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------------------------------------------------------
     3. ANIMATION FADE-IN-UP KHI CUỘN TỚI (IntersectionObserver)
  --------------------------------------------------------- */
  const fadeElements = document.querySelectorAll(".fade-up");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // chỉ chạy animation một lần
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    fadeElements.forEach((el) => observer.observe(el));
  } else {
    // Trình duyệt không hỗ trợ IntersectionObserver -> hiển thị luôn
    fadeElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------
     3b. SCROLL-SPY: đổi trạng thái active của menu khi chuyển section
  --------------------------------------------------------- */
  const allSections = document.querySelectorAll("section[id]");
  const navLinksById = {};

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      navLinksById[href.slice(1)] = link;
    }
  });

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    const activeLink = navLinksById[sectionId];
    if (activeLink) {
      activeLink.classList.add("is-active");
    }
  };

  if ("IntersectionObserver" in window && allSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Chọn section đang chiếm phần lớn khung nhìn nhất
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveLink(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: "-90px 0px -40% 0px", // trừ đi chiều cao navbar cố định
      },
    );

    allSections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------
     4. NÚT QUAY LẠI ĐẦU TRANG
  --------------------------------------------------------- */
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     5. FORM LIÊN HỆ - KIỂM TRA DỮ LIỆU & THÔNG BÁO GỬI THÀNH CÔNG
  --------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById("name"),
        error: document.getElementById("name-error"),
        validate: (value) => value.trim().length >= 2,
        message: "Vui lòng nhập họ và tên (ít nhất 2 ký tự).",
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: "Vui lòng nhập email hợp lệ.",
      },
      subject: {
        input: document.getElementById("subject"),
        error: document.getElementById("subject-error"),
        validate: (value) => value.trim().length >= 3,
        message: "Vui lòng nhập chủ đề (ít nhất 3 ký tự).",
      },
      message: {
        input: document.getElementById("message"),
        error: document.getElementById("message-error"),
        validate: (value) => value.trim().length >= 10,
        message: "Nội dung tin nhắn cần ít nhất 10 ký tự.",
      },
    };

    // Kiểm tra một field cụ thể
    const validateField = (field) => {
      const value = field.input.value;
      const isValid = field.validate(value);

      if (isValid) {
        field.input.classList.remove("input-error");
        field.error.textContent = "";
      } else {
        field.input.classList.add("input-error");
        field.error.textContent = field.message;
      }

      return isValid;
    };

    // Kiểm tra thời gian thực khi người dùng rời khỏi ô nhập
    Object.values(fields).forEach((field) => {
      field.input.addEventListener("blur", () => validateField(field));
      field.input.addEventListener("input", () => {
        if (field.input.classList.contains("input-error")) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Kiểm tra toàn bộ các field
      let isFormValid = true;
      Object.values(fields).forEach((field) => {
        const valid = validateField(field);
        if (!valid) isFormValid = false;
      });

      if (!isFormValid) {
        formSuccess.textContent = "";
        formSuccess.classList.remove("show");
        return;
      }

      /*
        ------------------------------------------------------
        TÍCH HỢP GỬI EMAIL THẬT (chọn 1 trong các cách sau):

        1) Formspree:
           - Đổi <form id="contact-form"> thành:
             action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
           - Xoá đoạn e.preventDefault() phía trên hoặc dùng fetch()
             để gửi bất đồng bộ rồi tự hiển thị thông báo.

        2) EmailJS:
           - Nhúng SDK EmailJS vào index.html.
           - Gọi: emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', contactForm)
             .then(() => { hiển thị thông báo thành công })
             .catch((err) => { xử lý lỗi });

        3) Backend riêng:
           - fetch('/api/contact', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
             })
             .then(res => res.json())
             .then(() => { hiển thị thông báo thành công });
        ------------------------------------------------------
      */

      // Vì đây là website tĩnh, ta chỉ mô phỏng gửi thành công:
      formSuccess.textContent =
        "✅ Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ phản hồi sớm nhất có thể.";
      formSuccess.classList.add("show");

      contactForm.reset();

      // Xoá thông báo sau vài giây (tuỳ chọn)
      setTimeout(() => {
        formSuccess.classList.remove("show");
        formSuccess.textContent = "";
      }, 6000);
    });
  }

  /* ---------------------------------------------------------
     6. NAVBAR: hiệu ứng nhỏ khi cuộn trang (tuỳ chọn, giữ đơn giản)
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 10) {
      navbar.style.boxShadow = "0 4px 0 #111111";
    } else {
      navbar.style.boxShadow = "none";
    }

    lastScrollY = currentScrollY;
  });
});
