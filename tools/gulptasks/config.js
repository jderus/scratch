module.exports = function(){
    // this object has all our configuration settings
    var config = {};

    config.ENVIRONMENT = {
        DEV:    './dist/dev/',
        PROD:   './dist/prod/'
    }

    config.paths = {
        webroot: "./src/wwwroot/"
    };
   
    config.paths.gulptasks      = "./tools/gulptasks/";
    config.paths.js             = config.paths.webroot + "js/**/*.js";
    config.paths.minJs          = config.paths.webroot + "js/**/*.min.js";
    config.paths.css            = config.paths.webroot + "css/**/*.css";
    config.paths.minCss         = config.paths.webroot + "css/**/*.min.css";
    config.paths.concatJsDest   = config.paths.webroot + "js/site.min.js";
    config.paths.concatCssDest  = config.paths.webroot + "css/site.min.css";

    config.paths.reports = "./reports"
    config.paths.testReport = config.paths.reports + "/tests";
    config.paths.coverageReport = config.paths.reports + "/coverage";

    return config;
};