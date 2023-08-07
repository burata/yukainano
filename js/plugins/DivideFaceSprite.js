/*:
 * @plugindesc Use sprite for face graphic in message window.
 * @author faida
 *
 * @help This plugin does not provide plugin commands.
 *
 * @param horzFaceNum
 * @desc Num of face graphic in 1 row.
 * @default 4
 *
 * @param adjLineX
 * @desc distance from face graphic to sentence.
 * @default 24
 *
 * @param preLoadWidth
 * @desc default face graphic width. use it if fault loading image.
 * @default 144
 *
 * @param waitForLoad
 * @desc wait loading graphic if use face graphic in message.(true/false)
 * @default true
 *
 */

/*:ja
 * @plugindesc メッセージウィンドウと顔グラフィックの描画領域を別にします。
 * @author faida
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * @param horzFaceNum
 * @desc 顔グラフィックのサイズは 画像の横 / horzFaceNum で自動算出します。
 * @default 4
 *
 * @param adjLineX
 * @desc 顔グラフィックと文字の距離
 * @default 24
 *
 * @param preLoadWidth
 * @desc 画像が読み込みされていないときの仮の幅
 * @default 144
 *
 * @param waitForLoad
 * @desc 顔グラ使用時、画像が読み込みされるまでウェイトする(true/false)
 * @default true
 *
 */

(function() {

  var Window_Message_fai_divideFaceSprite_initialize = Window_Message.prototype.initialize
  Window_Message.prototype.initialize = function() {
    this.horzFaceNum = Number(PluginManager.parameters('DivideFaceSprite')['horzFaceNum'])
    this.adjLineX = Number(PluginManager.parameters('DivideFaceSprite')['adjLineX'])
    this.preLoadWidth = Number(PluginManager.parameters('DivideFaceSprite')['preLoadWidth'])
    this.waitForLoad = PluginManager.parameters('DivideFaceSprite')['waitForLoad'].toLowerCase() === 'true'
    Window_Message_fai_divideFaceSprite_initialize.call(this)
  };

  var Window_Message_fai_divideFaceSprite_initMembers = Window_Message.prototype.initMembers
  Window_Message.prototype.initMembers = function() {
    Window_Message_fai_divideFaceSprite_initMembers.call(this)
    this._faceSprite = new Sprite()
    this._faceSprite.setFrame(0, this.y, Graphics.width, Graphics.height)
    this._faceSprite.bitmap = new Bitmap(this.windowWidth(), this.windowHeight())
  };

  var Window_Message_fai_divideFaceSprite_newPage = Window_Message.prototype.newPage
  Window_Message.prototype.newPage = function(textState) {
    this._faceSprite.bitmap.clear()
    Window_Message_fai_divideFaceSprite_newPage.call(this, textState)
  };

  Window_Message.prototype.drawMessageFace = function() {
    var bitmap = ImageManager.loadFace($gameMessage.faceName())
    var s = bitmap.width / this.horzFaceNum
    var t = (this.windowHeight() - s) / 2
    var i = $gameMessage.faceIndex()
    var sx = Math.floor(i % this.horzFaceNum) * s
    var sy = Math.floor(i / this.horzFaceNum) * s
    this._faceSprite.bitmap.blt(bitmap, sx, sy, s, s, t, t)
  };

  var Window_Message_fai_divideFaceSprite_updateOpen = Window_Message.prototype.updateOpen
  Window_Message.prototype.updateOpen = function() {
    Window_Message_fai_divideFaceSprite_updateOpen.call(this)
    if (this.isOpen()) { this.addChild(this._faceSprite) }
  };

  var Window_Message_fai_divideFaceSprite_updateClose = Window_Message.prototype.updateClose
  Window_Message.prototype.updateClose = function() {
    if (this.isClosing()) { this.removeChild(this._faceSprite) }
    Window_Message_fai_divideFaceSprite_updateClose.call(this)
  };

  Window_Message.prototype.newLineX = function() {
    var bitmap = ImageManager.loadFace($gameMessage.faceName())
    if (!($gameMessage.faceName() === '') && this.waitForLoad && bitmap.width == 0) { return -1 }
    return $gameMessage.faceName() === '' ? 0 :
           (((bitmap.width / this.horzFaceNum) || this.preLoadWidth) + this.adjLineX);
  };

  var Window_Message_fai_divideFaceSprite_updateMessage = Window_Message.prototype.updateMessage
  Window_Message.prototype.updateMessage = function() {
    if (!this.waitForLoad || this.newLineX() > -1) {
      return Window_Message_fai_divideFaceSprite_updateMessage.call(this)
    } else {
      return true
    }
  };


})();