/**
 * 示例
 content: 'url(http://localhost:8080/GuiYang/images/disaster/滑坡.png)',图片的绝对路径
 content: 'rgba(' + Math.round(255 / classcount *(i + 1)) + ', 80, 0, 0.6)',颜色值：rgb或16进制颜色值
 label: ‘标注’
		
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.LegendOptions=} opt_options Legend options.
 * @api stable
 */
ol.control.Legend = function(opt_options) {

	var options = opt_options ? opt_options : {};

	var className = options.className !== undefined ? options.className : 'ol-legend';

	/**
	 * @private
	 * @type {Element}
	 */
	this.innerElement_ = document.createElement('DIV');
	this.innerElement_.className = className + '-inner';

	/**
	 * @private
	 * @type {Element}
	 */
	this.element_ = document.createElement('DIV');
	this.element_.className = className + ' ol-unselectable';
	this.element_.appendChild(this.innerElement_);

	/**
	 * @private
	 * @type {?olx.ViewState}
	 */
	this.viewState_ = null;

	/**
	 * @private
	 * @type {number}
	 */
	this.minWidth_ = options.minWidth !== undefined ? options.minWidth : 64;

	/**
	 * @private
	 * @type {boolean}
	 */
	this.renderedVisible_ = false;

	/**
	 * @private
	 * @type {number|undefined}
	 */
	this.renderedWidth_ = undefined;

	/**
	 * @private
	 * @type {string}
	 */
	this.renderedHTML_ = '';

	var render = options.render ? options.render : ol.control.Legend.render;

	ol.control.Control.call(this, {
		element: this.element_,
		render: render,
		target: options.target
	});

};
ol.inherits(ol.control.Legend, ol.control.Control);


/**
 * Return the units to use in the scale line.
 * @return {ol.control.ScaleLineUnits|undefined} The units to use in the scale
 *     line.
 * @observable
 * @api stable
 */
ol.control.Legend.prototype.getJson = function() {
	return
	this.get('legendjson');
};

/**
 * Update the scale line element.
 * @param {ol.MapEvent} mapEvent Map event.
 * @this {ol.control.Legend}
 * @api
 */
ol.control.Legend.render = function(mapEvent) {
	var frameState = mapEvent.frameState;
	if(!frameState) {
		this.viewState_ = null;
	} else {
		this.viewState_ = frameState.viewState;
	}
//	this.updateElement_();
};

/**
 * @private
 */
ol.control.Legend.prototype.handleJsonChanged_ = function() {
	this.updateElement_();
};

/**
 * Set the units to use in the scale line.
 * @param {ol.control.ScaleLineUnits} units The units to use in the scale line.
 * @observable
 * @api stable
 */
ol.control.Legend.prototype.setJson = function(Json) {
	this.legendjson=Json;
	this.updateElement_();
	this.changed();
};

/**
 * @private
 */
ol.control.Legend.prototype.updateElement_ = function() {

	var legendjson = this.legendjson;
	if(legendjson == undefined) return false;
	var str;
	var title = legendjson.title;

	str = "<div style='margin-bottom:10px;font-size:12px;font-weight: bold;font-family:Microsoft Yahei;'>" + title + "</div>" + "<table><tbody>";
	switch(legendjson.featuretype) {
		case 'line','线','linestring':
			for(var i = 0; i < legendjson.items.length; i++) {
				str += "<tr style='padding:3px'>";

				str += "<td style='width:30px;height:30px;'><div style='width:30px;height:3px;background-size:100%;background:" + legendjson.items[i].content +"'</td>";

				str += "<td>" + legendjson.items[i].label + "</td>";

				str += "</tr>";
			};
			break;
			case 'point','点':
			for(var i = 0; i < legendjson.items.length; i++) {
				str += "<tr style='margin:3px'>";

				str += "<td ><div style='margin:3px;width:20px;height:20px;background-size:100%;background:" + legendjson.items[i].content + ";background-image:url(" + legendjson.items[i].content + ");background-repeat: no-repeat;background-position:center'</td>";

				str += "<td style='padding:3px'>" + legendjson.items[i].label + "</td>";

				str += "</tr>";
			};
			break;
			case 'polygon','面','circle','linearring':
			for(var i = 0; i < legendjson.items.length; i++) {
				str += "<tr style='margin:3px'>";

				str += "<td ><div style='margin:3px;width:30px;height:30px;background-size:100%;background:" + legendjson.items[i].content + ";background-image:" + legendjson.items[i].content + ";background-repeat: no-repeat;'</td>";

				str += "<td style='padding:3px'>" + legendjson.items[i].label + "</td>";

				str += "</tr>";
			};
			break;
		default:
			for(var i = 0; i < legendjson.items.length; i++) {
				str += "<tr style='margin:3px'>";

				str += "<td ><div style='margin:3px;width:30px;height:30px;background-size:100%;background:" + legendjson.items[i].content + ";background-image:" + legendjson.items[i].content + ";background-repeat: no-repeat;'</td>";

				str += "<td style='padding:3px'>" + legendjson.items[i].label + "</td>";

				str += "</tr>";
			};
			break;
	}

	str += "</tbody></table>";

	var html = str;
	if(this.renderedHTML_ != html) {
		this.innerElement_.innerHTML = html;
		this.renderedHTML_ = html;
	}
	if(this.renderedWidth_) {
		this.innerElement_.style.width = '100px';
		this.renderedWidth_ = 100;
	}

	if(!this.renderedVisible_) {
		this.element_.style.display = '';
		this.renderedVisible_ = true;
	}
};