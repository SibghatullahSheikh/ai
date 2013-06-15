define([
  'chopchop/animationFrame'
], function (animationFrame) {

  /**
   * busy-while loop for animation frame requests
   * and false if not complete.
   * @param renderCallback must return true if rendering complete
   * @constructor
   */
  function RenderLoop(renderCallback) {
    this._handle = -1;
    var self = this;
    this._onFrame = function () {
      var complete = renderCallback();
      self._handle = -1;
      if (!complete) {
        self.nudge();
      }
    };
    self.nudge();
  }

  RenderLoop.prototype = {
    nudge: function () {
      if (this._handle !== -1) {
        return;
      }
      this._handle = animationFrame.requestAnimationFrame(this._onFrame);
    }
  };

  return RenderLoop;

});