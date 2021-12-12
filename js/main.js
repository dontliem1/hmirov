const headerTitle = document.getElementById('top');
const tiltShadow = function(event){
  // x/hor y/vert
  var h, v;
  // Check for value
  // Webkit
  if(event.beta || event.gamma){
    v = Math.round(event.beta) * 2;
    h = Math.round(event.gamma) * 2;
  }else if(event.y || event.x){
    // Firefox uses orientation instead of event
    v = Math.round(orientation.y) * 2;
    h = Math.round(orientation.x) * 2;
  }
  // Make adjustments for orientation
  var deg = 0;
  // Device orientation
  if(window.orientation){
    deg = window.orientation;
  }
  var hOffset, vOffset;
  // Regular format is (h, v)
  // 90deg is -v,h
  if(deg == 90){
    hOffset = v;
    vOffset = -h;
  }else if(deg == 180){
    // 180deg is -h,-v
    hOffset = -h;
    vOffset = -v;
  }else if(deg == -90){
    // -90 is -v,-h
    hOffset = -v;
    vOffset = h;
  }else{
    // Regular orientation
    hOffset = h;
    vOffset = v;
  }
  // Set to shadow
  // Vertical offset has -30 because of how people naturally hold their devices.
  // this.layers[this.selectedLayer].vertical_offset = (-vOffset) + 70;
  // this.layers[this.selectedLayer].horizontal_offset = -hOffset;
  top.style.boxShadow = `${-vOffset + 70} ${-hOffset} 0 red`;
};
const toggleTilt = function(){
  var _this = this;
  // Get sensor type if its available
  var sensor = "";
  var addListener = function(sensor){
    _this.tiltMode = true;
    window.addEventListener(sensor, _this.tiltShadow)
  }

  // If it's already running, stop it
  if(_this.tiltMode){
    window.removeEventListener("deviceorientation", _this.tiltShadow);
    window.removeEventListener("MozOrientation", _this.tiltShadow);
    _this.tiltMode = false;
    this.tiltValues = [null, null];
  }
  // Else start it
  else{
    // iOS requires permission request before
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {

      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            // _this.tiltMode = true;
            // window.addEventListener("deviceorientation", _this.tiltShadow)
            addListener("deviceorientation");
            _this.hello("Tilt your device to adjust the shadow.", "far fa-sync-alt")
          }else{
            _this.hello("Device orientation permission denied.", "far fa-times-circle")
          }
        })
        .catch(console.error);
    }
    // No permission needed for other OSes, just check for type
    else if (window.DeviceOrientationEvent){
      // Webkit
      addListener("deviceorientation");
      _this.hello("Tilt your device to adjust the shadow.", "far fa-sync-alt")
    }else if (window.MozOrientation){
      // Firefox
      addListener("MozOrientation");
      _this.hello("Tilt your device to adjust the shadow.", "far fa-sync-alt")
    }else{
      // Error
      _this.hello("We can't access your device's sensors right now.", "far fa-exclamation-triangle")
    }
  }
};
toggleTilt();
