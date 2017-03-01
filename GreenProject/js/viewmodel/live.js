// 开始........ 实况资料功能
/**添加实况监测数据
 * @param {Object} livetype,实况数据类型
 */
var livetype = 'temp'; //选中的实况类型
var stationtype = '1'; //站点类型集合，[1,2,18] 自动站,1,多要素,18,区域站,2
var showstationinfo = 'none'; //图层上显示的站点信息，包括，不显示、站点名称、站点编号
var livetime = new Date(new Date().getTime()).Format('yyyyMMddhh')+"00"; //查询的实况时间2016100810
//var livetime = new Date().Format('yyyyMMddhh'); //查询的实况时间2016100810
var layertype = 0; //图层类型，0:站点显示 或 1:图斑形式 2:等值面 3：等值线
var selectfeature; //选中的要素
var currentFeatures = {}; //用来圈选的数据
/**
 * 静态初始化方法，用于加载地图，设置页面的初始值等
 */
function init() {
	//全局地图变量
	initMap();
//	map = gisCommon.createGeoWMSMap(map, commonConfig.geoserverUrl, commonConfig.baseLayerName, ol.proj.transform(commonConfig.baseLayerCenter, commonConfig.dataProjection, commonConfig.featureProjection), commonConfig.baseLayerZoom);
	ol.control.initPopup(map, 'popup', 'popup-content', 'popup-closer');
	initData();
	initMapControl();
	initDate();
}
/**初始化地图**/
function initMap(){
	map = new ol.Map({
		target:"map",
		view:new ol.View({
			projection:commonConfig.featureProjection,
			center:ol.proj.transform(commonConfig.baseLayerCenter,commonConfig.dataProjection,commonConfig.featureProjection),
			zoom:commonConfig.baseLayerZoom,
			maxZoom:commonConfig.baseLayerMaxzoom,
			minZoom:commonConfig.baseLayerMinzoom
		}),
		controls: [
			new ol.control.ScaleLine(),
			new ol.control.Attribution()
		],
	})
	$.ajax('../../data/boundary.geojson', {
		dataType: 'json',
		success: function(result) {
			var vectorSource = new ol.source.Vector({
				features: (new ol.format.GeoJSON()).readFeatures(result, {
					dataProjection: commonConfig.dataProjection,
					featureProjection: commonConfig.featureProjection
				})
			});
			var vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'blue',
						width: 2
					})
				}),
			});
			vectorLayer.set("layerid", "geoserverlayer") //设置矢量图层的layerid，用于查找该图层
			map.addLayer(vectorLayer);
		},
		error: function() {
			alert("请求失败");
		}
	})
}
/**
 * 初始化图例和地图
 * **/
function initMapControl() {
	ol.control.initLayerSwitcher(map, 'online', liveconfig,'矢量');
	var titleControl = new ol.control.CanvasTitle();
	map.addControl(titleControl);
	var legendControl = new ol.control.CanvasLegend();
	map.addControl(legendControl);
	legendControl.setVisible(false);
	map.titleControl = titleControl;
	map.legendControl = legendControl;
}
//时间选择器
function initDate() {
	$.datetimepicker.setLocale('ch');
	$('.startDate').datetimepicker({
		format: "Y-m-d H时",
		timepicker: true,
		todayButton: true,
		value: new Date(new Date().getTime() - 60 * 60 * 1000)
	});
	$('.endDate').datetimepicker({
		format: "Y-m-d H时",
		timepicker: true,
		todayButton: true,
		value: new Date()
	});
}
function initData() {
	addLiveLayer();
}
/**ajax请求
 * @param {Object} url，请求地址
 * @param {Object} callback，返回成功的回调函数
 */
function ajaxRequst(url, callback) {
	layer.load(0, {
		shade: [0.2, '#000']
	});
	$.ajax({
		type: "get", //使用get方法访问后台
		dataType: "json", //返回json格式的数据
		url: url,
		cache :false,
		timeout: 30000,
//		jsonpCallback: 'callback',
		success: function(result) {
			layer.closeAll();
			callback(result);
		},
		error: function() {
			layer.closeAll();
			alert("请求失败");
			ol3_layerHelper.setLayersVisiblity(map, ['livelayer'], false);
			ol3_layerHelper.setLayersVisiblity(map, ['warmlayer'], false);
		}
	});
}
/**
 * 
 * 前一小时数据
 */
function forwardHour() {
	var year = livetime.substring(0,4);
	var month = livetime.substring(4,6);
	var day = livetime.substring(6,8);
	var hour = livetime.substring(8,10);
	livetime = year+"-"+month+"-"+day+" "+hour+":00:00";
	livetime = new Date(new Date(livetime).getTime()-60 * 60 * 1000).Format('yyyyMMddhh')+"00";	
	addLiveLayer();
}
/**
 * 后一小时数据
 */
function afterHour() {
	var year = livetime.substring(0,4);
	var month = livetime.substring(4,6);
	var day = livetime.substring(6,8);
	var hour = livetime.substring(8,10);
	livetime = year+"-"+month+"-"+day+" "+hour+":00:00";
	livetime = new Date(new Date(livetime).getTime()+60 * 60 * 1000).Format('yyyyMMddhh')+"00";
	addLiveLayer();
}
/**
 * 当前数据
 */
function currentHour() {
	livetime = new Date().Format('yyyyMMddhh')+"00";
	addLiveLayer();
}
/**
 * 后一天数据
 * **/
function forwardDay(){
	var year = livetime.substring(0,4);
	var month = livetime.substring(4,6);
	var day = livetime.substring(6,8);
	var hour = livetime.substring(8,10);
	livetime = year+"-"+month+"-"+day+" "+hour+":00:00";
	livetime = new Date(new Date(livetime).getTime()+60 * 60 * 1000*24).Format('yyyyMMddhh')+"00";
	addLiveLayer();
}
/**
 * 后一天数据
 * **/
function afterDay(){
	var year = livetime.substring(0,4);
	var month = livetime.substring(4,6);
	var day = livetime.substring(6,8);
	var hour = livetime.substring(8,10);
	livetime = year+"-"+month+"-"+day+" "+hour+":00:00";
	livetime = new Date(new Date(livetime).getTime()-60 * 60 * 1000*24).Format('yyyyMMddhh')+"00";
	addLiveLayer();
}
/**请求实况数据
 * @param {Object} livetype
 */
