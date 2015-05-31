# flintandsteel

## Installation

After cloning the git repo run `npm install` from a terminal window.

You will likely also have to run `npm install gulp-cli -g` in order to run gulp. This command installs `gulp` globally so it can be used in the command line.

**Note**: On unix based platforms, this will need to be run with `sudo` and on Windows, the command prompt will require administrative privileges. 

## Updating

`gulp clean:modules` will make sure that all the modules are the latest versions and ascertain that there are no unneeded modules downloaded. This clears out noth npm and bower modules. 

This will reduce the ammount of conflicts rising from versioning and previous experiments. 

## Running

To run the website server, execute `gulp start` from a terminal window. Then navigate to http://localhost:8080. 

## Testing

To run the client side tests, execute `gulp test:client` from a terminal window. 

## Linting

Running `gulp jshint` will lint any Javascript file under the `src` folder excluding `src/lib`.

## Clearing Persistent storage

The express server app uses [docstore](https://www.npmjs.com/package/docstore) to store users and ideas in JSON format. If this storage location gets messy, `gulp clean:db` can be used to clear up the datastore. 

## Contributing

Before commiting code, make sure
* you run `gulp jshint` to lint the code and solve any issues presented
* change `package.json` and `bower.json` if a new module was installed using the `--save` command line switch, i.e. `[npm|bower] install --save {module_name}`
* Add `package.json` or `bower.json` to a separate commit with a reason to pull that module into the build
* Update the unit tests in the corresponding .spec.js file in the same folder. If one doesn't exist, create a file with the same name as the folder followed by ".spec.js". This marks the file as a unit test file. 

**Note**: Do not push to the stable branch, commiting to the stable branch will result in code being lost. The stable branch is created for milestone releases. 

## Useful links

[Angular Docs](https://docs.angularjs.org/api)

[Angular Material Docs](https://material.angularjs.org/#/)

[Lodash API](https://lodash.com/docs)

[Jasmine BDD docs](http://jasmine.github.io/2.3/introduction.html)

[List of Material Icons](https://klarsys.github.io/angular-material-icons/)

[Material Design color guide](http://www.google.com/design/spec/style/color.html#)

