'use strict';

//Letters service used to communicate Letters REST endpoints
angular.module('letters').factory('Letters', ['$resource',
	function($resource) {
		return $resource('letters/:letterId', { letterId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);