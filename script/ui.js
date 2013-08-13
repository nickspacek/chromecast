ca.spacek.chromecast.beluga.UI = (function () {
function UI(element) {
	this.element = $(element).hide();
	
	this.header = $('<h3>')
		.text('Connected to game!')
		.appendTo(this.element);
	
	var self = this;
	this.disconnectButton = $('<button class="disconnect-button btn btn-danger btn-xs" />')
		.text('Disconnect')
		.click(function (e) {
			e.preventDefault();

			self.api.stopActivity(self.activity.activityId, self.onStopResult.bind(self));
			self.disconnectButton.attr('disabled', true);
		})
		.appendTo(this.element);

	this.nameInput = $('<input type="text" class="form-control" />')
		.attr('placeholder', 'Type your name and press enter')
		.appendTo(this.element)
		.on('keyup', function (e) {
			if (e.keyCode == 13) {
				self.gameClient.join(self.nameInput.val());
				self.nameInput.hide();
				self.chat.show();
			}
		});

	this.chat = $('<div class="chat" />')
		.appendTo(this.element)
		.hide();
	
	this.chat = $('.chat').chat().bind('chat.message', function (e, text) {
		self.gameClient.say(text);
	});
}

UI.prototype = {
	initialize: function () {
		this.api = new cast.Api();
		
		this.receivers = $('#receivers').receiverList({
			api: this.api,
			appId: ca.spacek.chromecast.beluga.appId,
			click: this.onReceiverSelected.bind(this)
		});
	},
	
	onReceiverSelected: function (e, receiver) {
		this.doLaunch(receiver);
	},
	
	doLaunch: function(receiver) {
		var request = new cast.LaunchRequest(ca.spacek.chromecast.beluga.appId, receiver);
		this.api.launch(request, this.onLaunch.bind(this));
	},
	
	onStopResult: function (result) {
		if (result.status === 'stopped') {
			this.activity = null;
			this.gameClient = null;
			this.element.hide();
		}
		else {
			// unable to stop
			this.stopButton.removeAttr('disabled');
		}
	},
	
	onLaunch: function(activity) {
		if (activity.status === "running") {
			this.updateCurrentActivity(activity);
		} else if (activity.status === "error") {
			this.activity = null;
		}
	},

	updateCurrentActivity: function(activity) {
		this.activity = activity;
		this.gameClient = new ca.spacek.chromecast.beluga.GameClient(this.activity, this.api);
		this.disconnectButton.removeAttr('disabled');
		this.chat.hide();
		this.nameInput.show();
		this.element.show();

		var self = this;
		this.gameClient.bind('say', function (e, message) {
			var sender = self.gameClient.playerName === message.player ? 'You' : message.player;
			self.chat.chat('add', {
				sender: sender,
				text: message.content,
				timestamp: message.timestamp
			});
		});
	}
};

return UI;
})();
