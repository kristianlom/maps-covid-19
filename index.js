import styles from './styles.js';

const $map = document.querySelector('#map');
const map = new window.google.maps.Map($map, {
  center: {
    lat: 0,
    lng: 0,
  },
  zoom: 3,
  styles
});

renderData();

async function getData() {
  const response = await fetch('https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest');
  const data = await response.json();
  return data;
}

const popup = new window.google.maps.InfoWindow();

function renderExtraData({ confirmed, deaths, recovered, provincestate, countryregion }) {
  return `
    <div>
      <p> <strong> ${provincestate ? provincestate + ' -' : ''} ${countryregion} </strong></p>
      <p> Confirmados: ${confirmed}</p>
      <p> Muertes: ${deaths}</p>
      <p> Recuperados: ${recovered}</p>
    </div>
  `
}

async function renderData() {
  const data = await getData();
  console.log(data)
  data.forEach(item => {
    if (item.confirmed) {
      const marker = new window.google.maps.Marker({
        position: {
          lat: item.location.lat,
          lng: item.location.lng,
        },
        map,
        icon: './radiacion.png'
      });

      marker.addListener('click', function () {
        popup.setContent(renderExtraData(item));
        popup.open(map, marker);
      });
    }
  });
}
