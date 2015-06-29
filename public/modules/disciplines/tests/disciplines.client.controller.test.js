'use strict';

(function() {
	// Disciplines Controller Spec
	describe('Disciplines Controller Tests', function() {
		// Initialize global variables
		var DisciplinesController,
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

			// Initialize the Disciplines controller.
			DisciplinesController = $controller('DisciplinesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Discipline object fetched from XHR', inject(function(Disciplines) {
			// Create sample Discipline using the Disciplines service
			var sampleDiscipline = new Disciplines({
				name: 'New Discipline'
			});

			// Create a sample Disciplines array that includes the new Discipline
			var sampleDisciplines = [sampleDiscipline];

			// Set GET response
			$httpBackend.expectGET('disciplines').respond(sampleDisciplines);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.disciplines).toEqualData(sampleDisciplines);
		}));

		it('$scope.findOne() should create an array with one Discipline object fetched from XHR using a disciplineId URL parameter', inject(function(Disciplines) {
			// Define a sample Discipline object
			var sampleDiscipline = new Disciplines({
				name: 'New Discipline'
			});

			// Set the URL parameter
			$stateParams.disciplineId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/disciplines\/([0-9a-fA-F]{24})$/).respond(sampleDiscipline);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.discipline).toEqualData(sampleDiscipline);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Disciplines) {
			// Create a sample Discipline object
			var sampleDisciplinePostData = new Disciplines({
				name: 'New Discipline'
			});

			// Create a sample Discipline response
			var sampleDisciplineResponse = new Disciplines({
				_id: '525cf20451979dea2c000001',
				name: 'New Discipline'
			});

			// Fixture mock form input values
			scope.name = 'New Discipline';

			// Set POST response
			$httpBackend.expectPOST('disciplines', sampleDisciplinePostData).respond(sampleDisciplineResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Discipline was created
			expect($location.path()).toBe('/disciplines/' + sampleDisciplineResponse._id);
		}));

		it('$scope.update() should update a valid Discipline', inject(function(Disciplines) {
			// Define a sample Discipline put data
			var sampleDisciplinePutData = new Disciplines({
				_id: '525cf20451979dea2c000001',
				name: 'New Discipline'
			});

			// Mock Discipline in scope
			scope.discipline = sampleDisciplinePutData;

			// Set PUT response
			$httpBackend.expectPUT(/disciplines\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/disciplines/' + sampleDisciplinePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid disciplineId and remove the Discipline from the scope', inject(function(Disciplines) {
			// Create new Discipline object
			var sampleDiscipline = new Disciplines({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Disciplines array and include the Discipline
			scope.disciplines = [sampleDiscipline];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/disciplines\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDiscipline);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.disciplines.length).toBe(0);
		}));
	});
}());