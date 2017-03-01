/**
 * gis公共类
 * @author 2016.6.27 songcy
 * @constructor
 */
function gisCommon() {};
gisCommon.prototype = {

}

/**
 * 清除select事件的选中要素
 * @param {ol.map} map
 */
gisCommon.clearSelectFeatures = function(map) {
	for(i = 0; i < map.getInteractions().getLength(); i++) {
		var interaction = map.getInteractions().getArray()[i];
		if(interaction != undefined && interaction.constructor === ol.interaction.Select) {
			interaction.getFeatures().clear();
		}
	}
};
/**
 * 根据overlay 的id移除地图上的overlay
 * @param {Object} map
 * @param {String} overlayid
 */
gisCommon.removeOverlays = function(map, overlayid) {
	var length = map.getOverlays().getLength();
	for(i = 0; i < map.getOverlays().getLength(); i++) {
		var pieoverlay = map.getOverlays().getArray()[i];
		if(pieoverlay != undefined && pieoverlay.getId() == overlayid) {
			map.removeOverlay(pieoverlay);
			i--;
		}
	}
};

/**
 * 瓦片(googleMap)地图
 * 
 * @param {Object} mapId
 * @param {Object} baseUrl
 * @param {Object} mtype
 * @param {Object} tileformat
 * @param {Object} center
 * @param {Object} zoom
 */
gisCommon.createTiledMap = function(mapId, baseUrl, mtype, tileformat, center, zoom) {
	var tiledLayer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: baseUrl + '/' + mtype + '/{z}/{x}/{y}.' + tileformat
		}),
		name: 'baselyaer'
	});
	//默认情况下view采用webM投影
	var view = new ol.View({
		center: ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'),
		zoom: zoom,
		maxZoom: 18,
		minZoom: 0
	});
	var map = new ol.Map({
		view: view,
		layers: [tiledLayer],
		target: mapId
	});
	return map;
};
/**
 * wms地图服务(geoserver发布)
 * @param {Object} mapId
 * @param {Object} url,如：http://192.168.0.109:8080/geoserver/wms
 * @param {Object} layerName
 * @param {Object} center
 * @param {Object} zoom
 */
gisCommon.createGeoWMSMap = function(mapId, url, layerName, center, zoom) {
	var wmsLayer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: url,
			crossOrigin: 'anonymous',
			params: {
				'LAYERS': layerName
			}
		}),
		name: 'baselayer'
	});
	//采用4326投影
	var view = new ol.View({
		center: center,
		zoom: zoom,
		projection: 'EPSG:3857'
	});
	var logoElement = document.createElement('a');
	logoElement.href = 'http://www.ssd.net.cn';
	logoElement.target = '_blank';

	var logoImage = document.createElement('img');
	logoImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDM0MiwgMjAxMC8wMS8xMC0xODowNjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUwMjc4MTVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUwMjc4MjVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyRTAyNzdGNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYyRTAyNzgwNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++jSynwAACUhJREFUeNrMWXt0VEcd/u7dm+wmWfIk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';
	logoElement.appendChild(logoImage);
	var map = new ol.Map({
//		logo: logoElement,
		controls: [new ol.control.ScaleLine(), new ol.control.Attribution()],
		view: view,
		layers: [wmsLayer],
		target: mapId
	});
	return map;
};
/**
 * 测量距离、面积方法
 * @param {Object} map
 * @param {Object} typeid
 */
gisCommon.addMeasureTool = function(map, type) {
	var wgs84Sphere = new ol.Sphere(6378137);

	var source = new ol.source.Vector();
	var vector = new ol.layer.Vector({
		source: source,
		layerid: 'measurelayer',
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
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
	/**
	 * Currently drawn feature.
	 * @type {ol.Feature}
	 */
	var sketch;

	/**
	 * The help tooltip element.
	 * @type {Element}
	 */
	var helpTooltipElement;

	/**
	 * Overlay to show the help messages.
	 * @type {ol.Overlay}
	 */
	var helpTooltip;

	/**
	 * The measure tooltip element.
	 * @type {Element}
	 */
	var measureTooltipElement;

	/**
	 * Overlay to show the measurement.
	 * @type {ol.Overlay}
	 */
	var measureTooltip;

	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	var continuePolygonMsg = '点击测量面积';

	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	var continueLineMsg = '点击测量距离';

	/**
	 * Handle pointer move.
	 * @param {ol.MapBrowserEvent} evt The event.
	 */
	var pointerMoveHandler = function(evt) {
		if(evt.dragging) {
			return;
		}
		/** @type {string} */
		var helpMsg = '点击开始测量';

		if(sketch) {
			var geom = (sketch.getGeometry());
			if(geom instanceof ol.geom.Polygon) {
				helpMsg = continuePolygonMsg;
			} else if(geom instanceof ol.geom.LineString) {
				helpMsg = continueLineMsg;
			}
		}

		helpTooltipElement.innerHTML = helpMsg;
		helpTooltip.setPosition(evt.coordinate);

		$(helpTooltipElement).removeClass('hidden');
	};

	var pointermovekey = map.on('pointermove', pointerMoveHandler);
	var pointermovekey = map.on('pointermove', function() {});

	$(map.getViewport()).on('mouseout', function() {
		$(helpTooltipElement).addClass('hidden');
	});

	var draw; // global so we can remove it later

	/**
	 * Format length output.
	 * @param {ol.geom.LineString} line The line.
	 * @return {string} The formatted length.
	 */
	var formatLength = function(line) {
		var length;

		var coordinates = line.getCoordinates();
		length = 0;
		var sourceProj = map.getView().getProjection();
		for(var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
			var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
			length += wgs84Sphere.haversineDistance(c1, c2);
		}

		var output;
		if(length > 100) {
			output = (Math.round(length / 1000 * 100) / 100) +
				' ' + 'km';
		} else {
			output = (Math.round(length * 100) / 100) +
				' ' + 'm';
		}
		return output;
	};

	/**
	 * Format area output.
	 * @param {ol.geom.Polygon} polygon The polygon.
	 * @return {string} Formatted area.
	 */
	var formatArea = function(polygon) {
		var area;

		var sourceProj = map.getView().getProjection();
		var geom = /** @type {ol.geom.Polygon} */ (polygon.clone().transform(
			sourceProj, 'EPSG:4326'));
		var coordinates = geom.getLinearRing(0).getCoordinates();
		area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

		var output;
		if(area > 10000) {
			output = (Math.round(area / 1000000 * 100) / 100) +
				' ' + 'km<sup>2</sup>';
		} else {
			output = (Math.round(area * 100) / 100) +
				' ' + 'm<sup>2</sup>';
		}
		return output;
	};

	function addInteraction() {
		var typed = (type == 'area' ? 'Polygon' : 'LineString');
		draw = new ol.interaction.Draw({
			source: source,
			type: /** @type {ol.geom.GeometryType} */ (typed),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 0.5)',
					lineDash: [10, 10],
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 5,
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 0, 0, 0.7)'
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					})
				})
			})
		});
		map.addInteraction(draw);

		createMeasureTooltip();
		createHelpTooltip();

		var listener;
		draw.on('drawstart',
			function(evt) {
				// set sketch
				sketch = evt.feature;

				/** @type {ol.Coordinate|undefined} */
				var tooltipCoord = evt.coordinate;

				listener = sketch.getGeometry().on('change', function(evt) {
					var geom = evt.target;
					var output;
					if(geom instanceof ol.geom.Polygon) {
						output = formatArea(geom);
						tooltipCoord = geom.getInteriorPoint().getCoordinates();
					} else if(geom instanceof ol.geom.LineString) {
						output = formatLength(geom);
						tooltipCoord = geom.getLastCoordinate();
					}
					measureTooltipElement.innerHTML = output;
					measureTooltip.setPosition(tooltipCoord);
				});
			}, this);

		draw.on('drawend',
			function() {
				measureTooltipElement.className = 'tooltip tooltip-static';
				measureTooltip.setOffset([0, -7]);
				// unset sketch
				sketch = null;
				// unset tooltip so that a new one can be created
				measureTooltipElement = null;
				createMeasureTooltip();
				ol.Observable.unByKey(listener);
			}, this);
	}

	/**
	 * Creates a new help tooltip
	 */
	function createHelpTooltip() {
		if(helpTooltipElement) {
			helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.className = 'tooltip hidden';
		helpTooltip = new ol.Overlay({
			element: helpTooltipElement,
			offset: [15, 0],
			positioning: 'center-left'
		});
		map.addOverlay(helpTooltip);
	}

	/**
	 * Creates a new measure tooltip
	 */
	function createMeasureTooltip() {
		if(measureTooltipElement) {
			measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		}
		measureTooltipElement = document.createElement('div');
		measureTooltipElement.className = 'tooltip tooltip-measure';
		measureTooltip = new ol.Overlay({
			element: measureTooltipElement,
			offset: [0, -15],
			positioning: 'bottom-center'
		});
		map.addOverlay(measureTooltip);
	}

	/**
	 * Let user change the geometry type.
	 */
	type.onchange = function() {
		map.removeInteraction(draw);
		addInteraction();
	};

	addInteraction();
};
/**
 * 把普通的json转换成geojson
 * @param {Object} raw 原始JSON
 * @param {Object} lon 经度名
 * @param {Object} lat 纬度名
 */
