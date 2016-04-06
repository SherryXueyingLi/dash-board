define(function(){
	"use restrict";
	
	
	var createDropZone = function(){
		var dropzone = document.createElement("li");
		dropzone.style.height="50px";
		dropzone.style.zIndex="-1";
		dropzone.style.padding = "10px";
		var div = document.createElement("div");
		div.style.height="100%";
		div.style.border="dashed 3px gray";
		div.align ="center";
		var span = document.createElement("h2");
		span.textContent="Drop Here";
		span.style.color="gray";
		div.appendChild(span);
		dropzone.appendChild(div);
		return dropzone;
	};
	
	var dropzone = createDropZone();
	var CopyOptions = function(defaultOption, option){
		var op = {};
		for(var key in defaultOption){
			op[key] = option[key] || defaultOption[key];
		}
		
		return op;
	};
	
	var findPageOffset =function (element){
		var top = element.offsetTop, left = element.offsetLeft, start = element;
		var current = element.parentElement;
		while (current !== null){
			left += current.offsetLeft;
			top += current.offsetTop;
			current = current.offsetParent;
		}
		return {top: top, left: left};
	};
	
	var start = false, li, dragObj = null, X, Y, original;
	var dragstartHander = function(event){
		start=true;
		dragObj = this;
		li = dragObj.element.parentElement;
		original = findPageOffset(li);
		li.parentElement.insertBefore(dropzone, li);
		li.style.position="fixed";
		li.style.zIndex ="-1";
		li.style.left = original.left+"px";
		li.style.top =  original.top+"px";
		dropzone.style.height = li.scrollHeight+"px";
//		original = {
//			left: +li.style.left.split("px")[0],
//			top: +li.style.top.split("px")[0]
//		}
		X = event.pageX, Y = event.pageY;
		
	};
	
	var dragHandler = function(event){
		if(start && dragObj){
			var xPage = event.pageX, yPage = event.pageY;//--
			var moveX = xPage - X + original.left;
			var moveY = yPage - Y +  original.top;
			li.style.left = moveX+"px";
			li.style.top =  moveY+"px";
		}
	};
	
	var dragendHandler = function(event){
		start=false, li = null;
		if(dragObj){
			var liElement = dragObj.element.parentElement;
			liElement.style.position="relative";
			liElement.style.left="0px";
			liElement.style.top="0px";
			if(dropzone.parentElement){
				dropzone.parentElement.insertBefore(dragObj.element.parentElement, dropzone);
				dropzone.parentElement.removeChild(dropzone);
			}
			liElement.style.zIndex = null;
			dragObj = null;
		}
		
	};
	
	
	var mouseOverLi = function(event){
		if(start && dragObj){
			if(dropzone.parentElement && dropzone.parentElement!== this.parentElement){
				dropzone.parentElement.removeChild(dropzone);
			} 
			this.parentElement.insertBefore(dropzone, this);
		}
	};
	document.onmousemove = dragHandler;
	document.onmouseup = dragendHandler;
	
	var createTitle = function(){
		var title = document.createElement("div");
		title.classList.add("bord-title");
		title.style.backgroundColor = this.option.color || "#469CD6";
		title.style.height ="20px";
		
		var span = document.createElement("span");
		span.textContent=this.option.title;
		span.style.color="white";
		span.style.fontWeight="bold";
		span.style.cursor="move";
		title.appendChild(span);
		
		var icon = createIcon();
		icon.style.width="15px";
		icon.style.display = "inline-block";
		icon.style.float = "right";
		icon.align="center";
		title.appendChild(icon);
		span.onmousedown = dragstartHander.bind(this);
		return title;
	};
	
	var createIcon = function(){
		var icon = document.createElement("div");
		for(var i=0; i<3; i++){
			icon.appendChild(createRow());
		}
		icon.align="center";
		icon.style.cursor="pointer";
		icon.onmouseover = function(){
			for(var i=0; i<icon.childElementCount; i++){
				icon.children[i].style.borderColor="#EFC433";
			}
		};
		icon.onmouseout =function(){
			for(var i=0; i<icon.childElementCount; i++){
				icon.children[i].style.borderColor="white";
			}
		}
		return icon;
	}
	
	var createRow = function(){
		var a = document.createElement("div");
		a.style.border="solid";
		a.style.borderWidth="1px";
		a.style.borderColor="white";
		a.style.margin="2px";
		return a;
	}
	
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
			div.style.width = "100%";
			var title = createTitle.apply(this);
			div.appendChild(title);
			div.appendChild(createContent.apply(this));
			return div;
		};
		this.option.element = init.apply(this);
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
		
		var li = standardLi();
		li.style.height="20px";
		ul.appendChild(li);
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
		option.element.style.zIndex="999";
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
	
	var standardLi = function(){
		var li = document.createElement("li");
		li.style.position = "relative";
		li.onmouseover=mouseOverLi.bind(li);
		li.classList.add("boardboardLi");
		li.style.padding = "10px";
		return li;
	}
	
	var createLi = function(board){
		var li = standardLi();
		
		var ul = board.column === 0? this.left : this.right;
		ul.insertBefore(li, ul.lastChild);
		var offset = findOffset.call(this, li);
		li.appendChild(board.element);
		li.style.height = board.element.scrollHeight+"px";
		li.style.width = board.element.scrollWidth+"px";
		
		return li;
	};
	
	
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