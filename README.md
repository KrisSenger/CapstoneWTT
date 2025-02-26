# CapstoneWTT
Backend setup instructions for WTT-Web:
In root directory create a requirements.txt file with:
asgiref
Django
django-cors-headers
djangorestframework
djangorestframework-simplejwt
PyJWT
pytz
sqlparse
psycopg2-binary
python-dotenv
Then create a .env file with your database url
To run the database install PostgresSQL
Add postgres to system path variable
Then create database by running <b>psql -U postgres</b> in commandline then create the database with <b>CREATE DATABASE wttdb;</b>
Then create a virtual environment with <b>python -m venv env</b>
Activate virtual environment script with <b>./env/Scripts/Activate.ps1</b>
Next run <b>pip install -r requirements.txt</b>
Then change directory to <b>...\WhatTheTruckApp-Web\backend</b>
Run <b>pip install dj-database-url</b>
Make migrations with <b>python manage.py makemigrations</b>
Migrate with <b>python manage.py migrate</b>
Create a super user with <b>python manage.py createsuperuser</b>
Finally run the backend with <b>python manage.py runserver</b> 
