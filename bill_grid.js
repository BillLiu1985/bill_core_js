(function(jQuery,bill_core){
	
	//reload時 後端需返回的資料格式
	/*
		{
			'list_records':[]
			,
			'data_status':{
				'TOTAL_RECORDSCOUNT':0,
				'TOTAL_PAGESCOUNT':0,
				'TOTAL_GROUPSCOUNT':0,
				'CURSOR_NTHPAGE':0,
				'CURSOR_NTHGROUP':0,
				'START_NTHPAGE':0,
				'END_NTHPAGE':0
			}
		}
	*/
	jQuery.bill_grid={
		'defaults':{
			'is_initial_load_data':'1',
			'reload_ajax_url':'',
			'record_delete_ajax_url':'',
			'record_sort_up_ajax_url':'',
			'record_sort_down_ajax_url':'',
			'record_sort_all_ajax_url':'',
			'record_toggle_is_enabled_ajax_url':'',
			'record_toggle_is_show_ajax_url':'',
			'before_draw_func':function(){
				
				return;
			},
			'after_draw_func':function(){
				
				return;
			},
			'make_heading_part_func':function(){
				
				return;
			},
			'make_list_part_func':function(about_info){
				
				return;
			},
			'make_pager_part_func':function(about_info){
				
				return;
			},
			'search_items':{
			},
			'setting_items':{
				'recordscount_perpage':10,
				'pagescount_pergroup':100,
				'sortby':'',
				'nthpage':1,
				'masterpage':''
			},
			'CSRF_TOKEN':''
		}
	};
	
	jQuery.fn.bill_grid = function(param1){
		
		var get_jqobject=this.filter('div[id],table[id]');
		if( get_jqobject.length>1 ){
			bill_core.debug_console('bill_grid一次只能轉換一個,轉換的元素為賦予id的div或table','error');
			return;
		}
		if( typeof(param1)=='string '){
			if( get_jqobject.attr('is_transformed_to_bill_grid')!=='1' ){
				bill_core.debug_console('請先轉換元素為bill_grid','error');
				return;
			}
		}
		var draw=function(data){
			this.data('make_heading_part_func').call(this);				
			this.data('make_list_part_func').call(this,data['list_records']);
			this.data('make_pager_part_func').call(this,data['data_status']);
			this.data('after_draw_func').call(this);
			
		}
		var reload=function(){
			this.data('before_draw_func').call(this);
			var about_info={
				'setting_items':this.data('setting_items'),
				'search_items':this.data('search_items'),
				'grid_id':this.attr('id'),
				'CSRF_TOKEN':this.data('CSRF_TOKEN')
			};
			bill_core.ajax_post(
				this.data('reload_ajax_url'),
				about_info,
				function(response_data,textStatus,jqXHR){
					if(response_data.code==='1'){
						
						draw.call(this,response_data.data);
						
						
					}
					else{
						alert(response_data.message);
					}
				},
				function(jqXHR,textStatus,errorThrown ){
					alert(errorThrown);
				},
				'1',
				this
			);
		}
		var jqobject_scope_methods={
			'reload':function(){
				reload.call(this);
			},
			'change_page':function(nthpage){
				get_jqobject.data('setting_items')['nthpage']=nthpage;
				reload.call(get_jqobject);
			},
			'record_delete':function(record_id){
			
				var about_info={
					'obj_id':record_id,
					'CSRF_TOKEN':get_jqobject.data('CSRF_TOKEN')
				}
				
				bill_core.ajax_post(
					get_jqobject.data('record_delete_ajax_url'),
					about_info,
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							reload.call(get_jqobject);
							setTimeout(function(){
								alert('刪除成功');
							}, 100);
						}
						else{
							alert(response_data.message);
							jQuery(this).attr('disabled',false);
						}
						
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						jQuery(this).attr('disabled',false);
					},
					'1',
					this
				);
			},
			'record_toggle_is_enabled':function(record_id){
			
				bill_core.ajax_post(
					get_jqobject.data('record_toggle_is_enabled_ajax_url'),
					{
						'CSRF_TOKEN':get_jqobject.data('CSRF_TOKEN'),
						'obj_id':record_id
					},
					function(data,textStatus,jqXHR){
						if(data.code=='1'){
							if(jQuery(this).text()==='是'){
								jQuery(this).text('否');
							}else{
								jQuery(this).text('是');
							}
						}else{
							alert(data.message)
						}
						jQuery(this).attr('disabled',false);
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						jQuery(this).attr('disabled',false);
					},
					'1',
					this
				);	
			},
			'record_toggle_is_show':function(record_id){
			
				bill_core.ajax_post(
					get_jqobject.data('record_toggle_is_show_ajax_url'),
					{
						'CSRF_TOKEN':get_jqobject.data('CSRF_TOKEN'),
						'obj_id':record_id
					},
					function(data,textStatus,jqXHR){
						if(data.code=='1'){
							if(jQuery(this).text()==='是'){
								jQuery(this).text('否');
							}else{
								jQuery(this).text('是');
							}
						}else{
							alert(data.message)
						}
						jQuery(this).attr('disabled',false);
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						jQuery(this).attr('disabled',false);
					},
					'1',
					this
				);	
			},
			'record_sort_up':function(record_id){
				bill_core.ajax_post(
					get_jqobject.data('record_sort_up_ajax_url'),
					{
						'CSRF_TOKEN':get_jqobject.data('CSRF_TOKEN'),
						'obj_id':record_id
					},
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							reload.call(get_jqobject);
						}
						else{
							alert(response_data.message);
							jQuery(this).attr('disabled',false);
						}
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						jQuery(this).attr('disabled',false);
					},
					'1',
					this
				);
			},
			'record_sort_down':function(record_id){
				bill_core.ajax_post(
					get_jqobject.data('record_sort_down_ajax_url'),
					{
						'CSRF_TOKEN':get_jqobject.data('CSRF_TOKEN'),
						'obj_id':record_id
					},
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							reload.call(get_jqobject);
						}
						else{
							alert(response_data.message);
							jQuery(this).attr('disabled',false);
						}
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						jQuery(this).attr('disabled',false);
					},
					'1',
					this
				);
			},
			'record_sort_all':function(){
				var modify_records=[];
				
				var is_pass_validator='1';
				jQuery('[name="custom_grid_record_sort_all_input"]').each(
					function(){
						var temp_id=$(this).attr('record_id');
						var temp_value=jQuery(this).val();
						if(
							is_pass_validator==='0'
						){
							return;
						}
						
						if(
							bill_core.validate_string('rnumber',temp_value)==='0'
						){
							is_pass_validator='0';
							return;
						}
						modify_records.push({
							'id':temp_id,
							'sort':temp_value
						});
					}
				);
				if(is_pass_validator==='0'){
					alert('排序數字資料格式錯誤');
					return;
				}
				bill_core.ajax_post(
					get_jqobject.data('record_sort_all_ajax_url'),
					{
						'CSRF_TOKEN':get_jqobject.data('CSRF_TOKEN'),
						'modify_records':modify_records
					},
					function(data,textStatus,jqXHR){
						if(data.code=='1'){
							reload.call(get_jqobject);
							setTimeout(function(){
								alert('排序變更成功');
							}, 100);
							
						}else{
							alert(data.message)
						}
						jQuery(this).attr('disabled',false);
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						jQuery(this).attr('disabled',false);
					},
					'1',
					this
				);
			},
			'reset':function(){
				this.data('before_draw_func').call(this);
				var about_info={
					'data_status':{
						'TOTAL_RECORDSCOUNT':0,
						'TOTAL_PAGESCOUNT':0,
						'TOTAL_GROUPSCOUNT':0,
						'CURSOR_NTHPAGE':0,
						'CURSOR_NTHGROUP':0,
						'START_NTHPAGE':0,
						'END_NTHPAGE':0
					},
					'list_records':[]
				};
			
				draw.call(this,about_info);
			}
		};
		
		if( typeof(param1)=='string' ){
			if(
				jqobject_scope_methods[param1]===undefined || 
				typeof(jqobject_scope_methods[param1])!=='function'
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
			return jqobject_scope_methods[param1].apply(get_jqobject,temp_params);
		}
		
		var want_set_opts={};
		if(bill_core.global_typeof(param1)==='undefined'){
		}
		else{
			want_set_opts=param1;
		}
		
		var opts = jQuery.extend( true,{}, jQuery.bill_grid.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		

		if( bill_core.string_is_solid(opts.reload_ajax_url)==='1' ){
		
		}else{
			bill_core.debug_console('bill_grid元件啟動失敗,reload_ajax_url參數資料型態錯誤','error');
			return;
		}
		
		if( get_jqobject.attr('is_transformed_to_bill_grid')!=='1' ){

			if( opts.is_initial_load_data==='1' ){
				jqobject_scope_methods['reload'].call(get_jqobject);
			}
			else{
				jqobject_scope_methods['reset'].call(get_jqobject);
			}
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_record_delete_button'+'"]',function(){
				if(window.confirm("確定刪除嗎?")){
					jQuery(this).attr('disabled',true);
				
					jqobject_scope_methods['record_delete'].call(
						this,
						$(this).attr('record_id')
					);
				}
			});
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_record_toggle_is_enabled_button'+'"]',function(){
				jQuery(this).attr('disabled',true);			
				jqobject_scope_methods['record_toggle_is_enabled'].call(
					this,
					$(this).attr('record_id')
				);
				
			});
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_record_toggle_is_show_button'+'"]',function(){
				jQuery(this).attr('disabled',true);			
				jqobject_scope_methods['record_toggle_is_show'].call(
					this,
					$(this).attr('record_id')
				);
				
			});
			
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_record_sort_up_button'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_scope_methods['record_sort_up'].call(
					this,
					$(this).attr('record_id')
				);
			});
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_record_sort_down_button'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_scope_methods['record_sort_down'].call(
					this,
					$(this).attr('record_id')
				);
			});
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_record_sort_all_button'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_scope_methods['record_sort_all'].call(
					this
				);
			});
			
			$(document).on('click','[name="'+get_jqobject.attr('id')+'_pager_nthpage'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_scope_methods['change_page'].call(
					this,
					parseInt($(this).attr('nthpage'),10)
				);
			});
			
			get_jqobject.attr('is_transformed_to_bill_grid','1');
		}
		return get_jqobject;
	};
}(jQuery,bill_core));

