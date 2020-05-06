(function($){
	//前提是要先引入官方提供的原生函式
	if(window['google']['maps']===undefined){
		alert('google_map component fails to start');
		return;
	}

	//type可能的值有range,birthday,normal
	$.easy_google_map={
		'defaults':{
			'is_custom_dimension':'1',
			'default_value':'',
			'data_element_id':'',
			'zoom':7,
			'route_result_container_id':'',
			'streetview_container_id':'',
			'type':'just_view',
			'center_marker_icon_url':'',
			'is_show_center_marker':'1',
			'map_styles':[],
			'map_height':'395',
			'map_width':'',
			'data_markers':{
				/*
				"lat_lng":
				{
					'lat':'',
					'lng':'',
					'address':'',
					'name':'',
					'desc':'',
					'icon_url':'',
					'id':''
				}
				*/
			},
			'non_data_markers':{
				/*
				"lat_lng":
				{
					'marker_instance':null//程式產生,
					'infowindow_instance':null//程式產生
				}
				*/
			},
			'final_func':function(){}
		}
	};
	$.easy_google_map.directionsService=new google.maps.DirectionsService();
	
	$.easy_google_map.geoceoder=new google.maps.Geocoder();
	
	$.fn.easy_google_map = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		if(get_jqobject.length!=1){
			alert('google_map一次只能轉換一個,轉換的元素為賦予id的div');
			return;
		}
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_google_map')===''){
				alert('請先轉換元素為google_map');
				return;
			}
			
		}
		
		var jqobject_scope_methods={
			'_initial_googlemap':function(element_id){
				var opts=this.data();
				var get_jqobject=this;				
				if(element_id!=undefined){
			
				}else{
					alert('參數不得為空');
					return;
				}
				function common_script_1(center_latlng_object){
					var myOptions = {
						'disableDoubleClickZoom':true,
						'zoom': opts.zoom ,
						'center': center_latlng_object,
						'mapTypeId': google.maps.MapTypeId.ROADMAP,
						'mapTypeControl': false,
						'streetViewControl': false,
						'overviewMapControl':false,
						'rotateControl':false,
						'panControl':true,
						'scrollwheel': false,
						'scaleControl':false,
						'zoomControl':true,
						'zoomControlOptions':{
							'style': google.maps.ZoomControlStyle.LARGE,
							
						},
						'styles':opts.map_styles
					};  
					
					
					var map = new google.maps.Map(
						document.getElementById(element_id),
					myOptions);
					
					//加入正中央marker
					var center_marker = new google.maps.Marker({
						'position': center_latlng_object,
						'map': map,
						'animation': google.maps.Animation.DROP	,
						'icon':opts.center_marker_icon_url					
					});
					
					/*
					var tainwan_north_east = new google.maps.LatLng(25.629792, 122.071437);
					var taiwan_south_west = new google.maps.LatLng(22.00584, 119.500008);
					var tainwain_bound_box = new google.maps.LatLngBounds(taiwan_south_west, tainwan_north_east);
					
					google.maps.event.addListener(map, 'bounds_changed', function() {
						var current_bbox = map.getBounds();
						if (tainwain_bound_box.intersects(current_bbox)==false) {
							map.panTo(center_latlng_object);
						}
					});
					*/					
					get_jqobject.data('map',map);
					
					center_marker.set('marker_id','center');
					opts.non_data_markers['center']={
						'marker_instance':center_marker
					}
					
				}
				
				function common_script_2(center_latlng_object){
					var myOptions = {
						'disableDoubleClickZoom':true,
						'zoom': opts.zoom ,
						'center': center_latlng_object,
						'mapTypeId': google.maps.MapTypeId.ROADMAP,
						'mapTypeControl': false,
						'streetViewControl': false,
						'overviewMapControl':false,
						'rotateControl':false,
						'panControl':true,
						'scrollwheel': false,
						'scaleControl':false,
						'zoomControl':true,
						'zoomControlOptions':{
							'style': google.maps.ZoomControlStyle.LARGE,
							
						},
						'styles':opts.map_styles
					};  
					
					
					var map = new google.maps.Map(
						document.getElementById(element_id),
					myOptions);
					
					//加入正中央marker
					var center_marker = new google.maps.Marker({
						'position': center_latlng_object,
						'map': map,
						'title':opts.name,
						'icon':opts.data_markers.center.icon_url,
						'animation': google.maps.Animation.DROP
						
					});
					if(opts.is_show_center_marker=='1'){
						center_marker.setVisible(true);
					}else{
						center_marker.setVisible(false);
					}
					center_marker.set('marker_id','center');
					opts.non_data_markers['center']={
						'marker_instance':center_marker
					};
					
					for(var marker_id in opts.data_markers){
						var the_marker_data=opts.data_markers[marker_id];
						if(marker_id!='center'){
							var the_marker_instance=new google.maps.Marker({
								'position': new google.maps.LatLng(the_marker_data['lat'], the_marker_data['lng']),
								'map': map,
								'title': (the_marker_data['name']===false?'':the_marker_data['name']),
								'icon':(the_marker_data['icon_url']===false?'':the_marker_data['icon_url'])
							});
							
							the_marker_instance.set('marker_id',marker_id);
							opts.non_data_markers[marker_id]=
							{	
								'marker_instance':the_marker_instance
							};		
						}
					}
					
					/*
					var tainwan_north_east = new google.maps.LatLng(25.629792, 122.071437);
					var taiwan_south_west = new google.maps.LatLng(22.00584, 119.500008);
					var tainwain_bound_box = new google.maps.LatLngBounds(taiwan_south_west, tainwan_north_east);

				
					google.maps.event.addListener(map, 'bounds_changed', function() {
						var current_bbox = map.getBounds();
						if (tainwain_bound_box.intersects(current_bbox)==false) {
							map.panTo(center_latlng_object);
						}
					}); 
					*/
					
					
					
					$(document).on('click','[name^="'+element_id+'_coordinate_"][name$="_see_streetview"]',
						function(){
							var temp_string=global_fetch_specific_string($(this).attr('name'),element_id+'_coordinate_','_see_streetview');
							if(temp_string=='center'){
								get_jqobject.data('panorana').setPosition(opts.non_data_markers.center.marker_instance.getPosition());
							}else{
								
								var temp_lat=parseFloat(parseFloat(opts.data_markers[temp_string].lat));
								var temp_lng=parseFloat(parseFloat(opts.data_markers[temp_string].lng));
								get_jqobject.data('panorana').setPosition(new google.maps.LatLng(temp_lat,temp_lng));
							}
						}
					);
					
					/*
					$(document).on('click','a[name^="'+element_id+'_coordinate_"][name$="_route_to_this"]',
						function(){
						
							var temp_string=global_fetch_specific_string($(this).attr('name'),element_id+'_coordinate_','_route_to_this');
						
							var temp_lat=parseFloat(parseFloat(opts.data_markers[temp_string].lat));
								var temp_lng=parseFloat(parseFloat(opts.data_markers[temp_string].lng));

							
							jqobject_scope_methods['route_directions'].apply(get_jqobject,
								[opts.non_data_markers.center.marker_instance.getPosition(),new google.maps.LatLng(temp_lat,temp_lng),'DRIVING']
							);
						}
					);
					*/
					if(opts.route_result_container_id!=''){
		

						
						var directionsDisplay=new google.maps.DirectionsRenderer({
							'map': map,
							'preserveViewport': false,
							'draggable': true,
							'markerOptions':{'visible':false}
						});
						
				
						
						directionsDisplay.setPanel(document.getElementById(opts.route_result_container_id));

						var control = document.getElementById(opts.route_result_container_id);
						
						map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);
						
						get_jqobject.data('directionsDisplay',directionsDisplay);
					}
					
					if(opts.streetview_container_id!=''){
						var panorama = new google.maps.StreetViewPanorama(
							document.getElementById(opts.streetview_container_id), 
							{
								'pov': {
								  'heading': 34,
								  'pitch': 10
								}
							}
						 );
						map.setStreetView(panorama);
						get_jqobject.data('panorana',panorama);
					}
					
					get_jqobject.data('map',map);
					
					
				}
				
				if(opts.type=='just_view' || opts.type=='button_colorbox'){
					var default_latlng_object;
					$.easy_google_map.geoceoder.geocode({'address':opts.default_value},
						function(results,status){
							if(status==google.maps.GeocoderStatus.OK){
								//results[0].geometry.location
								default_latlng_object=results[0].geometry.location;
								
								opts.data_markers['center']={
									'lat':default_latlng_object.lat().toString(),
									'lng':default_latlng_object.lng().toString(),
									'address':'',
									'name':'',
									'desc':'',
									'icon_url':opts.center_marker_icon_url,
									'id':'center'
								};
								
								common_script_1(default_latlng_object);
								
							}else{
								alert("地址解析失敗，請檢查");
							}
							get_jqobject.data('final_func').call(get_jqobject);	
						}
					);
				}else if(opts.type=='center_and_surroundings'){
					//
					var center_latlng_object;
					if(opts.data_markers.center.lat!='' && opts.data_markers.center.lng!='' ){
						center_latlng_object=new google.maps.LatLng(
							parseFloat(opts.data_markers.center.lat), parseFloat(opts.data_markers.center.lng)
						);
						common_script_2(center_latlng_object);
						get_jqobject.data('final_func').call(get_jqobject);	
					}else if(opts.data_markers.center.address!=''){
						$.easy_google_map.geoceoder.geocode({'address':opts.data_markers.center.address},
							function(results,status){
								if(status==google.maps.GeocoderStatus.OK){
									//results[0].geometry.location
									center_latlng_object=results[0].geometry.location;
									opts.data_markers.center.lat=center_latlng_object.lat().toString();
									opts.data_markers.center.lng=center_latlng_object.lng().toString();
									common_script_2(center_latlng_object);
								}else{
									alert("地址解析失敗，請檢查");
								}
								get_jqobject.data('final_func').call(get_jqobject);	
							}
						);
					}
				
				}
			},
			'pan_to_by_address':function(the_address,the_zoom){
				var opts=this.data();
				var get_jqobject=this;			
				if(global_string_is_solid(the_address)){
			
				}else{
					alert('參數不得為空');
					return;
				}
				var map=opts.map;
				var non_data_center_marker=opts.non_data_markers.center;
				var data_center_marker=opts.data_markers.center;
				$.easy_google_map.geoceoder.geocode({'address':the_address},
					function(results,status){
						
						if(status==google.maps.GeocoderStatus.OK){
							map.setZoom(the_zoom==undefined?opts.zoom:the_zoom);
							map.setCenter(results[0].geometry.location);
							/*
							non_data_center_marker.marker_instance.setPosition(results[0].geometry.location);
							data_center_marker.lat=results[0].geometry.location.lat();
							data_center_marker.lng=results[0].geometry.location.lng();
							*/
						}else{
							alert("地址解析失敗，請檢查")
						}
					}
				);
			},
			'pan_to_by_latlng':function(the_latlng,the_zoom){
				var opts=this.data();
				var get_jqobject=this;						
				if(the_latlng!=undefined){
			
				}else{
					alert('參數不得為空');
					return;
				}
				var map=opts.map;
				var non_data_center_marker=opts.non_data_markers.center;
				var data_center_marker=opts.data_markers.center;
				
				map.setZoom(the_zoom==undefined?opts.zoom:the_zoom);
				map.setCenter(the_latlng);
				non_data_center_marker.marker_instance.setPosition(the_latlng);
				data_center_marker.lat=the_latlng.lat();
				data_center_marker.lng=the_latlng.lng();
							
			},
			'add_markers':function(the_marker_datas){
				var opts=this.data();
				var get_jqobject=this;				
				if(the_marker_datas!=undefined){
			
				}else{
					alert('參數不得為空');
					return;
				}
				var map=this.data('map');
				for(var kindex in the_marker_datas){
					var the_marker_data=the_marker_datas[kindex];
					if(the_marker_data.lat=='' || the_marker_data.lng==''){
						$.easy_google_map.geoceoder.geocode(
							{'address':the_marker_data['address']},
								function(results,status){
									
									if(status==google.maps.GeocoderStatus.OK){
										var the_marker_instance=new google.maps.Marker({
											'position': results[0].geometry.location,
											'map': map,
											'title': the_marker_data['name'],
											'icon':the_marker_data['icon_url']
										});
										
										opts.data_markers[results[0].geometry.location.lat().toString()+'_'+results[0].geometry.location.lng().toString()]=
										{	
											'lat':results[0].geometry.location.lat().toString(),
											'lng':results[0].geometry.location.lng().toString(),
											'address':the_marker_data['address'],
											'name':the_marker_data['name'],
											'desc':the_marker_data['desc'],
											'icon_url':the_marker_data['icon_url']
										};
										
										the_marker_instance.set('marker_id',results[0].geometry.location.lat().toString()+'_'+results[0].geometry.location.lng().toString());
										opts.non_data_markers[results[0].geometry.location.lat().toString()+'_'+results[0].geometry.location.lng().toString()]=
										{	
											'marker_instance':the_marker_instance
										};		
									}else{
										alert("地址解析失敗，請檢查")
									}
								}
						
						);
					}else{
						var the_marker_instance=new google.maps.Marker({
							'position': new google.maps.LatLng(parseFloat(the_marker_data['lat']), parseFloat(the_marker_data['lng'])),
							'map': map,
							'title': the_marker_data['name'],
							'icon':the_marker_data['icon_url']
						});
						
						opts.data_markers[the_marker_data['lat']+'_'+the_marker_data['lng']]=
						{	
							'lat':the_marker_data['lat'],
							'lng':the_marker_data['lng'],
							'address':the_marker_data['address'],
							'name':the_marker_data['name'],
							'desc':the_marker_data['desc'],
							'icon_url':the_marker_data['icon_url']
						};	
						the_marker_instance.set('marker_id',the_marker_data['lat']+'_'+the_marker_data['lng'])
						opts.non_data_markers[the_marker_data['lat']+'_'+the_marker_data['lng']]=
						{	
							'marker_instance':the_marker_instance
						};	
					}
				}
							
			},
			'show_colorbox':function(the_address){
				var opts=this.data();
				var get_jqobject=this;		
				if(global_is_non_empty_string(the_address)){
			
				}else{
					alert('請輸入地址資料');
					return;
				}
				var container_id=this.attr('id');
				opts.default_value=the_address;
			
				//results[0].geometry.location
				var temp_html='<div style="display:block;width:100%;height:100%;"'+
				' id="'+container_id+'_preview"></div>';
				$.colorbox({
					'html':temp_html,
					'innerWidth':opts.map_width,
					'innerHeight':opts.map_height,
					'onComplete':function(){
						jqobject_scope_methods['_initial_googlemap'].apply(
							get_jqobject,
							[container_id+'_preview']
						);
					}
				});
					
				
			},
			'route_directions':function(start_position,end_position,by_what){		
				var opts=this.data();	
				var get_jqobject=this;						
				if(start_position!=undefined && end_position!=undefined){
			
				}else{
					alert('參數不得為空');
					return;
				}
				var request = {
					'origin':start_position,		//起始地
					'destination':end_position,	//目的地
					'travelMode': google.maps.DirectionsTravelMode[by_what] //旅行工具 DRIVING | BICYCLING | TRANSIT | WALKING | 
				};
				
				$.easy_google_map.directionsService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						get_jqobject.data('directionsDisplay').setDirections(response);
					}
				});	
				
			},
			'add_control':function(position,dom_element){		
				
				
			}
		};
		
		
		if(typeof(param1)=='string'){
			
			if(global_typeof(param2)!=='array'){
				
				param2=[];
			}
			if(jqobject_scope_methods[param1]===undefined || typeof(jqobject_scope_methods[param1])!=='function'){
				alert('元件無此操作');
				return;
			}
			
			jqobject_scope_methods[param1].apply(get_jqobject,param2);
			return;
		}
		
		if(typeof(param1)=='undefined'){
			options={};
		}else{
			options=param1;
		}
		var opts = $.extend( true,{}, $.easy_google_map.defaults, options );
		
		if(opts.type=='just_view'){
		
		}
		if(opts.type=='button_colorbox'){
			if(jQuery['colorbox']===undefined){
			
				alert('元件啟動失敗,需colorbox支援');
				return;
			}
		}
		get_jqobject.data(opts);
		opts=get_jqobject.data();

		get_jqobject.css(
			{
				'display':'inline-block'
			}
		);
		var container_id=get_jqobject.attr('id');
		
		
		if(opts.type=='just_view'){
			
			if(opts.is_custom_dimension=='1'){
				get_jqobject.css(
					{
						'width':(opts.map_width?opts.map_width+'px':'100%'),
						'height':(opts.map_height?opts.map_height+'px':'100%')
					}
				);
			}
			// 設定google_map
			var temp_html='<div style="display:block;width:100%;height:100%;"'+
			' id="'+container_id+'_preview"></div>';
			get_jqobject.html(temp_html);
			
			jqobject_scope_methods['_initial_googlemap'].apply(get_jqobject,
				[container_id+'_preview']
			);	
			
		}
		
		
		if(opts.type=='center_and_surroundings'){
			if(opts.is_custom_dimension=='1'){
			get_jqobject.css(
				{
					'width':(opts.map_width?opts.map_width+'px':'100%'),
					'height':(opts.map_height?opts.map_height+'px':'100%')
				}
			);
			}
			// 設定google_map
			var temp_html='<div style="display:block;width:100%;height:100%;"'+
			' id="'+container_id+'_preview"></div>';
			get_jqobject.html(temp_html);
			
			jqobject_scope_methods['_initial_googlemap'].apply(get_jqobject,
				[container_id+'_preview']
			);	
			
		}
		
		if(opts.type=='button_colorbox'){
			// 設定google_map
			var temp_html='<input type="button" id="'+container_id
			+'_go_preview" value="用google map觀看該地址" />';
			get_jqobject.html(temp_html);
			$('#'+container_id+'_go_preview').click(
				function(){
					var container_id=global_fetch_specific_string($(this).attr('id'),'','_go_preview');
					var data_element_id=$('#'+container_id).data('data_element_id');
					$('#'+container_id).easy_google_map('show_colorbox',[$('#'+data_element_id).val()]);
				}
			)
			
		}
		get_jqobject.attr('is_transformed_to_google_map','1');	
		return get_jqobject;
	};
}(jQuery));

