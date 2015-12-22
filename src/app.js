/* global angular */

/*
    This sets up the main app module and also tells Angular
    what this module depends on to work correctly.
 */
angular.module('flintAndSteel', [
        'ngAnimate',
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ui.identicon'
    ]
)
.config([
    '$urlRouterProvider', '$stateProvider', '$mdThemingProvider',
    function($urlRouterProvider, $stateProvider, $mdThemingProvider) {
        "use strict";

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'homeView/homeView.tpl.html',
                controller: 'HomeViewCtrl'
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
                controller: 'IdeasViewCtrl',
                controllerAs: 'ideasView'
            })
            .state('addidea', {
                url: '/addidea',
                templateUrl: 'ideas/addIdeaView/addIdeaView.tpl.html',
                controller: 'AddIdeaViewCtrl'
            })
            .state('ideabrowse', {
                url: '/ideabrowse',
                templateUrl: 'ideas/ideaBrowseView/ideaBrowseView.tpl.html',
                controller: 'IdeaBrowseViewCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'about/about.tpl.html',
                controller: ''
            })
            .state('innovationdisclosure', {
                url: '/innovationdisclosure',
                templateUrl: 'innovationDisclosureView/innovationDisclosureView.tpl.html',
                controller: ''
            });

        $urlRouterProvider.otherwise('/');

        var rockstarterRedMap = $mdThemingProvider.extendPalette('red', {
            '900': 'bb1e32'
        });
        var rockstarterGrayMap = $mdThemingProvider.extendPalette('grey', {
            '900': '6d6e71'
        });

        $mdThemingProvider.definePalette('rokstarter-red', rockstarterRedMap);
        $mdThemingProvider.definePalette('rokstarter-gray', rockstarterGrayMap);

        $mdThemingProvider.theme('default')
        .primaryPalette('rokstarter-gray', {
            'default': '900'
        })
        .accentPalette('rokstarter-red', {
            'default': '900',
            'hue-1': 'A700'
        })
        .warnPalette('red');
    }
]);

// red #650100
// gray #464b51
