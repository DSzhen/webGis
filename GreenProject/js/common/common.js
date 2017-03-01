/**
 * 非gis公共类
 * @author 2016.6.27 songcy
 * @constructor
 */
function common() {};
common.prototype = {
		/**
		 * 获取坐标数组的中间点坐标
		 * @param {Array} array
		 * @return {Array} coordinate
		 */
		getCenterCoordinate: function(array) {
			var len = array.length;
			if((len / 2) % 2 == 1) {
				return [array[len / 2 - 1], array[len / 2]]
			} else {
				return [array[len / 2], array[len / 2 + 1]]
			}
		},

	}
	/**
	 * @param {Object} radioname//單元按鈕組名稱
	 * @return {radio} radio//單選按鈕
	 */
common.getSelectRadio = function(radioname) {
		var radio;
		var chkObjs = document.getElementsByName(radioname);
		for(var i = 0; i < chkObjs.length; i++) {
			if(chkObjs[i].checked) {
				radio = chkObjs[i];
				break;
			}
		}
		return radio;
	}
	/*
	/**获取从当前时刻之前的12个小时列表
	 * @param {Object} starttime,起始小时
	 */
common.get12hourslist = function(starttime) {
	var hours = new Array();
	if(parseInt(starttime) - 11 >= 0) {
		for(var i = 11; i >= 0; i--) {
			hours.push(parseInt(starttime) - i);
		}

	} else {
		var count = 11 - parseInt(starttime);
		for(var i = count; i > 0; i--) {
			hours.push(24 - i);
		};
		for(var i = 0; i <= parseInt(starttime); i++) {
			hours.push(i);
		}
	};
	return hours;
}
/*数组求和*/
 common.sum=function(arguments) {
	var r = 0;
	for (var i = 0; i < arguments.length; i++) {

		r = arguments[i] + r;

	}
	return r;
}
/*
/**获取从当前时刻之前的24个小时列表
 * @param {Object} starttime,起始小时
 */
common.get24hourslist = function(starttime) {
	var hours = new Array();

	for(var i = parseInt(starttime) + 1; i < 24; i++) {
		hours.push(i);
	};
	for(var i = 0; i <= parseInt(starttime); i++) {
		hours.push(i);
	}

	return hours;
}
/**ajax请求
 * @param {Object} url，请求地址
 * @param {Object} callback，返回成功的回调函数
 */
 common.ajaxRequst=function (url, callback) {
	$.ajax({
		type: "get", //使用get方法访问后台
		dataType: "jsonp", //返回json格式的数据
		url: url,
		jsonpCallback:'callback',
		success: function(result) {
			callback(result);
		},
		error: function() {
			layer.closeAll();
			alert("请求失败");
		}
	});
}
/**
 * 格式化日期类型
 */
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * 导出excel表格
 */
common.ExportExcel = function(tableid) {
	if(getExplorer() == 'ie') {
		var curTbl = document.getElementById('statictable');
		var oXL = new ActiveXObject("Excel.Application");
		var oWB = oXL.Workbooks.Add();
		var xlsheet = oWB.Worksheets(1);
		var sel = document.body.createTextRange();
		sel.moveToElementText(curTbl);
		sel.select();
		sel.execCommand("Copy");
		xlsheet.Paste();
		oXL.Visible = true;

		try {
			var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
		} catch(e) {
			print("Nested catch caught " + e);
		} finally {
			oWB.SaveAs(fname);
			oWB.Close(savechanges = false);
			oXL.Quit();
			oXL = null;
			//			idTmr = window.setInterval("Cleanup();", 1);
		}

	} else {
		tableToExcel(tableid)
	}
	
	function getExplorer() {
		var explorer = window.navigator.userAgent;
		//ie  
		if(explorer.indexOf("MSIE") >= 0) {
			return 'ie';
		}
		//firefox  
		else if(explorer.indexOf("Firefox") >= 0) {
			return 'Firefox';
		}
		//Chrome  
		else if(explorer.indexOf("Chrome") >= 0) {
			return 'Chrome';
		}
		//Opera  
		else if(explorer.indexOf("Opera") >= 0) {
			return 'Opera';
		}
		//Safari  
		else if(explorer.indexOf("Safari") >= 0) {
			return 'Safari';
		}
	}

}
var tableToExcel = (function() {
		var uri = 'data:application/vnd.ms-excel;base64,',
			template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
			base64 = function(s) {
				return window.btoa(unescape(encodeURIComponent(s)))
			},
			format = function(s, c) {
				return s.replace(/{(\w+)}/g,
					function(m, p) {
						return c[p];
					})
			}
		return function(table, name) {
			if(!table.nodeType) table = document.getElementById(table)
			var ctx = {
				worksheet: name || 'Worksheet',
				table: table.innerHTML
			}
			window.location.href = uri + base64(format(template, ctx))
		}
	})()
