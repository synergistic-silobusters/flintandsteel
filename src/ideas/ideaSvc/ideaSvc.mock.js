/* global angular */
/* global moment */

angular.module('flintAndSteel')
.factory('ideaSvcMock',
    [
        function() {
            "use strict";

            var mockIdea = {
                id: 'mock_idea',
                _id: 'mock_idea',
                title: 'The bestest Idea ever!',
                description: 'Apophenia order-flow systema futurity garage sentient car advert. ' +
                    'Footage 3D-printed Legba free-market lights courier camera Kowloon youtube ' +
                    'fluidity euro-pop garage bicycle augmented reality. Dome military-grade ' +
                    'faded meta--space vehicle warehouse. Computer concrete corrupted vehicle ' +
                    'tower dead knife cyber-camera augmented reality table shrine apophenia ' +
                    'tiger-team-ware soul-delay. Hacker pistol into plastic realism sub-orbital ' +
                    'futurity girl geodesic disposable boat sentient tanto urban. Plastic alcohol ' +
                    'bicycle carbon courier spook gang wristwatch katana sensory sign long-chain ' +
                    'hydrocarbons assault nano. ',
                authorId: 1,
                image: '../assets/defaultideahero.jpg',
                likes: [
                    'cottageclaw',
                    'vbfond',
                    'curvechange',
                    'bothdesigned',
                    'gymnastfinance',
                    'aberrantcollagen',
                    'kuwaitiinspiring',
                    'basteglyderau',
                    'adoptionpanting',
                    'tokenslagoon',
                    'welshwood',
                    'kumquatslant',
                    'anaerobedigits',
                    'chouxthames',
                    'pizzago'
                ],
                managerLikes: 6,
                comments: [
                    {
                        commentId: 1,
                        parentId: 'mock_idea',
                        text: 'This sounds cool',
                        authorId: 1,
                        timeCreated: moment().subtract(1, 'days').calendar(),
                        timeModified: moment().subtract(1, 'days').calendar()
                    },
                    {
                        commentId: 2,
                        parentId: 'mock_idea',
                        text: 'Hey, I was thinking the same thing!',
                        authorId: 2,
                        timeCreated: moment().subtract(4, 'hours').calendar(),
                        timeModified: moment().subtract(4, 'hours').calendar()
                    },
                    {
                        commentId: 3,
                        parentId: 'mock_idea',
                        text: 'This is gold, gold I tell you!',
                        authorId: 3,
                        timeCreated: moment().subtract(30, 'minutes').calendar(),
                        timeModified: moment().subtract(30, 'minutes').calendar(),
                    }
                ],
                backs: [
                    {
                        text: 'management experience',
                        authorId: 4,
                        time: moment().subtract(7, 'days').calendar(),
                        types: [
                            { name: 'Experience' },
                            { name: 'Knowledge' }
                        ]
                    },
                    {
                        text: 'TEN MILLION DOLLARS',
                        authorId: 5,
                        time: moment().subtract(84, 'hours').calendar(),
                        types: [
                            { name: 'Funding' }
                        ]
                    }
                ],
                team: [
                  {
                      memberId: 1
                  }
                ]
            };

            function NotImplementedException(call) {
                this.name = 'NotImplementedException';
                this.message = 'Method ' + call + ' has not been implemented!';
                this.toString = function() {
                    return this.name + ': ' + this.message;
                };
            }

            return {
                postIdea: function postIdea(idea, successCb) {
                    successCb('Created');
                },
                getIdea: function getIdea(ideaId, successCb) {
                    successCb(mockIdea);
                },
                getIdeaHeaders: function getIdeaHeaders() {
                    return [
                        {
                            id: 'mock_idea',
                            title: 'The bestest Idea ever!',
                            author: 'Yash Kulshrestha',
                            likes: 23
                        }
                    ];
                },
                postComment: function postComment(parentId, text, authorId, successCb, errorCb) {
                    mockIdea.comments.push(
                        {
                            commentId: 4,
                            parentId: parentId,
                            text: text,
                            authorId: authorId,
                            timeCreated: new Date().toISOString(),
                            timeModified: new Date().toISOString()
                        }
                    );
                },
                deleteComment: function deleteComment(commentId, successCb, errorCb) {
                    for (var i = 0; i < mockIdea.comments.length; i++) {
                        if (mockIdea.comments[i].commentId === commentId) {
                            mockIdea.comments.splice(i, 1);
                            break;
                        }
                    }
                },
                getUniqueId: function getUniqueId() {
                    throw new NotImplementedException('getUniqueId');
                },
                updateIdea: function updateIdea(ideaId, property, data, successCb) {
                    mockIdea[property] = data;
                    successCb('OK');
                },
                editIdea: function editIdea(ideaId, title, description, rolesreq, successCb, errorCb) {
                    mockIdea.title = title;
                    mockIdea.description = description;
                    mockIdea.rolesreq = rolesreq;
                    mockIdea.timeModified = new Date().toISOString();
                    successCb('Edited');
                },
                deleteIdea: function deleteIdea(ideaId, successCb) {
                    successCb('Deleted!');
                },
                getBackTypeChips: function getBackTypeChips() {
                    var types = [
                        { name: 'Experience' },
                        { name: 'Funding' },
                        { name: 'Time' },
                        { name: 'Knowledge' },
                        { name: 'Social Network'},
                        { name: 'Materials' },
                        { name: 'Test Chip'}
                    ];
                    return types.map(function(type) {
                        type._lowername = type.name.toLowerCase();
                        return type;
                    });
                }
            };
        }
    ]
);
