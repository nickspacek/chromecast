ca.spacek.chromecast.beluga.GameClient = (function () {
function GameClient(activity, api) {
	this.activity = activity;
	this.api = api;
	api.addMessageListener(activity.activityId, ca.spacek.chromecast.beluga.namespace, this.onMessage.bind(this));
	this.joined = false;
	this.playerName;
}

GameClient.prototype = {
	onMessage: function (message) {
		if (message.event === 'say') {
			this.onSayEvent(message);
		}
	},
	bind: function (event, handler) {
		$(window).bind('gc.' + event, handler);
	},
	onSayEvent: function (message) {
		$(window).trigger('gc.say', message);
	},
	join: function (name, callback) {
		if (!name) {
			throw 'Must provide a name';
		}
		if (this.joined) {
			throw 'Already in the game!';
		}
		this.playerName = name;
		this.sendMessage('join', { name: name }, callback);
	},
	leave: function (callback) {
		this.sendMessage('leave', callback);
	},
	say: function (text) {
		this.sendMessage('say', { content: text });
	},
	
	sendMessage: function (command, attrs, callback) {
		this.api.sendMessage(this.activity.activityId, ca.spacek.chromecast.beluga.namespace,
			$.extend({ command: command }, attrs), callback);
	}
};

return GameClient;
})();
