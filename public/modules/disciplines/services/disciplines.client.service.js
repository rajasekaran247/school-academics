'use strict';

//Disciplines service used to communicate Disciplines REST endpoints
angular.module('disciplines').factory('Disciplines', ['$resource',
	function($resource) {
		return $resource('disciplines/:disciplineId', { disciplineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);