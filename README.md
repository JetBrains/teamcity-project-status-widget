# TeamCity Project Status Widget
[![Build Status][ci-img]][ci-bt] [![JetBrains team project](http://jb.gg/badges/team.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

This widget displays a list of build configurations from TeamCity with their current statuses. This widget can be added to dashboards and project overview pages in a Hub installation.

## Getting Started
This project is open source. You are welcome to contribute to the development of this widget or use the source code as a springboard to develop your own widgets.

After you check out the project, run `npm install` once to install all of the dependencies.

When installed, the following commands are available:

  - `npm test` to launch karma tests
  - `npm start` to run a local development server
  - `npm run lint` to lint your code (JS and CSS)
  - `npm run stylelint` to lint CSS only
  - `npm run build` to generate a production bundle (will be available under `dist`)
  - `npm run dist` to build ZIP distributive
  - `npm run ci-test` to launch karma tests and report the results to TeamCity
  
## Widget Testing

You can test widget updates directly in the user interface for Hub. Follow the instructions in the [Hub documentation](https://www.jetbrains.com/help/hub/test-custom-widgets.html).

All major browsers block insecure scripts. You may encounter a problem when you host your widget on a local development server and try to load it into an application over HTTPS. 
In Chrome, you can add a security exception: click the security notification in the address bar (the one that says "The page is trying to load scripts from unauthenticated sources") and 
press the "Load unsafe scripts" button. Similar workarounds are available in other browsers as well.
Additional options for testing widgets over a secure connection are described in the documentation for Hub.

## JetBrains Ring UI Widget Generator

This project was built using the [widget generator](https://github.com/JetBrains/ring-ui/tree/master/packages/generator/hub-widget) from the JetBrains Ring UI Library. If you want to build your own widgets for use in one of our products, this tool helps you get up and running in seconds flat.

## Widget Installation

This widget is available from the [JetBrains Plugins Repository](https://plugins.jetbrains.com/). This repository is integrated directly into the **Custom Widgets** page in your Hub installation. To install any widget from this repository:
1. Open the **Custom Widgets** page in your installation.
2. Select the widget that you want to install from the list.
3. Click the **Install** button in the page header.

## Contributions

We appreciate all kinds of feedback. Please feel free to send a pull request or submit an issue.

## Contributors

Thanks goes to these rockstars ([emoji key][emojis]):

| [<img src="https://avatars1.githubusercontent.com/u/92777?v=4" width="100px;"/><br /><sub><b>Maxim Mazin</b></sub>](https://github.com/mazine)<br />[💻](https://github.com/JetBrains/teamcity-project-status-widget/commits?author=mazine "Code") | [<img src="https://avatars2.githubusercontent.com/u/4318513?v=4" width="100px;"/><br /><sub><b>Andrey Skladchikov</b></sub>](https://github.com/huston007)<br />[💻](https://github.com/JetBrains/teamcity-project-status-widget/commits?author=huston007 "Code") | [<img src="https://avatars0.githubusercontent.com/u/2738412?s=400&v=4" width="100px;"/><br /><sub><b>Ekaterina Zaikina</b></sub>](https://github.com/katriyna)<br />[💻](https://github.com/JetBrains/teamcity-project-status-widget/commits?author=katriyna "Code") |
| :---: | :---: | :---: |

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind are welcome!

## License

This project is licensed under the Apache 2.0 License. For details, refer to the [LICENSE.txt file](https://github.com/JetBrains/hub-project-team-widget/blob/master/LICENSE.txt).

[ci-bt]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_HubWidgets_TeamCityProjectStatusWidget
[ci-img]: https://teamcity.jetbrains.com/app/rest/builds/buildType:JetBrainsUi_HubWidgets_TeamCityProjectStatusWidget/statusIcon.svg
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
