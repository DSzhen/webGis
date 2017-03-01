var commonConfig = {
	/**
	 * 配置项，地图服务地址
	 */
	geoserverUrl: 'http://192.168.0.109:8080/geoserver/wms',
	/**
	 * 图层名称
	 */
	baseLayerName: 'ssd:china',
	/**
	 * 数据投影
	 */
	dataProjection: 'EPSG:4326',
	/**
	 * 要素投影
	 */
	featureProjection: 'EPSG:3857',

	/**
	 * 地图初始化中心点，zoom初始化缩放等级，minzoom最小缩放等级，maxzoom 最小缩放等级
	 */
	baseLayerCenter: [103.92, 35.33],
	baseLayerZoom: 4,
	baseLayerMinzoom: 4,
	baseLayerMaxzoom: 18,
}

liveconfig = {

	/**
	 * 等值线服务地址
	 */
	contourUrl: "http://192.168.0.109:8080/geoserver/cwms",

	/**
	 * 实况地址
	 */
	liveUrl: "../../data/live.xml",

	/**
	 * 累计降水量实况
	 */
	rainUrl: "http://192.168.0.76:8080/pms/Http/realtime_getRainData.action",

	/**
	 * 24小时数据地址
	 */
	live24Url: "http://192.168.0.76:8080/pms/Http/realtime_getdata24H.action",
	/**
	 * 时间段查询过滤数据
	 * **/
	filterUrl:"http://192.168.0.76:8080/pms/Http/realtime_getRianCount.action",
	/**
	 * 实况中英文对应字典
	 */
	livedictionary: {

		"1小时降水": "RainAmountHour",
		"能见度": "visib",
		"1小时降水量": "rianamount",
		"温度": "temp",
		"3小时降雨": "pre_3h",
		"6小时降雨": "pre_6h",
		"12小时降雨": "pre_12h",
		"24小时降雨": "pre_24h",
		"1小时极大风向风速": "ExMaxWindDV",
		"风力": "windv",
		"1小时最大风向风速": "MaxWindDV",
		"日最大风速": "MaxWindVDay",
		"气压": "press",
		"相对湿度": "relhum",
		"3小时降水":"03",
		"6小时降水":"06",
		"9小时降水":"09",
		"12小时降水":"12",
		"24小时降水":"24",
		"48小时降水":"48",
		"08时~08时降水":"0808",
		"08时~20时降水":"0820",
		"20时~20时降水":"2020",
		"20时~08时降水":"2008",
	},
	/**
	 * 生成等值线的等值间隔
	 */
	contourinter: {
		'temp': [-48, -46, -44, -42, -40, -38, -36, -34, -32, -30, -28, -24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
		'press': [800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200],
		'relhum': [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		'windv': [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.6],
	},
	/**
	 * 图层颜色配置
	 */
	rendercolor: {
		'temp': [
			[-30, -25, [12, 67, 196]],
			[-25, -20, [26, 107, 215]],
			[-20, -15, [52,146,244]],
			[-15, -10, [100,185,246]],
			[-10, -5, [149, 206, 244]],
			[-5, 0, [193, 230, 248]],
			[0, 5, [254, 255, 196]],
			[5, 10, [251, 241, 162]],
			[10, 15, [255, 228, 122]],
			[15, 20, [251, 204, 99]],
		],
		'press': [
			[0, 850, [195, 226, 255]],
			[850, 900, [195, 226, 255]],
			[900, 950, [110, 205, 236]],
			[950, 1000, [100, 149, 236]],
			[1000, 1050, [70, 130, 180]],
			[1050, 1100, [1, 1, 205]],
			[1100, 1150, [1, 0, 128]]
		],
		'relhum': [
			[0, 10, [255, 0, 0]],
			[10, 20, [255, 70, 0]],
			[20, 30, [255, 140, 1]],
			[30, 40, [255, 160, 79]],
			[40, 50, [238, 238, 0]],
			[50, 60, [130, 205, 236]],
			[60, 70, [100, 149, 236]],
			[70, 80, [70, 130, 180]],
			[80, 90, [1, 1, 235]],
			[90, 100, [1, 0, 139]]
		],
		'rianamount': [
			[0, 10, [255, 0, 0]],
			[10, 20, [255, 70, 0]],
			[20, 30, [255, 140, 1]],
			[30, 40, [255, 160, 79]],
			[40, 50, [238, 238, 0]],
		],
		'pre_3h': [
			[0, 10, [255, 0, 0]],
			[10, 20, [255, 70, 0]],
			[20, 30, [255, 140, 1]],
			[30, 40, [255, 160, 79]],
			[40, 50, [238, 238, 0]],
			[50, 60, [130, 205, 236]],
		],
		'pre_6h': [
			[0, 10, [255, 0, 0]],
			[10, 20, [255, 70, 0]],
			[20, 30, [255, 140, 1]],
			[30, 40, [255, 160, 79]],
			[40, 50, [238, 238, 0]],
			[50, 60, [130, 205, 236]],
			[60, 70, [100, 149, 236]],
		],
		'pre_12h': [
			[0, 10, [255, 0, 0]],
			[10, 20, [255, 70, 0]],
			[20, 30, [255, 140, 1]],
			[30, 40, [255, 160, 79]],
			[40, 50, [238, 238, 0]],
			[50, 60, [130, 205, 236]],
			[60, 70, [100, 149, 236]],
			[70, 80, [70, 130, 180]],
		],
		'pre_24h': [
			[0, 10, [255, 0, 0]],
			[10, 20, [255, 70, 0]],
			[20, 30, [255, 140, 1]],
			[30, 40, [255, 160, 79]],
			[40, 50, [238, 238, 0]],
			[50, 60, [130, 205, 236]],
			[60, 70, [100, 149, 236]],
			[70, 80, [70, 130, 180]],
			[80, 90, [1, 1, 235]],
		],
		'windv': [
			[0.3, 3.4, [255, 100, 0]],
			[3.4, 8.0, [255, 219, 100]],
			[8.0, 13.9, [255, 255, 187]],
			[13.9, 20.8, [154, 239, 180]],
			[20.8, 24.5, [94, 184, 255]],
			[24.5, 28.5, [5, 149, 248]],
			[28.5, 100, [0, 0, 250]]
		],
	},
	/**
	 * 雷达拼图坐标
	 */
	radarextent: [73.22694444, 3.08888888, 135.22694444, 53.08888888],

	/**
	 * 卫星云图坐标
	 */
	sateextent: [67.32, 6.59, 142.68, 63.41],

}
tourConfig = {
	tourUrl: '',
}