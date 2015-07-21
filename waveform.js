function Waveform(){
    var FILL_COLOR = "#102F5D";
    var WAVE_COLOR = "#14A386";

	var width;
	var height;
    var canvas;
    var canvasCtx;
    
    this.init = function(container) {
        width = container.width();
        height = container.height();
	    canvas = createCanvas (width, height);
	    container[0].appendChild(canvas);
	    canvasCtx = canvas.getContext('2d');
    };

    this.drawWaveform = function(buffer) {
    	var leftChannel = buffer.getChannelData(0); 
        var lineOpacity = width / leftChannel.length  ;      
        canvasCtx.save();
        canvasCtx.fillStyle = FILL_COLOR ;
        canvasCtx.fillRect(0, 0, width, height);
        canvasCtx.strokeStyle = WAVE_COLOR;
        canvasCtx.globalCompositeOperation = 'lighter';
        canvasCtx.translate(0, height / 2);
        var diff = leftChannel.length > width ? Math.floor (leftChannel.length / width)  : 1;
        var average = 0, averageCount = 0;
        var x = 0, y = 0;
        for (var i=0; i<  leftChannel.length; i++) {
            y = leftChannel[i] * height;
            if (y >= 0) {
                average += y;
                averageCount++;
            }
            if (i % diff === 0) {
                y = average / averageCount;
                canvasCtx.beginPath();
                canvasCtx.moveTo( x  , 0 );
                canvasCtx.lineTo( x, y );
                canvasCtx.moveTo( x, 0 );
                canvasCtx.lineTo( x, -y );
                canvasCtx.stroke();
                x++;
                average = 0;
                averageCount = 0;
            }
        }
        canvasCtx.restore();
    };

    this.clear = function() {
        canvasCtx.fillStyle = FILL_COLOR ;
        canvasCtx.fillRect(0, 0, width, height);
        canvasCtx.restore();
    };

    function createCanvas (w, h) {
        var newCanvas = document.createElement('canvas');
        newCanvas.width = w;    
        newCanvas.height = h;
        return newCanvas;
    }
}