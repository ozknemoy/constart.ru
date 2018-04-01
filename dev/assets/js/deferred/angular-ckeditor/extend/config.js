/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		//{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		//{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'styles', groups: [ 'formatting' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		//{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] }, pure html
		{ name: 'others', groups: [ 'others' ] },
		//'/',
		{ name: 'basicstyles', groups: [ 'basicstyles' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] }
	];
	config.extraPlugins = 'justify,filetools,uploadimage,uploadwidget,youtube';
	config.uploadUrl = 'http://beta.constart.ru:81/file/upload-gallery';
	config.imageUploadUrl = 'http://beta.constart.ru:81/file/upload-gallery';
	config.removeButtons = 'Table,Links,Underline,Subscript,Superscript,Cut,Copy,Paste,Anchor,SpecialChar,Styles,About';
	config.removeDialogTabs = 'link:advanced,image:advanced';//;
};
/*CKEDITOR.editorConfig = function( config ) {
	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
};*/
