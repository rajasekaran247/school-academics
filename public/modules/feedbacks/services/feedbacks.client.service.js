'use strict';

//Feedbacks service used to communicate Feedbacks REST endpoints
angular.module('feedbacks').factory('Feedbacks', ['$resource',
	function($resource) {
		return $resource('feedbacks/:feedbackId', { feedbackId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);