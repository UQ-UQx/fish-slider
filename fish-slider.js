(function() {
  var popPlot;
  var catchPlot;
  var numFish = 0;

  function animateFish(fishid) {
    var theDiv = $('#fish-' + fishid),
      theContainer = $('#fish-tank-container'),
      maxLeft = theContainer.width() - theDiv.width(),
      maxTop = theContainer.height() - theDiv.height(),
      leftPos = Math.floor(Math.random() * maxLeft),
      topPos = Math.floor(Math.random() * maxTop);

    if (theDiv.position().left < leftPos) {
      theDiv.addClass('flipped');
    } else {
      theDiv.removeClass('flipped');
    }

    theDiv.animate({
      'left': leftPos,
      'top': topPos,
    }, Math.floor(Math.random() * 20000) + 10000, function() {
      animateFish(fishid);
    });
  }

  function swapFish(r) {
    if ((r >= 0.05) && (r < 0.25)) {
      $('.fish').attr('src', 'grouper.png');
    }
    else if ((r >= 0.25) && (r < 0.4)) {
      $('.fish').attr('src', 'coral-trout.png');
    }
    else {
      $('.fish').attr('src', 'parrotfish.png');
    }
  }

  function fishDisplay(num) {
	  var displayNum = Math.ceil((num / 10));

    for (var i = 1; i <= displayNum; i++) {
      $('#fish-' + i).css('visibility', 'visible');
    }

    for (var i = displayNum + 1; i <= 15; i++) {
      $('#fish-' + i).css('visibility', 'hidden');
    }
  }

  function plotGraph(r, nInit, e) {
    var nFinal = nInit;
    var catchAmt = 0;
    var dataRow = [[0, nInit]];
    var pointRow = [[0, nInit]];
    var catchDataRow = [[0, 0]];
    var catchPointRow = [[0, 0]];

    for (var i = 1; i <= 80; i++) {
      nFinal = nInit + (r * nInit * (1 - (nInit / 100))) - (e * nInit);
      catchAmt = e * nInit;

      if (nFinal < 0) {
        nFinal = 0;
      }

  	  nInit = nFinal;
      dataRow.push([i, nFinal]);
      catchDataRow.push([i, catchAmt]);

      if ((i % 10) === 0) {
        pointRow.push([i, nFinal]);
        catchPointRow.push([i, catchAmt])
      }
    }

    var plotOptions = {
      points: {
        radius: 2,
        color: '#D9007A'
      },
      grid: { 
        hoverable: true,
        clickable: true,
        autoHighlight: true,
      },
      xaxis: {
	    min: 0,
	    max: 80,
      },
      yaxis: {
	    min: 0,
	    max: 150,
      }
    };

    // Plot the chart.
    popPlot = $.plot($('#plot-holder'), [{
        data: dataRow,
        yaxis: 2,
        xaxis: 1,
        lines: {
          show: true
        },
        points: {
          show: false
        }
      }, {
        data: pointRow,
        yaxis: 2,
        xaxis: 1,
        lines: {
          show: false
        },
        points: {
          show: true
        },
        color:'#D9007A'
      }],
      plotOptions
    );

    var catchPlotOptions = {
      points: {
        radius: 2,
        color: '#D9007A'
      },
      grid: { 
        hoverable: true,
        clickable: true,
        autoHighlight: true,
      },
      xaxis: {
      min: 0,
      max: 80,
      },
      yaxis: {
      min: 0,
      max: 30,
      }
    };

    // Plot the chart.
    catchPlot = $.plot($('#catch-plot-holder'), [{
        data: catchDataRow,
        yaxis: 2,
        xaxis: 1,
        lines: {
          show: true
        },
        points: {
          show: false
        }
      }, {
        data: catchPointRow,
        yaxis: 2,
        xaxis: 1,
        lines: {
          show: false
        },
        points: {
          show: true
        },
        color:'#D9007A'
      }],
      catchPlotOptions
    );

    var dataSeries = popPlot.getData();

    popPlot.getData()[0].highlightColor = '#6C6C6C';
    popPlot.getData()[1].highlightColor = '#6C6C6C';
    catchPlot.getData()[0].highlightColor = '#6C6C6C';
    catchPlot.getData()[1].highlightColor = '#6C6C6C';
    popPlot.highlight(dataSeries[1], [dataSeries[1].data[0][0], dataSeries[1].data[0][1]]);

    numFish = dataSeries[1].data[0][1];
    fishDisplay(numFish);

    $('#selected-point').html('<b>Selected point:</b> t = ' + dataSeries[1].data[0][0] + ', N<sub>t+1</sub> = ' + dataSeries[1].data[0][1]);
  }

  $(document).ready(function() {
    $('#r-slider').slider({
      orientation: 'vertical',
      range: 'min',
      min: 0.05,
      max: 0.95,
      step: 0.01,
      value: 0.3,
      animate: 'fast',
      slide: function(event, ui) {
	    $('#r-slider-value').val(ui.value);
	    plotGraph(parseFloat(ui.value), parseInt($('#nt-slider').slider('value')), parseFloat($('#e-slider').slider('value'))); 
	    swapFish(ui.value);
      }
    });

    $('#nt-slider').slider({
      orientation: 'vertical',
      range: 'min',
      min: 1,
      max: 150,
      step: 1,
      value: 50,
      animate: 'fast',
      slide: function(event, ui) {
        $('#nt-slider-value').val(ui.value);
        plotGraph(parseFloat($('#r-slider').slider('value')), parseInt(ui.value), parseFloat($('#e-slider').slider('value')));
      }
    });

    $('#e-slider').slider({
      orientation: 'vertical',
      range: 'min',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0,
      animate: 'fast',
      slide: function(event, ui) {
        $('#e-slider-value').val(ui.value);
        plotGraph(parseFloat($('#r-slider').slider('value')), parseInt($('#nt-slider').slider('value')), parseFloat(ui.value));
      }
    });

    $('#r-slider-value').val($('#r-slider').slider('value'));
    $('#nt-slider-value').val($('#nt-slider').slider('value'));
    $('#e-slider-value').val($('#e-slider').slider('value'));

    fishDisplay($('#nt-slider').slider('value'));

    $('#r-slider-value').change(function() {
      $('#r-slider').slider('value', $('#r-slider-value').val());
      plotGraph(parseFloat($('#r-slider').slider('value')), parseInt($('#nt-slider').slider('value')), parseFloat($('#e-slider').slider('value')));
    });

    $('#nt-slider-value').change(function() {
      $('#nt-slider').slider('value', $('#nt-slider-value').val());
      plotGraph(parseFloat($('#r-slider').slider('value')), parseInt($('#nt-slider').slider('value')), parseFloat($('#e-slider').slider('value')));
    });

    $('#e-slider-value').change(function() {
      $('#e-slider').slider('value', $('#e-slider-value').val());
      plotGraph(parseFloat($('#r-slider').slider('value')), parseInt($('#nt-slider').slider('value')), parseFloat($('#e-slider').slider('value')));
    });

    plotGraph(parseFloat($('#r-slider').slider('value')), parseInt($('#nt-slider').slider('value')), parseFloat($('#e-slider').slider('value')));

    // Mouseover to see population size.
    var previousPoint = null;

    $('#plot-holder').bind('plothover', function (event, pos, item) {
      if (item) {
        if (previousPoint != item.dataIndex) {
          previousPoint = item.dataIndex;
          var x = item.datapoint[0];
          var y = Math.round(item.datapoint[1]);
          $('#hover-info').html('t = ' + x + ', N<sub>t+1</sub> = ' + y);
          fishDisplay(y);
        }
      }
      else {
        $('#hover-info').html('<b>Hover over line to see N<sub>t+1</sub></b>');
        previousPoint = null;
        fishDisplay(numFish);
      }
    });

    $('#catch-plot-holder').bind('plothover', function (event, pos, item) {
      if (item) {
        if (previousPoint != item.dataIndex) {
          previousPoint = item.dataIndex;
          var x = item.datapoint[0];
          var y = Math.round(item.datapoint[1]);
          $('#catch-hover-info').html('t = ' + x + ', C<sub>t</sub> = ' + y);
        }
      }
      else {
        $('#catch-hover-info').html('<b>Hover over line to see C<sub>t</sub></b>');
        previousPoint = null;
        fishDisplay(numFish);
      }
    });

    $('#plot-holder').bind('plotclick', function (event, pos, item) {
      if (item) {
        popPlot.unhighlight();
        popPlot.highlight(item.series, item.datapoint);
        $('#selected-point').html('<b>Selected point:</b> t = ' + item.datapoint[0] + ', N<sub>t+1</sub> = ' + Math.round(item.datapoint[1]));
        numFish = Math.round(item.datapoint[1]);
        fishDisplay(Math.round(item.datapoint[1]));
      }
    });

    for (var i = 1; i <= 15; i++) {
      animateFish(i);
    }
  });
}) (jQuery);