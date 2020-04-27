let mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let total_cases = [];
let total_state_cases = [];
let total_state_district_cases = [];
let global, cases, deaths, recovered;
let options = {
    lat: 0,
    lng: 0,
    zoom: 2,
    style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
};
let criteria = "country";

function preload() {
    world_data = loadJSON('https://apiforcorona.herokuapp.com/', getData);
    country_data = loadJSON('https://apiforcorona.herokuapp.com/country', getData);
    state_data = loadJSON('https://apiforcorona.herokuapp.com/state', getData);
    state_district_data = loadJSON('https://apiforcorona.herokuapp.com/state_district', getData);
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
    global = world_data.id;
    cases = world_data.totalConfirmed;
    deaths = world_data.totalDeaths;
    recovered = world_data.totalRecovered;
    let maxCases = 0;
    let maxStateCases = 0;
    let minCases = Infinity;
    let minStateCases = Infinity;
    for (let row in country_data){
        let country = country_data[row].id;
        let totalCases = Number(country_data[row].totalConfirmed);
        let totalDeaths = Number(country_data[row].totalDeaths);
        let totalRecovered = Number(country_data[row].totalRecovered);
        let lat = country_data[row].lat;
        let lon = country_data[row].long;
        total_cases.push({
            country,
            lat,
            lon,
            totalCases,
            totalDeaths,
            totalRecovered
        });
        if (totalCases > maxCases){
            maxCases = totalCases;
        }
        if (totalCases < minCases){
            minCases = totalCases;
        }
    }
    for (let row in state_data){
        let country = state_data[row].id;
        let totalCases = Number(state_data[row].totalConfirmed);
        let totalDeaths = Number(state_data[row].totalDeaths);
        let totalRecovered = Number(state_data[row].totalRecovered);
        let lat = state_data[row].lat;
        let lon = state_data[row].long;
        total_state_cases.push({
            country,
            lat,
            lon,
            totalCases,
            totalDeaths,
            totalRecovered
        });
        if (totalCases > maxStateCases){
            maxStateCases = totalCases;
        }
        if (totalCases < minStateCases){
            minStateCases = totalCases;
        }
    }
    let minCasesDiameter = sqrt(minCases);
    let maxCasesDiameter = sqrt(maxCases);
    let minStateCasesDiameter = 0;
    let maxStateCasesDiameter = sqrt(maxStateCases);
    for (let country of total_cases){
        country.Diameter = 0.095 * map(sqrt(country.totalCases), minCasesDiameter, maxCasesDiameter, 0, 1000);
    }
    for (let state of total_state_cases){
        state.Diameter = 0.03 * map(sqrt(state.totalCases), minStateCasesDiameter, maxStateCasesDiameter, 0, 1000);
    }
    fill(200, 0, 0);
    h1 = createElement("span", "Total " + global + " Cases " + cases + ", Total Deaths " + deaths + ", Total Recovered " + recovered + ".");
    p = createP();
}

function draw() {
    clear();
    if (criteria == "country"){
        for (let country of total_cases){
            const coordinate = myMap.latLngToPixel(country.lat, country.lon);
            const zoom = myMap.zoom();
            const scale = pow(1.3, zoom) * sin(frameCount * 0.023);
            ellipse(coordinate.x, coordinate.y, country.Diameter * scale);
        }
    }
    if (criteria == "state"){
        for (let state of total_state_cases){
            const coordinate = myMap.latLngToPixel(state.lat, state.lon);
            const zoom = myMap.zoom();
            const scale = pow(1.3, zoom) * sin(frameCount * 0.02);
            ellipse(coordinate.x, coordinate.y, state.Diameter * scale);
        }
    }
}

function change(z){
    if (z == "c"){
        criteria = "country";
    }
    else if (z == "s"){
        criteria = "state";
    }
}

function getData(data){
    return data;
}