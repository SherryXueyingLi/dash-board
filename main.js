require.config({
	paths: {
		'dashBoard': 'js/dash-board'
	}
})

require(['dashBoard'], function(DashBoard){
	var border = document.getElementById("dashboard");
	var dashboard = new DashBoard({
		element: "dashboard",
		column: 3,
		theme: 'blueSky'
	});
	dashboard.addBoard({
		title:'Init the board',
		minHeight: 120,
		content: '<div style="padding: 5px;"><p>To Init the board:</p><code>var dashboard = new DashBoard({options});</code></div>'
	}).addBoard({
		title:'Init Board Options',
		column: 1,
		contentUrl: 'src/content/initoption.html'
	}).addBoard({
		title:'Add Single Board',
		minHeight: 120,
		column: 2,
		contentUrl: 'src/content/addboard.html'
	}).addBoard({
		title:'AddBoard Options',
		contentUrl: 'src/content/addboardOption.html',
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