String.prototype.trimLeft = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

String.prototype.trimRight = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

Object.prototype.arrayValue = function() {
    return Array.from( Object.keys( this ), k => this[ k ] );
}