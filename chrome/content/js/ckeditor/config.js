/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.config.toolbar_Basic2 = [ [ 'Source', '-', 'Bold', 'Italic','Underline','Strike','RemoveFormat' ],
['FontSize'],
['Link','Unlink','Anchor','-','NumberedList','BulletedList'],
['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
['Image','SpecialChar'],
['Cut','Copy','Paste','PasteText','PasteFromWord','-','SpellChecker', 'Scayt'] 

];

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	
	config.defaultLanguage = 'es';
	config.language = 'es';
	config.scayt_sLang = 'es_ES';
	config.toolbarStartupExpanded = false;
	config.toolbar = 'Basic2';
	config.disableNativeSpellChecker = true;
	config.scayt_autoStartup = false;
	
};
