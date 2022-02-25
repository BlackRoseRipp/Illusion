/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/getting-started/configuration.html#general
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 12,
	units: "imperial",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [
		{
			module: "alert",
			classes: "everyone"
		},
		{
			module: "updatenotification",
			position: "top_bar",
			classes: "everyone"
		},
		{
			module: "clock",
			position: "top_left",
			classes: "everyone"
		},
		{
			module: "calendar",
			header: "US Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"					}
				]
			},
			classes: "everyone"
		},
        /*{
            module: "MMM-NJTransit",
            position: "top_left",
            header: "Bus Schedule",
            config: {
                colored: true,
                stops: [{
                        id: "26229",
                        label: "Port Authority to HOB Terminal",
                        color: "cyan",
                        routes: ["126"]
                    },
                    {
                        id: "20496",
                        label: "HOB Terminal to Port Authority",
                        color: "yellow",
                        routes: ["126"]
                    }
                ]
            },
			classes: 'academic'
        },
		
		{
			module: "compliments",
			position: "lower_third"
		},
		*/
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				location: "New York",
				locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "4a35c4b443fa2594bc852d57ba8b59c0"
			},
			classes: "everyone"
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "New York",
				locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "4a35c4b443fa2594bc852d57ba8b59c0"
			},
			classes: "everyone"
		},
		{
			module: "MMM-Canvas",
			position: "bottom_left",
			config: {
			  accessKey: "canvaskey",
			  colors: ["white", "white", "white", "white", "white", "white", "white", "white", ],
			  courses: ["52758", "50134", "55070", "51498", "52284", "52523", "52802", "49761",],
			  urlbase: "sit.instructure.com/",
			  assignMaxLen: 35,
			  assignToDisplay: 10,
			},
			classes: 'Student'
		},
		{
			module: "MMM-NowPlayingOnSpotify",
			position: "bottom_right",
		  
			config: {
			  clientID: "2773a1fd3e4d4487b01ac11733a37bf9",
			  clientSecret: "key1",
			  accessToken: "key2",
			  refreshToken: "key3"
			},
			classes: 'Student'
		},
		
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			},
			classes: 'Student'
		},
		/*
		{
			module: 'MMM-ModuleScheduler',
			config: {
				
				global_schedule: [
					{from: '0 6 * * *', to: '59 23 * * *', groupClass: 'academic'},
					{from: '0 6 * * *', to: '59 23 * * *', groupClass: 'essential'}],
				
				notification_schedule: [
					{
						notification: 'CURRENT_Profile',
						schedule: '0 8 * * *',
						payload: {
							type: "notification",
							title: 'Good morning!'
						}
					}
				]
			}
		},
		{
			module: 'MMM-alexa',
			position: 'middle-center', // The status indicator position
			config: {
				// See 'Configuration options' for more information.
				avsDeviceId: 'Illusion',
				avsClientId: 'amzn1.application-oa2-client.693cbd8ec0f24db898a03dd6b44c40f8',
				avsClientSecret: 'ba8226b71051bd3204330d55941d34749ffce5b5e1ace5124c2472a367f0a8d6',
				avsInitialCode: 'ANniDbeDfAznptvIbYJf',
				enableRaspberryButton: true
			}
		}
		*/
		{
			module: 'MMM-Dad-Jokes',
            position: 'bottom_center', // Or wherever you want
            config: {
                updateInterval: 60000,
                fadeSpeed: 4000
            },
			classes: "Daddy"
		},
		{
			module: 'on-this-day',
			position: 'bottom_bar',
			config: {
				updateInterval: 1000 * 60,
				interests: ["history", "sport"]
			},
			classes: "Daddy"
		},
		{
			module: 'MMM-NFL',
			position: 'middle_center',
			config: {
				// all your config options, which are different than their default values
			},
			classes: "Daddy"
		},
		{
			module: 'MMM-ProfileSwitcher',
			config: {
				includeEveryoneToDefault: true,
				timers: {
					"Daddy": {
						profile: "Student",
						time: 30 * 1000
					},
					"Student": {
						time: 30 * 1000
					},
					"default": {
						profile: "Daddy",
						time: 1 * 1000
					}
				}
			},
			
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
