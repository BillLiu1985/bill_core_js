(function(jQuery,bill_core,CKEDITOR){
	//設定屬於bill_checkboxs_group專屬的元件函式或元件設定預設值
	jQuery.bill_bridge_ckeditor={
		'defaults':{
			'customConfig':'config.multimedia.js',
			'contentsCss':'',
			'width':'650',
			'height':'400',
			'baseHref':''
		},
		'setkcfinder':function(original_config,folder_path){
			if( bill_core.string_is_end_with(folder_path,'/')==='0' ){
				folder_path=folder_path+'/';
			}			
			original_config.filebrowserBrowseUrl=folder_path+'kcfinder/browse.php?type=files&lng=zh-tw';
			original_config.filebrowserImageBrowseUrl=folder_path+'kcfinder/browse.php?type=images&lng=zh-tw';
			original_config.filebrowserFlashBrowseUrl=folder_path+'kcfinder/browse.php?type=flash&lng=zh-tw';
			original_config.filebrowserUploadUrl=folder_path+'kcfinder/upload.php?type=files&lng=zh-tw';
			original_config.filebrowserImageUploadUrl=folder_path+'kcfinder/upload.php?type=images&lng=zh-tw';
			original_config.filebrowserFlashUploadUrl=folder_path+'kcfinder/upload.php?type=flash&lng=zh-tw';
		},
		'real_objs':{
			
		}
	};
	
}(jQuery,bill_core,CKEDITOR));

