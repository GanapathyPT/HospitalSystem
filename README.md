# Hospital Management System

## Requirements
make sure python and pip is installed
```bash
python --version
Python 3.6.9
pip --version
pip 20.3.3
```
if you are on linux, use python as python3 and pip as pip3 <br />
also make sure node is installed
```bash	
node --version
v14.15.0
```
## Running
clone the repo and change the directory
```bash
git clone https://github.com/GanapathyPT/HospitalSystem.git
cd HospitalSystem
```
install the required packages
```bash
pip install -r requirements.txt
cd frontend
npm i
```
make sure you are back to the directory where the manage.py file is there and run the server
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
open your browser and visit <br />
**URL: http://localhost:8000*