function addLiveLayer() {
	var url;
	switch(livetype) {
		case '03':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+"2016101709"  + '&&eletype=03';
			break;
		case '06':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime  + '&&eletype=06';
			break;
		case '12':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime  + '&&eletype=12';
			break;
		case '24':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=24';
			break;
		case '48':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=48';
			break;
		case '09':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=09';
			break;
		case '0808':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=0808';
			break;
		case '0820':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=0820';
			break;
		case '2020':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=2020';
			break;
		case '2008':
			url = liveconfig['rainUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime + '&&eletype=2008';
			break;
		default:
			url = liveconfig['liveUrl'] + '?stationtype=' + stationtype + '&&datatime='+livetime;
			break;
	}
	if(livetype == '0808' || livetype == '0820' || livetype == '2020' || livetype == '2008' ){
		document.getElementById('forward').onclick = function(){ forwardDay();} 
		document.getElementById('after').onclick = function(){ afterDay();} 
	}else{
		document.getElementById('forward').onclick = function(){ forwardHour();} 
		document.getElementById('after').onclick = function(){ afterHour();} 
	}
	ajaxRequst(url, liveCallBack);
}
/**实况数据返回后的回调函数
 * @param {Object} result
 */
function liveCallBack(result) {
	layer.closeAll();
	if(result.data == undefined || result.data.length == 0) {
		alert('未查询到实况数据');
		ol3_layerHelper.setLayersVisiblity(map, ['livelayer'], false);
		ol3_layerHelper.setLayersVisiblity(map, ['warmlayer'], false);
		ShowLiveInfo(livetime, livetype);
		return;
	}
	var geojson = liveResultToGeojson(result);
	addClusterVectorLayer(geojson[0], 'livelayer', livetextStyleCluster);
	addVectorLayer(geojson[1], 'warmlayer', livetextStyle);
	ShowWarmInfos(geojson[0]);
	ol3_layerHelper.setLayersVisiblity(map, ['livelayer'], true);
	//地图缩放至实况图层范围
	//	gisCommon.ZoomTo(map, ol3_layerHelper.getLayerById(map, 'livelayer').getSource().getExtent());
	if(gisCommon.getSelectInteraction(map) == undefined)
		addSelectInteraction();

	if(layertype == 2) {
		layertype = 0;
		createContourPoly();
	} else if(layertype == 3) {

		layertype = 0;
		createContourLine();
	}
	livetime = result.datatime.toString();
	ShowLiveInfo(livetime, livetype);
}
/**实况返回结果转换为geojson
 * @param {Object} livejson
 */
function liveResultToGeojson(livejson) {
	var result = new Array();
	var result1 = {
		"type": "FeatureCollection",
		"features": []
	}; //正常值的集合
	var result2 = {
		"type": "FeatureCollection",
		"features": []
	}; //预警值集合
	var warmresult = {
		"type": "FeatureCollection",
		"features": []
	}; //所有告警列表
	result.push(result1);
	result.push(result2);
	result.push(warmresult);
	var datas = livejson.data;
	var isPush =true;
	for(var i = 0; i < datas.length; i++) {
		var f = {
			"type": "Feature",
			"properties": {},
			"geometry": {}
		};
		var g = {
			"type": "Point",
			"coordinates": ol.proj.transform([parseFloat(datas[i]['longitude']), parseFloat(datas[i]['latitude'])], commonConfig.dataProjection, commonConfig.featureProjection)
		};
		f.geometry = g;
		for(var key in datas[i]) {
			f.properties[key] = datas[i][key];
		}
		switch(livetype) {
			case 'temp':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['threshold_maxtemp'] !=undefined && datas[i]['warnConfig']['threshold_mintemp'] !=undefined){
							if(parseFloat(datas[i]['temp']) != 999.9 && parseFloat(datas[i]['temp']) > parseFloat(datas[i]['warnConfig']['threshold_maxtemp'])) {
								result2.features.push(f);
								var fclone = f;
								fclone.properties['warmtype'] = 'threshold_maxtemp';
								fclone.properties['warmtypechinese'] = '温度';
								fclone.properties['warmvalue'] = datas[i]['temp'];
								warmresult.features.push(fclone);
								isPush=false;
							} else if(parseFloat(datas[i]['temp']) < parseFloat(datas[i]['warnConfig']['threshold_mintemp'])) {
								result2.features.push(f);
								var fclone = f;
								fclone.properties['warmtype'] = 'threshold_mintemp';
								fclone.properties['warmtypechinese'] = '温度';
								fclone.properties['warmvalue'] = datas[i]['temp'];
								warmresult.features.push(fclone);
								isPush=false;
							}
						}
				}
				if(parseFloat(datas[i]['temp']) != 999.9){
					if(isPush){
						result1.features.push(f);
					}
				}
				break;
			case 'rianamount':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['threshold_rianamount'] !=undefined){
						if(parseFloat(datas[i]['rianamount']) != 999.9 && parseFloat(datas[i]['rianamount']) > parseFloat(datas[i]['warnConfig']['threshold_rianamount'])) {
							result2.features.push(f);
							var fclone = f;
							fclone.properties['warmtype'] = 'threshold_rianamount';
							fclone.properties['warmtypechinese'] = '降雨量';
							fclone.properties['warmvalue'] = datas[i]['rianamount'];
							warmresult.features.push(fclone);
							isPush=false;
						}
					}
				}
				if(parseFloat(datas[i]['rianamount']) != 999.9){
					if(isPush){
						result1.features.push(f);
					}
				}
					break;
			case 'windv':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['threshold_windv'] !=undefined){
						if(parseFloat(datas[i]['windv']) != 999.9 && parseFloat(datas[i]['windv']) > parseFloat(datas[i]['warnConfig']['threshold_windv'])) {
							result2.features.push(f);
							var fclone = f;
							fclone.properties['warmtype'] = 'threshold_windv';
							fclone.properties['warmtypechinese'] = '风速';
							fclone.properties['warmvalue'] = datas[i]['windv'];
							warmresult.features.push(fclone);
							isPush=false;
						}
					}
				}
				if(parseFloat(datas[i]['windv']) != 999.9){
					if(isPush){
						result1.features.push(f);						
					}
				}
				break;
			case 'visib':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['threshold_visib'] !=undefined){
						if(parseFloat(datas[i]['visib']) != 999.9 && parseFloat(datas[i]['visib']) > parseFloat(datas[i]['warnConfig']['threshold_visib'])) {
							result2.features.push(f);
							var fclone = f;
							fclone.properties['warmtype'] = 'threshold_visib';
							fclone.properties['warmtypechinese'] = '能见度';
							fclone.properties['warmvalue'] = datas[i]['visib'];
							warmresult.features.push(fclone);
							isPush=false;
						}
					}
				}
				if(parseFloat(datas[i]['visib']) != 999.9){
					if(isPush){
						result1.features.push(f);						
					}
				}
				break;
			case 'press':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['threshold_press'] !=undefined){
						if(parseFloat(datas[i]['press']) != 999.9 && parseFloat(datas[i]['press']) > parseFloat(datas[i]['warnConfig']['threshold_press'])) {
							result2.features.push(f);
							var fclone = f;
							fclone.properties['warmtype'] = 'threshold_press';
							fclone.properties['warmtypechinese'] = '风速';
							fclone.properties['warmvalue'] = datas[i]['press'];
							warmresult.features.push(fclone);
							isPush=false;
						}
					}
				}
				if(parseFloat(datas[i]['press']) != 999.9){
					if(isPush){
						result1.features.push(f);						
					}
				}
				break;	
			case 'relhum':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['threshold_relhum'] !=undefined){
						if(parseFloat(datas[i]['relhum']) != 999.9 && parseFloat(datas[i]['relhum']) > parseFloat(datas[i]['warnConfig']['threshold_relhum'])) {
							result2.features.push(f);
							var fclone = f;
							fclone.properties['warmtype'] = 'threshold_relhum';
							fclone.properties['warmtypechinese'] = '风速';
							fclone.properties['warmvalue'] = datas[i]['relhum'];
							warmresult.features.push(fclone);
							isPush=false;
						}
					}
				}
				if(parseFloat(datas[i]['relhum']) != 999.9){
					if(isPush){
						result1.features.push(f);						
					}
				}
				break;
			case '03':
			case '06':
			case '09':
			case '12':
			case '24':
			case '48':
			case '72':
			case '0808':
			case '0820':
			case '2020':
			case '2008':
				if(datas[i]['warnConfig'] !=undefined){
					if(datas[i]['warnConfig']['warnValue'] !=undefined){
						if(parseFloat(datas[i]['amount']) != 999.9 && parseFloat(datas[i]['amount']) > parseFloat(datas[i]['warnConfig']['threshold_amount'])) {
							result2.features.push(f);
							var fclone = f;
							fclone.properties['warmtype'] = 'warnValue';
							fclone.properties['warmtypechinese'] = '降雨量';
							fclone.properties['warmvalue'] = datas[i]['amount'];
							warmresult.features.push(fclone);
							isPush=false;
						}
					}
				}
				if(parseFloat(datas[i]['amount']) != 999.9){
					if(isPush){
						result1.features.push(f);						
					}
				}
				break;
			default:
				result1.features.push(f);
				break;
		}
	}
	return result;
}

