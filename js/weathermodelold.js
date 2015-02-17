;
(function(exports) {
    "use strict";

//BB
    //Router
    var WeatherRouter = Backbone.Router.extend({

        routes: {
            "": "home"
        },

        home: function(){
            var wthrView = new HomeView()
            var m = new GeoModel({wView: wthrView});
            console.log("Routing Initialized");
        },

        initialize: function(){
            Backbone.history.start()
        }
    })

    //The Models
    var GeoModel = Backbone.Model.extend({
        geo: function() {
            var jQPromise = $.Deferred(),
                self = this;
            navigator.geolocation.getCurrentPosition(function(position) {
                // self.set('position', position, {
                //     silent: true
                // })
                jQPromise.resolve(position);
            }, function(e) {
                jQPromise.fail(e)
            }, {
                timeout: 12000, //12s
                maximumAge: 10 * 60 * 1000 //600s, or 10m
            })
            return jQPromise;
        },

        //

        // geofetch: function() {
        //     return this.geo().then(this.fetch.bind(this))
        // }

        initialize: function(){
            var self = this
            //return promise of geodata & then.....
            this.geo().then(function(geodata){
                //put geodata lat/long values on new instance of Weather Model
                var wmod = new WeatherModel({
                    lat: geodata.coords.latitude,
                    long: geodata.coords.longitude,
                    access_token: "7d2de9837336cbb2669b050a5765fa72"
                })
                //get forecast api data (.fetch() returns a promise (jqXHR object))
                $.when(
                    wmod.fetch(),
                    self.get('wView').loadTemplate('homeTemp')
                        ).then(function(theWeatherData, htmlString){
                            console.log(htmlString)
                            console.log(theWeatherData)
                            var wDataObj = theWeatherData[0]
                            self.get('wView').render(wDataObj, htmlString)
                            console.log(self);
                })
            })
        }
    })

    var WeatherModel = Backbone.Model.extend({
        defaults: {
            lat: 0,
            long: 0,
            access_token: ""
        },

        url: function() {
            console.log('url')
            var theURL = [
                "https://api.forecast.io/forecast/",
                this.get('access_token'),
                "/",
                this.get("lat") + ',' + this.get("long"),
                "?callback=?"
            ].join('')

            return theURL
        }
    })

    //The Views

    var HomeView = Backbone.View.extend({
        tagName: "div",
        className: "homeView",
        loadTemplate: function(fileName){
            console.log('loadTemplate called')
            var urlstring = "./templates/"+fileName+".html"
            console.log(urlstring)
            return $.get(urlstring).then(function(htmlPartial){
                console.log(htmlPartial)
                return htmlPartial
            })
        },

        render: function(weatherData, htmlTxt){
                var compiledTemplate2 = _.template(htmlTxt)
                // compiledTemplate2(weatherData)
                console.log(compiledTemplate2)
                document.querySelector('.main').innerHTML = compiledTemplate2;
        }
    })

    //run the code
    var letsRoute = new WeatherRouter();


})(typeof module === "object" ? module.exports : window)
