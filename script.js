$(document).ready(function() {

    //аудио
    var audio = new AudioControl();
    //визуализация
    var waveform = new Waveform();
    waveform.init($('#canvas'));
    
    var dropZone = $('#dropZone');
    
    dropZone[0].ondragover = function() {
        dropZone.addClass('hover');
        return false;
    };
    
    dropZone[0].ondragleave = function() {
        dropZone.removeClass('hover');
        return false;
    };
    
    dropZone[0].ondrop = function(event) {
        event.preventDefault();
        dropZone.removeClass('hover');
        
        var file = event.dataTransfer.files[0];
        if(!file) {
            alert('Это не файл!');
            return;
        }
        if (file.type.substring(0,5).toLowerCase() != 'audio') {
            alert('Это не аудио файл!');
            return;
        }
        dropZone.addClass('drop');
        readFile(file);
        dropZone.removeClass('drop');
    };

    $('input[type="file"]').on('change', function(e) {  
        readFile(e.target.files[0]);
    });
    $('#start').on('click', function(e) {
        togglePlayback(true);
    });
    $('#stop').on('click', function(e) {  
        togglePlayback(false);
    });
    $('#volume').on('input', function(){
        changeVolume(this);
    });
    $('#equalizer td').click(function(e){
        $('#equalizer td.chosen').removeClass('chosen');
        $(e.target).addClass('chosen');
        audio.setEqualizer(e.target.id);
    });
    $('#clear').click(function(e){
        togglePlayback(false);
        $('#loadFileLayout').show();
        $('#playFileLayout').hide();
        waveform.clear();
        $('#equalizer #normal').click();
    });

    function readFile(file) {
        audio.stop();
        $('#loading').show();
        var reader = new FileReader();
        reader.onload = (function(f) {
            return function(e){
                audio.initSound(e.target.result, function(buffer){
                    $('button').prop('disabled', false);
                    $('#loading').hide();
                    $('#loadFileLayout').hide();
                    $('#playFileLayout').show();
                    waveform.drawWaveform(buffer);
                });
                parse_audio_metadata(f, function(metadata) {
                    fillMetadata(metadata);
                }, function(){
                    fillMetadata({title: file.name});
                });
            }
        })(file);
        reader.readAsArrayBuffer(file);
    }

    function changeVolume(element) {
        var volume = +element.value;
        var fraction = volume / 100;
        audio.changeVolume(fraction * fraction);
    }

    function fillMetadata(data) {
        $('#metadata>#name').text(!!data.artist ? "-" + data.title : '');
        $('#metadata>#artist').text(!!data.artist ? data.artist : data.title);
        if (data.album) {
            var ay = data.album;
            if (data.year) ay += " (" + data.year + ")";
        } else {
            ay = !!data.year ? data.year : '';
        }
        $('#metadata>#albumYear').text(ay);
    }

    function togglePlayback(start){
        if (start) {
            changeVolume($('#volume')[0]);
            audio.play();
            $('#start').hide();
            $('#stop').show();
        } else {
            audio.stop();
            $('#stop').hide();
            $('#start').show();
        }
    }

});