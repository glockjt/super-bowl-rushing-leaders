var Promise = require('bluebird'),
    fs      = require('fs'),
    _       = require('lodash');

// Promisify
Promise.promisifyAll(fs);

var stats = [],
    inputFile = 'super-bowl-play-by-play.json',
    statFile;

// read in json file
fs.readFileAsync(inputFile, 'utf8')
    .then(function (file) {
        statFile = JSON.parse(file);
    });

/**
 * Filter out the given type of play-by-play
 * @param  {array}  period  an array of the 4 quarters
 * @param  {string} type    the specified pbp type
 */
function getPbpType(period, type) {
    return _.filter(period.pbp, function (pbp) {
        return pbp.type === type;
    });
}

/**
 * Filter out the given type of event
 * @param  {array}  pbpType an array of all the drives
 * @param  {string} type    the specified event
 */
function getEventType(pbpType, type) {

    return _.filter(pbpType.events, function (evt) {
        return evt.play_type === type;
    });
}

/**
 * Filter out the given type of stat
 * @param  {array}  playType    an array of all the plays
 * @param  {string} type        the specified stat
 */
function getStatType(playType, type) {

    return _.filter(playType.statistics, function (stat) {
        return stat.stat_type === type;
    });
}

/**
 * Check if the players has already been added
 * if not then add the player
 * if already added then add yards
 * @param  {array} stat     array of stats
 */
function checkAndAdd(stat) {
    var found = _.some(stats, function (el) {
        if (el.player === stat.player.name) {
            if (stat.yards && !stat.nullified) {
                el.yards = el.yards + parseInt(stat.yards, 10);
            }
            return true;
        }
        return false;
    });

    if(!found) {
        stats.push({player: stat.player.name, team: stat.team.name, yards: stat.yards && !stat.nullified ? parseInt(stat.yards, 10) : 0 });
    }
}

/**
 * Create the stats object
 * @param  {array}  filteredStats   array of stats
 */
function populateStats(filteredStats) {

    return _.forEach(filteredStats, function(stat) {
        checkAndAdd(stat);
    });
}

/**
 * Iterate through the given array and filter it by
 * the given function and type
 * @param  {array}      array   array of game data or already filtered data
 * @param  {function}   func    function to use to filter the array
 * @param  {string}     type    the type to filter on
 */
function promiseIterator(array, func, type) {

    return Promise.map(array, function (element) {
        return func(element, type);
    }).then(function (filteredArray) {
        return _.flatten(filteredArray);
    });
}

/**
 * Export the data
 */
exports.getStatistics = function () {

    stats = [];

    return promiseIterator(statFile.periods, getPbpType, 'drive')
        .then(function (pbpTypes) {

            return promiseIterator(pbpTypes, getEventType, 'rush');

        }).then(function (playTypes) {

            return promiseIterator(playTypes, getStatType, 'rush');

        }).then(function (statTypes) {

            populateStats(statTypes);

            // sort by yards in descending order
            stats = _.sortByOrder(stats, ['yards'], ['desc']);

            return stats;
        });
};
