# Hello it's my PSCP project

## Before start project make sure your create .venv in this directory

- to create .venv you can run this command in terminal : python -m venv .venv
- after created .venv you must create file .gitignore -> .venv/.gitignore

## To install python pakages you have to run .venv first

-> create python file and run it, this will activate .venv automaticly or run command : activate .venv
Then use this comman to install packages for python : pip install -r requirements.txt

\*\* In case "module could not be resolve err"

- ctrol/command + shift + p
- select python interpiter as .venv

## To Run Web-app correctly you have to run both "server" and "client"

\*\* To run client, run this command in terminal

- cd client
- npm i -> in case someone is install more pakages
- npm run dev

\*\* To run server, run this command in terminal

- cd server-fastApi
- uvicorn main:app --reload

## To connect database add DB_URL in .env file

\*\* be carefull we got "devlopment" branch and "public" branch

- for devlopmemnt use "devlopment"

## To Test API in server

- run server and add this in url : http//:{server ip}:8000/docs

## To Create Api or Router in Server

- if your api is works with exited routes. it not nessesery to create new route just add your api in folder /routers/{your_router.py}
- but in case of create new router. create new file.py in path /routers/{your_router.py}
