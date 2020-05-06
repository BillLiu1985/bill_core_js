(function($){
	//前提是要先引入官方提供的原生函式
	if(window['BMap']===undefined){
		alert('baidu_map component fails to start');
		return;
	}

	//百度使用的座標跟GOOGLE MAP使用的座標不能共用
	$.easy_baidu_map={
		'defaults':{
			'is_custom_dimension':'1',
			'default_value':'',
			'data_element_id':'',
			'zoom':7,//3~19
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
					'icon_width':0,
					'icon_height':0,
					'id':''
				}
				*/
			},
			'non_data_markers':{
				/*
				"lat_lng":
				{
					'marker_instance':null//程式产生,
					'infowindow_instance':null//程式产生
				}
				*/
			},
			'final_func':function(){},
			'address_book':[
				{
					'name':'东京',
					'lat':35.802858,
					'lng':139.660801
				},
				{
					'name':'名古屋',
					'lat':35.237977,
					'lng':137.008091
				}
			]
		}
	};

	$.easy_baidu_map.geoceoder=new BMap.Geocoder();
	
	//$.easy_baidu_map.convertor=new BMap.Convertor();
	
	$.fn.easy_baidu_map = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		if(get_jqobject.length!=1){
			alert('baidu_map一次只能转换一个,转换的元素为赋予id的div');
			return;
		}
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_baidu_map')===''){
				alert('请先转换元素为baidu_map');
				return;
			}
			
		}
		
		var jqobject_scope_methods={
			'_initial_baidumap':function(element_id){
				var opts=this.data();
				var get_jqobject=this;				
				if(element_id!=undefined){
			
				}else{
					alert('参数不得为空');
					return;
				}
				
				
				function common_script_2(center_latlng_object){
					
					var myOptions = {
						enableMapClick:false
					};  
					
					
					var map = new BMap.Map(element_id,myOptions);
					
					map.centerAndZoom(center_latlng_object, opts.zoom);
					map.enableScrollWheelZoom(true);
					//加入正中央marker
					if(opts.is_show_center_marker=='1'){
						var myIcon = new BMap.Icon(
							opts.data_markers.center.icon_url,
							new BMap.Size(opts.data_markers.center.icon_width,opts.data_markers.center.icon_height)
						);
						var center_marker = new BMap.Marker(
							center_latlng_object,
							{
								icon:myIcon,
								title:opts.data_markers.center.name,
								
							}
						);  // 创建标注
						map.addOverlay(center_marker);              // 将标注添加到地图中
						center_marker.setAnimation(BMAP_ANIMATION_DROP);
						center_marker.show();
						center_marker.marker_id='center';
						opts.non_data_markers['center']={
							'marker_instance':center_marker
						};
					}
					
					
					for(var marker_id in opts.data_markers){
						var the_marker_data=opts.data_markers[marker_id];
						if(marker_id!='center'){
							var myIcon = new BMap.Icon(
								the_marker_data.icon_url,
								new BMap.Size(the_marker_data.icon_width,the_marker_data.icon_height)
							);
							var the_marker_instance = new BMap.Marker(
								new BMap.Point(
									parseFloat(the_marker_data.lng),parseFloat(the_marker_data.lat)
								),
								{
									icon:myIcon,
									title:the_marker_data.name,
									
								}
							);  // 创建标注
							map.addOverlay(the_marker_instance);              // 将标注添加到地图中
							the_marker_instance.setAnimation(BMAP_ANIMATION_DROP);
							
							the_marker_instance.marker_id=marker_id;
							opts.non_data_markers[marker_id]=
							{	
								'marker_instance':the_marker_instance
							};		
						}
					}
					
					map.setMapStyle({
					  styleJson:opts.map_styles
					});
					
					get_jqobject.data('map',map);
					
					
				}
			
				
				if(opts.type=='just_view' || opts.type=='button_colorbox'){
					
				}else if(opts.type=='center_and_surroundings'){
					
					var center_latlng_object;
					if(opts.data_markers.center.lat!='' && opts.data_markers.center.lng!='' ){
						center_latlng_object=new BMap.Point(
							parseFloat(opts.data_markers.center.lng),parseFloat(opts.data_markers.center.lat)
						);
						common_script_2(center_latlng_object);
						get_jqobject.data('final_func').call(get_jqobject);	
					}/*else if(opts.data_markers.center.google_lat!='' && opts.data_markers.center.google_lng!='' ){
						var pointArr = [];
						pointArr.push(
							new BMap.Point(
								parseFloat(opts.data_markers.center.google_lng),
								parseFloat(opts.data_markers.center.google_lat)
							)
						);
						
						$.easy_baidu_map.convertor.translate(pointArr, 3, 5, function(data){
							 if(data.status === 0) {
								common_script_2(data.points[0]);
								
							 }
							 get_jqobject.data('final_func').call(get_jqobject);	
						})
					}*/else if(opts.data_markers.center.address!=''){
						var temp_result=opts.address_book.find(
							function(the_item, the_index, from_array){
								
								if(the_item.name.indexOf(opts.data_markers.center.address)==-1){
									return false;
								}else{
									return true;
								}
							}
						)
						if(temp_result===undefined){
							
							$.easy_baidu_map.geoceoder.getPoint(opts.data_markers.center.address, function(point){
								if (point!==null) {
									opts.data_markers.center.lat=point.lat;
									opts.data_markers.center.lng=point.lng;
									common_script_2(point);
								}else{
									alert("您选择地址没有解析到结果!");
									
								}
								get_jqobject.data('final_func').call(get_jqobject);	
							});
						}else{
							
							point=new BMap.Point(
								parseFloat(temp_result.lng),parseFloat(temp_result.lat)
							);
							opts.data_markers.center.lat=point.lat;
							opts.data_markers.center.lng=point.lng;
							common_script_2(point);
							get_jqobject.data('final_func').call(get_jqobject);	
						}
						
					}
					
				}
			},
			'pan_to_by_address':function(the_address,the_zoom,and_then_callback){
				var opts=this.data();
				var get_jqobject=this;	
				
				if(global_string_is_solid(the_address)){
			
				}else{
					alert('参数不得为空');
					if(global_typeof(and_then_callback)=='function'){
						and_then_callback.apply(get_jqobject,[false]);
					}
				}
				
				var map=opts.map;
				
				var temp_result=opts.address_book.find(
					function(the_item, the_index, from_array){
						
						if(the_item.name.indexOf(the_address)==-1){
							return false;
						}else{
							return true;
						}
					}
				)
				if(temp_result===undefined){	 
					 $.easy_baidu_map.geoceoder.getPoint(the_address, function(point){
						var process_result=true;
						if (point!=null) {
							map.centerAndZoom(point, (the_zoom==undefined?opts.zoom:the_zoom));
						}else{
							alert("您选择地址没有解析到结果!");
							process_result=false;
						}
						if(global_typeof(and_then_callback)=='function'){
							and_then_callback.apply(get_jqobject,[process_result]);
						}
					});
				}else{
					point=new BMap.Point(
						parseFloat(temp_result.lng),parseFloat(temp_result.lat)
					);
					map.centerAndZoom(point, (the_zoom==undefined?opts.zoom:the_zoom));
					if(global_typeof(and_then_callback)=='function'){
						and_then_callback.apply(get_jqobject,[true]);
					}
				}
				
			
				
			},
			'transform_address_to_point':function(the_address,and_then_callback){
				var opts=this.data();
				var get_jqobject=this;	
				
				if(global_string_is_solid(the_address)){
			
				}else{
					if(global_typeof(and_then_callback)=='function'){
						and_then_callback.apply(get_jqobject,[false]);
					}
				}
				
				var map=opts.map;
				
				var temp_result=opts.address_book.find(
					function(the_item, the_index, from_array){
						
						if(the_item.name.indexOf(the_address)==-1){
							return false;
						}else{
							return true;
						}
					}
				)
				if(temp_result===undefined){	 
					 $.easy_baidu_map.geoceoder.getPoint(the_address, function(point){
						var process_result=true;
						if (point!=null) {
							
						}else{
							process_result=false;
						}
						if(global_typeof(and_then_callback)=='function'){
							and_then_callback.apply(get_jqobject,[process_result,point]);
						}
					});
				}else{
					point=new BMap.Point(
						parseFloat(temp_result.lng),parseFloat(temp_result.lat)
					);
					if(global_typeof(and_then_callback)=='function'){
						and_then_callback.apply(get_jqobject,[true,point]);
					}
				}
			
			},
			'pan_to_by_latlng':function(the_latlng,the_zoom){
				var opts=this.data();
				var get_jqobject=this;						
				if(the_latlng!=undefined){
			
				}else{
					alert('参数不得为空');
					return;
				}
				var map=opts.map;
			
				map.centerAndZoom(the_latlng, (the_zoom==undefined?opts.zoom:the_zoom));
							
			},
			'add_markers':function(the_marker_datas){
				var opts=this.data();
				var get_jqobject=this;				
				if(the_marker_datas!=undefined){
			
				}else{
					alert('参数不得为空');
					return;
				}
				var map=this.data('map');
				for(var kindex in the_marker_datas){
					var the_marker_data=the_marker_datas[kindex];
					if(the_marker_data.lat!='' && the_marker_data.lng!=''){
						var myIcon = new BMap.Icon(
							the_marker_data.icon_url,
							new BMap.Size(the_marker_data.icon_width,the_marker_data.icon_height)
						);
						var the_marker_instance = new BMap.Marker(
							new BMap.Point(
								parseFloat(the_marker_data.lng),parseFloat(the_marker_data.lat)
							),
							{
								icon:myIcon,
								title:the_marker_data.name,
								
							}
						);  // 创建标注
						map.addOverlay(the_marker_instance);              // 将标注添加到地图中
						the_marker_instance.setAnimation(BMAP_ANIMATION_DROP);
						
						var marker_id=the_marker_data['lat']+'_'+the_marker_data['lng'];
						the_marker_instance.marker_id=marker_id;
						
						opts.data_markers[marker_id]=
						{	
							'lat':the_marker_data['lat'],
							'lng':the_marker_data['lng'],
							'address':the_marker_data['address'],
							'name':the_marker_data['name'],
							'desc':the_marker_data['desc'],
							'icon_url':the_marker_data['icon_url']
						};	
						
						opts.non_data_markers[marker_id]=
						{	
							'marker_instance':the_marker_instance
						};	
					}else if(the_marker_data.address!=''){	
						var temp_result=opts.address_book.find(
							function(the_item, the_index, from_array){
								if(the_item.name.indexOf(the_marker_data.address)==-1){
									return false;
								}else{
									return true;
								}
							}
						)
						if(temp_result===undefined){
							$.easy_baidu_map.geoceoder.getPoint(the_marker_data.address, function(point){
								if (point!==null) {
									var myIcon = new BMap.Icon(
										the_marker_data.icon_url,
										new BMap.Size(the_marker_data.icon_width,the_marker_data.icon_height)
									);
									var the_marker_instance = new BMap.Marker(
										point,
										{
											icon:myIcon,
											title:the_marker_data.name,
											
										}
									);  // 创建标注
									map.addOverlay(the_marker_instance);              // 将标注添加到地图中
									the_marker_instance.setAnimation(BMAP_ANIMATION_DROP);
									
									var marker_id=point.lat+'_'+point.lng;
									the_marker_instance.marker_id=marker_id;
									
									opts.data_markers[marker_id]=
									{	
										'lat':point.lat,
										'lng':point.lng,
										'address':the_marker_data['address'],
										'name':the_marker_data['name'],
										'desc':the_marker_data['desc'],
										'icon_url':the_marker_data['icon_url']
									};	
									
									opts.non_data_markers[marker_id]=
									{	
										'marker_instance':the_marker_instance
									};
								}else{
									alert("您选择地址没有解析到结果!");
									
								}
								
							});
							
							
						}else{
							point=new BMap.Point(
								parseFloat(temp_result.lng),parseFloat(temp_result.lat)
							);
							var myIcon = new BMap.Icon(
								the_marker_data.icon_url,
								new BMap.Size(the_marker_data.icon_width,the_marker_data.icon_height)
							);
							var the_marker_instance = new BMap.Marker(
								point,
								{
									icon:myIcon,
									title:the_marker_data.name,
									
								}
							);  // 创建标注
							map.addOverlay(the_marker_instance);              // 将标注添加到地图中
							the_marker_instance.setAnimation(BMAP_ANIMATION_DROP);
							
							var marker_id=point.lat+'_'+point.lng;
							the_marker_instance.marker_id=marker_id;
							
							opts.data_markers[marker_id]=
							{	
								'lat':point.lat,
								'lng':point.lng,
								'address':the_marker_data['address'],
								'name':the_marker_data['name'],
								'desc':the_marker_data['desc'],
								'icon_url':the_marker_data['icon_url']
							};	
							
							opts.non_data_markers[marker_id]=
							{	
								'marker_instance':the_marker_instance
							};
						}
						
						
					}
				}
							
			}
		};
		
		
		if(typeof(param1)=='string'){
			
			if(global_typeof(param2)!=='array'){
				
				param2=[];
			}
			if(jqobject_scope_methods[param1]===undefined || typeof(jqobject_scope_methods[param1])!=='function'){
				alert('元件无此操作');
				return;
			}
			
			return jqobject_scope_methods[param1].apply(get_jqobject,param2);
		}
		
		if(typeof(param1)=='undefined'){
			options={};
		}else{
			options=param1;
		}
		var opts = $.extend( true,{}, $.easy_baidu_map.defaults, options );
		
		if(opts.type=='just_view'){
		
		}
		if(opts.type=='button_colorbox'){
			if(jQuery['colorbox']===undefined){
			
				alert('元件启动失败,需colorbox支援');
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
			
			
			
		}else if(opts.type=='center_and_surroundings'){
			if(opts.is_custom_dimension=='1'){
				get_jqobject.css(
					{
						'width':(opts.map_width?opts.map_width+'px':'100%'),
						'height':(opts.map_height?opts.map_height+'px':'100%')
					}
				);
			}
			// 设定baidu_map
			var temp_html='<div style="display:block;width:100%;height:100%;"'+
			' id="'+container_id+'_preview"></div>';
			get_jqobject.html(temp_html);
			
			jqobject_scope_methods['_initial_baidumap'].apply(get_jqobject,
				[container_id+'_preview']
			);	
			
		}else if(opts.type=='button_colorbox'){
		
			
		}
		get_jqobject.attr('is_transformed_to_baidu_map','1');	
		return get_jqobject;
	};
}(jQuery));

