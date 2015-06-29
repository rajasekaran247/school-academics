'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Academics', 'academics', 'dropdown');
		Menus.addSubMenuItem('topbar', 'academics', 'Attendance', 'attendances');
    Menus.addSubMenuItem('topbar', 'academics', 'Discipline', 'disciplines');
    Menus.addSubMenuItem('topbar', 'academics', 'Examination', 'examinations');
    Menus.addSubMenuItem('topbar', 'academics', 'Feedback', 'feedbacks');
    Menus.addSubMenuItem('topbar', 'academics', 'Letter', 'letters');
    Menus.addSubMenuItem('topbar', 'academics', 'Placement', 'placements');
    Menus.addSubMenuItem('topbar', 'academics', 'Remark', 'remarks');
    Menus.addSubMenuItem('topbar', 'academics', 'Timetable', 'timetables');
	}
]);