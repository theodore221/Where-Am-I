'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//Gets current device position through Geolocation API
const getPosition = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      function (position) {
        whereAmI(position.coords.latitude, position.coords.longitude);
      },
      function () {
        alert('nothing is happening');
      }
    );
};

//RenderError
const renderError = function (errMsg) {
  countriesContainer.insertAdjacentText('beforeend', errMsg);
};

//Render Country
const renderCountry = function (data, className = '') {
  let html = `
      <article class="country ${className}">
      <img class="country__img" src="${Object.values(data[29][1])[0]}" />
      <div class="country__data">
        <h3 class="country__name">${Object.values(data[0][1])[0]}</h3>
        <h4 class="country__region">${data[13][1]}</h4>
        <p class="country__row"><span>🏛</span>${data[11][1][0]}</p>
        <p class="country__row"><span>👫</span>${(
          +data[23][1] / 1000000
        ).toFixed(1)} million people</p>
        <p class="country__row"><span>📢</span>${Object.values(data[15][1])}</p>
        <p class="country__row"><span>💰</span>${
          Object.values(Object.values(data[9][1])[0])[0]
        }</p>
      </div>
      </article>
      `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const whereAmI = function (lat, long) {
  fetch(
    `https://geocode.xyz/${lat},${long}?json=1&auth=596579378920251792959x51989`
  )
    .then(response => {
      if (!response.ok)
        throw new Error(`Too many requests, (${response.status})`);
      return response.json();
    })
    .then(data => {
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(response => response.json())
    .then(data => {
      console.log(data[0]);
      console.log(Object.entries(data[0]));
      renderCountry(Object.entries(data[0]));
    })
    .catch(err => renderError(err.message))
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', function () {
  getPosition();
});
