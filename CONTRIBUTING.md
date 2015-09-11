# Contributing to flintandsteel

## Code of Conduct

This project adheres to the [Open Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.
[code-of-conduct]: http://todogroup.org/opencodeofconduct/#flintandsteel/team.rockstarter@gmail.com

## Role of Github Issues

We use  the Github issues section to document
* Featues that we are thinking of including in the future
* Code clean-up that needs to be performed and the correct way to handle it
* Bugs in the application that we know about

If you find bugs with the code, we ask that you include as much pertinent information as possible to aid in reproduction like steps to reproduce and where you encountered the bug. Additional information can include screenshots, stack traces, the code in question, etc. While submitting a bug, please make sure to label it a bug as well. 

If you have a feature in mind, please open a new issue so that the team can have a discussion about it. We welcome mockups and code snippets!

## Submission Guidelines

We use the forking methodology for contributions. This enables us to keep the code being commited under check to guarantee code quality. It also enables members to perform code reviews without the need for another tool. All the development on the project and the current state of the project are maintained on the `master` branch. 

We use [Trello](https://trello.com/) to track our development. If you would like to become a regular contributor to this project, please let the team know and we can discuss further. 

Contribute to our project by following these steps

1. Fork flintandsteel and clone it locally
2. Make your changes and push to your fork
3. Create a Pull Request back to our repository

### Fork flintandsteel and set up your repo
Click the fork button on our repository page to get a copy for yourself. You can then create a local clone of your fork using `git clone <repo_name>`. You can now begin making your changes to the code. 

Refer to [README.md](./README.md) for installation and execution instructions. 

### Make your changes

After you make your changes and before committing, make sure to
* run `gulp jshint` to lint the code and solve any issues presented
* change `package.json` and `bower.json` if a new module was installed using the `--save` command line switch, i.e. `[npm|bower] install --save <module_name>`
* add `package.json` or `bower.json` to a separate commit with a reason to pull that module into the build
* update the unit tests in the corresponding `.spec.js` file in the same folder. If one doesn't exist, create a file with the same name as the folder followed by ".spec.js". This marks the file as a unit test file.

Pull requests changing significant portions of code without updating the unit tests will be rejected and asked to be redone.

### Create a Pull Request

After you have pushed your changes to your fork, please create a pull request from your fork back to our repository. Make sure that the pull request details the changes that you will be merging and that your commits have meaningful comments. 

Also make sure that you ask at least 2 members to review your code. Once both members review and approve the code, we will merge the pull request. Once the code reviews are requested, members are expected to respond within 2 days and are expected to leave constructive feedback, if required. 

Once the pull request is merged, make sure that you update your master before begining further work on your flintandsteel fork. 

## Coding Style

Most of the general code quality and style is monitored by `jshint` which is why it is required to pass before commiting and merging to our repository. As this is an AngularJS app, we also have a certain convention of naming files, controllers, services, filters, etc. Please adhere to these conventions. 

If you find a discrepancy in the conventions, please create an issue on Github and we will investigate it futher. 