gisCommon.pointToGeoJSON = function(raw, lon, lat) {
	var geoObj = {
		"type": "FeatureCollection",
		"features": []
	};
	for(var i = 0; i < raw.length; i++) {
		var f = {
			"type": "Feature",
			"properties": {},
			"geometry": {}
		};
		var g = {
			"type": "Point",
			"coordinates": [raw[i][lon], raw[i][lat]]
		};
		f.geometry = g;
		for(var key in raw[i]) {
			f.properties[key] = raw[i][key];
		}
		geoObj.features.push(f);
	}
	return geoObj;
};
/**
 * 获取在多边形feature内的点feature
 * @param {Array} polygonFeatures
 * @param {Array} pointFeaturs
 */
gisCommon.getFilterFeatures = function(polygonFeatures, pointFeaturs) {
	var plf = polygonFeatures;
	var pf = pointFeaturs;
	var filterFeatures = [];
	for(var i = 0; i < plf.length; i++) {
		for(var j = 0; j < pf.length; j++) {
			if(plf[i].getGeometry().intersectsExtent(pf[j].getGeometry().getExtent())) {
				filterFeatures.push(pf[j]);
			}
		}
	}
	return filterFeatures;
};
/**获取地图的选择事件
 * @param {Object} map
 */
gisCommon.getSelectInteraction = function(map) {
		var result;
		$.each(map.getInteractions().getArray(), function(m, item) {
			if(item.constructor == ol.interaction.Select) {
				result = item;
			}
		})
		return result;
	}
	/**获取地图的draw事件
	 * @param {Object} map
	 */
gisCommon.getDrawInteraction = function(map) {
		var result;
		$.each(map.getInteractions().getArray(), function(m, item) {
			if(item.constructor == ol.interaction.Draw) {
				result = item;
			}
		})
		return result;
	}
	/**添加地图的draw事件
	 * @param {Object} map
	 * @param {Object} type,类型：'Point','LineString','Polygon','Circle','Box'
	 */
gisCommon.addDrawInteraction = function(map, type) {
		var result;
		if(type !== undefined) {
			var source = new ol.source.Vector({
				wrapX: false
			});
			//保存画图后的图形结果
			var vector = new ol.layer.Vector({
				source: source,
				layerid: 'drawlayer',
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
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

			var geometryFunction, maxPoints;
			if(type === 'Circle') {
				//			geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
			} else if(type === 'Box') {
				type = 'LineString';
				maxPoints = 2;
				geometryFunction = function(coordinates, geometry) {
					if(!geometry) {
						geometry = new ol.geom.Polygon(null);
					}
					var start = coordinates[0];
					var end = coordinates[1];
					geometry.setCoordinates([
						[start, [start[0], end[1]], end, [end[0], start[1]], start]
					]);
					return geometry;
				};
			}
			map.removeInteraction(gisCommon.getDrawInteraction(map));
			ol3_layerHelper.removeLayersById(map, ['drawlayer']);
			map.addLayer(vector);
			result = new ol.interaction.Draw({
				source: source,
				type: /** @type {ol.geom.GeometryType} */ (type),
				geometryFunction: geometryFunction,
				maxPoints: maxPoints
			});
			map.addInteraction(result);
		}

		return result;
	}
	/**缩放地图至某一范围
	 * @param {Object} map
	 * @param {Object} extent
	 */
gisCommon.ZoomTo = function(map, extent) {
		if(map == undefined) return;
		map.getView().fit(extent, map.getSize());
	}
	/**获取图层的sources，包括未聚簇和聚簇的图层
	 * @param {Object} map
	 * @param {Object} layerid
	 */
gisCommon.getSources = function(map, layerid) {
	var layerv;
	var result = new Array();
	$.each(map.getLayers().getArray(), function(m, item) {
		if(item.constructor == ol.layer.Group)
			$.each(item.getLayers().getArray(), function(m, sitem) {
				if(sitem.getProperties().layerid != undefined && sitem.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
					layerv = sitem;
				}
			})
		else
		if(item.getProperties().layerid != undefined && item.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
			{
				layerv = item;
				if(layerv.getSource().constructor == ol.source.Vector) {
					result = layerv.getSource().getFeatures();
				}
				if(layerv.getSource().constructor == ol.source.Cluster) {
					for(var m = 0; m < layerv.getSource().getFeatures().length; m++) {
						for(var n = 0; n < layerv.getSource().getFeatures()[m].get('features').length; n++) {
							result.push(layerv.getSource().getFeatures()[m].get('features')[n])
						}
					}
				}
			}
		}
	})
	return result;
}

/**添加geojson数据到地图，不使用聚簇功能
 * @param {Object} geojson，geojson数据
 * @param {Object} layerid，图层的id
 * @param {Object} layerstyle，图层的样式
 */
gisCommon.addVectorLayer = function(geojson, layerid, layerstyle) {
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(geojson),
	});
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
}

/**添加geojson数据到地图，使用聚簇功能
 * @param {Object} geojson，geojson数据
 * @param {Object} layerid，图层的id
 * @param {Object} layerstyle，图层的样式
 * @param {Object} distance，聚簇值
 */
gisCommon.addClusterVectorLayer = function(geojson, layerid, layerstyle, distance, feturesoptions) {
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(geojson),
	});
	var clusterSource = new ol.source.Cluster({
		distance: distance,
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
}

/**
 * 
 */
function ol3_layerHelper() {}
/**
 * 通过id获取图层
 * @param {Object} map
 * @param {String} layerid
 * @return {Object} layer
 */
ol3_layerHelper.getLayerById = function(map, layerid) {
		var layerv;
		$.each(map.getLayers().getArray(), function(m, item) {
			if(item.constructor == ol.layer.Group)
				$.each(item.getLayers().getArray(), function(m, sitem) {
					if(sitem.get('layerid') != undefined && sitem.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
						layerv = sitem;
					}
				})
			else
			if(item.get('layerid') != undefined && item.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
				layerv = item;
			}
		})
		return layerv;
	}
	/**
	 * 设置图层组及单图层的可见性
	 * @param {Object} map
	 * @param {Array} layerids
	 * @param {String} isvisible
	 */
ol3_layerHelper.setLayersVisiblity = function(map, layerids, isvisible) {
	$.each(map.getLayers().getArray(), function(m, item) {
		if(item.constructor == ol.layer.Group)
			$.each(item.getLayers().getArray(), function(m, sitem) {
				$.each(layerids, function(i, layerid) {
					if(sitem.get('layerid') != undefined && sitem.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
						sitem.setVisible(isvisible);
					}
				});
			})
		else
			$.each(layerids, function(i, layerid) {
				if(item.get('layerid') != undefined && item.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
					item.setVisible(isvisible);
				}
			});
	})
};
/**
 * 根据图层id移除地图上的图层
 * @param {Object} map
 * @param {Array} layerids
 */
ol3_layerHelper.removeLayersById = function(map, layerids) {
		$.each(map.getLayers().getArray(), function(m, item) {
			$.each(layerids, function(i, layerid) {
				if(item == undefined) return;
				if(item.get('layerid') != undefined && item.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
					map.removeLayer(item);
				}
			});
		})
	}
	/**
	 * 给图层添加字体
	 * @param {Object} map
	 * @param {String} layerid
	 * @param {String} labelfield
	 */
ol3_layerHelper.addLabelToLayer = function(map, layerid, labelfield) {
	var layerv;
	$.each(map.getLayers().getArray(), function(m, item) {
		if(item.get('layerid') != undefined && item.getProperties().layerid == layerid || item.get('layerid') == layerid || item.layerid == layerid) {
			layerv = item;
		}
	})
	$.each(layerv.getSource().getFeatures(), function(i, feature) {
		if(feature.get(labelfield) != undefined) {
			var labeltext;
			if(feature.get(labelfield).length > 6)
				labeltext = feature.get(labelfield).substr(0, feature.get(labelfield).length / 2) + '\n' + feature.get(labelfield).substring(feature.get(labelfield).length / 2);
			feature.setStyle(new ol.style.Style({
				text: new ol.style.Text({
					text: labeltext,
					//					text: feature.get(labelfield) + '',
					font: "13px 微软雅黑",
					fill: new ol.style.Fill({
						color: '#1E90FF'
					}),
				}),
				fill: new ol.style.Fill({
					color: '#1E90FF'
				}),
				image: new ol.style.Circle({
					radius: 4,
					fill: null,
					stroke: new ol.style.Stroke({
						color: 'magenta'
					})
				})
			}));
		}
	})
};
/**
 * 提供系統的地圖底圖，包含天地圖、百度、谷歌地图.注：三类地图均有偏移，其中天地图的CGS2000坐标与WGS84偏移较小，
 * 谷歌地图与WGS84有中国测绘局规定的偏移量，可通过算法进行校正，百度地图除了有国家测绘局规定的偏移外，自已又定义了一套偏移算法
 * 可参考相应算法解析。当需要底图服务时建议使用天地图系列。
 * @return ol.layer.tile对象
 * @param mapname:地圖名稱，天地圖，百度等；
 * @param maptype:地圖類型，矢量、影像、地形等
 */
ol3_layerHelper.getBaseLayer = function(mapname, maptype) {
	var resultlayer;
	var layerurl;
	switch(mapname) {
		case "天地图":
		case "天地":
		case "tiandi":
		case "tianditu":
			switch(maptype) {
				case "矢量":
				case "路网":
				case "道路":
					layerurl = 'http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}' //天地图路网;
					break;
				case "影像":
				case "遥感":
				case "卫星":
					layerurl = 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}' //天地图影像
					break;
				case "地形":
				case "地形图":
				case "高程图":
					layerurl = 'http://t2.tianditu.com/DataServer?T=ter_c&x={x}&y={y}&l={z}' //天地图地形
					break;
				case "标注":
				case "中文标注":
				case "名称":
				case "路网标注":
				case "道路标注":
					layerurl = 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}' //天地图路网标注
					break;
				case "影像标注":
					layerurl = 'http://t3.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}' //天地图影像标注
					break;
				case "地形标注":
					layerurl = 'http://t3.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}' //天地图地形标注
					break;
				default:
					layerurl = 'http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}' //天地图路网;
					break;
			}
			//		resultlayer.setSource(new ol.source.XYZ({url:layerurl}));
			break;
		case "谷歌地图":
		case "谷歌":
		case "google":
		case "google map":
			switch(maptype) {
				case "矢量":
				case "路网":
				case "道路":
					layerurl = 'http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' //google矢量地图
					break;
				case "影像":
				case "遥感":
				case "卫星":
					layerurl = 'http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' //google影像图
					break;
				case "地形":
				case "地形图":
				case "高程图":
					layerurl = 'http://mt2.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' //google地形图
					break;
				case "标注":
					layerurl = 'http://mt2.google.cn/vt/lyrs=h&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' //google地形图
					break;
				default:
					layerurl = 'http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' //google矢量地图
					break;
			}
			//			resultlayer.source=new ol.source.XYZ({url:layerurl});
			break;
		case "百度地图":
		case "百度":
		case "baidu":
		case "baidu map":
			resultlayer = ol3_layerHelper.getBaiduLayer(maptype);
			return resultlayer;
			break;
		default:
			layerurl = 'http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' //google矢量地图
				//          resultlayer.source=new ol.source.XYZ({url:layerurl});
			break;
	}
	return resultlayer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: layerurl,

			//	url: "http://192.168.0.165:9090/TiledGoogleMap/terrain/{z}/{x}/{y}.jpg",
		}),
		zIndex: -1
	});
	//	http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x} //esri世界地圖
	//	http://192.168.0.165:9090/TiledGoogleMap/terrain/{z}/{x}/{y}.jpg //离线google地形图
};
/**
 * 获取百度地图数据
 * @param {String} maptype
 * @return {String} url
 */
