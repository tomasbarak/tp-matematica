//Number padding 
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

//Clock in ms

var Timer = function() {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
}

Timer.prototype.start = function() {
    this.startTime = new Date().getTime();
    this.running = true;
}

Timer.prototype.stop = function() {
    this.endTime = new Date().getTime();
    this.running = false;
}

Timer.prototype.getElapsedTime = function() {
    if (this.running) {
        return (new Date().getTime() - this.startTime);
    } else {
        return (this.endTime - this.startTime);
    }
}

Timer.prototype.reset = function() {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
}

// Path: scripts/Timer.js