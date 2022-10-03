/*
	
	一個toggle_panel機制 包含群組、toggle_panel、toggle_button(可有可無)
	toogle_button(永遠顯示，否則沒辦法切換)屬性:
		according_to_of="{toggle_pannels群組 識別碼}" 、
		control_panel="{panel次識別碼}"
	toggle_panel(永遠只顯示被切換的那頁)屬性：
		according_to_of="{toggle_pannels群組 識別碼}" 、 
		toggle_panel="{panel次識別碼}"
*/

(function(jQuery,bill_core){
		
	//轉換元素成物件 或 執行物件方法
	
	jQuery.bill_toggle_panel={
		'button_jquery_expression':
			'[according_to_of][control_panel]'
		,	
		'attach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			this.deattach(jquery_expression);
			this._initial(jquery_expression);
			
			jQuery(jquery_expression).on(
				{
					'click.bill_toggle_panel':function(){
						var the_group_name=jQuery(this).attr('according_to_of');
						var the_panel_name=jQuery(this).attr('control_panel');
						
						if(jQuery(this).is('a') || jQuery(this).is(':button')){
							
							if(
								jQuery('[according_to_of="'+the_group_name+'"][toggle_panel="'+the_panel_name+'"]:visible').length==0
							){
								jQuery('a[according_to_of="'+the_group_name+'"]').css({'font-weight':'normal','font-size':'medium'});
								jQuery(this).css({'font-weight':'bolder','font-size':'x-large'});
							}
							
							jQuery('[according_to_of="'+the_group_name+'"][toggle_panel]').hide();
							jQuery('[according_to_of="'+the_group_name+'"][toggle_panel="'+the_panel_name+'"]').show();
							
							
						}else{
							jQuery('[according_to_of="'+the_group_name+'"][toggle_panel]').hide();
							jQuery('[according_to_of="'+the_group_name+'"][toggle_panel="'+the_panel_name+'"]').show();
						}
					
					},
				}
				,
				this.button_jquery_expression
			);
		
		},
		'deattach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			jQuery(jquery_expression).off(
				'.bill_toggle_panel'
				,
				this.button_jquery_expression
			)
		},
		'_initial':function(jquery_expression){
			
			jQuery(jquery_expression).find('a[according_to_of][control_panel][is_initial]').each(
				function(){
					jQuery(this).css(
						{
							'font-weight':'bolder',
							'font-size':'x-large'
						}
					)
				}
			);
			jQuery(jquery_expression).find('input:button[according_to_of][control_panel][is_initial]').each(
				function(){
					jQuery(this).css(
						{
							'font-weight':'bolder',
							'font-size':'x-large'
						}
					)
				}
			);
			
			jQuery(jquery_expression).find('input:radio:checked[according_to_of][control_panel]').each(
				function(){
					jQuery(this).attr('is_initial','is_initial');
				}
			)
			
			jQuery(jquery_expression).find('[according_to_of][control_panel]:not([is_initial])').each(
				function(){
					var the_group_name=jQuery(this).attr('according_to_of');
					var the_panel_name=jQuery(this).attr('control_panel');
					jQuery('[according_to_of="'+the_group_name+'"][toggle_panel="'+the_panel_name+'"]').hide();
				}
			)
		},
	}
})(jQuery,bill_core);

