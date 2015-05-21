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
	      		templateUrl: 'homeView/homeView.tpl.html',
	      		controller: 'HomeViewCtrl'
    		})
    		.state('login', {
	      		url: '/login',
	      		templateUrl: 'users/loginView/loginView.tpl.html',
	      		controller: 'LoginViewCtrl'
    		})
    		.state('signup', {
    			url: '/signup',
    			templateUrl: 'users/signupView/signupView.tpl.html',
    			controller: 'SignupViewCtrl'
    		})
    		.state('account', {
    			url: '/account',
    			templateUrl: 'users/accountView/accountView.tpl.html',
    			controller: 'AccountViewCtrl'
    		})
    		.state('ideaslist', {
    			url: '/ideaslist',
    			templateUrl: 'ideas/ideasList/ideasList.tpl.html',
    			controller: 'IdeasListCtrl'
    		})
    		.state('idea', {
    			url: '/idea/{ideaId}',
    			templateUrl: 'ideas/ideasView/ideasView.tpl.html',
    			controller: 'IdeasViewCtrl'
    		})
    		.state('addidea', {
    			url: '/addidea',
    			templateUrl: 'ideas/addIdeaView/addIdeaView.tpl.html',
    			controller: 'AddIdeaViewCtrl'
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
]);