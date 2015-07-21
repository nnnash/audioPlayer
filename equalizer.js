function Equalizer(){
	var PRED = {
		rock: [5, 4, 3, 1, 0, -1, 1, 3, 4, 5],
		jazz: [4, 3, 2, 3, -2, -2, 0, 1, 3, 4],
		pop: [-2, -1, 0, 3, 4, 4, 2, 0, -1, -2],
		classic: [5, 4, 3, 2, -2, -2, 0, 3, 4, 4],
		normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	};

	var filters;
	var context;

	this.init = function(aContext) {
		context = aContext;
		var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
		filters = frequencies.map(createFilter);

		filters.reduce(function (prev, curr) {
			prev.connect(curr);
			return curr;
		});
	};
	this.connect = function(source, destination){
		source.connect(filters[0]);
		filters[filters.length - 1].connect(destination);
	};
	this.setGenre = function(genreName){
		filters.forEach(function(item, i, arr){
			if(!PRED[genreName][i]) return;
			item.gain.value = PRED[genreName][i];
		});
	};

	var createFilter = function (frequency) {
		var filter = context.createBiquadFilter();
		filter.type = 'peaking'; // тип фильтра
		filter.frequency.value = frequency; // частота
		filter.Q.value = 1; // Q-factor
		filter.gain.value = 0;
		return filter;
	};

}