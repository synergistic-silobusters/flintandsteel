"use strict";

function getPreviousWeek(originalDate) {
    var lastWeek = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate() - 7);
    return lastWeek;
}

function getFollowingWeek(originalDate) {
    var nextWeek = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate() + 7);
    return nextWeek;
}

var now = ISODate(),
    userIds = [],
    eventIds = [];


db = connect('localhost:27017/flintandsteel-dev');

// create collections
db.createCollection('users');
db.createCollection('ideas');
db.createCollection('comments');
db.createCollection('events');

// create users
var insertResult = db.users.insert(
    [
        {
            firstName: 'Guybrush',
            lastName: 'Threepwood',
            fullName: 'Guybrush Threepwood',
            username: 'test1',
            email: 'test1@test.com',
            nickname: 'Threepy',
            title: 'Hippy Lumberjack'
        },
        {
            firstName: 'Rick',
            lastName: 'Sanchez',
            fullName: 'Rick Sanchez',
            username: 'test2',
            email: 'test2@test.com',
            nickname: 'Dirty',
            title: 'Street Pharmacist'
        },
        {
            firstName: 'Dick',
            lastName: 'Dickerson',
            fullName: 'Dick Dickerson',
            username: 'test3',
            email: 'test3@test.com',
            nickname: 'The Fracker',
            title: 'Money Bags Oil Man'
        },
        {
            firstName: 'Test',
            lastName: 'testerson',
            fullName: 'Test Testerson',
            username: 'test4',
            email: 'test4@test.com',
            nickname: 'The Tester',
            title: 'Testin\' All Day'
        }
    ]
);
print('INSERT RESULT: Inserted ' + insertResult.nInserted + ' documents into users collection.');

// get the user ids
db.users.find({}, { _id: 1 }).forEach(function(user) {
    userIds.push(user._id);
});

// create events
insertResult = db.events.insert(
    [
        {
            name: 'In Progress Event 1',
            location: 'USMAY',
            startDate: now,
            endDate: getFollowingWeek(now)
        },
        {
            name: 'In Progress Event 2',
            location: 'USMKE',
            startDate: now,
            endDate: getFollowingWeek(now)
        },
        {
            name: 'Completed Event 1',
            location: 'USTWB',
            startDate: getPreviousWeek(getPreviousWeek(now)),
            endDate: getPreviousWeek(now)
        }
    ]
);
print('INSERT RESULT: Inserted ' + insertResult.nInserted + ' documents into events collection.');

// get the event ids
db.events.find({}, { _id: 1 }).forEach(function(user) {
    eventIds.push(user._id);
});

// create ideas
insertResult = db.ideas.insert(
    [
        {
            title: 'Guybrush\'s Test Idea',
            description: 'This is an idea description.',
            authorId: userIds[0],
            eventId: eventIds[0],
            timeCreated: now,
            timeModified: now,
            tags: [],
            rolesreq: [],
            likes: [],
            updates: [],
            comments: [],
            backs: [{
                _id: new ObjectId(),
                text: 'Idea Owner',
                authorId: userIds[0],
                time: ISODate(),
                types: [{ name: 'Owner', _lowername: 'owner' }]
            }],
            team: [{ _id: new ObjectId(), memberId: userIds[0] }]
        },
        {
            title: 'Rick\'s Test Idea',
            description: 'This is Mr. Sanchez\'s brilliant idea.',
            authorId: userIds[1],
            eventId: eventIds[1],
            timeCreated: now,
            timeModified: now,
            tags: [],
            rolesreq: [],
            likes: [],
            updates: [],
            comments: [],
            backs: [{
                _id: new ObjectId(),
                text: 'Idea Owner',
                authorId: userIds[1],
                time: ISODate(),
                types: [{ name: 'Owner', _lowername: 'owner' }]
            }],
            team: [{ _id: new ObjectId(), memberId: userIds[1] }]
        },
        {
            title: 'Dick\'s Test Idea',
            description: 'This is "The Fracker\'s" master plan.',
            authorId: userIds[2],
            eventId: eventIds[2],
            timeCreated: now,
            timeModified: now,
            tags: [],
            rolesreq: [],
            likes: [],
            updates: [],
            comments: [],
            backs: [{
                _id: new ObjectId(),
                text: 'Idea Owner',
                authorId: userIds[2],
                time: ISODate(),
                types: [{ name: 'Owner', _lowername: 'owner' }]
            }],
            team: [{ _id: new ObjectId(), memberId: userIds[2] }]
        }
    ]
);
print('INSERT RESULT: Inserted ' + insertResult.nInserted + ' documents into ideas collection.');