define(function(){
	"use restrict";
	
	var MutationObserver = window.MutationObserver
	|| window.WebKitMutationObserver
	|| window.MozMutationObserver;
	
	var createDropZone = function(){
		var dropzone = document.createElement("li");
		dropzone.style.height="50px";
		dropzone.style.zIndex="20";
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
		li.style.padding="5px 10px 5px 10px";
		li.style.minWidth="80px";
		li.style.listStyle="none";
		li.onmouseenter = function(){
			li.style.backgroundColor="#6AC4EC";
		};
		li.onmouseleave = function(){
			li.style.backgroundColor=null;
		};
		span.textContent=text;
		li.onclick= function(event){
			contextMenu.parentElement.removeChild(contextMenu);
			onclick(event);
		};
		return li;
	};
	
	var createContextMenu = function(board){
		contextMenu = document.createElement("ul");
		contextMenu.style.backgroundColor="white";
		contextMenu.style.padding="0px";
		contextMenu.style.border="1px solid #A9A3A3";
		contextMenu.style.borderRadius="4px";
		contextMenu.style.boxShadow = "1px 1px 3px #D4D1D1";
		if(board.option.removable){
			contextMenu.appendChild(createContextOption("Remove", onBoardRemove.bind(board)));
		}
		if(board.option.edit){
			contextMenu.appendChild(createContextOption("Edit", onBoardEdit.bind(board)));
		}
		contextMenu.style.position="fixed";
		contextMenu.style.zIndex="999";
		contextMenu.onmouseleave = hideContexMenu;
		return contextMenu;
	};
	
	var hideContexMenu = function(){
		contextMenu && contextMenu.parentElement && contextMenu.parentElement.removeChild(contextMenu);
	};
	
	var onBoardRemove = function(event){
		var li = this.option.element.parentElement;
		li.parentElement.removeChild(li);
	};
	
	var onBoardEdit = function(event){
		var element = this.option.element;
		var board = this;
		element.getElementsByClassName("boardContent")[0].style.display="none";
		if(element.getElementsByClassName("editBoard")[0]){
			element.getElementsByClassName("editBoard")[0].style.display=null;
			return;
		}
		if(this.option.edit.contentUrl){
			var editContent = document.createElement("div");
			editContent.classList.add("editBoard");
			var request = new XMLHttpRequest();
			request.open("GET", location.href.split("index.html")[0]+this.option.edit.contentUrl);
			request.send(null);
			request.onreadystatechange = function(){
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status === 200) {
						editContent.innerHTML = request.responseText;
						element.appendChild(editContent);
						element.parentElement.style.height = element.scrollHeight+"px";
						board.option.edit.onLoad.apply(board);
					} else {
						throw new Error("Load HTML Error", "dash-board.js");
					}
				}
			};
		}
	};
	
	var showContextMenu = function(event){
		console.log(this);
		hideContexMenu();
		createContextMenu(this);
		document.body.appendChild(contextMenu);
		contextMenu.style.top = event.clientY+"px";
		contextMenu.style.left = (event.clientX-contextMenu.scrollWidth)+"px";
	};
	
	var dropzone = createDropZone();
	var CopyOptions = function(defaultOption, option){
		var op = {};
		for(var key in defaultOption){
			op[key] = option[key]===undefined?  defaultOption[key] : option[key];
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
	
	var start = false, li, dragObj = null, X, Y, original, currLi;
	var dragstartHander = function(event){
		event.preventDefault(), start=true, dragObj = this ;
		li = currLi = dragObj.element.parentElement, original = findPageOffset(li);
		var lis = document.getElementsByClassName("boardboardLi");
		for(var i=0; i<lis.length; i++){
			lis[i].style.zIndex ="20";
		}
		dropzone.style.height = li.scrollHeight+"px";
		
		li.parentElement.insertBefore(dropzone, li);
		li.style.position="fixed";
		li.style.zIndex ="19";
		li.style.left = original.left+"px";
		li.style.top =  original.top+"px";
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
			
			var tar = document.elementFromPoint(event.pageX, event.pageY);
			while(tar && tar.parentElement && tar.tagName!=="LI"){
				tar = tar.parentElement;
			}
			if(tar && tar!= dragObj.element.parentElement && tar.tagName === "LI" && tar != currLi && tar!=dropzone){
				currLi = tar;
				tar.parentElement.insertBefore(dropzone, tar);
			}
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
		var icon = createIcon();
		title.appendChild(icon);
		icon.onclick = showContextMenu.bind(this);
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
		icon.classList.add("boardIcon");
		icon.style.width="15px";
		icon.style.display = "inline-block";
		icon.style.float = "right";
		icon.align="center";
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
		content.style.minHeight = (this.option.minHeight)+"px";
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
		name: undefined,
		title: '',
		column: undefined,
		contentUrl:undefined,
		content: undefined,
		removable: true,
		theme: undefined,
		edit: undefined,
		onLoad: function(){},
		beforeLoad: function(){}
	};
	
	var Board = function(options){
		var option = CopyOptions(boardDefalt, options);
		if(typeof option.name != 'string'){
			throw new Error("Board Must define a name",'dash-board.js');
		}
		var init = function(){
			var div = document.createElement("div");
			div.setAttribute("id", this.name);
			div.classList.add("boardboard");
			div.appendChild(createTitle.apply(this));
			div.appendChild(createContent.call(this, this.option));
			return div;
		};
		Object.defineProperties(this, {
			'option':{
				get: function(){
					return option;
				}
			},'element':{
				get: function(){return this.option.element;}
			}, 'column':{
				get: function(){return option.column;},
				set: function(val){!isNaN(val) && (option.column = val);}
			}, 'name':{
				value: option.name
			}, 'refresh':{
				get: function(){
					return function(){
						var parent;
						if(this.option.element && this.option.element.parentElement){
							parent = this.option.element.parentElement;
							parent.removeChild(this.option.element);
						}
						this.option.element = init.apply(this);
						if(parent){
							parent.appendChild(this.option.element);
							this.option.element.style.minHeight = (this.option.minHeight || this.parent.option.minHeight)+"px";
							this.option.element.style.minWidth = (this.option.minWidth || this.parent.option.minWidth)+"px";
						}
						
					}
				}
			}, 'back':{
				get: function(){
					return function(){
						for(var i=0; i< this.option.element.childElementCount; i++){
							if(this.option.element.children[i].classList.contains("boardTitle") ||
								this.option.element.children[i].classList.contains("boardContent")){
								this.option.element.children[i].style.display = null;
							}else{
								this.option.element.children[i].style.display = "none";
							}
						}
						
					}
				}
			}
		});
		this.refresh();
	};
	
	var mainDefault = {
		element: document.body,
		column: 2,
		onLoad: function(){},
		theme: 'defaultTheme',
		minHeight: 50,
		minWidth: 300
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
		var tail = standardLi();
		tail.style.height="20px";
		ul.appendChild(tail);
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
		var option = CopyOptions(mainDefault, options);
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
			}, 'init': {
				get: function(){
					return function(){
						columns = [];
						var maxColumn = columnFit(option);
						if(maxColumn < option.column){
							option.column = maxColumn;
							console.debug("Max Column Number is "+maxColumn);
						}
						for(var i=0; i<option.column; i++){
							columns.push(createUl.call(this, this.option.element, this.option.column, i));
						}
						var i = findLongestUl(columns);
						option.element.style.height = columns[i].scrollHeight + "px";
					};
				}
			}
		});
		this.init();
		window.onresize = function(){
			var maxColumn = columnFit(option);					
			if(columns.length != maxColumn){
				dashBoard.refresh();
			}
		};
	};

	var columnFit = function(option){
		return Math.min(option.column, parseInt(option.element.scrollWidth / (option.minWidth+20)));
	};
	
	var standardLi = function(){
		var li = document.createElement("li");
		li.style.position = "relative";
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
		this.style.height = board.element.scrollHeight+"px";
		this.style.width = board.element.scrollWidth+"px";
	}
	
	var createLi = function(board, columns){
		var li = standardLi(), ul;
		var col = board.column;
		if(isNaN(board.column) || board.column>columns.length){
			col = findShortestUl(columns);
		}else{
			board.column>=1 && (col = board.column-1);
		}
		ul = columns[col];
		ul.insertBefore(li, ul.lastChild);
		var offset = findOffset.call(this, li);
		li.appendChild(board.element);
		li.style.height = board.element.scrollHeight+"px";
		li.style.width = board.element.scrollWidth+"px";
		li.classList.add(board.option.theme || this.option.theme);
		Object.defineProperty(li, 'board', {value: board});
		var observer = new MutationObserver(function(mutation){
			panelChangeReactor.call(li, mutation, board);
		});
		var observeoptions = {
		  'childList': true,
		  'subtree': true,
		  'attributes': true,
		} ;
		observer.observe(li, observeoptions);
		
		return li;
	};
	
	DashBoard.prototype={
		addBoard : function(options){
			var board = new Board(options);
			for(var i in this.boards){
				if(this.boards[i].name === board.name){
					throw new Error("The board name "+board.name+" already defined.","dash-board.js");
				}
			}
			board.parent = this;
			this.boards.push(board);
			this.appendBoard(board);
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
			throw new Error('Index Not Found.',"dash-board.js");
		},

		appendBoard: function(board){
			createLi.call(this, board, this.columns);
			var i = findLongestUl(this.columns);
			this.option.element.style.height =  this.columns[i].scrollHeight + "px";
			board.element.style.minHeight = (board.option.minHeight || this.option.minHeight)+"px";
			board.element.style.minWidth = (board.option.minWidth || this.option.minWidth)+"px";
			board.option.onLoad.call(board);
		},
		
		removeBoard: function(board){
			if(typeof board === 'string'){
				board = this.getBoard(board);
			}
			var li = board.option.element.parentElement;
			li.parentElement.removeChild(li);
			return board;
		},
		
		getBoards: function(){
			return this.boards;
		},
		
		getStructure: function(){
			var cols = [];
			for(var i in this.columns){
				var ul = this.columns[i];
				var col = [];
				for(var j=0; j<ul.childElementCount; j++){
					if(ul[j].board){
						col.push(ul[j].board.name);
					}
				}
				cols.push(col);
			}
			return cols;
		},

		refresh: function(){
			while(this.option.element.children[0]){
				this.option.element.removeChild(this.option.element.children[0]);
			}
			this.init();
		}
	}
	
	return DashBoard;
});