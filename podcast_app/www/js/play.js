var my_media;
var dur=null;
var isComplete;
var mediaTimer = null;
var play = {


    showPodcastPage: function () {
         $('#frontPage').removeClass('show');
        $('#frontPage').addClass('hide');
          $('#informationPage').removeClass('hide');
        $('#informationPage').addClass('show');
        //$('#informationPage').attr('class', 'show');
        console.log($(this).text());



        for (var i = 0; i < podcastArray.length; i++) {
            if (JSON.parse(podcastArray[i]).title == $(this).text()) {
                var infoVar = '<div class="info">';
                infoVar += '<h2>' + $(this).text() + '</h2>';
                infoVar += '<p class="pubDate">Posted:' + JSON.parse(podcastArray[i]).date + '</p>'
                infoVar += '<div class="podcastImage"><img src="' + JSON.parse(podcastArray[i]).img + '" alt="podcast image"/></div>'
                infoVar += '<p class="duration"> Duration:' + JSON.parse(podcastArray[i]).duration + '</p>'
                infoVar += '</div>'

            }
        }
        if ($('.info,#progressbar')) {
            $('.info,#progressbar').remove();
        }

        $(infoVar).insertBefore($('.controlDiv'));
        $('<div id="progressbar"></div>').insertBefore($('#play'));
        $("#progressbar ").progressbar({});
        var url = cordova.file.externalRootDirectory + "\/" + $('.info h2').text() + ".mp3";
        my_media = new Media(url, play.podcastSuccess, play.podcastFail);
      


        if (app.detectTouchSupport()) {
            //use customer event to decrease 300ms delay 
            $('#pause,#play,#skipBack, #skipAhead').bind('touchend', app.handleTouchEnd);
            $('#pause').bind('tap', play.pausePodcast);
            $('#play').bind('tap', play.playPodcast);
            $('#skipBack').bind('tap', play.skipPodcast);
            $('#skipAhead').bind('tap', play.skipAheadPodcast);
            //console.log('tap');

        } else {
            $('#pause').bind('click', play.pausePodcast);
            $('#play').bind('click', play.playPodcast);
            $('#skipBack').bind('click', play.skipPodcast);
            $('#skipAhead').bind('click', play.skipAheadPodcast);
        }



    },
    playPodcast: function () {
          my_media.play();
          isComplete = false;
        
          setTimeout(function () { dur = parseInt(my_media.getDuration());play.showProgress(); }, 10);
//        my_media.getCurrentPosition(
//            // success callback
//           
//            function (position) {
//                console.log(dur - 1)
//                console.log(parseInt(position));
//                if (parseInt(position) <= 0) {
//                    
//                    
//                    my_media.seekTo(30000);
//                    // console.log((position) + " sec");
//                    setTimeout(function () {
//                        my_media.play();
//                        isComplete = false;
//                        console.log(isComplete);
//                        dur = parseInt(my_media.getDuration());
//                        console.log(dur);
//                    }, 10);
//                
//                }else {
//                    my_media.play();
//                }
//            },
//            // error callback
//            function (e) {
//                console.log("Error getting pos=" + e);
//            }
//
//        );


    },
    pausePodcast: function () {
        my_media.getCurrentPosition(
            // success callback
            function (position) {
                if (position > 0) {
                    my_media.pause();
                }
            },
            // error callback
            function (e) {
                console.log("Error getting pos=" + e);
            }
        );


    },
    skipPodcast: function () {
        my_media.getCurrentPosition(
            // success callback
            function (position) {
                if (position > 10) {
                    my_media.seekTo(position * 1000 - 10000);
                    // console.log((position) + " sec");
                    setTimeout(function () {
                        my_media.play();
                    }, 10);

                } else if (position < 10) {
                    my_media.seekTo(0);
                    setTimeout(function () {
                        my_media.play();
                    }, 10);
                }
            },
            // error callback
            function (e) {
                console.log("Error getting pos=" + e);
            }
        );
    },
    showProgress: function () {
        //        var duration = $('.duration').text();
        //        var time = duration.split(':');
        //        var maxValue;
        //        console.log(time[1]);
        //
        //        switch (time.length) {
        //        case 1:
        //
        //            break;
        //        case 2:
        //            console.log(time[1]);
        //            maxValue = Number(time[1]);
        //
        //            break;
        //        case 3:
        //            console.log(time[1]);
        //            maxValue = Number(time[1]) * 60 + Number(time[2]);
        //
        //            break;
        //        case 4:
        //            console.log(time[2]);
        //            maxValue = Number(time[1]) * 60 * 60 + Number(time[2]) * 60 + Number(time[3]);
        //
        //            break;
        //        }
        //        console.log(maxValue);
       
        mediaTimer = setInterval(function () {
            // get media position
            my_media.getCurrentPosition(
                // success callback
                function (position) {
                    var intPosition = parseInt(position);
                     console.log(intPosition);
                    console.log(dur);
                    if (position >= 0) {
                        console.log((intPosition) + " sec");
                        //                        $("#slider").slider({
                        //                            value: position,
                        //                            max: dur,
                        //                            slide: play.refreshSwatch,
                        //                            change: play.refreshSwatch
                        //                        });
                        $("#progressbar").progressbar({
                            value: intPosition,
                            max: dur,
                        });
                        //progressPosition = position;
                    }
                    if (intPosition == dur - 1) {
                        console.log(intPosition);
                        isComplete = true;
                         //my_media.seekTo(30000);
                        console.log(isComplete);
                        my_media.stop();
                    }

                },
                // error callback
                function (e) {
                    console.log("Error getting pos=" + e);
                }
            );
        }, 1000);




    },
    skipAheadPodcast:function(){
        console.log('skipAheadPodcast')
         my_media.getCurrentPosition(
            // success callback
            function (position) {
                if (position <=0) {
                    console.log(position);
                    my_media.seekTo(30000);
                    
                    
                    // console.log((position) + " sec");
//                    setTimeout(function () {
//                        my_media.play();
//                    }, 10);

                } else if (position >0) {
                    console.log(position);
                   my_media.seekTo(position * 1000 + 30000);
                    setTimeout(function () {
                        my_media.play();
                    }, 10);
                }
            },
            // error callback
            function (e) {
                console.log("Error getting pos=" + e);
            }
        );
    },
    refreshSwatch: function () {
        var currentPosition = $("#slider").slider("value");
        my_media.seekTo(currentPosition * 1000);
        //        console.log(currentPosition);
        //         console.log(dur);

        //        setTimeout(function () {
        //                        my_media.play();
        //                    }, 10);

    },
    goBack: function () {
         $('#frontPage').removeClass('hide');
        $('#frontPage').addClass('show');
          $('#informationPage').removeClass('show');
         $('#informationPage').addClass('hide');
        console.log(isComplete);
        clearInterval(mediaTimer);
        mediaTimer = null;
        my_media.release();
        app.checkdevice();
        if (isComplete) {
            setTimeout(function () {
                isComplete = false;
                console.log(isComplete)
            }, 100)

        }

    },
    podcastSuccess: function () {
        console.log('podcastSuccess');
    },
    podcastFail: function (err) {
        console.log("recordAudio():Audio Error: " + err.code);
    },
    //    detectTouchSupport :function () {
    //    msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
    //    touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
    //    return touchSupport;
    //    },
}