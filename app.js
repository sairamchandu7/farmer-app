// Sidebar section switch
function showSection(id) {
  // Hide all sections
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");

  // Show the selected section
  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  // Load dynamic data
  if (id === "dashboard") loadDashboard();
  if (id === "market") updateMarketChart();
  if (id === "pest") updatePestAlerts();
  if (id === "weather") {
    // Default weather on open
    const defaultCity = "Hyderabad";
    const apiKey = "YOUR_API_KEY"; // Replace with OpenWeather key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
  }
}

// Motor control
function toggleMotor(on) {
  const status = document.getElementById("motorStatus");
  if(on){
    status.innerText = "Motor is ON ✅";
    status.style.color = "green";
    // Optional: Add IoT API call to physically start motor
  } else {
    status.innerText = "Motor is OFF ❌";
    status.style.color = "red";
    // Optional: Add IoT API call to stop motor
  }
}

// Soil analysis
function analyzeSoil() {
  const file = document.getElementById("soilFile").files[0];
  if (!file) {
    alert("Please upload soil file");
    return;
  }
  document.getElementById("fertilizerResult").innerHTML = `
    <p>🌱 Recommended Fertilizers (NPK): Nitrogen 30%, Phosphorus 20%, Potassium 25%</p>
    <p>🌿 Suggested Organic Supplement: Compost 15kg/acre</p>
    <p><b>🏅 Badge Earned:</b> Soil Analyzer ✅</p>
  `;
}

// AI Chat Bot
function sendMessage() {
  const input = document.getElementById("chatInput");
  if (input.value.trim() === "") return;

  const chatWindow = document.getElementById("chatWindow");

  // User message
  const userMsg = document.createElement("div");
  userMsg.className = "msg you";
  userMsg.innerText = input.value;
  chatWindow.appendChild(userMsg);

  // Bot response
  const botMsg = document.createElement("div");
  botMsg.className = "msg bot";

  const msg = input.value.toLowerCase();
  if (msg.includes("fertilizer")) botMsg.innerText = "✅ Use NPK fertilizers and compost for best yield.";
  else if (msg.includes("pest")) botMsg.innerText = "🐛 Check pest alerts section and apply organic pesticides if needed.";
  else if (msg.includes("weather")) botMsg.innerText = "☔ Tomorrow is expected to be rainy. Protect your crops.";
  else botMsg.innerText = "👋 Hello! How can I assist you with your farm today?";

  chatWindow.appendChild(botMsg);

  // Voice output
  const utter = new SpeechSynthesisUtterance(botMsg.innerText);
  const lang = document.getElementById("mainLanguage").value;
  if (lang === "hi") utter.lang = "hi-IN";
  if (lang === "te") utter.lang = "te-IN";
  if (lang === "ur") utter.lang = "ur-PK";
  speechSynthesis.speak(utter);

  chatWindow.scrollTop = chatWindow.scrollHeight;
  input.value = "";
}

// Voice recognition
function startVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice not supported");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function (event) {
    document.getElementById("chatInput").value = event.results[0][0].transcript;
    sendMessage();
  };
}

// Pest alerts
// ======== Pest Alerts ======== //
const pestList = document.getElementById("pestList");

// Sample pest alerts data (can be enhanced with API or local DB)
const pestAlertsData = [
  { crop: "Paddy", region: "Andhra Pradesh", pest: "Brown Plant Hopper", advice: "Spray neem oil or use pheromone traps." },
  { crop: "Cotton", region: "Maharashtra", pest: "Whitefly", advice: "Use yellow sticky traps or neem extract." },
  { crop: "Sugarcane", region: "UP", pest: "Top shoot borer", advice: "Monitor shoots, remove infected tops." },
  { crop: "Tomato", region: "Telangana", pest: "Tomato leaf miner", advice: "Use Trichogramma cards or neem oil." },
  { crop: "Wheat", region: "Punjab", pest: "Aphids", advice: "Spray insecticidal soap or neem oil." }
];

