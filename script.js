let moon=document.getElementById('moon');
let stars=document.getElementById('stars');
let mountains_behind=document.getElementById('mountains_behind');
let mountains_front=document.getElementById('mountains_front');
let text=document.getElementById('text');
let btn=document.getElementById('btn');
let header= document.querySelector('header');
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const Lati = document.getElementById('latitude');
const Long = document.getElementById('longitude');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const nextEl = document.getElementById('next');
const api = {  base: "https://api.openweathermap.org/data/2.5/"  }
/*const API_KEY ='fce750fc80617f48636d7ea683a17daa';*/
const API_KEY ='dab3af44de7d24ae7ff86549334e45bd';

window.addEventListener('scroll',function()
{
let value = window.scrollY;
stars.style.left = value * 2.5 + 'px';
moon.style.top = value * 1.5 + 'px';
mountains_behind.style.top = value * 0.5 + 'px';
mountains_front.style.top = value * 0 + 'px';
text.style.marginRight = value * 4 + 'px';
text.style.marginTop = value * 1.5 + 'px';
btn.style.marginTop = value * 1.5 + 'px';
header.style.top = value * 0.5 * 'px';
})


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


setInterval(() => 
{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);


const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);


function setQuery(evt) {

    if (evt.keyCode == 13) {
    getResults(searchbox.value);
    document.querySelector('.current-info').style.display="flex";
    document.querySelector('.future-forecast').style.display="flex";
    document.querySelector('.h1').style.display="flex";
  }
}


function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${API_KEY}`).then(weather => {
      return weather.json();
    }).then(displayResults);
}

function displayResults (weather){
    Lati.innerHTML=`<div>Lat: ${weather.coord.lat}<div/>`;
    Long.innerHTML=`<div>Lon: ${weather.coord.lon}<div/>`;
    l=`${weather.coord.lat}`
    l1=`${weather.coord.lon}`
    timezone.innerHTML = `${weather.name}, ${weather.sys.country}`;
    WeatherData()

    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoYXlwcmF0YXAiLCJhIjoiY2t6ODk0dmQ4MHRudTJ2bng4bDB0cHF4byJ9.pnSyeL23b0y4nbUsfmdoEw';
    setupmap([l1,l])
 
    function setupmap(center){
         var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center:center,
        zoom:8
        });
    }     
}


function WeatherData () {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${l}&lon=${l1}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(data => {
    return data.json();
    }).then(showWeatherData)
}


function showWeatherData (data){
    let {humidity,pressure, sunrise, sunset, wind_speed} = data.current;

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div> 
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForcast;
}