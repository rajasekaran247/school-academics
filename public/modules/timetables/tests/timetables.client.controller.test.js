'use strict';

(function() {
	// Timetables Controller Spec
	describe('Timetables Controller Tests', function() {
		// Initialize global variables
		var TimetablesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Timetables controller.
			TimetablesController = $controller('TimetablesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Timetable object fetched from XHR', inject(function(Timetables) {
			// Create sample Timetable using the Timetables service
			var sampleTimetable = new Timetables({
				name: 'New Timetable'
			});

			// Create a sample Timetables array that includes the new Timetable
			var sampleTimetables = [sampleTimetable];

			// Set GET response
			$httpBackend.expectGET('timetables').respond(sampleTimetables);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timetables).toEqualData(sampleTimetables);
		}));

		it('$scope.findOne() should create an array with one Timetable object fetched from XHR using a timetableId URL parameter', inject(function(Timetables) {
			// Define a sample Timetable object
			var sampleTimetable = new Timetables({
				name: 'New Timetable'
			});

			// Set the URL parameter
			$stateParams.timetableId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/timetables\/([0-9a-fA-F]{24})$/).respond(sampleTimetable);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timetable).toEqualData(sampleTimetable);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Timetables) {
			// Create a sample Timetable object
			var sampleTimetablePostData = new Timetables({
				name: 'New Timetable'
			});

			// Create a sample Timetable response
			var sampleTimetableResponse = new Timetables({
				_id: '525cf20451979dea2c000001',
				name: 'New Timetable'
			});

			// Fixture mock form input values
			scope.name = 'New Timetable';

			// Set POST response
			$httpBackend.expectPOST('timetables', sampleTimetablePostData).respond(sampleTimetableResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Timetable was created
			expect($location.path()).toBe('/timetables/' + sampleTimetableResponse._id);
		}));

		it('$scope.update() should update a valid Timetable', inject(function(Timetables) {
			// Define a sample Timetable put data
			var sampleTimetablePutData = new Timetables({
				_id: '525cf20451979dea2c000001',
				name: 'New Timetable'
			});

			// Mock Timetable in scope
			scope.timetable = sampleTimetablePutData;

			// Set PUT response
			$httpBackend.expectPUT(/timetables\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/timetables/' + sampleTimetablePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid timetableId and remove the Timetable from the scope', inject(function(Timetables) {
			// Create new Timetable object
			var sampleTimetable = new Timetables({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Timetables array and include the Timetable
			scope.timetables = [sampleTimetable];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/timetables\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTimetable);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.timetables.length).toBe(0);
		}));
	});
}());