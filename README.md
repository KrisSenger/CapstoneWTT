# CapstoneWTT
<ol>
<li>Backend setup instructions for WTT-Web:</li>
<li>In root directory create a requirements.txt file with:</li>
<li>asgiref
Django
django-cors-headers
djangorestframework
djangorestframework-simplejwt
PyJWT
pytz
sqlparse
psycopg2-binary
python-dotenv</li>
<li>Then create a .env file with your database url</li>
<li>Then create a virtual environment with <b>python -m venv env</b></li>
<li>Activate virtual environment script with <b>./env/Scripts/Activate.ps1</b></li>
<li>Next run <b>pip install -r requirements.txt</b></li>
<li>Then change directory to <b>...\WhatTheTruckApp-Web\backend</b></li>
<li>Run <b>pip install dj-database-url</b></li>
<li>Make migrations with <b>python manage.py makemigrations</b></li>
<li>Migrate with <b>python manage.py migrate</b></li>
<li>Create a super user with <b>python manage.py createsuperuser</b></li>
<li>Finally run the backend with <b>python manage.py runserver</b> </li>
</ol>
