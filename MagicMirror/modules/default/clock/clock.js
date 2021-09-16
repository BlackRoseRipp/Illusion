/* global SunCalc */

/* Magic Mirror
 * Module: Clock
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("clock", {
	// Module config defaults.
	defaults: {
		displayType: "digital", // options: digital, analog, both

		timeFormat: config.timeFormat,
		displaySeconds: true,
		showPeriod: true,
		showPeriodUpper: false,
		clockBold: false,
		showDate: true,
		showWeek: false,
		dateFormat: "dddd, LL",

		/* specific to the analog clock */
		analogSize: "200px",
		analogFace: "simple", // options: 'none', 'simple', 'face-###' (where ### is 001 to 012 inclusive)
		analogPlacement: "bottom", // options: 'top', 'bottom', 'left', 'right'
		analogShowDate: "top", // options: false, 'top', or 'bottom'
		secondsColor: "#888888",
		timezone: null,

		showSunTimes: false,
		showMoonTimes: false,
		lat: 47.630539,
		lon: -122.344147
	},
	// Define required scripts.
	getScripts: function () {
		return ["moment.js", "moment-timezone.js", "suncalc.js"];
	},
	// Define styles.
	getStyles: function () {
		return ["clock_styles.css"];
	},
	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);

		// Schedule update interval.
		this.second = moment().second();
		this.minute = moment().minute();

		// Calculate how many ms should pass until next update depending on if seconds is displayed or not
		const delayCalculator = (reducedSeconds) => {
			const EXTRA_DELAY = 50; // Deliberate imperceptible delay to prevent off-by-one timekeeping errors

			if (this.config.displaySeconds) {
				return 1000 - moment().milliseconds() + EXTRA_DELAY;
			} else {
				return (60 - reducedSeconds) * 1000 - moment().milliseconds() + EXTRA_DELAY;
			}
		};

		// A recursive timeout function instead of interval to avoid drifting
		const notificationTimer = () => {
			this.updateDom();

			// If seconds is displayed CLOCK_SECOND-notification should be sent (but not when CLOCK_MINUTE-notification is sent)
			if (this.config.displaySeconds) {
				this.second = moment().second();
				if (this.second !== 0) {
					this.sendNotification("CLOCK_SECOND", this.second);
					setTimeout(notificationTimer, delayCalculator(0));
					return;
				}
			}

			// If minute changed or seconds isn't displayed send CLOCK_MINUTE-notification
			this.minute = moment().minute();
			this.sendNotification("CLOCK_MINUTE", this.minute);
			setTimeout(notificationTimer, delayCalculator(0));
		};

		// Set the initial timeout with the amount of seconds elapsed as reducedSeconds so it will trigger when the minute changes
		setTimeout(notificationTimer, delayCalculator(this.second));

		// Set locale.
		moment.locale(config.language);
	},
	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");

		/************************************
		 * Create wrappers for DIGITAL clock
		 */

		const dateWrapper = document.createElement("div");
		const timeWrapper = document.createElement("div");
		const secondsWrapper = document.createElement("sup");
		const periodWrapper = document.createElement("span");
		const sunWrapper = document.createElement("div");
		const moonWrapper = document.createElement("div");
		const weekWrapper = document.createElement("div");
		// Style Wrappers
		dateWrapper.className = "date normal medium";
		timeWrapper.className = "time bright large light";
		secondsWrapper.className = "dimmed";
		sunWrapper.className = "sun dimmed small";
		moonWrapper.className = "moon dimmed small";
		weekWrapper.className = "week dimmed medium";

		// Set content of wrappers.
		// The moment().format("h") method has a bug on the Raspberry Pi.
		// So we need to generate the timestring manually.
		// See issue: https://github.com/MichMich/MagicMirror/issues/181
		let timeString;
		const now = moment();
		if (this.config.timezone) {
			now.tz(this.config.timezone);
		}

		let hourSymbol = "HH";
		if (this.config.timeFormat !== 24) {
			hourSymbol = "h";
		}

		if (this.config.clockBold === true) {
			timeString = now.format(hourSymbol + '[<span class="bold">]mm[</span>]');
		} else {
			timeString = now.format(hourSymbol + ":mm");
		}

		if (this.config.showDate) {
			dateWrapper.innerHTML = now.format(this.config.dateFormat);
		}
		if (this.config.showWeek) {
			weekWrapper.innerHTML = this.translate("WEEK", { weekNumber: now.week() });
		}
		timeWrapper.innerHTML = timeString;
		secondsWrapper.innerHTML = now.format("ss");
		if (this.config.showPeriodUpper) {
			periodWrapper.innerHTML = now.format("A");
		} else {
			periodWrapper.innerHTML = now.format("a");
		}
		if (this.config.displaySeconds) {
			timeWrapper.appendChild(secondsWrapper);
		}
		if (this.config.showPeriod && this.config.timeFormat !== 24) {
			timeWrapper.appendChild(periodWrapper);
		}

		/**
		 * Format the time according to the config
		 *
		 * @param {object} config The config of the module
		 * @param {object} time time to format
		 * @returns {string} The formatted time string
		 */
		function formatTime(config, time) {
			let formatString = hourSymbol + ":mm";
			if (config.showPeriod && config.timeFormat !== 24) {
				formatString += config.showPeriodUpper ? "A" : "a";
			}
			return moment(time).format(formatString);
		}

		if (this.config.showSunTimes) {
			const sunTimes = SunCalc.getTimes(now, this.config.lat, this.config.lon);
			const isVisible = now.isBetween(sunTimes.sunrise, sunTimes.sunset);
			let nextEvent;
			if (now.isBefore(sunTimes.sunrise)) {
				nextEvent = sunTimes.sunrise;
			} else if (now.isBefore(sunTimes.sunset)) {
				nextEvent = sunTimes.sunset;
			} else {
				const tomorrowSunTimes = SunCalc.getTimes(now.clone().add(1, "day"), this.config.lat, this.config.lon);
				nextEvent = tomorrowSunTimes.sunrise;
			}
			const untilNextEvent = moment.duration(moment(nextEvent).diff(now));
			const untilNextEventString = untilNextEvent.hours() + "h " + untilNextEvent.minutes() + "m";
			sunWrapper.innerHTML =
				'<span class="' +
				(isVisible ? "bright" : "") +
				'"><i class="fa fa-sun-o" aria-hidden="true"></i> ' +
				untilNextEventString +
				"</span>" +
				'<span><i class="fa fa-arrow-up" aria-hidden="true"></i> ' +
				formatTime(this.config, sunTimes.sunrise) +
				"</span>" +
				'<span><i class="fa fa-arrow-down" aria-hidden="true"></i> ' +
				formatTime(this.config, sunTimes.sunset) +
				"</span>";
		}
		if (this.config.showMoonTimes) {
			const moonIllumination = SunCalc.getMoonIllumination(now.toDate());
			const moonTimes = SunCalc.getMoonTimes(now, this.config.lat, this.config.lon);
			const moonRise = moonTimes.rise;
			let moonSet;
			if (moment(moonTimes.set).isAfter(moonTimes.rise)) {
				moonSet = moonTimes.set;
			} else {
				const nextMoonTimes = SunCalc.getMoonTimes(now.clone().add(1, "day"), this.config.lat, this.config.lon);
				moonSet = nextMoonTimes.set;
			}
			const isVisible = now.isBetween(moonRise, moonSet) || moonTimes.alwaysUp === true;
			const illuminatedFractionString = Math.round(moonIllumination.fraction * 100) + "%";
			moonWrapper.innerHTML =
				'<span class="' +
				(isVisible ? "bright" : "") +
				'"><i class="fa fa-moon-o" aria-hidden="true"></i> ' +
				illuminatedFractionString +
				"</span>" +
				'<span><i class="fa fa-arrow-up" aria-hidden="true"></i> ' +
				(moonRise ? formatTime(this.config, moonRise) : "...") +
				"</span>" +
				'<span><i class="fa fa-arrow-down" aria-hidden="true"></i> ' +
				(moonSet ? formatTime(this.config, moonSet) : "...") +
				"</span>";
		}

		/****************************************************************
		 * Create wrappers for ANALOG clock, only if specified in config
		 */
		const clockCircle = document.createElement("div");

		if (this.config.displayType !== "digital") {
			// If it isn't 'digital', then an 'analog' clock was also requested

			// Calculate the degree offset for each hand of the clock
			if (this.config.timezone) {
				now.tz(this.config.timezone);
			}
			const second = now.seconds() * 6,
				minute = now.minute() * 6 + second / 60,
				hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

			// Create wrappers
			clockCircle.className = "clockCircle";
			clockCircle.style.width = this.config.analogSize;
			clockCircle.style.height = this.config.analogSize;

			if (this.config.analogFace !== "" && this.config.analogFace !== "simple" && this.config.analogFace !== "none") {
				clockCircle.style.background = "url(" + this.data.path + "faces/" + this.config.analogFace + ".svg)";
				clockCircle.style.backgroundSize = "100%";

				// The following line solves issue: https://github.com/MichMich/MagicMirror/issues/611
				// clockCircle.style.border = "1px solid black";
				clockCircle.style.border = "rgba(0, 0, 0, 0.1)"; //Updated fix for Issue 611 where non-black backgrounds are used
			} else if (this.config.analogFace !== "none") {
				clockCircle.style.border = "2px solid white";
			}
			const clockFace = document.createElement("div");
			clockFace.className = "clockFace";

			const clockHour = document.createElement("div");
			clockHour.id = "clockHour";
			clockHour.style.transform = "rotate(" + hour + "deg)";
			clockHour.className = "clockHour";
			const clockMinute = document.createElement("div");
			clockMinute.id = "clockMinute";
			clockMinute.style.transform = "rotate(" + minute + "deg)";
			clockMinute.className = "clockMinute";

			// Combine analog wrappers
			clockFace.appendChild(clockHour);
			clockFace.appendChild(clockMinute);

			if (this.config.displaySeconds) {
				const clockSecond = document.createElement("div");
				clockSecond.id = "clockSecond";
				clockSecond.style.transform = "rotate(" + second + "deg)";
				clockSecond.className = "clockSecond";
				clockSecond.style.backgroundColor = this.config.secondsColor;
				clockFace.appendChild(clockSecond);
			}
			clockCircle.appendChild(clockFace);
		}

		/*******************************************
		 * Combine wrappers, check for .displayType
		 */

		if (this.config.displayType === "digital") {
			// Display only a digital clock
			wrapper.appendChild(dateWrapper);
			wrapper.appendChild(timeWrapper);
			wrapper.appendChild(sunWrapper);
			wrapper.appendChild(moonWrapper);
			wrapper.appendChild(weekWrapper);
		} else if (this.config.displayType === "analog") {
			// Display only an analog clock

			if (this.config.showWeek) {
				weekWrapper.style.paddingBottom = "15px";
			} else {
				dateWrapper.style.paddingBottom = "15px";
			}

			if (this.config.analogShowDate === "top") {
				wrapper.appendChild(dateWrapper);
				wrapper.appendChild(weekWrapper);
				wrapper.appendChild(clockCircle);
			} else if (this.config.analogShowDate === "bottom") {
				wrapper.appendChild(clockCircle);
				wrapper.appendChild(dateWrapper);
				wrapper.appendChild(weekWrapper);
			} else {
				wrapper.appendChild(clockCircle);
			}
		} else {
			// Both clocks have been configured, check position
			const placement = this.config.analogPlacement;

			const analogWrapper = document.createElement("div");
			analogWrapper.id = "analog";
			analogWrapper.style.cssFloat = "none";
			analogWrapper.appendChild(clockCircle);

			const digitalWrapper = document.createElement("div");
			digitalWrapper.id = "digital";
			digitalWrapper.style.cssFloat = "none";
			digitalWrapper.appendChild(dateWrapper);
			digitalWrapper.appendChild(timeWrapper);
			digitalWrapper.appendChild(sunWrapper);
			digitalWrapper.appendChild(moonWrapper);
			digitalWrapper.appendChild(weekWrapper);

			const appendClocks = (condition, pos1, pos2) => {
				const padding = [0, 0, 0, 0];
				padding[placement === condition ? pos1 : pos2] = "20px";
				analogWrapper.style.padding = padding.join(" ");
				if (placement === condition) {
					wrapper.appendChild(analogWrapper);
					wrapper.appendChild(digitalWrapper);
				} else {
					wrapper.appendChild(digitalWrapper);
					wrapper.appendChild(analogWrapper);
				}
			};

			if (placement === "left" || placement === "right") {
				digitalWrapper.style.display = "inline-block";
				digitalWrapper.style.verticalAlign = "top";
				analogWrapper.style.display = "inline-block";

				appendClocks("left", 1, 3);
			} else {
				digitalWrapper.style.textAlign = "center";

				appendClocks("top", 2, 0);
			}
		}

		// Return the wrapper to the dom.
		return wrapper;
	}
});
