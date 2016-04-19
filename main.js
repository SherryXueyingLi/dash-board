require.config({
	paths: {
		'dashBoard': 'js/dash-board',
		'knockout': 'src/lib/knockout-3.3.0',
		'vm': 'src/content/knockoutvm',
		"angular": "src/lib/angular.min",
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
	},
});

require(['dashBoard', "knockout", "angular"], function(DashBoard, ko, angular){
	"use restrict";
	
	
	var border = document.getElementById("dashboard");
	var app = angular.module("angularBoard",[]);
	app.config(function($controllerProvider, $compileProvider){
		app.controllerProvider = $controllerProvider;
		app.compileProvider = $compileProvider;
	});
	window.dashboard = new DashBoard({
		element: "dashboard",
		column: 3,
		theme: 'blueSky'
	});
	dashboard.addBoard({
		name: 'init',
		title:'Init the board',
		minHeight: 120,
		content: '<div style="padding: 5px;"><p>To Init the board:</p><code><key>var</key> dashboard = <key>new</key> DashBoard({options});</code></div>'
	}).addBoard({
		name: 'initOption',
		title:'Init Board Options',
		column: 1,
		contentUrl: 'src/content/initoption.html'
	}).addBoard({
		name: 'board',
		title:'Add Single Board',
		minHeight: 120,
		column: 2,
		contentUrl: 'src/content/addboard.html'
	}).addBoard({
		name: 'boardOption',
		title:'AddBoard Options',
		contentUrl: 'src/content/addboardOption.html',
		column: 2
	}).addBoard({
		name: 'koBind',
		title:'knockout Binding',
		minHeight: 180,
		column: 3,
		contentUrl: 'src/content/knockout.html',
		onLoad: function(){
			require(["knockout", "vm"],function(ko, vm){
				ko.applyBindings(vm, document.getElementById('knockout'));
			});
		}
	}).addBoard({
		name: 'angular',
		title:'Anduglar Controller Injection',
		minHeight: 180,
		column: 3,
		contentUrl: 'src/content/angular.html',
		onLoad: function(){
			var board = this;
			require(['src/content/angularController'], 
				function(AngularController){
				app.controller('demoContrl', AngularController);
				angular.bootstrap(board.element, ['angularBoard']);
			});
		},
		removable: false,
		edit: {
			contentUrl: 'src/edit/angularEdit.html',
			onLoad: function(){
				
			}
		}
	});
	
	dashboard.addBoard({
		name: 'api',
		title:'Dash Board APIs',
		column: 1,
		contentUrl: 'src/content/dashboardApis.html',
	}).addBoard({
		name: 'boardApi',
		title:'Single Board APIs',
		contentUrl: 'src/content/addboardAPIs.html',
		minHeight: 180,
		column: 1
	});
});