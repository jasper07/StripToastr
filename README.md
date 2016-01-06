# saptech15
SapTech15 presentation on Grunt


## Prequisites 
Node

## Installing Grunt
npm install -g grunt-cli bower

## Installing the application
ensure you have installed Node.js

```javascript
git clone https://github.com/jasper07/saptech15.git
npm install
bower install
```

## To run the app
```javascript
grunt serve
```

this will setup a server which hosts the app, open up your browser and point it to

[http://localhost:8080/index.html](http://localhost:8080/index.html)


## To run the Unit and Opa tests

[http://localhost:8080/test/unit/unitTests.qunit.html](http://localhost:8080/test/unit/unitTests.qunit.html)

[http://localhost:8080/test/integration/opaTests.qunit.html](http://localhost:8080/test/integration/opaTests.qunit.html)

## To run the Unit and Opa test via PhantomJS
use one of the following commands to run both, or run individual
```javascript
grunt test

grunt unitTest

grunt opaTest
```
## To integrate with Travis-CI
A CI tool makes working in a team easier with automated builds. These builds are triggered automatically when each developer checks in their code to the repository. The build process incorporates testing, if testing fails the build stops and team members will be notified.

#### how to, very quick only a couple of steps
[http://code.tutsplus.com/tutorials/travis-ci-what-why-how--net-34771](http://code.tutsplus.com/tutorials/travis-ci-what-why-how--net-34771)

the results
[https://travis-ci.org/jasper07/saptech15](https://travis-ci.org/jasper07/saptech15)


