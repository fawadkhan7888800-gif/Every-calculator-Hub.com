const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");
const historyList = document.getElementById("history-list");
const historyEntries = [];

function addHistory(text) {
  historyEntries.unshift(`${new Date().toLocaleTimeString()} - ${text}`);
  if (historyEntries.length > 50) historyEntries.pop();
  historyList.innerHTML = historyEntries.map((item) => `<li>${item}</li>`).join("");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

document.getElementById("history-clear").addEventListener("click", () => {
  historyEntries.length = 0;
  historyList.innerHTML = "";
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
let isLight = false;
themeToggle.addEventListener("click", () => {
  isLight = !isLight;
  document.body.classList.toggle("light", isLight);
  themeToggle.textContent = isLight ? "Dark Mode" : "Light Mode";
});

// Basic calculator (+ - * /, clear, delete, equals)
const display = document.getElementById("basic-display");
const basicButtons = document.getElementById("basic-buttons");
const basicKeys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+", "DEL", "="];

basicKeys.forEach((key) => {
  const btn = document.createElement("button");
  btn.textContent = key;
  if (["/", "*", "-", "+"].includes(key)) btn.classList.add("op");
  if (key === "=") btn.classList.add("equal");
  if (key === "C") btn.classList.add("danger");
  basicButtons.appendChild(btn);
});

function evalBasicExpression(expression) {
  return Function(`"use strict"; return (${expression})`)();
}

basicButtons.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const key = e.target.textContent;
  if (key === "C") {
    display.value = "0";
    return;
  }
  if (key === "DEL") {
    display.value = display.value.length > 1 ? display.value.slice(0, -1) : "0";
    return;
  }
  if (key === "=") {
    try {
      const expression = display.value;
      const result = evalBasicExpression(expression);
      display.value = Number.isFinite(result) ? String(result) : "Error";
      if (display.value !== "Error") addHistory(`Basic: ${expression} = ${display.value}`);
    } catch {
      display.value = "Error";
    }
    return;
  }
  display.value = display.value === "0" || display.value === "Error" ? key : display.value + key;
});

// Scientific calculator layout
const sciDisplay = document.getElementById("sci-display");
const sciButtons = document.getElementById("sci-buttons");
const sciKeys = ["sin", "cos", "tan", "log", "ln", "(", ")", "^", "sqrt", "pi", "7", "8", "9", "/", "C", "4", "5", "6", "*", "DEL", "1", "2", "3", "-", "e", "0", ".", "%", "+", "="];

sciKeys.forEach((key) => {
  const btn = document.createElement("button");
  btn.textContent = key;
  if (["/", "*", "-", "+", "^"].includes(key)) btn.classList.add("op");
  if (key === "=") btn.classList.add("equal");
  if (key === "C") btn.classList.add("danger");
  sciButtons.appendChild(btn);
});

function normalizeScientific(expr) {
  return expr
    .replaceAll("pi", "Math.PI")
    .replaceAll("sqrt", "Math.sqrt")
    .replaceAll("sin", "Math.sin")
    .replaceAll("cos", "Math.cos")
    .replaceAll("tan", "Math.tan")
    .replaceAll("log", "Math.log10")
    .replaceAll("ln", "Math.log")
    .replace(/\be\b/g, "Math.E")
    .replace(/\^/g, "**");
}

sciButtons.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const key = e.target.textContent;
  if (key === "C") {
    sciDisplay.value = "0";
    return;
  }
  if (key === "DEL") {
    sciDisplay.value = sciDisplay.value.length > 1 ? sciDisplay.value.slice(0, -1) : "0";
    return;
  }
  if (key === "=") {
    try {
      const expression = sciDisplay.value;
      const normalized = normalizeScientific(expression);
      const result = Function(`"use strict"; return (${normalized})`)();
      sciDisplay.value = Number.isFinite(result) ? String(result) : "Error";
      if (sciDisplay.value !== "Error") addHistory(`Scientific: ${expression} = ${sciDisplay.value}`);
    } catch {
      sciDisplay.value = "Error";
    }
    return;
  }
  const functionKeys = ["sin", "cos", "tan", "log", "ln", "sqrt"];
  const appendValue = functionKeys.includes(key) ? `${key}(` : key;
  sciDisplay.value = sciDisplay.value === "0" || sciDisplay.value === "Error" ? appendValue : sciDisplay.value + appendValue;
});

