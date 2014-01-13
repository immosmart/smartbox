$(function () {

    //init player and navigation
    Player.init();
    $('input').smartInput({

    });
    $$nav.on();

    //shortcuts for controls
    var $progress = $('.progress'),
        $progressBar = $('.progress-bar'),
        $currentTime = $('.current-time'),
        $pausePlayButton = $('.button_play_pause'),
        $duration = $('.duration');



    $('.set_video_url').click(function () {
        Player.play({
            url: $('input').val()
        });
    });

    //set progress bar position while video playing
    Player.on("update", function () {
        var currentTime = Player.videoInfo.currentTime;
        $progressBar.css({
            width: currentTime / Player.videoInfo.duration * 100 + "%"
        });
        $currentTime.html(Player.formatTime(currentTime));
    });

    //after player reads stream info duration indicator needs refresh
    Player.on("ready", function () {
        $currentTime.html(Player.formatTime(0));
        $duration.html(Player.formatTime(Player.videoInfo.duration));
    });

    //rewind to start after complete
    Player.on("complete", function () {
        Player.seek(0);
        $progressBar.css({
            width: 0
        });
        $pausePlayButton.find('.glyphicon').removeClass("glyphicon-pause");
    });

    //handle click on progress bar
    var progressOffset = $progress.offset().left;
    var progressWidth = $progress.width();
    $progress.click(function (e) {
        var x = e.pageX - progressOffset;
        Player.seek(Player.videoInfo.duration * (x / progressWidth));
    });


    $pausePlayButton.click(function () {
        Player.togglePause();
        $pausePlayButton.find('.glyphicon').toggleClass("glyphicon-pause");
    });

    //jump backward to 10 seconds
    $('.button_rw').click(function () {
        Player.seek(Player.videoInfo.currentTime - 10);
    });

    //jump forward to 10 seconds
    $('.button_ff').click(function () {
        Player.seek(Player.videoInfo.currentTime + 10);
    });

});