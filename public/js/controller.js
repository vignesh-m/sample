var sample = angular.module('sample', []);

sample.controller('UserController', ['$scope', '$http', '$templateCache',
    function($scope, $http, $templateCache) {
        $http({
            method: 'GET',
            url: '/users/user',
            cache: $templateCache
        }).
        success(function(data, status) {
            $scope.status = status;
            $scope.user = data;
        }).
        error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
    }
]);

sample.controller('FileListController', ['$scope', '$http', '$templateCache',
    function($scope, $http, $templateCache) {
        $http({
            method: 'POST',
            url: '/upload/list',
            cache: $templateCache
        }).
        success(function(data, status) {
            $scope.status = status;
            $scope.filelist = data;
        }).
        error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
    }
]);