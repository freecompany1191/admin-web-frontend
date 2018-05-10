import Constant from '@/common/js/constant'
import { common } from '@/common/js/common'
import util from '@/common/js/utils/util'
import Api from '@/common/js/http/axiosApi'
import httpUtil from '@/common/js/utils/httpUtil';

/** 
 * 공통 HTTP 전송 VUEX
 * @REQ_TYPE 요청타입 정보
 * 로그인API(SP_SY_API_WEB)     : 100 
 * 통합API(SP_SY_API_ADM_WEB)   : 200 
 * 통합API1(SP_SY_API_ADM_WEB_1): 201 
 * 통합API2(SP_SY_API_ADM_WEB_2): 202 
 * 통합API3(SP_SY_API_ADM_WEB_3): 203 
 * 통합API4(SP_SY_API_ADM_WEB_4): 204
*/
const state = {
	//파라메터
	param: {
		DEVICE    : common.DEVICE		// 디바이스 타입 공통설정
	   ,LANGUAGE  : common.LANGUAGE		// 언어 공통설정
	   ,SERVICE_YN: common.SERVICE_YN	// 서비스 타입 공통설정
	   ,INFO      : ''                  // 사용자정보
	   ,REQ_TYPE  : ''                  // 전문타입
	   ,REQ_NUM   : ''                  // 전문번호
	   ,VALUE     : ''                  // 전문데이터
	},

	resData: {},  //리턴 데이터
	outValue:'', //데이터 값 
	outRow1: [], //데이터 리스트1
	outRow2: [], //데이터 리스트2
	outRow3: []  //데이터 리스트3
}

const getters = {
	[Constant.GET_PARAM]: state => state.param,      //전송한 파라메터
	[Constant.GET_RES_DATA]: state => state.resData, //응답 받은 data
	[Constant.GET_OUT_VALUE]: state => state.outValue, //응답 받은 out_VALUE
	[Constant.GET_OUT_ROW1]: state => state.outRow1,   //응답 받은 out_ROW1
	[Constant.GET_OUT_ROW2]: state => state.outRow2,   //응답 받은 out_ROW2
	[Constant.GET_OUT_ROW3]: state => state.outRow3,   //응답 받은 out_ROW3
}

const mutations = {
	[Constant.SEND_POST]: (state, payload) => state.resData = payload, //응답 받은 data 저장
	[Constant.SET_PARAM]: (state, payload) => state.param = payload, //파라메터 저장
	[Constant.RESET_HTTP_DATA]: (state, payload) => { //응답 데이터 
		state.param = payload.param;
		state.resData = payload.resData;
		state.outValue = payload.out_VALUE;
		state.outRow1  = payload.out_ROW1;
		state.outRow2  = payload.out_ROW2;
		state.outRow3  = payload.out_ROW3;
	},
	[Constant.SEARCH_HTTP_DATA]: (state, payload) => {
		state.resData  = util.getNull(payload,{});
		state.outValue = util.getNull(payload.out_VALUE,0);
		state.outRow1  = util.getNull(payload.out_ROW1,[]);
		state.outRow2  = util.getNull(payload.out_ROW2,[]);
		state.outRow3  = util.getNull(payload.out_ROW3,[]);
	}
}

