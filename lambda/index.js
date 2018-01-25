'use strict';

const Alexa   = require('alexa-sdk');
const request = require('request-promise');
const cheerio = require('cheerio');
const url     = "https://www.metoffice.gov.uk/public/weather/marine/print/shipping-forecast";

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/*
 * It can take a while to get the data so it might be nice to let the user know.
 * This needs a `Progressive Response`. Which appears to be an API call.
 * 
 * https://developer.amazon.com/docs/custom-skills/send-the-user-a-progressive-response.html
 *
 */

const handlers = {
    'LaunchRequest': function () {
        this.emit('readShippingForecast');
    },
    'shippingForecastIntent': function () {
        this.emit('readShippingForecast')
    },
    'readShippingForecast': function () {
        const getForecast = function getForecast() {
            return request.get(url)
        };
        var forecast = "";
        getForecast().then(
            (response) => {
                var $ = cheerio.load(response);
                //
                // Build the introduction.
                //
                var norm = "94";
                var slow = "81";
                var intro = $('h1').eq(0).next().text();
                forecast = forecast + intro;
                var warning = $('p[class=warning]').text();
                if ( warning != "" ) {
                    forecast = forecast + ' </prosody> <break time="1s"/> <prosody rate="' + slow + '%"> ' + warning;
                };
                var intro = $('h1').eq(0).next().text();
                //
                // Build the general synopsis.
                //
                var synopsis = $('h2').eq(0).text();
                forecast = forecast + ' </prosody> <break time="1s"/> <prosody rate="' + norm + '%"> ' + synopsis + ".";
                synopsis = $('h2').eq(0).next().text();
                forecast = forecast + ' </prosody> <break time="1s"/> <prosody rate="' + slow + '%"> ' + synopsis + ".";
                //
                // Build the area forecasts.
                //
                var area = $('h2').eq(1).text();
                forecast = forecast + ' </prosody> <break time="1s"/> <prosody rate="' + norm + '%"> ' + area + ".";
                $('h3').each(function(){
                    area = $(this).text();
                    forecast = forecast + ' <break time="1s"/> ' + area + '.';
                    var detail = $(this).next().text();
                    forecast = forecast + ' </prosody> <break time="1s"/> <prosody rate="' + slow + '%"> ';
                    forecast = forecast + detail + ".";
                });
                //
                // Shipping forecast text tidies and fixes.
                //
                forecast = forecast.replace(/The shipping forecast/, 'This is the shipping forecast');
                forecast = forecast.replace(/(20)(\d\d)/g, 'twenty-\$2,');
                forecast = forecast.replace(/(\d\d\d\d)/g, '<say-as interpret-as="digits">\$1</say-as>');
                forecast = forecast.replace(/ (\d\d\d)/g, ' ,<say-as interpret-as="digits">\$1</say-as>');
                forecast = forecast.replace(/UTC/g, 'U.T.C.');
                forecast = forecast.replace(/\n/g, ' ');
                forecast = forecast.replace(/Fair Isle/g, 'Fair-Isle');
                forecast = forecast.replace(/German Bight/g, 'German-Bight');
                forecast = forecast.replace(/Irish Sea/g, 'Irish-Sea');
                forecast = forecast.replace(/Rockall/g, 'RockAll');
                forecast = forecast.replace(/Malin/g, 'MaLLin');
                forecast = forecast.replace(/Utsire/g, 'Utseera');
                forecast = forecast.replace(/Wight/g, 'White');
                forecast = forecast.replace(/Fitzroy/g, 'FitzRoy');
                //
                // Adjust the rate.
                //
                forecast = '<prosody rate="' + norm  + '%"> ' + forecast + ' </prosody>';

                this.response.speak(forecast);
                this.emit(':responseReady');
            },
            (error)    => {
                console.error('Error: ' + error);
                this.response.speak('The shipping forecast is unavailable at this time. Please try again later.');
                this.emit(':responseReady');
            }
        );
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'This is the shipping forecast Alexa Skill.';
        const reprompt = 'Say, open shipping forecast, to hear me speak.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    }
};
