angular
    .module('koala', ['ngMaterial'])
    .controller('koalaCtrl', function($scope) {
        $scope.user = {};
    })
    .config( function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });