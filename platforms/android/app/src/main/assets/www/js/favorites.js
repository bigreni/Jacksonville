function loadFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split(":");
        arrIds = arrStops[0].split(">");
        //arrText = arrStops[1].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right; color:white;"><span class="glyphicon glyphicon-trash"></span></button><a href="javascript:loadFaveArrivals(' + arrIds[0] + "," + arrIds[1] + ",'" + arrStops[1].trim() + "'" + ');" class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}

function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadFaveArrivals(route,stop, dir)
{
    var outputContainer = $('.js-next-bus-results');
    var results = "";
    arrText = dir.split(">");

    $.ajax(
          {
              type: "GET",
              url: "https://retro.umoiq.com/service/publicJSONFeed",
              data: "command=predictions&a=jtafla&r=" + route + "&s=" + stop,
              //contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                  }

                  else {
                      var direction = output['predictions'].direction;
                      results = results.concat("<p><strong>" + dir + "</strong></p>");
                      results = results.concat('<table id="tblResults" cellpadding="0" cellspacing="0">')
                      results = results.concat('<tr class="header"><th>ROUTE</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="2"></td></tr>');
                      if (direction == null) {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      else if (direction.length == null) {
                          if (output['predictions'].direction.prediction.length > 1) {
                              $.each(output['predictions'].direction.prediction, function (index, item) {
                                  //results = results.concat("<p>" + output['predictions'].direction.title + " - "  + item.minutes + " minutes </p>");
                                  results = results.concat('<tr class="predictions">');
                                  results = results.concat("<td>" + output['predictions'].direction.title + "</td>"  + "<td>" + item.minutes + " minutes</td>");
                                  results = results.concat('</tr><tr><td class="spacer" colspan="2"></td></tr>');              
                                });
                          }
                          else {
                            //   results = results.concat("<p>" + output['predictions'].direction.title + " - " + output['predictions'].direction.prediction.minutes + " minutes </p>");
                              results = results.concat('<tr class="predictions">');
                              results = results.concat("<td>" + output['predictions'].direction.title + "</td>"  + "<td>" + output['predictions'].direction.prediction.minutes + " minutes</td></tr>");
                          }
                      }
                      else
                      {
                        $.each(output['predictions'].direction, function (count, d) {
                                if (d.prediction.length > 1) {
                                    $.each(d.prediction, function (index, item) {
                                    //results = results.concat("<p>" + d.title + " - " + item.minutes + " minutes </p>");
                                    results = results.concat('<tr class="predictions">');
                                    results = results.concat("<td>" + d.title + "</td>"  + "<td>" + item.minutes  + " minutes</td>");
                                    results = results.concat('</tr><tr><td class="spacer" colspan="2"></td></tr>');
                                });
                                }
                                else {
                                    // results = results.concat("<p>" + d.title + " - " + d.prediction.minutes + " minutes </p>");
                                    results = results.concat('<tr class="predictions">');
                                    results = results.concat("<td>" + d.title + "</td>"  + "<td>" + d.prediction.minutes + " minutes</td></tr>");
                                }
                              });
                      }

                      if (results == "") {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      $(outputContainer).html(results).show();
                  }
              }
          });
}

