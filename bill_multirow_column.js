(function(jQuery,bill_core){
	
	{
		let never_used_is_found='0';
		if(jQuery===undefined){
			console.error('jquery never used');
		}
		if(jQuery.fn.bill_components_initial===undefined){
			console.error('jquery plugin bill_components_initial never used');
		}
		if(bill_core===undefined){
			console.error('bill_core never used');
		}
		if(never_used_is_found==='1'){
			return;
		}
	}
	
	//設定屬於easy_multirow_column專屬的元件函式或元件設定預設值
	jQuery.bill_multirow_column={
		'defaults':{
			'column_name':'',
			'row_template_id':'',
			'counts_max':10,
			'is_default_one_row':'1',
			'delete_row_button_text':'刪除',
			'add_row_button_text':'新增一筆',
			'delete_all_rows_button_text':'刪除全部',
			'new_row_is_append':'1',
			'after_row_load_func':function(the_row_data){},
			'before_row_delete_func':function(the_row_data){},
			'is_required':'0',
			'default_value_source':[],
			'environment_data_source':{},
			'_next_row_index':0,
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_multirow_column = function(param1,...other_params){
		var return_result=this;
		
		if( 
			arguments.length>=1
		){
			
		}else if( 
			arguments.length===0
		){
			param1={};
		}
		
		var args_illegal_is_found='0';
		if( 
			bill_core.global_typeof(param1)!=='pure_object' &&
			bill_core.global_typeof(param1)!=='string'
		){	
			args_illegal_is_found='1';
			bill_core.debug_console('bill_core.'+arguments.callee.name+' param1 error!','error');
		}
		if(args_illegal_is_found==='1'){
			return return_result;
		}
		//限制轉換元素的個數為1
		if(this.length>1){
			bill_core.debug_console('bill_multirow_column一次只能轉換一個元素');
			return return_result;
		}else if(this.length==1){
			if(this.is('div[id]')){
			}else{
				bill_core.debug_console('bill_multirow_colum轉換的元素必須為賦予id的div');
				return return_result;
			}
		}else if(this.length==0){
			return return_result;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(bill_core.global_typeof(param1)=='string'){
			if( this.attr('is_transformed_to_bill_multirow_column')!=='1' ){
				bill_core.debug_console('請先轉換元素為bill_multirow_column','error');
				return return_result;
			}
		}
		
		var get_jqobject=this;
		var component_id=get_jqobject.attr('id');
		if( bill_core.global_typeof(param1)=='pure_object' ){
			var want_set_opts=param1;
			get_jqobject.data(
				jQuery.extend( true,{}, jQuery.bill_multirow_column.defaults, want_set_opts )
			);	
		}
		var opts=get_jqobject.data();
		
		
		
		/*
			the_row_data={
				//add or modify
				'row_type':'add',
				'row_index':'0',
				'column_name_1':'column_value_1',
				'column_name_2':'column_value_2',
				......
			}
		*/
		var jqobject_private_methods={};
		var jqobject_public_methods={
			'draw_row':function(the_row_data,is_for_add_row_button){	

				var the_row_index=the_row_data['row_index'];
				var the_row_id=component_id+'_row_'+the_row_index;	
				
				var temp_jqobject=jQuery('#'+opts.row_template_id).clone();
				temp_jqobject.attr('id',the_row_id);
				temp_jqobject.show();
				temp_jqobject.find(
					'input[type="text"][name],'+
					'input[type="radio"][name],'+
					'input[type="checkbox"][name],'+
					'input[type="hidden"][name],'+
					'textarea[name],'+
					'select[name],'+
					'div[name]'
				).each(
					function(){
						var original_input_name=jQuery(this).attr('name');
						
						jQuery(this).attr(
							'id',
							the_row_id+'_'+original_input_name
						);
						jQuery(this).attr(
							'name',
							opts.column_name+'['+the_row_index+']['+original_input_name+']');
					}
				);
				
				temp_jqobject.append(
					'&nbsp;&nbsp;&nbsp;'+
					'<input type="button" '+
					'id="'+the_row_id+'_delete_row_button"  style="cursor:pointer" value="'+opts.delete_row_button_text+'" />'+
					'<hr />'
				);
				if(is_for_add_row_button==='1'){
					if(opts.new_row_is_append==='1'){
						this.append(bill_core.jquery_outer_html(temp_jqobject));
					}else{
						jQuery(bill_core.jquery_outer_html(temp_jqobject)).insertAfter('#'+component_id+'_rows_datum');
					}
				}else{
					this.append(bill_core.jquery_outer_html(temp_jqobject));
				}
				jQuery('#'+the_row_id+'_delete_row_button').click(
					function(){
						var now_rows_count=
							jqobject_public_methods.get_rows_count.call(
								jQuery('#'+component_id)
							);
						if(now_rows_count==1 && opts.is_required==='1'){
							alert('至少必須一列有值')
							return;
						}
						jQuery(this).parent().remove();
					}
				)
				
				//先處理一般元件
				jQuery('#'+the_row_id).bill_components_initial(the_row_data,opts.environment_data_source);
				
				opts.after_row_load_func.call(this,the_row_data);
			},
			'get_rows_count':function(){	
				return this.children('div[id^="'+this.attr('id')+'_row_"]').length;
			}
		};
		if( bill_core.global_typeof(param1)=='string' ){
			
			if(
				jqobject_public_methods[param1]===undefined
			){
				bill_core.debug_console('元件無此操作','error');
				return get_jqobject;
			}
			return jqobject_public_methods[param1].apply(get_jqobject,other_params);
		}
		

		if( get_jqobject.attr('is_transformed_to_bill_multirow_column')!=='1' ){
			opts._add_row_button_id=component_id+'_add_row_button';
			opts._delete_all_rows_button_id=component_id+'_delete_all_rows_button';
			get_jqobject.append(
				'<div  id="'+component_id+'_op_buttons_area" >'+
					'<input style="cursor:pointer"  type="button" id="'+opts._add_row_button_id+'" value="'+opts.add_row_button_text+'" />&nbsp;&nbsp;'+
					(opts.is_required==='1'?'':'<input style="cursor:pointer" type="button" id="'+opts._delete_all_rows_button_id+'" value="'+opts.delete_all_rows_button_text+'" />')+
				'</div>'+
				'<hr  id="'+component_id+'_rows_datum" />'
			);
			
			for(let new_row_data of opts.default_value_source){
				new_row_data['row_index']=opts._next_row_index;
				jqobject_public_methods.draw_row.call(
					get_jqobject,
					new_row_data
				);
				opts._next_row_index++;
			}
			if(opts.default_value_source.length==0){
				if(
					opts.is_default_one_row==='1' || 
					opts.is_required==='1'
				){
					var new_row_data={
						'row_type':'add'
					};
					new_row_data['row_index']=opts._next_row_index;
					jqobject_public_methods.draw_row.call(
						get_jqobject,
						new_row_data
					);
					opts._next_row_index++;
				}
			}
			jQuery('#'+opts._add_row_button_id).click(
				function(){
					if(opts.counts_max!=0){
						var now_rows_count=
							jqobject_public_methods.get_rows_count.call(
								get_jqobject
							);
						if(now_rows_count>=opts.counts_max){
							alert('已超過列數上限:'+opts.counts_max);
							return;
						}
					}
					var new_row_data={
						'row_type':'add'
					};
					
					new_row_data['row_index']=opts._next_row_index;
					
					jqobject_public_methods.draw_row.call(
						get_jqobject,
						new_row_data,
						'1'
					);
					opts._next_row_index++;
				}
			)
			
		
			
			jQuery('#'+opts._delete_all_rows_button_id).click(
				function(){
					jQuery('#'+component_id).find('[id$="_delete_row_button"]').click();
				}
			);
			get_jqobject.attr('is_transformed_to_bill_multirow_column','1');
			
		}
		return get_jqobject;
	};
})(jQuery,bill_core);