const actions = {

	//HTTP 데이터 초기화
	[Constant.RESET_HTTP_DATA]: ({commit}) => {
		let payload ={
			param: {
				DEVICE    : common.DEVICE		// 디바이스 타입 공통설정
			   ,LANGUAGE  : common.LANGUAGE		// 언어 공통설정
			   ,SERVICE_YN: common.SERVICE_YN	// 서비스 타입 공통설정
			   ,INFO      : ''                  // 사용자정보
			   ,REQ_TYPE  : ''                  // 전문타입
			   ,REQ_NUM   : ''                  // 전문번호
			   ,VALUE     : ''                  // 전문데이터
			},
			resData: {},  //리턴 데이터
			outValue:'', //데이터 값 
			outRow1: [], //데이터 리스트1
			outRow2: [], //데이터 리스트2
			outRow3: [], //데이터 리스트3
		}
		commit(Constant.RESET_HTTP_DATA, payload)
	},

	/** 공통 HTTP 데이터 조회 및 응답처리 */
	[Constant.SEARCH_HTTP_DATA]: (store, payload) => {
		//AXIOS API 호출
		Api.SEND_POST(payload).then((res) => {
			let data = httpUtil.getResData(res)
			if(data){
				store.commit(Constant.SEND_POST, data); //응답 받은 data 저장
				store.commit(Constant.SEARCH_HTTP_DATA, data) //응답 받은 data 분할 저장
			}
		})
	},

	/** 페이징 공통 HTTP 데이터 조회 및 응답처리 */
	[Constant.SEARCH_HTTP_DATA_PAGING]: (store, payload) => {
		//페이징 컴포넌트에서 쓰기위해 VUEX에 PARAM 셋팅
		store.dispatch(Constant.SET_PARAM, payload)

		//AXIOS API 호출
		Api.SEND_POST(payload).then((res) => {
			let data = httpUtil.getResData(res)
			if(data){
				store.commit(Constant.SEND_POST, data); //응답 받은 data 저장
				store.commit(Constant.SEARCH_HTTP_DATA, data) //응답 받은 data 분할 저장
				//총 페이징 카운트 셋팅
				store.dispatch(Constant.SET_PAGE_INFO, { totalCount: util.getNull(data.out_VALUE, 0) })
			}
		})
	},

	/** ASYNC 공통 HTTP 전문 전송/응답 */
	[Constant.ASYNC_SEND_POST]: async (store, payload) => {
		//로딩 이미지 표출
		// store.dispatch(Constant.CHANGE_LOADING, true);
		//AXIOS API 호출
		const sendPost = await Api.SEND_POST(payload);
		const res = await sendPost;
		//로딩 이미지 없애기
		// store.dispatch(Constant.CHANGE_LOADING, false);
		if (res.data.out_CODE == 1) {
			store.commit(Constant.SEND_POST, await res.data);
		}
		else {
			store.commit(Constant.SEND_POST, null);
			alert(res.data.out_MSG);
		}
	},
	
	/** ASYNC 공통 HTTP 데이터 조회 및 응답처리 */
	[Constant.ASYNC_SEARCH_HTTP_DATA]: async (store, payload) => {
		//동기 방식으로 전문 전송
		await store.dispatch(Constant.ASYNC_SEND_POST, payload)
		//조회된 outRow 및 outValue 셋팅
		if(!util.isNull(store.getters.getResData))
			store.commit(Constant.SEARCH_HTTP_DATA, store.getters.getResData)
	},

	/** ASYNC 페이징 공통 HTTP 데이터 조회 및 응답처리 */
	[Constant.ASYNC_SEARCH_HTTP_DATA_PAGING]: async (store, payload) => {
		//페이징 컴포넌트에서 쓰기위해 VUEX에 PARAM 셋팅
		store.dispatch(Constant.SET_PARAM, payload)
		//동기 방식으로 전문 전송
		await store.dispatch(Constant.ASYNC_SEND_POST, payload)
		//조회된 outRow 및 outValue 셋팅
		if(!util.isNull(store.getters.getResData))
			store.commit(Constant.SEARCH_HTTP_DATA, store.getters.getResData)
		//총 페이징 카운트 셋팅
		store.dispatch(Constant.SET_PAGE_INFO, { totalCount: util.getNull(store.getters.getOutValue, 0) })
	},

	//================================================================================================
	//페이징 처리
	//파라메터 데이터 초기화
	[Constant.RESET_PARAM]: ({commit}) => {
		let param ={
			DEVICE    : common.DEVICE		// 디바이스 타입 공통설정
			,LANGUAGE  : common.LANGUAGE	// 언어 공통설정
			,SERVICE_YN: common.SERVICE_YN	// 서비스 타입 공통설정
			,INFO      : ''                 // 사용자정보
			,REQ_TYPE  : ''                 // 전문타입
			,REQ_NUM   : ''                 // 전문번호
			,VALUE     : ''                 // 전문데이터
		}
		commit(Constant.SET_PARAM, param)
	},

	//파라메터 데이터 셋팅 
	[Constant.SET_PARAM]: (store, payload) => {
		let param = store.getters.getParam;
		param.DEVICE     = util.getNull(payload.DEVICE, common.DEVICE);         // 디바이스 타입 공통설정
		param.LANGUAGE   = util.getNull(payload.LANGUAGE, common.LANGUAGE);     // 언어 공통설정
		param.SERVICE_YN = util.getNull(payload.SERVICE_YN, common.SERVICE_YN); // 서비스 타입 공통설정
		param.INFO       = util.getNull(payload.INFO,     '');                  // 사용자정보
		param.REQ_TYPE   = util.getNull(payload.REQ_TYPE, '');                  // 전문타입
		param.REQ_NUM    = util.getNull(payload.REQ_NUM,  '');                  // 전문번호
		param.VALUE      = util.getNull(payload.VALUE,    '');                  // 전문데이터

		//기본 파라메터 값 셋팅
		store.commit(Constant.SET_PARAM, param)
	}

}

export default {
	state,
	getters,
	mutations,
	actions
}