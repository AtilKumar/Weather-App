const locationCnt = document.querySelector("#location-container")
const loadingCnt = document.querySelector("#loading-container")
const mainCnt = document.querySelector("#main-container");
const searchCnt = document.querySelector("#search-container");
const activeCnt = document.querySelector("#active")
const inactiveCnt = document.querySelector("#inactive")
const notFoundCnt = document.querySelector("#not-found-container")

const urWeatherBtn = document.querySelector(".your-weather")
const searchWeatherBtn = document.querySelector(".search-weather")

// _____________________button background logic

urWeatherBtn.classList.add("on-click-styling")

// _____________________location access logic

const localCoordinates =  sessionStorage.getItem("userCoordinates");
getFromSessionStorage();
function getFromSessionStorage(){
    if(!localCoordinates){
        locationCnt.setAttribute("id", "active")
    }else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

// ____________________calling API after location access clicking

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates
    locationCnt.setAttribute("id", "inactive")
    loadingCnt.setAttribute("id", "active")
    try{
        const response = await fetch(
            // `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=d4a79d3c8130df1bfca65000d5e07232`
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=fcc8de7015bbb202209bbf0261babf4c&units=metric`
            //https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        )
        const data = await response.json()
        loadingCnt.setAttribute("id", "inactive")
        mainCnt.setAttribute("id", "active");
        renderWeatherInfo(data)
    }

    catch(err){
        loadingCnt.setAttribute("id", "inactive")
        notFoundCnt.setAttribute("id", "active")
    }
}

// ____________________rendering the weather info after getting data from either magnifier or grant access

function renderWeatherInfo(weatherInfo){
    if(weatherInfo?.cod === '404'){
            notFoundCnt.setAttribute("id", "active")
            loadingCnt.setAttribute("id", "inactive")
            mainCnt.setAttribute("id", "inactive");
    }
    else{
        const city = document.querySelector(".place-name")
        const countryflag = document.querySelector(".flag")
        const description = document.querySelector(".weather-condition")
        const weatherImg = document.querySelector(".weather-image")
        const temp = document.querySelector(".temperature")
        const windDesc = document.querySelector(".wind-speed")
        const humdityDesc = document.querySelector(".humidity")
        const cloudDesc = document.querySelector(".clouds")
    
        city.innerText = weatherInfo?.name;
        countryflag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        description.innerText = weatherInfo?.weather?.[0]?.description;
        weatherImg.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = weatherInfo?.main?.temp; 
        windDesc.innerText = weatherInfo?.wind?.speed;
        humdityDesc.innerText = weatherInfo?.main?.humidity;
        cloudDesc.innerText = weatherInfo?.clouds?.all
    }

}

// _____________________grant access button

const locationAccessBtn = document.querySelector(".location-button")
getFromSessionStorage()

locationAccessBtn.addEventListener("click", getLocation)
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
        alert("your system does not support GeoLocation")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

// _________________magnifier button logic

let inputCity = document.querySelector(".city-input")
const searchBtn = document.querySelector(".magnifier")

searchBtn.addEventListener("click", function(){ 
    let cityName = inputCity.value;
    console.log(cityName)
    if(cityName === ""){
        return
    }else{
        fetchSearchWeatherInfo(cityName)
    }
})

// ____________________calling API when magnifier button is clicked

async function fetchSearchWeatherInfo(city){
    locationCnt.setAttribute("id", "inactive")
    mainCnt.setAttribute("id", "inactive");
    searchCnt.setAttribute("id", "inactive");
    loadingCnt.setAttribute("id", "active")

    try{
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=fcc8de7015bbb202209bbf0261babf4c&units=metric`
        )
            const data = await response.json()
            loadingCnt.setAttribute("id", "inactive")
            mainCnt.setAttribute("id", "active");
            renderWeatherInfo(data);
    }catch(e){
        notFoundCnt.setAttribute("id", "active")
        loadingCnt.setAttribute("id", "inactive")
    }

}

// _____________________tab switching logic

urWeatherBtn.addEventListener("click", function(){
    if(localCoordinates){ //if local coordinates are already present 
        mainCnt.setAttribute("id", "active");
    }else{
        locationCnt.setAttribute("id", "active")
        mainCnt.setAttribute("id", "inactive");
    }
    searchCnt.setAttribute("id", "inactive");
    notFoundCnt.setAttribute("id", "inactive")

    urWeatherBtn.classList.add("on-click-styling")
    searchWeatherBtn.classList.remove("on-click-styling")
})
searchWeatherBtn.addEventListener("click", function(){
    searchCnt.setAttribute("id", "active");
    mainCnt.setAttribute("id", "inactive");
    locationCnt.setAttribute("id", "inactive")
    notFoundCnt.setAttribute("id", "inactive")
    
    searchWeatherBtn.classList.add("on-click-styling")
    urWeatherBtn.classList.remove("on-click-styling")
})


