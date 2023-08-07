//=============================================================================
// WeatherTimestop.js	2017/04/02
// Copyright (c) 2017 Tsukimi
//=============================================================================

/*:
 * @plugindesc 天候の時間停止効果プレグイン
 * @author Tsukimi
 *
 * @help 
 *　天候の時間停止効果プレグイン
 * 作者：ツキミ
 * 
 * 説明：
 * ツクールの天候効果を一時フリーズするプラグインです。雨や雪が同じ位置に
 * 留まってしまう。
 * 
 * 
 * プラグインコマンド：
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 * 
 * weather_stop
 * 時間停止効果をONする
 * 例： weather_stop
 * 
 * weather_fadestop [フレーム数]
 * [フレーム数]をかけて時間停止する
 * 例： weather_fadestop 120
 * 
 * weather_start
 * 時間停止効果をOFFする
 * 例： weather_start
 * 
 * weather_fadestart [フレーム数]
 * [フレーム数]をかけて時間再開する
 * 例： weather_fadestart 60
 * 
 * 
 * 作者のサイト： http://tsukimitsf.blog.fc2.com/
 * バグなどがあったら、是非こちらへご一報ください。ありがとうございます。
 */

(function(_global) {
  	// ここにプラグイン処理を記載
    
    var Weather__updateAllSprites = Weather.prototype._updateAllSprites;
    Weather.prototype._updateAllSprites = function() {
        if(isNaN($gameScreen._weatherSpeedCur)) $gameScreen._weatherSpeedCur = 1.0;
        Weather__updateAllSprites.call(this);
        if($gameScreen._weatherSpeed != $gameScreen._weatherSpeedCur) {
            $gameScreen._weatherSpeedCur += $gameScreen._weatherAccel;
            if($gameScreen._weatherSpeedCur < 0.0) $gameScreen._weatherSpeedCur = 0.0;
            else if($gameScreen._weatherSpeedCur > 1.0) $gameScreen._weatherSpeedCur = 1.0;
        }
    };
    
    var Weather__updateSprite = Weather.prototype._updateSprite;
    Weather.prototype._updateSprite = function(sprite) {
        if(!!$gameScreen._weatherTimestop && $gameScreen._weatherSpeed == $gameScreen._weatherSpeedCur) {
            if(!!sprite._bitmap) return;
        }
        Weather__updateSprite.call(this, sprite);
    };
    
    Weather.prototype._updateRainSprite = function(sprite) {
    sprite.bitmap = this._rainBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 6 * Math.sin(sprite.rotation) * $gameScreen._weatherSpeedCur;
    sprite.ay += 6 * Math.cos(sprite.rotation) * $gameScreen._weatherSpeedCur;
    sprite.opacity -= Math.round(6 * $gameScreen._weatherSpeedCur);
    };

    Weather.prototype._updateStormSprite = function(sprite) {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite.ax -= 8 * Math.sin(sprite.rotation) * $gameScreen._weatherSpeedCur;
        sprite.ay += 8 * Math.cos(sprite.rotation) * $gameScreen._weatherSpeedCur;
        sprite.opacity -= Math.round(8 * $gameScreen._weatherSpeedCur);
    };

    Weather.prototype._updateSnowSprite = function(sprite) {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 3 * Math.sin(sprite.rotation) * $gameScreen._weatherSpeedCur;
        sprite.ay += 3 * Math.cos(sprite.rotation) * $gameScreen._weatherSpeedCur;
        sprite.opacity -= Math.round(3 * $gameScreen._weatherSpeedCur);
    };
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch(command) {
            case "weather_fadestop":
                $gameScreen._weatherSpeed = 0.0;
                if(isNaN($gameScreen._weatherSpeedCur)) $gameScreen._weatherSpeedCur = 1.0;
                $gameScreen._weatherAccel = - ($gameScreen._weatherSpeedCur - $gameScreen._weatherSpeed) / parseInt(args[0]);
                $gameScreen._weatherTimestop = true;
                break;
                
            case "weather_stop":
                $gameScreen._weatherSpeed = 0.0;
                $gameScreen._weatherSpeedCur = 0.0;
                $gameScreen._weatherTimestop = true;
                break;
                
            case "weather_fadestart":
                $gameScreen._weatherSpeed = 1.0;
                if(isNaN($gameScreen._weatherSpeedCur)) $gameScreen._weatherSpeedCur = 0.0;
                $gameScreen._weatherAccel = ($gameScreen._weatherSpeed - $gameScreen._weatherSpeedCur) / parseInt(args[0]);
                $gameScreen._weatherTimestop = false;
                break;
                
            case "weather_start":
                $gameScreen._weatherSpeed = 1.0;
                $gameScreen._weatherSpeedCur = 1.0;
                $gameScreen._weatherTimestop = false;
                break;
        }
    };
    
})(this);

/*
rpg_core.js

範囲拡大→
Weather.prototype._updateAllSprites = function() {
    var maxSprites = Math.floor(this.power * 10);　                            ← ここ
    while (this._sprites.length < maxSprites) {
        this._addSprite();
    }
    while (this._sprites.length > maxSprites) {
        this._removeSprite();
    }
    this._sprites.forEach(function(sprite) {
        this._updateSprite(sprite);
        sprite.x = sprite.ax - this.origin.x;
        sprite.y = sprite.ay - this.origin.y;
    }, this);
};

Weather.prototype._rebornSprite = function(sprite) {
    sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;   ← ここ
    sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;  ← ここ
    sprite.opacity = 160 + Math.randomInt(60);
};

*/