ol3_layerHelper.getBaiduLayer = function(maptype) {
	var resultlayer;
	var projection = ol.proj.get("EPSG:3857");
	var resolutions = [];
	for(var i = 0; i < 22; i++) {
		resolutions[i] = Math.pow(2, 18 - i);
	}
	var tilegrid = new ol.tilegrid.TileGrid({
		origin: [0, 0],
		resolutions: resolutions
	});

	return resultlayer = new ol.layer.Tile({
		source: new ol.source.TileImage({
			projection: projection,
			tileGrid: tilegrid,
			tileUrlFunction: function(tileCoord, pixelRatio, proj) {
				if(!tileCoord) {
					return "";
				}
				var z = tileCoord[0];
				var x = tileCoord[1];
				var y = tileCoord[2];
				if(x < 0) {
					x = "M" + (-x);
				}
				if(y < 0) {
					y = "M" + (-y);
				}
				switch(maptype) {
					case "矢量":
					case "路网":
					case "道路":
						layerurl = "http://online3.map.bdimg.com/onlinelabel/?qt=tile&udt=20160514&styles=pl&scaler=1&p=1&x=" + x + "&y=" + y + "&z=" + z; //百度地图
						break;
					case "影像":
					case "遥感":
					case "卫星":

						layerurl = "http://shangetu1.map.bdimg.com/it/u=x=" + x + ";y=" + y + ";z=" + z + ";v=009;type=sate&fm=46&udt=20150601"; //百度影像图，udt=20160514,可参加百度地图最新时间
						break;

					default:
						layerurl = "http://online3.map.bdimg.com/onlinelabel/?qt=tile&udt=20160514&styles=pl&scaler=1&p=1&x=" + x + "&y=" + y + "&z=" + z; //百度地图

						break;
				}
				return layerurl;
			}
		})
	});
};

ol3_layerHelper.prototype = {

}

ol3_styleHelper = function() {}
	/**
	 * 根据要素类型返回默认样式:要素集未使用聚簇(cluster)
	 * @param {Object} feature
	 * @return{Object} ol.style.Style
	 */
ol3_styleHelper.getDefaultFeatureStyle = function(feature) {
		var result;
		switch(feature.getGeometry().getType()) {
			case 'Point':
				result = new ol.style.Style({
					image: new ol.style.Circle({
						radius: 5,
						fill: new ol.style.Fill({
							color: 'rgba(10, 100, 255, 0.6)'
						}),
						stroke: new ol.style.Stroke({
							color: 'red',
							width: 1
						})
					}),
				});
				break;
			case 'LineString':
				result = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'green',
						width: 1
					})
				});
				break;
			case 'MultiLineString':
				result = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'green',
						width: 1
					})
				});
				break;
			case 'MultiPoint':
				result = new ol.style.Style({
					image: new ol.style.Circle({
						radius: 5,
						fill: new ol.style.Fill({
							color: 'rgba(10, 100, 255, 0.6)'
						}),
						stroke: new ol.style.Stroke({
							color: 'red',
							width: 1
						})
					})
				});
				break;
			case 'MultiPolygon':
				result = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'yellow',
						width: 1
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 0, 0.1)'
					})
				});
				break;
			case 'Polygon':
				result = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'blue',
						lineDash: [4],
						width: 2
					}),
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 255, 0.1)'
					})
				});
				break;
			case 'GeometryCollection':
				result = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'magenta',
						width: 2
					}),
					fill: new ol.style.Fill({
						color: 'magenta'
					}),
					image: new ol.style.Circle({
						radius: 10,
						fill: null,
						stroke: new ol.style.Stroke({
							color: 'magenta'
						})
					})
				});
				break;
			case 'Circle':
				result = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'red',
						width: 2
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255,0,0,0.2)'
					})
				});
				break;
		}
		return result;
	}
	/**
	 * 设置使用聚簇功能的要素图层样式
	 */
ol3_styleHelper.getClusterDefaultStyle = function(feature) {
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
		var style = new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({
					color: 'rgba(10, 100, 255, 0.6)'
				}),
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 1
				})
			}),
		});
		return style;
	}
}

/**
 * 设置要素的选中样式
 */
ol3_styleHelper.getSelectStyle = function(feature) {
	if(feature == undefined) return;
	var result;
	switch(feature.getGeometry().getType()) {
		case 'Point':
			result = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(10, 100, 255, 0.6)'
					}),
					stroke: new ol.style.Stroke({
						color: 'red',
						width: 1
					})
				}),
			});
			break;
		case 'LineString':
			result = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'green',
					width: 1
				})
			});
			break;
		case 'MultiLineString':
			result = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'green',
					width: 1
				})
			});
			break;
		case 'MultiPoint':
			result = new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(10, 100, 255, 0.6)'
					}),
					stroke: new ol.style.Stroke({
						color: 'red',
						width: 1
					})
				})
			});
			break;
		case 'MultiPolygon':
			result = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'yellow',
					width: 1
				})
			});
			break;
		case 'Polygon':
			result = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'blue',
					lineDash: [4],
					width: 3
				})
			});
			break;
		case 'GeometryCollection':
			result = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'magenta',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'magenta'
				}),
				image: new ol.style.Circle({
					radius: 10,
					fill: null,
					stroke: new ol.style.Stroke({
						color: 'magenta'
					})
				})
			});
			break;
		case 'Circle':
			result = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255,0,0,0.2)'
				})
			});
			break;
	}
	return result;
}

/*
/**分级渲染,根据渲染字段获取图层的所有值，对值进行排序，计算每个要素所属的级别进行渲染
 * @param {Object} layer
 * @param {Object} renderfield
 * @param {Object} classcount
 */
ol3_styleHelper.classrender = function(layer, renderfield, classcount) {
	if(layer == undefined) return;
	var numberlist = new Array(); //图层要素的渲染字段的所有值
	$.each(layer.getSource().getFeatures(), function(i, feature) {
		if(feature.get(renderfield) != undefined)
			numberlist.push(feature.get(renderfield));
	});
	numberlist.sort(function(a, b) {
		return a > b ? 1 : -1
	}); //对值进行排序
	var min = numberlist[0];
	var max = numberlist[numberlist.length - 1];

	$.each(layer.getSource().getFeatures(), function(i, feature) {

		var index = 0;
		for(i = 0; i < classcount; i++) {
			if((min + i * (max - min) / classcount) <= feature.get(renderfield) && feature.get(renderfield) <= (min + (max - min) * (i + 1) / classcount)) {
				index = i;
				break;
			}
		}; //判断某一要素对应的范围
		var colorstr = [Math.round(28 / classcount * (classcount - index + 1)) + 60, Math.round(215 / classcount * (classcount - index + 1)), Math.round(85 / classcount * (classcount - index + 1)) + 150, 0.5];
		if(feature.get(renderfield) != undefined) {
			var result;
			switch(feature.getGeometry().getType()) {

				case 'LineString':
					result = new ol.style.Style({
						text: new ol.style.Text({
							text: feature.get(renderfield) + '',
							font: "15px 微软雅黑",
							fill: new ol.style.Fill({
								color: 'black'
							}),
						}),
						//根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: colorstr,
							width: 2
						})
					});
					break;
				case 'MultiLineString':
					result = new ol.style.Style({
						text: new ol.style.Text({
							text: feature.get(renderfield) + '',
							font: "15px 微软雅黑",
							fill: new ol.style.Fill({
								color: 'black'
							}),
						}),
						//根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: colorstr,
							width: 2
						})
					});
					break;

				case 'MultiPolygon':
					result = new ol.style.Style({
						text: new ol.style.Text({
							text: feature.get(renderfield) + '',
							font: "15px 微软雅黑",
							fill: new ol.style.Fill({
								color: 'black'
							}),
						}),
						fill: new ol.style.Fill({
							color: colorstr
						}), //根据值设置相应的颜色

					});
					break;
				case 'Polygon':
					result = new ol.style.Style({
						text: new ol.style.Text({
							text: feature.get(renderfield) + '',
							font: "15px 微软雅黑",
							fill: new ol.style.Fill({
								color: 'black'
							}),
						}),
						fill: new ol.style.Fill({
							color: colorstr
						}), //根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: 'rgba(10, 100, 255, 0.6)',
							width: 2
						})
					});
					break;

			}

			feature.setStyle(result);
		} else {
			feature.setStyle(new ol.style.Style({

				fill: new ol.style.Fill({
					//				color: 'rgba(255,255,255,0)'
					color: colorstr
				}), //默认的样式
				stroke: new ol.style.Stroke({
					color: colorstr
				})
			}));
		}
	});
}

