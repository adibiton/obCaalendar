var demo = demo || {};
demo.app = demo.app || {};

demo.app.Template = (function(){
'use strict';

	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'`': '&#x60;'
	};

	var escapeHtmlChar = function (chr) {
		return htmlEscapes[chr];
	};

	var reUnescapedHtml = /[&<>"'`]/g,
	    reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

	var escape = function (string) {
		return (string && reHasUnescapedHtml.test(string))
			? string.replace(reUnescapedHtml, escapeHtmlChar)
			: string;
	};

	/**
	 * Sets up defaults for all the Template methods such as a default template
	 *
	 * @constructor
	 */
	// function Template() {
	// 	this.defaultTemplate
	// 	=	'<li data-id="{{id}}" class="{{completed}}">'
	// 	+		'<div class="view">'
	// 	+			'<input class="toggle" type="checkbox" {{checked}}>'
	// 	+			'<label>{{title}}</label>'
	// 	+			'<button class="destroy"></button>'
	// 	+		'</div>'
	// 	+	'</li>';
	// }

	function Template() {
		this.defaultTemplate
		=	'<div class="event" style="{{style}}">'
		+		'<span class="eventTitle">{{title}}</span>'
		+		'<span class="eventLocation">{{location}}</span>'
		+	'</div>';
	}
	
	/**
	 * Creates an <li> HTML string and returns it for placement in your app.
	 *
	 * NOTE: In real life you should be using a templating engine such as Mustache
	 * or Handlebars, however, this is a vanilla JS example.
	 *
	 * @param {object} data The object containing keys you want to find in the
	 *                      template to replace.
	 * @returns {string} HTML String of an <li> element
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 */
	Template.prototype.show = function (aEvents) {
		var i, l;
		var view = '';
		var styleContent = '';
		for (i = 0, l = aEvents.length; i < l; i++) {
			styleContent = '';
			var template = this.defaultTemplate;
			for(var attribute in aEvents[i]){
				if (aEvents[i].hasOwnProperty(attribute)) {
					if(attribute === 'width' || attribute === 'top' || attribute === 'left' || attribute === 'height')
    				styleContent += attribute + ":" + aEvents[i][attribute] + "px;";
				}
			}
			template = template.replace('{{style}}', styleContent);
			template = template.replace('{{title}}', escape(aEvents[i].title));
			template = template.replace('{{location}}', aEvents[i].location);
			
			view = view + template;
		}

		return view;
	};

	/**
	 * Displays a counter of how many to dos are left to complete
	 *
	 * @param {number} activeTodos The number of active todos.
	 * @returns {string} String containing the count
	 */
	// Template.prototype.itemCounter = function (activeTodos) {
	// 	var plural = activeTodos === 1 ? '' : 's';

	// 	return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
	// };

	/**
	 * Updates the text within the "Clear completed" button
	 *
	 * @param  {[type]} completedTodos The number of completed todos.
	 * @returns {string} String containing the count
	 */
	// Template.prototype.clearCompletedButton = function (completedTodos) {
	// 	if (completedTodos > 0) {
	// 		return 'Clear completed';
	// 	} else {
	// 		return '';
	// 	}
	// };
	
	return Template; 	
}());
