require.config({
	paths: {
		'dashBoard': 'js/dash-board'
	}
})

require(['dashBoard'], function(DashBoard){
	var border = document.getElementById("dashboard");
	var dashboard = new DashBoard({
		element: border,
		minHeight: 50,
		column: 3,
	});
	dashboard.addBoard({
		title:'Assign to Me',
		minHeight: 100,
		content: '<h3>Hello World</h3>'
	}).addBoard({
		title:'Activiey Stream',
		minHeight: 300,
		
	}).addBoard({
		title:'Introduction',
		minHeight: 80,
		column: 1,
		contentUrl: 'src/content/introduce.html'
	}).addBoard({
		title:'Favourate Filters',
		minHeight: 80,
		column: 2
	});
})