/**显示实况信息
 * @param {Object} data 2016050112
 * @param {Object} livetype
 */
function ShowLiveInfo(data, livetype) {
	if(livetype == '03' || livetype == '06' || livetype == '12'|| livetype == '09' || livetype == '24' || livetype == '48' || livetype == '72' || livetype == '0808' || livetype == '2020' || livetype == '2008' || livetype == '0820'){
		var label = data.substr(0, 4) + '年' + data.substr(4, 2) + '月' + data.substr(6, 2) + '日'+ GetChinese(livetype);
	}else{
		var label = data.substr(0, 4) + '年' + data.substr(4, 2) + '月' + data.substr(6, 2) + '日' + data.substr(8, 2) + '时 ' + GetChinese(livetype);	
	}
	map.titleControl.setStyle(new ol.style.Style({
		text: new ol.style.Text({
			text: label,
			font: "bold 24px 宋体",

			fill: new ol.style.Fill({
				color: "#2889d7"
			})
		})
	}));
}
/**
 * 显示告警信息
 */
function ShowWarmInfos(geojson) {
	var features = (new ol.format.GeoJSON()).readFeatures(geojson);
		var oTable = document.getElementById("statictable");
		var rowNum = oTable.rows.length;
		for(i = 1; i < rowNum; i++) {
			oTable.deleteRow(i);
			rowNum = rowNum - 1;
			i = i - 1;
		}
		var tbody = document.getElementById("tablestatics_tbody");
		$.each(features, function(i, feature) {
		var oTr = document.createElement("tr"); //新建一个tr类型的Element节点
		oTr.tag = feature;
		oTr.setAttribute('onclick', "ontrclick(this)");
		var oTd = document.createElement("td"); //新建一个td类型的Element节点
		oTd.innerHTML = feature.get('stationnum');
		oTr.appendChild(oTd);
		var oTd = document.createElement("td"); //新建一个td类型的Element节点
		oTd.innerHTML = feature.get('stationname');
		oTr.appendChild(oTd);
		var oTd = document.createElement("td"); //新建一个td类型的Element节点
		var type=livetype;
		if(livetype == '03' || livetype == '06' || livetype == '12'|| livetype == '09' || livetype == '24' || livetype == '48' || livetype == '72' || livetype == '0808' || livetype == '2020' || livetype == '2008' || livetype == '0820'){
			type="amount";
		}
		oTd.innerHTML = feature.get(type);
		oTr.appendChild(oTd);
		tbody.appendChild(oTr);
	});
	var head = oTable.createTHead();
}

function ontrclick(e) {
	if(e.tag == undefined) return;
	var feature = e.tag;
	selectfeature = feature;
	ShowPop(selectfeature);
}
/*
/**根据标注字段返回相应的单位
 * @param {Object} type
 */
function GetUnit(type) {
	var result;
	switch(type) {
		case "temp":
		case "Temp":
		case "Temp1":
		case "Temp24":
		case "MaxTempHour":
		case "MinTempHour":
		case "AvgTempDay":
		case "MaxTempDay":
		case "MinTempDay": //温度
			result = '℃';
			break;
		case "relhum":
		case "RelHum": //湿度
			result = '%';
			break;
		case "press":
		case "SeaPress":
		case "Press": //压力
			result = 'hPa';
			break;
		case "rianamount":
		case "RainAmountHour":
		case "RianAmount6":
		case "RianAmount12":
		case "RianAmount24":
		case "amount":
		case "Amount":
		case "06":
		case "09":
		case "24":

		case "Rian4":
		case "Rian3":
		case "Rain3Day": //降水
			result = 'mm';
			break;
		case "visib":
		case "Visib": //能见度
			result = 'm';
			break;
		case "windv":
		case "ExMaxWindDV":
		case "ExMaxWindVDay":
		case "MaxWindDV":
		case "MaxWindVDay":
		case "MaxWindVHour":
		case "ExMaxWindVHour": //风速
			result = 'm/s';
			break;
		default:
			break;
	}
	return result;
};

/**根据所选实况类型转换成相应的中文，用于显示图例的标题等
 * @param {Object} type
 */