/**分级渲染，同时生成图例
 * @param {Object} map
 * @param {Object} layer
 * @param {Object} renderfield
 * @param {Object} classcount
 */
ol3_styleHelper.classrenderAndLegend = function(map, layer, renderfield, classcount, legendtitle) {
	if(map == undefined || layer == undefined || layer.getSource() == undefined || layer.getSource().getFeatures() == undefined || layer.getSource().getFeatures().length < 1) return;
	var numberlist = new Array(); //图层要素的渲染字段的所有值
	var maxlen = 0; //数值的最多小数位数
	$.each(layer.getSource().getFeatures(), function(i, feature) {
		if(feature.get(renderfield) != undefined) {
			numberlist.push(feature.get(renderfield));
			if(feature.get(renderfield).toString().indexOf('.') >= 0)
				maxlen = maxlen > feature.get(renderfield).toString().length - feature.get(renderfield).toString().indexOf('.') ? maxlen : feature.get(renderfield).toString().length - feature.get(renderfield).toString().indexOf('.');
		}
	});
	numberlist.sort(function(a, b) {
		return a > b ? 1 : -1
	}); //对值进行排序
	var min = numberlist[0];
	var max = numberlist[numberlist.length - 1];

	/*开始生成图例*/
	var data = new Array();
	data['title'] = legendtitle == undefined ? '图例' : legendtitle;
	data['featuretype'] = layer.getSource().getFeatures()[0].getGeometry().getType().toLowerCase();
	var legenditems = [];
	for(i = 0; i < classcount; i++) {
		legenditems.push({
			//			content: 'url(http://localhost:8080/GuiYang/images/disaster/滑坡.png)',
			content: 'rgba(' + (Math.round(28 / classcount * (classcount - i + 1)) + 60) + ',' + Math.round(215 / classcount * (classcount - i + 1)) + ',' + (Math.round(85 / classcount * (classcount - i + 1)) + 150) + ', 0.5)',
			label: Math.round((min + i * (max - min) / classcount) * Math.pow(10, maxlen + 1)) / (Math.pow(10, maxlen + 1)) + '-' + Math.round((min + (i + 1) * (max - min) / classcount) * Math.pow(10, maxlen + 1)) / (Math.pow(10, maxlen + 1)),
		});
	};
	data['items'] = legenditems;
	if(ol3_legendHelper.getLegend(map) == undefined)
		map.addControl(new ol.control.Legend());
	ol3_legendHelper.getLegend(map).setJson(data);
	ol3_legendHelper.getLegend(map)["element"].style.display = 'block';

	//	ol3_legendHelper.AddStandardLegend(map, '温度',15,20)
	/*生成图例结束*/
	layer.on('change:visible', function(e) {
			e.oldValue ? ol3_legendHelper.getLegend(map)["element"].style.display = 'none' : ol3_legendHelper.getLegend(map)["element"].style.display = 'block';
		})
		//设置单个要素对应的颜色
	$.each(layer.getSource().getFeatures(), function(i, feature) {

		var index = 0;
		for(i = 0; i <= classcount; i++) {
			if((min + i * (max - min) / classcount) <= feature.get(renderfield) && feature.get(renderfield) < (min + (max - min) * (i + 1) / classcount)) {
				index = i;
				break;
			}
		}; //判断某一要素对应的范围

		var colorstr = [Math.round(28 / classcount * (classcount - index + 1)) + 60, Math.round(215 / classcount * (classcount - index + 1)), Math.round(85 / classcount * (classcount - index + 1)) + 150, 0.8];
		if(feature.get(renderfield) != undefined) {
			var result;
			switch(feature.getGeometry().getType()) {

				case 'LineString':
					result = new ol.style.Style({
						//						text: new ol.style.Text({
						//							text: feature.get(renderfield) + '',
						//							font: "15px 微软雅黑",
						//							fill: new ol.style.Fill({
						//								color: 'black'
						//							}),
						//						}),
						//根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: colorstr,
							width: 3
						})
					});
					break;
				case 'MultiLineString':
					result = new ol.style.Style({
						//						text: new ol.style.Text({
						//							text: feature.get(renderfield) + '',
						//							font: "15px 微软雅黑",
						//							fill: new ol.style.Fill({
						//								color: 'black'
						//							}),
						//						}),
						//根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: colorstr,
							width: 3
						})
					});
					break;

				case 'MultiPolygon':
					result = new ol.style.Style({
						//						text: new ol.style.Text({
						//							text: feature.get(renderfield) + '',
						//							font: "15px 微软雅黑",
						//							fill: new ol.style.Fill({
						//								color: 'black'
						//							}),
						//						}),
						fill: new ol.style.Fill({
							color: colorstr
						}), //根据值设置相应的颜色

					});
					break;
				case 'Polygon':
					result = new ol.style.Style({
						//						text: new ol.style.Text({
						//							text: feature.get(renderfield) + '',
						//							font: "15px 微软雅黑",
						//							fill: new ol.style.Fill({
						//								color: 'black'
						//							}),
						//						}),
						fill: new ol.style.Fill({
							color: colorstr
						}), //根据值设置相应的颜色
					});
					break;

			}
			feature.setStyle(result);
		} else {
			feature.setStyle(new ol.style.Style({

				fill: new ol.style.Fill({
					//				color: 'rgba(255,255,255,0)'
					color: colorstr
				}), //默认的样式
				stroke: new ol.style.Stroke({
					color: colorstr
				})
			}));
		}
	});
}

/**标准颜色渲染，同时生成图例
 * @param {Object} map
 * @param {Object} layer
 * @param {Object} renderfield
 * @param {Object} standardname,标准的名称
 * @param {Object} legendtitle
 */
ol3_styleHelper.StandardRenderAndLegend = function(map, layer, renderfield, standardname) {
		if(map == undefined || layer == undefined || layer.getSource() == undefined || layer.getSource().getFeatures() == undefined || layer.getSource().getFeatures().length < 1) return;

		var min = layer.getSource().getFeatures()[0].get(renderfield);
		var max = layer.getSource().getFeatures()[0].get(renderfield);
		//设置单个要素对应的颜色
		$.each(layer.getSource().getFeatures(), function(i, feature) {
			if(feature.get(renderfield) != undefined) {
				min = min < parseFloat(feature.get(renderfield)) ? min : parseFloat(feature.get(renderfield));
				max = max > parseFloat(feature.get(renderfield)) ? max : parseFloat(feature.get(renderfield));
				var result;
				var colorstr;
				switch(standardname) {
					case '日降雨量':
						colorstr = ol3_standardcolor.getDailyPrec(feature.get(renderfield));
						break;
					case '月降雨量':
						colorstr = ol3_standardcolor.getMonthPrec(feature.get(renderfield));
						break;
					case '季降雨量':
						colorstr = ol3_standardcolor.getSeasonalPrec(feature.get(renderfield));
						break;
					case '年降雨量':
						colorstr = ol3_standardcolor.getYearPrec(feature.get(renderfield));
						break;
					case '温度':
						colorstr = ol3_standardcolor.getTemp(feature.get(renderfield));
						break;
					default:
						colorstr = ol3_standardcolor.getTemp(feature.get(renderfield));
						break;
				}
				switch(feature.getGeometry().getType()) {

					case 'LineString':
						result = new ol.style.Style({
							//						text: new ol.style.Text({
							//							text: feature.get(renderfield) + '',
							//							font: "15px 微软雅黑",
							//							fill: new ol.style.Fill({
							//								color: 'black'
							//							}),
							//						}),
							//根据值设置相应的颜色
							stroke: new ol.style.Stroke({
								color: colorstr,
								width: 3
							})
						});
						break;
					case 'MultiLineString':
						result = new ol.style.Style({
							//						text: new ol.style.Text({
							//							text: feature.get(renderfield) + '',
							//							font: "15px 微软雅黑",
							//							fill: new ol.style.Fill({
							//								color: 'black'
							//							}),
							//						}),
							//根据值设置相应的颜色
							stroke: new ol.style.Stroke({
								color: colorstr,
								width: 3
							})
						});
						break;

					case 'MultiPolygon':
						result = new ol.style.Style({
							//						text: new ol.style.Text({
							//							text: feature.get(renderfield) + '',
							//							font: "15px 微软雅黑",
							//							fill: new ol.style.Fill({
							//								color: 'black'
							//							}),
							//						}),
							fill: new ol.style.Fill({
								color: colorstr
							}), //根据值设置相应的颜色

						});
						break;
					case 'Polygon':
						result = new ol.style.Style({
							//						text: new ol.style.Text({
							//							text: feature.get(renderfield) + '',
							//							font: "15px 微软雅黑",
							//							fill: new ol.style.Fill({
							//								color: 'black'
							//							}),
							//						}),
							fill: new ol.style.Fill({
								color: colorstr
							}), //根据值设置相应的颜色
						});
						break;

				}
				feature.setStyle(result);
			} else {
				feature.setStyle(new ol.style.Style({

					fill: new ol.style.Fill({
						//				color: 'rgba(255,255,255,0)'
						color: colorstr
					}), //默认的样式
					stroke: new ol.style.Stroke({
						color: colorstr
					})
				}));
			}
		});
		ol3_legendHelper.AddStandardLegend(map, standardname, min, max, layer.getSource().getFeatures()[0].getGeometry().getType().toLowerCase())
			/*生成图例结束*/
		layer.on('change:visible', function(e) {
			e.oldValue ? ol3_legendHelper.getLegend(map)["element"].style.display = 'none' : ol3_legendHelper.getLegend(map)["element"].style.display = 'block';
		})
	}
	/**分级渲染，同时生成图例
	 * @param {Object} map
	 * @param {Object} layer
	 * @param {Object} renderfield
	 * @param {Object} classcount
	 */
