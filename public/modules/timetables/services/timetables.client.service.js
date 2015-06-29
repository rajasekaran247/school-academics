'use strict';

//Timetables service used to communicate Timetables REST endpoints
angular.module('timetables').factory('Timetables', ['$resource',
	function($resource) {
		return $resource('timetables/:timetableId', { timetableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);