function GetChinese(type) {
	for(var key in liveconfig.livedictionary) {
		if(liveconfig.livedictionary[key] == type)
			return key;
	}
}
/**添加地图的select事件
 * @param {Object} layerid,可选择的图层id
 */
function addSelectInteraction(layerid) {
	if(ol3_layerHelper.getLayerById(map, layerid) == undefined) return;
	$('#popup-content')[0].style.height = '380px';
	$('#popup-content')[0].style.width = '600px';
	var select = new ol.interaction.Select({
		layers: [ol3_layerHelper.getLayerById(map, 'livelayer'), ol3_layerHelper.getLayerById(map, 'warmlayer')],
	});
	select.on('select', function(e) {
		if(e.selected.length > 0) {
			if(e.selected[0].get('features') == undefined) {
				selectfeature = e.selected[0];
				ShowPop(selectfeature);
			} else if(e.selected[0].get('features').length == 1) {
				selectfeature = e.selected[0].get('features')[0];
				ShowPop(selectfeature);
			}
		} else
			map.getOverlayById('featurepopupid').setPosition(undefined);
	});
	map.addInteraction(select);
}

function ShowPop(feature) {
	map.getOverlayById('featurepopupid').setPosition(feature.getGeometry().getCoordinates());
	add12HoursMonitoring(feature.get('stationnum'), livetime, livetype);
}
/**添加12小时监测数据
 * @param {Object} stationnum,站编号
 * @param {Object} datatime，时间
 * @param {Object} type，实况类型
 */
function add12HoursMonitoring(stationnum, datatime, type) {
	var type = livetype;
	if(livetype == '03' || livetype == '06' || livetype == '12'|| livetype == '09' || livetype == '24' || livetype == '48' || livetype == '72' || livetype == '0808' || livetype == '2020' || livetype == '2008' || livetype == '0820'){
			type="rianamount";
	}
	$.ajax({
		type: "get", //使用get方法访问后台
		dataType: "jsonp", //返回json格式的数据
		cache:false,
//		url: '../../data/12hourlivedata.xml',
		url: liveconfig['live24Url']+"?datatime="+datatime+"&stationnum="+stationnum+'&mtype='+type,
		jsonpCallback: 'add124hour',
		success: function(result) {
			var chartdiv = document.getElementById('popup-content');
			var mychart = echarts.init(chartdiv);
			mychart.setOption(createchart(selectfeature.get('stationname'), result.datatime, result.mtype, result.data));
		},
		error: function() {
			alert("")
		}
	});
}

function add124hour(result) {
	var chartdiv = document.getElementById('popup-content');
	var mychart = echarts.init(chartdiv);
	mychart.setOption(createchart(selectfeature.get('stationname'), result.datatime, result.mtype, result.data));
}
/*根据12小时实况数据生成折线图*/
function createchart(stationname, datatime, type, data) {
	var lengends = (function() {
		var result = new Array();
		$.each(type, function(i, item) {
			result.push(GetChinese(item))
		});
		return result;
	})()
	var yAxises = (function() {
		var result = new Array();
		if(type.length <= 2) {
			$.each(type, function(i, item) {
				result.push({
					type: 'value',
					scale: false,
					min: Math.round(Math.min.apply(null, data[item]), 0),
					max: Math.round(Math.max.apply(null, data[item]) + 1, 0),
					position: 'left',
					axisLine: { // 轴线
						show: true,
						lineStyle: {
							color: 'red',
							type: 'dashed',
							width: 2
						}
					},
					axisTick: { // 轴标记
						show: true,
						length: 10,
						lineStyle: {
							color: 'green',
							type: 'solid',
							width: 2
						}
					},
					axisLabel: {
						show: true,
						interval: 0, // {number}
						margin: 18,
						formatter: function(value) {
							return(parseFloat(value) * 1000 / 1000) + GetUnit(item)
						}, // Template formatter!
						textStyle: {
							color: '#1e90ff',
							fontFamily: 'verdana',
							fontSize: 8,
							fontStyle: 'normal',
						}
					},

				})
			});
		} else {
			result.push({
				type: 'value',
				position: 'left',
				boundaryGap: false,
				axisLine: { // 轴线
					show: true,
					lineStyle: {
						color: 'red',
						type: 'dashed',
						width: 2
					}
				},
				axisTick: { // 轴标记
					show: true,
					length: 10,
					lineStyle: {
						color: 'green',
						type: 'solid',
						width: 2
					}
				},
				axisLabel: {
					show: true,
					interval: 'auto', // {number}
					margin: 18,
					formatter: '{value}', // Template formatter!
					textStyle: {
						color: '#1e90ff',
						fontFamily: 'verdana',
						fontSize: 8,
						fontStyle: 'normal',
					}
				},

			})
		}
		return result;
	})();
	var serieses = (function() {
		var result = new Array();
		var index = 0;
		if(type.length <= 2) {
			$.each(data, function(i, item) {
				for(var m = 0; m < item.length; m++) {
					if(item[m] == 999.9) {
						item[m] = undefined;
					}
				}
				result.push({
					name: GetChinese(i),
					yAxisIndex: index++,
					type: 'line',
					//					data: [11,null, 15, 13, 12, 13, 10, 13, 12, 13, 10, 13, 12, 13, 10, 13, 12, 13, 10, 10, 13, 12, 13, 10],
					data: item
				})
			});
		} else {
			$.each(data, function(i, item) {
				for(var m = 0; m < item.length; m++) {
					if(item[m] == 999.9) {
						item[m] = undefined;
					}
				}
				result.push({
					name: GetChinese(i),
					type: 'line',
					//					data: [11,null, 15, 13, 12, 13, 10, 13, 12, 13, 10, 13, 12, 13, 10, 13, 12, 13, 10, 10, 13, 12, 13, 10],
					data: item
				})
			});
		}
		return result;
	})();
	return {
		title: {
			text: stationname,
			subtext: gettimeformat("汉字", datatime),
			x: 'center'
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			data: lengends,
			y: 'bottom'
		},
		calculable: true,
		toolbox: {
			show: true,
			feature: {

				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
			}
		},
		xAxis: [{
			type: 'category',
			position: 'bottom',
			boundaryGap: true,
			axisLine: { // 轴线
				show: true,
				lineStyle: {
					color: 'green',
					type: 'solid',
					width: 2
				}
			},
			axisTick: { // 轴标记
				show: true,
				length: 10,
				lineStyle: {
					color: 'red',
					type: 'solid',
					width: 2
				}
			},
			axisLabel: {
				show: true,
				interval: 'auto', // {number}
				margin: 8,
				formatter: '{value}时',
				textStyle: {
					color: 'lightlilac',
					fontFamily: '微软雅黑',
					fontSize: 13,
				}
			},

			data: common.get24hourslist(datatime.substr(8, 2))
		}],
		yAxis: yAxises,

		series: serieses,

	};

}
/*将字符串时间格式化，type表示格式化的类型，可选：' '、'\'、'-'、'汉字'*/
function gettimeformat(type, timestring) {
	var result;
	if(type == "汉字")
		result = timestring.substring(0, 4) + '年' + timestring.substring(4, 6) + '月' + timestring.substring(6, 8) + '日' + timestring.substring(8, 10) + '时';
	else
		result = timestring.substring(0, 4) + type + timestring.substring(4, 6) + type + timestring.substring(6, 8) + type + timestring.substring(8, 10);
	return result;
}

