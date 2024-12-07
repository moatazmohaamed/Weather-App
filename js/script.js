`use strict`;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const firstSearch = document.getElementById('firstSearch');
const notFound = document.getElementById('notFound');

const weatherPage = document.getElementById('weatherPage');
const weatherImg = document.getElementById('weatherImg');
const countryName = document.getElementById('countryName');
const todaysDate = document.getElementById('todaysDate');

const dayTemp = document.getElementById('dayTemp');

const weatherCondition = document.getElementById('weatherCondition');
const humidtyLevel = document.getElementById('humidtyLevel');
const windSpeed = document.getElementById('windSpeed');

const iceCube = document.getElementById('iceCube');

const nextDayDate = document.getElementById('nextDayDate');
const nextDayWeatherImg = document.getElementById('nextDayWeatherImg');
const nextDayWeatherTemp = document.getElementById('nextDayWeatherTemp');
const nextWeatherInfo = document.getElementById("nextWeatherInfo");

const loader = document.getElementById(`loader`);


searchButton.addEventListener(`click`, () => {
    if (searchInput.value) {
        weatherAPI(searchInput.value);
        getData();
        notFound.classList.add('d-none');
    } else {
        controlPages()
    }
})

searchInput.addEventListener(`keydown`, (e) => {
    if (e.key === `Enter` && searchInput.value) {
        weatherAPI(searchInput.value);
        getData();
        notFound.classList.add('d-none');
    }
});



function currentDate() {
    const date = new Date()

    const dayOfWeek = date.getDay();
    const dayOfWeekName = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri']

    const dayOfMonth = date.getDate();
    const month = date.getMonth();
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentDate = `${dayOfWeekName[dayOfWeek]}, ${dayOfMonth} ${monthNames[month]}`;
    todaysDate.textContent = currentDate;
}

function getData() {
    firstSearch.classList.add(`d-none`);
    weatherPage.classList.remove(`d-none`);
}



async function weatherAPI(location) {
    loader.classList.remove(`d-none`);
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=d0a55d1daf494d01933192553240512&q=${location}&aqi=no&days=4`)
        .then(response => response.json())
        .then(api => {
            loader.classList.add(`d-none`);
            displayWeather(api)
        }).catch(error => {
            console.log(error);
            controlPages();
        });

}

function displayWeather(api) {
    currentDate()

    countryName.textContent = api.location.country + ` Now`;
    dayTemp.textContent = Math.trunc(api.current.temp_c);
    weatherCondition.textContent = api.current.condition.text;
    humidtyLevel.textContent = api.current.humidity + `%`;
    windSpeed.textContent = Math.floor((api.current.wind_mph / 2.237)) + `M/s`;
    weatherImg.src = `${(api.current.condition.icon)}`;

    const filteredForecast = api.forecast.forecastday.filter((_, index) => index !== 0);
    let weather = ``;

    for (const day of filteredForecast) {
        const dateTaken = new Date(day.date);
        const dateOption = {
            day: `2-digit`,
            month: `short`
        }
        const dateResult = dateTaken.toLocaleDateString(`en-US`, dateOption)
        weather += `<div class="col-6">
                <div class="card py-3 text-center text-white d-flex justify-content-center">
                    <span id="nextDayDate" class="fs-5 fw-bold"> ${dateResult}</span>
                        <img id='nextDayWeatherImg' class="m-auto"
                            src="${(day.day.condition.icon)}" width="80" alt="${day.day.condition.text}">
                            <p  class="fw-bold">${day.day.condition.text}°C </p>
                    <p id='nextDayWeatherTemp' class="fw-bold">${Math.trunc(day.day.avgtemp_c)}°C </p>
                </div>
                </div>`
    }
    nextWeatherInfo.innerHTML = weather;

    api.current.condition.text.toLowerCase().includes(`snow`) ? iceCube.classList.remove(`d-none`) : iceCube.classList.add(`d-none`);
}


function controlPages() {
    notFound.classList.remove('d-none');
    firstSearch.classList.add('d-none')
    weatherPage.classList.add('d-none')
}


const userLocation = async () => {
    loader.classList.remove(`d-none`);
    fetch("https://ipinfo.io/json?token=b12c886d90f25c")
        .then(response => response.json())
        .then(data => {
            loader.classList.add(`d-none`);
            const city = data.city;
            weatherAPI(city)
            getData()
        })
        .catch(error => {
            console.error('Error', error);
        });
}

const loc = () => userLocation()

navigator.geolocation.getCurrentPosition(loc)
