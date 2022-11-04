    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/8883651449'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/8716130486'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        //display interstitial at startup
        loadInterstitial();
    }
    function initAd() {
        var defaultOptions = {
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black', // color name, or '#RRGGBB'
            isTesting: false // set to true, to receiving test ad for testing purpose
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('onAdLoaded', function (data) {
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { 
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('onAdDismiss', function (data) {
           document.getElementById("screen").style.display = 'none';     
        });
    }

    function createSelectedBanner() {
          AdMob.createBanner({adId:admobid.banner});
    }

    function loadInterstitial() {
        if ((/(android|windows phone)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: true, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else if ((/(ipad|iphone|ipod)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: true, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else
        {
            document.getElementById("screen").style.display = 'none';     
        }
    }

   function checkFirstUse()
    {
        alert('1');
        $("span").remove();
        alert('2');
        $(".dropList").select2();
        //initApp();
        alert('3');
        checkPermissions();
        alert('4');
        askRating();
        alert('5');
        document.getElementById('screen').style.display = 'none';     
    }

    function notFirstUse()
    {
        $("span").remove();
        $(".dropList").select2();
        document.getElementById("screen").style.display = 'none';     
    }

function loadFaves()
{
    showAd();
    window.location = "Favorites.html";
}

function checkPermissions(){
    const idfaPlugin = cordova.plugins.idfa;

    idfaPlugin.getInfo()
        .then(info => {
            if (!info.trackingLimited) {
                return info.idfa || info.aaid;
            } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                return idfaPlugin.requestPermission().then(result => {
                    if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                        return idfaPlugin.getInfo().then(info => {
                            return info.idfa || info.aaid;
                        });
                    }
                });
            }
        });
}
 
    
function askRating()
{
    cordova.plugins.AppRate.setPreferences = {
        reviewType: {
            ios: 'AppStoreReview',
            android: 'InAppBrowser'
            },
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1296111737',
                android: 'market://details?id=com.jacksonville.free'
               }
};
 
AppRate.promptForRating(false);
}

function showAd()
{
    document.getElementById("screen").style.display = 'block';     
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        AdMob.isInterstitialReady(function(isready){
            if(isready) 
                AdMob.showInterstitial();
        });
    }
    document.getElementById("screen").style.display = 'none'; 
}


function loadDirections() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#routeStopSelect").attr("disabled", "");
    $("#routeStopSelect").val('0');
    $("#message").text('');
    $.ajax(
          {
              type: "GET",
              url: "https://retro.umoiq.com/service/publicJSONFeed",
              data: "command=routeConfig&a=jtafla&r=" + $("#routeSelect").val(),
              //contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (msg) {
                  if (msg == null || msg.length == 0) {
                      return;
                  }

                  var list = $("#routeDirectionSelect");
                  $(list).empty();
                  $(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
                  var numDirections = msg['route'].direction;
                  if (numDirections.length == null) {
                      $(list).append($("<option />").val(numDirections.name).text(numDirections.title));
                  }
                  else {
                      $.each(numDirections, function (index, item) {
                          $(list).append($("<option />").val(item.name).text(item.title));
                      });
                  }
                  $(list).removeAttr('disabled');
                  $(list).val('0');
              },
              error: function () {
              }
          }
        );
        $("span").remove();
        $(".dropList").select2();
    }


function loadStops() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#message").text('');
    $.ajax(
          {
              type: "GET",
              url: "https://retro.umoiq.com/service/publicJSONFeed",
              data: "command=routeConfig&a=jtafla&r=" + $("#routeSelect").val(),
              //contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (msg) {
                  if (msg == null || msg.length == 0) {
                      return;
                  }
                  var stopList = $("#routeStopSelect");
                  $(stopList).empty();
                  $(stopList).append($("<option disabled/>").val("0").text("- Select Stop -"));
                  var numStops = msg['route'].stop;
                  var numDirections = msg['route'].direction;
                  var arrStops = [];
                      $.each(numStops, function (index, item) {
                          $(stopList).append($("<option />").val(item.stopId).text(item.title));
                      });
                  if (numDirections.length != null) {
                      $.each(numDirections, function (index, item) {
                          if ($("#routeDirectionSelect").val() == item.name) {
                              for (var x in item.stop) {
                                  arrStops.push(item.stop[x].tag);
                              }
                              $("#routeStopSelect option").each(function () {
                                  if (arrStops.indexOf(this.value) == -1 && this.value !=0) {
                                      //alert(item.stop.indexOf(this.value));
                                      $("#routeStopSelect option[value='" + this.value + "']").remove();
                                  }
                              });
                          }
                      });
                     }
                  $(stopList).removeAttr('disabled');
                  $(stopList).val('0');

              },
              error: function () {
              }
          }
        );
        $("span").remove();
        $(".dropList").select2();
}

function loadArrivals() {
    var outputContainer = $('.js-next-bus-results');
    var results = "";

    $.ajax(
          {
              type: "GET",
              url: "https://retro.umoiq.com/service/publicJSONFeed",
              data: "command=predictions&a=jtafla&r=" + $("#routeSelect").val() + "&s=" + $("#routeStopSelect").val(),
              //contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                      document.getElementById('btnSave').style.visibility = "hidden";
                  }

                  else {
                      var direction = output['predictions'].direction;
                      results = results.concat("<p><strong>" + $("#routeSelect option:selected").text() + " - " + $("#routeStopSelect option:selected").text() + "</strong></p>");
                      if (direction == null) {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      else if (direction.length == null) {
                          if (output['predictions'].direction.prediction.length > 1) {
                              $.each(output['predictions'].direction.prediction, function (index, item) {
                                  results = results.concat("<p>" + output['predictions'].direction.title + " - "  + item.minutes + " minutes </p>");
                              });
                          }
                          else {
                              results = results.concat("<p>" + output['predictions'].direction.title + " - "  + output['predictions'].direction.prediction.minutes + " minutes </p>");
                          }
                      }
                      else{
                            $.each(output['predictions'].direction, function (count, d) {
                                if (d.prediction.length > 1) {
                                    $.each(d.prediction, function (index, item) {
                                    results = results.concat("<p>" + d.title + " - " + item.minutes + " minutes </p>");
                                    });
                                }
                                else {
                                    results = results.concat("<p>" + d.title + " - " + d.prediction.minutes + " minutes </p>");
                                }
                              });                          
                      }
                      if (results == "") {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      $(outputContainer).html(results).show();
                      document.getElementById('btnSave').style.visibility = "visible";
                  }
              }
          });
}

function saveFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var newFave = $('#routeSelect option:selected').val() + ">" + $("#routeStopSelect option:selected").val() + ":" + $('#routeSelect option:selected').text() + " > " + $("#routeDirectionSelect option:selected").text() + " > " + $("#routeStopSelect option:selected").text();
        if (favStop == null)
        {
            favStop = newFave;
        }   
        else if(favStop.indexOf(newFave) == -1)
        {
            favStop = favStop + "|" + newFave;               
        }
        else
        {
            $("#message").text('Stop is already favorited!!');
            return;
        }
        localStorage.setItem("Favorites", favStop);
        $("#message").text('Stop added to favorites!!');
}