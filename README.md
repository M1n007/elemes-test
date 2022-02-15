# Initial Project

This Project is used to handle backend 

### Prerequisites

What things you need to install the software and how to install them

```
Node.js v.10.x or higher
Node Package Manager
```

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be
- Create ENV file (.env) with this configuration:
```
JWT_SECRET=Admin100%
PORT=4000
PASS_SECRET=admin100%
JWT_REFRESH=Admin1000%
BASIC_AUTH_USERNAME=usernamebasic
BASIC_AUTH_PASS=passwordbasic
MONGO_CONNECTION_URI=mongodb://localhost:27017/elemes

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
...
...
```
- Then run this command
```
$ npm install
$ npm start
```

### Running the tests

Explain how to run the automated tests for this system
```sh
$ npm test
```

### Built With

* [expressJs] The rest framework used
* [Npm] - Dependency Management