// BMI calculator
document.getElementById("bmi-calc").addEventListener("click", () => {
  const weight = Number(document.getElementById("bmi-weight").value);
  const heightCm = Number(document.getElementById("bmi-height").value);
  const resultEl = document.getElementById("bmi-result");
  if (!weight || !heightCm) {
    resultEl.textContent = "Enter valid weight and height.";
    return;
  }
  const bmi = weight / (heightCm / 100) ** 2;
  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 30) category = "Obese";
  else if (bmi >= 25) category = "Overweight";
  resultEl.textContent = `BMI: ${bmi.toFixed(2)} (${category})`;
  addHistory(resultEl.textContent);
});

// Loan EMI calculator
document.getElementById("loan-calc").addEventListener("click", () => {
  const principal = Number(document.getElementById("loan-principal").value);
  const annualRate = Number(document.getElementById("loan-rate").value);
  const years = Number(document.getElementById("loan-years").value);
  const resultEl = document.getElementById("loan-result");
  if (!principal || years <= 0 || annualRate < 0) {
    resultEl.textContent = "Enter valid loan inputs.";
    return;
  }
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  resultEl.textContent = `Monthly EMI: ${emi.toFixed(2)}`;
  addHistory(resultEl.textContent);
});

// Age calculator (years/months/days)
document.getElementById("age-calc").addEventListener("click", () => {
  const dobValue = document.getElementById("dob").value;
  const resultEl = document.getElementById("age-result");
  if (!dobValue) {
    resultEl.textContent = "Select your date of birth.";
    return;
  }
  const dob = new Date(dobValue);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) {
    resultEl.textContent = "Date of birth cannot be in the future.";
    return;
  }
  resultEl.textContent = `${years} years, ${months} months, ${days} days`;
  addHistory(`Age: ${resultEl.textContent}`);
});

// Unit converter (km, m, mi, ft)
const unitToMeters = { km: 1000, m: 1, mi: 1609.344, ft: 0.3048 };
document.getElementById("unit-calc").addEventListener("click", () => {
  const value = Number(document.getElementById("unit-value").value);
  const from = document.getElementById("unit-from").value;
  const to = document.getElementById("unit-to").value;
  const resultEl = document.getElementById("unit-result");
  if (!Number.isFinite(value)) {
    resultEl.textContent = "Enter a valid number.";
    return;
  }
  const converted = (value * unitToMeters[from]) / unitToMeters[to];
  resultEl.textContent = `${value} ${from} = ${converted.toFixed(4)} ${to}`;
  addHistory(resultEl.textContent);
});

// Percentage calculator
document.getElementById("percentage-calc").addEventListener("click", () => {
  const part = Number(document.getElementById("percent-part").value);
  const total = Number(document.getElementById("percent-total").value);
  const resultEl = document.getElementById("percentage-result");
  if (!Number.isFinite(part) || !Number.isFinite(total) || total === 0) {
    resultEl.textContent = "Enter valid values (total cannot be zero).";
    return;
  }
  const percentage = (part / total) * 100;
  resultEl.textContent = `${part} is ${percentage.toFixed(2)}% of ${total}`;
  addHistory(resultEl.textContent);
});

// Discount calculator
document.getElementById("discount-calc").addEventListener("click", () => {
  const original = Number(document.getElementById("discount-original").value);
  const discountPercent = Number(document.getElementById("discount-percent").value);
  const resultEl = document.getElementById("discount-result");
  if (!Number.isFinite(original) || original < 0 || !Number.isFinite(discountPercent) || discountPercent < 0) {
    resultEl.textContent = "Enter valid original price and discount.";
    return;
  }
  const discountAmount = (original * discountPercent) / 100;
  const finalPrice = original - discountAmount;
  resultEl.textContent = `You save ${discountAmount.toFixed(2)}. Final price: ${finalPrice.toFixed(2)}`;
  addHistory(resultEl.textContent);
});

