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
			'can_do_what':[],
			'button_infos':{
				'add':{
					'need_can':'',
					'template':''
				},
				'modify':{
					'need_can':'',
					'template':''
				}
			},
			'_button_htmls':{
				
			},
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
		if( get_jqobject.length==0 ){
			return;
		}
		if( typeof(param1)=='string '){
			if( get_jqobject.attr('is_transformed_to_bill_grid')!=='1' ){
				bill_core.debug_console('請先轉換元素為bill_grid','error');
				return;
			}
		}
		var jqobject_private_methods={
			'draw':function(data){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				var button_infos=about_grid['button_infos'];
				var can_do_what=about_grid['can_do_what'];
				var _button_htmls=about_grid._button_htmls;
				for(var button_id in button_infos){
					var button_info=button_infos[button_id];
					if(
						jQuery.inArray(button_info.need_can,can_do_what)===-1
					){
						_button_htmls[button_id]='';
					}else{
						_button_htmls[button_id]=bill_core.global_parse_template_string(
							button_info.template,
							{
								'grid_id':grid_id,
								'button_id':button_id
							}
						);
					}
				}
				about_grid['make_heading_part_func'].call(the_grid,jqobject_private_methods['draw_button']);				
				about_grid['make_list_part_func'].call(the_grid,data['list_records'],jqobject_private_methods['draw_button']);
				about_grid['make_pager_part_func'].call(the_grid,data['data_status'],jqobject_private_methods['draw_button']);
				about_grid['after_draw_func'].call(the_grid,jqobject_private_methods['draw_button']);
				
			},
			'draw_button':function(button_id,params){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				
				var _button_htmls=about_grid['_button_htmls'];
				var button_html=_button_htmls[button_id];
				var return_html='';
				if(params===undefined){
					params={};
				}
				if(
					bill_core.string_is_solid(button_html)==='1'
				){
					return_html=
						bill_core.global_parse_template_string(
							button_html,
							params
						);
				}
				
				return return_html;
				
			}
			,
			'reload':function(){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				about_grid['before_draw_func'].call(the_grid);
				if(Object.keys(about_grid['search_items']).length===0){
					about_grid['search_items']['']='';
				}
				var about_info={
					'setting_items':about_grid['setting_items'],
					'search_items':about_grid['search_items'],
					'grid_id':grid_id,
					'CSRF_TOKEN':about_grid['CSRF_TOKEN']
				};
				bill_core.ajax_post(
					about_grid['reload_ajax_url'],
					about_info,
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							jqobject_private_methods['draw'](response_data.data);
						}
						else{
							alert(response_data.message);
						}
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
					},
					'0',
					the_grid
				);
			},
			'change_page':function(nthpage){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				about_grid['setting_items']['nthpage']=nthpage;
				jqobject_private_methods['reload']();
			},
			'record_delete':function(record_id){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				var about_info={
					'obj_id':record_id,
					'CSRF_TOKEN':about_grid['CSRF_TOKEN']
				}
				
				bill_core.ajax_post(
					about_grid['record_delete_ajax_url'],
					about_info,
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							jqobject_private_methods['reload']();
							setTimeout(function(){
								alert('刪除成功');
							}, 100);
						}
						else{
							alert(response_data.message);
							this.attr('disabled',false);
						}
						
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						this.attr('disabled',false);
					},
					'0',
					this
				);
			},
			'record_toggle_is_enabled':function(record_id){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				bill_core.ajax_post(
					about_grid['record_toggle_is_enabled_ajax_url'],
					{
						'CSRF_TOKEN':about_grid['CSRF_TOKEN'],
						'obj_id':record_id
					},
					function(data,textStatus,jqXHR){
						if(data.code=='1'){
							/*
							var temp_map={
								'是':'否',
								'否':'是',
								'啟動':'停用',
								'停用':'啟動'
							};
							this.text(temp_map[this.text()]);
							*/
							jqobject_private_methods['reload']();
						}else{
							alert(data.message);
						}
						this.attr('disabled',false);
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						this.attr('disabled',false);
					},
					'0',
					this
				);	
			},
			'record_toggle_is_show':function(record_id){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				bill_core.ajax_post(
					about_grid['record_toggle_is_show_ajax_url'],
					{
						'CSRF_TOKEN':about_grid['CSRF_TOKEN'],
						'obj_id':record_id
					},
					function(data,textStatus,jqXHR){
						if(data.code=='1'){
							/*
							var temp_map={
								'是':'否',
								'否':'是',
								'上架':'下架',
								'下架':'上架'
							};
							this.text(temp_map[this.text()]);
							*/
							jqobject_private_methods['reload']();
							
						}else{
							alert(data.message)
						}
						this.attr('disabled',false);
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						this.attr('disabled',false);
					},
					'0',
					this
				);	
			},
			'record_sort_up':function(record_id){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				bill_core.ajax_post(
					about_grid['record_sort_up_ajax_url'],
					{
						'CSRF_TOKEN':about_grid['CSRF_TOKEN'],
						'obj_id':record_id,
						'cat_id':about_grid['search_items']['cat_id'],
						'p_cat_id':about_grid['search_items']['p_cat_id'],
						'parent_id':about_grid['search_items']['parent_id']
					},
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							jqobject_private_methods['reload']();
						}
						else{
							alert(response_data.message);
							this.attr('disabled',false);
						}
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						this.attr('disabled',false);
					},
					'0',
					this
				);
			},
			'record_sort_down':function(record_id){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				bill_core.ajax_post(
					about_grid['record_sort_down_ajax_url'],
					{
						'CSRF_TOKEN':about_grid['CSRF_TOKEN'],
						'obj_id':record_id,
						'cat_id':about_grid['search_items']['cat_id'],
						'p_cat_id':about_grid['search_items']['p_cat_id'],
						'parent_id':about_grid['search_items']['parent_id']
					},
					function(response_data,textStatus,jqXHR){
						if(response_data.code==='1'){
							jqobject_private_methods['reload']();
						}
						else{
							alert(response_data.message);
							this.attr('disabled',false);
						}
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						this.attr('disabled',false);
					},
					'0',
					this
				);
			},
			'record_sort_all':function(){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				
				var modify_records=[];
				
				var is_pass_validator='1';
				jQuery('[name="custom_grid_record_sort_all_input"]').each(
					function(){
						var temp_id=jQuery(this).closest('*[record_id]').attr('record_id');
						var temp_value=jQuery(this).val();
						if(
							is_pass_validator==='0'
						){
							return;
						}
						
						if(
							bill_core.validate_single('rnumber',temp_value)==='0'
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
					about_grid['record_sort_all_ajax_url'],
					{
						'CSRF_TOKEN':about_grid['CSRF_TOKEN'],
						'modify_records':modify_records
					},
					function(data,textStatus,jqXHR){
						if(data.code=='1'){
							jqobject_private_methods['reload']();
							setTimeout(function(){
								alert('排序變更成功');
							}, 100);
							
						}else{
							alert(data.message)
						}
						this.attr('disabled',false);
					},
					function(jqXHR,textStatus,errorThrown ){
						alert(errorThrown);
						this.attr('disabled',false);
					},
					'0',
					this
				);
			},
			'reset':function(){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				about_grid['before_draw_func'].call(the_grid);
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
			
				jqobject_private_methods['draw'](about_info);
			}
		};
		var jqobject_public_methods={
			'reload':function(){
				jqobject_private_methods['reload']();
			},
			'change_page':function(nthpage){
				var the_grid=get_jqobject;
				var grid_id=the_grid.attr('id');
				var about_grid=the_grid.data();
				about_grid['setting_items']['nthpage']=nthpage;
				jqobject_private_methods['reload']();
			},
			'reset':function(){
				jqobject_private_methods['reset']();
			}
		};
		
		if( typeof(param1)=='string' ){
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
				jqobject_private_methods['reload']();
			}
			else{
				jqobject_private_methods['reset']();
			}
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_record_delete_button'+'"]',function(){
				if(window.confirm("確定刪除嗎?")){
					jQuery(this).attr('disabled',true);
				
					jqobject_private_methods['record_delete'].call(
						jQuery(this),
						jQuery(this).closest('*[record_id]').attr('record_id')
					);
				}
			});
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_record_toggle_is_enabled_button'+'"]',function(){
				jQuery(this).attr('disabled',true);			
				jqobject_private_methods['record_toggle_is_enabled'].call(
					jQuery(this),
					jQuery(this).closest('*[record_id]').attr('record_id')
				);
				
			});
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_record_toggle_is_show_button'+'"]',function(){
				jQuery(this).attr('disabled',true);			
				jqobject_private_methods['record_toggle_is_show'].call(
					jQuery(this),
					jQuery(this).closest('*[record_id]').attr('record_id')
				);
				
			});
			
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_record_sort_up_button'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_private_methods['record_sort_up'].call(
					jQuery(this),
					jQuery(this).closest('*[record_id]').attr('record_id')
				);
			});
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_record_sort_down_button'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_private_methods['record_sort_down'].call(
					jQuery(this),
					jQuery(this).closest('*[record_id]').attr('record_id')
				);
			});
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_record_sort_all_button'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_private_methods['record_sort_all'].call(
					jQuery(this)
				);
			});
			
			jQuery(document).on('click','[name="'+get_jqobject.attr('id')+'_pager_nthpage'+'"]',function(){
				jQuery(this).attr('disabled',true);
				jqobject_private_methods['change_page'].call(
					jQuery(this),
					parseInt(jQuery(this).attr('nthpage'),10)
				);
			});
			
			get_jqobject.attr('is_transformed_to_bill_grid','1');
		}
		return get_jqobject;
	};
}(jQuery,bill_core));

