from flask import Flask, render_template
import requests


app = Flask(__name__)

world = "https://apiforcorona.herokuapp.com/"
country = "https://apiforcorona.herokuapp.com/country"
state = "https://apiforcorona.herokuapp.com/state"
state_district = "https://apiforcorona.herokuapp.com/state_district"


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/about_us")
def about_us():
    return render_template('about_us.html')


@app.route("/contact_us")
def contact_us():
    return render_template('contact_us.html')


app.run()
