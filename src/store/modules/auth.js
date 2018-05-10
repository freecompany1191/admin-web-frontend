import Constant from '@/common/js/constant'
import util from '@/common/js/utils/util'
import authUtil from '@/common/js/utils/authUtil'
import httpUtil from '@/common/js/utils/httpUtil'
import Api from '@/common/js/http/axiosApi'

const state = {
    isLogin: false, //로그인 여부 상태
    userInfo : null //로그인 유저 정보
}

const getters = {
    [Constant.IS_LOGIN]: state => state.isLogin,
    [Constant.LOGIN_USER_INFO]: state => state.userInfo
}

const mutations = {
    [Constant.CHANGE_LOGIN]: (state, payload) => state.isLogin = payload,
    [Constant.LOGIN_SUBMIT]: (state, payload) => state.userInfo = payload,
}

const actions = {
    /** 로그인 처리 loginSubmit 전문 전송/응답 부분 */
    [Constant.LOGIN_SUBMIT]: (store, payload) => {
            //전문번호
			let IN_REQ_NUM = "GR01_01_V01";

			let inValue = [];
			inValue.push(util.getNull(payload.userId,''));  //아이디
			inValue.push(util.getNull(payload.userPwd,'')); //패스워드

			//전문데이터
			let IN_VALUE = util.getValue(inValue); //전문데이터 조합 함수 호출
			
			let param = {
				INFO:""
				, REQ_TYPE:"100"
				, REQ_NUM:IN_REQ_NUM
				, VALUE:IN_VALUE
			}
				
			//AXIOS API 호출
			Api.SEND_POST(param).then((res) => {
				let data = httpUtil.getResData(res)
				if(data){
					//userInfo JSON 파서
					let userInfo = authUtil.userInfoRowParser(this, data.out_ROW1[0]);
					//로그인처리
					authUtil.login(userInfo)
				}
			})
    },

    /** 로그인 처리 loginSubmit 전문 전송/응답 부분 */
    [Constant.ASYNC_LOGIN_SUBMIT]: async (store, payload) => {
        //동기 방식으로 전문 전송
        await store.dispatch(Constant.ASYNC_SEND_POST,payload);
        //응답 데이터 가져오기
        const resData = store.getters.getResData;

        if(resData){
                //로그인 쿠키정보 비우기
            authUtil.logout();
            //userInfo JSON 파서
            let userInfo = authUtil.userInfoRowParser(this, resData.out_ROW1[0]);
            //로그인처리
            if(authUtil.login(userInfo)) store.commit(Constant.LOGIN_SUBMIT, userInfo);
        }
            
        /* 
        .catch(e => {
            store.dispatch(Constant.CHANGE_LOADING, false);
            //console.log(e.message);
            store.commit(Constant.LOGIN_SUBMIT, false);
        });
        */
    },
    
    /** 로그인 상태 변경 액션 changeLogin */
    [Constant.CHANGE_LOGIN]: ({commit}, payload) =>
        commit(Constant.CHANGE_LOGIN, payload)
}

export default {
    state,
    getters,
    mutations,
    actions
}