[![Build Status](https://travis-ci.org/YashdalfTheGray/flintandsteel.svg?branch=master)](https://travis-ci.org/YashdalfTheGray/flintandsteel)
[![Dependency Status](https://gemnasium.com/YashdalfTheGray/flintandsteel.svg)](https://gemnasium.com/YashdalfTheGray/flintandsteel)
[![Issue Stats](http://issuestats.com/github/yashdalfthegray/flintandsteel/badge/pr?style=flat)](http://issuestats.com/github/yashdalfthegray/flintandsteel)
[![Issue Stats](http://issuestats.com/github/yashdalfthegray/flintandsteel/badge/issue?style=flat)](http://issuestats.com/github/yashdalfthegray/flintandsteel)

# flintandsteel

![Rok-Starter](https://raw.githubusercontent.com/YashdalfTheGray/flintandsteel/master/src/assets/InnovationChallengeLogo.png)

## Installation

### Prerequisites

The following applications need to be installed:

* [Git](http://git-scm.com/)
* [Node.js](https://nodejs.org/en/) - this project tests against v4.2.2 LTS
* [MongoDB](https://www.mongodb.org/)
* A text editor like [Notepad++](https://notepad-plus-plus.org/) or [Sublime Text 3](http://www.sublimetext.com/3)

Make sure that the directories containing `node`, `npm`, `mongod` and `mongo` are added to the path making them accessible from the terminal.

### Get the code

After cloning the git repository run `npm install` from a terminal window. If this process fails complaining about bower, you will need to run `npm install bower -g`, then run `npm install` again. If you receive another error involving Git, then you will need to ensure that Git is installed and the `*\Git\bin` directory is added to your PATH.

You will likely also have to run `npm install gulp -g` in order to run gulp. This command installs `gulp` globally so it can be used in the command line.

**Note**: On UNIX based platforms, this will need to be run with `sudo` and on Windows, the command prompt will require administrative privileges.

### Updating

`gulp clean:modules` will make sure that all the modules are the latest versions and ascertain that there are no unneeded modules downloaded. This clears out both npm and bower modules.

This will reduce the amount of conflicts rising from versioning and previous experiments.

## Running

To run the website server, you must open two terminal windows. In the first window, execute `gulp mongo:start` and leave this window open. This starts the mongo server. In the other window, execute `gulp start:dev` or `gulp start:prod`. Then navigate to [localhost:8080](http://localhost:8080).

Running the server in development mode disables LDAP login and HTTPS and falls back to hard-coded credentials. These hard-coded credentials are as follows:
* Guybrush Threepwood (username: test1) (password: test)
* Rick Sanchez (username: test2) (password: test)
* Dick Dickerson (username: test3) (password: test)

In order to run the server in production mode, you need to have access to the company network for LDAP purposes. You also need to create  `server\secrets\ldapAuth.js` which will hold the credentials needed to bind to the LDAP server. Lastly, you will need to have certificates to run HTTPS. Please look up self-signed certificates in order to properly set up the production environment, or obtain certificates from a trusted Certificate Authority.

Any changes to the code while the server is running will result in a server restart. However, this ***DOES NOT*** automatically re-run client tests or JavaScript analysis commands, so be sure to run them yourself before submitting a PR.

### Testing

To run the client side tests, execute `gulp test:client` from a terminal window. This automatically runs when a `gulp start:dev` or `gulp start:prod` command is executed.

### Linting and style check

Running `gulp jshint` will lint any JavaScript file under the `src` folder excluding `src/lib` and `server` as well as `gulpfile.js`.

Running `gulp jscs` will check the code style for the aforementioned files.

Unlike `gulp test:client`, these commands do not automatically run when executing a `gulp start:dev` or `gulp start:prod`

### Clearing persistent storage

The express server app uses [mongodb](https://www.npmjs.com/package/mongodb) to store users and ideas. There are two databases, `flintandsteel` for production and `flintandsteel-dev` for development. If the development database gets messy, `gulp clean:db-dev` can be used to drop the database.

At this point in time `gulp clean:db-dev` runs automatically when calling `gulp generate:data`, which runs automatically when executing `gulp start:dev`.

### Generating canned data for development database

To start with some predefined data, `gulp generate:data` clears the development database (using `gulp clean:db-dev`) and populates the database with pre-populated ideas and users. This happens automatically if you run `gulp start:dev`.

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for directions on how to set up and contribute to this project.

Contributions using other channels will be disregarded and asked to be routed through the proper procedure.

**Note**: Do not push to the stable branch, committing to the stable branch will result in code being lost. The stable branch is created for milestone releases.

## Useful links

[Angular Docs](https://docs.angularjs.org/api)

[Angular Material Docs](https://material.angularjs.org/#/)

[Lodash API](https://lodash.com/docs)

[Jasmine BDD docs](http://jasmine.github.io/2.3/introduction.html)

[List of Material Icons](https://www.google.com/design/icons/)

[Material Design color guide](http://www.google.com/design/spec/style/color.html#)
