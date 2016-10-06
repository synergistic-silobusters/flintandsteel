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
        'ui.identicon',
        'hc.marked'
    ]
)
.config([
    '$urlRouterProvider', '$stateProvider', '$mdThemingProvider', '$httpProvider', 'markedProvider',
    function($urlRouterProvider, $stateProvider, $mdThemingProvider, $httpProvider, markedProvider) {
        "use strict";

        // Use GitHub Flavored Markdown ("gfm")
        markedProvider.setOptions({gfm: true});

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
            .state('learn', {
                url: '/learn',
                templateUrl: 'learn/learn.tpl.html',
                controller: 'LearnCtrl'
            })
            .state('innovationdisclosure', {
                url: '/innovationdisclosure',
                templateUrl: 'innovationDisclosureView/innovationDisclosureView.tpl.html',
                controller: ''
            })
            .state('jointeam', {
                url: '/jointeam',
                templateUrl: 'joinTeamView/joinTeamView.tpl.html',
                controller: ''
            });

        $urlRouterProvider.otherwise('/');

        var rockstarterRedMap = $mdThemingProvider.extendPalette('red', {
            '900': 'bb1e32'
        });
        var rockstarterGrayMap = $mdThemingProvider.extendPalette('grey', {
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

        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';
    }
])
.run(['$rootScope', '$location', '$window',
    function($rootScope, $location, $window) {
        "use strict";

        $rootScope.$on('$stateChangeSuccess',
            function() {
                if (!$window.ga) {
                    return;
                }
                $window.ga('send', 'pageview', { page: $location.path() });
            }
        );
    }
]);

// red #650100
// gray #464b51
