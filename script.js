
window.onload = function() {
  
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    
    file.onchange = function() {
      var files = this.files;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();
      var context = new AudioContext();
      var src = context.createMediaElementSource(audio);
      var analyser = context.createAnalyser();
  
      var canvas = document.getElementById("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var ctx = canvas.getContext("2d");
  
      src.connect(analyser);
      analyser.connect(context.destination);
  
      analyser.fftSize = 256;
  
      var bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
  
      var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
  
      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;
  
      function renderFrame() {
        requestAnimationFrame(renderFrame);
  
        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
  
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
        for (var i = 0; i < bufferLength; i++) {
          barHeight = (3 * dataArray[i]);
          
          var r = barHeight + (5 * (i/bufferLength));
          var g = 200 * (i/bufferLength);
          var b = 1000 * (i/bufferLength);
  
          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
          x += barWidth + 1;
        }
      }
  
      audio.play();
      renderFrame();
    };
  };