ol3_styleHelper.CustomrenderAndLegend = function(map, layer, renderfield, custominfos, legendtitle) {
	if(map == undefined || layer == undefined || layer.getSource() == undefined || layer.getSource().getFeatures() == undefined || layer.getSource().getFeatures().length < 1) return;

	var min = layer.getSource().getFeatures()[0].get(renderfield);
	var max = layer.getSource().getFeatures()[0].get(renderfield);
	$.each(layer.getSource().getFeatures(), function(i, feature) {

		if(feature.get(renderfield) != undefined) {
			var result;
			var colorstr;
			min = min < parseFloat(feature.get(renderfield)) ? min : parseFloat(feature.get(renderfield));
			max = max > parseFloat(feature.get(renderfield)) ? max : parseFloat(feature.get(renderfield));

			for(i = 0; i < custominfos.length; i++) {
				if(custominfos[i][0] <= feature.get(renderfield) && feature.get(renderfield) < custominfos[i][1]) {
					colorstr = custominfos[i][2];
					break;
				}
			}; //判断某一要素对应的范围
			switch(feature.getGeometry().getType()) {

				case 'LineString':
					result = new ol.style.Style({
						//根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: colorstr,
							width: 3
						})
					});
					break;
				case 'MultiLineString':
					result = new ol.style.Style({
						//根据值设置相应的颜色
						stroke: new ol.style.Stroke({
							color: colorstr,
							width: 3
						})
					});
					break;

				case 'MultiPolygon':
					result = new ol.style.Style({
						fill: new ol.style.Fill({
							color: colorstr
						}), //根据值设置相应的颜色

					});
					break;
				case 'Polygon':
					result = new ol.style.Style({
						fill: new ol.style.Fill({
							color: colorstr
						}), //根据值设置相应的颜色
					});
					break;

			}
			feature.setStyle(result);
		} else {
			feature.setStyle(new ol.style.Style({

				fill: new ol.style.Fill({
					//				color: 'rgba(255,255,255,0)'
					color: colorstr
				}), //默认的样式
				stroke: new ol.style.Stroke({
					color: colorstr
				})
			}));
		}
	});
	/*开始生成图例*/
	var data = new Array();
	data['title'] = legendtitle == undefined ? '图例' : legendtitle;
	data['featuretype'] = layer.getSource().getFeatures()[0].getGeometry().getType().toLowerCase();
	var legenditems = [];
	for(i = 0; i < custominfos.length; i++) {
		if(custominfos[i][0] >= min && custominfos[i][1] <= max || (custominfos[i][0] <= min && custominfos[i][1] >= min) || (custominfos[i][0] <= max && custominfos[i][1] >= max)) {
			legenditems.push({
				content: 'rgba(' + custominfos[i][2] + ', 1)',
				label: custominfos[i][0] + '-' + custominfos[i][1],
			});
		}
	};
	data['items'] = legenditems;
	if(ol3_legendHelper.getLegend(map) == undefined)
		map.addControl(new ol.control.Legend());
	ol3_legendHelper.getLegend(map).setJson(data);
	ol3_legendHelper.getLegend(map)["element"].style.display = 'block';

	/*生成图例结束*/
	layer.on('change:visible', function(e) {
		e.oldValue ? ol3_legendHelper.getLegend(map)["element"].style.display = 'none' : ol3_legendHelper.getLegend(map)["element"].style.display = 'block';
	})

}

ol3_styleHelper.prototype = {

	}
	/**
	 * 颜色标准帮助类，用于生成标准颜色
	 */
ol3_standardcolor = function() {};
/**根据日降雨量值获取对应的标准颜色
 * @param {Object} value，降雨量值
 * @return 例子[206,252,209]
 */
ol3_standardcolor.getDailyPrec = function(value) {
		var result = [255, 255, 255]; //默认颜色
		if(0.1 <= parseFloat(value) && parseFloat(value) <= 9.9) {
			result = [250, 254, 205]
		} else if(10 <= parseFloat(value) && parseFloat(value) <= 24.9) {
			result = [206, 252, 209]
		} else if(25 <= parseFloat(value) && parseFloat(value) <= 49.9) {
			result = [149, 248, 205]
		} else if(50 <= parseFloat(value) && parseFloat(value) <= 99.9) {
			result = [88, 238, 243]
		} else if(100 <= parseFloat(value) && parseFloat(value) <= 200) {
			result = [87, 211, 252]
		} else if(200 < parseFloat(value)) {
			result = [37, 166, 239]
		}
		return result;
	}
	/**根据月降雨量值获取对应的标准颜色
	 * @param {Object} value，降雨量值
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getMonthPrec = function(value) {
		var result = [255, 255, 255]; //默认颜色
		if(0.1 <= parseFloat(value) && parseFloat(value) <= 9.9) {
			result = [166, 251, 214]
		} else if(10 <= parseFloat(value) && parseFloat(value) <= 49.9) {
			result = [88, 238, 243]
		} else if(50 <= parseFloat(value) && parseFloat(value) <= 99.9) {
			result = [87, 211, 252]
		} else if(100 <= parseFloat(value) && parseFloat(value) <= 200) {
			result = [37, 166, 239]
		} else if(200 <= parseFloat(value) && parseFloat(value) <= 300) {
			result = [14, 118, 236]
		} else if(300 <= parseFloat(value) && parseFloat(value) <= 400) {
			result = [54, 80, 240]
		} else if(400 <= parseFloat(value) && parseFloat(value) <= 800) {
			result = [86, 31, 226]
		} else if(800 < parseFloat(value)) {
			result = [59, 25, 187]
		}
		return result;
	}
	/**根据季降雨量值获取对应的标准颜色
	 * @param {Object} value，降雨量值
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getSeasonalPrec = function(value) {
	var result = [255, 255, 255]; //默认颜色
	if(0.1 <= parseFloat(value) && parseFloat(value) <= 9.9) {
		result = [166, 251, 214]
	} else if(10 <= parseFloat(value) && parseFloat(value) <= 49.9) {
		result = [88, 238, 243]
	} else if(50 <= parseFloat(value) && parseFloat(value) <= 99.9) {
		result = [87, 211, 252]
	} else if(100 <= parseFloat(value) && parseFloat(value) <= 200) {
		result = [37, 166, 239]
	} else if(200 <= parseFloat(value) && parseFloat(value) <= 400) {
		result = [74, 97, 238]
	} else if(400 <= parseFloat(value) && parseFloat(value) <= 600) {
		result = [74, 44, 222]
	} else if(600 <= parseFloat(value) && parseFloat(value) <= 1000) {
		result = [59, 25, 187]
	} else if(1000 < parseFloat(value)) {
		result = [64, 8, 166]
	}
	return result;
}

/**根据年降雨量值获取对应的标准颜色
 * @param {Object} value，降雨量值
 * @return 例子[206,252,209]
 */
