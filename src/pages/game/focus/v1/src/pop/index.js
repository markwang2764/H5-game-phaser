import Cash from "./cash"
import Detail from "./detail"
import Rank from "./rank"
import Result from "./result"
import Share from "./share"
import Double from "./double"
import Toast from "./toast"
import Download from "./download"

class Pop{
    constructor(){
        this.cash = new Cash();
        this.detail = new Detail();
        this.rank = new Rank();
        this.result = new Result();
        this.share = new Share();
        this.double = new Double();
        this.toast = new Toast();
        this.download = new Download();
    }

    showResult(data){
        this.result.show(data);
        this.showMoney();
    }

    showRank(entry){
        this.rank.show(entry);
    }

    showShare(tip){
        this.share.show(tip);
    }

    showDouble(success){
        this.double.show(success);
        $(".game-view").show();
        $(".pages").hide();
    }

    showMoney(){
        $(".result-money").show();
    }
    
    hideMoney(){
        $(".result-money").hide();
    }

    noMoney(){
        $(".result-money").css("top", "-1rem");
    }

    hasMoney(){
        $(".result-money").css("top", "0.12rem");
    }
}

var pop = new Pop();
export default pop;