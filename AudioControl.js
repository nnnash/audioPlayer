function AudioControl() {
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var source = null;
    var audioBuffer = null;
    var gainNode = null;
    var equalizer = null;
    var played = false;

    this.initSound = function(arrayBuffer, callback) {
        context.decodeAudioData(arrayBuffer, function(buffer) {
            audioBuffer = buffer;
            if(!!callback) callback(buffer);
	        //Эквалайзер
	        equalizer = new Equalizer();
	        equalizer.init(context);
	        //Громкость
	        gainNode = context.createGain();
        }, function(e) {
            alert('Ошибка при декодировании файла!');
        }); 
    };

    this.play = function(){
        source = context.createBufferSource(); 
        source.buffer = audioBuffer;
        source.loop = false;
        equalizer.connect(source, gainNode);
        gainNode.connect(context.destination);
    	source.start();
    	played = true;
    };

    this.stop = function(){
    	if (!!source && played === true) source.stop();
    	played = false;
    };

    this.setEqualizer = function(name) {
        if (!equalizer) return;
        equalizer.setGenre(name);
    };

    this.changeVolume = ChangeVolume;

    function ChangeVolume(value) {
    	if (!gainNode) return;
        gainNode.gain.value = value;
    };


}