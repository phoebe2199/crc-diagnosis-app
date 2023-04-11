# backend/app.py
import os
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from reverseProxy import proxyRequest
from classifier import prepare_predict

MODE = os.getenv('FLASK_ENV')
DEV_SERVER_URL = 'http://localhost:3000/'

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Ignore static folder in development mode.
if MODE == "development":
    app = Flask(__name__, static_folder=None)

@app.route('/')
@app.route('/<path:path>')
def index(path=''):
    if MODE == 'development':
        return proxyRequest(DEV_SERVER_URL, path)
    else:
        return render_template("index.html")


@app.route('/classify', methods=['POST'])
@cross_origin()
def classify():
    if 'image' not in request.files:
        return "Error: No image file provided."
    
    if 'model' not in request.form:
        return "Error: No model selected."
    
    file = request.files['image']
    model = request.form['model']

    if file.filename == '':
        return "Error: No image file selected."

    try:
        return prepare_predict(file, model)
    except Exception as e:
        return f"Error: Could not classify image - {e}"