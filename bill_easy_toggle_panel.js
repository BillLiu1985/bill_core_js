/*
	toggle_panel群組 識別碼:column_group
	一個toggle_panel群組 包含數個panel、數個toggle按鈕
	toogle按鈕屬性:according_to_of="{toggle_pannel群組 識別碼}" control_panel="{panel次識別碼}"
	panel屬性： toggle_panel="{toggle_pannel群組 識別碼}- {panel次識別碼}"
*/

(function($){
	//先看jquery有沒有引入
	if($===undefined){
		alert('jquery元件未啟動');
		return;
	}
	
	//轉換元素成物件 或 執行物件方法
	$(document).on('click','[according_to_of][control_panel]',function(){	
		
		if($(this).is('a') || $(this).is(':button')){
			
			
			if($('[according_to_of="'+$(this).attr('according_to_of')+'"][toggle_panel="'+$(this).attr('control_panel')+'"]:visible').length==0){
				$('a[according_to_of]').css({'font-weight':'normal','font-size':'medium'});
				$(this).css({'font-weight':'bolder','font-size':'x-large'});
			}
			
			$('[according_to_of="'+$(this).attr('according_to_of')+'"][toggle_panel]').hide();
			$('[according_to_of="'+$(this).attr('according_to_of')+'"][toggle_panel="'+$(this).attr('control_panel')+'"]').show();
			
			
		}else{
			$('[according_to_of="'+$(this).attr('according_to_of')+'"][toggle_panel]').hide();
			$('[according_to_of="'+$(this).attr('according_to_of')+'"][toggle_panel="'+$(this).attr('control_panel')+'"]').show();
		}
	
	})
	$.easy_toggle_panel={
		'initial':function(){
			$('[according_to_of][control_panel][is_initial]').each(
				function(){
					if($(this).is('a') || $(this).is(':button')){
						$(this).css(
							{
								'font-weight':'bolder',
								'font-size':'x-large'
							}
						)
					}
				}
			);
			
			$('input[according_to_of][control_panel]:checked').each(
				function(){
					$(this).attr('is_initial','is_initial');
				}
			)
			
			$('[according_to_of][control_panel]:not([is_initial])').each(
				function(){
					
					$('[according_to_of="'+$(this).attr('according_to_of')+'"][toggle_panel="'+$(this).attr('control_panel')+'"]').hide();
				}
			)
			
			
			
		}
	}
}(jQuery));

