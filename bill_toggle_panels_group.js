/*
	
	一個toggle_panels群組 包含數個toggle_panel、數個toggle_button
	toogle_button(永遠顯示，否則沒辦法切換)屬性:according_to_of="{toggle_pannels群組 識別碼}" 、control_panel="{panel次識別碼}"
	toggle_panel(一個群組，永遠只顯示被切換的那頁)屬性：according_to_of="{toggle_pannels群組 識別碼}" 、 toggle_panel="{panel次識別碼}"
*/

(function(jQuery,bill_core){
		
	//轉換元素成物件 或 執行物件方法
	jQuery(document).on('click','[according_to_of][control_panel]',function(){	
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
	
	})
	jQuery.bill_toggle_panels={
		'initial':function(){
			jQuery('a[according_to_of][control_panel][is_initial]').each(
				function(){
					jQuery(this).css(
						{
							'font-weight':'bolder',
							'font-size':'x-large'
						}
					)
				}
			);
			jQuery('input:button[according_to_of][control_panel][is_initial]').each(
				function(){
					jQuery(this).css(
						{
							'font-weight':'bolder',
							'font-size':'x-large'
						}
					)
				}
			);
			
			jQuery('input:radio:checked[according_to_of][control_panel]').each(
				function(){
					jQuery(this).attr('is_initial','is_initial');
				}
			)
			
			jQuery('[according_to_of][control_panel]:not([is_initial])').each(
				function(){
					var the_group_name=jQuery(this).attr('according_to_of');
					var the_panel_name=jQuery(this).attr('control_panel');
					jQuery('[according_to_of="'+the_group_name+'"][toggle_panel="'+the_panel_name+'"]').hide();
				}
			)
			
			
			
		}
	}
}(jQuery,bill_core));

