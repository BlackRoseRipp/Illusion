/* global NotificationFx */

/* Magic Mirror
 * Module: alert
 *
 * By Paul-Vincent Roll https://paulvincentroll.com/
 * MIT Licensed.
 */
Module.register("alert", {
	defaults: {
		// scale|slide|genie|jelly|flip|bouncyflip|exploader
		effect: "slide",
		// scale|slide|genie|jelly|flip|bouncyflip|exploader
		alert_effect: "jelly",
		//time a notification is displayed in seconds
		display_time: 3500,
		//Position
		position: "center",
		//shown at startup
		welcome_message: false
	},
	getScripts: function () {
		return ["notificationFx.js"];
	},
	getStyles: function () {
		return ["notificationFx.css", "font-awesome.css"];
	},
	// Define required translations.
	getTranslations: function () {
		return {
			en: "translations/en.json",
			de: "translations/de.json",
			nl: "translations/nl.json"
		};
	},
	show_notification: function (message) {
		if (this.config.effect === "slide") {
			this.config.effect = this.config.effect + "-" + this.config.position;
		}
		let msg = "";
		if (message.title) {
			msg += "<span class='thin dimmed medium'>" + message.title + "</span>";
		}
		if (message.message) {
			if (msg !== "") {
				msg += "<br />";
			}
			msg += "<span class='light bright small'>" + message.message + "</span>";
		}

		new NotificationFx({
			message: msg,
			layout: "growl",
			effect: this.config.effect,
			ttl: message.timer !== undefined ? message.timer : this.config.display_time
		}).show();
	},
	show_alert: function (params, sender) {
		let image = "";
		//Set standard params if not provided by module
		if (typeof params.timer === "undefined") {
			params.timer = null;
		}
		if (typeof params.imageHeight === "undefined") {
			params.imageHeight = "80px";
		}
		if (typeof params.imageUrl === "undefined" && typeof params.imageFA === "undefined") {
			params.imageUrl = null;
		} else if (typeof params.imageFA === "undefined") {
			image = "<img src='" + params.imageUrl.toString() + "' height='" + params.imageHeight.toString() + "' style='margin-bottom: 10px;'/><br />";
		} else if (typeof params.imageUrl === "undefined") {
			image = "<span class='bright " + "fa fa-" + params.imageFA + "' style='margin-bottom: 10px;font-size:" + params.imageHeight.toString() + ";'/></span><br />";
		}
		//Create overlay
		const overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.innerHTML += '<div class="black_overlay"></div>';
		document.body.insertBefore(overlay, document.body.firstChild);

		//If module already has an open alert close it
		if (this.alerts[sender.name]) {
			this.hide_alert(sender, false);
		}

		//Display title and message only if they are provided in notification parameters
		let message = "";
		if (params.title) {
			message += "<span class='light dimmed medium'>" + params.title + "</span>";
		}
		if (params.message) {
			if (message !== "") {
				message += "<br />";
			}

			message += "<span class='thin bright small'>" + params.message + "</span>";
		}

		//Store alert in this.alerts
		this.alerts[sender.name] = new NotificationFx({
			message: image + message,
			effect: this.config.alert_effect,
			ttl: params.timer,
			onClose: () => this.hide_alert(sender),
			al_no: "ns-alert"
		});

		//Show alert
		this.alerts[sender.name].show();

		//Add timer to dismiss alert and overlay
		if (params.timer) {
			setTimeout(() => {
				this.hide_alert(sender);
			}, params.timer);
		}
	},
	hide_alert: function (sender, close = true) {
		//Dismiss alert and remove from this.alerts
		if (this.alerts[sender.name]) {
			this.alerts[sender.name].dismiss(close);
			this.alerts[sender.name] = null;
			//Remove overlay
			const overlay = document.getElementById("overlay");
			overlay.parentNode.removeChild(overlay);
		}
	},
	setPosition: function (pos) {
		//Add css to body depending on the set position for notifications
		const sheet = document.createElement("style");
		if (pos === "center") {
			sheet.innerHTML = ".ns-box {margin-left: auto; margin-right: auto;text-align: center;}";
		}
		if (pos === "right") {
			sheet.innerHTML = ".ns-box {margin-left: auto;text-align: right;}";
		}
		if (pos === "left") {
			sheet.innerHTML = ".ns-box {margin-right: auto;text-align: left;}";
		}
		document.body.appendChild(sheet);
	},
	notificationReceived: function (notification, payload, sender) {
		if (notification === "SHOW_ALERT") {
			if (typeof payload.type === "undefined") {
				payload.type = "alert";
			}
			if (payload.type === "alert") {
				this.show_alert(payload, sender);
			} else if (payload.type === "notification") {
				this.show_notification(payload);
			}
		} else if (notification === "HIDE_ALERT") {
			this.hide_alert(sender);
		}
	},
	start: function () {
		this.alerts = {};
		this.setPosition(this.config.position);
		if (this.config.welcome_message) {
			if (this.config.welcome_message === true) {
				this.show_notification({ title: this.translate("sysTitle"), message: this.translate("welcome") });
			} else {
				this.show_notification({ title: this.translate("sysTitle"), message: this.config.welcome_message });
			}
		}
		Log.info("Starting module: " + this.name);
	}
});
