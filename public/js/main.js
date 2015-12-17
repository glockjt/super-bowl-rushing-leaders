'use strict';

module.exports = function(mainService) {
    var self = this;
        self.rushingLeaders = [];
        self.orderBy = '-yards';
        self.limit = 10;

    // get the rushing leaders
    mainService.getRushingLeaders().then(function (data) {
        console.log('ctrl data: ', data);
        self.rushingLeaders = data.data;
    });

    /**
     * Sort by player's first name
     */
    self.onPlayerClick = function () {
        self.orderBy = 'player';
    };

    /**
     * Sort by team name
     */
    self.onTeamClick = function () {
        self.orderBy = 'team';
    };

    /**
     * Sort by yards
     */
    self.onYardsClick = function () {
        self.orderBy = '-yards';
    };
}