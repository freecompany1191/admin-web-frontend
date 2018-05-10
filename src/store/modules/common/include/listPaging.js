import Constant from '@/common/js/constant'
import Api from '@/common/js/http/axiosApi'
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil';

const state = {
    info: {
        pageNo: 1
        , pageSize: 30
        , totalCount: 0
        , pageRange: 1
        , pageArray: []
        , pageName: '' //라우터 네임
    }
}

const getters = {
    [Constant.GET_PAGE_INFO]: state => state.info
}

const mutations = {
    [Constant.SET_PAGE_INFO]: (state, payload) => state.info = payload,
    [Constant.PAGE_CHANGE]: (state, payload) => state.info.pageNo = payload
}

const actions = {

     /** 페이지 정보 초기화 */
     [Constant.RESET_PAGE_INFO]: ({commit}) => {
        let info = {
            pageNo: 1
            , pageSize: 30
            , totalCount: 0
            , pageRange: 1
            , pageArray: []
            , pageName: ''
        }
        // console.log('reset page info : ',info);
        commit(Constant.SET_PAGE_INFO, info)

    },

    /** 페이지 정보 셋팅 */
    [Constant.SET_PAGE_INFO]: (store, payload) => {
        let info = store.getters.getPageInfo;
        info.pageNo     = util.getNull(payload.pageNo,     info.pageNo);
        info.pageSize   = util.getNull(payload.pageSize,   info.pageSize);
        info.totalCount = util.getNull(payload.totalCount, info.totalCount);
        info.pageRange  = util.getNull(payload.pageRange,  info.pageRange);
        info.pageArray   = [];
        info.pageName   = util.getNull(payload.pageName,  info.pageName);
        
        //데이터가 있을때 만 페이징 데이터 셋팅
        info.pageRange = Math.ceil(info.totalCount / info.pageSize);
        if( info.totalCount > 0 ) {
            let fromNum = 1;
            let toNum = ((((info.pageNo - 1) / 10) + 1) * 10);
            toNum -= info.pageNo;
            for (let i = 1; i <= info.pageRange; i++) {
                if (i % 10 == 0) {
                    fromNum = i;
                    toNum = i + 9;
                } else {
                    fromNum = fromNum;
                    toNum = toNum;
                }
                if (info.pageNo == i) {
                    break;
                }
            }
            for (let i= fromNum; i <= toNum; i++) {
                if (i > info.pageRange) {
                    break;
                }
                if (i == info.pageNo) {
                    info.pageArray.push({no:i});
                } else {
                    info.pageArray.push({no:i});
                }
            }
        }
                
        store.commit(Constant.SET_PAGE_INFO, info)

    },

    /** 페이지 이동 */
    [Constant.PAGE_CHANGE]: (store, payload) => {
        //선택값 셋팅
        store.commit(Constant.PAGE_CHANGE, payload)
        //파라메터 가져오기
        let param = store.getters.getParam;
        //파라메터 VALUE 값을 │ 구분자로 분리해서 배열로 변환
        let arrParam = param.VALUE.split("│");
        //첫번째 페이지 번호 변경
        arrParam[0]=payload;
        //구분자로 분리했던 배열에 │ 구분자를 추가하면서 문자열로 변환 
        param.VALUE = arrParam.join("│");

        //변경된 페이지 번호로 PARAM 셋팅
        store.dispatch(Constant.SET_PARAM, param);
        // 페이징 공통 데이터 조회 및 응답처리
        store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, store.getters.getParam)
  }
}

export default {
    state,
    getters,
    mutations,
    actions
}