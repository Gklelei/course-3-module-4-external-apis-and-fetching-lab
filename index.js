const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");

fetchButton.addEventListener("click", handleFetch);

async function handleFetch() {
  const state = stateInput.value.trim().toUpperCase();

  alertsDisplay.innerHTML = "";
  hideError();

  if (!state) {
    showError("Please enter a state code");
    return;
  }

  try {
    const response = await fetch(`${weatherApi}${state}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    displayAlerts(data);

    stateInput.value = "";
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    showError(error.message);
  }
}

function displayAlerts(data) {
  alertsDisplay.innerHTML = "";

  if (!data || !data.features || data.features.length === 0) {
    alertsDisplay.innerHTML = "<p>No active alerts for this state.</p>";
    return;
  }

  const title = document.createElement("h2");
  title.textContent = `Weather Alerts: ${data.features.length}`;
  alertsDisplay.appendChild(title);

  const alertsList = document.createElement("ul");

  data.features.forEach((feature) => {
    if (feature.properties && feature.properties.headline) {
      const alertItem = document.createElement("li");
      alertItem.textContent = feature.properties.headline;
      alertsList.appendChild(alertItem);
    }
  });

  alertsDisplay.appendChild(alertsList);
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}
