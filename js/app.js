window.onload = app;

// runs when the DOM is loaded
function app(){
    "use strict";

    // load some scripts (uses promises :D)
    loader.load(
        //css
        {url: "./dist/style.css"},
        //js
        {url: "./bower_components/jquery/dist/jquery.min.js"},
        {url: "./bower_components/lodash/lodash.min.js"},
        {url: "./bower_components/backbone/backbone.js"},
        {url: "./bower_components/pace/pace.min.js"},
        // {url: "./js/views.js"},
        {url: "./js/weatherModel.js"}
    ).then(function(){
        document.querySelector("html").style.opacity = 1;
        // start app?
    })

}