[![Build Status](https://travis-ci.org/YashdalfTheGray/flintandsteel.svg?branch=master)](https://travis-ci.org/YashdalfTheGray/flintandsteel)
[![Dependency Status](https://gemnasium.com/YashdalfTheGray/flintandsteel.svg)](https://gemnasium.com/YashdalfTheGray/flintandsteel)
[![Issue Stats](http://issuestats.com/github/yashdalfthegray/flintandsteel/badge/pr?style=flat)](http://issuestats.com/github/yashdalfthegray/flintandsteel)
[![Issue Stats](http://issuestats.com/github/yashdalfthegray/flintandsteel/badge/issue?style=flat)](http://issuestats.com/github/yashdalfthegray/flintandsteel)

# flintandsteel

![Rok-Starter](https://raw.githubusercontent.com/YashdalfTheGray/flintandsteel/master/src/assets/Logo2.PNG)

## Installation

After cloning the git repo run `npm install` from a terminal window.

You will likely also have to run `npm install gulp -g` in order to run gulp. This command installs `gulp` globally so it can be used in the command line.

**Note**: On unix based platforms, this will need to be run with `sudo` and on Windows, the command prompt will require administrative privileges.

### Updating

`gulp clean:modules` will make sure that all the modules are the latest versions and ascertain that there are no unneeded modules downloaded. This clears out noth npm and bower modules.

This will reduce the amount of conflicts rising from versioning and previous experiments.

## Running

To run the website server, execute `gulp start` from a terminal window. Then navigate to http://localhost:8080.

### Testing

To run the client side tests, execute `gulp test:client` from a terminal window.

### Linting and style check

Running `gulp jshint` will lint any JavaScript file under the `src` folder excluding `src/lib` and `server` as well as `gulpfile.js`.

Running `gulp jscs` will check the code style for the aforementioned files. 

### Clearing Persistent storage

The express server app uses [docstore](https://www.npmjs.com/package/docstore) to store users and ideas in JSON format. If this storage location gets messy, `gulp clean:db` can be used to clear up the datastore.

### Generating Canned Idea datastore

To start with some predefined data, `gulp generate:data` populates the datastore with pre-populated ideas.

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for directions on how to set up and contribute to this project. 

Contributions using other channels will be disregarded and asked to be routed through the proper procedure. 

**Note**: Do not push to the stable branch, committing to the stable branch will result in code being lost. The stable branch is created for milestone releases.

## Useful links

[Angular Docs](https://docs.angularjs.org/api)

[Angular Material Docs](https://material.angularjs.org/#/)

[Lodash API](https://lodash.com/docs)

[Jasmine BDD docs](http://jasmine.github.io/2.3/introduction.html)

[List of Material Icons](https://klarsys.github.io/angular-material-icons/)

[Material Design color guide](http://www.google.com/design/spec/style/color.html#)
