import flask
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home1():
    return render_template("home1.html")

app.run()