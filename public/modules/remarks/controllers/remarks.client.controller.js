'use strict';

// Remarks controller
angular.module('remarks').controller('RemarksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Remarks',
	function($scope, $stateParams, $location, Authentication, Remarks) {
		$scope.authentication = Authentication;

		// Create new Remark
		$scope.create = function() {
			// Create new Remark object
			var remark = new Remarks ({
				name: this.name
			});

			// Redirect after save
			remark.$save(function(response) {
				$location.path('remarks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Remark
		$scope.remove = function(remark) {
			if ( remark ) { 
				remark.$remove();

				for (var i in $scope.remarks) {
					if ($scope.remarks [i] === remark) {
						$scope.remarks.splice(i, 1);
					}
				}
			} else {
				$scope.remark.$remove(function() {
					$location.path('remarks');
				});
			}
		};

		// Update existing Remark
		$scope.update = function() {
			var remark = $scope.remark;

			remark.$update(function() {
				$location.path('remarks/' + remark._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Remarks
		$scope.find = function() {
			$scope.remarks = Remarks.query();
		};

		// Find existing Remark
		$scope.findOne = function() {
			$scope.remark = Remarks.get({ 
				remarkId: $stateParams.remarkId
			});
		};
	}
]);