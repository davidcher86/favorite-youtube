@ echo off
@ echo --starting server
start /min "" cmd /k "cd server && node server.js"
@ echo --starting client
start /min "New Window" cmd /k "cd favorites && npm start"