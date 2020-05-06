var SWFUpload={};
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 2009-03-25";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED	  		: -100,
	FILE_EXCEEDS_SIZE_LIMIT  		: -110,
	ZERO_BYTE_FILE			  		: -120,
	INVALID_FILETYPE		  		: -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR				  		: -200,
	MISSING_UPLOAD_URL	      		: -210,
	IO_ERROR				  		: -220,
	SECURITY_ERROR			  		: -230,
	UPLOAD_LIMIT_EXCEEDED	  		: -240,
	UPLOAD_FAILED			  		: -250,
	SPECIFIED_FILE_ID_NOT_FOUND		: -260,
	FILE_VALIDATION_FAILED	  		: -270,
	FILE_CANCELLED			  		: -280,
	UPLOAD_STOPPED					: -290,
	CUSTOM_DEFINE					: -300
};
SWFUpload.FILE_STATUS = {
	QUEUED		 : -1,
	IN_PROGRESS	 : -2,
	ERROR		 : -3,
	COMPLETE	 : -4,
	CANCELLED	 : -5
};
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE  : -100,
	SELECT_FILES : -110,
	START_UPLOAD : -120
};
SWFUpload.CURSOR = {
	ARROW : -1,
	HAND : -2
};
SWFUpload.WINDOW_MODE = {
	WINDOW : "window",
	TRANSPARENT : "transparent",
	OPAQUE : "opaque"
};

