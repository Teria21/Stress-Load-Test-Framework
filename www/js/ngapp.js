var sltfApp = angular.module('sltfApp', ['ngRoute']);

sltfApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider , $rootScope) {
    $routeProvider
        .when('/', {
            // templateUrl: '/views/home.html',
            // controller: 'homeController'
            redirectTo : '/home'
        })
        .when('/home', {
            templateUrl: '/views/home.html',
            //controller: 'homeCtrl'
        })
        .when('/about', {
            templateUrl: '/views/about.html',
            //controller: 'homeCtrl'
        })
        .when('/reports', {
            templateUrl: '/views/report.html',
            //controller: 'homeCtrl'
        })
        .when('/sig', {
            templateUrl: '/views/sig_rpt.html',
            // controller: 'homeCtrl'
        })
        .when('/art', {
            templateUrl: '/views/art_rpt.html',
            // controller: 'homeCtrl'
        })
        .when('/404', {
            templateUrl: '/views/404.html',
            // controller: 'coreCtrl'
        })
        .otherwise({
            //redirectTo: '/home'
            redirectTo: '/404'
        });
}]);
