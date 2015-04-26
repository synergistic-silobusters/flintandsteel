# flintandsteel

## Installation

After cloning the git repo run `npm install` from a terminal window.

**Note**: On unix based platforms, this will need to be run with `sudo` and on Windows, the command prompt will require administrative privileges. 

## Updating

`gulp clean:modules` will make sure that all the modules are the latest versions and ascertain that there are no unneeded modules downloaded. This clears out noth npm and bower modules. 

This will reduce the ammount of conflicts rising from versioning and previous experiments. 

## Running

To run the website server, execute `gulp start` from a terminal window. Then navigate to http://localhost:8080. 

## Linting

Running `gulp jshint` will lint any Javascript file under the `src` folder excluding `src/lib`.

## Clearing Persistent storage

The express server app uses [docstore](https://www.npmjs.com/package/docstore) to store users and ideas in JSON format. If this storage location gets messy, `gulp clean:db` can be used to clear up the datastore. 

## Useful links

[Angular Material Docs](https://material.angularjs.org/#/)

[List of Material Icons](https://klarsys.github.io/angular-material-icons/)

[Material Design color guide](http://www.google.com/design/spec/style/color.html#)

