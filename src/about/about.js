/* global angular */

angular.module('flintAndSteel')
.controller('AboutCtrl',
    [ 'paginateSvc',
        function(paginateSvc) {
            "use strict";

            var ctrl = this;
            var NUM_DEV_TEAM_COLUMNS = 4;

            ctrl.devTeam = [
                {name: "Bob Anderson", email: "rpanderson@ra.rockwell.com"},
                {name: "Braun Brennecke", email: "bcbrenne@ra.rockwell.com"},
                {name: "Alan Girard", email: "algirard@ra.rockwell.com"},
                {name: "Yash Kulshrestha", email: "akulshr@ra.rockwell.com"},
                {name: "David Parisi", email: "djparis1@ra.rockwell.com"},
                {name: "David Thompson", email: "DDThomps@ra.rockwell.com"},
                {name: "Miranda Van Minnen", email: "mvanminnen@ra.rockwell.com"},
                {name: "Matthew Wadsworth", email: "mwadsworth@ra.rockwell.com"}
            ];


            ctrl.columns = paginateSvc.createPages(ctrl.devTeam, NUM_DEV_TEAM_COLUMNS);
            // var teamLength = ctrl.devTeam.length;
            // var numPerColumn =  Math.ceil(teamLength / NUM_DEV_TEAM_COLUMNS);
            // var columnIndex = 0;
            // for (var memberIndex = 0; memberIndex < teamLength; columnIndex++, memberIndex += numPerColumn) {
            //     ctrl.columns.push({start: memberIndex, length: numPerColumn});
            // }
        }
    ]
);
