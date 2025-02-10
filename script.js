let cityInput = document.getElementById("cityInput");
let getWeatherBtn = document.getElementById("getWeatherBtn");
let temperature = document.getElementById("temperature");
let condition = document.getElementById("condition");

let getWeatherData = async (cityName) => {
  try {
    const forecast =
      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c5eb58feb5fe4ab8984144020252201&q=${cityName}&aqi=yes
  `).then((response) => response.json());
    return forecast;
  } catch {
    return 404;
  }
};

getWeatherBtn.addEventListener("click", () => {
  displayAllInfo();
});

document.addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
    displayAllInfo();
  }
});

async function displayAllInfo() {
  let cityName = cityInput.value;
  const weather = await getWeatherData(cityName);
  console.log(weather);

  cityInput.value = "";

  document.getElementById("weatherAppWrapper").style.backgroundImage = "";

  displaySections(weather);

  let displayCondition = weather.current.condition.code;
  let isDay = weather.current.is_day;

  checkDayNight(isDay);

  let weather_img_name = displayWeatherImg(displayCondition, isDay);
  document.getElementById(
    "weather-img"
  ).src = `assets/weather/${weather_img_name}.svg`;

  displayWeatherInfo(weather);
  displayForecast(weather);

  document.getElementById("forecast-container").scrollLeft = 0;
}

function displaySections(status) {
  if (!status.error && status !== 404) {
    document.getElementById("weatherCard").style.display = "block";
    document.getElementById("search-msg").style.display = "none";
  } else {
    document.getElementById("not-found-msg").style.display = "block";
    document.getElementById("weatherCard").style.display = "none";
    document.getElementById("search-msg").style.display = "none";
  }
}

function checkDayNight(isDay) {
  if (isDay) {
    document.getElementById(
      "weatherAppWrapper"
    ).style.backgroundImage = `url("assets/day-sky.jpg")`;
  } else {
    document.getElementById(
      "weatherAppWrapper"
    ).style.backgroundImage = `url("assets/night-sky.jpg")`;
  }
}

function displayWeatherImg(displayCondition, isDay) {
  if (displayCondition === 1000) {
    if (isDay) {
      return "sunny";
    } else {
      return "clear";
    }
  }

  if (displayCondition === 1003) {
    if (isDay) {
      return "cloudy_sun";
    } else {
      return "cloudy_moon";
    }
  }

  if (displayCondition === 1006 || displayCondition === 1009) {
    return "cloudy";
  }

  if (
    displayCondition === 1063 ||
    displayCondition === 1072 ||
    displayCondition === 1150 ||
    displayCondition === 1153 ||
    displayCondition === 1168 ||
    displayCondition === 1171 ||
    displayCondition === 1180 ||
    displayCondition === 1183 ||
    displayCondition === 1186 ||
    displayCondition === 1189 ||
    displayCondition === 1192 ||
    displayCondition === 1195 ||
    displayCondition === 1198 ||
    displayCondition === 1201 ||
    displayCondition === 1240 ||
    displayCondition === 1243 ||
    displayCondition === 1246
  ) {
    return "rainy";
  }

  if (displayCondition === 1087) {
    return "lightning";
  }

  if (displayCondition === 1276 || displayCondition === 1273) {
    return "rain_lightning";
  }

  if (
    displayCondition === 1066 ||
    displayCondition === 1258 ||
    displayCondition === 1255 ||
    displayCondition === 1225 ||
    displayCondition === 1222 ||
    displayCondition === 1219 ||
    displayCondition === 1216 ||
    displayCondition === 1213 ||
    displayCondition === 1210
  ) {
    return "snowy";
  }

  if (displayCondition === 1282 || displayCondition === 1279) {
    return "snow_thunder";
  }

  if (
    displayCondition === 1030 ||
    displayCondition === 1135 ||
    displayCondition === 1147
  ) {
    return "foggy";
  }

  if (
    displayCondition === 1069 ||
    displayCondition === 1204 ||
    displayCondition === 1207 ||
    displayCondition === 1252
  ) {
    return "sleet";
  }

  if (
    displayCondition === 1237 ||
    displayCondition === 1261 ||
    displayCondition === 1264
  ) {
    return "ice-pellets";
  }
}

function displayWeatherInfo(weather) {
  document.getElementById("cityName").innerText = weather.location.name;

  temperature.innerText = `${weather.current.temp_c} °C`;

  condition.innerText = weather.current.condition.text;

  document.getElementById(
    "min_max_temp"
  ).innerText = `${weather.forecast.forecastday[0].day.mintemp_c}°C / ${weather.forecast.forecastday[0].day.maxtemp_c}°C`;

  document.getElementById("aqi").innerText = `Air quality - ${parseInt(
    weather.current.air_quality.pm2_5
  )}`;

  document.getElementById(
    "humidity"
  ).innerText = `${weather.current.humidity} %`;

  document.getElementById(
    "wind_speed"
  ).innerText = `${weather.current.wind_kph} kph`;
}

function displayForecast(weather) {
  let forecastInfo = weather.forecast.forecastday[0].hour;

  let forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = "";

  forecastInfo.map((forecast) => {
    let forecastItems = document.createElement("div");
    forecastItems.className = "forecast-item";
    forecastContainer.appendChild(forecastItems);
    // forecastItems.appendChild(forecastTime, forecastImg, forecastTemp);

    let forecastTime;

    if (
      forecast.time.slice(11) >= "00:00" &&
      forecast.time.slice(11) <= "12:00"
    ) {
      forecastTime = `${forecast.time.slice(11)} AM`;
    } else {
      forecastTime = `${forecast.time.slice(11)} PM `;
    }

    let forecastImgName = displayWeatherImg(
      forecast.condition.code,
      forecast.is_day
    );

    forecastItems.innerHTML = `
              <h6 class="weatherCard-text">${forecastTime}</h6>
              <img src="assets/weather/${forecastImgName}.svg" id="forecast-img" />
              <h6 class="weatherCard-text">${forecast.temp_c} °C</h6>
           `;
  });
}