// 结束........ 实况资料功能
// 开始........ 查询统计功能
function livetypeSelChanged() {
	var type = $('#livetype_sl')[0].options[$('#livetype_sl')[0].selectedIndex].value;
	$('#livesubtype_sl')[0].options.length = 0;
	var subselect = $('#livesubtype_sl')[0];
	switch(type) {
		case '气温':
			subselect.options.add(new Option("最低气温", "min"));
			subselect.options.add(new Option("最高气温", "max"));
			subselect.options.add(new Option("平均气温", "prev"));
			break;
		case '雨量':
			subselect.options.add(new Option("最小雨量", "min"));
			subselect.options.add(new Option("最大雨量", "max"));
			subselect.options.add(new Option("累计雨量", "sum"));
			break;
		case '风速':
			subselect.options.add(new Option("最小风速", "min"));
			subselect.options.add(new Option("最大风速", "max"));
			break;
		case '气压':
			subselect.options.add(new Option("最低气压", "min"));
			subselect.options.add(new Option("最高气压", "max"));
			break;
		case '湿度':
			subselect.options.add(new Option("最低湿度", "min"));
			break;
		default:
			break;
	}
}
/**
 * 导出表格，保存为excel
 */
function ExpertTable() {
	common.ExportExcel('statictable')
}
/*下载地图，前端实现*/
function exportMap(btn) {
	map.once('postcompose', function(event) {
		var url = event.context.canvas.toDataURL('image/png');
		$(btn).prop('href', url);
		setTimeout(function() {
			map.renderSync();
		}, 500);
	});
	map.renderSync();
}
/**等值面数据返回后的回调函数
 * @param {Object} result
 */
function createContourPoly(features) {

	if(ol3_layerHelper.getLayerById(map, 'livelayer') == undefined) return;
	layertype = layertype != 2 ? 2 : 0;
	if(layertype == 2) {
		var livecontour = new Contour({
			url: liveconfig.contourUrl,
			features: features == undefined ? gisCommon.getSources(map, 'livelayer').concat(gisCommon.getSources(map, 'warmlayer')) : features,
			featuresproject: commonConfig.featureProjection,
			fieldname: livetype,
			type: 'polygon',
			citycode: '1000000',
			inter: liveconfig.contourinter[livetype]
		});

		livecontour.createContour(function(result) {
			$(".dengxian").css("background-color", "#337AB7");
			$(".dengmian").css("background-color", "#FAA644");

			loadContour(result);
			ol3_layerHelper.setLayersVisiblity(map, ['contourlayer'], true);
			ol3_layerHelper.getLayerById(map, 'livelayer').setZIndex(10);
			ol3_layerHelper.getLayerById(map, 'warmlayer').setZIndex(10);
		});
	} else {
		$(".dengmian").css("background-color", "#337AB7");
		map.legendControl.setVisible(false);
		ol3_layerHelper.setLayersVisiblity(map, ['contourlayer'], false);
		ol3_layerHelper.setLayersVisiblity(map, ['livelayer', 'warmlayer'], true);
	}

}
/**等值线数据返回后的回调函数
 * @param {Object} result
 */
function createContourLine(features) {

	if(ol3_layerHelper.getLayerById(map, 'livelayer') == undefined) return;
	layertype = layertype != 3 ? 3 : 0;
	if(layertype == 3) {
		var livecontour = new Contour({
			url: liveconfig.contourUrl,
			features: features == undefined ? gisCommon.getSources(map, 'livelayer').concat(gisCommon.getSources(map, 'warmlayer')) : features,
			featuresproject: commonConfig.featureProjection,
			fieldname: livetype,
			type: 'line',
			citycode: '1000000',
			inter: liveconfig.contourinter[livetype]
		});
		//生成等值线后的回调函数，分级渲染地图
		livecontour.createContour(function(result) {
			$(".dengxian").css("background-color", "#FAA644");
			$(".dengmian").css("background-color", "#337AB7");
			
			loadContour(result);
		});
	} else {
		$(".dengxian").css("background-color", "#337AB7");
		map.legendControl.setVisible(false);
		ol3_layerHelper.setLayersVisiblity(map, ['contourlayer'], false);
		ol3_layerHelper.setLayersVisiblity(map, ['livelayer'], true);
	}

}
/**
 * 等值线面处理数据的方法(加载到map上)
 * **/
function loadContour(result) {
	var geoObj = result;
	var layername = 'contourlayer';
	var styleFunciton;
	if(layertype==2){
		styleFunciton=getContourPolyStyle
	}else{
		styleFunciton=getContourLineStyle
	}
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(geoObj, {
			dataProjection: commonConfig.dataProjection,
			featureProjection: commonConfig.featureProjection
		})
	});
	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: styleFunciton,
		zIndex: 0
	});
	vectorLayer.set("layerid", layername);

	var oldLayer = ol.mapUtil.getLayerById(map, layername);
	if(oldLayer) {
		map.removeLayer(oldLayer);
	}
	map.addLayer(vectorLayer);
	refreshCanvasLegend();
}
/**
 * 生成图例
 * **/
function refreshCanvasLegend() {
	var type = getCurrentType();
	var textObj = {};
	textObj.rendercolor = liveconfig.rendercolor[type];
	if(typeof(textObj.rendercolor[0][2])!='string') {
		$.each(textObj.rendercolor, function(i, data) {
			data[2] = 'rgb(' + data[2][0] + ',' + data[2][1] + ',' + data[2][2] + ')';
		});
	}

	textObj.title = '图例';

	map.legendControl.setVisible(true);

	map.legendControl.setStyle(new ol.style.Style({
		text: new ol.style.Text({
			text: JSON.stringify(textObj),
			font: "bold 20px 宋体",
			fill: new ol.style.Fill({
				color: "#222"
			})
		})
	}));
}
/**
 * 获取等值面样式
 * @param {Object} f
 */
