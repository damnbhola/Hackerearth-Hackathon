from flask import Flask, render_template
import requests


app = Flask(__name__)

world = "https://apiforcorona.herokuapp.com/"
country = "https://apiforcorona.herokuapp.com/country"
state = "https://apiforcorona.herokuapp.com/state"
state_district = "https://apiforcorona.herokuapp.com/state_district"


@app.route("/")
def home():
    world_data = requests.get(world).json()
    country_data = requests.get(country).json()
    state_data = requests.get(state).json()
    world_content = "Country,TotalCases,TotalDeaths,TotalRecovered\n"
    country_content = "Country,Lat,Long,TotalCases,TotalDeaths,TotalRecovered"
    state_content = "Country,Lat,Long,TotalCases,TotalDeaths,TotalRecovered"
    world_content += ",".join([str(j) for j in world_data.values()])
    for i in country_data:
        country_content += "\n"
        country_content += ",".join([str(j) for j in i.values()])
    for i in state_data:
        if '\u016b' in i["id"] or '\u015b' in i["id"] or '\u0141' in i["id"] or '\u0142' in i["id"] or \
                '\u015a' in i["id"] or '\u0144' in i["id"] or '\u0148' in i["id"] or '\u010d' in i["id"] or \
                '\u0151' in i["id"]:
            continue
        state_content += "\n"
        state_content += ",".join([str(j) for j in i.values()])
    with open("static/assets/world_data.csv", "w+") as file:
        file.write(world_content)
    with open("static/assets/country_data.csv", "w+") as file:
        file.write(country_content)
    with open("static/assets/state_data.csv", "w+") as file:
        file.write(state_content)
    return render_template('index.html')


@app.route("/about_us")
def about_us():
    return render_template('about_us.html')


@app.route("/contact_us")
def contact_us():
    return render_template('contact_us.html')
