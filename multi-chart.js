/**
 * Copyright (c) 2015 Leo Pan (leo.pan@aliyun.com)
 * Official site: http://www..com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIabel FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var MultiChartJS = {
	
	config : {
		id : "multi-chart-js" ,
		data : "",
		layout : {
			width : 1000,
			height : 400,
			backgroundCor : "",
			
			tooltip : {
				show : true,
			},
		},
		frame : {
			color : "#000000",
			width : 2,
			startX : 30, // space between frame and the canvas in X
			startY : 20,
			xLabel : "",
			xLabelSpan : 2,
			yLabel : "",			
			yLabelStyle : {
				font : "bold 14px Arial",
				fontColor : "#000000",
				fontSpace : 20, // space between y label and frame
				spacetoTop : 30, // space between first label and Top in Y frame 
			},
			pointStyle : {
				font : "bold 30px Times New Roman",
				fontColor : "#000000",			
			}
		},
	},
    /*
     * change the config of the chart.
     */
	setConfig : function(config) {
        var property;
        if(typeof (config) !== "object") {
            alert("Invalid configuration!");
            return false;
        }
        
        this.config = this.resetJSON(this.config, config);
	},
	
    /*
     * draw the chart.
     */
	draw : function() {
		var config = this.config;
		var maxWidth = config.layout.width;
		var maxHeight = config.layout.height;
	 	var frame = config.frame;
		var startx = frame.startX;
		var starty = frame.startY;
	 	var ctx = this.creatCanvasObject();
		if (ctx) {
			// draw the frame
		 	ctx.beginPath();
			ctx.strokeStyle= frame.color;
			ctx.lineWidth = frame.width;
			ctx.rect(startx , starty , (maxWidth - 2 * startx) , (maxHeight - 2 * starty));
			ctx.stroke();
			
			// draw x label and y label
			var items =10;
			var xLabel = frame.xLabel;
			var yLabel = frame.yLabel;
			var yLabelStyle = frame.yLabelStyle;
			var pointStyle = frame.pointStyle;
			var totalDates = xLabel.length;
			var totalNums = yLabel.length;
			var spacex = (maxWidth - (2.5 * startx)) / totalDates;			
			var spacey = (maxHeight - (3 * starty)) / totalNums;
			var beginy = starty + yLabelStyle.spacetoTop;
			var shownum = 0;
			var endx = maxWidth-startx;
			var datas = config.data;
			
			for (var i = 0; i < totalDates; i++) {
				var reverseIndex = totalDates - 1 -i;
				var reversedate = frame.xLabel[reverseIndex];
				
				var pointPosition = startx + i * spacex;
				for (var iy = beginy; iy < maxHeight-30; iy += spacey) {
					// draw the y label
					if (i == 0) {
						ctx.font = yLabelStyle.font;
						ctx.fillStyle= yLabelStyle.fontColor;
						ctx.fillText(yLabel[shownum++] , startx - yLabelStyle.fontSpace, iy + 1);
						ctx.fillText(shownum,endx - yLabelStyle.fontSpace,iy+1);
					}
					
					// draw the point
					if (reversedate in datas) {
						ctx.font = pointStyle.font;
						ctx.fillStyle = pointStyle.fontColor;
						ctx.fillText("." , pointPosition - 4 , iy);
					}
				};
			}			
			
			
			
		};
		
			
	},	
	

    /*
     * reset the data in resouce json from the new one
     * @param json res
     * @param json changed 
     * @return json 
     */	
	resetJSON : function(res, changed) {
		if(typeof(changed) !== "object") {
			return res;
		}
		
		var item;
        for(item in changed) {
            if(res[item] !== undefined) {
            	if(typeof(res[item]) == "object") {
            		// copy array 
            		if (res[item].constructor == Array) {
            			if(changed[item].constructor == Array) {
            				for (var i=0; i < changed[item].length; i++) {
	        					res[item].push(changed[item][i]);
							};
            			}
            		} else {
            			// copy json 
	            		res[item] = this.resetJSON(res[item], changed[item]);
            		}            		
            	} else {
            		// copy string
            		res[item] = changed[item];
            	}
            }
        }
        
        return res;		
	},
	
    /*
     * create canvas object
     * @param string id
     * @return canvas object 
     */	
	creatCanvasObject : function() {
		var layout = this.config.layout;
		var obj = document.getElementById(this.config.id);
		if (obj){
			// set object perporty
			obj.width = layout.width;
			obj.height = layout.height;
			if(layout.backgroundCor) {
				obj.style.backgroundColor = layout.backgroundCor;
			}
			
			var context = obj.getContext("2d");
			if (context) {
				return context;
			} else {
				console.error("The Tag of HTML Element is not <canvas>");
			};
		} else {
			console.error("Not Get HTML Element by ID");
		}
		
		return null;
	},	
}
