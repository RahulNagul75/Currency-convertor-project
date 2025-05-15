const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const amountInput = document.getElementById("amount");
const form = document.getElementById("converter-form");
const swapBtn = document.getElementById("swap-btn");
const resultDiv = document.getElementById("result");

const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Fill dropdowns
function populateDropdowns() {
  for (let currency_code in countryList) {
    const option1 = document.createElement("option");
    option1.value = currency_code;
    option1.textContent = currency_code;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency_code;
    option2.textContent = currency_code;
    toCurrency.appendChild(option2);
  }

  // Default selection
  fromCurrency.value = "USD";
  toCurrency.value = "INR";

  updateFlags();
}

// Update flag images based on selected currency
function updateFlags() {
  fromFlag.src = `https://flagsapi.com/${countryList[fromCurrency.value]}/flat/64.png`;
  toFlag.src = `https://flagsapi.com/${countryList[toCurrency.value]}/flat/64.png`;
}

// Swap currencies
swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateFlags();
  resultDiv.textContent = ""; // Clear previous result
});

// Update flags on dropdown change
fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const from = fromCurrency.value.toLowerCase();
  const to = toCurrency.value.toLowerCase();
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = "Please enter a valid amount.";
    return;
  }

  resultDiv.textContent = "Converting...";

  try {
  const res = await fetch(`https://open.er-api.com/v6/latest/${from.toUpperCase()}`);
  if (!res.ok) throw new Error("Failed to fetch exchange rates.");

  const data = await res.json();

  if (!data.rates || !data.rates[to.toUpperCase()]) {
    resultDiv.textContent = "Currency not supported.";
    return;
  }

  const rate = data.rates[to.toUpperCase()];
  const converted = (rate * amount).toFixed(4);

  resultDiv.textContent = `${amount} ${from.toUpperCase()} = ${converted} ${to.toUpperCase()}`;
} catch (err) {
  resultDiv.textContent = "Error fetching exchange rate.";
  console.error("API error:", err);
}

});

// Initialize
populateDropdowns();
