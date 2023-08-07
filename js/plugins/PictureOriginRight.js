// https://tm.lucky-duet.com/viewtopic.php?t=8322
/* 
 *ピクチャ表示のイベントコマンドの直後にスクリプトで下記を実施
 *$gameScreen.picture(ピクチャ番号)._origin = 2;
*/
(function() {
    'use strict';
    var _TouchInput__onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function(event) {
        _TouchInput__onMouseMove.apply(this, arguments);
        this.mouseX = Graphics.pageToCanvasX(event.pageX);
        this.mouseY = Graphics.pageToCanvasY(event.pageY);
    };
})();