// Load Pest Alerts
function loadPestAlerts() {
  pestList.innerHTML = ""; // Clear old alerts

  // Randomize 3 alerts
  let shuffled = pestAlertsData.sort(() => 0.5 - Math.random());
  let alertsToShow = shuffled.slice(0, 3);

  alertsToShow.forEach(alert => {
    let li = document.createElement("li");
    li.innerHTML = `<b>Crop:</b> ${alert.crop} | <b>Region:</b> ${alert.region} | <b>Pest:</b> ${alert.pest}<br><i>Advice:</i> ${alert.advice}`;
    li.style.marginBottom = "10px";
    pestList.appendChild(li);
  });
}

// Auto load on section open
document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById("pest").style.display !== "none") loadPestAlerts();
});


// Market chart
function updateMarketChart() {
  const ctx = document.getElementById("marketChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: "Tomato Price (₹/kg)",
        data: [20, 22, 19, 23, 21],
        borderColor: "#2e7d32",
        fill: false
      }]
    },
    options: { responsive: true }
  });
}

// Weather functions
async function getWeather() {
  const apiKey = "8c0e463a2cad61c5b8a0610360bdceec"; // Replace with your OpenWeatherMap API key
  const city = document.getElementById("cityInput").value;
  if (!city) {
    document.getElementById("weatherResult").innerHTML = "⚠️ Please enter a city name!";
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchWeather(url);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const apiKey = "8c0e463a2cad61c5b8a0610360bdceec"; // Replace with your OpenWeatherMap API key
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        fetchWeather(url);
      },
      () => {
        document.getElementById("weatherResult").innerHTML = "❌ Location access denied!";
      }
    );
  } else {
    document.getElementById("weatherResult").innerHTML = "⚠️ Geolocation not supported!";
  }
}

async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== 200) {
      document.getElementById("weatherResult").innerHTML = "❌ City not found!";
      return;
    }
    document.getElementById("weatherResult").innerHTML = `
      <p><strong>📍 Location:</strong> ${data.name}</p>
      <p><strong>🌡 Temperature:</strong> ${data.main.temp}°C</p>
      <p><strong>☁️ Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>🌬 Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  } catch (err) {
    document.getElementById("weatherResult").innerHTML = "⚠️ Error fetching weather!";
  }
}


// Dashboard charts
function loadDashboard() {
  // Crop Production
  new Chart(document.getElementById("cropChart"), {
    type: "bar",
    data: {
      labels: ["Wheat", "Rice", "Cotton", "Maize", "Sugarcane"],
      datasets: [{
        label: "Yield (quintals/acre)",
        data: [25, 30, 20, 18, 40],
        backgroundColor: ["green", "blue", "orange", "red", "purple"]
      }]
    }
  });

  // Irrigation
  new Chart(document.getElementById("irrigationChart"), {
    type: "doughnut",
    data: {
      labels: ["Effective Use", "Wastage"],
      datasets: [{
        data: [75, 25],
        backgroundColor: ["#4CAF50", "#f44336"]
      }]
    }
  });

  // Fertilizer usage
  new Chart(document.getElementById("fertilizerChart"), {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Fertilizer (kg/acre)",
        data: [30, 45, 40, 60, 55, 70],
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        tension: 0.3
      }]
    }
  });

  // Profit forecast
  new Chart(document.getElementById("profitChart"), {
    type: "line",
    data: {
      labels: ["2023", "2024", "2025"],
      datasets: [{
        label: "Profit (₹ lakhs)",
        data: [2.5, 3.2, 4.0],
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.3
      }, {
        label: "Loss (₹ lakhs)",
        data: [1.2, 1.0, 0.8],
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.3
      }]
    }
  });
}

// 🌾 Community Chat
function sendCommunityMessage() {
  let input = document.getElementById("communityInput");
  let msg = input.value.trim();
  if (msg !== "") {
    let chatWindow = document.getElementById("communityWindow");
    let newMsg = document.createElement("p");
    newMsg.innerHTML = "<strong>You:</strong> " + msg;
    chatWindow.appendChild(newMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    input.value = "";
  }
}