function getContourPolyStyle(f) {
	var v = f.getProperties()['lvalue'];
	var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: getFeatureColor(v)
		}),
		stroke: new ol.style.Stroke({
			color: '#555555',
			width: 0.5
		})
	})
	return style;
}/**
 * 获取等值线样式
 * @param {Object} f
 */
function getContourLineStyle(f) {
	var v = f.get('value');
	var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: getFeatureColor(v)
		}),
		stroke: new ol.style.Stroke({
			color: getFeatureColor(v),
			width: 0.5
		})
	})
	return style;
}
/**
 * 色标接口数据处理颜色
 * **/
function getFeatureColor(val) {
	var type = getCurrentType();
	var rendercolor = liveconfig.rendercolor[type];
	if(typeof(rendercolor[0][2])!='string') {
		$.each(rendercolor, function(i, data) {
			data[2] = 'rgb(' + data[2][0] + ',' + data[2][1] + ',' + data[2][2] + ')';
		});
	}
	var color = '#ffffff';
	$.each(rendercolor, function(index, data) {
		if(data[0] == 'min' && val < data[1] || data[1] == 'max' && val >= data[0] || val < data[1] && val >= data[0]) {
			color = data[2];
		}
	});
	return color;
}

function getCurrentType(){
	var type;
	type=livetype;
	return type;
}
/**
 * 点击2级菜单
 * **/
$('.monitoring').click(function(){
	$('#monitoring_div').fadeToggle();
});
$('.sum').click(function(){
	$('#sum_div').fadeToggle();
});
$('.radar').click(function(){
	$('#radar_div').fadeToggle();
});
$('.sate').click(function(){
	$('#sate_div').fadeToggle();
});
/**过滤数据**/
$('.chaxun').click(function(){
	var starttime='';
	var endtime='';
	var mtype='';
	var opra='';
	var con=[];
	var value='';
	var formula='';
	//类型
	if($('#livetype_sl option:selected') .val() != null && $('#livetype_sl option:selected') .val() != undefined){
		if($('#livetype_sl option:selected').val()=='气温'){
			mtype='temp';
			livetype="temp";
		}else if($('#livetype_sl option:selected').val()=='雨量'){
			mtype='rianamount';
			livetype="rianamount";
		}else if($('#livetype_sl option:selected').val()=='风速'){
			mtype='windv';
			livetype="windv";
		}else if($('#livetype_sl option:selected').val()=='气压'){
			mtype='press';
			livetype="press";
		}else if($('#livetype_sl option:selected').val()=='湿度'){
			mtype='relhum';
			livetype="relhum";
		}
	}
	//类型的条件
	if($('#livesubtype_sl option:selected') .val() != null && $('#livesubtype_sl option:selected') .val() != ""){
		opra = $('#livesubtype_sl option:selected') .val();
	}
	//公式
	if($('#filtertype_sl option:selected') .val() != null && $('#filtertype_sl option:selected') .val() != ""){
		formula = $('#filtertype_sl option:selected') .val()
	}
	//值
	if($('#filtervalue').val() != null && $('#filtervalue').val() != ""){
		value = $('#filtervalue').val();
		con.push(formula,value);
	}
	//开始时间
	if($('.startDate').val() != null && $('.startDate').val() != undefined){
		starttime = $('.startDate').val(); 
		starttime = starttime.replace("-","").replace("-","").replace(" ","").replace("时","");
	}
	//结束时间
	if($('.endDate').val() != null && $('.endDate').val() != undefined){
		endtime = $('.endDate').val();
		endtime = endtime.replace("-","").replace("-","").replace(" ","").replace("时","");
	}
	if(con.length==0){
		ajaxRequst(liveconfig['filterUrl']+"?starttime="+starttime+"&endtime="+endtime+"&mtype="+mtype+"&opra="+opra,liveCallBack);
	}else{
		ajaxRequst(liveconfig['filterUrl']+"?starttime="+starttime+"&endtime="+endtime+"&mtype="+mtype+"&opra="+opra+"&con=["+con+"]",liveCallBack);	
	}
});
/**添加geojson数据到地图，不使用聚簇功能
 * @param {Object} geojson，geojson数据
 * @param {Object} layerid，图层的id
 * @param {Object} layerstyle，图层的样式
 */
function addVectorLayer(geojson, layerid, layerstyle) {
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(geojson),
	});
	currentFeatures[layerid] = vectorSource.getFeatures();
	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: layerstyle
	});
	vectorLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
	vectorLayer.setVisible(true);
	if(ol3_layerHelper.getLayerById(map, layerid) == undefined)
		map.addLayer(vectorLayer);
	else {
		ol3_layerHelper.getLayerById(map, layerid).setSource(vectorSource);
		ol3_layerHelper.getLayerById(map, layerid).setStyle(layerstyle);
	}
	vectorLayer.on('postcompose', animate);
	//	gisCommon.ZoomTo(map, vectorSource.getExtent());
	//添加图例	
	//	ol3_styleHelper.classrenderAndLegend(map, ol3_layerHelper.getLayerById(map, layerid), 'hvalue', 6, '等值面');
}

/**添加geojson数据到地图，使用聚簇功能
 * @param {Object} geojson，geojson数据
 * @param {Object} layerid，图层的id
 * @param {Object} layerstyle，图层的样式
 */
function addClusterVectorLayer(geojson, layerid, layerstyle) {
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(geojson),
	});
	currentFeatures[layerid] = vectorSource.getFeatures();
	var clusterSource = new ol.source.Cluster({
		distance: 30,
		source: vectorSource,
	});
	var vectorLayer = new ol.layer.Vector({
		source: clusterSource,
		style: layerstyle
	});
	vectorLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
	if(ol3_layerHelper.getLayerById(map, layerid) == undefined)
		map.addLayer(vectorLayer);
	else {
		ol3_layerHelper.getLayerById(map, layerid).setSource(clusterSource);
		ol3_layerHelper.getLayerById(map, layerid).setStyle(layerstyle);
	}
	//	gisCommon.ZoomTo(map, vectorSource.getExtent());
}
/**实况要素更改事件
 * @param {Object} e
 */
function OnLiveTypeChanged(e) {
	var livetypec = e != undefined ? e : livetype;
	livetype = livetypec;
	addLiveLayer();
			if(layertype == 2) {
				layertype = 0;
				createContourPoly(features[0].concat(features[1]));
			} else if(layertype == 3) {
				layertype = 0;
				createContourLine(features[0].concat(features[1]));
			}
			ShowLiveInfo(livetime, livetype);
}

/**
 * 站点类型更改时，重新查询数据
 */
