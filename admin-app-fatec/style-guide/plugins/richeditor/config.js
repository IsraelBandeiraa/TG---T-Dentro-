/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
	config.toolbarGroups = [

	'/',

	{
		name: 'clipboard',
		groups: ['clipboard', 'undo']
	}, {
		name: 'editing',
		groups: ['find', 'selection', 'spellchecker', 'editing']
	}, {
		name: 'basicstyles',
		groups: ['basicstyles', 'cleanup']
	}, {
		name: 'forms',
		groups: ['forms']
	}, {
		name: 'paragraph',
		groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
	}, {
		name: 'colors',
		groups: ['colors']
	}, {
		name: 'links',
		groups: ['links']
	}, {
		name: 'insert',
		groups: ['insert']
	}, {
		name: 'table',
		groups: ['table']
	}, {
		name: 'fluigimage',
		groups: ['fluigimage']
	}, {
		name: 'styles',
		groups: ['styles']
	}, {
		name: 'tools',
		groups: ['tools']
	}, {
		name: 'others',
		groups: ['others']
	}, {
		name: 'about',
		groups: ['about']
	}, {
		name: 'document',
		groups: ['mode', 'document', 'doctools']
	}, {
		name: 'fluigvideo',
		groups: ['fluigvideo']
	}];

	config.removeButtons = 'oembed,Image,Flash,Smiley,SpecialChar,Save,Styles,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,BidiLtr,BidiRtl,Language,HorizontalRule,PageBreak,Iframe,ShowBlocks,Maximize,About,CreateDiv,Anchor';
	config.extraAllowedContent = 'video [*]{*}(*);source [*]{*}(*);';
	config.basicEntities = false;
};