ol3_standardcolor.getYearPrec = function(value) {
		var result = [255, 255, 255]; //默认颜色
		if(0.1 <= parseFloat(value) && parseFloat(value) <= 49.9) {
			result = [101, 242, 247]
		} else if(49.9 <= parseFloat(value) && parseFloat(value) <= 99.9) {
			result = [87, 211, 252]
		} else if(100 <= parseFloat(value) && parseFloat(value) <= 500) {
			result = [56, 81, 235]
		} else if(500 <= parseFloat(value) && parseFloat(value) <= 1000) {
			result = [59, 25, 187]
		} else if(1000 <= parseFloat(value) && parseFloat(value) <= 2000) {
			result = [63, 6, 157]
		} else if(2000 <= parseFloat(value)) {
			result = [62, 3, 128]
		}
		return result;
	}
	/**根据温度值获取对应的标准颜色
	 * @param {Object} value，温度值
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getTemp = function(value) {
		var result = [255, 255, 255]; //默认颜色
		if(parseFloat(value) < -48) {
			result = [51, 13, 128]
		}
		if(-48 <= parseFloat(value) && parseFloat(value) < -44) {
			result = [70, 33, 146]
		} else if(-44 <= parseFloat(value) && parseFloat(value) < -40) {
			result = [84, 64, 182]
		} else if(-40 <= parseFloat(value) && parseFloat(value) < -36) {
			result = [67, 73, 201]
		} else if(-36 <= parseFloat(value) && parseFloat(value) < -32) {
			result = [77, 102, 210]
		} else if(-32 <= parseFloat(value) && parseFloat(value) < -28) {
			result = [87, 117, 213]
		} else if(-28 <= parseFloat(value) && parseFloat(value) < -24) {
			result = [79, 151, 225]
		} else if(-24 <= parseFloat(value) && parseFloat(value) < -20) {
			result = [132, 185, 251]
		} else if(-20 <= parseFloat(value) && parseFloat(value) < -16) {
			result = [108, 198, 236]
		} else if(-16 <= parseFloat(value) && parseFloat(value) < -12) {
			result = [115, 225, 231]
		} else if(-12 <= parseFloat(value) && parseFloat(value) < -8) {
			result = [171, 247, 235]
		} else if(-8 <= parseFloat(value) && parseFloat(value) < -4) {
			result = [203, 251, 218]
		} else if(-4 <= parseFloat(value) && parseFloat(value) < 0) {
			result = [238, 253, 202]
		} else if(0 <= parseFloat(value) && parseFloat(value) < 4) {
			result = [249, 250, 213]
		} else if(4 <= parseFloat(value) && parseFloat(value) < 8) {
			result = [252, 242, 172]
		} else if(8 <= parseFloat(value) && parseFloat(value) < 12) {
			result = [253, 227, 125]
		} else if(12 <= parseFloat(value) && parseFloat(value) < 16) {
			result = [252, 200, 101]
		} else if(16 <= parseFloat(value) && parseFloat(value) < 20) {
			result = [250, 166, 68]
		} else if(20 <= parseFloat(value) && parseFloat(value) < 24) {
			result = [250, 146, 0]
		} else if(24 <= parseFloat(value) && parseFloat(value) < 28) {
			result = [255, 121, 26]
		} else if(28 <= parseFloat(value) && parseFloat(value) < 32) {
			result = [240, 93, 4]
		} else if(32 <= parseFloat(value) && parseFloat(value) < 36) {
			result = [247, 79, 20]
		} else if(36 <= parseFloat(value) && parseFloat(value) < 40) {
			result = [252, 38, 3]
		} else if(40 <= parseFloat(value) && parseFloat(value) < 44) {
			result = [231, 0, 0]
		} else if(44 <= parseFloat(value) && parseFloat(value) < 48) {
			result = [213, 6, 55]
		} else if(48 <= parseFloat(value)) {
			result = [187, 1, 45]
		}
		return result;
	}
	/**根据降温值获取对应的标准颜色
	 * @param {Object} value，降温值
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getDropTemp = function(value) {
		var result = [255, 255, 255]; //默认颜色
		if(0 <= parseFloat(value) && parseFloat(value) < 4) {
			result = [203, 251, 218]
		} else if(4 <= parseFloat(value) && parseFloat(value) < 8) {
			result = [115, 225, 231]
		} else if(8 <= parseFloat(value) && parseFloat(value) < 12) {
			result = [132, 185, 251]
		} else if(12 <= parseFloat(value) && parseFloat(value) < 16) {
			result = [87, 117, 213]
		} else if(16 <= parseFloat(value) && parseFloat(value) < 20) {
			result = [67, 73, 201]
		}

		return result;
	}
	/**根据温度距平获取对应的标准颜色
	 * @param {Object} value，温度值
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getDepartureTemp = function(value) {
		var result = [255, 255, 255]; //默认颜色
		if(parseFloat(value) < -8) {
			result = [55, 20, 208]
		}
		if(-8 <= parseFloat(value) && parseFloat(value) < -4) {
			result = [2, 92, 226]
		} else if(-4 <= parseFloat(value) && parseFloat(value) < -2) {
			result = [75, 171, 245]
		} else if(-2 <= parseFloat(value) && parseFloat(value) < -1) {
			result = [134, 232, 250]
		} else if(-1 <= parseFloat(value) && parseFloat(value) < -0.5) {
			result = [203, 251, 218]
		} else if(-0.5 <= parseFloat(value) && parseFloat(value) < 0) {
			result = [240, 251, 179]
		} else if(0 <= parseFloat(value) && parseFloat(value) < 0.5) {
			result = [252, 245, 163]
		} else if(0.5 <= parseFloat(value) && parseFloat(value) < 1) {
			result = [253, 227, 125]
		} else if(1 <= parseFloat(value) && parseFloat(value) < 2) {
			result = [250, 166, 69]
		} else if(2 <= parseFloat(value) && parseFloat(value) < 4) {
			result = [251, 103, 14]
		} else if(4 <= parseFloat(value) && parseFloat(value) < 8) {
			result = [247, 79, 20]
		} else if(8 <= parseFloat(value)) {
			result = [251, 37, 2]
		}

		return result;
	}
	/**根据沙尘天气获取对应的标准颜色
	 * @param {Object} value，沙尘类型
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getSandWeather = function(value) {
		var result = [255, 255, 255]; //默认颜色
		switch(value) {
			case '浮尘':
				result = [255, 245, 192]
				break;
			case '扬沙':
				result = [252, 215, 117]
				break;
			case '沙尘暴':
				result = [218, 154, 48]
				break;
			case '强沙尘暴':
				result = [158, 98, 38]
				break;
			case '特强沙尘暴':
				result = [113, 73, 33]
				break;
			default:
				result = [255, 255, 255]
				break;
		}
		return result;
	}
	/**根据地质灾害等级获取对应的标准颜色
	 * @param {Object} value，地质灾害等级
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getDisaster = function(value) {
		var result = [255, 255, 255]; //默认颜色
		switch(value) {
			case '三级':
				result = [199, 151, 5]
				break;
			case '四级':
				result = [133, 110, 2]
				break;
			case '五级':
				result = [106, 73, 2]
				break;
			default:
				result = [255, 255, 255]
				break;
		}
		return result;
	}
	/**根据火险等级获取对应的标准颜色
	 * @param {Object} value，火险等级
	 * @return 例子[206,252,209]
	 */
ol3_standardcolor.getFireDanger = function(value) {
	var result = [255, 255, 255]; //默认颜色
	switch(value) {
		case '三级':
			result = [244, 138, 12]
			break;
		case '四级':
			result = [244, 83, 12]
			break;
		case '五级':
			result = [227, 21, 16]
			break;
		default:
			result = [255, 255, 255]
			break;
	}
	return result;
}

function ol3_legendHelper() {}

/**添加使用标准色的图例
 * @param {Object} map
 * @param {Object} name图例对应的名称：包括:日降雨量,月降雨量,温度
 * @param {Object} min
 * @param {Object} max
 * @param {Object} geotype,要素类型，线或面
 */
