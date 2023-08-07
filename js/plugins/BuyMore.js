//=============================================================================
// BuyMore.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 散財禁止。
 * @author まっつＵＰ
 * 
 * @param base
 * @desc countがこのIDの変数の値以上になると不買運動が始まります。
 * @default 10
 * 
 * @param count
 * @desc このIDの変数に加算されます。
 * @default 11
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * baseのIDの変数が0以下の時は不買運動は始まりません。
 * countもマイナスの値にしないようにしてください。
 * countのIDの変数の加算はいつでも行われます。
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
    var parameters = PluginManager.parameters('BuyMore');
    var BMbase = Number(parameters['base'] || 10);
    var BMcount = Number(parameters['count'] || 11);

    Game_Variables.prototype.BMcanmore = function(val) { //新規
    var base = this.value(BMbase);
    var count = this.value(BMcount)
    var plusonly = base > 0 && count >= 0;
    var canmore = base - count;
    if(val){
    return plusonly ? canmore : -1;
    }else{
    return plusonly && canmore <= 0;
    }
    };

    var _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
    Scene_Shop.prototype.doBuy = function(number) {
    var add = $gameVariables.value(BMcount) + number;
    $gameVariables.setValue(BMcount, add);
    _Scene_Shop_doBuy.call(this, number);
    };

    Scene_Shop.prototype.maxBuy = function() {
    var max = $gameParty.maxItems(this._item) - $gameParty.numItems(this._item);
    var rem = $gameVariables.BMcanmore(true);
    if(rem != -1) max = Math.min(max, rem);
    console.log(max)
    var price = this.buyingPrice();
    if (price > 0) {
        return Math.min(max, Math.floor(this.money() / price));
    } else {
        return max;
    }
    };

    //以下の処理はフックすることができない
    Window_ShopBuy.prototype.isEnabled = function(item) {
    if(item && $gameVariables.BMcanmore(false)) return false;
    return (item && this.price(item) <= this._money &&
            !$gameParty.hasMaxItems(item));
    };
      
})();
