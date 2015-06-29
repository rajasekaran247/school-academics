'use strict';

//Remarks service used to communicate Remarks REST endpoints
angular.module('remarks').factory('Remarks', ['$resource',
	function($resource) {
		return $resource('remarks/:remarkId', { remarkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);