ol3_legendHelper.AddStandardLegend = function(map, name, min, max, geotype) {
		var min = min == undefined ? -999999999 : min;
		var max = max == undefined ? 99999999 : max;
		var legend = ol3_legendHelper.getLegend(map);
		if(legend == undefined) {
			legend = new ol.control.Legend();
			map.addControl(legend);
		}
		var data = new Array();
		data['featuretype'] = geotype;
		var legenditems = [];
		switch(name) {
			case '日降雨量':
				data['title'] = '日降雨量(mm)';
				if(min <= 0.1 && max >= 9.9 || (0.1 <= min && min <= 9.9) || (0.1 <= max && max <= 9.9))
					legenditems.push({
						content: 'rgba(250, 254, 205,1)',
						label: '0.1-9.9'
					});
				if(min <= 10 && max >= 24.9)
					legenditems.push({
						content: 'rgba(206, 252, 209,1)',
						label: '10-24.9'
					});
				if(min <= 25 && max >= 49.9 || (25 <= min && min < 49.9) || (25 <= max && max <= 49.9))
					legenditems.push({
						content: 'rgba(149, 248, 205,1)',
						label: '25-49.9'
					});
				if(min <= 50 && max >= 99.9 || (50 <= min && min < 99.9) || (50 <= max && max <= 99.9))
					legenditems.push({
						content: 'rgba(88, 238, 243,1)',
						label: '50-99.9'
					});
				if(min <= 100 && max >= 200 || (100 <= min && min <= 200) || (100 <= max && max <= 200))
					legenditems.push({
						content: 'rgba(87, 211, 252,1)',
						label: '100-200'
					});
				if(max >= 200)
					legenditems.push({
						content: 'rgba(37, 166, 239,1)',
						label: '>200'
					});
				break;
			case '月降雨量':
				data['title'] = '月降雨量(mm)';
				if(min <= 0.1 && max >= 9.9 || (0.1 <= min && min <= 9.9) || (0.1 <= max && max <= 9.9))
					legenditems.push({
						content: 'rgba(166, 251, 214,1)',
						label: '0.1-9.9'
					});
				if(min <= 10 && max >= 49.9 || (10 <= min && min <= 49.9) || (10 <= max && max <= 49.9))
					legenditems.push({
						content: 'rgba(88, 238, 243,1)',
						label: '10-49.9'
					});
				if(min <= 50 && max >= 99.9 || (50 <= min && min < 99.9) || (50 <= max && max <= 99.9))
					legenditems.push({
						content: 'rgba(87, 211, 252,1)',
						label: '50-99.9'
					});
				if(min <= 100 && max >= 200 || (100 <= min && min <= 200) || (100 <= max && max <= 200))
					legenditems.push({
						content: 'rgba(37, 166, 239,1)',
						label: '100-200'
					});
				if(min <= 200 && max >= 300 || (200 <= min && min <= 300) || (200 <= max && max <= 300))
					legenditems.push({
						content: 'rgba(14, 118, 236,1)',
						label: '200-300'
					});
				if(min <= 300 && max >= 400 || (300 <= min && min <= 400) || (300 <= max && max <= 400))
					legenditems.push({
						content: 'rgba(54, 80, 240,1)',
						label: '300-400'
					});
				if(min <= 400 && max >= 800 || (400 <= min && min <= 800) || (400 <= max && max <= 800))
					legenditems.push({
						content: 'rgba(86, 31, 226,1)',
						label: '400-800'
					});
				if(max >= 800)
					legenditems.push({
						content: 'rgba(59, 25, 187,1)',
						label: '>800'
					});
				break;
			case '温度':
			default:
				data['title'] = '温度(℃)';
				if(min <= -48)
					legenditems.push({
						content: 'rgba(51, 13, 128,1)',
						label: '<-48'
					});
				if(min <= -48 && max >= -44 || (-48 <= min && min <= -44) || (-48 <= max && max <= -44))
					legenditems.push({
						content: 'rgba(70, 33, 146,1)',
						label: '-48--44'
					});
				if(min <= -44 && max >= -40 || (-44 <= min && min <= -40) || (-44 <= max && max <= -40))
					legenditems.push({
						content: 'rgba(84, 64, 182,1)',
						label: '-44--40'
					});
				if(min <= -40 && max >= -36 || (-40 <= min && min <= -36) || (-40 <= max && max <= -36))
					legenditems.push({
						content: 'rgba(67, 73, 201,1)',
						label: '-40--36'
					});
				if(min <= -36 && max >= -32 || (-36 <= min && min <= -32) || (-36 <= max && max <= -32))
					legenditems.push({
						content: 'rgba(77, 102, 210,1)',
						label: '-36--32'
					});
				if(min <= -32 && max >= -28 || (-32 <= min && min <= -28) || (-32 <= max && max <= -28))
					legenditems.push({
						content: 'rgba(87, 117, 213,1)',
						label: '-32--28'
					});
				if(min <= -28 && max >= -24 || (-28 <= min && min <= -24) || (-28 <= max && max <= -24))
					legenditems.push({
						content: 'rgba(79, 151, 225,1)',
						label: '-28--24'
					});
				if(min <= -24 && max >= -20 || (-24 <= min && min <= -20) || (-24 <= max && max <= -20))
					legenditems.push({
						content: 'rgba(132, 185, 251,1)',
						label: '-24--20'
					});
				if(min <= -20 && max >= -16 || (-20 <= min && min <= -16) || (-20 <= max && max <= -16))
					legenditems.push({
						content: 'rgba(108, 198, 236,1)',
						label: '-20--16'
					});
				if(min <= -16 && max >= -12 || (-16 <= min && min <= -12) || (-16 <= max && max <= -12))
					legenditems.push({
						content: 'rgba(115, 225, 231,1)',
						label: '-16--12'
					});
				if(min <= -12 && max >= -8 || (-12 <= min && min <= -8) || (-12 <= max && max <= -8))
					legenditems.push({
						content: 'rgba(171, 247, 235,1)',
						label: '-12--8'
					});
				if(min <= -8 && max >= -4 || (-8 <= min && min <= -4) || (-8 <= max && max <= -4))
					legenditems.push({
						content: 'rgba(203, 251, 218,1)',
						label: '-8--4'
					});
				if(min <= -4 && max >= 0 || (-4 <= min && min <= 0) || (-4 <= max && max <= 0))
					legenditems.push({
						content: 'rgba(238, 253, 202,1)',
						label: '-4-0'
					});
				if(min <= 0 && max >= 4 || (0 <= min && min <= 4) || (0 <= max && max <= 4))
					legenditems.push({
						content: 'rgba(249, 250, 213,1)',
						label: '0-4'
					});
				if(min <= 4 && max >= 8 || (4 <= min && min <= 8) || (4 <= max && max <= 8))
					legenditems.push({
						content: 'rgba(252, 242, 172,1)',
						label: '4-8'
					});
				if(min <= 8 && max >= 12 || (8 <= min && min <= 12) || (8 <= max && max <= 12))
					legenditems.push({
						content: 'rgba(253, 227, 125,1)',
						label: '8-12'
					});
				if(min <= 12 && max >= 16 || (12 <= min && min <= 16) || (12 <= max && max <= 16))
					legenditems.push({
						content: 'rgba(252, 200, 101,1)',
						label: '12-16'
					});
				if(min <= 16 && max >= 20 || (16 <= min && min <= 20) || (16 <= max && max <= 20))
					legenditems.push({
						content: 'rgba(250, 166, 68,1)',
						label: '16-20'
					});
				if(min <= 20 && max >= 24 || (20 <= min && min <= 24) || (20 <= max && max <= 24))
					legenditems.push({
						content: 'rgba(250, 146, 0,1)',
						label: '20-24'
					});
				if(min <= 24 && max >= 28 || (24 <= min && min <= 28) || (24 <= max && max <= 28))
					legenditems.push({
						content: 'rgba(255, 121, 26,1)',
						label: '24-28'
					});
				if(min <= 28 && max >= 32 || (28 <= min && min <= 32) || (28 <= max && max <= 32))
					legenditems.push({
						content: 'rgba(240, 93, 4,1)',
						label: '28-32'
					});
				if(min <= 32 && max >= 36 || (32 <= min && min <= 36) || (32 <= max && max <= 36))
					legenditems.push({
						content: 'rgba(247, 79, 20,1)',
						label: '32-36'
					});
				if(min <= 36 && max >= 40 || (36 <= min && min <= 40) || (36 <= max && max <= 40))
					legenditems.push({
						content: 'rgba(252, 38, 3,1)',
						label: '36-40'
					});
				if(min <= 40 && max >= 44 || (40 <= min && min <= 44) || (40 <= max && max <= 44))
					legenditems.push({
						content: 'rgba(231, 0, 0,1)',
						label: '40-44'
					});
				if(min <= 44 && max >= 48 || (44 <= min && min <= 48) || (44 <= max && max <= 48))
					legenditems.push({
						content: 'rgba(213, 6, 55,1)',
						label: '44-48'
					});
				if(max > 48)
					legenditems.push({
						content: 'rgba(187, 1, 45,1)',
						label: '>48'
					});
				break;
				//			default:
				//				break;
		}
		data['items'] = legenditems;
		legend.setJson(data);
		legend["element"].style.display = 'block';
	}
	/**获取地图的图例
	 * @param {Object} map
	 */
ol3_legendHelper.getLegend = function(map) {
	var count = map.getControls().getLength();
	for(var i = 0; i < count; i++) {
		if(map.getControls().getArray()[i].constructor == ol.control.Legend) {
			return map.getControls().getArray()[i];
		}

	}
}

function ol3_popupHelper() {}
/**
 * 初始化popup
 * @param map {Object} map对象
 * @param popupId {String} popupID
 * @param contentId {String} 外部容器ID
 * @param closerId {String} 关闭按钮ID
 * @return overlay {Object} popup对象
 */
ol3_popupHelper.initPopup = function(map, popupId, contentId, closerId) {
	var container = $("#" + popupId)[0] == undefined ? $('<div id="popup" class="ol-popup"/>').appendTo($('body'))[0] : $("#" + popupId)[0];
	var closer = $("#" + closerId)[0] == undefined ? $('<a id="popup-closer" class="ol-popup-closer"/>').appendTo(container)[0] : $("#" + closerId)[0];
	var content = $("#" + contentId)[0] == undefined ? $('<div id="popup-content" class="small"/>').appendTo(container)[0] : $("#" + contentId)[0];
	var overlay = new ol.Overlay({
		id: 'featurepopupid',
		element: $("#" + popupId)[0] == undefined ? container : $("#" + popupId)[0],
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});

	closer.onclick = function() {
		overlay.setPosition(undefined);
		closer.blur();
		$.each(map.getInteractions().getArray(), function(m, item) {
			if(item.constructor == ol.interaction.Select) {
				item.getFeatures().clear();
			}
		})

	};

	map.addOverlay(overlay);
	return overlay;
}

ol3_popupHelper.prototype = {

	}
	/**
	 * 查询操作帮助类，用于Goserver发布的wfs服务，包含属性查询及空间查询
	 */
ol3_queryHelper = function() {}
	/**查询功能，根据输入条件返回json结果
	 * @param {Object} url 
	 * @example 192.168.0.109:8080
	 * @param {Object} layername
	 *  @example ssd:guiyang
	 * @param {Object} filter
	 * @param {Object} callback，参数为json结果
	 * 回调函数
	 */
ol3_queryHelper.Query = function(url, layername, filter, callback) {
		$.ajax('http://' + url + '/geoserver/wfs', {
			type: 'GET',
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: layername,
				srsname: 'EPSG:4326',
				outputFormat: 'text/javascript',
				//			bbox:'106.7974162,26.41340007,106.968251,27.07962723,EPSG:4326'
				filter: filter
			},
			dataType: 'jsonp',
			jsonpCallback: 'callback:' + callback,
			jsonp: 'format_options'
		});

	}
	/**获取单条件的xml形式的filter过滤条件
	 * @param {Object} propertyname 属性名
	 * @param {Object} filtertype  过滤类型包括
	EqualTo
	GreaterThan
	GreaterThanOrEqualTo
	IsLike
	LessThan
	LessThanOrEqualTo
	NotEqualTo
	 * @param {Object} value 过滤值
	 */
