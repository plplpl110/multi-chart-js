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
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var MultiChartJS = {
	
	config : {
		id : "multi-chart-js" ,
		width : 1000,
		height : 400,
		lable : {
			font : "ddd",
			size : "32px",
		}
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
            		res[item] = this.resetJSON(res[item], changed[item]);
            	} else {
            		res[item] = changed[item];
            	}
            }
        }
        
        return res;		
	},
}
