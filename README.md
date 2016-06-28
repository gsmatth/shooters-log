[![Stories in Ready](https://badge.waffle.io/gsmatth/shooters-log.png?label=ready&title=Ready)](https://waffle.io/gsmatth/shooters-log)

[![Throughput Graph](https://graphs.waffle.io/gsmatth/shooters-log/throughput.svg)](https://waffle.io/gsmatth/shooters-log/metrics/throughput)
#Shooters-Log API  

#Overview
* This API provides the necessary back-end infrastructure and functionality to create, save, and return data related to shooting matches.  
* Currently this data is collected on the firing line and noted on paper in one of the following: a score card, a detailed match data book, or a barrel-book.  Many times this data is collected once and then transferred manually to some or all of the three books mentioned above.     
* By providing this API and supporting infrastructure, we are hoping to encourage developers of both client applications and web applications to develop applications that can provide value to the shooting community and a source of income for themselves.   

****
#Current Version
* The current version of this program is designed to collect and return data that can be used to produce a scorecard for a National Rifle Association (NRA) Mid-Range High Power rifle match.

****

#Way to contribute
* Preferred way to submit issues/bugs:

*****
#Architecture

This API is structured on a Model View Control(MVC) framework.  The base technology is a Node.js server with the core node.http server module and a Mongo database.

Middleware:  
  *The express router middleware provides the base routing capability.  
  * A custom handle-errors module implements and extends the http-errors npm middleware package.  
  * An auth middleware module leverages both the bcrypt and node.crypto modules to provide user sign-up and user sign-in functionality.  
  * Mongoose npm module is used for interaction with the Mongo database  

![architecture](https://cloud.githubusercontent.com/assets/13153982/16399274/de6f96c6-3c85-11e6-878b-bfafd9cb2fc3.png)

View:  Individual resources (user, match......) have dedicated router files located in the route folder. In addition to providing an interface to the complimentary controller files, these files also parse the json content in the incoming request (where applicable) and create and populate a req.body property using the nmp package parse-body. For details about the input and output of routes, see the Routes section below.

Control: Individual resources (user, match...) have dedicated controller files.  These files implement the 'control' function of the MVC model.  These files provide the interaction with the both the "model" elements (database and model):
  *model:  The controller files call the constructor methods in the "model" files to construct new resource objects in memory
  * mongoose:  The controller files leverage the required mongoose client module to create new schemas in the mongo database and to create new documents for the resources supported by this API. Currently supported resources include:  
    -user  
    -competition  
    -match  
    -shot

Model:  Individual resources (user, match...) have dedicated model files. These files provide the constructors and the mongoose schema creation syntax. For a detailed breakdown of models and the model properties, see the schema section below.  

****

#Schema
![MVP Schema](https://cloud.githubusercontent.com/assets/13153982/16252177/de6d96ae-37e0-11e6-9e36-b8bf3b28e334.png)
* Schema for mvp.  We need to add some more text explaining the schema to those who may be interested in out API

*****
#Routes
###POST api/signup
Example: shooters-log-staging.heroapp.com/signup

Required Data:
* Provide username and password as JSON

This route will create a new user by providing a username and password in the body of the request.  Creating a new user is required to store and access data later.  This route but be completed before attempting to use the `api/signin` route.

A token will be returned that will only be used for the `api/signin` route.
after signing-in, you will receive a new token that will be a reference for all future routes.

Example response:
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFkMzY0MzZlNzNiMmI1MmNiYmNjZTQ2MWY5YTk1OGIwODYxZTZmYjIyMmUzMWU2MDNiNWJjNzQzMDBlYjA1NTEiLCJpYXQiOjE0NjY5NjY2NzR9.2xOVdorLQP-LtnmYCaRTX2V8enOTX-p3SJNF_8Gyoew`
  ```


###GET api/signin

Example: shooters-log-staging.herokuapp.com/api/signin

Required data:

* Authorization header
  * Provide username and password as JSON

This route will require an authorization header that needs to include the `username:password` of the specific user to be authenticated.  Signing in will return a brand new token that will be used for future user ID reference.

Example response:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImE0N2Y4NjQ5MzY5ZGI3YjVhYjQxOWE3OWI2OTVmYzZiYzUwYjBkZWFlZTUzOTAzYTliZDFiYTM5ZjU4NDkyZTAiLCJpYXQiOjE0NjY5NjMzMDZ9.1jA6zUfTW8m19AUEPn0TburTTiJARUzuMh93Ver4Bq8
```

###POST api/competition

example: shooters-log-staging.herokuapp.com/api/competition

Required data:

* Required in the body of request:
  * location: 'example location'
  * action: 'example action'
  * caliber: 'example caliber'
  * dateOf: 'example date' - this date does not have a specific format and is up to the user to pick how they want this data to be presented.

* Authorization:
  * needs to be done in the following way: `Bearer <response token from signin>`

This route will create a new competition that will include the location of the range and action that the shooter is using for the particular competition.  userId is required and is used to tie the user to the new competition.

Example response:
```
{
  "__v": 0,
  "location": "Rio Salado",
  "action": "BAT",
  "caliber": "308",
  "dateOf": "Nov 09, 2016"
  "userId": "5770305229a8f22e2e5cecb5",
  "_id": "5770307e29a8f22e2e5cecb6"
}
```

###GET api/competition/:competitionID

Example: shooters-log-staging.herokuapp.com/api/competition/5770307e29a8f22e2e5cecb6

* Required in the query:
  * Specific competition id which is provided when you complete a post request to `api/competition`

* Authorization:
  * You will provide the same authorization token that is given when signing up originally.

This route will display the same data the is provided when creating a new competition to use a reference.

Example response:

```
{
  "_id": "5770307e29a8f22e2e5cecb6",
  "location": "Rio Salado",
  "action": "BAT",
  "userId": "5770305229a8f22e2e5cecb5",
  "__v": 0
}
```

###PUT api/competition/:competitionID

Example: shooters-log-staging.herokuapp.com/api/competition/5770307e29a8f22e2e5cecb6

* Required in the body:
  * location: 'new location'
  * action: 'new action'
* Authorization
  * needs to be done in the following way: `Bearer <response token from signin>`
* Required in the query:
  * Specific competition id which is provided when you complete a post request to `api/competition`

This route will allow you to update the location and action being used for a specific competition.

Example response:
```
{
  "_id": "5770307e29a8f22e2e5cecb6",
  "location": "New Places",
  "action": "New Actions",
  "userId": "5770305229a8f22e2e5cecb5",
  "__v": 0
}
```

###Delete api/competition/:competitionID

Example: shooters-log-staging.herokuapp.com/api/competition/5770307e29a8f22e2e5cecb6

* Required in the query:
  * Specific competition id which is provided when you complete a post request to `api/competition`

This route will allow you to delete specific competitions by their id.

Example response:
You will only receive a status code 204 when a successful deletion occurs.

###POST api/competition/:competitionID/match

Example: shooters-log-staging.herokuapp.com/api/competition/577039ec29a8f22e2e5cecb7/match

* Required in the body:
  * matchNumber: 1 - Must be a number
  * targetNumber: 17 - Must be a number
  * distanceToTarget: 600 - Must be a number

* Authorization
  * needs to be done in the following way: `Bearer <response token from signin>`

****
