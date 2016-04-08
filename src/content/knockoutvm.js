define(["knockout"], function(ko){
	var vm = function(){
		this.testBind = ko.observable('2016-04-08'); 
		this.show = ko.pureComputed(function(){
			return 'You just picked : '+ this.testBind();
		}); 
	};
	return vm;
})