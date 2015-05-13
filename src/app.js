/* global angular */


/*
	This sets up the main app module and also tells Angular
	what this module depends on to work correctly. 
 */
angular.module('flintAndSteel', [
		'ngAnimate',
		'ui.router',
		'ngMaterial'
	]
)
.config([
	'$urlRouterProvider',
	'$stateProvider',
	'$mdIconProvider',
	'$mdThemingProvider', 
	function($urlRouterProvider, $stateProvider, $mdIconProvider, $mdThemingProvider) {
		$stateProvider
			.state('home', {
	      		url: '/',
	      		templateUrl: 'home/home.tpl.html',
	      		controller: 'homeCtrl'
    		})
    		.state('login', {
	      		url: '/login',
	      		templateUrl: 'login/login.tpl.html',
	      		controller: 'loginCtrl'
    		})
    		.state('signup', {
    			url: '/signup',
    			templateUrl: 'signup/signup.tpl.html',
    			controller: 'signupCtrl'
    		})
    		.state('account', {
    			url: '/account',
    			templateUrl: 'account/account.tpl.html',
    			controller: 'accountCtrl'
    		})
    		.state('ideasList', {
    			url: '/ideasList',
    			templateUrl: 'ideasList/ideasList.tpl.html',
    			controller: 'ideasListCtrl'
    		})
    		.state('idea', {
    			url: '/idea',
    			templateUrl: 'ideasView/ideasView.tpl.html',
    			controller: 'IdeasViewCtrl'
    		});

		$urlRouterProvider.otherwise('/');

	    $mdIconProvider
	        .iconSet('action', './assets/icons/action-icons.svg', 24)
	        .iconSet('alert', './assets/icons/alert-icons.svg', 24)
	        .iconSet('av', './assets/icons/av-icons.svg', 24)
	        .iconSet('communication', './assets/icons/communication-icons.svg', 24)
	        .iconSet('content', './assets/icons/content-icons.svg', 24)
	        .iconSet('device', './assets/icons/device-icons.svg', 24)
	        .iconSet('editor', './assets/icons/editor-icons.svg', 24)
	        .iconSet('file', './assets/icons/file-icons.svg', 24)
	        .iconSet('hardware', './assets/icons/hardware-icons.svg', 24)
	        .iconSet('icons', './assets/icons/icons-icons.svg', 24)
	        .iconSet('image', './assets/icons/image-icons.svg', 24)
	        .iconSet('maps', './assets/icons/maps-icons.svg', 24)
	        .iconSet('navigation', './assets/icons/navigation-icons.svg', 24)
	        .iconSet('notification', './assets/icons/notification-icons.svg', 24)
	        .iconSet('social', './assets/icons/social-icons.svg', 24)
	        .iconSet('toggle', './assets/icons/toggle-icons.svg', 24);

	    $mdThemingProvider.theme('default')
                          .primaryPalette('blue')
                          .accentPalette('green', {
                          	'default': 'A200',
                          	'hue-1': '600'
                          })
                          .warnPalette('red');
	}
])
.constant('appSettings', {
	serverUrl: 'http://localhost:8080'
});