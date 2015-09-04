
/*
antenna
	location
	emitted signal
	latency(device)

device
	location
	received signal


	
signal


source signal
*/


var antennas = [ {x:0, y:0}, {x:0, y:20}, {x:30, y:70}, {x:100, y:100}, {x:60, y:21}, {x:37, y:1}, {x:0, y:43},   ];

var devices = 
//[ { x:1, y:0} ];
[ { x:1, y:0}, {x:5, y:6} ];

var sourceSignals = 
//[ sineSignal(100, 50, 0, 100) ];
//[ sineSignal(100, 50, 0, 100), squareSignal() ];
[ sineSignal(100, 10, 0, 100), zeroSignal() ];
//draw(sourceSignal);


var plot = computeReceivedSignal(devices, sourceSignals, antennas);

function computeReceivedSignal(devices, sourceSignals, antennas) {
	var emittedSignals = []
	var receivedSignals = [];
	
	for (var j = 0; j < sourceSignals.length; j++) {
    for (var i = 0; i < antennas.length; i++) {
      var emitted = emittedSignal(sourceSignals[j], antennas[i], devices[j]);
      //console.debug(emitted);
      //if (i==1) { draw(emitted); }
      
      if (!emittedSignals[i]) { emittedSignals[i] = []; }
      emittedSignals[i][j] = emitted;
    }
	}
	
	var totalEmittedSignals = [];
	for (var i = 0; i < antennas.length; i++) {
	  totalEmittedSignals.push(sumSignals(emittedSignals[i]));
	}
	
	for (var i = 0; i < antennas.length; i++) {
	for (var k = 0; k < devices.length; k++) {
      var received = receivedSignal(totalEmittedSignals[i], antennas[i], devices[k]);
      //if (i==0) { draw(received); }
      
      if (!receivedSignals[k]) { receivedSignals[k] = []; }
      receivedSignals[k][i] = received;
      //if (k== 0 && i==0) { draw(receivedSignals[j][i]); }
	 }
	}
	
	//console.debug(receivedSignals);
	 var output = [];
	 for (var k = 0; k < devices.length; k++) {
    var total =  sumSignals(receivedSignals[k]);
    output.push(total);
    if (k == 1) { draw(total); }
   }
    return output;
}

function emittedSignal(sourceSignal, antenna, device) {
	var lat = latency(antenna, device);
	var maxLatency = 150;
	
	if (lat > maxLatency) {
		// TODO
		throw "TODO";
		return;
	}

	var compensatingDelay = Math.round(maxLatency - lat);
	var output = [];
	
	for (var t = 0; t < compensatingDelay; t++) {
		output.push(0);
	}
	for (var t = 0; t < sourceSignal.length; t++) {
		output.push(sourceSignal[t]);
	}
	return output;
}

function receivedSignal(emittedSignal, antenna, device) {
	var lat = Math.round(latency(antenna, device));
		var output = [];
	
	for (var t = 0; t < lat; t++) {
		output.push(0);
	}
		for (var t = 0; t < emittedSignal.length; t++) {
		output.push(emittedSignal[t]);
	}
	return output;
}

function sumSignals(signals) {
	var max = maxLength(signals);
	
	var output = [];
	for (var t = 0; t < max; t++) {	
		output.push(sum(signals, t));
	}
	
	return output;
}

function maxLength(arrays) {
	if (arrays.length == 1) {
		return arrays[0].length;
	}
	
	var rest = arrays.slice(1, arrays.length);
	return Math.max(arrays[0].length, maxLength(rest));
}

function sum(signals, t) {
	var total = 0;
	for (i=0; i < signals.length; i++) {
		if (signals[i].length > t) {
			total += signals[i][t];
		}
	}
	return total;
}

function latency(pos1, pos2) {
	return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

function sineSignal(intensity, period, delay, numSteps) {
	var output = [];
	for (var t = 0; t < numSteps; t++) {
		output.push(intensity * Math.sin((t - delay) / period * 2 * Math.PI));
	}
	return output;
}

function squareSignal() {
  var output= [ 100, 100, 100, 0, 0, 0, 100, 100, 100];
  return output;
}

function zeroSignal() {
  return [0, 0, 0, 0, 0];
}

function labels(numSteps) {
	var output = [];
	for (var t = 0; t < numSteps; t++) {
		output.push('');
	}
	return output;
}


function draw(plot) {

  var data = {
      labels: labels(plot.length),
      datasets: [
          {
              label: "My First dataset",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: plot
          },
      ]
  };

  Chart.defaults.global.showTooltips = false;

  var options = {};

  var ctx = document.getElementById("myChart").getContext("2d");
  var myLineChart = new Chart(ctx).Line(data, options);
}
