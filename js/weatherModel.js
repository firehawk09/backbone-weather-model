;
(function(exports) {
    "use strict";

    Backbone.GeoModel = Backbone.Model.extend({
        geo: function() {
            var x = $.Deferred(),
                self = this;
            navigator.geolocation.getCurrentPosition(function(position) {
                self.set('position', position, {
                    silent: true
                })
                x.resolve(position);
            }, function(e) {
                x.fail(e)
            }, {
                timeout: 12000, //12s
                maximumAge: 10 * 60 * 1000 //600s, or 10m
            })
            return x;
        },
        geofetch: function() {
            var self = this;
            return this.geo().then(function(position) {
                return self.fetch()
            })
        }
    })

    Backbone.GeoWeatherModel = Backbone.GeoModel.extend({

        url: function() {
            var theURL = [
                "https://api.forecast.io/forecast/",
                this.get('access_token'),
                "/",
                this.get("position").coords.latitude + ',' + this.get("position").coords.longitude,
                "?callback=?"
            ].join('')
            console.log(this);

            return theURL
        }
    })


    Backbone.TemplateView = Backbone.View.extend({
        cache: {},
        stream: function(url) {
            var x = $.Deferred();
            if (this.cache[url]) {
                x.resolve(this.cache[url]);
            } else {
                $.get(url).then((function(d) {
                    this.cache[url] = _.template(d);
                    x.resolve(_.template(d));
                }).bind(this));
            }
            return x;
        },
        loadTemplate: function(name) {
            return this.stream('./templates/' + name + '.html');
        },
        initialize: function(options) {
            this.options = options;
            this.model && this.model.on("change", this.render.bind(this));
        },
        render: function() {
            var self = this;
            this.loadTemplate(this.options.view).then(function(fn) {
                self.model && (self.el.innerHTML = fn(self.model.toJSON()));
            })
        }

    })

    var m = new Backbone.GeoWeatherModel({
        access_token: "7d2de9837336cbb2669b050a5765fa72"
    });

    var HomeView = new Backbone.TemplateView({
        el: ".main",
        model: m,
        view: "currentTemp"
    });

    m.geofetch().then(function(data) {
        data; // { ... } --> data from network request
    })


})(typeof module === "object" ? module.exports : window)
