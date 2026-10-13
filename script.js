// ---------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------

document.getElementById("yr").textContent = new Date().getFullYear();


// ---------------------------------------------------------------
// Scroll reveal
// ---------------------------------------------------------------

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));


// ---------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------

const menuBtn = document.querySelector(".menu-toggle");
const menu = document.getElementById("site-nav");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => {
  setMenu(!menu.classList.contains("open"));
});

menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});


// ---------------------------------------------------------------
// Booking form
// ---------------------------------------------------------------

const form = document.getElementById("bookForm");
const statusEl = document.getElementById("form-status");
const submitBtn = form.querySelector('button[type="submit"]');

document.getElementById("form-ts").value = Date.now();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  statusEl.textContent = "Sending…";

  const formData = new FormData(form);
  formData.set("time", formatTime(form.elements.time.value));

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      statusEl.textContent = "Thanks! Your message was sent.";
      form.reset();
    } else {
      // API returns { success: false, code, message } on failure
      const data = await response.json().catch(() => null);
      statusEl.textContent = data?.message ?? "Something went wrong. Please try again.";
    }
  } catch (error) {
    statusEl.textContent = "Network error. Please try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

// Converts "HH:MM" (24h) to "h:MM AM/PM"
function formatTime(time) {
  if (!time) return "";

  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute} ${period}`;
}