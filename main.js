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
		title:'Init the board',
		minHeight: 100,
		content: '<pre>To Init the board:</pre><code>var dashboard = new DashBoard({options});</code>'
	}).addBoard({
		title:'Init Board Options',
		minHeight: 300,
		column: 1,
	}).addBoard({
		title:'Add Single Board',
		minHeight: 120,
		column: 2,
		contentUrl: 'src/content/addboard.html'
	}).addBoard({
		title:'AddBoard Options',
		minHeight: 280,
		column: 2
	}).addBoard({
		title:'Board APIs',
		minHeight: 180,
		column: 2
	}).addBoard({
		title:'knockout Binding',
		minHeight: 180,
		column: 3
	}).addBoard({
		title:'Anduglar Controller Injection',
		minHeight: 180,
		column: 3
	});
})