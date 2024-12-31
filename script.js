let cityName = document.querySelector(".weather_city");
let dateTime = document.querySelector(".weather_date_time");
let w_forecast = document.querySelector(".weather_forcast");
let w_icon = document.querySelector(".weather_icon");
let w_temperature = document.querySelector(".weather_temperature");
let w_minTem = document.querySelector(".weather_min");
let w_maxTem = document.querySelector(".weather_max");
let w_feels = document.querySelector(".weather_feelsLike");
let w_humidity = document.querySelector(".weather_humidity");
let w_wind = document.querySelector(".weather_wind");
let w_pressure = document.querySelector(".weather_pressure");
let citySearch = document.querySelector(".weather_search");
let forecastContainer = document.querySelector(".forecast_container");
// const citySearch = document.querySelector(".weather_search");
const recentCitiesContainer = document.querySelector(
  ".recent_cities_container"
);
const recentCitiesDropdown = document.querySelector(".recent_cities_dropdown");

// to get the actual country name
const getCountryName = (code) => {
  return new Intl.DisplayNames(["en"], {
    type: "region",
  }).of(code);
};

// to get the date and time
const getDateTime = (dt) => {
  const currDate = new Date(dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(currDate);
};

// Function to fetch weather data
const getWeatherData = async (city) => {
  const apiKey = "717b8e519b16228114e22b17b06d9589"; // Replace with your API key
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();

    if (data.cod === "404") {
      cityName.innerHTML = "City not found!";
      dateTime.innerHTML = "";
      w_forecast.innerHTML = "";
      w_icon.innerHTML = "";
      w_temperature.innerHTML = "";
      w_maxTem.innerHTML = "";
      w_minTem.innerHTML = "";
      w_feels.innerHTML = "";
      w_humidity.innerHTML = "";
      w_wind.innerHTML = "";
      w_pressure.innerHTML = "";
      return;
    }

    const { main, name, weather, wind, sys, dt } = data;

    // city & country name
    cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
    // date & time
    dateTime.innerHTML = getDateTime(dt);
    // weather forecast
    w_forecast.innerHTML = weather[0].main;
    // weather icon
    w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;
    // weather temperature
    w_temperature.innerHTML = `${main.temp.toFixed()}&#176;C`;
    // temp_max
    w_maxTem.innerHTML = `Max: ${main.temp_max.toFixed()}&#176;C`;
    // temp_min
    w_minTem.innerHTML = `Min: ${main.temp_min.toFixed()}&#176;C`;
    // feels like
    w_feels.innerHTML = `Feels like: ${main.feels_like.toFixed()}&#176;C`;
    // humidity
    w_humidity.innerHTML = `Humidity: ${main.humidity}%`;
    // wind
    w_wind.innerHTML = `Wind: ${wind.speed} m/s`;
    // pressure
    w_pressure.innerHTML = `Pressure: ${main.pressure} hPa`;
  } catch (error) {
    console.log("Error fetching weather data:", error);
    cityName.innerHTML = "Unable to fetch data!";
  }
};

// Event listener for search form
citySearch.addEventListener("submit", (e) => {
  e.preventDefault();

  const cityInput = document.querySelector(".city_name");
  const city = cityInput.value.trim();

  if (city) {
    getWeatherData(city);
    cityInput.value = ""; // Clear the input box
  } else {
    cityName.innerHTML = "Please enter a city name!";
  }
});

// Initial data for default city
window.addEventListener("load", () => {
  getWeatherData("Jamshedpur"); // Replace with your desired default city
});

// 333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333

// Function to fetch 5-day forecast data
const get5DayForecast = async (city) => {
  const apiKey = "717b8e519b16228114e22b17b06d9589"; // Replace with your API key
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const res = await fetch(forecastUrl);
    const data = await res.json();

    if (data.cod === "404") {
      forecastContainer.innerHTML = "<p>City not found!</p>";
      return;
    }

    const forecastList = data.list;
    const dailyForecasts = {};

    // Extract data for each day
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Render 5-day forecast
    renderForecast(Object.values(dailyForecasts).slice(0, 5));
  } catch (error) {
    console.log("Error fetching forecast data:", error);
    forecastContainer.innerHTML = "<p>Unable to fetch forecast data!</p>";
  }
};

