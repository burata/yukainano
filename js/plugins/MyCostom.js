//=============================================================================
 /*:
 * @plugindesc 見た目を変更
 * @author -
 *
 * @help メッセージウィンドウにおける以下を変更。
 * ・文字の大きさ
 * ・行間
 * ・ウィンドウの余白
 * ・字間
 * ・ウィンドウの透過
 * ・ウィンドウスキン
 * ・ウィンドウ横幅
 * ・ウィンドウ縦幅
 * ・ウィンドウに表示する行数
 * ・ウィンドウのY位置
 * 
 * セーブリストウィンドウにおける以下を変更
 * 　・文字の色と縁取り
 * 
 * 
 * 
 * 
 * ＜参考＞
 * http://rpgmaker-script-wiki.xyz/changefontsize_kowazamv.php
 * https://tm.lucky-duet.com/viewtopic.php?t=775
 * https://tm.lucky-duet.com/viewtopic.php?t=6547
 * 
 * 
 * 
 * 
 * 
 */
//=============================================================================

(function(){
'use strict'

// ■メッセージ
// メッセージの行間
Window_Message.prototype.lineHeight = function() {
    // デフォルト36
    return 35;
};

// メッセージの文字の大きさ
Window_Message.prototype.standardFontSize = function() {
    // デフォルト28
    return 27;
};

// メッセージの字間
Window_Message.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);

    // デフォルト w
    textState.x += w - 2;
};

// メッセージのウィンドウの余白
Window_Message.prototype.standardPadding = function() {
    // デフォルト18
    return 16;
};

// メッセージのウィンドウの透過
Window_Message.prototype.standardBackOpacity = function() {
    // デフォルト192
    return 200;
};

// メッセージのウィンドウスキン
Window_Message.prototype.loadWindowskin = function() {
    // this.windowskin = ImageManager.loadSystem('Window');
    this.windowskin = ImageManager.loadSystem('Window');
};


// メッセージのウインドウの横幅
Window_Message.prototype.windowWidth = function() {
    // Graphics.boxWidth
    return Graphics.boxWidth - 166;
};

// メッセージのウィンドウに表示する行数
Window_Message.prototype.numVisibleRows = function() {
    // デフォルト4
    return 4;
};

// メッセージの顔グラ時、左からの余白
Window_Message.prototype.newLineX = function() {
    //return $gameMessage.faceName() === '' ? 0 : 168;
    return $gameMessage.faceName() === '' ? 12 : 20;
};

// メッセージの制御文字の文字サイズ変更
// 大きくするやつ
Window_Base.prototype.makeFontBigger = function() {
    if (this.contents.fontSize <= 96) {
        this.contents.fontSize += 1;
    }
};
// 小さくするやつ
Window_Base.prototype.makeFontSmaller = function() {
    if (this.contents.fontSize >= 24) {
        this.contents.fontSize -= 2;
    }
};

// ■セーブファイル
// 見た目のセーブファイル数
Window_SavefileList.prototype.maxVisibleItems = function() {
    return 4;
};

// セーブファイルの文字の大きさ
Window_SavefileList.prototype.standardFontSize = function() {
    return 25;
};

// セーブファイルの文字色とアウトライン
Window_SavefileList.prototype.changeTextColor = function() {
    this.contents.textColor = "#1a0000";
    this.contents.outlineColor = 0;
    this.contents.outlineWidth = 0;
};

// セーブファイルに記載する内容 rpg_managers.js
DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.turnsNum   = $gameVariables.value(2); //ターン数
    info.happyPoint = $gameVariables.value(4); //幸福ポイント
    info.influence  = $gameVariables.value(3); //影響力
    info.timestamp  = Date.now(); //セーブ日付
    return info;
};

// セーブファイルに表示する内容と位置
Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        // ターン数
        this.drawTurnNum(info, rect.x + 2, rect.y + 16, rect.width);
        // 幸福ポイント
        this.drawHappyPoint(info, rect.x + 26, rect.y + 48, rect.width);
        // 影響力
        this.drawInfluence(info, rect.x + 26, rect.y + 80, rect.width);
        // セーブ日付
        this.drawSaveDate(info, rect.x + 155, rect.y + 80, rect.width);
    }
};

// 「ファイル1」の表記を消す
Window_SavefileList.prototype.drawFileId = function(id, x, y) {
    //this.drawText(TextManager.file + ' ' + id, x, y, 180);
    this.drawText('', x, y, 180);
};


// ターン数 設定
Window_SavefileList.prototype.drawTurnNum = function(info, x, y, width) {
    this.drawText(info.turnsNum, x, y, width);
};
// 影響力 設定
Window_SavefileList.prototype.drawInfluence = function(info, x, y, width) {
    this.drawText(info.influence, x, y, width);
};
// 幸福ポイント 設定
Window_SavefileList.prototype.drawHappyPoint = function(info, x, y, width) {

    this.drawText(info.happyPoint, x, y, width);
};
// セーブ日付 設定
Window_SavefileList.prototype.drawSaveDate = function(info, x, y, width) {
    var toDoubleDigits = function(num) {
        //1桁なら空白で埋める
        num += "";
        if (num.length === 1) {
            num = " " + num;
        }
        return num;     
    };

    var t = new Date(info.timestamp);
    var savetime_formated = t.getFullYear() + " " + toDoubleDigits(t.getMonth() + 1) + " " + toDoubleDigits(t.getDate());
    this.drawText(savetime_formated, x, y, width);
};


// ■ヘルプ
// 文字のアウトライン
Window_Help.prototype.changeTextColor = function() {
    this.contents.textColor = "#1a0000";//黒
    this.contents.outlineColor = 0;
    this.contents.outlineWidth = 0;
};



})();
