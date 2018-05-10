import util from './util.js'

export default {
    /** 
     * 리턴 데이터 처리
     **/
    getResData(res) {
        if (res.data.out_CODE == 1) {
            return res.data
        }
        else {
            alert(res.data.out_MSG);
            return false;
        }
    }
}