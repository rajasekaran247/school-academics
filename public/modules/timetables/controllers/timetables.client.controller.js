'use strict';

// Timetables controller
angular.module('timetables').controller('TimetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timetables',
	function($scope, $stateParams, $location, Authentication, Timetables) {
		$scope.authentication = Authentication;

		// Create new Timetable
		$scope.create = function() {
			// Create new Timetable object
			var timetable = new Timetables ({
				name: this.name
			});

			// Redirect after save
			timetable.$save(function(response) {
				$location.path('timetables/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Timetable
		$scope.remove = function(timetable) {
			if ( timetable ) { 
				timetable.$remove();

				for (var i in $scope.timetables) {
					if ($scope.timetables [i] === timetable) {
						$scope.timetables.splice(i, 1);
					}
				}
			} else {
				$scope.timetable.$remove(function() {
					$location.path('timetables');
				});
			}
		};

		// Update existing Timetable
		$scope.update = function() {
			var timetable = $scope.timetable;

			timetable.$update(function() {
				$location.path('timetables/' + timetable._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Timetables
		$scope.find = function() {
			$scope.timetables = Timetables.query();
		};

		// Find existing Timetable
		$scope.findOne = function() {
			$scope.timetable = Timetables.get({ 
				timetableId: $stateParams.timetableId
			});
		};
	}
]);