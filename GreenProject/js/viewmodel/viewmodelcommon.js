	if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
			$('#warmtable tbody').css('width','315px');
			$('#statictable tbody').css('width','257px');
			$('#rain_table tbody').css('width','416px');
			$('#water_table tbody').css('width','416px');
			//			好像加载顺序问题
			$('#warning_table tbody').css('width','418px');
			$('#forecast_table tbody').css('width','418px');
			$('#traffic_table table').css('width','416px');
		}else if (navigator.userAgent.indexOf('Firefox') >= 0){
			$('#warmtable tbody').css('width','298px');
			$('#statictable tbody').css('width','240px');
			$('#rain_table tbody').css('width','398px');
			$('#water_table tbody').css('width','398px');
//			好像加载顺序问题
			$('#warning_table tbody').css('width','400px');
			$('#forecast_table tbody').css('width','400px');
			$('#traffic_table table').css('width','498px');
		}else if (navigator.userAgent.indexOf('Opera') >= 0){
			alert('你是使用Opera')
		}else{
			$('#warmtable tbody').css('width','298px');
			$('#statictable tbody').css('width','240px');
			$('#rain_table tbody').css('width','398px');
			$('#water_table tbody').css('width','398px');
//			好像加载顺序问题
			$('#warning_table tbody').css('width','400px');
			$('#forecast_table tbody').css('width','400px');
			$('#traffic_table table').css('width','498px');
		}

