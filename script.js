/* =========================================================
   PORTFOLIO - HUỲNH HỮU BẰNG
   script.js - Xử lý tương tác của website
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* Đánh dấu trang có JS hoạt động:
     - CSS dùng .no-js / .js để quyết định có ẩn nội dung chờ animation hay không
     - Nếu JS không chạy được, nội dung vẫn hiển thị bình thường */
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

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

    // Đóng menu khi bấm phím Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Đóng menu khi bấm ra ngoài menu
    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("is-open") &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------
     2. NÚT ĐỔI CHẾ ĐỘ MÀU (SÁNG / TỐI)
        - Mặc định: nền trắng (chế độ sáng)
        - Bấm nút để chuyển chế độ, lựa chọn được lưu trong localStorage
  --------------------------------------------------------- */
  const themeToggle = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const setTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDark ? "#15171b" : "#fff8e7");
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (err) {
      /* localStorage không khả dụng thì bỏ qua */
    }
  };

  if (themeToggle) {
    // Đồng bộ trạng thái đã được áp dụng sớm ở <head> (tránh nhấp nháy)
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );

    themeToggle.addEventListener("click", () => {
      const next =
        document.documentElement.classList.contains("dark")
          ? "light"
          : "dark";
      setTheme(next);
    });
  }

  /* ---------------------------------------------------------
     3. CUỘN MƯỢT ĐẾN SECTION (bổ sung cho scroll-behavior CSS
        để đảm bảo hoạt động tốt trên mọi trình duyệt)
        - Áp dụng cho cả logo HHB để không hiện #trang-chu trên URL
  --------------------------------------------------------- */
  const scrollLinks = document.querySelectorAll(".nav-link, a.logo");

  scrollLinks.forEach((link) => {
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
     4. ANIMATION FADE-IN-UP KHI CUỘN TỚI (IntersectionObserver)
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
     4b. SCROLL-SPY: đổi trạng thái active của menu khi chuyển section
  --------------------------------------------------------- */
  const allSections = document.querySelectorAll("section[id]");

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
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
     5. NÚT QUAY LẠI ĐẦU TRANG
  --------------------------------------------------------- */
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     6. XỬ LÝ KHI CUỘN TRANG
        - Navbar: thêm bóng đổ khi cuộn (class is-scrolled)
        - Back-to-top: chỉ hiện sau khi cuộn > 400px
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  const handleScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("is-scrolled", y > 10);
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("is-visible", y > 400);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ---------------------------------------------------------
     7. FORM LIÊN HỆ - KIỂM TRA DỮ LIỆU & GỬI EMAIL THẬT
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

    const submitBtn = contactForm.querySelector('button[type="submit"]');

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

      const showStatus = (message, isError = false) => {
        formSuccess.textContent = message;
        formSuccess.classList.toggle("is-error", isError);
        formSuccess.classList.add("show");
      };

      const clearStatus = () => {
        formSuccess.classList.remove("show");
        formSuccess.textContent = "";
      };

      // Gửi tin nhắn thật qua FormSubmit (đổi endpoint nếu dùng dịch vụ khác)
      const FORM_ENDPOINT = "https://formsubmit.co/bangvn71@gmail.com";

      submitBtn.disabled = true;
      const originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = "Đang gửi...";

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Gửi thất bại");
          showStatus(
            "✅ Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ phản hồi sớm nhất có thể.",
          );
          contactForm.reset();
          setTimeout(clearStatus, 6000);
        })
        .catch(() => {
          showStatus(
            "❌ Không gửi được tin nhắn lúc này. Bạn vui lòng gửi email trực tiếp tới bangvn71@gmail.com nhé!",
            true,
          );
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
        });
    });
  }
});
