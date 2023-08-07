//=============================================================================
// MoveXY.js
//=============================================================================
/*:
 * @plugindesc キャラクターを指定の座標まで移動させるコマンドを追加します。
 * @author jp_asty
 *
 * @help
 * キャラクターを指定座標まで移動させるプラグインコマンドが使用可能になります。
 *
 * MoveXY eventId x y isWait
 * eventId : 0:実行したイベント、1～:対象のイベント、-1:プレイヤー
 * x : 到達X座標
 * y : 到達Y座標
 * isWait : true(or空欄):移動終了までウェイトする、false:ウェイトしない
 *
 * 例)
 * MoveXY 1 5 10 #ID1のイベントを座標5,10まで移動させる(ウェイト有り)
 * MoveXY \V[1] \V[2] \V[3] #eventid、x、yには制御文字\V[n]が使用可能です。
 *
 * 利用規約
 * パプリックドメインです。ご自由にお使い下さい。
 */
(function() {
  'use strict';

  const convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    return text;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if(command.toUpperCase() === "MOVEXY") {
      const [id, x, y] = args.map(val => convertEscapeCharacters(val));
      const isWait = args[3] === "true" || args[3] === undefined;
      const moveRoute = {
        "list":[{"code":45,"parameters":
        ["this.moveStraight(this.findDirectionTo("+x+","+y+")); this._moveRoute.repeat = !this.pos("+x+","+y+");"]},
        {"code":0}],
        "repeat":true,
        "skippable":false
      }
      this._character = this.character(Number(id));
      if(this._character) this._character.forceMoveRoute(moveRoute);
      if(isWait) this.setWaitMode('route');
    }
  };

})();