ol3_queryHelper.getFilter = function(propertyname, filtertype, value) {
		var result;
		if(propertyname == undefined || value == undefined || filtertype == undefined)
			return false;
		var subproprty = '';
		switch(filtertype) {
			case 'IsLike':
				subproprty = " wildCard='*' singleChar='-' escapeChar='!'";
				value = value + "*";
				break;
			case 'EqualTo':
				filtertype = 'IsEqualTo'
				break;
			case 'GreaterThan':
				filtertype = 'IsGreaterThan'
				break;
			case 'GreaterThanOrEqualTo':
				filtertype = 'IsGreaterThanOrEqualTo'
				break;
			case 'LessThan':
				filtertype = 'IsLessThan'
				break;
			case 'LessThanOrEqualTo':
				filtertype = 'IsLessThanOrEqualTo'
				break;
			case 'NotEqualTo':
				filtertype = 'IsNotEqualTo'
				break;
			default:
				break;
		}

		result = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Property' + filtertype + subproprty + "><PropertyName>" + propertyname + '</PropertyName><Literal>' + value + '</Literal></Property' + filtertype + '></Filter>';
		return result;
	}
	/**空间相交查询
	 * @param {Object} url，wfs的ip地址 如‘192.168.0.109:8080’
	 * @param {Object} layername，图层名 如‘ssd:sheng’
	 * @param {Object} features
	 * @param {Object} callback
	 */
ol3_queryHelper.intersectsQuery = function(url, layername, features, callback) {
		var filter = "";
		if(features != null || features != undefined) {
			filter = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Or>';
			$.each(features, function(i, feature) {
				for(var j = 0; j < feature.getGeometry().getPolygons().length; j++) {
					var polygon = feature.getGeometry().getPolygons()[j];
					var linecount = polygon.getLinearRings().length;
					if(linecount == 1) {
						var coors = polygon.getLinearRings()[0].simplify(0.1).getCoordinates();
						if(coors.length >= 4) {
							$.each(coors, function(k, coor) {
								coor.reverse();
							})
						} else {
							break;
						}
						var coordinates = coors.join(' ');
						filter += '<Intersects><PropertyName>geom</PropertyName><gml:Polygon><gml:exterior><gml:LinearRing><gml:coordinates>' + coordinates + "</gml:coordinates></gml:LinearRing></gml:exterior></gml:Polygon></Intersects>";
					} else {
						$.each(polygon.getLinearRings(), function(k, linearing) {
							var coors = linearing.simplify(0.1).getCoordinates();
							$.each(coors, function(k, coor) {
								coor.reverse();
							})

							var coordinates = coors.join(' ');
							//				filter=filter+"<Intersects><PropertyName>geom</PropertyName><gml:Polygon srsName='http://www.opengis.net/gml/srs/epsg.xml#4326'><gml:outerBoundaryIs><gml:LinearRing><gml:posList>24.470132384000067 110.07324275100007 24.470132384000067 110.45267041100004 24.127459084000066 109.98868994200006 23.779832685000088 109.85572356300003 23.442266628000084 109.55919652400007 23.310636298000077 108.76838555300003 23.779432157000087 108.50093350700007 23.663820385000065 108.75138558800006 24.38646349000004 109.79621095500005 24.470132384000067 110.07324275100007</gml:posList></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></Intersects>";
							if(k == 0)
								filter += '<Intersects><PropertyName>geom</PropertyName><gml:Polygon><gml:exterior><gml:LinearRing><gml:coordinates>' + coordinates + "</gml:coordinates></gml:LinearRing></gml:exterior>";
							else
								filter += '<gml:interior><gml:LinearRing><gml:coordinates>' + coordinates + "</gml:coordinates></gml:LinearRing></gml:interior>";
						})
						filter += "</gml:Polygon></Intersects>";
					}
				}
			})
			filter += "</Or></Filter>"
		}
		//filter='<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects> <PropertyName>geom</PropertyName><gml:Envelope srsName="EPSG:4326"><gml:lowerCorner>104.61174162 24.53340007</gml:lowerCorner><gml:upperCorner>107.858251 26.77962723</gml:upperCorner></gml:Envelope></Intersects></Filter>';
		//filter='<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">'+"<Intersects><PropertyName>geom</PropertyName><gml:Polygon srsName='http://www.opengis.net/gml/srs/epsg.xml#4326'><gml:outerBoundaryIs><gml:LinearRing><gml:coord><gml:X>110.0732</gml:X><gml:Y>24.4701</gml:Y></gml:coord><gml:coord><gml:X>108.93130828200003</gml:X><gml:Y>23.36463677</gml:Y></gml:coord><gml:coord><gml:X>108.75138558800006</gml:X><gml:Y>24.38646349000004</gml:Y></gml:coord><gml:coord><gml:X>110.0732</gml:X><gml:Y>24.4701</gml:Y></gml:coord></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></Intersects></Filter>";
		//filter='<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">'+"<Intersects><PropertyName>geom</PropertyName><gml:Polygon ><gml:exterior><gml:LinearRing><gml:coordinates>24.4701,110.0732 24.4701,110.4526 24.1274,109.9886 23.7798,109.8557 23.4422,109.5591 23.3106,108.7683 23.7794,108.5009 23.6638,108.75138 24.3864,109.7962 24.4701,110.0732</gml:coordinates></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter>";
		//filter='<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">'+"<Intersects><PropertyName>geom</PropertyName><gml:Point><gml:coordinates>24.4701,107.0732</gml:coordinates></gml:Point></Intersects></Filter>";
		$.ajax('http://' + url + '/geoserver/wfs', {
			type: 'POST',
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: layername,
				srsname: 'EPSG:4326',
				outputFormat: 'text/javascript',
				//			bbox:'106.7974162,26.41340007,106.968251,27.07962723,EPSG:4326'
				filter: filter
			},
			dataType: 'jsonp',
			jsonpCallback: 'callback:' + callback,
			jsonp: 'format_options'
		});
	}
	/**等值线类、面，初始化包含必要的参数及可选参数
	 * @param {Object} options
	 */
Contour = function(options) {
	/**
	 * 等值线服务的地址，如http://192.168.0.109:8080/geoserver/cwms?
	 */
	this.url = options.url;
	/**
	 * 生成等值线的类型，包括：‘line’和‘polygon’
	 */
	this.type = options.type;
	/**
	 * 生成等值线的插值点要素
	 */
	this.features = options.features;
	/**
	 * 插值点要素的坐标系
	 */
	this.featuresproject = options.featuresproject;
	/**
	 * 插值点的字段
	 */
	this.fieldname = options.fieldname;
	/**
	 * 用来截取结果的面的编码，国家标准
	 */
	this.citycode = options.citycode;
	/**
	 * 插值的数值间距数组
	 */
	this.inter = options.inter;
	/**
	 * 生成等值的宽度
	 */
	this.width = options.width;
	/**
	 * 生成等值的高度
	 */
	this.height = options.height;
};
/**生成等值线、面
 * @param {Object} callback
 */
Contour.prototype.createContour = function(callback) {
	if(this.url == undefined || this.features == undefined || this.fieldname == undefined) return;
	var points = new Array();;
	var count = this.features.length;
	var inter = new Array();
	for(var i = 0; i < count; i++) {
		var feature = this.features[i];
		if(feature.get('features')) {
			for(var m = 0; m < feature.get('features').length; m++) {
				var clufeature = feature.get('features')[m];
				if(clufeature.getGeometry().constructor != ol.geom.Point || clufeature.get(this.fieldname) == '999.9') continue;
				var item = new Array();
				var pro4326point = clufeature.getGeometry().getCoordinates();
				if(this.featuresproject=='EPSG:3857')
				pro4326point = new ol.proj.transform(clufeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
				item.push(pro4326point[0]);
				item.push(pro4326point[1]);
				item.push(clufeature.get(this.fieldname));
				if(inter.indexOf(clufeature.get(this.fieldname)) == -1 && clufeature.get(this.fieldname) != '999.9')
					inter.push(clufeature.get(this.fieldname));
				points.push(item);
			}
		} else {
			if(feature.getGeometry().constructor != ol.geom.Point || feature.get(this.fieldname) == '999.9') continue;
			var item = new Array();
			var pro4326point = feature.getGeometry().getCoordinates();
			if(this.featuresproject=='EPSG:3857')
			pro4326point = new ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			item.push(pro4326point[0]);
			item.push(pro4326point[1]);
			item.push(feature.get(this.fieldname));
			if(inter.indexOf(feature.get(this.fieldname)) == -1 && feature.get(this.fieldname) != '999.9')
				inter.push(feature.get(this.fieldname));
			points.push(item);
		}
	}
	inter.sort();
	//	if(inter.length>10)
	//	{
	//		var min=inter[0];
	//		var max=inter[inter.length-1];
	//		inter.length=0;
	//		for (var i=0;i<10;i++) {
	//			inter.push(min+(max-min)*i/10);
	//		}
	//	}
	inter = this.inter ? this.inter : inter;
	var parpms = {
		'service': 'c_server', //服务名 固定的
		'request': 'GetCountour', //请求   固定的
//		 'srs':'EPSG:3857',
		'width': this.width ? this.width : 50, //返回图片的宽 
		'height': this.height ? this.height : 50, //返回图片的 高
		'inter_values': inter.join(','), //值
		'version': '1.0.0', //固定
		'contourType': this.type ? this.type : 'polygon', //'polygon',//'line', //等值面还是线
		'citycode': this.citycode ? this.citycode : '0', //剪贴面 编码 必须有一个字段 叫citycode 这里是对应的值
		'points': points.join(',') //点集合
	};

	$.ajax({
		type: "post", //使用post方法访问后台
		data: parpms,
		crossDomain: true,
		url: this.url,
		dataType: "json", 
		success: function(result) {
			callback(result);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

		}
	});

}