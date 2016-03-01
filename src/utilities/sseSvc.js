/* global angular */
/* global EventSource */
/* global _ */

angular.module('flintAndSteel')
.service('sseSvc',
    [
        function() {
            "use strict";

            var svc = this;

            var eList = []; // List of Events that have been subscribed to.

            // Takes name of event on server, path of event on server, and a callback.
            svc.subscribe = function subscribe(eName, ePath, callback) {
                // If we never created an event, or if we closed an old event
                // then create a new one for this event path.
                if (angular.isUndefined(eList[ePath]) || eList[ePath].eventSrc === null) {
                    eList[ePath] = {
                        eventSrc: new EventSource(ePath), // The event source connection to the server.
                        subs: [] // A place to put all of the subscribers
                    };

                    // Add the event listener to the newly creted EventSource object.
                    eList[ePath].eventSrc.addEventListener(eName, function(event) {
                        var data = JSON.parse(event.data);

                        // Notify all the subscribers if there's an event raised.
                        _.forEach(eList[ePath].subs, function(cb) {
                            cb(data);
                        });
                    });
                }

                if (_.includes(eList[ePath].subs, callback)) {
                    return; // Do not add the callback if it already exists
                }
                else {
                    eList[ePath].subs.push(callback); // Add the callback to the list of subscribers.
                }
            };

            // Takes the path of event on server and the callback that was used to subscribe.
            svc.unsubscribe = function unsubscribe(ePath, callback) {
                // Pull out this entry from subscribers
                _.pull(eList[ePath].subs, callback);

                // Clean up if we were the last subscriber
                if (eList[ePath].subs.length === 0) {
                    // Attempt to close the EventSource
                    eList[ePath].eventSrc.close();

                    // Make sure the EventSource has been closed successfully
                    if (eList[ePath].eventSrc.readyState === 2) {
                        eList[ePath].eventSrc = null;
                    }
                    else {
                        // This is unexpected. Usually a server-side problem.
                        throw new Error("Could not close event!");
                    }
                }
            };
        }
    ]
);