function OnStationTypeChanged() {
	stationtype = '';

	if($('#cbAuto')[0].checked) {
		stationtype = '1';
	}
	if($('#cbReg')[0].checked) {
		stationtype = stationtype == '' ? '2' : '1,2';
	}

	addLiveLayer();
}

/**站点名称、编号显隐切换
 * @param {Object} e
 */
function OnStationShowChanged(e) {
	if($('#cbstationname')[0].checked && $('#cbstationnum')[0].checked) {
		showstationinfo = 'all';
	} else if(!$('#cbstationname')[0].checked && $('#cbstationnum')[0].checked) {
		showstationinfo = 'stationnum';
	} else if($('#cbstationname')[0].checked && !$('#cbstationnum')[0].checked) {
		showstationinfo = 'stationname';
	} else if(!$('#cbstationname')[0].checked && !$('#cbstationnum')[0].checked) {
		showstationinfo = 'none';
	}

	ol3_layerHelper.getLayerById(map, 'livelayer').setStyle(livetextStyleCluster);
	ol3_layerHelper.getLayerById(map, 'warmlayer').setStyle(livetextStyle);
}/**
 * 设置未使用聚簇功能（普通）的标注样式
 */
function livetextStyle(feature) {
	var labeltext;
		var type=livetype;
	if(livetype == '03' || livetype == '06' || livetype == '12'|| livetype == '09' || livetype == '24' || livetype == '48' || livetype == '72' || livetype == '0808' || livetype == '2020' || livetype == '2008' || livetype == '0820'){
			type="amount";
		}
	if(showstationinfo == 'none') {
		labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '' : (feature.get(type).toString() + GetUnit(type));
	} else if(showstationinfo == 'all') {
		labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '\n\n' + feature.get('stationname').toString() + '/' + feature.get('stationnum').toString() : feature.get(type).toString() + GetUnit(type) + '\n\n' + feature.get('stationname').toString() + '/' + feature.get('stationnum').toString()
	} else {
		labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '\n\n' + feature.get(showstationinfo).toString() : feature.get(type).toString() + GetUnit(type) + '\n\n' + feature.get(showstationinfo).toString()
	}
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: 'rgba(255, 0, 2, 0.8)'
			}),
		}),
		text: new ol.style.Text({
			text: labeltext,
			offsetX: 0,
			offsetY: showstationinfo == 'none' ? -10 : 0,
			font: "13px 微软雅黑",
			fill: new ol.style.Fill({
				color: 'red'
			}),
		}),
	})
}

/**
 * 设置使用聚簇功能的标注样式
 */
function livetextStyleCluster(feature) {
	var size = feature.get('features').length;
	
	if(size > 1) {
		var styleCache = {};
		var style = styleCache[size];
		if(!style) {
			style = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 8,
					fill: new ol.style.Fill({
						color: 'rgba(0,139,139,0.8)'
					})
				}),
				text: new ol.style.Text({
					text: size.toString(),
					fill: new ol.style.Fill({
						color: '#fff'
					})
				})
			});
			styleCache[size] = style;
		}
		return style;
	} else {
		var feature = feature.get('features')[0];
		var labeltext;
		var type=livetype;
		if(livetype == '03' || livetype == '06' || livetype == '12'|| livetype == '09' || livetype == '24' || livetype == '48' || livetype == '72' || livetype == '0808' || livetype == '2020' || livetype == '2008' || livetype == '0820'){
			type="amount";
		}
		if(showstationinfo == 'none') {
			labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '' : (feature.get(type).toString() + GetUnit(type));
		} else if(showstationinfo == 'all') {
			labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '\n\n' + feature.get('stationname').toString() + '/' + feature.get('stationnum').toString() : feature.get(type).toString() + GetUnit(type) + '\n\n' + feature.get('stationname').toString() + '/' + feature.get('stationnum').toString()
		} else {
			labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '\n\n' + feature.get(showstationinfo).toString() : feature.get(type).toString() + GetUnit(type) + '\n\n' + feature.get(showstationinfo).toString()
		}
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({
					color: 'rgba(10, 100, 255, 0.8)'
				}),

			}),
			fill: new ol.style.Fill({
				color: '#3399CC'
			}),
			text: new ol.style.Text({
				text: labeltext,
				offsetX: 0,
				offsetY: showstationinfo == 'none' ? -10 : 0,
				font: "13px 微软雅黑",
				fill: new ol.style.Fill({
					color: '#1E90FF'
				}),

			}),
		})
	}
}
/*
 * 设置风力风向图片样式
 */
function windimagestyle(feature) {
	var size = feature.get('features').length;
	if(size > 1) {
		var styleCache = {};
		var style = styleCache[size];
		if(!style) {
			style = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: '#fff'
					}),
					fill: new ol.style.Fill({
						color: '#3399CC'
					})
				}),
				text: new ol.style.Text({
					text: size.toString(),
					fill: new ol.style.Fill({
						color: '#fff'
					})
				})
			});
			styleCache[size] = style;
		}
		return style;
	} else {
		var feature = feature.get('features')[0];
		return new ol.style.Style({
			text: new ol.style.Text({
				text: feature.get('windv') == "999.9" ? '' : ("" + feature.get('windv') + "m/s"),
				offsetX: 0,
				offsetY: -20,
				font: "13px 微软雅黑",
				fill: new ol.style.Fill({
					color: '#1E90FF'
				}),

			}),
			image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
				rotation: Math.PI / 180 * parseFloat(feature.values_.windd),
				scale: 0.5,
				src: feature.get('windv') == "999.9" ? ' ' : getimageurl(feature.get('windv')),
			})),

		})
	}
}
/**获取风向的图片
 * @param {Object} windv
 */
function getimageurl(windv) {
	var windvfloat = parseFloat(windv);
	var result = "img/wind/";
	if(isNaN(windvfloat) || windvfloat >= 0 & windvfloat <= 0.3)
		result = result + "0.png";
	if(windvfloat > 0.3 & windvfloat <= 1.6)
		result = result + "1.png";
	if(windvfloat > 1.6 & windvfloat <= 3.4)
		result = result + "2.png";
	if(windvfloat > 3.4 & windvfloat <= 5.5)
		result = result + "3.png";
	if(windvfloat > 5.5 & windvfloat <= 8.0)
		result = result + "4.png";
	if(windvfloat > 8.0 & windvfloat <= 10.8)
		result = result + "5.png";
	if(windvfloat > 10.8 & windvfloat <= 13.9)
		result = result + "6.png";
	if(windvfloat > 13.9 & windvfloat <= 17.2)
		result = result + "7.png";
	if(windvfloat > 17.2 & windvfloat <= 20.8)
		result = result + "8.png";
	if(windvfloat > 20.8 & windvfloat <= 24.5)
		result = result + "9.png";
	if(windvfloat > 24.5 & windvfloat <= 28.5)
		result = result + "10.png";
	if(windvfloat > 28.5 & windvfloat <= 32.6)
		result = result + "11.png";
	if(windvfloat > 32.6)
		result = result + "12.png";

	return result;
}

