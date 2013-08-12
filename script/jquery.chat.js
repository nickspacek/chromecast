(function ($) {
function Chat(element) {
	this.element = $(element);
	this._create();
	this._registerEvents();
}

Chat.prototype = {
	_create: function () {
		this.element.addClass('chat panel panel-info');
		this.header = $('<div class="panel-heading" />')
			.appendTo(this.element);
		this.title = $('<h3 class="panel-title" />')
			.text('Chat')
			.appendTo(this.header);
		this.log = $('<ol class="chat-log list-unstyled" />')
			.appendTo(this.element);
		this.input = $('<input type="text" class="chat-input form-control" />')
			.appendTo(this.element);
	},
	_registerEvents: function () {
		var self = this;
		this.input.on('keyup', function (e) {
			if (e.keyCode == 13) {
				self.element.trigger('chat.message', $(this).val());
				$(this).val('');
			}
		});
	},
	add: function (chat) {
		var listItem = $('<li class="chat-message" />')
			.attr('data-timestamp', chat.timestamp);
		$('<span class="chat-message-sender" />')
			.text(chat.sender)
			.appendTo(listItem);
		$('<span class="chat-message-text" />')
			.text(chat.text)
			.appendTo(listItem);
		listItem.appendTo(this.log);
	}
};

$.fn.chat = function () {
	var args = $.makeArray(arguments);
	var methodName = arguments[0];
	var exists = false;
	if (typeof methodName === 'string' && methodName[0] !== '_') {
		exists = typeof Chat.prototype[methodName] === 'function';
		args.shift();
	}
	return this.each(function () {
		var chat = $(this).data('chat');
		if (exists) {
			chat[methodName].apply(chat, args);
		}
		else if (typeof chat === 'undefined') {
			$(this).data('chat', new Chat(this));
		}
	});
};
})(jQuery);
