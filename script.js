const passwordInput = document.getElementById("password");
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");
const crackTime = document.getElementById("crack-time");
const themeToggle = document.getElementById("theme-toggle");

const generatedPassword = document.getElementById("generated-password");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const toast = document.getElementById("toast");

const conditions = {
  length: document.getElementById("length"),
  uppercase: document.getElementById("uppercase"),
  lowercase: document.getElementById("lowercase"),
  number: document.getElementById("number"),
  special: document.getElementById("special"),
};

// THEME PERSISTENCE
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.innerText = "☀️";
}

themeToggle.addEventListener("click", () => {
  const light = document.body.classList.toggle("light");
  themeToggle.innerText = light ? "☀️" : "🌙";
  localStorage.setItem("theme", light ? "light" : "dark");
});

// PASSWORD CHECK
passwordInput.addEventListener("input", async () => {
  const password = passwordInput.value;

  if (!password) return;

  const res = await fetch("/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = await res.json();
  let score = 0;

  Object.keys(data.rules).forEach(key => {
    const li = conditions[key];
    const icon = li.querySelector(".icon");

    if (data.rules[key]) {
      li.classList.add("valid");
      icon.innerText = "✅";
      score++;
    } else {
      li.classList.remove("valid");
      icon.innerText = "❌";
    }
  });

  strengthFill.style.width = `${score * 20}%`;
  strengthFill.style.background =
    score <= 2 ? "#ff6b6b" :
    score === 3 ? "#f1c40f" :
    "#2ecc71";

  strengthText.innerText = [
    "Very Weak",
    "Weak",
    "Okay",
    "Strong",
    "Very Strong",
    "Unbreakable",
  ][score];

  crackTime.innerText = "⏳ Estimated crack time: " + data.crack_time;
});

// GENERATE PASSWORD
generateBtn.addEventListener("click", async () => {
  const res = await fetch("/generate");
  const data = await res.json();

  generatedPassword.value = data.password;
  passwordInput.value = data.password;
  passwordInput.dispatchEvent(new Event("input"));
});

// COPY TO CLIPBOARD
copyBtn.addEventListener("click", () => {
  if (!generatedPassword.value) return;

  navigator.clipboard.writeText(generatedPassword.value);
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
});
