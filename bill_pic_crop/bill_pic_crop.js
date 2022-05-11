(function(jQuery,bill_core){
	/* 元件組成要素
		可見可不見
			'_preview',_file_tip',_input','_file_delete_button','_ingicon',
			'_select_ingicon','_select_cancel_button','_select_ok_button',
			'_select_tip',
		恆非可見
			'_crop_x','_crop_y','_crop_width','_crop_height',
			'_workingfile_uploadfile_id','_tmpfile_uploadfile_id','_op','_data', 
	*/
	/* 元件各種狀態
		一般狀態(normal)
			可見
				'_preview','_file_tip','_input','_file_delete_button',
			不可見
				'_ingicon',
				'_select_ingicon','_select_cancel_button','_select_ok_button','_select_tip',

		移除中(delete_ing)
			可見
				'_preview','_ingicon',
			不可見
				'_file_tip','_file_delete_button','_input',
				'_select_ingicon','_select_cancel_button','_select_ok_button','_select_tip',

		上傳檔案中(upload_ing)
			可見
				'_preview','_ingicon',
			不可見
				'_file_tip','_file_delete_button','_input',
				'_select_ingicon','_select_cancel_button','_select_ok_button','_select_tip',

		截圖狀態(crop)
			可見
				'_preview','_select_cancel_button','_select_ok_button','_select_tip',
			不可見
				'_file_tip','_file_delete_button','_ingicon','_input',
				'_select_ingicon',

		截圖確定中(crop_ok_ing)
			可見
				'_preview','_select_ingicon',
			不可見
				'_file_tip','_file_delete_button','_ingicon','_input',
				'_select_cancel_button','_select_tip','_select_ok_button',

		截圖取消中(crop_cancel_ing)
			可見
				'_preview','_select_ingicon',	
			不可見
				'_file_tip','_file_delete_button','_ingicon','_input',
				'_select_cancel_button','_select_ok_button','_select_tip',
	 */	
	/* 元件狀態轉換時機
		一般狀態->移除中(按下_file_delete_button後)
		移除中->一般狀態(file delete event handler執行結束後)
		一般狀態->上傳檔案中(選擇要上傳的檔案後)
		上傳檔案中->截圖狀態(上傳檔案處理完畢後)
		截圖狀態->確定截圖中(按下確定要截圖後)
		確定截圖中->一般狀態(截圖處理完畢後)
		截圖狀態->取消截圖中(按下取消截圖後)
		取消截圖中->一般狀態(取消截圖處理完畢後) 
	*/
	
	
	//設定屬於bill_pic_crop專屬的元件函式或元件設定預設值

	jQuery.bill_pic_crop={
		'defaults':{
			'input_name':'',
			'process_upload_url':'',
			'uploading_icon_url':bill_core.js_dir_url+'bill_core_js/bill_pic_crop/image/loadinfo.net.gif',
			'selecting_icon_url':bill_core.js_dir_url+'bill_core_js/bill_pic_crop/image/loadinfo.net.gif',
			'error_msg_1':'',
			'human_read_name':'',
			'file_tip':'選擇檔案：',
			'select_tip':'請拖曳圖片以確認擷取範圍',
			'preview_width':400,
			'canvas_width':400,
			'output_width':400,
			'output_height':400,
			'default_value':'',
			'is_required':'0',
			'csrf_token':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_pic_crop = function(param1,param2){
		var get_jqobject=this.filter('div[id]');
		var component_id=get_jqobject.attr('id');
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_pic_crop一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_pic_crop')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_pic_crop','error');
				return;
			}
		}
		
		//物件方法
		var jqobject_public_methods={
			'check_is_in_op':function(){
				
				if(
					jQuery('#'+this.attr('id')+'_ingicon').css('display')!=='none' || 
					jQuery('#'+this.attr('id')+'_select_ingicon').css('display')!=='none' ||
					jQuery('#'+this.attr('id')+'_select_ok_button').css('display')!=='none'
				){
					return '1'
				}else{
					
					return '0';
				}
			}
		};
		var jqobject_private_methods={
			'toggle_state':function(the_state){
				var all_element_ids=[
					'_preview','_file_tip','_input','_file_delete_button','_ingicon',
					'_select_ingicon','_select_cancel_button','_select_ok_button',
					'_select_tip',
				];
				switch(the_state){
					case 'normal':
						var show_element_ids=[
							'_preview','_file_tip','_input','_file_delete_button',
						];
						break;
					
					case 'delete_ing':
						var show_element_ids=[
							'_preview','_ingicon',
						];
						break;
						
					case 'upload_ing':
						var show_element_ids=[
							'_preview','_ingicon',
						];
						break;
						
					case 'crop':
						var show_element_ids=[
							'_preview','_select_cancel_button','_select_ok_button','_select_tip',
						];
						break;
						
					case 'crop_ok_ing':
						var show_element_ids=[
							'_preview','_select_ingicon',
						];
						break;
						
					case 'crop_cancel_ing':
						var show_element_ids=[
							'_preview','_select_ingicon',	
						];
						break;
					default:
						var show_element_ids=[
							'_preview','_file_tip','_input','_file_delete_button',
						];
				}
				var hide_element_ids=all_element_ids.filter(function(the_element_id){
					if(show_element_ids.indexOf(the_element_id)===-1){
						return true;
					}else{
						return false;
					}
				});
				show_element_ids=show_element_ids.map(
					function(the_element_id){
						return '#'+component_id+the_element_id;
					}
				);
				hide_element_ids=hide_element_ids.map(
					function(the_element_id){
						return '#'+component_id+the_element_id;
					}
				);
				jQuery(show_element_ids.join(',')).show();
				jQuery(hide_element_ids.join(',')).hide();
			}
		};
		//若是呼叫物件方法
		if(typeof(param1)=='string'){
			if(
				jqobject_public_methods[param1]===undefined || 
				typeof(jqobject_public_methods[param1])!=='function'
			){
				bill_core.debug_console('元件無此操作','error');
				return;
			}
			
			var temp_params=[];
			for(var kindex in arguments){
				if(kindex!=='0'){
					temp_params.push(arguments[kindex]);
				}
			}
			return jqobject_public_methods[param1].apply(get_jqobject,temp_params);
		}
		
		var want_set_opts={};
		if(bill_core.global_typeof(param1)==='undefined'){
		}
		else{
			want_set_opts=param1;
		}
		
		var opts = jQuery.extend( true,{}, jQuery.bill_pic_crop.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
	

		
		if( bill_core.string_is_solid(opts.input_name)==='1' ){
		
		}else{
			bill_core.debug_console('bill_pic_crop元件啟動失敗,input_name參數錯誤','error');
			return;
		}
		
		if( 
			bill_core.number_is_solid(opts.preview_width)==='1' &&
			opts.preview_width>0
		){
		}else{
			bill_core.debug_console('bill_pic_crop元件啟動失敗,preview_width參數錯誤','error');
			return;
		}
		
		if(get_jqobject.attr('is_transformed_to_bill_pic_crop')==='1'){
			get_jqobject.empty();
		}
		
		
			
		var final_component_html='';
		final_component_html+=
			'<div id="'+component_id+'_preview">';
				var temp_style_string='';
				
				temp_style_string+='width:'+opts.preview_width+'px;';
				
				
				if( 
					bill_core.string_is_solid(opts.default_value)==='0'
				){
					opts.preview_height=opts.preview_width*(opts.output_height/opts.output_width);
					temp_style_string+='height:'+opts.preview_height+'px;';
				}
				if(temp_style_string!=''){
					temp_style_string='style="'+temp_style_string+'"';
				}
				if( bill_core.string_is_solid(opts.default_value)==='1'){
					
					final_component_html+=
					'<img border="0" '+temp_style_string+' src="'+
					bill_core.url_get_full(opts.default_value)+'" />';
				}
				else{
					final_component_html+=
					'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
				}
		final_component_html+=
			'</div>';
		
		var reg_1_string='';
		
		if(opts.is_required=='1'){
			reg_1_string='rpicfile';
		}else{
			reg_1_string='opicfile';
		}
	
		
		//draw file_tip
		if( bill_core.string_is_solid(opts.file_tip)==='1' ){
			final_component_html+=
			'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
		}
		
		//draw input
		final_component_html+=
		'<input type="file" maxlength="255" size="50" id="'+component_id+'_input" name=""  reg_1="'+reg_1_string+'"  />';  

		
		//draw go_to_edit
		/*
			final_component_html+=
			'<input type="button" value="編輯"   '+
			'id="'+component_id+'_go_to_edit_button" />';
		*/
		
		//draw file_delete_button
	
		final_component_html+=
		'<input type="button" value="移除" style="margin-right:10px;" '+
		'id="'+component_id+'_file_delete_button" />';

		//draw uploading icon
		final_component_html+=
		'<img border="0" src="'+opts.uploading_icon_url+'"' +
		'style="display:none;vertical-align:middle;float:right"'+ 
		'id="'+component_id+'_ingicon">';
		
		//draw selecting icon
		final_component_html+=
		'<img border="0" src="'+opts.selecting_icon_url+'"' +
		'style="display:none;vertical-align:middle;float:right"'+ 
		'id="'+component_id+'_select_ingicon">';

		
		//draw select_cancel
		final_component_html+=
		'<input type="button" value="取消"  style="display:none;margin:0px 5px;vertical-align:middle"  '+
		'id="'+component_id+'_select_cancel_button" />';

		//draw select_ok
		final_component_html+=
		'<input type="button" value="確認" style="display:none;margin:0px 5px;vertical-align:middle" '+
		'id="'+component_id+'_select_ok_button" />';

		//draw select_tip
		final_component_html+=
		'<span id="'+component_id+'_select_tip" style="float:right;display:none;margin:5px 5px 0px 5px;">'+opts.select_tip+'</span>';


		//draw crop info	
		final_component_html+=
		'<input type="hidden" value="0" id="'+component_id+'_crop_x" />'+
		'<input type="hidden" value="0" id="'+component_id+'_crop_y" />'+
		'<input type="hidden" value="'+(opts.canvas_width/2.5)+'" id="'+component_id+'_crop_width" />'+
		'<input type="hidden" value="'+(opts.canvas_width/2.5*(opts.output_height/opts.output_width))+'" id="'+component_id+'_crop_height" />';
		
		//draw savedata element
		final_component_html+=
		'<input type="hidden" value="" id="'+component_id+'_workingfile_uploadfile_id" />'+
		'<input type="hidden" value="" id="'+component_id+'_tmpfile_uploadfile_id" />'+
		'<input type="hidden" value="DO_NO" id="'+component_id+'_op" name="'+opts.input_name+'_op" />'+
		'<input type="hidden" value="" id="'+component_id+'_data" name="'+opts.input_name+'" human_read_name="'+opts.human_read_name+'" error_msg_1="'+opts.error_msg_1+'" reg_1="'+reg_1_string+'" />';
			
		get_jqobject.html(final_component_html);
		
		
		//bind element event_handler
		jQuery('#'+component_id+'_input').change(
			function(){
				
				if(bill_core.validate_single(jQuery(this).attr('reg_1'),jQuery(this).val())==='0'){
					jQuery(this).val('');
					alert('檔案格式錯誤');
					return;
				}
				jqobject_private_methods['toggle_state'].call(
					jQuery(this),'upload_ing'
				);
				
				var about_info={
					'updated_column_name':opts.input_name,
					'component_id':component_id,
					'_token':opts.csrf_token,
				};
				about_info['input_file']=jQuery(this).prop('files')[0]
				var formdata = new FormData();
				for(var temp_prop_name in about_info){
					formdata.append(temp_prop_name, about_info[temp_prop_name]);
				}
				
				
				bill_core.ajax_post(
					opts.process_upload_url+'?ajax_func=upload_material',
					formdata,
					function(data,textStatus,jqXHR){

						if(data.code=='1'){
							var new_preview_html='';
							var temp_style_string='';
							temp_style_string+='width:'+opts.canvas_width+'px;';
							if(temp_style_string!=''){
								temp_style_string='style="'+temp_style_string+'"';
							}
							new_preview_html=
							'<img border="0" '+temp_style_string+' src="'+
							bill_core.url_get_full(data.data['workingfile_uploadfile_id']+'?rnd='+new Date().getTime())+'" />';
							jQuery("#"+component_id+"_preview").html(new_preview_html);

							jQuery("#"+component_id+"_workingfile_uploadfile_id").val(data.data['workingfile_uploadfile_id']);
							jQuery('#'+component_id+'_input').val('');
							
							jQuery("#"+component_id+"_preview>img").imgAreaSelect({
								'aspectRatio': opts.output_width+':'+opts.output_height,
								'x1': 0, 
								'y1': 0, 
								'x2': (opts.canvas_width/2.5), 
								'y2': (opts.canvas_width/2.5*(opts.output_height/opts.output_width)),
								'onSelectChange': function(img, selection) {
									jQuery("#"+component_id+"_crop_x").val(selection.x1);
									jQuery("#"+component_id+"_crop_y").val(selection.y1);
									jQuery("#"+component_id+"_crop_width").val(selection.width);
									jQuery("#"+component_id+"_crop_height").val(selection.height);
								}
							});
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'crop'
							);
						}else{
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'normal'
							);
							alert(data.message);	
						}
					},
					function(jqXHR,textStatus,errorThrown ){
						jqobject_private_methods['toggle_state'].call(
							jQuery(this),'normal'
						);
						alert(errorThrown);
					},
					'0',
					this
				);
			}
		);
				
		jQuery('#'+component_id+'_file_delete_button').click(
			function(){
				if(jQuery('#'+component_id+'_preview'+'>img').length==0){
					alert('無檔案可移除');
					return;
				}
				jqobject_private_methods['toggle_state'].call(
					jQuery(this),'delete_ing'
				);
				
				var about_info={
					'updated_column_name':opts.input_name,
					'tmpfile_uploadfile_id':jQuery("#"+component_id+"_tmpfile_uploadfile_id").val(),
					'_token':opts.csrf_token,
					'component_id':component_id
				};
				bill_core.ajax_post(
					opts.process_upload_url+'?ajax_func=delete_crop',
					about_info,
					function(data,textStatus,jqXHR){
						if(data['code']==='1'){
				
							if(bill_core.string_is_solid(opts.default_value)==='1'){
								jQuery("#"+component_id+'_op').val('DO_DELETE');
							}else{
								jQuery("#"+component_id+'_op').val('DO_NO');
							}
							jQuery("#"+component_id+'_tmpfile_uploadfile_id').val('');
							jQuery("#"+component_id+'_data').val('');
							jQuery('#'+component_id+'_input').val('');
							
							var preview_html='';
							preview_html=
							"<img  alt=\"無圖檔\"  style=\"width:"
							+opts.preview_width+"px;height:"+(opts.preview_width*(opts.output_height/opts.output_width))+"px;\"  border=\"0\"   />";
							
							jQuery("#"+component_id+'_preview').html(preview_html);
							
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'normal'
							);
						}else{
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'normal'
							);
							alert(data['message']);
						}
						
					},
					function(jqXHR,textStatus,errorThrown ){
						jqobject_private_methods['toggle_state'].call(
							jQuery(this),'normal'
						);
						alert(
							'Ajax request 錯誤'
						);
					},
					'0',
					this
				);
				
			}
		);
		
		jQuery('#'+component_id+'_select_ok_button').click(
			function(){
				jqobject_private_methods['toggle_state'].call(
					jQuery(this),'crop_ok_ing'
				);
				
			
				var about_info={
					'updated_column_name':opts.input_name,
					'tmpfile_uploadfile_id':jQuery("#"+component_id+"_tmpfile_uploadfile_id").val(),
					'workingfile_uploadfile_id':jQuery("#"+component_id+"_workingfile_uploadfile_id").val(),
					'crop_x':jQuery("#"+component_id+"_crop_x").val(),
					'crop_y':jQuery("#"+component_id+"_crop_y").val(),
					'crop_width':jQuery("#"+component_id+"_crop_width").val(),
					'crop_height':jQuery("#"+component_id+"_crop_height").val(),
					'canvas_width':opts.canvas_width,
					'output_width':opts.output_width,
					'output_height':opts.output_height,
					'_token':opts.csrf_token,
					'component_id':component_id
				};
				bill_core.ajax_post(
					opts.process_upload_url+'?ajax_func=ok_crop',
					about_info,
					function(data,textStatus,jqXHR){
						if(data['code']==='1'){
							
						
							jQuery("#"+component_id+"_preview"+'>img').imgAreaSelect({remove:true});
							
							var preview_html='';
							var temp_style_string='';
							
							temp_style_string+='width:'+opts.preview_width+'px;';

							if(temp_style_string!=''){
								temp_style_string='style="'+temp_style_string+'"';
							}
							
							preview_html=
							'<img border="0" '+temp_style_string+' src="'+
							bill_core.url_get_full(data.data['tmpfile_uploadfile_id'])+'" />';
						
							jQuery("#"+component_id+'_tmpfile_uploadfile_id').val(data.data['tmpfile_uploadfile_id']);
							jQuery("#"+component_id+'_data').val(data.data['tmpfile_uploadfile_id']);
							jQuery("#"+component_id+'_workingfile_uploadfile_id').val('');
							jQuery('#'+component_id+'_input').val('');
							
							if(bill_core.string_is_solid(opts.default_value)==='1'){
								jQuery("#"+component_id+'_op').val('DO_MODIFY');
							}else{
								jQuery("#"+component_id+'_op').val('DO_ADD');
							}
							
							jQuery("#"+component_id+"_preview").html(preview_html);
							
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'normal'
							);
							
							
						}else{
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'crop'
							);
							alert(data['message']);
						}
						
					},
					function(jqXHR,textStatus,errorThrown ){
						jqobject_private_methods['toggle_state'].call(
							jQuery(this),'crop'
						);
						alert(
							'Ajax request 錯誤'
						);
					},
					'1',
					this
				);
				
			}
		)
		
		jQuery('#'+component_id+'_select_cancel_button').click(
			function(){
				jqobject_private_methods['toggle_state'].call(
					jQuery(this),'crop_cancel_ing'
				);
				
				var about_info={
					'updated_column_name':opts.input_name,
					'workingfile_uploadfile_id':jQuery("#"+component_id+"_workingfile_uploadfile_id").val(),
					'_token':opts.csrf_token,
					'component_id':component_id,
				};
				bill_core.ajax_post(
					opts.process_upload_url+'?ajax_func=cancel_crop',
					about_info,
					function(data,textStatus,jqXHR){
						if(data['code']==='1'){
							
							jQuery('#'+component_id+'_input').removeAttr('name');
							jQuery("#"+component_id+"_preview"+'>img').imgAreaSelect({remove:true});
							
							var preview_html='';
							var temp_style_string='';
							var temp_uploadfile_id='';
							if( bill_core.string_is_solid(jQuery("#"+component_id+"_tmpfile_uploadfile_id").val())==='1' ){
								temp_uploadfile_id=jQuery("#"+component_id+"_tmpfile_uploadfile_id").val();
							}else if( bill_core.string_is_solid(opts.default_value)==='1' ){
								temp_uploadfile_id=opts.default_value;
							}
							
							
							
							var temp_style_string='';
							temp_style_string+='width:'+opts.preview_width+'px;';
							if( 
								bill_core.string_is_solid(temp_uploadfile_id)==='0'
							){
								opts.preview_height=opts.preview_width*(opts.output_height/opts.output_width);
								temp_style_string+='height:'+opts.preview_height+'px;';
							}
							if(temp_style_string!=''){
								temp_style_string='style="'+temp_style_string+'"';
							}
							if( bill_core.string_is_solid(temp_uploadfile_id)==='1'){
								
								preview_html=
								'<img border="0" '+temp_style_string+' src="'+
								bill_core.url_get_full(temp_uploadfile_id)+'" />';
							}
							else{
								preview_html+=
								'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
							}

							jQuery("#"+component_id+"_preview").html(preview_html);
							
							
							jQuery("#"+component_id+'_workingfile_uploadfile_id').val('');
							jQuery('#'+component_id+'_input').val('');
							
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'normal'
							);
					
						}else{
							jqobject_private_methods['toggle_state'].call(
								jQuery(this),'crop'
							);
							alert(data['message']);
						}
						
					
					},
					function(jqXHR,textStatus,errorThrown ){
						jqobject_private_methods['toggle_state'].call(
							jQuery(this),'crop'
						);
						alert(
							'Ajax request 錯誤'
						);
					},
					'1',
					this
				);
			}
		)
		
		
		
			
		get_jqobject.filter(':not([is_transformed_to_bill_pic_crop])').
		attr('is_transformed_to_bill_pic_crop','1');
		
		
		return get_jqobject;
	};
}(jQuery,bill_core));

