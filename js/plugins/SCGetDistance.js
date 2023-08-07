/*:ja
 * @plugindesc ２つのイベントまたはイベントと座標との距離を求めます。
 * @author SakuraCrowd
 *
 * @help
 * 
 *  20210823 mai 斜めの位置にいる時は距離を+1
 *  20210823 mai 変数（制御文字）に対応→\v[1]
 * 
 * Plugin Command:
 *  SCGetDistance eventId1 eventId2 varId
 * 	  eventId1 から eventId2 までの距離を計測して、変数 varId に結果を格納します。
 *    20210823 mai 改造：変数に対応→\v[1]
 *
 *    eventId = 0 →プラグインコマンドを呼び出したイベント
 *    eventId = -1 →プレイヤー
 *    varId = 計算結果を格納する変数の番号。
 *
 *    example
 *      SCGetDistance 0, -1, 20
 *      if (#gameVariables.value(20) > 2)
 *      {
 *        // approaching
 *      }
 *
 *  SCGetDistance eventId x y varId
 *    eventId から座標(x, y)までの距離を計算して、変数 varId に結果を格納します。
 *    x, y = 好きな座標
 *
 */

(function() {
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {

		// 変数（制御文字）に対応→\v[1]
		args = args.map(function (element) {
			return Window_Base.prototype.convertEscapeCharacters.call(this, element);
		}, this);

	    _Game_Interpreter_pluginCommand.call(this, command, args);
		
		if (command.toUpperCase() === 'SCGETDISTANCE') {
			var _eventFrom = this.character(eval(args[0]));
			
			var _varId = 0;
			var _toX = 0;
			var _toY = 0;
			if (args.length > 3)
			{		// args.length == 4
      			_xTo = args[1];
      			_yTo = args[2];
      			_varId = args[3];
			}
			else	// args.length == 3
			{
				var _eventTo = this.character(eval(args[1]));
				_xTo = _eventTo.x;
				_yTo = _eventTo.y;
				_varId = args[2];
			}

			var _xDiff = _xTo - _eventFrom.x;
			var _yDiff = _yTo - _eventFrom.y;
			var _distance = Math.sqrt(_xDiff * _xDiff + _yDiff * _yDiff);
      
            // 斜めの位置にいる時は+1 20210823 mai
            if(_xTo !== _eventFrom.x && _yTo !== _eventFrom.y){
                _distance = _distance + 1;
            }

			$gameVariables.setValue(_varId, _distance)
		}
	};
})();