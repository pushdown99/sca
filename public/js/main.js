
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
    var url = "/json/scba/?timestamp="+lastGetSCBA+"&limit=10";
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
    var url = "/json/watch/?timestamp="+lastGetWatch+"&limit=10";
    console.log(url);
    $.getJSON(url, function(data) {
      console.log(data);
      if(data.length > 0) {
        data.forEach((t) => {
          if (t.name == 'heartrate') {
          console.log (t);
          document.getElementById("heartrate").innerHTML = parseInt(t.v1,10);
          addChartData(myChart4,"HeartRate", parseInt(t.v1,10));
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

/*
(function ($) {
  "use strict";

  try {
    var vmap = $('#vmap');
    if(vmap[0]) {
      vmap.vectorMap( {
        map: 'world_en',
        backgroundColor: null,
        color: '#ffffff',
        hoverOpacity: 0.7,
        selectedColor: '#1de9b6',
        enableZoom: true,
        showTooltip: true,
        values: sample_data,
        scaleColors: [ '#1de9b6', '#03a9f5'],
        normalizeFunction: 'polynomial'
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    var vmap1 = $('#vmap1');
    if(vmap1[0]) {
      vmap1.vectorMap( {
        map: 'europe_en',
        color: '#007BFF',
        borderColor: '#fff',
        backgroundColor: '#fff',
        enableZoom: true,
        showTooltip: true
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    var vmap2 = $('#vmap2');
    if(vmap2[0]) {
      vmap2.vectorMap( {
        map: 'usa_en',
        color: '#007BFF',
        borderColor: '#fff',
        backgroundColor: '#fff',
        enableZoom: true,
        showTooltip: true,
        selectedColor: null,
        hoverColor: null,
        colors: {
            mo: '#001BFF',
            fl: '#001BFF',
            or: '#001BFF'
        },
        onRegionClick: function ( event, code, region ) {
            event.preventDefault();
        }
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    var vmap3 = $('#vmap3');
    if(vmap3[0]) {
      vmap3.vectorMap( {
        map: 'germany_en',
        color: '#007BFF',
        borderColor: '#fff',
        backgroundColor: '#fff',
        onRegionClick: function ( element, code, region ) {
            var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
            alert( message );
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  
  try {
    var vmap4 = $('#vmap4');
    if(vmap4[0]) {
      vmap4.vectorMap( {
        map: 'france_fr',
        color: '#007BFF',
        borderColor: '#fff',
        backgroundColor: '#fff',
        enableZoom: true,
        showTooltip: true
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    var vmap5 = $('#vmap5');
    if(vmap5[0]) {
      vmap5.vectorMap( {
        map: 'russia_en',
        color: '#007BFF',
        borderColor: '#fff',
        backgroundColor: '#fff',
        hoverOpacity: 0.7,
        selectedColor: '#999999',
        enableZoom: true,
        showTooltip: true,
        scaleColors: [ '#C8EEFF', '#006491' ],
        normalizeFunction: 'polynomial'
      });
    }
  } catch (error) {
    console.log(error);
  }
  
  try {
    var vmap6 = $('#vmap6');
    if(vmap6[0]) {
      vmap6.vectorMap( {
        map: 'brazil_br',
        color: '#007BFF',
        borderColor: '#fff',
        backgroundColor: '#fff',
        onRegionClick: function ( element, code, region ) {
            var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
            alert( message );
        }
      });
    }

  } catch (error) {
    console.log(error);
  }
})(jQuery);
*/

/*
(function ($) {
  "use strict";
  try {
    var progressbarSimple = $('.js-progressbar-simple');
    progressbarSimple.each(function () {
      var that = $(this);
      var executed = false;
      $(window).on('load', function () {

        that.waypoint(function () {
          if (!executed) {
            executed = true;
            that.progressbar({
              update: function (current_percentage, $this) {
                $this.find('.js-value').html(current_percentage + '%');
              }
            });
          }
        }, {
            offset: 'bottom-in-view'
          });

      });
    });
  } catch (err) {
    console.log(err);
  }
})(jQuery);

(function ($) {
  "use strict";
  try {
    var jscr1 = $('.js-scrollbar1');
    if(jscr1[0]) {
      const ps1 = new PerfectScrollbar('.js-scrollbar1');      
    }
    var jscr2 = $('.js-scrollbar2');
    if (jscr2[0]) {
      const ps2 = new PerfectScrollbar('.js-scrollbar2');

    }
  } catch (error) {
    console.log(error);
  }
})(jQuery);

(function ($) {
  "use strict";

  try {
    $(".js-select2").each(function () {
      $(this).select2({
        minimumResultsForSearch: 20,
        dropdownParent: $(this).next('.dropDownSelect2')
      });
    });

  } catch (error) {
    console.log(error);
  }
})(jQuery);

(function ($) {
  "use strict";
  try {
    var menu = $('.js-item-menu');
    var sub_menu_is_showed = -1;

    for (var i = 0; i < menu.length; i++) {
      $(menu[i]).on('click', function (e) {
        e.preventDefault();
        $('.js-right-sidebar').removeClass("show-sidebar");        
        if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
          $(this).toggleClass('show-dropdown');
          sub_menu_is_showed = -1;
        }
        else {
          for (var i = 0; i < menu.length; i++) {
            $(menu[i]).removeClass("show-dropdown");
          }
          $(this).toggleClass('show-dropdown');
          sub_menu_is_showed = jQuery.inArray(this, menu);
        }
      });
    }
    $(".js-item-menu, .js-dropdown").click(function (event) {
      event.stopPropagation();
    });

    $("body,html").on("click", function () {
      for (var i = 0; i < menu.length; i++) {
        menu[i].classList.remove("show-dropdown");
      }
      sub_menu_is_showed = -1;
    });
  } catch (error) {
    console.log(error);
  }

  var wW = $(window).width();
    var right_sidebar = $('.js-right-sidebar');
    var sidebar_btn = $('.js-sidebar-btn');

    sidebar_btn.on('click', function (e) {
      e.preventDefault();
      for (var i = 0; i < menu.length; i++) {
        menu[i].classList.remove("show-dropdown");
      }
      sub_menu_is_showed = -1;
      right_sidebar.toggleClass("show-sidebar");
    });

    $(".js-right-sidebar, .js-sidebar-btn").click(function (event) {
      event.stopPropagation();
    });

    $("body,html").on("click", function () {
      right_sidebar.removeClass("show-sidebar");
    });

  try {
    var arrow = $('.js-arrow');
    arrow.each(function () {
      var that = $(this);
      that.on('click', function (e) {
        e.preventDefault();
        that.find(".arrow").toggleClass("up");
        that.toggleClass("open");
        that.parent().find('.js-sub-list').slideToggle("250");
      });
    });

  } catch (error) {
    console.log(error);
  }

  try {
    $('.hamburger').on('click', function () {
      $(this).toggleClass('is-active');
      $('.navbar-mobile').slideToggle('500');
    });
    $('.navbar-mobile__list li.has-dropdown > a').on('click', function () {
      var dropdown = $(this).siblings('ul.navbar-mobile__dropdown');
      $(this).toggleClass('active');
      $(dropdown).slideToggle('500');
      return false;
    });
  } catch (error) {
    console.log(error);
  }
})(jQuery);

(function ($) {
  "use strict";
  try {
    var list_load = $('.js-list-load');
    if (list_load[0]) {
      list_load.each(function () {
        var that = $(this);
        that.find('.js-load-item').hide();
        var load_btn = that.find('.js-load-btn');
        load_btn.on('click', function (e) {
          $(this).text("Loading...").delay(1500).queue(function (next) {
            $(this).hide();
            that.find(".js-load-item").fadeToggle("slow", 'swing');
          });
          e.preventDefault();
        });
      })
    }
  } catch (error) {
    console.log(error);
  }

})(jQuery);

(function ($) {
  "use strict";

  try {
    $('[data-toggle="tooltip"]').tooltip();

  } catch (error) {
    console.log(error);
  }

  try {
    var inbox_wrap = $('.js-inbox');
    var message = $('.au-message__item');
    message.each(function(){
      var that = $(this);

      that.on('click', function(){
        $(this).parent().parent().parent().toggleClass('show-chat-box');
      });
    });
  } catch (error) {
    console.log(error);
  }
})(jQuery);
*/
