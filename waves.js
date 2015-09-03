
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







function sineSignal(intensity, period, delay, numSteps) {
	var output = [];
	for (var t = 0; t < numSteps; t++) {
		output.push(intensity * Math.sin((t - delay) / period * 2 * Math.PI));
	}
	return output;
}

function labels(numSteps) {
	var output = [];
	for (var t = 0; t < numSteps; t++) {
		output.push('');
	}
	return output;
}

var sine = sineSignal(100, 50, 0, 100);


var data = {
    labels: labels(100),
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: sine
        },

    ]
};

Chart.defaults.global.showTooltips = false;

var options = {};

var ctx = document.getElementById("myChart").getContext("2d");
var myLineChart = new Chart(ctx).Line(data, options);