// GST calculator
const gstAmountInput = document.getElementById("gst-amount");
const gstRateInput = document.getElementById("gst-rate");
const gstResult = document.getElementById("gst-result");
document.getElementById("gst-add").addEventListener("click", () => {
  const amount = Number(gstAmountInput.value);
  const rate = Number(gstRateInput.value);
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(rate) || rate < 0) {
    gstResult.textContent = "Enter valid amount and GST rate.";
    return;
  }
  const gstValue = (amount * rate) / 100;
  const total = amount + gstValue;
  gstResult.textContent = `GST: ${gstValue.toFixed(2)} | Total: ${total.toFixed(2)}`;
  addHistory(gstResult.textContent);
});
document.getElementById("gst-remove").addEventListener("click", () => {
  const amountWithGst = Number(gstAmountInput.value);
  const rate = Number(gstRateInput.value);
  if (!Number.isFinite(amountWithGst) || amountWithGst < 0 || !Number.isFinite(rate) || rate < 0) {
    gstResult.textContent = "Enter valid amount and GST rate.";
    return;
  }
  const baseAmount = amountWithGst / (1 + rate / 100);
  const gstValue = amountWithGst - baseAmount;
  gstResult.textContent = `Base: ${baseAmount.toFixed(2)} | GST: ${gstValue.toFixed(2)}`;
  addHistory(gstResult.textContent);
});

// Temperature converter
function toCelsius(value, unit) {
  if (unit === "c") return value;
  if (unit === "f") return (value - 32) * (5 / 9);
  return value - 273.15;
}
function fromCelsius(value, unit) {
  if (unit === "c") return value;
  if (unit === "f") return value * (9 / 5) + 32;
  return value + 273.15;
}
document.getElementById("temp-calc").addEventListener("click", () => {
  const value = Number(document.getElementById("temp-value").value);
  const from = document.getElementById("temp-from").value;
  const to = document.getElementById("temp-to").value;
  const resultEl = document.getElementById("temp-result");
  if (!Number.isFinite(value)) {
    resultEl.textContent = "Enter a valid temperature value.";
    return;
  }
  const converted = fromCelsius(toCelsius(value, from), to);
  resultEl.textContent = `${value.toFixed(2)} ${from.toUpperCase()} = ${converted.toFixed(2)} ${to.toUpperCase()}`;
  addHistory(resultEl.textContent);
});

// SIP/FD calculator
document.getElementById("sipfd-calc").addEventListener("click", () => {
  const type = document.getElementById("sipfd-type").value;
  const amount = Number(document.getElementById("sipfd-amount").value);
  const annualRate = Number(document.getElementById("sipfd-rate").value);
  const years = Number(document.getElementById("sipfd-years").value);
  const resultEl = document.getElementById("sipfd-result");
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(annualRate) || annualRate < 0 || !Number.isFinite(years) || years <= 0) {
    resultEl.textContent = "Enter valid amount, rate, and years.";
    return;
  }
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  let maturity = 0;
  if (type === "sip") {
    maturity = monthlyRate === 0 ? amount * months : amount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    resultEl.textContent = `SIP Maturity: ${maturity.toFixed(2)}`;
  } else {
    maturity = amount * (1 + annualRate / 100) ** years;
    resultEl.textContent = `FD Maturity: ${maturity.toFixed(2)}`;
  }
  addHistory(resultEl.textContent);
});

// Currency converter (live rates)
document.getElementById("currency-calc").addEventListener("click", async () => {
  const amount = Number(document.getElementById("currency-amount").value);
  const from = document.getElementById("currency-from").value;
  const to = document.getElementById("currency-to").value;
  const resultEl = document.getElementById("currency-result");
  if (!Number.isFinite(amount)) {
    resultEl.textContent = "Enter a valid amount.";
    return;
  }
  if (from === to) {
    resultEl.textContent = `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;
    addHistory(resultEl.textContent);
    return;
  }
  resultEl.textContent = "Fetching live rate...";
  try {
    const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Rate API failed");
    const data = await response.json();
    const converted = data.rates[to];
    if (!Number.isFinite(converted)) throw new Error("Invalid rate response");
    resultEl.textContent = `${amount.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;
    addHistory(`Currency: ${resultEl.textContent}`);
  } catch {
    resultEl.textContent = "Could not fetch live rates right now. Please try again.";
  }
});
