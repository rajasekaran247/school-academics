'use strict';

// Placements controller
angular.module('placements').controller('PlacementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Placements',
	function($scope, $stateParams, $location, Authentication, Placements) {
		$scope.authentication = Authentication;

		// Create new Placement
		$scope.create = function() {
			// Create new Placement object
			var placement = new Placements ({
				name: this.name
			});

			// Redirect after save
			placement.$save(function(response) {
				$location.path('placements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Placement
		$scope.remove = function(placement) {
			if ( placement ) { 
				placement.$remove();

				for (var i in $scope.placements) {
					if ($scope.placements [i] === placement) {
						$scope.placements.splice(i, 1);
					}
				}
			} else {
				$scope.placement.$remove(function() {
					$location.path('placements');
				});
			}
		};

		// Update existing Placement
		$scope.update = function() {
			var placement = $scope.placement;

			placement.$update(function() {
				$location.path('placements/' + placement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Placements
		$scope.find = function() {
			$scope.placements = Placements.query();
		};

		// Find existing Placement
		$scope.findOne = function() {
			$scope.placement = Placements.get({ 
				placementId: $stateParams.placementId
			});
		};
	}
]);