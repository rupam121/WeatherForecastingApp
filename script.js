const temp = document.getElementById("temp");
const date = document.getElementById("date-time");

const currentLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIncon = document.getElementById("icon"),
  uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uv-text"),
  windSpeed = document.querySelector(".wind-speed"),
  sunRise = document.querySelector(".sun-rise"),
  sunSet = document.querySelector("uv-index"),
  humidity = document.querySelector("uv-index"),
  visibility = document.querySelector("uv-index"),
  humidityStatus = document.querySelector("uv-index"),
  airQuakity = document.querySelector("uv-index"),
  airQuakirtStatus = document.querySelector("uv-index"),
  visibilityStatus = document.querySelector("uv-index");

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
  return `${dayString},${hour}:${minute}`;
}
Date.innerText = getDateTime();
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
      // getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}
getPublicIp();

//weatherData

function getWeatherData(city, unit, hourlyorWeek) {
  // const apiKey = "EJ6UBL2JEQGYB3AA4ENASN62J";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/odisha?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
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
        // console.log(calciusToFahrenheit(today.temp));
        temp.innerHTML = calciusToFahrenheit(today.temp);
      }
      currentLocation.innerHTML = data.resolvedAddress;
      condition.innerHTML = today.conditions;
      rain.innerHTML = "Perc - " + today.precip + "%";
    });
}

// convert °c to °f
function calciusToFahrenheit(temp) {
  // console.log(temp);
  return (((temp * 9) / 5) * 32).toFixed(1);
}

// kk mm ll
