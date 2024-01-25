const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  currentLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIncon = document.getElementById("icon"),
  uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uv-text"),
  windSpeed = document.querySelector(".wind-speed"),
  // windSpeedStatus = document.querySelector(".wind-status"),
  sunRise = document.querySelector(".sun-rise"),
  sunSet = document.querySelector(".sun-set"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"),
  airQuality = document.querySelector(".air-quality"),
  //
  humidityStatus = document.querySelector(".humidity-status"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status"),
  weatherCards = document.querySelector("#weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  tempUnit = document.querySelectorAll(".temp-unit");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

//Update date and time

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Friday", "Saturday"];
  //Hour
  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}
date.innerText = getDateTime();

//time chenge
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);

//public
function getPublicIp() {
  fetch("https://geolocation-db.com/json/", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      currentCity = data.currentCity;
      getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}
getPublicIp();

//weatherData

function getWeatherData(city, unit, hourlyorWeek) {
  const apiKey = "EJ6UBL2JEQGYB3AA4ENASN62J";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      let today = data.currentConditions;
      if (unit == "c") {
        temp.innerHTML = today.temp;
      } else {
        temp.innerHTML = calciusToFahrenheit(today.temp);
      }

      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc - " + today.precip + "%";

      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;

      measureUvIndex(today.uvindex);
      updateHumidityStatus(today.humidity);
      updateVisibilityStatus(today.visibility);
      updateAirQualityStatus(today.winddir);
      sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
      sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
      mainIncon.src = getIcon(today.icon);

      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");
      }
    });
}

// convert °c to °f
function calciusToFahrenheit(temp) {
  return (((temp * 9) / 5) * 32).toFixed(1);
}

// kk mm ll
function measureUvIndex(uvIndex) {
  if (uvIndex < 2) {
    uvText.innerText = "Low";
  } else if (uvIndex < 5) {
    uvText.innerText = "Moderate";
  } else if (uvIndex < 7) {
    uvText.innerText = "High";
  } else if (uvIndex < 10) {
    uvText.innerText = "Very High";
  } else {
    uvText.innerText = "Extreme";
  }
}

function updateHumidityStatus(humidity) {
  if (humidity < 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity < 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}
function updateVisibilityStatus(visibility) {
  if (visibility < 0.3) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility < 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility < 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility < 1.13) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility < 2.16) {
    visibilityStatus.innerText = "Light Mist";
  } else if (visibility < 5.4) {
    visibilityStatus.innerText = "Very Light Mist";
  } else if (visibility < 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
}

function updateAirQualityStatus(winddir) {
  if (airQuality < 50) {
    airQualityStatus.innerText = "Good";
  } else if (airQuality < 100) {
    airQualityStatus.innerText = "Moderate";
  } else if (airQuality < 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
  } else if (airQuality < 200) {
    airQualityStatus.innerText = "Unhealthy";
  } else if (airQuality < 250) {
    airQualityStatus.innerText = "Very Unhealthy";
  } else {
    airQualityStatus.innerText = "Hazardous";
  }
}

function convertTimeTo12HourFormat(time) {
  let hour = time.split(":")[0];
  let minute = time.split(":")[1];
  let ampm = hour > 12 ? "pm" : "am";
  hour = hour & 12;
  hour = hour ? hour : 12;

  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  let strTime = hour + ":" + minute + ":" + ampm;
  return strTime;
}

function getIcon(condition) {
  if (condition == "Party-cloudy-day") {
    return "icon/sun/27.png";
  } else if (condition == "party-cloudy-night") {
    return "icon/sun/15.png";
  } else if (condition == "rain") {
    return "icon/sun/39.png";
  } else if (condition == "clear-day") {
    return "icon/sun/26.png";
  } else if (condition == "clear-night") {
    return "icon/sun/10.png";
  } else {
    return "icon/sun/26.png";
  }
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDate()];
}

function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour < 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";

  let day = 0;
  let numCards = "0";
  if (type == "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");

    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }

    let dayTemp = data[day].temp;
    if (unit === "f") {
      dayTemp = calciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "f") {
      tempUnit = "°F";
    }
    card.innerHTML = `
            <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
         
    `;
    weatherCards.appendChild(card);
    day++;
  }
}
if(fahrenheitBtn){
fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});}
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});

function changeUnit(unit) {
  if (currentUnit == unit) {
    currentUnit = unit;
    {
      tempUnit.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;
      });
      if (unit == "c") {
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      } else {
        celciusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
      }
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek == unit) {
    hourlyorWeek = unit;
    if (unit == "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}
