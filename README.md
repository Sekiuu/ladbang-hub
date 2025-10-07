Hello it's my PSCP project

Before start project make sure your create .venv in this directory

- to create .venv you can run this command in terminal : python -m venv .venv
- affter created .venv you must create file .gitignore -> .venv/.gitignore

Then use this comman to install packages for python : pip install -r requirements.txt

To Run Web-app correctly you have to run both "server" and "client"
\*\* To run client, run this command in terminal

- cd client
- npm i
- npm run dev

\*\* To run server, run this command in terminal

- cd server-fastApi
- uvicorn main:app --reload
