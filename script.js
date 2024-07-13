const cityId = 487928;
const apiKey = "95f60763b8981ab884b68a9960af89e1";
const cityName = "Старый Оскол";

const weatherTranslations = {
  "clear sky": "Ясно",
  "few clouds": "Небольшая облачность",
  "scattered clouds": "Рассеянные облака",
  "broken clouds": "Облачно с прояснениями",
  "shower rain": "Ливень",
  "rain": "Дождь",
  "thunderstorm": "Гроза",
  "snow": "Снег",
  "mist": "Туман",
  "thunderstorm with light rain": "Гроза с небольшим дождем",
  "thunderstorm with heavy rain": "Гроза с проливным дождем",
  "light thunderstorm": "Слабая гроза",
  "heavy thunderstorm": "Сильная гроза",
  "ragged thunderstorm": "Рваная гроза",
  "thunderstorm with light drizzle": "Гроза с легким моросящим дождем",
  "thunderstorm with heavy drizzle": "Гроза с моросящим дождем",
  "thunderstorm with heavy drizzling rain": "Гроза с сильным моросящим дождем",
  "light intensity drizzle rain": "Легкий моросящий дождь",
  "drizzle": "Моросящий дождь",
  "heavy intensity drizzle rain": "Сильный моросящий дождь",
  "drizzle rain": "Мелкий дождь",
  "heavy shower rain and drizzle": "Сильный ливень с моросью",
  "shower drizzle": "Моросящий ливень",
  "light rain": "Небольшой дождь",
  "moderate rain": "Умеренный дождь",
  "heavy intensity rain": "Сильный дождь",
  "very heavy rain": "Очень сильный дождь",
  "extreme rain": "Экстремальный дождь",
  "freezing rain": "Ледяной дождь",
  "light intensity shower rain": "Слабый ливень",
  "heavy intensity shower rain": "Сильный ливень",
  "ragged shower rain": "Рваный ливень",
  "light snow": "Небольшой снег",
  "heavy snow": "Сильный снег",
  "sleet": "Мокрый снег",
  "light shower sleet": "Небольшой мокрый снег",
  "shower sleet": "Мокрый снег",
  "light rain and snow": "Небольшой дождь со снегом",
  "rain and snow": "Дождь со снегом",
  "light shower snow": "Небольшой снежный ливень",
  "shower snow": "Снежный ливень",
  "heavy shower snow": "Сильный снежный ливень",
  "smoke": "Дым",
  "haze": "Смог",
  "sand/dust whirls": "Пыльные вихри",
  "fog": "Туман",
  "sand": "Песок",
  "dust": "Пыль",
  "volcanic ash": "Вулканический пепел",
  "squalls": "Шквал",
  "tornado": "Торнадо",
  "overcast clouds": "Пасмурно",
};

// Получение данных о погоде по часам
const getHourlyForecast = () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  );
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.response);
      displayHourlyForecast(data);
      displayWeeklyForecast(data);
    } else {
      console.error("Ошибка получения данных о погоде");
    }
  };
  xhr.send();
};

const displayHourlyForecast = (data) => {
  const hourlyForecastContainer = document.getElementById("hourly-forecast");
  const forecastButtonsContainer = hourlyForecastContainer.querySelector(".forecast-buttons");
  forecastButtonsContainer.innerHTML = "";

  const hourlyData = data.list.filter(
    (item) => new Date(item.dt * 1000).getHours() >= new Date().getHours() - 1
  );

  let prevHour = new Date().getHours() - 1;
  let currentInfoContainer = null;

  // Прячем все блоки с информацией перед добавлением новых
  document.querySelectorAll('.forecast-info').forEach((infoContainer) => {
    infoContainer.style.display = "none";
  });

  hourlyData.forEach((item, index) => {
    const date = new Date(item.dt * 1000);
    let hours = (prevHour + index) % 24; // Переход к следующему часу после 23
    let minutes = date.getMinutes().toString().padStart(2, "0");

    // Условие для добавления 30 минут
    if (date.getMinutes() >= 30) {
      minutes = "30";
    }

    const time = `${hours}:${minutes}`;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("forecast-info");
    infoContainer.style.display = "none"; // Изначально скрываем блок с информацией

    const button = document.createElement("button");
    button.textContent = time;
    button.classList.add("card-title", "forecast-button");

    button.addEventListener("click", () => {
      // Здесь находим соответствующие элементы по id
      const weatherTranslationsElement = document.getElementById("weatherTranslations");
      const tempElement = document.getElementById("temp");
      const humidityElement = document.getElementById("humidity");

      // Скрытие предыдущей информации
      if (currentInfoContainer) {
        currentInfoContainer.style.display = "none";
      }
      // Отображение текущей информации
      infoContainer.style.display = "block";
      currentInfoContainer = infoContainer;

      // Здесь добавляем информацию в соответствующие элементы
      weatherTranslationsElement.innerText = `Погода: ${weatherTranslations[item.weather[0].description]}`;
      tempElement.innerText = `Температура: ${Math.round(item.main.temp)}°C`;
      humidityElement.innerText = `Влажность: ${item.main.humidity}%`;
    });

    // Сначала добавляем кнопку, а потом блок с информацией
    forecastButtonsContainer.appendChild(button); 
  });
};





const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const displayWeeklyForecast = (data) => {
  const weeklyForecastList = document.getElementById("weekly-forecast-list");

  const weeklyData = data.list.filter(
    (item) => new Date(item.dt * 1000).getHours() === 12
  );

  weeklyData.slice(0, 7).forEach((item) => {
    const date = new Date(item.dt * 1000);
    let dayOfWeek = date.toLocaleDateString('ru-RU', { weekday: 'long' });
    dayOfWeek = capitalizeFirstLetter(dayOfWeek); // Преобразование первой буквы в заглавную

    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.innerHTML = `
      <h4>${dayOfWeek}</h4>
      <h6>${weatherTranslations[item.weather[0].description]}</h6>
      <h6>Температура: ${Math.round(item.main.temp)}°C</h6>
    `;

    weeklyForecastList.appendChild(listItem);
  });
};

const currentTime = new Date().getHours();

if (currentTime >= 6 && currentTime < 18) {
  document.body.classList.remove("night");
  document.body.classList.add("morning");
  document.querySelector("h2").classList.remove("night");
  document.querySelector("h2").classList.add("morning");
  document.querySelector("h1").classList.remove("night");
  document.querySelector("h1").classList.add("morning");
} else {
  document.body.classList.remove("morning");
  document.body.classList.add("night");
  document.querySelector("h2").classList.remove("morning");
  document.querySelector("h2").classList.add("night");
  document.querySelector("h1").classList.remove("morning");
  document.querySelector("h1").classList.add("night");
}


// Вызов функции для получения данных о погоде
getHourlyForecast();