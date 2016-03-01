# Contributing to flintandsteel

## Code of Conduct

This project adheres to the [Open Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.
[code-of-conduct]: http://todogroup.org/opencodeofconduct/#flintandsteel/team.rockstarter@gmail.com

In addition to following this code of conduct, prefer face-to-face communication over digital. Avoid email and use Slack channels.

## Role of Github Issues

We use  the Github issues section to document
* Features that we are thinking of including in the future
* Code clean-up that needs to be performed and the correct way to handle it
* Bugs in the application that we know about

If you find bugs with the code, we ask that you include as much pertinent information as possible to aid in reproduction like steps to reproduce and where you encountered the bug. Additional information can include screenshots, stack traces, the code in question, etc. While submitting a bug, please make sure to label it a bug as well.

If you have a feature in mind, please open a new issue so that the team can have a discussion about it. We welcome mockups and code snippets!

## Submission Guidelines

We use the forking methodology for contributions. This enables us to keep the code being committed under check to guarantee code quality. It also enables members to perform code reviews without the need for another tool. All the development on the project and the current state of the project are maintained on the `master` branch.

We use [Trello](https://trello.com/) to track our development. If you would like to become a regular contributor to this project, please let the team know and we can discuss further.

**NOTE**: PRs larger than 500 lines of code changed will be rejected and asked to be broken down into smaller PRs.

Contribute to our project by following these steps

1. Fork flintandsteel and clone it locally
    If you already have a fork, create a Pull Request from the main repo to your repo to rebase
2. Create a branch for the new work that needs to be done using `git checkout -b <branch_name> master`
3. Make your changes on your new branch.
4. Make sure that the tests are all green, coverage is at at least 80% and there are no code errors
5. If there are changes on the main master, rebase your master branch to the main master branch by creating a Pull Request from the main master to your master
6. If your master has new code, merge your master into your work branch using `git merge master` while on your work branch
7. Run the tests, `jshint` and `jscs` again and fix anything that broke
8. Merge your branch to your master using `git merge <branch_name>` when on your master
9. Push your code to Github
10. Create a Pull Request from your master to the main master.

Alternatively, you can create a Pull Request from the branch that you are working on but you run the chance of having merge conflicts by circumventing parts of this process. Some of the tasks listed above are detailed in the sections below.

### Fork flintandsteel and set up your repo
Click the fork button on our repository page to get a copy for yourself. You can then create a local clone of your fork using `git clone <repo_name>`. You can now begin making your changes to the code.

**NOTE**: If you have already forked the repo and cloned it, make sure to rebase before starting to make changes. This will ensure that you have the latest code.

Refer to [README.md](./README.md) for installation and execution instructions.

### Make your changes

Please use 4 spaces as indentation for the sake of uniformity.

To do this in Sublime Text 3, edit the `Preferences.sublime-settings` file and add

```json
{
  "tab_size": 4,
  "translate_tabs_to_spaces": true,
  "use_tab_stops": true
}
```

For Notepad++, use (credit to David Parisi):

Settings -> Preferences -> Tab Settings.  Check Replace by space and make sure tab size is set to 4.

For Atom,
In settings, (Cmd + ,) -> Make sure tab length is set to 4 and tab type is set to soft.

After you make your changes and before committing, make sure to
* run `gulp jshint` to lint the code and solve any issues presented
* run `gulp jscs` to check the code style and solve any issues presented
* change `package.json` and `bower.json` if a new module was installed using the `--save` command line switch, i.e. `[npm|bower] install --save <module_name>`
* add `package.json` or `bower.json` to a separate commit with a reason to pull that module into the build
* update the unit tests in the corresponding `.spec.js` file in the same folder. If one doesn't exist, create a file with the same name as the folder followed by ".spec.js". This marks the file as a unit test file.
* run `gulp test:client` to run the unit tests and make sure they all pass. Make sure that none of the tests are excluded or focused.

Pull requests changing significant portions of code without updating the unit tests will be rejected and asked to be redone. Pull requests containing focused or excluded unit tests will also be rejected until changed.

### Create a Pull Request

After you have pushed your changes to your fork, please create a pull request from your fork back to our repository. Make sure that the pull request details the changes that you will be merging and that your commits have meaningful comments.

Also make sure that you ask at least 2 members to review your code. Once both members review and approve the code, we will merge the pull request. Once the code reviews are requested, members are expected to respond within 2 days and are expected to leave constructive feedback, if required.

Once the pull request is merged, make sure that you update your master before beginning further work on your flintandsteel fork.

## Coding Style

Most of the general code quality and style is monitored by `jshint` which is why it is required to pass before committing and merging to our repository. As this is an AngularJS app, we also have a certain convention of naming files, controllers, services, filters, etc. Please adhere to these conventions.

If you find a discrepancy in the conventions, please create an issue on Github and we will investigate it further.
