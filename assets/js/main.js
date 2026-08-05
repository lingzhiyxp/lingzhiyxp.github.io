// Colour theme. Dark is the default; the choice is remembered per browser.
// The initial state is applied by the inline script in <head> to avoid a flash.
(function () {
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  var root = document.documentElement;

  button.addEventListener("click", function () {
    var toLight = root.getAttribute("data-theme") !== "light";
    if (toLight) {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("theme", toLight ? "light" : "dark");
    } catch (e) {
      /* private mode — the choice just won't persist */
    }
  });
})();

// Fade portfolio entries in as they scroll into view.
(function () {
  var entries = document.querySelectorAll(".entry");
  if (!entries.length) return;

  if (!("IntersectionObserver" in window)) {
    entries.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (records) {
      records.forEach(function (record) {
        if (!record.isIntersecting) return;
        record.target.classList.add("is-visible");
        observer.unobserve(record.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  entries.forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i, 4) * 60 + "ms";
    observer.observe(el);
  });
})();

// Click the email to copy it.
(function () {
  var el = document.querySelector("[data-copy]");
  if (!el) return;

  var hint = el.querySelector(".hint");
  var original = hint ? hint.textContent : "";

  el.addEventListener("click", function () {
    var text = el.getAttribute("data-copy");
    var done = function () {
      if (!hint) return;
      hint.textContent = " (Copied!)";
      hint.style.display = "inline";
      setTimeout(function () {
        hint.textContent = original;
        hint.style.display = "";
      }, 1500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
      return;
    }

    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      /* nothing to do */
    }
    document.body.removeChild(ta);
  });
})();
