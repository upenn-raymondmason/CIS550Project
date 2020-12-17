# CIS550Project - Golazo!

## Extra Credit

Three EC points to implement for 10% bonus. 

* Deployment on Heroku
* NoSQL MongoDB to store favourite players and teams of users
* User Login Experience (Google, Facebook, Custom Sign-in using Amazon Cognito)

## To run the application locally:

* cd into client directory and run the command npm install or yarn. Then cd into server directory and run the command npm install or yarn. This will install all the necessary packages apart from oracledb (due to deployment on Heroku could not simply add to dependencies in package.json)
* To install oracledb, ensure you are in the server directory and type yarn add oracledb or npm install oracledb in the CLI. Furthermore, to install and use oracledb locally you will have to ensure that Oracle is installed as a client library and you correctly set the path (please follow the steps here https://oracle.github.io/node-oracledb/INSTALL.html#quickstart)
* To run the application open up two CLIs, in the first cd into server and call node server.js. In the second, cd into the client directory and call yarn start.
* You should now be able to access the website under the address http://localhost:3030 with the server running on http://localhost:8080. 

## Check out online deployed version at https://golazo-client.herokuapp.com/