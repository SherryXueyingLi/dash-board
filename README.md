# Dash-Board

It is a pure code configured, freely draggable, user controllable dash board.

See the [demo](http://sherryxueyingli.github.io/dash-board/) page. 

## How to use

Use with requireJs: 

	require.config({
		paths: {
			'dashBoard': 'js/dash-board'
		}
	})
	require(['dashBoard'], function(DashBoard){
		var dashboard = new DashBoard({
				element: border, 
				column: 3,
			});
	});
			
**Options**

|| Attribute Name || Default Value || Description||
| element| document.body | The element Object or id of the element Object. |
| column| 2 | How many columns in the page | 


## Add Dash Board
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
		})
		
**Options**

|| Attribute Name || Default Value || Description||
| title | empty string | The dash board title|
| minHeight| 50 | The min-height of the board. |
| column| auto find the column with shortest height | Which column do you want to put this board in. | 
|content| | The content of the board, this option will be ignored if 'contentUrl' is set. |	
|content| | The relative path of the content file|	  			