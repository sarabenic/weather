const apiKey = "ae7ec1ee94ac4ccc1a65ea1aa8e94300";

$(document).ready(function () {
 $("#city-input").on("keypress", function (event) {
    if (event.key === "Enter") {
      const city = $("#city-input").val().trim();

      if (city !== "") {
        getWeatherByCity(city);
      }
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

function getWeather(url) {
  $.ajax({
    url: url,
    method: "GET"
  })
    .done(function (data) {
      const weather = createWeatherObject(data);
      renderWeather(weather);
      $("#city-input").val("");
    })
    .fail(function () {
      $("#weather-result").html("");
      alert("We couldn't find the city, try again!");
    });
}

function createWeatherObject(data) {
  return {
    city: data.name,
    temperature: data.main.temp,
    wind: data.wind.speed,
    icon: data.weather[0].icon
  };
}

function renderWeather(weather) {
  const iconUrl = getIconUrl(weather.icon);

  $("#weather-result").html(`
    <div class="weather-card">
      <img src="${iconUrl}" alt="Weather icon">
      <h3>${weather.city}</h3>
      <p>${weather.temperature.toFixed(2)} °C</p>
      <p>${weather.wind.toFixed(2)} m/s</p>
    </div>
  `);
}

function getIconUrl(iconName) {
  return "https://openweathermap.org/img/wn/" + iconName + "@2x.png";
}