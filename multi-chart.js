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
		dataAttribute : "",
		attributeDefaultCor : "black",
		layout : {
			width : 1000,
			height : 400,
			backgroundCor : "",
			
			tooltip : {
				show : true,
				id : "multi-chart-tooltip",
				event : "mousemove",
				cursor : "pointer",
				range : 8,
				spaceX : 0,
				spaceY : 0,
				format : ["NO: ", "Name: ", "Detail: ", "Year: "],
				/*
				 * set the css of tool tip
				 */
				css : {
					position : "absolute",
					zIndex : 3,
					top : 0,
					left : 0,
					color : "#000000",
					overflow : "visible",
					visibility : "hidden",
					fontSize : "hidden",
					textAlign : "left",
				},
			},
		},
		frame : {
			color : "#000000",
			width : 2,
			startX : 30, // space between frame and the canvas in X
			startY : 30,
			marginLeft : 35,
			marginRight : 20,
			marginTop : 20,
			marginBottom : 35,			
			
			xLabel : "",
			xLabelSpan : 2,
			xLabelStyle : {
				font : "bold 13px Arial",
				fontColor : "#000000",
				fontSpace : 20, // space between x label and frame
				spaceOffset : 20, // x label offset 
			},
			yLabel : "",			
			yLabelStyle : {
				font : "bold 14px Arial",
				fontColor : "#000000",
				fontSpace : 23, // space between y label and frame
				spacetoTop : 30, // space between first label and Top in Y frame 
			},
			pointStyle : {
				font : "bold 32px Times New Roman",
				breakStyle: "bold 60px Times New Roman",
			},
			drawLineWidth : 2,
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
	 	var toolTipPoints = new Array();
		var marginLeft = frame.marginLeft;
		var marginRight = frame.marginRight;
		var marginTop = frame.marginTop;
		var marginBottom = frame.marginBottom;
		var marginX = marginLeft + marginRight;
		var marginY = marginTop + marginBottom;
		
	 	var canvasObject = this.creatCanvasObject();
	 	var ctx = canvasObject.getContext("2d");
	 	
		if (ctx) {
			// draw the frame
		 	ctx.beginPath();
			ctx.strokeStyle= frame.color;
			ctx.lineWidth = frame.width;
			ctx.rect(marginLeft , marginTop , (maxWidth - marginX) , (maxHeight - marginY));
			ctx.stroke();
			
			// draw x label and y label
			var xLabel = frame.xLabel;
			var yLabel = frame.yLabel;
			var yLabelStyle = frame.yLabelStyle;
			var xLabelStyle = frame.xLabelStyle;
			var pointStyle = frame.pointStyle;
			var totalDates = xLabel.length;
			var totalNums = yLabel.length;
			var spaceX = (maxWidth - (1.2 * marginX)) / totalDates;			
			var spaceY = (maxHeight - (1.2 * marginY)) / totalNums;
			var beginY = marginTop + yLabelStyle.spacetoTop;
			var shownum = 0;
			var datas = config.data;
			
			for (var dateIndex = 0; dateIndex < totalDates; dateIndex++) {
				var reverseIndex = totalDates - 1 - dateIndex;
				var pointPosition = marginLeft + dateIndex * spaceX;
				
				for (var iy = beginY; iy < maxHeight - marginBottom; iy += spaceY) {
					// draw the y label
					if (!dateIndex) {
						var yLabelText = yLabel[shownum];
						var yLabelLeftX = marginLeft - yLabelStyle.fontSpace;
						var yLabelRightX = maxWidth - marginRight - yLabelStyle.fontSpace;
						var yLabelY = iy + 2;
						
						// draw y label
						ctx.font = yLabelStyle.font;
						ctx.fillStyle= yLabelStyle.fontColor;
						ctx.fillText(yLabelText , yLabelLeftX, yLabelY);
						// draw y label in the end of x
						ctx.fillText(yLabelText , yLabelRightX , yLabelY);
						shownum++;
					}
				};
				
				// draw the point and line
				var reversedate = frame.xLabel[reverseIndex];
				if (reversedate in datas) {
					// draw the line
					var metaDatas = datas[reversedate];
					
					for (metaKey in metaDatas) {
						var metaAttCor = config.attributeDefaultCor;
						var metaValue = metaDatas[metaKey];
						var detail = metaValue[1];
						/*
						 * meataValue format
						 * [yLable, detail , attribute]
						 */
						
						// set arrtibute color
						var attribute = metaValue[2];
						if (config.dataAttribute[attribute] != undefined) {
							metaAttCor = config.dataAttribute[attribute];
						};
						
						// get the y position
						var valueinY = metaValue[0];
						var nowY = this.getRelPosition(valueinY, yLabel);
						var startPointX = marginLeft + (totalDates - 1 - dateIndex) * spaceX;
						var startPointY = beginY + nowY * spaceY;

						// draw the point 
						ctx.font = pointStyle.font;
						ctx.fillStyle = metaAttCor;
						var drawPointX = startPointX - 3;
						var drawPointY = startPointY;
						ctx.fillText("." , drawPointX , startPointY);
						
						/* start save the point info to tool tip
						 *	{
						 * 		location : {
						 * 			x : "",
						 * 			y : "",
						 * 		},
						 * 		content : {
						 * 			data : [<NO.>, <Name>, <Detail>, <Year>],
						 * 			color : ""
						 * 		}
						 * 	}
						 */
						var nowPoint = {};
						nowPoint.location = {
							x : startPointX,
							y : startPointY - 2,
						};
						nowPoint.content = {
							data : [valueinY, metaKey, detail, reversedate],
							color : metaAttCor,
						};
						toolTipPoints.push(nowPoint);
						/*
						 * end save the point info to tool tip
						 */
							
						// link to next point
						for (var nextX = reverseIndex - 1; nextX >= 0; nextX--) {
							var nextDate = xLabel[nextX];
							if (datas[nextDate] != undefined) {
								// check data in next date
								var nextData = datas[nextDate];
								if (nextData[metaKey] != undefined) {
									// draw line
									var nextY = this.getRelPosition(nextData[metaKey][0], yLabel);
									var endPointX = marginLeft + nextX * spaceX;
									var endPointY = beginY + nextY * spaceY;
									ctx.strokeStyle = metaAttCor;
									ctx.lineWidth = frame.drawLineWidth;
									ctx.beginPath();
								    ctx.moveTo(startPointX, startPointY-2);
					    	 		ctx.lineTo(endPointX, endPointY-2);
									ctx.stroke();										
								} else {
									// draw end point
									ctx.font = pointStyle.breakStyle;
									ctx.fillText(".", startPointX - 7, startPointY + 2);										
								};
								break;	
							} else {
								continue;
							}
						};
						
						// check endpoint
						for (var preX = reverseIndex + 1; preX < totalDates; preX++) {
							var preDate = xLabel[preX];
							if (datas[preDate] != undefined) {
								var preData = datas[preDate];
								if (preData[metaKey] == undefined) {
	                                ctx.font = pointStyle.breakStyle;
	                                ctx.fillText(".", startPointX - 7, startPointY + 2);									
								}								
							}
							break;							
						}	
					}
				}

				if ((dateIndex) % frame.xLabelSpan == 0) {
					// draw mark point
					 var markStart = maxHeight - marginBottom;
					 var markEnd = maxHeight - marginBottom + 4;
					 
					 ctx.beginPath();
					 ctx.strokeStyle= frame.color;
					 ctx.moveTo(pointPosition , markStart);
			    	 ctx.lineTo(pointPosition , markEnd);
			    	 
			    	 // draw the x label
			    	 var xLabelText = xLabel[dateIndex];
			    	 var xLabelX = pointPosition - xLabelStyle.spaceOffset;
			    	 var xLabelY = maxHeight - marginBottom + xLabelStyle.fontSpace;
			    	 
			    	 ctx.font = xLabelStyle.font;
			    	 ctx.fillStyle= xLabelStyle.fontColor;
					 ctx.fillText(xLabelText , xLabelX , xLabelY);
					 ctx.stroke();
				};
			}
						
			//handle tooltip
			var toolTipConfig = config.layout.tooltip;
			// ste tooltip config, to record the space between tooltip and the point
			toolTipConfig.spaceX = spaceX;
			toolTipConfig.spaceY = spaceY;
			
			if (toolTipConfig.show) {
				var toolTipObject = this.ToolTipObject;
				// init tooltip
				toolTipObject.load(canvasObject, toolTipConfig);
				toolTipObject.run(toolTipPoints);
			}
		} else {
			console.error("The Tag of HTML Element is not <canvas>");
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
			
			return obj;
		} else {
			console.error("Not Get HTML Element by ID");
		}
		
		return null;
	},
	
    /*
     * get the relative position in array
     * @param string value 
     * @param array  source
     * @return float position 
     */	
     getRelPosition : function (value, source) {
     	var position = 0.00;
     	var length = source.length;
     	for (var i=0; i < length; i++) {
		   if (value >= source[i]) 
		   		break;
		};
		position += i;
		
		// get the float num
		var span = 0;
		var floatNum = 0.00;
		if (length > 1) {
			span = Math.abs(source[0] - source[1]);
		}
     	if (span) {
     		floatNum = (value - source[i]) / span;
     	};
     	position += floatNum;
     	
     	return position;
     },	
     
    /*
     * an object to show more info of one item
     */	
     ToolTipObject : {
     	toolTipElement : "",
     	serverElement : "",
     	format : "",
     	cursor : "",
     	range : "",
     	event : "",
     	id : "",
     	css : "",

		/*
		 * init the config
		 */     	
     	load : function (serverElement, config) {
     		if (typeof(config) == "object") {
     			// init config
	     		this.serverElement = serverElement;
	     		
	     		var initConfig = ["id", "format", "cursor", "range", "event", "css", "spaceX", "spaceY"];
	     		for (var i=0; i < initConfig.length; i++) {
				   var oneConfig = initConfig[i];
				   if (!config[oneConfig] || undefined == config[oneConfig]) {
				   		console.error("the config of tooltip :" + oneConfig + " is empty or missing.");
				   		return false;
				   }
				   
				   this[oneConfig] = config[oneConfig];
				};
	     		
	     		// create tooltip object
	     		this.creatToolTip(this.id);
     		} else {
 				console.error("Not input the right config for ToolTip");     			
     			return null;
     		}
     		
     	},

		/*
		 *  run combine the funtion to the element
		 */     	
     	run : function (points) {
     		// check if input is array
     		if (!(points instanceof Array)) {
     			console.error("input of ToolTip popUp function is not array.");
     			return null;
     		};
     		
     		// read the parameter from config   		
     		var serverElement = this.serverElement;
     		var toolTipElement = this.toolTipElement;
  	  		var objectStyle = toolTipElement.style;
  	  		var range = this.range;
  	  		var format = this.format;
     		var cursor = this.cursor;
     		var spaceX = this.spaceX;
     		var spaceY = this.spaceY;
     		
			var absX = this.getAbsoluteLocation(serverElement).absoluteLeft;    		     		
			var absY = this.getAbsoluteLocation(serverElement).absoluteTop;    		     		
		    /*
		     * show tool tips
		     * @param boolean flag 
		     * @param array points [{
		     * 							location : {
		     * 								x : "",
		     * 								y : "",
		     * 							},
		     * 							content : {
		     * 								data : [<NO.>, <Name>, <Detail>, <Year>],
		     * 								color : ""
		     * 							}
		     * 						},
		     * 						... 
		     *					    ] 
		     */	       	
	     	var popUp = function (event) {
				// get location of serverElement
				var left = document.documentElement.scrollLeft || document.body.scrollLeft;				
				var top = document.documentElement.scrollTop || document.body.scrollTop;
				var serverX = absX - left; 
				var serverY = absY - top;  	     		
				// get current cursor location
				var event = this.event || window.event;
				var cursorX = event.clientX;
				var cursorY = event.clientY;
				// get the relative position
				var relPositionX = cursorX - serverX;
				var relPositionY = cursorY - serverY;
	     		
	     		for (var i=0; i < points.length; i++) {
					var point = points[i];
					
					// check the if the cursor is over the point
					var location = point.location;
					var distanceX = relPositionX - location.x;
					var distanceY = relPositionY - location.y;
					var nearXFlag = (Math.abs(distanceX) <= range) ? 1 : 0;
				    var nearYFlag = (Math.abs(distanceY) <= range) ? 1 : 0;	
				    
				    // if the cursor over the point
				    if (nearXFlag && nearYFlag) {
				    	// make the cursor style as the config setting
		  	  			serverElement.style.cursor = cursor;
			  		
				  		//handle tooltip content
				  		var content = point.content;
				  		var tipContent = "";
				  		var data = content.data;
				  		for (var i=0; i < format.length; i++) {
				  			tipContent += format[i] + data[i] + "<br>";
						};	
						toolTipElement.innerHTML = tipContent;
	
						//handle tooltip style
						// get the location of tooltip	
						var toolTipX = cursorX + left - 1.5 * spaceX;			
						var toolTipY = cursorY + top - 3 * spaceY;			
				  		objectStyle.backgroundColor = content.color;
						objectStyle.visibility="visible";
						objectStyle.left= toolTipX + "px";
						objectStyle.top = toolTipY + "px";
						
						break;			    	
				    } else {
				    	// clear the style of cursor and clear content of tooltip
						serverElement.style.cursor = "";
					  	objectStyle.innerHTML=""
					 	objectStyle.visibility="hidden";			    	
				    };		   
				};
	     	};
     		
     		this.addHandler(this.serverElement, this.event, popUp);
     	},

	    /*
	     * create tooltip element
	     * @param string id
	     * @return dom element object 
	     */	      	
     	creatToolTip : function (id){
     		if (id) {
	     		var toolTipElement = document.createElement("div");
	     		toolTipElement.innerHTML = "";
	     		toolTipElement.id = id;
				
				// append element to html	     		
	     		document.body.appendChild(toolTipElement);
	     		
	     		// set tooltipelement
	     		var toolTipElement = document.getElementById(id);
	     		this.toolTipElement = toolTipElement;
	     		
	     		// set css 
	     		var style = toolTipElement.style;
	     		var css = this.css;
	     		for (item in css) {
	     			style[item] = css[item];
	     			if (style[item] == undefined) {
	     				console.error("wrong name at css of tooltip of " + item);
	     			}
	     		}
     		} else {
				console.error("Empty ToolTip ID"); 
				return null;    			
     		};
     	},
     
	    /*
	     * get the absolute location of element
	     * @param object element 
	     * @return json location 
	     */	     	
		getAbsoluteLocation : function (element) {
		    if ( arguments.length != 1 || element == null ){ 
		        return null; 
		    } 
		    var offsetTop = element.offsetTop; 
		    var offsetLeft = element.offsetLeft; 
		    var offsetWidth = element.offsetWidth; 
		    var offsetHeight = element.offsetHeight;
		     
		    while( element = element.offsetParent ) { 
		        offsetTop += element.offsetTop; 
		        offsetLeft += element.offsetLeft; 
		    }
		     
		    return {
		    	absoluteTop: offsetTop,
		    	absoluteLeft: offsetLeft, 
		        offsetWidth: offsetWidth,
				offsetHeight: offsetHeight
			};      		
		}, 
     	
	    /*
	     * add event lisener to the element
	     * @param DOM object element 
	     * @param string type 
	     * @param function handler 
	     */	     	
		addHandler : function (element,type,handler) {
			if (element.addEventListener) {
				element.addEventListener(type,handler,false);
				return true;
            } else if (element.attachEvent) {
                element.attachEvent("on" + type,handler);
                return true;
            } else {
                element["on" + type] = handler;
                return true;
            }
            
            return false;
		},
     }     
     	
}
