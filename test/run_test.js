(function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function ( spec ) {
        return htmlReporter.specFilter(spec);
    };
    var currentWindowOnload = window.onload;
    window.onload = function () {

        if ( currentWindowOnload ) {
            currentWindowOnload();
        }
        jasmineEnv.execute();
    };
})();
/*window.onload=function(){
    Player.init();
    setTimeout(function(){
        Player.play({
            url: 'http://ua-cnt.smart-kino.com//trailers/russkiy_reportazh/korporatsiya_svyatye_motory.mp4'
        });
    },20000);


};*/