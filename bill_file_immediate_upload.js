(function($){
	//先看jquery有沒有引入
	if($===undefined){
		alert('jquery元件未啟動');
		return;
	}
	
	//設定屬於easy_file_upload專屬的元件函式或元件設定預設值
	//op:upload_material,delete_upload
	//有元素負責input 有元素負責save data
	$.bill_file_immediate_upload={
		'defaults':{
			'file_type':'pic',
			'process_upload_url':'',
			'process_download_url':'',
			'uploading_icon_url':'',
			'file_tip':'選擇檔案：',
			'input_name':'',
			'preview_width':'',
			'max_width':'',
			'preview_height':'',
			'output_width':'',
			'output_height':'',
			'default_value':'',
			'default_newfile':'',
			'default_relatedfile_1':'',
			'default_original_main_name':'',
			'is_required':'0',
			'csrf_token':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	$.fn.easy_file_upload = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			alert('file_upload一次只能轉換一個,轉換的元素為賦予id的div');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_file_upload')===''){
				alert('請先轉換元素為file_upload');
				return;
			}
			
		}
		
		//物件方法
		var jqobject_scope_methods={
			'check_is_uploading':function(){
				
				if(
					$('#'+this.attr('id')+'_ingicon').css('display')=='none'
				){
					return '0';
				}else{
					
					return '1';
				}
			}
		};
		
		//若是呼叫物件方法
		if(typeof(param1)=='string'){
			
			if(global_typeof(param2)!=='array'){
				
				param2=[];
			}
			if(jqobject_scope_methods[param1]===undefined || typeof(jqobject_scope_methods[param1])!=='function'){
				alert('元件無此操作');
				return;
			}
			
			return jqobject_scope_methods[param1].call(get_jqobject,param2);
		}
		
		if(typeof(param1)=='undefined'){
			options={};
		}else{
			options=param1;
		}
		var opts = $.extend( true,{}, $.easy_file_upload.defaults, options );
		
		get_jqobject.data(opts);
		
		var component_id=get_jqobject.attr('id');
		if(get_jqobject.attr('is_transformed_to_file_upload')===undefined){
			function suitable_img_width(img_path,max_width)
			{
				var is_loaded=false;
				var the_img=$("<img border='0' src='"+img_path+"' />");
			
				
				if(max_width===undefined || max_width===''){
					max_width=400;
				}
				display_img_width=the_img[0].naturalWidth;
				
				if(display_img_width>max_width){
					display_img_width=max_width;
				}
				if(display_img_width==0){
					display_img_width=max_width;
				}
				
				return display_img_width;
			}
			var display_which_path=(opts.default_newfile?opts.default_newfile:opts.default_value);
			var temp_string='';
			//first draw preview
			if(opts.file_type=='pic'){
				temp_string=
				'<div id="'+component_id+'_preview">';
					
					if(opts.preview_width!=''){
						temp_string+=(
						display_which_path!=''?
						'<img border="0" style="width:'+opts.preview_width+'px;"  src="'+
						global_ProjectRootUrl+display_which_path+'" />':
						'<img border="0"  alt="無圖檔"  />');
					}else{
						
						temp_string+=(
						display_which_path!=''?
						'<img border="0" src="'+global_ProjectRootUrl+display_which_path+'" width=\''+suitable_img_width(global_ProjectRootUrl+display_which_path,opts.max_width)+'\' />':
						'<img border="0" alt="無圖檔"  />');
					}
				temp_string+=
				'</div>';
			}else if(opts.file_type=='video'){
				temp_string=
				'<div id="'+component_id+'_preview">';
				if(display_which_path!=''){
					var temp_mime='';
					var temp_extension=global_fetch_file_extension(display_which_path);
					if(temp_extension=='ogv'){
						temp_mime='video/ogg';
					}else{
						temp_mime='video/'+temp_extension;
					}
					temp_string+=
					'<video width="'+opts.preview_width+'" height="'+opts.preview_height+'"  controls="controls">'+
						'<source src="'+global_ProjectRootUrl+display_which_path+'" type="'+temp_mime+'" />'+
						'Your browser does not support the video tag.'+
					'</video>';
				}else{
					temp_string+=
					'<video width="'+opts.preview_width+'" height="'+opts.preview_height+'" controls="controls">'+
						'<source src="" type="video/mp4"  />'+
					'</video>';
				}										
				temp_string+=
				'</div>';
			}else if(opts.file_type=='normal'){
				temp_string=
				'<div id="'+component_id+'_preview">'+
					(
						display_which_path!=''?
						'<a href="'+opts.process_download_url+'?objid='+display_which_path+'">下載檔案</a>':
						'暫無檔案'
					)+
				'</div>';
			}else if(opts.file_type=='pdf'){
				temp_string=
				'<div id="'+component_id+'_preview">'+
					(
						display_which_path!=''?
						'<a href="'+opts.process_download_url+'?objid='+display_which_path+'">下載檔案</a>':
						'暫無檔案'
					)+
				'</div>';
			}
			get_jqobject.append(temp_string);
			
			//draw csrf_token
			temp_string=
			'<input type="hidden"  id="'+component_id+'_csrf_token"  value="'+opts.csrf_token+'" />';  
			get_jqobject.append(temp_string);
			
			
			//draw file_tip
			temp_string=
			'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
			get_jqobject.append(temp_string);
			
			//draw input
			temp_string=
			'<input type="file" maxlength="255" size="50" id="'+component_id+'_input" name="'
			+'"  />';  
			get_jqobject.append(temp_string);
			
			//draw filedeletebutton
		
			temp_string=
			'<input type="button" value="移除" style="margin-right:10px;" '+
			'id="'+component_id+'_filedeletebutton" />';
			get_jqobject.append(temp_string);
		
			//draw uploading icon
			temp_string=
			'<img border="0" src="'+opts.uploading_icon_url+'"' +
			'style="display:none;vertical-align:middle;float:right"'+ 
			'id="'+component_id+'_ingicon">';
			get_jqobject.append(temp_string);
			
			//draw savedata element
			
				
			temp_string=
			'<input type="hidden" value="'+opts.default_newfile+'" name="'+
			opts.input_name+
			'_newfile" id="'+component_id+'_newfile" />'+
			'<input type="hidden" value="'+opts.default_relatedfile_1+'" name="'+
			opts.input_name+
			'_relatedfile_1" id="'+component_id+'_relatedfile_1" />'+
			'<input type="hidden" value="'+opts.default_original_main_name+'" name="'+
			opts.input_name+
			'_original_main_name" id="'+component_id+'_original_main_name" />'+
			'<input type="hidden" value="'+opts.default_value+'" name="'+
			opts.input_name+
			'" />';
				
			
			get_jqobject.append(temp_string);
			//draw is_delete_oldfile element
		
				
			temp_string=
			'<input type="hidden" value="0" name="'+
			opts.input_name
			+'_is_delete_oldfile" id="'+component_id+'_is_delete_oldfile" />';
				
			
			get_jqobject.append(temp_string);
			
			//draw form_for_upload
			temp_string=
			'<form style="display:none" target="'+component_id+'_iframe" action="'+opts.process_upload_url+'" method="post" enctype="multipart/form-data"'+
				'id="'+component_id+'_form">'+
					'<input type="hidden" name="updated_column_name" value="'+
					opts.input_name
					+'" >'+
					'<input type="hidden" name="component_id" value="'+component_id+'" >'+
					'<input type="hidden" name="op" value="upload_material" >'+
					'<input type="hidden" name="newfile" value="'+opts.default_newfile+'" />'+
					'<input type="hidden" name="relatedfile_1" value="'+opts.default_relatedfile_1+'" />'+
					'<input type="hidden" name="output_width" value="'+opts.output_width+'" />'+
					'<input type="hidden" name="output_height" value="'+opts.output_height+'" />'+
					'<input type="hidden" name="file_type" value="'+opts.file_type+'" />'+
					'<input type="hidden" name="_token" value="'+opts.csrf_token+'" />'+
					'<iframe name="'+component_id+'_iframe" width="0" height="0" ></iframe>'+
			'</form>';
			$('body').append(temp_string);
			//bind element event_handler
			$('#'+component_id+'_input').change(
				function(){
					
					if($.easy_validate_string((opts.is_required=='1'?'r':'o')+opts.file_type+'file',$(this).val())===false){
						$(this).val('');
						alert('檔案格式錯誤');
						return;
					}				
					$("#"+component_id+"_filedeletebutton").hide();
					$("#"+component_id+"_ingicon").show();
					$(this).appendTo($("#"+component_id+"_form"));
					$("#"+component_id+"_form").submit();
				}
			)
			$('#'+component_id+'_filedeletebutton').click(
				function(){
					if(opts.file_type=='pic'){
						if($('#'+component_id+'_preview'+'>img').length==0){
							alert('無檔案可移除');
							return;
						}
					}else if(opts.file_type=='video'){
						if($('#'+component_id+'_preview'+'>video').length==0){
							alert('無檔案可移除');
							return;
						}
					}else if(opts.file_type=='normal'){
						if($('#'+component_id+'_preview'+'>a').length==0){
							alert('無檔案可移除');
							return;
						}
					}else if(opts.file_type=='pdf'){
						if($('#'+component_id+'_preview'+'>a').length==0){
							alert('無檔案可移除');
							return;
						}
					}
					
					$("#"+ component_id+"_filedeletebutton").hide();
					$("#"+component_id+"_ingicon").show();
					
					var about_info={
						'updated_column_name':$('#'+component_id+'_input').attr('name'),
						'op':'delete_upload',
						'newfile':$("#"+component_id+"_newfile").val(),
						'relatedfile_1':$("#"+component_id+"_relatedfile_1").val(),
						'_token':$("#"+component_id+"_csrf_token").val(),
						'component_id':component_id
					};
					$.ajax({
						'type': "POST",
						'url': (opts.process_upload_url),
						'cache': false,
						'data':about_info,
						'dataType':'json',
						'error': function(){
							alert('Ajax request 錯誤');
						},
						'success': function(about_info){
							if(about_info['is_success']=='1'){
									
								var temp_html='';
								$("#"+component_id+'_input').val('');
								$("#"+component_id+'_ingicon').hide();
								$("#"+component_id+'_is_delete_oldfile').val('1');
								if(opts.file_type=='pic'){
									temp_html="<img src=\"\" alt=\"無圖檔\"    border=\"0\"   />";											
								}else if(opts.file_type=='video'){
									temp_html+=
									'<video controls="controls">'+
										'<source src="" type="video/mp4" />'+
									'</video>';
								}else if(opts.file_type=='normal'){
									temp_html="暫無檔案";
								}else if(opts.file_type=='pdf'){
									temp_html="暫無檔案";
								}
								
								$("#"+component_id+'_preview').html(temp_html);
								$("#"+component_id+'_newfile').val('');
								$("#"+component_id+'_relatedfile_1').val('');
								$("#"+component_id+'_original_main_name').val('');
								$("#"+component_id+"_filedeletebutton").show();
							}else{
								alert(about_info['message']);
							}
						}
					});
				}
			)
			
			window[component_id+'_upload_material_callback']=function(about_info){
				if(about_info['is_success']=='1'){
					
					var temp_html='';
					if(opts.file_type=='pic'){
						temp_html=
						'<img src="'+about_info['display_src']+'" width='+about_info['display_src_width']+'  border="0"   />';
					}else if(opts.file_type=='video'){
						temp_html=
						'<video width="'+opts.preview_width+'" controls="controls">'+
							'<source src="'+about_info['display_src']+'" type="'+about_info['mime']+'" />'+
							'Your browser does not support the video tag.'+
						'</video>';
					}else if(opts.file_type=='normal'){
						temp_html=
						'<a href="'+opts.process_download_url+'?objid='+about_info['newfile']+'" >下載檔案</a>';
					}else if(opts.file_type=='pdf'){
						temp_html=
						'<a href="'+opts.process_download_url+'?objid='+about_info['newfile']+'" >下載檔案</a>';
					}
					$("#"+component_id+"_preview").html(temp_html);
					$("#"+component_id+'_is_delete_oldfile').val('1');
					
					$("#"+component_id+"_form>[name='newfile']").val(about_info['newfile']);
					$("#"+component_id+"_newfile").val(about_info['newfile']);
					$("#"+component_id+"_form>[name='relatedfile_1']").val(about_info['relatedfile_1']);
					$("#"+component_id+"_relatedfile_1").val(about_info['relatedfile_1']);
					$("#"+component_id+"_original_main_name").val(about_info['original_main_name']);
					
					$('#'+component_id+'_input').insertAfter($('#'+component_id+"_file_tip"));
					
					$("#"+component_id+'_ingicon').hide();
					
					
					$("#"+component_id+'_filedeletebutton').show();
					
				}else{
					$('#'+component_id+'_ingicon').hide();
					
					
					$("#"+component_id+'_filedeletebutton').show();
					
					alert(about_info['message']);	
				}
			}
			get_jqobject.attr('is_transformed_to_file_upload','1');	
		}
		
		return get_jqobject;
	};
}(jQuery));

