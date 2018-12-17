Socpred is using node js (express lib) as its server, postgresql as its database and angular 7 as its client

How to run socpred
1. clone the repository
2. npm install
3. copy and paste env.json.example and rename it to env.json
4. edit to your server and database configurations
5. make sure you have installed postgresql
6. make a database "socpred"
7. go to common folder path and run "node migration"
8. go to learning folder path and run "node extraction"
9. go to client folder path and run "npm install"
10. run the server (node app)
11. run the client (ng serve)