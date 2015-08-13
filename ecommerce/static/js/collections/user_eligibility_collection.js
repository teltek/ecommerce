define([
        'backbone',
        'js/models/user_eligibility_model'
    ],
    function (Backbone, EligibilityModel) {
        'use strict';

        return Backbone.Collection.extend({
                model: EligibilityModel,

                /*jshint undef: false */
                url: lmsRootUrl + '/api/credit/v1/eligibility/',
                /*jshint undef: true */
                setUrl: function (username, courseKey) {
                    this.url += '?username=' + username + '&course_key=' + courseKey;

                }
            }
        );
    }
);
