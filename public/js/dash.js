(function ($) {
  "use strict";

  var ctx1 = null;
  var ctx2 = null;
  var ctx3 = null;
  var ctx4 = null;

  var myChart1 = null;
  var myChart2 = null;
  var myChart3 = null;
  var myChart4 = null;

  var lastGetSCBA  = 0;
  var lastGetWatch = 0;

  try {
    ctx1 = document.getElementById("widgetAirPressure");
    if (ctx1) {
      ctx1.height = 130;
      myChart1 = new Chart(ctx1, {
        type: 'line',
        data: { labels: [], type: 'line', datasets: [{ data: [], label: 'Dataset', backgroundColor: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.55)', },] },
        options: {
          maintainAspectRatio: true,
          legend: { display: false },
          layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
          responsive: true,
          scales: {
            xAxes: [{ gridLines: { color: 'transparent', zeroLineColor: 'transparent' }, ticks: { fontSize: 2, max: 200, fontColor: 'transparent' } }],
            yAxes: [{ display: false, ticks: { display: false, } }]
          },
          title: { display: false, },
          elements: { line: { borderWidth: 0 }, point: { radius: 0, hitRadius: 10, hoverRadius: 4 } }
        }
      });
      getSCBA();
    }


    ctx2 = document.getElementById("widgetBattery");
    if (ctx2) {
      ctx2.height = 130;
      myChart2 = new Chart(ctx2, {
        type: 'line',
        data: { labels: [], type: 'line', datasets: [{ data: [], label: 'Dataset', backgroundColor: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.55)', },] },
        options: {
          maintainAspectRatio: true,
          legend: { display: false },
          layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
          responsive: true,
          scales: {
            xAxes: [{ gridLines: { color: 'transparent', zeroLineColor: 'transparent' }, ticks: { fontSize: 2, max: 200, fontColor: 'transparent' } }],
            yAxes: [{ display: false, ticks: { display: false, } }]
          },
          title: { display: false, },
          elements: { line: { borderWidth: 0 }, point: { radius: 0, hitRadius: 10, hoverRadius: 4 } }
        }
      });
    }

    ctx3 = document.getElementById("widgetTemperature");
    if (ctx3) {
      ctx3.height = 130;
      myChart3 = new Chart(ctx3, {
        type: 'line',
        data: { labels: [], type: 'line', datasets: [{ data: [], label: 'Dataset', backgroundColor: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.55)', },] },
        options: {
          maintainAspectRatio: true,
          legend: { display: false },
          layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
          responsive: true,
          scales: {
            xAxes: [{ gridLines: { color: 'transparent', zeroLineColor: 'transparent' }, ticks: { fontSize: 2, max: 200, fontColor: 'transparent' } }],
            yAxes: [{ display: false, ticks: { display: false, } }]
          },
          title: { display: false, },
          elements: { line: { borderWidth: 0 }, point: { radius: 0, hitRadius: 10, hoverRadius: 4 } } }
      });
    }

    ctx4 = document.getElementById("widgetHeartRate");
    if (ctx4) {
      ctx4.height = 130;
      myChart4 = new Chart(ctx4, {
        type: 'line',
        data: { labels: [], type: 'line', datasets: [{ data: [], label: 'Dataset', backgroundColor: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.55)', },] },
        options: {
          maintainAspectRatio: true,
          legend: { display: false },
          layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
          responsive: true,
          scales: {
            xAxes: [{ gridLines: { color: 'transparent', zeroLineColor: 'transparent' }, ticks: { fontSize: 2, max: 200, fontColor: 'transparent' } }],
            yAxes: [{ display: false, ticks: { display: false, } }]
          },
          title: { display: false, },
          elements: { line: { borderWidth: 0 }, point: { radius: 0, hitRadius: 10, hoverRadius: 4 } }
        }
      });
      getWatch();
    }

  } catch (error) {
    console.log(error);
  }

  function addChartData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
  }

  function removeChartData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
  }

/////////////////////////////////////////////////////////////////////////////////////
// 
// hyhwang
//
  function getSCBA () {
    var uuid = document.getElementById("uuid").innerHTML;
    var url = "/json/scba/?uuid=" + uuid + "&timestamp="+lastGetSCBA+"&limit=10";
    console.log(url);
    $.getJSON(url, function(data) {
      console.log(data.length);
      if(data.length > 0) {
        data.forEach((t) => {
          console.log(t);
          document.getElementById("airpressure").innerHTML = t.pressure;
          document.getElementById("battery").innerHTML = t.lv_battery;
          document.getElementById("temperature").innerHTML = t.lv_temperature;
          addChartData(myChart1,"Pressure", t.pressure);
          addChartData(myChart2,"Battery", t.lv_battery);
          addChartData(myChart3,"Temperature", t.lv_temperature);
        });
      } else {
        document.getElementById("airpressure").innerHTML = 0;
        document.getElementById("battery").innerHTML = 0;
        document.getElementById("temperature").innerHTML = 0;
        addChartData(myChart1,"Pressure", 0);
        addChartData(myChart2,"Battery", 0);
        addChartData(myChart3,"Temperature", 0);
      }
    });
    lastGetSCBA = Math.round((new Date()).getTime() / 1000);
    setTimeout(getSCBA, 5000);
  }

  function getWatch () {
    var uuid = document.getElementById("uuid").innerHTML;
    var url = "/json/watch/?uuid=" + uuid + "&timestamp="+lastGetWatch+"&limit=100";
    console.log(url);
    $.getJSON(url, function(data) {
      var flag_hrm = 0;
      var flag_accel = 0;
      var flag_gyro = 0;
      var flag_pressure = 0;
      var flag_light = 0;
      if(data.length > 0) {
        data.forEach((t) => {
          if (t.name == 'hrm' && flag_hrm == 0) {
            console.log (t);
            document.getElementById("heartrate").innerHTML = parseInt(t.v1,10);
            addChartData(myChart4,"HeartRate", parseInt(t.v1,10));
            document.getElementById("hrm").innerHTML = parseInt(t.v1,10);
            flag_hrm = 1;
          }
          if (t.name == 'accel' && flag_accel == 0) {
            document.getElementById("accel").innerHTML = t.v1 + ", " + t.v2 + ", " + t.v3;
            flag_accel = 1;
          }
          if (t.name == 'gyro' && flag_gyro == 0) {
            document.getElementById("gyro").innerHTML = t.v1 + ", " + t.v2 + ", " + t.v3;
            flag_gyro = 1;
          }
          if (t.name == 'pressure' && flag_pressure == 0) {
            document.getElementById("barometer").innerHTML = t.v1 + ", " + t.v2 + ", " + t.v3;
            flag_pressure = 1;
          }
          if (t.name == 'light' && flag_light == 0) {
            document.getElementById("light").innerHTML = parseInt(t.v1,10);
            flag_light = 1;
          }
        });
      } else {
        document.getElementById("heartrate").innerHTML = 0;
        addChartData(myChart4,"HeartRate", 0);
      }
    });
    lastGetWatch = Math.round((new Date()).getTime() / 1000);
    setTimeout(getWatch, 5000);
  }
})(jQuery);

(function ($) {
    "use strict";
    $(".animsition").animsition({
      inClass: 'fade-in',
      outClass: 'fade-out',
      inDuration: 900,
      outDuration: 900,
      linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])',
      loading: true,
      loadingParentElement: 'html',
      loadingClass: 'page-loader',
      loadingInner: '<div class="page-loader__spin"></div>',
      timeout: false,
      timeoutCountdown: 5000,
      onLoadEvent: true,
      browser: ['animation-duration', '-webkit-animation-duration'],
      overlay: false,
      overlayClass: 'animsition-overlay-slide',
      overlayParentElement: 'html',
      transition: function (url) {
        window.location.href = url;
      }
    });
})(jQuery);

(function ($) {
  "use strict";

  var teams = null;
  var member = [];
  var lastGetTeams  = 0;

  try {
    teams = document.getElementById("teams");
    if (teams) {
      getTeams();
    }
  } catch (error) {
    console.log(error);
  }

  function getLocation (member) {
    console.log (member);
    for(var i = 0; i < member.length; i++) {
      console.log("/json/location?uuid=" + member[i].uuid);
      $.getJSON("/json/location?uuid=" + member[i].uuid, function (data) {
        console.log(data);
        data.forEach((t) => {
          scbaMarker (t.v2, t.v1);
        });
      });
    }
  }

  function getTeams () {
    var url = "/json/teams";
    console.log(url);
    $.getJSON(url, function(data) {
      var s = '<table class="table table-bordered table-striped">';
          s+= '<thead><tr><td>#</td><td>uuid</td><td>timestamp</td><td>status</td></tr></thead>';
      var cnt = 1;
      member = [];
      data.forEach((t) => {
        console.log(t);
        s += '<tr>';
        s += '<td>' + cnt+ '</td>';
        s += '<td><a href="/scba/?uuid=' + t.uuid + '">' + t.uuid+ '</a></td>';
        s += '<td>' + t.ts + '</td>';
        if (t.audit < 300) {
        s += '<td><div class="led-green"></td>';
        }
        else {
        s += '<td><div class="led-red"></td>';
        }
        s += '</tr>';
        cnt += 1;
        member.push(t);
      });
      s += '</table>';
      document.getElementById("teams").innerHTML = s;
      console.log (member);
      getLocation (member);
    });

    lastGetTeams = Math.round((new Date()).getTime() / 1000);
    setTimeout(getTeams, 5000);
  }
})(jQuery);

(function ($) {
  "use strict";

  var uuid = "";
  var lastGetUUID  = 0;

  try {
    uuid = document.getElementById("uuid").innerHTML;
    console.log (uuid);
    if (uuid) {
      getLocationUUID();
    }
  } catch (error) {
    console.log(error);
  }

  function getLocationUUID () {
    console.log (uuid);
    console.log("/json/location?uuid=" + uuid);
    $.getJSON("/json/location?uuid=" + uuid, function (data) {
      console.log(data);
      data.forEach((t) => {
        document.getElementById("gps").innerHTML = t.v2 + ", " + t.v1;
        scbaMarker (t.v2, t.v1);
      });
    });
    lastGetUUID = Math.round((new Date()).getTime() / 1000);
    setTimeout(getLocationUUID, 5000);
  }

})(jQuery);

(function ($) {
  $('#button').click (function() {
    var text = $('#comment1').val();
    console.log(text);

    $.getJSON("/json/comment?text=" + text, function (data) {
      //document.getElementById("button").innerHTML = data;
    });
  });

  $('#select').change (function() {
    var text = $(this).val();

    $.getJSON("/json/rtsp?text=" + text, function (data) {
      //document.getElementById("button").innerHTML = data;
    });
  });
})(jQuery);

