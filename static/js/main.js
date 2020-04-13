let mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let total_cases = [];
let total_state_cases = [];
let cases;
let deaths;
let recovered;
let updated;
let options = {
    lat: 0,
    lng: 0,
    zoom: 2,
    style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
};
let criteria;

function preload() {
    world_data = loadTable('static/assets/world_data.csv', 'header');
    country_data = loadTable('static/assets/country_data.csv', 'header');
    state_data = loadTable('static/assets/state_data.csv', 'header');
}

function setup() {
    w = windowWidth * 0.99;
    h = windowHeight * 0.98;
    if (h > w){
        h = w * 0.9;
        w = w * 0.98;
        options = {
          lat: 0,
          lng: 0,
          zoom: 1,
          style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        };
    }
    let canvas = createCanvas(w, h*0.60);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
    background(50);
    let maxCases = 0;
    let maxStateCases = 0;
    let minCases = Infinity;
    let minStateCases = Infinity;
    for (let row of country_data.rows){
        let country = row.get('Country').toLowerCase();
        let totalCases = Number(row.get('TotalCases'));
        let totalDeaths = Number(row.get('TotalDeaths'));
        let totalRecovered = Number(row.get('TotalRecovered'));
        let lat = row.get('Lat');
        let lon = row.get('Long');
        total_cases.push({
            lat,
            lon,
            totalCases,
            totalDeaths,
            totalRecovered,
        });
        if (totalCases > maxCases){
            maxCases = totalCases;
        }
        if (totalCases < minCases){
            minCases = totalCases;
        }
    }
    for (let row of state_data.rows){
        let country = row.get('Country').toLowerCase();
        let totalCases = Number(row.get('TotalCases'));
        let totalDeaths = Number(row.get('TotalDeaths'));
        let totalRecovered = Number(row.get('TotalRecovered'));
        let lat = row.get('Lat');
        let lon = row.get('Long');
        total_state_cases.push({
            lat,
            lon,
            totalCases,
            totalDeaths,
            totalRecovered,
        });
        if (totalCases > maxStateCases){
            maxStateCases = totalCases;
        }
        if (totalCases < minStateCases){
            minStateCases = totalCases;
        }
    }
    for (let row of world_data.rows){
        cases = Number(row.get('TotalCases'));
        deaths = Number(row.get('TotalDeaths'));
        recovered = Number(row.get('TotalRecovered'));
    }
    let minCasesDiameter = sqrt(minCases);
    let maxCasesDiameter = sqrt(maxCases);
    let minStateCasesDiameter = sqrt(minStateCases);
    let maxStateCasesDiameter = sqrt(maxStateCases);
    for (let country of total_cases){
        country.Diameter1 = 0.1 * map(sqrt(country.totalCases), minCasesDiameter, maxCasesDiameter, 1, 1000);
    }
    for (let country of total_state_cases){
        country.Diameter1 = 0.02 * map(sqrt(country.totalCases), minStateCasesDiameter, maxStateCasesDiameter, 1, 1000);
    }
    fill(90, 90, 90);
    criteria = total_cases;
//    fill(200, 0, 0);
    h1 = createElement("span", "Total Cases " + cases + ", Total Deaths " + deaths + ", Total Recovered " + recovered + ".");
    p = createP();
}

function draw() {
    clear();
    for (let country of criteria){
        const coordinate = myMap.latLngToPixel(country.lat, country.lon);
        const zoom = myMap.zoom();
        const scale = pow(1.3, zoom) * sin(frameCount * 0.02);
        ellipse(coordinate.x, coordinate.y, country.Diameter1 * scale);
    }
}

function change(z){
    if (z == "c"){
        criteria = total_cases;
    }
    else if (z == "s"){
        criteria = total_state_cases;
    }
}