// Render forecast data into HTML
const renderForecast = (forecasts) => {
  forecastContainer.innerHTML = ""; // Clear previous forecasts
  forecasts.forEach((day) => {
    const date = new Date(day[0].dt * 1000).toDateString();
    const { temp_min, temp_max } = day.reduce(
      (temps, curr) => {
        temps.temp_min = Math.min(temps.temp_min, curr.main.temp_min);
        temps.temp_max = Math.max(temps.temp_max, curr.main.temp_max);
        return temps;
      },
      { temp_min: Infinity, temp_max: -Infinity }
    );
    const icon = day[0].weather[0].icon;
    const description = day[0].weather[0].description;

    forecastContainer.innerHTML += `
        <div class="forecast_card">
          <p class="forecast_date">${date}</p>
          <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" />
          <p class="forecast_temp">Min: ${temp_min.toFixed()}&#176;C, </br> Max: ${temp_max.toFixed()}&#176;C</p>
          <p class="forecast_desc">${description}</p>
        </div>
      `;
  });
};

// Update both current weather and forecast
const updateWeatherAndForecast = (city) => {
  getWeatherData(city);
  get5DayForecast(city);
};

// Modify event listener for the search form
citySearch.addEventListener("submit", (e) => {
  e.preventDefault();

  const cityInput = document.querySelector(".city_name");
  const city = cityInput.value.trim();

  if (city) {
    updateWeatherAndForecast(city);
    cityInput.value = ""; // Clear the input box
  } else {
    cityName.innerHTML = "Please enter a city name!";
  }
});

// Update both weather and forecast on page load
window.addEventListener("load", () => {
  const defaultCity = "Jamshedpur"; // Replace with your default city
  updateWeatherAndForecast(defaultCity);
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// Function to get weather for the current location
const getWeatherForCurrentLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch city name using OpenWeather reverse geocoding API
        const apiKey = "717b8e519b16228114e22b17b06d9589"; // Replace with your API key
        const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

        try {
          const geoRes = await fetch(reverseGeoUrl);
          const geoData = await geoRes.json();

          if (geoData && geoData.length > 0) {
            const city = geoData[0].name;

            // Fetch weather and forecast data for the current city
            getWeatherData(city);
            get5DayForecast(city);
          } else {
            cityName.innerHTML = "Location not found!";
          }
        } catch (error) {
          console.log("Error fetching location data:", error);
          cityName.innerHTML = "Unable to fetch location data!";
        }
      },
      (error) => {
        console.log("Geolocation error:", error);
        cityName.innerHTML = "Geolocation not allowed or unavailable!";
      }
    );
  } else {
    cityName.innerHTML = "Geolocation not supported by your browser!";
  }
};

// Add event listener for the "Current Location" button
const currentLocationButton = document.querySelector(".current_location");
currentLocationButton.addEventListener("click", () => {
  getWeatherForCurrentLocation();
});

// ###############################################################################

// ###############################################################################

// // Key for local storage
// const RECENT_CITIES_KEY = "recentCities";

// // Function to update recent cities dropdown
// const updateRecentCitiesDropdown = () => {
//   const recentCities =
//     JSON.parse(localStorage.getItem(RECENT_CITIES_KEY)) || [];

//   // Clear existing options
//   recentCitiesDropdown.innerHTML =
//     '<option value="" disabled selected>Recently Searched</option>';

//   // Add each city as an option
//   recentCities.forEach((city) => {
//     const option = document.createElement("option");
//     option.value = city;
//     option.textContent = city;
//     recentCitiesDropdown.appendChild(option);
//   });

//   // Show or hide dropdown based on availability
//   recentCitiesContainer.style.display =
//     recentCities.length > 0 ? "block" : "none";
// };

// // Function to save city in local storage
// const saveCityToLocalStorage = (city) => {
//   let recentCities = JSON.parse(localStorage.getItem(RECENT_CITIES_KEY)) || [];

//   // Avoid duplicates and limit to 5 cities
//   recentCities = [city, ...recentCities.filter((c) => c !== city)].slice(0, 5);

//   localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recentCities));

//   // Update dropdown menu
//   updateRecentCitiesDropdown();
// };

// // Event listener for dropdown selection
// recentCitiesDropdown.addEventListener("change", (event) => {
//   const selectedCity = event.target.value;

//   if (selectedCity) {
//     getWeatherData(selectedCity); // Fetch weather data for selected city
//     get5DayForecast(selectedCity); // Fetch 5-day forecast for selected city
//   }
// });

// // Update the city search event listener to save cities
// citySearch.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const cityInput = document.querySelector(".city_name");
//   const city = cityInput.value.trim();

//   if (city) {
//     getWeatherData(city);
//     get5DayForecast(city);

//     // Save the city to local storage
//     saveCityToLocalStorage(city);

//     cityInput.value = ""; // Clear the input box
//   } else {
//     cityName.innerHTML = "Please enter a city name!";
//   }
// });

// // Load recent cities on page load
// window.addEventListener("load", () => {
//   updateRecentCitiesDropdown(); // Initialize dropdown with saved cities
//   getWeatherData("Jamshedpur"); // Replace with your desired default city
// });
