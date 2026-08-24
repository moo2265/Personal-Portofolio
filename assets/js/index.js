(function () {
  "use strict";

  const STORAGE_KEYS = {
    theme: "theme",
    font: "selectedFont",
    colors: "selectedTheme",
  };

  const DEFAULT_THEME = {
    name: "Purple Blue",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#a855f7",
  };

  const THEME_PRESETS = [
    DEFAULT_THEME,
    {
      name: "Pink Orange",
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#fb923c",
    },
    {
      name: "Green Emerald",
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
    },
    {
      name: "Blue Cyan",
      primary: "#3b82f6",
      secondary: "#06b6d4",
      accent: "#22d3ee",
    },
    {
      name: "Red Rose",
      primary: "#ef4444",
      secondary: "#f43f5e",
      accent: "#fb7185",
    },
    {
      name: "Amber Orange",
      primary: "#f59e0b",
      secondary: "#ea580c",
      accent: "#fbbf24",
    },
  ];

  const FONT_CLASSES = ["font-alexandria", "font-tajawal", "font-cairo"];
  const DEFAULT_FONT = "tajawal";

  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function applySavedThemeEarly() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
    document.documentElement.classList.toggle("dark", saved === "dark");
  }

  applySavedThemeEarly();

  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initThemeToggle();
    initActiveNav();
    initPortfolioFilter();
    initTestimonialsCarousel();
    initScrollToTop();
    initCustomSelects();
    initContactForm();
    initSettingsPanel();
  });

  function initMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    const headerInner = document.querySelector("#header .container");
    if (!navLinks || !headerInner) return;

    const button = document.createElement("button");
    button.className =
      "mobile-menu-btn lg:hidden text-slate-900 dark:text-white text-2xl focus:outline-none";
    button.setAttribute("aria-label", "فتح القائمة");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<i class="fa-solid fa-bars"></i>';
    headerInner.appendChild(button);

    const closeMenu = () => {
      navLinks.classList.remove("active");
      const icon = button.querySelector("i");
      if (icon) icon.className = "fa-solid fa-bars";
      button.setAttribute("aria-label", "فتح القائمة");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const isOpen = navLinks.classList.contains("active");
      const icon = button.querySelector("i");
      if (icon) icon.className = isOpen ? "fa-solid fa-times" : "fa-solid fa-bars";
      button.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  function initThemeToggle() {
    const button = document.getElementById("theme-toggle-button");
    const root = document.documentElement;
    if (!button) return;

    const isDark = root.classList.contains("dark");
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
    );

    button.addEventListener("click", () => {
      const dark = root.classList.toggle("dark");
      localStorage.setItem(STORAGE_KEYS.theme, dark ? "dark" : "light");
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute(
        "aria-label",
        dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
      );
    });
  }

  function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !links.length) return;

    const update = () => {
      let current = "";
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) {
          current = section.getAttribute("id");
        }
      });

      links.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${current}`);
      });
    };

    window.addEventListener("scroll", debounce(update, 50));
    update();
  }

  function initPortfolioFilter() {
    const filters = document.querySelectorAll(".portfolio-filter");
    const items = document.querySelectorAll(".portfolio-item");
    if (!filters.length || !items.length) return;

    const activeClasses = [
      "active",
      "bg-linear-to-r",
      "from-primary",
      "to-secondary",
      "text-white",
    ];
    const inactiveClasses = [
      "bg-white",
      "dark:bg-slate-800",
      "text-slate-600",
      "dark:text-slate-300",
      "border",
      "border-slate-300",
      "dark:border-slate-700",
    ];

    items.forEach((item) => {
      item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    });

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filters.forEach((other) => {
          other.classList.remove(...activeClasses);
          other.classList.add(...inactiveClasses);
          other.setAttribute("aria-pressed", "false");
        });

        button.classList.remove(...inactiveClasses);
        button.classList.add(...activeClasses);
        button.setAttribute("aria-pressed", "true");

        items.forEach((item) => {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
        });

        setTimeout(() => {
          items.forEach((item) => {
            const category = item.getAttribute("data-category");
            const show = filter === "all" || category === filter;
            item.style.display = show ? "" : "none";
          });

          setTimeout(() => {
            items.forEach((item) => {
              const category = item.getAttribute("data-category");
              if (filter === "all" || category === filter) {
                item.style.opacity = "1";
                item.style.transform = "scale(1)";
              }
            });
          }, 50);
        }, 250);
      });
    });
  }

  function initTestimonialsCarousel() {
    const track = document.getElementById("testimonials-carousel");
    const prevBtn = document.getElementById("prev-testimonial");
    const nextBtn = document.getElementById("next-testimonial");
    const indicators = document.querySelectorAll(".carousel-indicator");
    const cards = document.querySelectorAll(".testimonial-card");
    if (!track || !cards.length) return;

    let index = 0;

    const visibleCount = () => {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    };

    const maxIndex = () => Math.max(0, cards.length - visibleCount());

    const render = () => {
      const visible = visibleCount();
      const max = maxIndex();
      if (index > max) index = max;
      if (index < 0) index = 0;
      const offset = index * (100 / visible);
      track.style.transform = `translateX(${offset}%)`;

      indicators.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("active", active);
        dot.classList.toggle("bg-accent", active);
        dot.classList.toggle("scale-125", active);
        dot.classList.toggle("bg-slate-400", !active);
        dot.classList.toggle("dark:bg-slate-600", !active);
        dot.setAttribute("aria-selected", String(active));
      });
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        index = index < maxIndex() ? index + 1 : 0;
        render();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        index = index > 0 ? index - 1 : maxIndex();
        render();
      });
    }

    indicators.forEach((dot) => {
      dot.addEventListener("click", () => {
        const target = Number(dot.getAttribute("data-index"));
        if (!Number.isNaN(target)) {
          index = Math.min(target, maxIndex());
          render();
        }
      });
    });

    window.addEventListener("resize", debounce(render, 150));
    render();
  }

  function initScrollToTop() {
    const button = document.getElementById("scroll-to-top");
    if (!button) return;

    const toggle = () => {
      const show = window.scrollY > 300;
      button.classList.toggle("opacity-0", !show);
      button.classList.toggle("invisible", !show);
      button.classList.toggle("opacity-100", show);
      button.classList.toggle("visible", show);
    };

    window.addEventListener("scroll", debounce(toggle, 100));
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    toggle();
  }

  function initCustomSelects() {
    const selects = document.querySelectorAll(".custom-select");

    const closeAll = (exceptOptions) => {
      document.querySelectorAll(".custom-options").forEach((options) => {
        if (options === exceptOptions) return;
        options.classList.add("hidden");
        const select = options.previousElementSibling;
        const chevron = select && select.querySelector(".fa-chevron-down");
        if (chevron) chevron.style.transform = "rotate(0deg)";
        if (select) select.setAttribute("aria-expanded", "false");
      });
    };

    selects.forEach((select) => {
      const label = select.querySelector(".selected-text");
      const chevron = select.querySelector(".fa-chevron-down");
      const options = select.nextElementSibling;
      if (!options) return;

      const toggle = () => {
        const willOpen = options.classList.contains("hidden");
        closeAll(options);
        options.classList.toggle("hidden");
        if (chevron) {
          chevron.style.transform = willOpen ? "rotate(180deg)" : "rotate(0deg)";
        }
        select.setAttribute("aria-expanded", String(willOpen));
      };

      select.addEventListener("click", (event) => {
        event.stopPropagation();
        toggle();
      });

      select.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });

      options.querySelectorAll(".custom-option").forEach((option) => {
        option.addEventListener("click", (event) => {
          event.stopPropagation();
          const value = option.getAttribute("data-value");
          label.textContent = value;
          label.classList.remove("text-slate-500", "dark:text-slate-400");
          label.classList.add("text-slate-800", "dark:text-white");
          select.dataset.value = value;
          options.querySelectorAll(".custom-option").forEach((item) => {
            item.classList.remove("bg-primary/10");
            item.setAttribute("aria-selected", "false");
          });
          option.classList.add("bg-primary/10");
          option.setAttribute("aria-selected", "true");
          options.classList.add("hidden");
          if (chevron) chevron.style.transform = "rotate(0deg)";
          select.setAttribute("aria-expanded", "false");
          select.classList.remove("border-red-500");
          const error = select.parentElement.querySelector(".error-message");
          if (error) error.remove();
        });
      });
    });

    document.addEventListener("click", () => closeAll());
  }

  function initContactForm() {
    const form = document.querySelector("#contact form");
    if (!form) return;

    const nameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const detailsInput = document.getElementById("project-details");
    const projectSelect = form.querySelector(
      '.custom-select[data-name="project-type"]'
    );
    const budgetSelect = form.querySelector('.custom-select[data-name="budget"]');

    const clearErrors = () => {
      form.querySelectorAll(".error-message").forEach((el) => el.remove());
      form.querySelectorAll(".border-red-500").forEach((el) => {
        el.classList.remove("border-red-500");
      });
    };

    const showError = (element, message) => {
      const target = element.closest(".custom-select-wrapper") || element;
      const field = element.closest(".custom-select") || element;
      field.classList.add("border-red-500");
      const error = document.createElement("p");
      error.className = "error-message text-red-500 text-sm mt-2";
      error.textContent = message;
      target.parentElement.appendChild(error);
    };

    const isPlaceholder = (select) => {
      const text = select.querySelector(".selected-text");
      return (
        text &&
        (text.classList.contains("text-slate-500") ||
          text.classList.contains("text-slate-400"))
      );
    };

    const showSuccess = () => {
      const overlay = document.createElement("div");
      overlay.className =
        "fixed inset-0 flex items-center justify-center z-[80] bg-slate-950/80 backdrop-blur-sm";
      overlay.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fa-solid fa-check text-4xl text-white"></i>
          </div>
          <h3 class="text-2xl font-bold mb-3">تم إرسال رسالتك بنجاح!</h3>
          <p class="text-slate-500 dark:text-slate-400 mb-6">شكراً لتواصلك. سأرد عليك في أقرب وقت ممكن.</p>
          <button type="button" class="success-popup-close bg-linear-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300">
            حسناً
          </button>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.querySelector(".success-popup-close").addEventListener("click", () => {
        overlay.remove();
      });
      setTimeout(() => overlay.remove(), 5000);
    };

    const resetSelect = (select, placeholder) => {
      if (!select) return;
      const label = select.querySelector(".selected-text");
      label.textContent = placeholder;
      label.classList.add("text-slate-500", "dark:text-slate-400");
      label.classList.remove("text-slate-800", "dark:text-white");
      delete select.dataset.value;
      select.parentElement
        .querySelectorAll(".custom-option")
        .forEach((option) => option.classList.remove("bg-primary/10"));
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors();
      let valid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, "يرجى إدخال الاسم الكامل");
        valid = false;
      }

      const emailValue = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValue) {
        showError(emailInput, "يرجى إدخال البريد الإلكتروني");
        valid = false;
      } else if (!emailPattern.test(emailValue)) {
        showError(emailInput, "يرجى إدخال بريد إلكتروني صحيح");
        valid = false;
      }

      const phoneValue = phoneInput.value.trim();
      if (
        phoneValue &&
        !/^[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
          phoneValue.replace(/\s/g, "")
        )
      ) {
        showError(phoneInput, "يرجى إدخال رقم هاتف صحيح");
        valid = false;
      }

      if (isPlaceholder(projectSelect)) {
        showError(projectSelect, "يرجى اختيار نوع المشروع");
        valid = false;
      }

      if (isPlaceholder(budgetSelect)) {
        showError(budgetSelect, "يرجى اختيار الميزانية المتوقعة");
        valid = false;
      }

      const details = detailsInput.value.trim();
      if (!details) {
        showError(detailsInput, "يرجى إدخال تفاصيل المشروع");
        valid = false;
      } else if (details.length < 10) {
        showError(detailsInput, "يرجى إدخال المزيد من التفاصيل");
        valid = false;
      }

      if (!valid) return;

      showSuccess();
      form.reset();
      resetSelect(projectSelect, "اختر نوع المشروع");
      resetSelect(budgetSelect, "اختر الميزانية");
    });

    [nameInput, emailInput, phoneInput, detailsInput].forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("border-red-500");
        const error = input.parentElement.querySelector(".error-message");
        if (error) error.remove();
      });
    });
  }

  function applyColors(primary, secondary, accent) {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", primary);
    root.style.setProperty("--color-secondary", secondary);
    root.style.setProperty("--color-accent", accent);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", primary);
  }

  function applyFont(fontName) {
    const body = document.body;
    body.classList.remove(...FONT_CLASSES);
    body.classList.add(`font-${fontName}`);

    document.querySelectorAll(".font-option").forEach((option) => {
      const selected = option.getAttribute("data-font") === fontName;
      option.classList.toggle("active", selected);
      option.classList.toggle("border-primary", selected);
      option.setAttribute("aria-checked", String(selected));
    });

    localStorage.setItem(STORAGE_KEYS.font, fontName);
  }

  function initSettingsPanel() {
    const sidebar = document.getElementById("settings-sidebar");
    const toggle = document.getElementById("settings-toggle");
    const closeBtn = document.getElementById("close-settings");
    const resetBtn = document.getElementById("reset-settings");
    const colorsGrid = document.getElementById("theme-colors-grid");
    if (!sidebar || !toggle) return;

    const open = () => {
      sidebar.classList.remove("translate-x-full");
      sidebar.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.style.right = "20rem";
    };

    const close = () => {
      sidebar.classList.add("translate-x-full");
      sidebar.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.style.right = "0";
    };

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      if (sidebar.classList.contains("translate-x-full")) open();
      else close();
    });

    if (closeBtn) closeBtn.addEventListener("click", close);

    document.addEventListener("click", (event) => {
      if (
        !sidebar.classList.contains("translate-x-full") &&
        !sidebar.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    document.querySelectorAll(".font-option").forEach((option) => {
      option.addEventListener("click", () => {
        applyFont(option.getAttribute("data-font"));
      });
    });

    if (colorsGrid) {
      colorsGrid.innerHTML = "";
      THEME_PRESETS.forEach((preset) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className =
          "w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 shadow-sm";
        swatch.style.background = `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`;
        swatch.title = preset.name;
        swatch.setAttribute("aria-label", preset.name);
        swatch.dataset.primary = preset.primary;
        swatch.dataset.secondary = preset.secondary;

        swatch.addEventListener("click", () => {
          applyColors(preset.primary, preset.secondary, preset.accent);
          colorsGrid.querySelectorAll("button").forEach((btn) => {
            btn.classList.remove(
              "ring-2",
              "ring-offset-2",
              "ring-primary",
              "scale-110"
            );
          });
          swatch.classList.add(
            "ring-2",
            "ring-offset-2",
            "ring-primary",
            "scale-110"
          );
          localStorage.setItem(STORAGE_KEYS.colors, JSON.stringify(preset));
        });

        colorsGrid.appendChild(swatch);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEYS.colors);
        localStorage.removeItem(STORAGE_KEYS.font);
        applyFont(DEFAULT_FONT);
        applyColors(
          DEFAULT_THEME.primary,
          DEFAULT_THEME.secondary,
          DEFAULT_THEME.accent
        );
        const first = colorsGrid && colorsGrid.querySelector("button");
        if (first) first.click();
        close();
      });
    }

    const savedFont = localStorage.getItem(STORAGE_KEYS.font) || DEFAULT_FONT;
    applyFont(savedFont);

    const savedColors = localStorage.getItem(STORAGE_KEYS.colors);
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        applyColors(parsed.primary, parsed.secondary, parsed.accent);
        if (colorsGrid) {
          colorsGrid.querySelectorAll("button").forEach((btn) => {
            if (
              btn.dataset.primary === parsed.primary &&
              btn.dataset.secondary === parsed.secondary
            ) {
              btn.classList.add(
                "ring-2",
                "ring-offset-2",
                "ring-primary",
                "scale-110"
              );
            }
          });
        }
      } catch (error) {
        applyColors(
          DEFAULT_THEME.primary,
          DEFAULT_THEME.secondary,
          DEFAULT_THEME.accent
        );
      }
    } else {
      const first = colorsGrid && colorsGrid.querySelector("button");
      if (first) {
        first.classList.add(
          "ring-2",
          "ring-offset-2",
          "ring-primary",
          "scale-110"
        );
      }
    }
  }
})();