/**获取风向
 * @param {Object} windd
 */
function tranlatewindd(windd) {
	var windvfloat = parseFloat(windv);
	var result = "北风";
	if(windvfloat >= 337.5 || windvfloat <= 22.5)
		result = "北风";
	if(windvfloat > 22.5 & windvfloat <= 67.5)
		result = "东北风";
	if(windvfloat > 67.5 & windvfloat <= 112.5)
		result = "东风";
	if(windvfloat > 112.5 & windvfloat <= 157.5)
		result = "东南风";
	if(windvfloat > 157.5 & windvfloat <= 202.5)
		result = "南风";
	if(windvfloat > 202.5 & windvfloat <= 247.5)
		result = "西南风";
	if(windvfloat > 247.5 & windvfloat <= 292.5)
		result = "西风";
	if(windvfloat > 292.5 & windvfloat <= 337.5)
		result = "西北风";
	return result;
}
var start = new Date().getTime();
/**告警闪烁
 * @param {Object} event
 */
function animate(event) {
	var vectorContext = event.vectorContext;
	var frameState = event.frameState;

	var elapsed = frameState.time - start;
	while(elapsed > 1000) {
		elapsed = elapsed - 1000;
	}
	var color = 'rgba(255, 0, 2, 0.8)';
	var radius = Math.round(elapsed / 300 + 5);

	ol3_layerHelper.getLayerById(map, 'warmlayer').setStyle(function(feature) {
		var labeltext;
		var type=livetype;
		if(livetype == '03' || livetype == '06' || livetype == '12'|| livetype == '09' || livetype == '24' || livetype == '48' || livetype == '72' || livetype == '0808' || livetype == '2020' || livetype == '2008' || livetype == '0820'){
			type="amount";
		}
		if(showstationinfo == 'none') {
			labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '' : (feature.get(type).toString() + GetUnit(type));
		} else if(showstationinfo == 'all') {
			labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '\n\n' + feature.get('stationname').toString() + '/' + feature.get('stationnum').toString() : feature.get(type).toString() + GetUnit(type) + '\n\n' + feature.get('stationname').toString() + '/' + feature.get('stationnum').toString()
		} else {
			labeltext = feature.get(type) == undefined || feature.get(type).toString() == '' ? '\n\n' + feature.get(showstationinfo).toString() : feature.get(type).toString() + GetUnit(type) + '\n\n' + feature.get(showstationinfo).toString()
		}
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: radius,
				fill: new ol.style.Fill({
					color: color
				}),
			}),
			text: new ol.style.Text({
				text: labeltext,
				offsetX: 0,
				offsetY: showstationinfo == 'none' ? -10 : 0,
				font: "13px 微软雅黑",
				fill: new ol.style.Fill({
					color: color
				}),
			}),
		});
	});
	map.render();
}
/**
 * 一键发布
 * **/
function drawGraphic() {

	if(ol.mapUtil.getLayerById(map, 'drawlayer')) {
		return;
	}
	var type = 'Polygon';
	var source = new ol.source.Vector({
		wrapX: false
	});
	//保存画图后的图形结果
	var vector = new ol.layer.Vector({
		source: source,
		layerid: 'drawlayer',
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(0, 0, 0, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#976121',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	});
	map.addLayer(vector);
	var draw = new ol.interaction.Draw({
		source: source,
		type: /** @type {ol.geom.GeometryType} */ (type),
	});
	map.addInteraction(draw);
}
/**清除框选**/
function resetDraw() {
	map.removeInteraction(ol.mapUtil.getDrawInteraction(map));
	ol.mapUtil.removeLayersById(map, ['drawlayer']);
}

function releasedInfo() {
	var table = $('#releaseModule .modal-table');
	if(ol.mapUtil.getLayerById(map, 'drawlayer') == undefined) {
		alert('请先选择区域!');
		return;
	}	
	var featuresW = [];
	if(currentFeatures['warmlayer'].length>0){
		$.each(currentFeatures['warmlayer'], function(i,f) {
			featuresW.push(f);
		});
	}
	if(currentFeatures['livelayer'].length>0){
		$.each(currentFeatures['livelayer'], function(i,f) {
			featuresW.push(f);
		});
	}
	var releaseFeatures = ol.featureUtil.getFilterFeatures(ol.mapUtil.getLayerById(map, 'drawlayer').getSource().getFeatures(), featuresW);
//	var releaseFeatures = ol.featureUtil.getFilterFeatures(ol.mapUtil.getLayerById(map, 'drawlayer').getSource().getFeatures(), currentFeatures);
	if(releaseFeatures.length != 0) {
		var record = releaseFeatures;
		var tableHTML = '';
		tableHTML += "<table class='table main-table table-striped'>";
		tableHTML += "<thead><tr><th>序号</th><th>站号</th><th>站名</th></tr></thead>";
		tableHTML += "<tbody>";
		for(var i = 0; i < record.length; i++) {
			var values = record[i].getProperties();
			tableHTML += "<tr'><td>" + (i + 1) + "</td><td class='blue-td'>" + values.stationnum +
				"</td>";
			tableHTML += "<td class='blue-td'>" + values.stationname +
				"</td>";
			tableHTML += "<td class='hidden' name='id' value='" + values.stationnum + "'>" + values.stationnum + "</td></tr>"
		}
		tableHTML += "</tbody></table>";
		table.html(tableHTML)
	}
	$('#releaseModule').modal('show');
}
/**发布**/
function excuteRelease() {
	var tdArray = $('#releaseModule .modal-table tr td[name=id]');
	var stationnums = '';
	$.each(tdArray, function(i, td) {
		if(i == 0) {
			stationnums += $(td).attr('value');
		} else {
			stationnums += ',' + $(td).attr('value');
		}

	});
	var info = $('#releaseModule .modal-input-textarea').val();
	var timeStamp = new Date().getTime();
	var params = {
		stationnum: stationnums,
		timestamp: timeStamp,
		info: info
	}
	$.ajax(liveconfig.autoNewsReleaseURL, {
		type: "get",
		dataType: 'jsonp',
		data: params,
		async: true,
		timeout:120000,
		cache:false,
		success: function(result) {
			if(result){
				alert('发布成功');
			}
		},
		error: function(result) {
			alert('系统异常,发布失败');
		}
	})
}