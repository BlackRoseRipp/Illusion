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
	address: "0.0.0.0", 	// Christian - For remote control to work thsi must be 0.0.0.0 if this causes problems let me know
							// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "10.156.74.3", "192.168.1.56"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	/* Christian - To use remote control - add your specific ip address from the device you want to connect to - I have my Iphone IP starting with 10. as an example*/
	
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
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"
					}
				]
			},
			classes: "everyone"
		},
		{
			module: 'MMM-Remote-Control',
			// uncomment the following line to show the URL of the remote control on the mirror
			 position: 'bottom_left',
			// you can hide this module afterwards from the remote control itself
			config: {
				customCommand: {},  // Optional, See "Using Custom Commands" below
				showModuleApiMenu: true, // Optional, Enable the Module Controls menu
				secureEndpoints: true, // Optional, See API/README.md
				// uncomment any of the lines below if you're gonna use it
				// customMenu: "custom_menu.json", // Optional, See "Custom Menu Items" below
				// apiKey: "", // Optional, See API/README.md for details
				// classes: {} // Optional, See "Custom Classes" below
			},
			classes: "everyone"
		},
        {
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
			classes: 'Student'
        },
		{
			module: "compliments",
			position: "lower_third",
			classes: "Student"
		},
		{
			module: "weather",
			position: "top_left",
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
			module: "MMM-Jast",
			position: "top_right",
			config: {
				maxWidth: "100%",
				updateIntervalInSeconds: 300,
				fadeSpeedInSeconds: 3.5,
				scroll: "none", // One of ["none", "vertical", "horizontal"]
				useGrouping: false,
				currencyStyle: "symbol", // One of ["code", "symbol", "name"]
				lastUpdateFormat: "HH:mm",
				showColors: true,
				showCurrency: true,
				showChangePercent: true,
				showChangeValue: false,
				showChangeValueCurrency: false,
				showLastUpdate: false,
				showPortfolioValue: true,
				showPortfolioGrowthPercent: true,
				showPortfolioGrowth: true,
				numberDecimalsValues: 2,
				numberDecimalsPercentages: 1,
				virtualHorizontalMultiplier: 2,
				stocks: [
					{ name: "FB", symbol: "FB", quantity: 1},
					{ name: "AMZN", symbol: "AMZN", quantity: 1},
					{ name: "AAPL", symbol: "AAPL", quantity: 1},
					{ name: "NFLX", symbol: "NFLX", quantity: 1},
					{ name: "GOOG", symbol: "GOOG", quantity: 1},
					{ name: "SPY", symbol: "SPY"},
					{ name: "DJI", symbol: "^DJI"},
					{ name: "IXIC", symbol: "^IXIC"}
				]
			},
			classes: 'Finance'
		},
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
			module: "MMM-cryptocurrency",
			position: "top_right",
			config: {
				apikey: '06cb0e2a-946f-4ddc-925b-f4510e396e94',
				currency: ['ethereum', 'bitcoin', 'dogecoin'],
				conversion: 'USD',
				maximumFractionDigits: 2,
				headers: ['change24h', 'change1h', 'change7d'],
				displayType: 'logoWithChanges',
				coloredLogos: false,
				showGraphs: true
			},
			classes: "Finance"
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
						profile: "Finance",
						time: 30 * 1000
					},
					"Finance": {
						time: 30 * 1000
					},
					"default": {
						profile: "Daddy",
						time: 1 * 1000
					}
				}
			},
			
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
