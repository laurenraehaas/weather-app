let userFormEl = document.querySelector("#user-form")
let cityEl = document.querySelector("#city")
let citySearchResultsEl = document.querySelector("#city-search-results")
let cityListEl = document.querySelector("#city-list")
let clearListEl = document.querySelector("#clear-list")
let todaysWeatherEl = document.querySelector(".todays-weather")
let forecastWeatherEl = document.querySelector(".forecast-weather")
let searchHistory = []

// function for handling form submission
let formSubmitHandler = (event) => {
    event.preventDefault()

    let city = cityEl.value.trim()
    if(city) {
        getCoordinates(city)
        storeSearch(city)
        getHistory()
        cityEl.value = ""
    } else {
        alert("Please enter a city")
    }
}

let getCoordinates = (city) => {
    todaysWeatherEl.textContent = ""
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=3&appid=0a4b31a7ba54f3d1808570e48da57b52"

    fetch(apiUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function(data) {
                getWeather(data[0])
                getForecast(data[0])
            })
        } else {
            console.log('There was an error with the response')
        }
    }).catch(function(error) {
        console.log(error)
    })
}

const getWeather = (location) => {
    let { lat, lon } = location
    
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=0a4b31a7ba54f3d1808570e48da57b52`

    fetch(apiUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            renderToday(data)
        })
}

const forecastWeather = (location) => {
    let { lat, lon } = location

    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=0a4b31a7ba54f3d1808570e48da57b52`

    fetch(apiUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        renderForecastData()
        console.log()
    })
}

const renderToday = (data) => {
    let currentDate = dayjs().format("MMM D, YYYY")
    let cityName = document.createElement("div")
    let temp = document.createElement("div")
    let humidity = document.createElement("div")
    let windSpeed = document.createElement("div")
    let iconId = data.weather[0].icon
    let iconUrl = `http://openweathermap.org/img/w/${iconId}.png`
    let iconIMG = document.createElement("img")


    iconIMG.setAttribute("src", iconUrl)

    cityName.textContent = data.name

    temp.textContent = "TEMP: " + data.main.temp
    humidity.textContent = "Humidity " + data.main.humidity
    windSpeed.textContent = "Wind Speed " + data.wind.speed

    todaysWeatherEl.append(currentDate)
    todaysWeatherEl.append(cityName)
    todaysWeatherEl.append(iconIMG)
    todaysWeatherEl.append(temp)
    todaysWeatherEl.append(humidity)
    todaysWeatherEl.append(windSpeed)
}

const renderForecast = (data) => {
    let forecastArr = data.list
    let dayArr = []
    
    for(let i = 0; i < forecastArr.length; i++) {
        let timeStamp = forecastArr[i].dt
        let hour = dayjs.unix(timeStamp).format("HH")
        let convertedDay = dayjs.unix(timeStamp).format("D")
        let today = dayjs().format("D")
        if(today !== convertedDay && dayArr.length === 0) {
            dayArr.push(forecast[i])
        } else if (hour === "01") {
            dayArr.push(forecastArr[i])
        }
    }
    renderForecastCard(dayArr)
}

const renderForecastCard = (data) => {
    forecastWeatherEl.innerHTML = ""

    data.map((forecast) => {
        let card = document.createElement("div")
        let cardTitle = document.createElement("div")
        let iconId = forecast.weather[0].icon
        let iconUrl = `http://openweathermap.org/img/w/${iconId}.png`
        let iconImg = document.createElement("img")
        let temp = document.createElement("div")
        let wind = document.createElement("div")
        let humidity = document.createElement("div")

        cardTitle.textContent = dayjs.unix(forecast.dt).format("MMM D, YYYY")
        iconImg.setAttribute("src", iconUrl)
        temp.textContent = "Temp: " + forecast.main.temp
        wind.textContent = "Wind: " + forecast.wind.speed
        humidity.textContent = "Humidity: " + forecast.main.humidity

        card.classList.add("forecast-card")

        card.appendChild(cardTitle)
        card.appendChild(iconImg)
        card.appendChild(temp)
        card.appendChild(wind)
        card.appendChild(humidity)
        forecastWeatherEl.appendChild(card)
    })
}

const storeSearch = (input) => {
    searchHistory.push(input)

    localStorage.setItem("search-history", searchHistory)
}

const getHistory = () => {
    cityListEl.textContent = ""

    let storedHistory = localStorage.getItem("search-history")

    if(storedHistory) {
        searchHistory = storedHistory.split(",")
    }
    for(let i = 0; i < searchHistory.length; i++) {
        let citiesEl = document.createElement("button")
        citiesEl.classList.add("btn", "mb-3", "city-buttons")
        citiesEl.textContent = searchHistory[i]
        cityListEl.append(citiesEl)
    }
}

const clearHistoryHandler = () => {
    localStorage.removeItem("search-history")
    searchHistory = []
    cityListEl.textContent = ""
}

getHistory()

userFormEl.addEventListener("submit", formSubmitHandler)
cityListEl.addEventListener("click", (e) => {
    let city = e.target.textContent
    getCoordinates(city)
})
clearListEl.addEventListener("click", clearHistoryHandler)