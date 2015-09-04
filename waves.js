
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


var antennas = [ {x:0, y:0}, {x:0, y:10}, {x:10, y:0}, {x:10, y:10} ];

var devices = [ { x:0, y:0} ];

var sourceSignal = sineSignal(100, 50, 0, 100);
//var sourceSignal = squareSignal();
//draw(sourceSignal);

var plot = computeReceivedSignal(devices[0], sourceSignal, antennas);

function computeReceivedSignal(device, sourceSignal, antennas) {
	var receivedSignals = [];
	for (var i = 0; i < antennas.length; i++) {
		var emitted = emittedSignal(sourceSignal, antennas[i], device);
		//console.debug(emitted);
		//if (i==1) { draw(emitted); }
		
		var received = receivedSignal(emitted, antennas[i], device);
		//if (i==1) { draw(received); }
		
		receivedSignals.push(received);
	}
	//console.debug(receivedSignals);
    var total =  totalReceivedSignal(receivedSignals);
    draw(total);
    return total;
}

function emittedSignal(sourceSignal, antenna, device) {
	var lat = latency(antenna, device);
	var maxLatency = 15;
	

	
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

function totalReceivedSignal(signals) {
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
