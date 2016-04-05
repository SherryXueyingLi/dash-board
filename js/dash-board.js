define(function(){
	"use restrict";
	
	var CopyOptions = function(defaultOption, option){
		var op = {};
		for(var key in defaultOption){
			op[key] = option[key] || defaultOption[key];
		}
		
		return op;
	};
	
	var createTitle = function(){
		var title = document.createElement("div");
		title.classList.add("bord-title");
		title.style.backgroundColor = this.option.color || "#469CD6";
		title.style.height ="20px";
		var span = document.createElement("span");
		span.textContent=this.option.title;
		span.style.color="white";
		span.style.fontWeight="bold";
		title.appendChild(span);
		return title;
	};
	
	var createContent = function(){
		var content = document.createElement("div");
		content.style.minHeight = (this.option.minHeight-20)+"px";
		return content;
	}
	
	var findOffset =function (element){
		var top = 0, left = 0, start = element;
		var actualTop = element.offsetTop;
		var current = element.parentElement;
		while (current !== null && current!=this.option.element){
			left += current.offsetLeft;
			top += current.offsetTop;
			current = current.offsetParent;
		}
		return {top: top, left: left};
	};
	
	var boardDefalt ={
		element: document.createElement("div"),
		title: '',
		minHeight: 100,
		column: 0
	};
	
	var dragHandler = function(event){
		console.log(event);
	};
	var dropHandler = function(event){
	};
	
	var ondragenterHander = function(event){
		event.preventDefault();
		this.option.element.classList.add("board-drapover");
	};
	var ondragendHander = function(event){
		event.preventDefault();
		this.option.element.classList.remove("board-drapover");
	}
	
	var ondragleaveHander = function(event){
		event.preventDefault();
		this.option.element.classList.remove("board-drapover")
	};
	
	var Board = function(options){
		var option = CopyOptions(boardDefalt, options);
		option.column === 'left' && (option.column = 0);
		option.column === 'right' && (option.column = 1);
		Object.defineProperties(this, {
			'option':{
				get: function(){return option;}
			},'element':{
				get: function(){return this.option.element;}
			}, 'column':{
				value: option.column
			}
		});
		var init = function(){
			var div = document.createElement("div");
			div.classList.add("boardboard");
			div.style.minHeight = this.option.minHeight+"px";
			
			div.appendChild(createTitle.apply(this));
			div.appendChild(createContent.apply(this));
			return div;
		};
		
		this.option.element = init.apply(this);
		this.option.element.ondrag = dragHandler.bind(this);
		this.option.element.draggable="true"
		this.option.element.ondrop = dropHandler.bind(this);
		this.option.element.ondragenter = ondragenterHander.bind(this);
		this.option.element.ondragleave = ondragleaveHander.bind(this);
	};
	
	var defaultOptions = {
		element: document.body,
		column: 2
	};
	
	var createUl = function(){
		var ul = document.createElement("ul");
		ul.style.position = "relative";
		ul.style.margin = "0px";
		ul.style.listStyle="none";
		ul.style.padding="0px";
		ul.style.width = (100/this.option.column)+"%";
		ul.style.display = "inline-block";
		this.option.element.appendChild(ul);
		return ul;
	}
	var DashBoard = function(options){
		var dashBoard = this, left, right;
		var boards = [];
		var option = CopyOptions(defaultOptions, options);
		if(typeof option.element === 'string'){
			option.element = document.getElementById(option.element) || document.body;
		}
		if(option.column <0 || option.column>2) option.column=2;
		option.element.style.position="relative";
		option.element.classList.add("dashBoard");
		
		Object.defineProperties(this, {
			'boards':{
				get: function(){return boards;}
			},'option':{
				get: function(){return option;}
			},'left':{
				get: function(){return left;}
			},'right':{
				get: function(){return right;}
			}
		});
		left = createUl.apply(this);
		if(option.column===2){
			right = createUl.apply(this);
			right.style.position="absolute";
		}
	};
	
	var createLi = function(board){
		var li = document.createElement("li");
		li.style.padding = "10px";
		var ul = board.column === 0? this.left : this.right;
		ul.appendChild(li);
		var offset = findOffset.call(this, li);
		li.appendChild(board.element);
		/*board.element.style.position="absolute";
		board.element.style.left = offset.left+"px";
		board.element.style.top = offset.top+"px";
		this.option.element.appendChild(board.element);*/
	}
	DashBoard.prototype={
		addBoard : function(options){
			var board = new Board(options);
			var column = board.column;
			createLi.call(this, board);
			this.boards.push(board);
			board.parent = this;
			return this;
		},
		getBoard : function(index){
			if(isNaN(index)){
				for(var i in this.boards){
					if(this.boards[i].name === index){
						return this.boards[i];
					}
				}
			}else{
				return this.boards[index];
			}
			throw new Error('Index Not Found.','DashBoard');
		}
	}
	
	
	
	return DashBoard;
});