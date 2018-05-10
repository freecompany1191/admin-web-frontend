export default {
    ////////////////////////////////////////////////
    //경고창 및 포커스
    ////////////////////////////////////////////////
    setFocus: function(msg,obj){
        alert(msg);
        obj.focus();
    },
    ////////////////////////////////////////////////
    //바이트 체크
    ////////////////////////////////////////////////
    checkBytes: function(val){
        var count = 0;
        var tmpStr = new String(val);
        var tempLen = tmpStr.length;
        var oneChar;
        for ( var i = 0; i < tempLen; i++ ){
            oneChar = tmpStr.charAt(i);
            if (escape(oneChar).length > 4){
                count += 3;
            }else{
                count += 1;
            }
        }
        return count;
    }, 
    ////////////////////////////////////////////////
    //이메일 체크 (true/false)
    ////////////////////////////////////////////////
    checkEmail: function(val){
        var bol = true;
        var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        if (exptext.test(val)!=true){
            bol = false;
        }
        return bol;
    },
    ////////////////////////////////////////////////
    //한글 유효성 체크 (true/false)
    ////////////////////////////////////////////////
    checkKorean: function(val){
        var bol = true;
        var objStr = val;
        for (var i = 0; i < objStr.length; i++) {
            if (((objStr.charCodeAt(i) > 0x3130 && objStr.charCodeAt(i) < 0x318F) || (objStr.charCodeAt(i) >= 0xAC00 && objStr.charCodeAt(i) <= 0xD7A3))) {
                bol = false;
                break;
            }
        }
        return bol;
    }, 
    ////////////////////////////////////////////////
    //문자길이 제거 (return str)
    ////////////////////////////////////////////////
    cutStr: function(str, Len){
        var strLen = str.length;
        if (strLen > Number(Len)){		
            return str.substr(0,Number(Len)-2) + "..";
        }else{
            return str;
        }
    }


}