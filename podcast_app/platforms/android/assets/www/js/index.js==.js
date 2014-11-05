/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//var podcastXml;

var podcastArray = [];
var tap = document.createEvent("Event");
tap.initEvent("tap", true, true);

var app = {
    // Application Constructor
    initialize: function () {

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {



        if (app.detectTouchSupport()) {
            console.log();
            //use customer event to decrease 300ms delay 
            $('.back,.addnewBtn,.setDone,.setUrl,.setUri').bind('touchend', app.handleTouchEnd);

            $('.back').bind('tap', play.goBack);
            $(".addnewBtn").bind("tap", app.showAddnew);
            $(".setDone").bind("tap", app.addnewPodcast);
            $(".setUrl").bind("tap", app.testPodcast);
            $(".setUri").bind("tap", app.testPodcast2);
            //console.log('tap');

        } else {
            $('.back').bind('click', play.goBack);
            $(".addnewBtn").bind("click", app.showAddnew);
            $(".setDone").bind("click", app.addnewPodcast);
            $(".setUrl").bind("click", app.testPodcast);
            $(".setUri").bind("click", app.testPodcast2);
        }
        app.checkdevice();
        app.checkOnline();
    },
    checkdevice: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFileSystemSuccess, app.onFileSystemfail);
        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFile, app.failFile);

    },
    onFileSystemSuccess: function (fileSystem) {

        console.log('onFileSystemSuccess');
        console.log("FileSystem success : " + fileSystem.name);



        // Get a list of all the entries in the directory
        console.log(isComplete);
        if (isComplete==true) {
            var deletedFileName = $('.info h2').text();
            console.log(deletedFileName);
            fileSystem.root.getFile(deletedFileName + ".mp3", {
                    create: false,
                    exclusive: false
                },
                function (fileEntry) {
                    function success(entry) {
                        console.log("Removal succeeded");
                    }

                    function fail(error) {
                        alert('Error removing file: ' + error.code);
                    }

                    // remove the file
                    fileEntry.remove(success, fail);
                }, app.failFile);

            setTimeout(function () {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(app.readerSuccess, app.directoryReaderFail);
            }, 30)
        } else {
            var directoryReader = fileSystem.root.createReader();
            directoryReader.readEntries(app.readerSuccess, app.directoryReaderFail);
        }


        fileSystem.root.getFile("podcasts.txt", {
                create: true,
                exclusive: false
            },
            function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (evt) {
                        console.log("readAsText");
                        if (evt.target.result.length > 0) {
                            var jsonfile = JSON.parse(evt.target.result)
                            if (jsonfile.length > 0) {
                                podcastArray = jsonfile;
                                console.log(JSON.parse(podcastArray[0]));

                                //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFile, app.failFile);

                            }
                            console.log(evt.target.result);
                        }


                        //console.log(JSON.parse(jsonfile[0]).duration);
                    };
                    reader.readAsText(file);
                }, app.failreading);
            }, app.failFile);

    },

    readerSuccess: function (entries) {
		
		
		
        console.log('readerSuccess');
        var mp3File = [];
        for (var i = 0; i < entries.length; i++) {
            // Assuming everything in the Music directory is an mp3, go nuts
            // otherwise check entries[i].name to see if it ends with .mp3
            var fileName = entries[i].name

            if (fileName.indexOf(".mp3") == fileName.length - 4) {
                console.log(fileName);
                mp3File.push(fileName.split('.')[0]);
                //console.log(mp3File);
            }
        }
		
		
        if (mp3File.length > 0) {
			
		
            console.log(mp3File.length);
            console.log(mp3File);
            console.log($('.podcastMp3').length);
            if ($('.podcastMp3').length > 0) {
                $('.podcastMp3').remove();
            }
            if ($('.newGuynotes')) {
                $('.newGuynotes').remove();
            }
			
			if($('.logo')){	
		        $(".logo").remove();		       
				}
			
            for (var i = 0; i < mp3File.length; i++) {
                $('.podcastList').append("<li class='podcastMp3'>" + mp3File[i] + "</li>");
            }

            if (app.detectTouchSupport()) {
				
			
			   
                //use customer event to decrease 300ms delay 
                $('.podcastMp3').bind('touchend', app.handleTouchEnd);
                $('.podcastMp3').bind('tap', play.showPodcastPage);

                //console.log('tap');

            } else {
                $('.podcastMp3').bind('click', play.showPodcastPage)
            }
        }

    },
    checkOnline: function () {
        console.log('checkOnline');
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        //alert('Connection type: ' + states[networkState]);
        if (states[networkState] != 'No network connection') {
            //if states[networkState] is  not equal "No network connection", 'online' event run and call checkData function
            console.log(states[networkState]);
            document.addEventListener("online", app.getPodcastXml, false);
            //sim.goOnline();
            // simon create customer event call 'online', we have to run goOnline funtion make 'online' event happen 

        } else {
            document.addEventListener("offline", app.networkfail, false);
            //sim.goOffline();
            alert(states[networkState]);
        }

    },
    // Update DOM on a Received Event
    getPodcastXml: function () {
        console.log('getPodcastXml');
        var podcastURL = localStorage.getItem("podcastURL");
        console.log(podcastURL);
        //var podcastURL = "http://feeds.feedburner.com/WelcomeToNightVale"
        if (podcastURL != null) {
            if($('.newGuynotes')){
                $('.newGuynotes').remove();
            }
            var request = new XMLHttpRequest();
            request.open('GET', podcastURL, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 || request.readyState == "complete") {
                    if (request.status === 200 || request.status === 0) {
                        //console.log(request.responseText);
                        var podcastXml = request.responseXML;
                        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.checkFile, app.failFile);
                        setTimeout(function () {
                            app.downloadNewPodcasts(podcastXml)
                        }, 300);
                        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFile, app.failFile);
                        console.log(podcastXml);

                    } else {
                        $('#frontPage').append('<div class="notification">Oops! fail to fetch your podcast, please try again</div>');
                        setTimeout(function () {
                            $('#frontPage .notification').remove()
                        }, 4000)
                    }
                }
            }
            request.send(null);
        } /**else{show "add xml"}**/

    },
    downloadNewPodcasts: function (podcastXml) {
        console.log('downloadNewPodcasts');
        console.log(podcastArray.length)
        var isRecord;
        if (podcastArray.length > 0) {
            for (var i = 0; i < podcastArray.length; i++) {
                if (JSON.parse(podcastArray[i]).channel == $(podcastXml).find('channel>title').text()) {
                    isRecord = true;
                    break;
                }

            }
        }

        console.log(isRecord);



        if (isRecord) {
            var localNewestDate = 0;
            var localChannleItemsDate = [];
            for (var i = 0; i < podcastArray.length; i++) {
                console.log(JSON.parse(podcastArray[i]).channel);
                if (JSON.parse(podcastArray[i]).channel == $(podcastXml).find('channel>title').text()) {
                    localChannleItemsDate.push(JSON.parse(podcastArray[i]).date);
                }

            }

            for (var i = 0; i < localChannleItemsDate.length; i++) {
                var crruentDate = new Date(localChannleItemsDate[i])
                if (crruentDate.getTime() > localNewestDate) {
                    localNewestDate = crruentDate.getTime();
                }
            }


            console.log(localNewestDate);

            for (var index = 0; index < $(podcastXml).find('item').length; index++) {
                var newDate = $(podcastXml).find("item>pubDate").eq(index).text().split('+');
                if (new Date(newDate[0]).getTime() > localNewestDate) {
                    console.log('get news')
                    var newTitleWhole = $(podcastXml).find('item>title').eq(index).text()
                    var newFileTransfer = new FileTransfer();
                    var newUri = encodeURI($(podcastXml).find('item>enclosure').eq(index).attr('url'));
                    var newSpecialChars = "#:\./|"
                    for (var s = 0; s < newSpecialChars.length; s++) {
                        console.log(newSpecialChars[s]);
                        if (newTitleWhole.indexOf(newSpecialChars[s]) > -1) {

                            newTitleWhole = newTitleWhole.replace(newSpecialChars[s], ' ')
                        }
                        console.log('titleWhole:' + newTitleWhole);

                    }
                    var newFileURL = cordova.file.externalRootDirectory + newTitleWhole + '.mp3';
                    console.log($(podcastXml).find('item>title').eq(index).text());

                    var newPodcastInfo = '{'
                    newPodcastInfo += '"channel":"' + $(podcastXml).find('channel>title').text() + '",'
                    newPodcastInfo += '"title":"' + newTitleWhole + '",'
                    newPodcastInfo += '"img":"' + $(podcastXml).find('item>image').eq(index).attr('href') + '",'
                    newPodcastInfo += '"duration":"' + $(podcastXml).find("item>duration").eq(index).text() + '",'
                    newPodcastInfo += '"date":"' + newDate[0] + '"'
                    newPodcastInfo += '}'
                    podcastArray.push(newPodcastInfo);
                    console.log(podcastArray);
                    if ($('#frontPage .notification')) {
                        $('#frontPage .notification').remove();
                    }
                    $('#frontPage').append('<div class="notificationDownLoading">found new podcast for you, downloading...</div>');
                    setTimeout(function () {
                        $('#frontPage .notificationDownLoading').remove()
                    }, 4000);
					
                    //                    newFileTransfer.download(newUri, newFileURL, app.downloadSuccessCallback, app.downloadErrorCallback, false);


                }
            }
        } else {
            for (var i = 0; i < 2; i++) {

                var titleWhole = $(podcastXml).find('item>title').eq(i + 2).text()
                var fileTransfer = new FileTransfer();
                var uri = encodeURI($(podcastXml).find('item>enclosure').eq(i + 2).attr('url'));
                var specialChars = "#:\./|-"
                for (var s = 0; s < specialChars.length; s++) {
                    console.log(specialChars[s]);
                    if (titleWhole.indexOf(specialChars[s]) > -1) {
                        titleWhole = titleWhole.replace(specialChars[s], ' ')
                        console.log('titleWhole:' + titleWhole);
                    }

                }

                var fileURL = cordova.file.externalRootDirectory + titleWhole + '.mp3';

                var date = $(podcastXml).find("item>pubDate").eq(i + 2).text().split('+');
                var podcastInfo = '{'
                podcastInfo += '"channel":"' + $(podcastXml).find('channel>title').text() + '",'
                podcastInfo += '"title":"' + titleWhole + '",'
                podcastInfo += '"img":"' + $(podcastXml).find('item>image').eq(i + 2).attr('href') + '",'
                podcastInfo += '"duration":"' + $(podcastXml).find("item>duration").eq(i + 2).text() + '",'
                podcastInfo += '"date":"' + date[0] + '"'
                podcastInfo += '}'

                podcastArray.push(podcastInfo);
                console.log(podcastArray);
                fileTransfer.download(uri, fileURL, app.downloadSuccessCallback, app.downloadErrorCallback, false);

            }

            $('#frontPage').append('<div class="notificationDownLoading">try to download podcast for you, you can do some thing else</div>');
			
			
			
			//跟这写！ chrome://inspect/#devices
			
			
			
            setTimeout(function () {
                $('#frontPage .notificationDownLoading').remove()
            }, 4000)
        }


    },

    //    downloadNewPodcasts: function (podcastXml) {
    //        console.log('downloadNewPodcasts');
    //        console.log(podcastArray.length)
    //        if (podcastArray.length > 0) {
    //            var localNewDate = 0;
    //
    //            for (var i = 0; i < podcastArray.length; i++) {
    //                console.log(JSON.parse(podcastArray[i]).date);
    //                var crruentDate = new Date(JSON.parse(podcastArray[i]).date)
    //
    //                console.log(crruentDate.getTime());
    //                if (crruentDate.getTime() > localNewDate) {
    //                    localNewDate = crruentDate.getTime();
    //                }
    //            }
    //            
    //         
    //            
    //            
    //            console.log(localNewDate);
    //
    //            for (var index = 0; index < $(podcastXml).find('item').length; index++) {
    //
    //                if (new Date(date[0]).getTime() > localNewDate) {
    ////                    console.log('get news')
    //                    var titleWhole = $(podcastXml).find('item>title').eq(index).text()
    //                    var fileTransfer = new FileTransfer();
    //                    var uri = encodeURI($(podcastXml).find('item>enclosure').eq(index).attr('url'));
    //                    var specialChars = "#:\./|-"
    //                    for (var s = 0; s < specialChars.length; s++) {
    //                        console.log(specialChars[s]);
    //                        if (titleWhole.indexOf(specialChars[s]) > -1) {
    //                            
    //                             titleWhole = titleWhole.replace(specialChars[s], ' ')
    //                        }
    //                        console.log('titleWhole:'+titleWhole);
    //                        
    //                    }
    //                    var fileURL = cordova.file.externalRootDirectory + titleWhole + '.mp3';
    //                    console.log($(podcastXml).find('item>title').eq(index).text());
    //                    var date = $(podcastXml).find("item>pubDate").eq(index).text().split('+');
    //                    var podcastInfo = '{'
    //                    podcastInfo += '"title":"' + titleWhole + '",'
    //                    podcastInfo += '"img":"' + $(podcastXml).find('item>image').eq(index).attr('href') + '",'
    //                    podcastInfo += '"duration":"' + $(podcastXml).find("item>duration").eq(index).text() + '",'
    //                    podcastInfo += '"date":"' + date[0] + '"'
    //                    podcastInfo += '}'
    //                    podcastArray.push(podcastInfo);
    //                    fileTransfer.download(uri, fileURL, app.downloadSuccessCallback, app.downloadErrorCallback, false);
    //                }
    //            }
    //        } else {
    //            for (var i = 0; i < 2; i++) {
    //
    //                var titleWhole = $(podcastXml).find('item>title').eq(i+2).text()
    //                var fileTransfer = new FileTransfer();
    //                var uri = encodeURI($(podcastXml).find('item>enclosure').eq(i+2).attr('url'));
    //                var specialChars = "#:\./|-"
    //                for (var s = 0; s < specialChars.length; s++) {
    //                    console.log(specialChars[s]);
    //                    if (titleWhole.indexOf(specialChars[s]) > -1) {
    //                         titleWhole = titleWhole.replace(specialChars[s], ' ')
    //                        console.log('titleWhole:'+titleWhole);
    //                    }
    //                   
    //                }
    //
    //                var fileURL = cordova.file.externalRootDirectory + titleWhole + '.mp3';
    //                
    //                var date = $(podcastXml).find("item>pubDate").eq(i+2).text().split('+');
    //                var podcastInfo = '{'
    //                podcastInfo += '"title":"' + titleWhole + '",'
    //                podcastInfo += '"img":"' + $(podcastXml).find('item>image').eq(i+2).attr('href') + '",'
    //                podcastInfo += '"duration":"' + $(podcastXml).find("item>duration").eq(i+2).text() + '",'
    //                podcastInfo += '"date":"' + date[0] + '"'
    //                podcastInfo += '}'
    //
    //                podcastArray.push(podcastInfo);
    //                fileTransfer.download(uri, fileURL, app.downloadSuccessCallback, app.downloadErrorCallback, false);
    //
    //            }
    //        }
    //
    //
    //    },
    downloadSuccessCallback: function (entry) {

        //  console.log("download complete: " + entry.toURL());

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFile, app.failFile);
    },
    gotFile: function (fileSystem) {
        fileSystem.root.getFile("podcasts.txt", {
            create: true,
            exclusive: false
        }, app.gotFileEntry, app.failFile);
    },
    gotFileEntry: function (fileEntry) {
        console.log('gotFileEntry')
        fileEntry.createWriter(app.gotFileWriter, app.failFile);
        //fileEntry.file(app.readFile, app.failreading);

        /*****************************test part********************************************************************/
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile("podcasts.txt", {
                create: false,
                exclusive: false
            }, function (fileEntry) {
                fileEntry.file(app.readFile, app.failreading)
            }, app.failFile);
        }, app.failFile);
        /*****************test part********************************/
    },
    gotFileWriter: function (writer) {
        console.log(podcastArray);
        var podcastJson = JSON.stringify(podcastArray)
        writer.write(podcastJson);
        app.checkdevice();
    },
    readFile: function (file) {
        console.log('readFile')
        var reader = new FileReader();


        reader.readAsText(file);
        reader.onloadend = function (evt) {
            console.log("readAsText");
            if (evt.target.result.length > 0) {
                var jsonfile = JSON.parse(evt.target.result)
                console.log(evt.target.result);
                console.log(jsonfile);
                console.log(JSON.parse(jsonfile[0]).duration);

            }
        };
    },

    showAddnew: function () {
        var availableTags = [
      "http://feeds.feedburner.com/ThrillingAdventureHour",
      "http://feeds.feedburner.com/WelcomeToNightVale"
         ];
        $("#urlInput").autocomplete({
            source: availableTags
        });
        if ($('.menu').css('display') == 'block') {

            console.log($('.menu').css('display'));
            //        $('.mask').addClass('hide');
            $('.inner').removeClass('addnewBtnActive');
            //        $('.inner').removeClass('blur');
         //   $('.heading').css('padding-left', '0');
            $('.addnewBtn').removeClass('addnewBtnActive');
            $('.menu').css('left', '-30%');
            setTimeout(function () {
                $('.menu').addClass('hide')
            }, 200);
        } else {

            console.log($('.menu').css('display'));
            //        $('.mask').removeClass('hide');
            $('.inner').addClass('addnewBtnActive');
            //        $('.inner').addClass('blur');
           // $('.heading').css('padding-left', '35%');
            $('.addnewBtn').addClass('addnewBtnActive');
            $('.menu').removeClass('hide');
            setTimeout(function () {
                $('.menu').css('left', '0');
            }, 10)
        }

    },
    addnewPodcast: function (ev) {

        console.log($('input').val().indexOf("http://"));
        if (($('input').val().indexOf("http://") > -1) && ($('input').val() != '')) {
            localStorage.setItem("podcastURL", $('input').val());
          //  $('.heading').css('padding-left', '0');
            $('.inner').removeClass('addnewBtnActive');
            $('.addnewBtn').removeClass('addnewBtnActive');
            $('.menu').css('left', '-30%');
            setTimeout(function () {
                $('.menu').addClass('hide')
            }, 200);

            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            //alert('Connection type: ' + states[networkState]);
            if (states[networkState] != 'No network connection') {
				
				/*remove logo*/
				$(".logo").remove();
				/*remove logo*/
				

                app.getPodcastXml();
            } else {
                app.networkfail();
            }
            
        } else {
            $('.menu').append('<div class="notification">Invalid URL</div>');
            setTimeout(function () {
                $('.menu .notification').remove()
            }, 4000)
        }
        //        podcastURL = $('input').val();
        //        console.log(podcastURL);
        //app.checkOnline();

    },
    /***************************************************************************************************************/
    onFileSystemfail: function (evt) {
        console.log(evt.target.error.code);
    },
    onGetDirectoryFail: function () {
        console.log("error getting dir")
    },
    directoryReaderFail: function () {
        console.log("directoryReaderFail")
    },
    networkfail: function () {
        console.log('networkfail')
    },
    downloadErrorCallback: function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
    },
    failFile: function (error) {
        console.log(error.code);
    },
    failreading: function () {
        console.log('failreading');
    },
    handleTouchEnd: function (ev) {
        //pass the touchend event directly to a click event

        ev.preventDefault();
        var target = ev.currentTarget;
        target.dispatchEvent(tap);
        //this will send a click event from the touched tab to the function handleLinkClick
    },
    detectTouchSupport: function () {
        msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
        touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
        return touchSupport;
    },
    testPodcast: function () {
        $('input').val('http://feeds.feedburner.com/WelcomeToNightVale');
    },
    testPodcast2: function () {
        $('input').val('http://feeds.feedburner.com/ThrillingAdventureHour');
    }
};