define(['./module'], function (services) {
    'use strict';
    services.factory('Action', ['Request',
        function (Request) {

            return {
                toggleLikeComment: function (parameters, cbSuccess, cbFail) {
                    console.log(parameters);
                    return Request.post('portal/actions/like',
                        parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                postComment: function (parameters, cbSuccess, cbFail) {
                    return Request.post('portal/actions/reply',
                        parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deleteComment: function (parameters, cbSuccess, cbFail) {
                    return Request.post('portal/actions/delete_comment',
                        parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                fetchHashtags: function (content, forceRefresh, scheduleId, cbSuccess, cbFail) {
                    return Request.post('portal/actions/recommended_hashtags', {
                        content: content,
                        force_refresh: forceRefresh,
                        schedule_id: scheduleId
                        },
                        function (message, raw) {
                            return cbSuccess(message, raw.used);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getAllowedActions: function (cbSuccess, cbFail) {
                    return Request.get('portal/actions/allowed', {},
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
