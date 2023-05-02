# Colorectal Cancer Diagnosis App

This Flask-React app can be used to diagnose colorectal cancer from histopathology images. It implements the following convolutional neural networks to return a tissue classification that is summarised as cancerous or non-cancerous:
* VGG16 trained from scratch
* VGG16 pre-trained
* ResNet50 trained from scratch
* ResNet50 pre-trained
* InceptionV3 trained from scratch
* InceptionV3 pre-trained

## Setup and installation
To get started, you will need to have the following tools installed on your machine:
* [Node.js](https://nodejs.org/en/download)
* [Python](https://www.python.org/downloads/)

Once you have those tools installed, you can clone the repository to your local machine using the following command:

`git clone https://github.com/your-username/crc-diagnosis-app.git`

Next, navigate to the cloned repository directory and install the necessary dependencies by running the following commands:

`npm install`

`npm run install:backend`

`pip install -r requirements.txt`

## Usage
To start the app, you can use the following command:

`npm run start:server-dev`

This will start both the front-end and back-end servers, and you should see the app running at http://localhost:3000 in your browser.

## Models
Note that in order for the classifier component to work correctly, you will also need to download the model files from this [SharePoint link](https://universityofexeteruk-my.sharepoint.com/:u:/g/personal/pa354_exeter_ac_uk/EbiINB849llNt8rM_Dv1husBwPBUp7tMqDo68_yOqyDXMA?e=jTxwed). Once you have downloaded the models, you should add the paths to the `address_lookup` dictionary in `crc-diagnosis-app/backend/classifier.py`.


### Precautions
As this is a medical application that deals with potentially sensitive data, it is important to take appropriate precautions when using it. Here are some general guidelines to follow:

* Do not use the application to diagnose medical conditions without consulting a qualified medical professional.
* Do not upload any images containing personally identifiable information.
