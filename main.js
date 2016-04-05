require.config({
	paths: {
		'dashBoard': 'js/dash-board'
	}
})

require(['dashBoard'], function(DashBoard){
	var border = document.getElementById("dashboard");
	var dashboard = new DashBoard({
		element: border
	});
	dashboard.addBoard({
		title:'Assign to Me',
		minHeight: 100,
	}).addBoard({
		title:'Activiey Stream',
		minHeight: 300,
	}).addBoard({
		title:'Activiey Stream',
		minHeight: 80,
		column: 1
	});
})