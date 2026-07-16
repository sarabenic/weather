const apiKey = "ae7ec1ee94ac4ccc1a65ea1aa8e94300";
const storageKey = "weatherSearches";

$(document).ready(function () {
  renderLatestRequests();

  // Söker väder när användaren skriver en stad och trycker enter
  $("#city-input").on("keypress", function (event) {
    if (event.key === "Enter") {
      const city = $("#city-input").val().trim();

      if (city !== "") {
        getWeatherByCity(city);
      }
    }
  });

  // Hämtar väder för användarens nuvarande plats
  $("#location-button").on("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeatherByLocation);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
});

function getWeatherByCity(city) {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&units=metric&appid=" +
    apiKey;

  getWeather(url);
}

function getWeatherByLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=metric&appid=" +
    apiKey;

  getWeather(url);
}

// Hämtar väderdata från OpenWeather med Ajax
function getWeather(url) {
  $.ajax({
    url: url,
    method: "GET"
  })
    .done(function (data) {
      const cityInput = document.getElementById("city-input");
      const popover = bootstrap.Popover.getInstance(cityInput);

      // Döljer felmeddelandet om en ny sökning lyckas
      if (popover) {
        popover.hide();
    }

      const weather = createWeatherObject(data);

      renderWeather(weather);
      saveSearch(weather);
      renderLatestRequests();

      $("#city-input").val("");
    })

    
    .fail(function () {
      // Tar bort det gamla väderkortet om sökningen misslyckas
      $("#weather-result").html("");

      const cityInput = document.getElementById("city-input");
      const popover = bootstrap.Popover.getOrCreateInstance(cityInput);

      // Visar Bootstrap popover vid felaktig stad
      popover.show();

      setTimeout(function () {
        popover.hide();
      }, 3000);
    });
}

function createWeatherObject(data) {
  // Plockar ut bara den data som behövs från API-svaret
  return {
    city: data.name,
    temperature: data.main.temp,
    wind: data.wind.speed,
    icon: data.weather[0].icon
  };
}

function renderWeather(weather) {
  const iconUrl = getIconUrl(weather.icon);

  // Visar aktuellt väder på sidan
  $("#weather-result").html(`
    <div class="weather-card">
      <img src="${iconUrl}" alt="Weather icon">
      <h3>${weather.city}</h3>
      <p>${weather.temperature.toFixed(2)} °C</p>
      <p>${weather.wind.toFixed(2)} m/s</p>
    </div>
  `);
}

function saveSearch(weather) {
  const searches = getSearches();

  // Lägger den senaste sökningen först i listan
  searches.unshift(weather);

  // Sparar bara de fem senaste sökningarna
  if (searches.length > 5) {
    searches.pop();
  }

  window.localStorage.setItem(storageKey, JSON.stringify(searches));
}

function getSearches() {
  const savedSearches = window.localStorage.getItem(storageKey);

  if (savedSearches === null) {
    return [];
  }

  return JSON.parse(savedSearches);
}

function renderLatestRequests() {
  const searches = getSearches();

  $("#latest-requests").html("");

  // Visar max fem senaste sökningar från localStorage
  for (let i = 0; i < searches.length; i++) {
    const weather = searches[i];
    const iconUrl = getIconUrl(weather.icon);

    $("#latest-requests").append(`
      <div class="latest-card">
        <img src="${iconUrl}" alt="Weather icon">
        <h3>${weather.city}</h3>
        <p>${weather.temperature.toFixed(2)} °C</p>
        <p>${weather.wind.toFixed(2)} m/s</p>
      </div>
    `);
  }
}

function getIconUrl(iconName) {
  return "https://openweathermap.org/img/wn/" + iconName + "@2x.png";
}