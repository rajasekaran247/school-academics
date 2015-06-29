'use strict';

// Disciplines controller
angular.module('disciplines').controller('DisciplinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Disciplines',
	function($scope, $stateParams, $location, Authentication, Disciplines) {
		$scope.authentication = Authentication;

		// Create new Discipline
		$scope.create = function() {
			// Create new Discipline object
			var discipline = new Disciplines ({
				name: this.name
			});

			// Redirect after save
			discipline.$save(function(response) {
				$location.path('disciplines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Discipline
		$scope.remove = function(discipline) {
			if ( discipline ) { 
				discipline.$remove();

				for (var i in $scope.disciplines) {
					if ($scope.disciplines [i] === discipline) {
						$scope.disciplines.splice(i, 1);
					}
				}
			} else {
				$scope.discipline.$remove(function() {
					$location.path('disciplines');
				});
			}
		};

		// Update existing Discipline
		$scope.update = function() {
			var discipline = $scope.discipline;

			discipline.$update(function() {
				$location.path('disciplines/' + discipline._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Disciplines
		$scope.find = function() {
			$scope.disciplines = Disciplines.query();
		};

		// Find existing Discipline
		$scope.findOne = function() {
			$scope.discipline = Disciplines.get({ 
				disciplineId: $stateParams.disciplineId
			});
		};
	}
]);