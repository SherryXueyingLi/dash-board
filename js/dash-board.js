define(function(){
	"use restrict";
	
	var MutationObserver = window.MutationObserver
	|| window.WebKitMutationObserver
	|| window.MozMutationObserver;
	
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
		span.onselectstart = function() { return false; };
		span.style.color="gray";
		div.appendChild(span);
		dropzone.appendChild(div);
		return dropzone;
	};
	var contextMenu;
	var createContextOption = function(text, onclick){
		var li = document.createElement("li");
		var span = document.createElement("span");
		li.appendChild(span);
		span.textContent=text;
		li.onclick= function(event){
			contextMenu.parentElement.remove(contextMenu);
			onclick.call(li, event);
		};
		return li;
	}
	
	var createContextMenu = function(board){
		var menu = document.createElement("ul");
		menu.style.board="solid 1px gray";
		menu.appendChild(createContextOption("Close", onBoardClose));
		menu.appendChild(createContextOption("Remove", onBoardRemove));
		return menu;
	};
	
	var onBoardRemove = function(){
		
	};
	
	var onBoardClose = function(){
		
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
		return {top: top-window.scrollY, left: left-window.scrollX};
	};
	
	var start = false, li, dragObj = null, X, Y, original;
	var dragstartHander = function(event){
		start=true;
		dragObj = this;
		li = dragObj.element.parentElement;
		original = findPageOffset(li);
		li.parentElement.insertBefore(dropzone, li);
		li.style.position="fixed";
		var lis = document.getElementsByClassName("boardboardLi");
		for(var i=0; i<lis.length; i++){
			lis[i].style.zIndex ="20";
		}
		li.style.zIndex ="0";
		li.style.left = original.left+"px";
		li.style.top =  original.top+"px";
		dropzone.style.height = li.scrollHeight+"px";
		X = event.pageX, Y = event.pageY;
		
	};
	
	var dragHandler = function(event){
		if(start && dragObj){
			event.preventDefault();
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
			liElement.style.zIndex="20";
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
		title.classList.add("boardTitle");
		title.style.backgroundColor = this.option.color;// || "#469CD6";
		title.style.height ="20px";
		title.style.padding = "3px 10px 3px 10px";
		var span = document.createElement("span");
		span.textContent=this.option.title;
		//span.style.color="white";
		span.style.fontWeight="bold";
		span.style.cursor="move";
		title.appendChild(span);
		/*var icon = createIcon();
		icon.style.width="15px";
		icon.style.display = "inline-block";
		icon.style.float = "right";
		icon.align="center";
		title.appendChild(icon);*/
		span.onmousedown = dragstartHander.bind(this);
		return title;
	};
	
	var createIcon = function(color){
		var icon = document.createElement("div");
		for(var i=0; i<3; i++){
			icon.appendChild(createRow("#469CD6"));
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
				icon.children[i].style.borderColor="#469CD6";
			}
		}
		return icon;
	}
	
	var createRow = function(color){
		var a = document.createElement("div");
		a.style.border="solid";
		a.style.borderWidth="1px";
		a.style.borderColor=color;
		a.style.margin="2px";
		return a;
	}
	
	var createContent = function(option){
		var content = document.createElement("div");
		content.classList.add("boardContent");
		//content.style.padding = "3px 10px 3px 10px";
		var board = this;
		if(option.contentUrl){
			var request = new XMLHttpRequest();
			request.open("GET", location.href.split("index.html")[0]+option.contentUrl);
			request.send(null);
			request.onreadystatechange = function(){
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status === 200) {
						content.innerHTML = request.responseText;
						board.element.parentElement.style.height = board.element.scrollHeight+"px";
					} else {
						throw new Error("Load HTML Error", "dash-board.js");
					}
				}
			};
		}else if(option.content){
			content.innerHTML=option.content;
		}
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
		minHeight: 50,
		column: undefined,
		contentUrl:undefined,
		content: undefined,
		removeble: true,
		theme: undefined,
		onLoad: function(){}
	};
	
	var Board = function(options){
		var option = CopyOptions(boardDefalt, options);
		Object.defineProperties(this, {
			'option':{
				get: function(){return option;}
			},'element':{
				get: function(){return this.option.element;}
			}, 'column':{
				get: function(){return option.column;},
				set: function(val){!isNaN(val) && (option.column = val);}
			}
		});
		var init = function(){
			var div = document.createElement("div");
			div.classList.add("boardboard");
			div.style.minHeight = this.option.minHeight+"px";
			div.style.width = "100%";
			var title = createTitle.apply(this);
			div.appendChild(title);
			div.appendChild(createContent.call(this, this.option));
			return div;
		};
		this.option.element = init.apply(this);
	};
	
	var boardDefaultOptions = {
		element: document.body,
		column: 2,
		onLoad: function(){},
		theme: 'defaultTheme'
	};
	var createUl = function(parent, totalColumn, i){
		var ul = document.createElement("ul");
		ul.style.position = "absolute";
		ul.style.margin = "0px";
		ul.style.listStyle="none";
		ul.style.padding="0px";
		
		ul.style.display = "inline-block";
		parent.appendChild(ul);
		ul.style.width = parent.scrollWidth/totalColumn +"px";
		ul.style.left = parent.scrollWidth/totalColumn * i +"px";
		var li = standardLi();
		li.style.height="20px";
		ul.appendChild(li);
		return ul;
	};
	
	var findLongestUl = function(columns){
		if(!columns) throw new Error("UL Columns not found!", "dash-board.js");
		var index=0;
		for(var i=1; i<columns.length; i++){
			if(columns[i].scrollHeight > columns[index].scrollHeight){
				index=i;
			}
		}
		return index;
	}
	
	var DashBoard = function(options){
		var dashBoard = this, columns=[];
		var boards = [];
		var option = CopyOptions(boardDefaultOptions, options);
		if(typeof option.element === 'string'){
			option.element = document.getElementById(option.element) || document.body;
		}
		if(option.column <0) option.column=2;
		option.element.style.position="relative";
		option.element.style.zIndex="999";
		option.element.classList.add("dashBoard");
		
		Object.defineProperties(this, {
			'boards':{
				get: function(){return boards;}
			},'option':{
				get: function(){return option;}
			},'columns':{
				get: function(){return columns;}
			},'right':{
				get: function(){return right;}
			}
		});
		
		for(var i=0; i<option.column; i++){
			columns.push(createUl.call(this, this.option.element, this.option.column, i));
		}
		//option.onNewBoard.call(this);
		var i = findLongestUl(columns);
		option.element.style.height = columns[i].scrollHeight + "px";
		option.element.style.width =  option.element.scrollWidth + "px";
	};
	
	var standardLi = function(){
		var li = document.createElement("li");
		li.style.position = "relative";
		li.onmouseover=mouseOverLi.bind(li);
		li.classList.add("boardboardLi");
		li.style.padding = "10px";
		return li;
	};
	
	var findShortestUl = function(columns){
		if(!columns) throw new Error("UL Columns not found!", "dash-board.js");
		var index=0;
		for(var i=1; i<columns.length; i++){
			if(columns[i].scrollHeight < columns[index].scrollHeight){
				index=i;
			}
		}
		return index;
	};
	
	var panelChangeReactor = function(mutation, board){
		board.element.parentElement.style.height = board.element.scrollHeight+"px";
	}
	
	var createLi = function(board, columns){
		var li = standardLi(), ul;
		if(isNaN(board.column)){
			board.column = findShortestUl(columns);
		}else{
			board.column>=1 && board.column--;
		}
		ul = columns[board.column];
		ul.insertBefore(li, ul.lastChild);
		var offset = findOffset.call(this, li);
		li.appendChild(board.element);
		li.style.height = board.element.scrollHeight+"px";
		li.style.width = board.element.scrollWidth+"px";
		li.classList.add(board.option.theme || this.option.theme);
		
		var observer = new MutationObserver(function(mutation){
			panelChangeReactor.call(this, mutation, board);
		});
		var observeoptions = {
		  'childList': true,
		  'subtree': true
		} ;
		observer.observe(li, observeoptions);
		
		return li;
	};
	
	DashBoard.prototype={
		addBoard : function(options){
			var board = new Board(options);
			var column = board.column;
			createLi.call(this, board, this.columns);
			this.boards.push(board);
			var i = findLongestUl(this.columns);
			this.option.element.style.height =  this.columns[i].scrollHeight + "px";
			
			board.parent = this;
			board.option.onLoad.call(this);
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