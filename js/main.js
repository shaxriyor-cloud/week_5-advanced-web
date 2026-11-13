// Booking page logic: live price + validation (no reload, no database)
const form = document.getElementById("booking-form");

if (form) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const tourSelect = document.getElementById("tour");
  const travellersInput = document.getElementById("travellers");
  const dateInput = document.getElementById("date");
  const totalBox = document.getElementById("total");
  const messageBox = document.getElementById("message");

  // Calculate price. Returns null if there is nothing to show yet.
  function calculate() {
    const price = Number(tourSelect.selectedOptions[0].dataset.price);
    const people = parseInt(travellersInput.value, 10);
    if (!price || isNaN(people) || people < 1 || people > 12) return null;

    const full = people * price;
    const discount = people >= 5;                 // groups of 5+ get 10% off
    const total = discount ? full * 0.9 : full;
    const text = discount
      ? `Total: ${people} × ${price} USD = ${full} USD − 10% group discount = ${total} USD`
      : `Total: ${people} × ${price} USD = ${total} USD`;
    return { total, text };
  }

  function updateTotal() {
    const result = calculate();
    if (result) {
      totalBox.textContent = result.text;
    } else if (!Number(tourSelect.selectedOptions[0].dataset.price)) {
      totalBox.textContent = "Choose a tour to see the total.";
    } else {
      totalBox.textContent = "Enter 1 to 12 travellers to see the total.";
    }
  }

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = "message " + type;
    messageBox.hidden = false;
  }

  tourSelect.addEventListener("change", updateTotal);
  travellersInput.addEventListener("input", updateTotal);

  // Earliest date = today
  dateInput.min = new Date().toISOString().split("T")[0];

  // Preselect tour from the Home page link (booking.html?tour=khiva)
  const preset = new URLSearchParams(window.location.search).get("tour");
  if (preset) tourSelect.value = preset;
  updateTotal();

  form.addEventListener("submit", function (event) {
    event.preventDefault();                       // no page reload

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const errors = [];

    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");

    if (name === "") {
      errors.push("Please enter your name.");
      nameInput.classList.add("invalid");
    }
    if (!email.includes("@")) {
      errors.push("Please enter an email that contains @.");
      emailInput.classList.add("invalid");
    }
    const result = calculate();
    if (!result) {
      errors.push("Please choose a tour and 1 to 12 travellers.");
    }

    if (errors.length > 0) {
      showMessage(errors.join(" "), "error");
      return;
    }
    showMessage(`Thank you, ${name}! Your request is received. ${result.text}.`, "success");
  });
}