/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */
var easy_multiupload_bridge_flashcall=function(opts){
	this.opts=opts;
	
	//強制設定
	this.opts.flash_url=global_ProjectAdminUrl+"js/easy_multiupload_bridge/images/swfupload.swf";

	this.opts.button_action= SWFUpload.BUTTON_ACTION.SELECT_FILES;
	this.opts.button_cursor= SWFUpload.CURSOR.ARROW;
	this.opts.button_window_mode= SWFUpload.WINDOW_MODE.WINDOW;
	this.opts.eventQueue=[];
	this.opts.preserve_relative_urls=false;
	this.opts.use_query_string=false;
	this.opts.requeue_on_error=false;
	this.opts.http_success=[];
	this.opts.prevent_swf_caching=true;
	this.opts.queue_upload_count=0;	
	this.opts.return_upload_start_handler=function (file) {
		this.returnUploadStart(file);
	}
	
	this.queueEvent=function(handlerName, argumentArray) {
		// Warning: Don't call this.debug inside here or you'll create an infinite loop
		
		if (argumentArray == undefined) {
			argumentArray = [];
		} else if (!(argumentArray instanceof Array)) {
			argumentArray = [argumentArray];
		}
		
		var self = this;
		if (typeof this.opts[handlerName] === "function") {
			// Queue the event
			this.eventQueue.push(function () {
				this.opts[handlerName].apply(this, argumentArray);
			});
			
			// Execute the next queued event
			setTimeout(function () {
				self.executeNextEvent();
			}, 0);
			
		} else if (this.opts[handlerName] !== null) {
			throw "Event handler " + handlerName + " is unknown or is not a function";
		}
	};
	this.executeNextEvent=function () {
		// Warning: Don't call this.debug inside here or you'll create an infinite loop

		var  f = this.eventQueue ? this.eventQueue.shift() : null;
		if (typeof(f) === "function") {
			f.apply(this);
		}
	};
	
	
	
	// Private: Called by Flash to see if JS can call in to Flash (test if External Interface is working)
	this.testExternalInterface = function () {
		try {
			return this.callFlash("TestExternalInterface");
		} catch (ex) {
			return false;
		}
	};
	
	// Private: This event is called by Flash when it has finished loading. Don't modify this.
	// Use the swfupload_loaded_handler event setting to execute custom code when SWFUpload has loaded.
	this.flashReady = function () {
		
		// Check that the movie element is loaded correctly with its ExternalInterface methods defined
		var movieElement = this.getMovieElement();

		if (!movieElement) {
			alert("Flash called back ready but the flash movie can't be found.");
			return;
		}

		this.cleanUp(movieElement);
		
		this.queueEvent("swfupload_loaded_handler");
	};
	// Private: removes Flash added fuctions to the DOM node to prevent memory leaks in IE.
	// This function is called by Flash each time the ExternalInterface functions are created.
	this.cleanUp = function (movieElement) {
		// Pro-actively unhook all the Flash functions
		try {
			if (this.movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
				//alert("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
				for (var key in movieElement) {
					try {
						if (typeof(movieElement[key]) === "function") {
							movieElement[key] = null;
						}
					} catch (ex) {
					}
				}
			}
		} catch (ex1) {
		
		}

		// Fix Flashes own cleanup code so if the SWFMovie was removed from the page
		// it doesn't display errors.
		window["__flash__removeCallback"] = function (instance, name) {
			try {
				if (instance) {
					instance[name] = null;
				}
			} catch (flashEx) {
			
			}
		}

	}

	/* This is a chance to do something before the browse window opens */
	this.fileDialogStart = function () {
		this.queueEvent("file_dialog_start_handler");
	}


	/* Called when a file is successfully added to the queue. */
	this.fileQueued = function (file) {
		file = this.unescapeFilePostParams(file);
		this.queueEvent("file_queued_handler", [file]);
	}


	/* Handle errors that occur when an attempt to queue a file fails. */
	this.fileQueueError = function (file, errorCode, message) {
		file = this.unescapeFilePostParams(file);
		this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
	}
	/* Called after the file dialog has closed and the selected files have been queued.
		You could call startUpload here if you want the queued files to begin uploading immediately. */
	this.fileDialogComplete = function (numFilesSelected, numFilesQueued, numFilesInQueue) {
		this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued, numFilesInQueue]);
	}

	this.uploadStart = function (file) {
		file = this.unescapeFilePostParams(file);
		this.queueEvent("return_upload_start_handler", [file]);
	}

	this.returnUploadStart = function (file) {
		var returnValue;
		if (typeof this.opts.upload_start_handler === "function") {
			file = this.unescapeFilePostParams(file);
			returnValue = this.opts.upload_start_handler.call(this, file);
		} else if (this.opts.upload_start_handler != undefined) {
			throw "upload_start_handler must be a function";
		}

		// Convert undefined to true so if nothing is returned from the upload_start_handler it is
		// interpretted as 'true'.
		if (returnValue === undefined) {
			returnValue = true;
		}
		
		returnValue = !!returnValue;
		
		this.callFlash("ReturnUploadStart", [returnValue]);
	}



	this.uploadProgress = function (file, bytesComplete, bytesTotal) {
	
		file = this.unescapeFilePostParams(file);
		this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
	}

	this.uploadError = function (file, errorCode, message) {
		file = this.unescapeFilePostParams(file);
		this.queueEvent("upload_error_handler", [file, errorCode, message]);
	}

	this.uploadSuccess = function (file, serverData, responseReceived) {
		file = this.unescapeFilePostParams(file);
		this.queueEvent("upload_success_handler", [file, serverData, responseReceived]);
	}

	this.uploadComplete = function (file) {
		file = this.unescapeFilePostParams(file);
		this.queueEvent("upload_complete_handler", [file]);
	}
	//private method
	this.completeURL=function(url) {
		if (typeof(url) !== "string" || url.match(/^https?:\/\//i) || url.match(/^\//)) {
			return url;
		}
		
		var indexSlash = window.location.pathname.lastIndexOf("/");
		if (indexSlash <= 0) {
			path = "/";
		} else {
			path = window.location.pathname.substr(0, indexSlash) + "/";
		}
		
		return path + url;
		
	}
	this.unescapeFilePostParams=function(file){
		var reg = /[$]([0-9a-f]{4})/i;
		var unescapedPost = {};
		var uk;

		if (file != undefined) {
			for (var k in file.post) {
				if (file.post.hasOwnProperty(k)) {
					uk = k;
					var match;
					while ((match = reg.exec(uk)) !== null) {
						uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
					}
					unescapedPost[uk] = file.post[k];
				}
			}

			file.post = unescapedPost;
		}

		return file;
	}
	this.CallFlash=function(functionName, argumentArray){

		argumentArray = argumentArray || [];
		var movieElement = this.getMovieElement();
		var returnValue, returnString;

		// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
		try {
			returnString = 
			movieElement.CallFunction(
				'<invoke name="' + functionName + '" returntype="javascript">' +
					__flash__argumentsToXML(argumentArray, 0) +
				'</invoke>'
			);
			returnValue = eval(returnString);
		} catch (ex) {
			throw "Call to " + functionName + " failed";
		}
		
		// Unescape file post param values
		if (returnValue != undefined && typeof returnValue.post === "object") {
			returnValue = this.unescapeFilePostParams(returnValue);
		}

		return returnValue;
	}
	this.getMovieElement=function(){
		var movieElement = document.getElementById(this.opts.swfupload_movie_element);
		if (movieElement === null) {
			throw "Could not find Flash element";
		}
		
		return movieElement;
	}
	this.queueEvent=function(handlerName, argumentArray) {

		// Warning: Don't call this.debug inside here or you'll create an infinite loop
		
		if (argumentArray == undefined) {
			argumentArray = [];
		} else if (!(argumentArray instanceof Array)) {
			argumentArray = [argumentArray];
		}
		
		var self = this;
		if (typeof this.opts[handlerName] === "function") {
			// Queue the event
			this.opts.eventQueue.push(function () {
				this.opts[handlerName].apply(this, argumentArray);
			});
			
			// Execute the next queued event
			setTimeout(function () {
				self.executeNextEvent.call(self);
			}, 0);
			
		} else if (this.opts[handlerName] !== null) {
			throw "Event handler " + handlerName + " is unknown or is not a function";
		}
	}
	this.executeNextEvent=function() {

		// Warning: Don't call this.debug inside here or you'll create an infinite loop
		var  f = this.opts.eventQueue ? this.opts.eventQueue.shift() : null;
		if (typeof(f) === "function") {
			f.apply(this);
		}
	}
	this.loadFlash=function() {

		var targetElement, tempParent;

		// Make sure an element with the ID we are going to use doesn't already exist
		if (document.getElementById(this.opts.swfupload_movie_element) !== null) {
			throw "ID " + this.opts.swfupload_movie_element + " is already in use. The Flash Object could not be added";
		}

		// Get the element where we will be placing the flash movie
		targetElement = document.getElementById(this.opts.swfupload_files_picker_button);

		if (targetElement == undefined) {
			throw "Could not find the placeholder element: " + this.opts.swfupload_files_picker_button;
		}

		// Append the container and load the flash
		tempParent = document.createElement("div");
		tempParent.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
		targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

		// Fix IE Flash/Form bug
		if (window[this.opts.swfupload_movie_element] == undefined) {
			window[this.opts.swfupload_movie_element] = this.getMovieElement();
		}
		
	}
	// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
	this.getFlashHTML=function(){
		// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
		return [
			'<object id="', this.opts.swfupload_movie_element,'" type="application/x-shockwave-flash" data="', 
			this.opts.flash_url, '" width="', 
			this.opts.button_width,
			'" height="',
			this.opts.button_height,
			'" class="swfupload">',
			'<param name="wmode" value="', this.opts.button_window_mode, '" />',
			'<param name="movie" value="', this.opts.flash_url, '" />',
			'<param name="quality" value="high" />',
			'<param name="menu" value="false" />',
			'<param name="allowScriptAccess" value="always" />',
			'<param name="flashvars" value="' + this.getFlashVars() + '" />',
			'</object>'
		].join("");
	}
	// Private: getFlashVars builds the parameter string that will be passed
	// to flash in the flashvars param.
	this.getFlashVars=function() {
		
		// Build a string from the post param object
		var paramString = this.buildParamString();
		var httpSuccessString = this.opts.http_success.join(",");
		
		// Build the parameter string
		return ["movieName=", encodeURIComponent(this.opts.for_flash_object),
				"&amp;uploadURL=", encodeURIComponent(this.opts.upload_url),
				"&amp;useQueryString=", encodeURIComponent(this.opts.use_query_string),
				"&amp;requeueOnError=", encodeURIComponent(this.opts.requeue_on_error),
				"&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
				"&amp;assumeSuccessTimeout=", encodeURIComponent(this.opts.assume_success_timeout),
				"&amp;params=", encodeURIComponent(paramString),
				"&amp;filePostName=", encodeURIComponent(this.opts.file_post_name),
				"&amp;fileTypes=", encodeURIComponent(this.opts.file_types),
				"&amp;fileTypesDescription=", encodeURIComponent(this.opts.file_types_description),
				"&amp;fileSizeLimit=", encodeURIComponent(this.opts.file_size_limit),
				"&amp;fileUploadLimit=", encodeURIComponent(this.opts.file_upload_limit),
				"&amp;fileQueueLimit=", encodeURIComponent(this.opts.file_queue_limit),
				"&amp;debugEnabled=", encodeURIComponent(this.opts.debug_enabled),
				"&amp;buttonImageURL=", encodeURIComponent(this.opts.button_image_url),
				"&amp;buttonWidth=", encodeURIComponent(this.opts.button_width),
				"&amp;buttonHeight=", encodeURIComponent(this.opts.button_height),
				"&amp;buttonText=", encodeURIComponent(this.opts.button_text),
				"&amp;buttonTextTopPadding=", encodeURIComponent(this.opts.button_text_top_padding),
				"&amp;buttonTextLeftPadding=", encodeURIComponent(this.opts.button_text_left_padding),
				"&amp;buttonTextStyle=", encodeURIComponent(this.opts.button_text_style),
				"&amp;buttonAction=", encodeURIComponent(this.opts.button_action),
				"&amp;buttonDisabled=", encodeURIComponent(this.opts.button_disabled),
				"&amp;buttonCursor=", encodeURIComponent(this.opts.button_cursor)
			].join("");
	}
	this.getStats=function(){
		return this.CallFlash("GetStats");
	}
	

	this.setStats = function (statsObject) {
		this.callFlash("SetStats", [statsObject]);
	}

	this.getFile = function (fileID) {
		if (typeof(fileID) === "number") {
			return this.callFlash("GetFileByIndex", [fileID]);
		} else {
			return this.callFlash("GetFile", [fileID]);
		}
	}


	this.addFileParam = function (fileID, name, value) {
		return this.callFlash("AddFileParam", [fileID, name, value]);
	}


	this.removeFileParam = function (fileID, name) {
		this.callFlash("RemoveFileParam", [fileID, name]);
	}

	this.setUploadURL = function (url) {
		this.opts.upload_url = url.toString();
		this.callFlash("SetUploadURL", [url]);
	}

	this.setPostParams = function (paramsObject) {
		this.opts.post_params = paramsObject;
		this.callFlash("SetPostParams", [paramsObject]);
	}

	this.addPostParam = function (name, value) {
		this.opts.post_params[name] = value;
		this.callFlash("SetPostParams", [this.opts.post_params]);
	}

	this.removePostParam = function (name) {
		delete this.opts.post_params[name];
		this.callFlash("SetPostParams", [this.opts.post_params]);
	}

	this.setFileTypes = function (types, description) {
		this.opts.file_types = types;
		this.opts.file_types_description = description;
		this.callFlash("SetFileTypes", [types, description]);
	}

	this.setFileSizeLimit = function (fileSizeLimit) {
		this.opts.file_size_limit = fileSizeLimit;
		this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
	}


	this.opts.setFileUploadLimit = function (fileUploadLimit) {
		this.opts.file_upload_limit = fileUploadLimit;
		this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
	}

	// Public: setFileQueueLimit changes the file_queue_limit setting
	this.setFileQueueLimit = function (fileQueueLimit) {
		this.opts.file_queue_limit = fileQueueLimit;
		this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
	}
	// Public: setFilePostName changes the file_post_name setting
	this.setFilePostName = function (filePostName) {
		this.opts.file_post_name = filePostName;
		this.callFlash("SetFilePostName", [filePostName]);
	}

	// Public: setUseQueryString changes the use_query_string setting
	this.setUseQueryString = function (useQueryString) {
		this.opts.use_query_string = useQueryString;
		this.callFlash("SetUseQueryString", [useQueryString]);
	}

	// Public: setRequeueOnError changes the requeue_on_error setting
	this.setRequeueOnError = function (requeueOnError) {
		this.opts.requeue_on_error = requeueOnError;
		this.callFlash("SetRequeueOnError", [requeueOnError]);
	}

	// Public: setHTTPSuccess changes the http_success setting
	this.setHTTPSuccess = function (http_status_codes) {
		if (typeof http_status_codes === "string") {
			http_status_codes = http_status_codes.replace(" ", "").split(",");
		}
		
		this.opts.http_success = http_status_codes;
		this.callFlash("SetHTTPSuccess", [http_status_codes]);
	}

	// Public: setHTTPSuccess changes the http_success setting
	this.setAssumeSuccessTimeout = function (timeout_seconds) {
		this.opts.assume_success_timeout = timeout_seconds;
		this.callFlash("SetAssumeSuccessTimeout", [timeout_seconds]);
	}


	// Public: setButtonImageURL loads a button image sprite
	this.setButtonImageURL = function (buttonImageURL) {
		if (buttonImageURL == undefined) {
			buttonImageURL = "";
		}
		
		this.opts.button_image_url = buttonImageURL;
		this.callFlash("SetButtonImageURL", [buttonImageURL]);
	}

	// Public: setButtonDimensions resizes the Flash Movie and button
	this.setButtonDimensions = function (width, height) {
		this.opts.button_width = width;
		this.opts.button_height = height;
		
		var movie = this.getMovieElement();
		if (movie != undefined) {
			movie.style.width = width + "px";
			movie.style.height = height + "px";
		}
		
		this.callFlash("SetButtonDimensions", [width, height]);
	}
	// Public: setButtonText Changes the text overlaid on the button
	this.setButtonText = function (html) {
		this.opts.button_text = html;
		this.callFlash("SetButtonText", [html]);
	}
	// Public: setButtonTextPadding changes the top and left padding of the text overlay
	this.setButtonTextPadding = function (left, top) {
		this.opts.button_text_top_padding = top;
		this.opts.button_text_left_padding = left;
		this.callFlash("SetButtonTextPadding", [left, top]);
	}

	// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
	this.setButtonTextStyle = function (css) {
		this.opts.button_text_style = css;
		this.callFlash("SetButtonTextStyle", [css]);
	}
	// Public: setButtonDisabled disables/enables the button
	this.setButtonDisabled = function (isDisabled) {
		this.opts.button_disabled = isDisabled;
		this.callFlash("SetButtonDisabled", [isDisabled]);
	}
	// Public: setButtonAction sets the action that occurs when the button is clicked
	this.setButtonAction = function (buttonAction) {
		this.opts.button_action = buttonAction;
		this.callFlash("SetButtonAction", [buttonAction]);
	}
	// Public: setButtonCursor changes the mouse cursor displayed when hovering over the button
	this.setButtonCursor = function (cursor) {
		this.opts.button_cursor = cursor;
		this.callFlash("SetButtonCursor", [cursor]);
	}
	// Private: buildParamString takes the name/value pairs in the post_params setting object
	// and joins them up in to a string formatted "name=value&amp;name=value"
	this.buildParamString=function(){
		var postParams = this.opts.post_params; 
		var paramStringPairs = [];

		if (typeof(postParams) === "object") {
			for (var name in postParams) {
				if (postParams.hasOwnProperty(name)) {
					paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
				}
			}
		}

		return paramStringPairs.join("&amp;");
	}
	

	this.callFlash = function (functionName, argumentArray) {
		argumentArray = argumentArray || [];
		
		var movieElement = this.getMovieElement();
		var returnValue, returnString;

		// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
		try {
			returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
			returnValue = eval(returnString);
		} catch (ex) {
			throw "Call to " + functionName + " failed";
		}
		
		// Unescape file post param values
		if (returnValue != undefined && typeof returnValue.post === "object") {
			returnValue = this.unescapeFilePostParams(returnValue);
		}

		return returnValue;
	}


	this.selectFile = function () {
		this.callFlash("SelectFile");
	}


	this.selectFiles = function () {
		this.callFlash("SelectFiles");
	}
	this.startUpload=function(){
		this.CallFlash("StartUpload");
	}
	this.cancelUpload=function(fileID, triggerErrorEvent){
		if (triggerErrorEvent !== false) {
			triggerErrorEvent = true;
		}
		this.CallFlash("CancelUpload", [fileID, triggerErrorEvent]);
	}
	
	if (!!this.opts.prevent_swf_caching) {
		this.opts.flash_url = this.opts.flash_url + (this.opts.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
	}
	
	if (!this.opts.preserve_relative_urls) {
		//opts.flash_url = completeURL(opts.flash_url);	// Don't need to do this one since flash doesn't look at it
		this.opts.upload_url = this.completeURL(this.opts.upload_url);
		this.opts.button_image_url = this.completeURL(this.opts.button_image_url);
	}
};

(function($){

	$.easy_multiupload_bridge={
		'defaults':{
			'upload_url':'',
			'file_post_name':'Filedata',
			'assume_success_timeout':600,
			'file_types':'*.*',//"*.jpg;*.gif"
			'file_types_description':'圖片檔',
			'file_size_limit':'100 MB',// Default zero means "unlimited"
			'file_upload_limit':100,
			'file_queue_limit':0,
			'button_image_url':(global_ProjectAdminUrl+'js/easy_multiupload_bridge/images/TestImageNoText_65x29.png'),
			'post_params':{},
			'button_width':150,
			'button_height':29,
			'button_text':'<span class="theFont">選擇檔案(可多選)</span>',
			'button_text_style':'.theFont { font-size: 16; }',
			'button_text_top_padding':3,
			'button_text_left_padding':12,
			'button_disabled':false,
			'swfupload_loaded_handler':function(){},
			'file_queued_handler':function(file){
				//當選擇檔案被排入佇列後				
				file = this.unescapeFilePostParams(file);
				try {
	
				} catch (ex) {
					
				}
			},
			'file_queue_error_handler':function (file, errorCode, message) {
				file = this.unescapeFilePostParams(file);
		
				try {
					if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
						alert(
							"You have attempted to queue too many files.\n" + 
							(message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file."))
						);
						return;
					}
					switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
				
							alert("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
						
							alert("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
						
							alert("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
						default:
						
							alert("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
					}
				} catch (ex) {
					
				}
			},
			'file_dialog_complete_handler':function (numFilesSelected, numFilesQueued, numFilesInQueue) {
				//選完檔案 關閉選擇視窗之後 
				try {
					if (numFilesSelected > 0) {
						this.startUpload();
					}
				} catch (ex)  {
					
				}
			
			},
			'queue_complete_handler':function(numFilesUploaded){
				//所有選擇檔案 上傳處理完畢後
			},
			'upload_start_handler':function (file){
				//每個選擇檔案 上傳前
				file = this.unescapeFilePostParams(file);
				this.addFileParam(file.id,'PHPSESSID','{%$session_id%}');
				
				var returnValue=true;
				try {
		
				}
				catch (ex) {}
	
				return returnValue;
			},
			'upload_progress_handler':function (file, bytesComplete, bytesTotal) {
				file = this.unescapeFilePostParams(file);
				try {

				} catch (ex) {
					
				}
			},
			'upload_error_handler':function (file, errorCode, message){
				file = this.unescapeFilePostParams(file);
	
				try {
					
						
					switch (errorCode) {
						case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
							
							alert("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
						
							alert("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.IO_ERROR:
							
							alert("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
						
							alert("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
							
							alert("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
							
							alert("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
							// If there aren't any files left (they were all cancelled) disable the cancel button
							if (this.getStats().files_queued === 0) {
								/*document.getElementById(this.opts.swfupload_files_cancel_button).disabled = true;*/
							}
							alert('FILE_CANCELLED');
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
							alert('UPLOAD_STOPPED');
							break;
						case SWFUpload.UPLOAD_ERROR.CUSTOM_DEFINE:
							alert(message);
							break;
						default:
						
							alert("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
							break;
					}
					
				} catch (ex) {
					
				}
			
			},
			'upload_success_handler':function (file, serverData, responseReceived) {
				//每個選擇檔案 上傳檔案結果成功返回後
				file = this.unescapeFilePostParams(file);
	
				try {	
					serverData = eval(serverData);
					if(serverData[0] != ""){	
						this.opts.upload_error_handler(file,serverData[0],serverData[1]);
					}else{
						
					}
				} catch (ex) {
					
				}
			},
			'upload_complete_handler':function (file){
				//每個選擇檔案 上傳處理完成後
				file = this.unescapeFilePostParams(file);
				
				if (file.filestatus === SWFUpload.FILE_STATUS.COMPLETE) {
					this.opts.queue_upload_count++;
				}

				var stats = this.getStats();
				if (stats.files_queued > 0) {
					this.startUpload();
				}else{
					this.opts.queue_complete_handler.apply(this,[this.opts.queue_upload_count])
					this.opts.queue_upload_count = 0;
				}
				
			}
		}
	};
	
	
	$.fn.easy_multiupload_bridge = function(param1,param2){
		var get_jqobject=this.filter('div[id]');
		if(get_jqobject.length!=1){
			alert('easy_multiupload_bridge一次只能轉換一個,轉換的元素為賦予id的div');
			return;
		}
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_easy_multiupload_bridge')===''){
				alert('請先轉換元素為easy_multiupload_bridge');
				return;
			}
			
		}
		
		//public methods
		var jqobject_scope_methods={
			
		};
		
		
		if(typeof(param1)=='string'){
			
			if(global_typeof(param2)!=='array'){
				
				param2=[];
			}
			if(jqobject_scope_methods[param1]===undefined || typeof(jqobject_scope_methods[param1])!=='function'){
				alert('元件無此操作');
				return;
			}
			
			jqobject_scope_methods[param1].apply(get_jqobject,param2);
			return;
		}
		
		if(typeof(param1)=='undefined'){
			options={};
		}else{
			options=param1;
		}
		var container_id=get_jqobject.attr('id');
		
		var opts = $.extend( true,{}, $.easy_multiupload_bridge.defaults, options );
		
		opts.swfupload_files_picker_button=container_id+'_swfupload_spanButtonPlaceHolder';
		opts.swfupload_movie_element=container_id+'_swfupload_movie_element';
		opts.for_flash_object=container_id+'_for_flash_object';
		
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		window[opts.for_flash_object]=new easy_multiupload_bridge_flashcall(opts);
		SWFUpload.instances[opts.for_flash_object]=window[opts.for_flash_object];
		
		
		
		
		
		
		var tmpString=
		"<span id='"+opts.swfupload_files_picker_button+"' ></span>";

		$("#"+container_id).html(tmpString);


		SWFUpload.instances[opts.for_flash_object].loadFlash();
		
		
		//當檔案清單項目不為空時，刪除鈕設定為可以按
		
		get_jqobject.attr('is_transformed_to_easy_multiupload_bridge','1');	
		return get_jqobject;
	};
}(jQuery));

