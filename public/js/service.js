'use strict';

module.exports = function($http) {
    function getRushingLeaders() {
        return $http
            .get('/api/getRushingLeaders')
            .success(function (data) {
                console.log('data: ', data);
                return data;
            })
            .error(function(error) {
                console.log('error: ', error);
            });
    }


    return {
        getRushingLeaders: getRushingLeaders
    };
}