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
		var marginLeft = frame.marginLeft;
		var marginRight = frame.marginRight;
		var marginTop = frame.marginTop;
		var marginBottom = frame.marginBottom;
		var marginX = marginLeft + marginRight;
		var marginY = marginTop + marginBottom;
		
	 	var ctx = this.creatCanvasObject();
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
						
						// set arrtibute color
						var attribute = metaValue[2];
						if (config.dataAttribute[attribute] != undefined) {
							metaAttCor = config.dataAttribute[attribute];
						};
						
						// get the y position
						var nowY = this.getRelPosition(metaValue[0], yLabel);
						var startPointX = marginLeft + (totalDates - 1 - dateIndex) * spaceX;
						var startPointY = beginY + nowY * spaceY;

						// draw the point 
						ctx.font = pointStyle.font;
						ctx.fillStyle = metaAttCor;
						ctx.fillText("." , startPointX - 3 , startPointY);
							
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
								    ctx.moveTo(startPointX + 2, startPointY-2);
					    	 		ctx.lineTo(endPointX + 2, endPointY-2);
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
				
			 	// // draw line
				ctx.lineWidth = frame.drawLineWidth;
				ctx.beginPath();

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
}
