[![Stories in Ready](https://badge.waffle.io/gsmatth/shooters-log.png?label=ready&title=Ready)](https://waffle.io/gsmatth/shooters-log)

[![Throughput Graph](https://graphs.waffle.io/gsmatth/shooters-log/throughput.svg)](https://waffle.io/gsmatth/shooters-log/metrics/throughput)
#Shooters-Log API  

#Overview
* promises: getting comfortable with the basic syntax and the order of execution  
* how to tie together the server, router object, route object, and registering the routes  
* the value of abstracting simple repetitive tasks like err responses  
* the value of adding additional properties to a req or res object so that the new property can be passed along and accessed by other methods  
* getting the httpie commands right    

****
#Introduction
* For the first time, I could actually visualize the program before I started coding and determine what code needed to be modified to change the service to meet the objectives of lab-08.  Although I did not know the exact code that needed to be written, I understood it in general terms before I started coding.


****
#Current Version
* For the first time, I could actually visualize the program before I started coding and determine what code needed to be modified to change the service to meet the objectives of lab-08.  Although I did not know the exact code that needed to be written, I understood it in general terms before I started coding.



****

#Way to contribute
* Preferred way to submit issues/bugs:

#Schema
![MVP Schema](https://cloud.githubusercontent.com/assets/13153982/16252177/de6d96ae-37e0-11e6-9e36-b8bf3b28e334.png)
* Schema for mvp.  We need to add some more text explaining the schema to those who may be interested in out API



****
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

Example resonse:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImE0N2Y4NjQ5MzY5ZGI3YjVhYjQxOWE3OWI2OTVmYzZiYzUwYjBkZWFlZTUzOTAzYTliZDFiYTM5ZjU4NDkyZTAiLCJpYXQiOjE0NjY5NjMzMDZ9.1jA6zUfTW8m19AUEPn0TburTTiJARUzuMh93Ver4Bq8
```

###POST api/competition

example: shooters-log-staging.herokuapp.com/api/competition

Required data:

* Required in the body of request:
  * location: 'example location'
  * action: 'example action'

* Authorization:
  * needs to be done in the following way: `Bearer <response token from signup>`

This route will create a new competition that will include the location of the range and action that the shooter is using for the particular competition.  userId is required and is used to tie the user to the new competition.

Example response:
```
{
  "__v": 0,
  "location": "Rio Salado",
  "action": "BAT",
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
  * needs to be done in the following way: `Bearer <response token from signup>`
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
  *

****
#What items do I still not understand or what gaps have I identified in my knowledge?
* I was really strong at using the browser debugging tool.  I am very weak at using debugging tools with node.  
* how to automate test when you have dynamically generated items like UUID?  We did a work around in GET test that required nested requests.  Not sure if that is a good solution.  
* how do you list multiple files under your 'test' task in mocha-gulp?  
* need more work with mocha gulp-mocha and chai.  Tests are not running properly from gulp file
