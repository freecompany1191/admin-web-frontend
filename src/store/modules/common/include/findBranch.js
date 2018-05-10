import Constant from '@/common/js/constant'
import Api from '@/common/js/http/axiosApi'
import util from '@/common/js/utils/util';
import authUtil from '@/common/js/utils/authUtil';
import httpUtil from '@/common/js/utils/httpUtil';
import { isNull, isUndefined } from 'util';

const state = {
	//검색시 참조할 선택값
	info: {
		hdCode:''			//본사 코드
		, brCode:''			//총판 코드
		, stCode:''			//가맹점 코드
		, multiType: ''		//멀티 타입
		, multiStCode: ''	//멀티 가맹점 코드
	},
	
	view: {
		// 가맹점선택 표출 타입(ALL:전체 HD:본사 BR:총판 ST:가맹점(멀티가맹점제외))
		TYPE: 'ALL'
		,HD_YN:      false
		,BR_YN:      false
		,ST_YN:      false
		,ST_MULTI_YN: false

		,HD_WIDTH: '170px' //본사 SELECT박스 WIDTH
		,BR_WIDTH: '170px' //총판 SELECT박스 WIDTH
		,ST_WIDTH: '170px' //가맹점 SELECT박스 WIDTH
		,ST_MULTI_WIDTH: '170px' //멀티가맹점본사 SELECT박스 WIDTH

		,OPTION : { //옵션
			ALL : true //본사 전체 선택 옵션여부
			,ALL_NAME:'본사 전체' //전체 선택 표출명
			,DEFAULT_SELECTED:'' //기본 선택값
		}
	},
	hdCodeList: {},     //본사 리스트
	brCodeList: {},     //총판 리스트
	stCodeList: {},     //가맹점 리스트
	stMultiCodeList: {} //멀티가맹점 리스트

}

const getters = {
	[Constant.GET_FIND_BRANCH_INFO]: state => state.info,
	[Constant.GET_FIND_BARNCH_VIEW]: state => state.view,

	[Constant.GET_HD_CODE_LIST]: state => state.hdCodeList,
	[Constant.GET_BR_CODE_LIST]: state => state.brCodeList,
	[Constant.GET_ST_CODE_LIST]: state => state.stCodeList,
	[Constant.GET_ST_MULTI_CODE_LIST]: state => state.stMultiCodeList,
}

const mutations = {
	[Constant.SET_FIND_BRANCH_INFO]: (state, payload) => state.info = payload,
	[Constant.SET_FIND_BRANCH_VIEW]: (state, payload) => state.view = payload,
	[Constant.SET_FIND_BRANCH_ST_MULTI_VIEW]: (state, payload) => state.view.ST_MULTI_YN = payload,
	

	[Constant.SEARCH_HD_CODE_LIST]: (state, payload) => state.hdCodeList = payload,
	[Constant.SEARCH_BR_CODE_LIST]: (state, payload) => state.brCodeList = payload,
	[Constant.SEARCH_ST_CODE_LIST]: (state, payload) => state.stCodeList = payload,
	[Constant.SEARCH_ST_MULTI_CODE_LIST]: (state, payload) => state.stMultiCodeList = payload,
}

const actions = {

	/** 선택값 초기화 */
	[Constant.RESET_FIND_BRANCH_INFO]: ({commit}) => {
		let info = {
			hdCode:''
		  , brCode:''
		  , stCode:''
		  , multiStCode: ''
		  , multiType: ''
		}
		commit(Constant.SET_FIND_BRANCH_INFO, info)

	},

	/** 화면 참조 선택값 셋팅 */
	[Constant.SET_FIND_BRANCH_INFO]: ({commit}, payload) => {
		commit(Constant.SET_FIND_BRANCH_INFO, payload)
	},

	/** 휘발성 선택값 정보 */
	[Constant.SET_FIND_BRANCH_SELECT]: ({commit}, payload) => {
		commit(Constant.SET_FIND_BRANCH_SELECT, payload)
	},

	/** 타입 셋팅 */
	[Constant.SET_FIND_BRANCH_TYPE]: (store, payload) => {
		let userInfo = authUtil.getUserInfo();
		let userTypeCd = userInfo.userTypeCd.substr(0, 1);
		let view = {
			TYPE: payload.TYPE
			,HD_YN:      false
			,BR_YN:      false
			,ST_YN:      false
			,ST_MULTI_YN: false

			, HD_WIDTH: '170px'
			, BR_WIDTH: '170px'
			, ST_WIDTH: '170px'
			, ST_MULTI_WIDTH: '170px'

			,OPTION : {
				ALL:true	//전체 선택 표출여부
				,ALL_NAME:'본사 전체'   //전체 선택 표출명
				,DEFAULT_SELECTED:'' //기본 선택값
			}
		}

		//OPTION 설정 값이 있을 경우 셋팅
		view.OPTION.ALL = _.has(payload,'OPTION.ALL') ? payload.OPTION.ALL : view.OPTION.ALL
		view.OPTION.ALL_NAME = _.has(payload,'OPTION.ALL_NAME') ? payload.OPTION.ALL_NAME : view.OPTION.ALL_NAME
		view.OPTION.DEFAULT_SELECTED = _.has(payload,'OPTION.DEFAULT_SELECTED') ? payload.OPTION.DEFAULT_SELECTED : view.OPTION.DEFAULT_SELECTED

		switch(payload.TYPE){
			case 'ALL' :
			view.HD_YN = userTypeCd == '9' ? true : false;
			view.BR_YN = userTypeCd == '9' || userTypeCd == '7' ? true : false;
			view.ST_YN = userTypeCd != '3' ? true : false;
			view.ST_MULTI_YN = store.state.info.multiType == 'M' || userInfo.multiType == 'M' ? true : false;
			break;

			case 'ST' :
			view.ST_YN = true;
			case 'BR' :
			view.BR_YN = true;
			case 'HD' :
			view.HD_YN = true;
			break;
		}
		store.commit(Constant.SET_FIND_BRANCH_VIEW, view)
	},

	/** 멀티 타입 셋팅 */
	[Constant.SET_FIND_BRANCH_ST_MULTI_VIEW]: (store, payload) => {
		let userInfo = authUtil.getUserInfo();
		let ST_MULTI_YN = store.state.info.multiType == 'M' || userInfo.multiType == 'M' ? true : false;
		store.commit(Constant.SET_FIND_BRANCH_ST_MULTI_VIEW, ST_MULTI_YN)
	},

	/**
	 * 타입별 공통 전문 전송및 응답처리
	 * @tranType
	 * Constant.SEARCH_HD_CODE_LIST - 본사 리스트 조회
	 * Constant.SEARCH_BR_CODE_LIST - 총판 리스트 조회
	 * Constant.SEARCH_ST_CODE_LIST - 가맹점 리스트 조회
	 * Constant.SEARCH_ST_MULTI_CODE_LIST - 멀티 가맹점 리스트 조회
	 */
	[Constant.FIND_BRANCH]: async (store, payload) => {
		//동기 방식으로 전문 전송
		await store.dispatch(Constant.ASYNC_SEND_POST,payload.param)
		//tranType 별로 응답 데이터 가져와서 리스트 셋팅
		store.commit(payload.tranType, store.getters.getResData.out_ROW1)
		//리스트 화면에서 검색시 참조할 선택 값 셋팅
		store.commit(Constant.SET_FIND_BRANCH_INFO, payload.info)
	},


	/** 본사 리스트 조회 
	 *  최초 로드시 본사리스트 셋팅하고 나머지 리스트 초기화 선택값 초기화
	*/
	[Constant.SEARCH_HD_CODE_LIST]: (store, payload) => {

		let param = new Object();
		// 전문번호
		param.REQ_NUM= "GR00_01_V01";
		// 전문데이터
		param.VALUE = "A│"  // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2│"; // 정렬_구분 (1: 코드순, 2: 이름순)
		getParam(param);

		//본사 리스트 조회

		let tranType = Constant.SEARCH_HD_CODE_LIST;

		//console.log('SEARCH_HD_CODE_LIST : ',store.getters.getSessionSelected); 

		//AXIOS API 호출
		Api.SEND_POST(param).then((res) => {
			let data = httpUtil.getResData(res)
			if(data){
				//tranType 별로 응답 데이터 가져와서 리스트 셋팅
				store.commit(tranType, data.out_ROW1)
				//리스트 화면에서 검색시 참조할 선택 값 셋팅
				store.commit(Constant.SET_FIND_BRANCH_INFO, payload)

				let view = store.getters.getFindBranchView;
				let selected = store.getters.getSessionSelected;
				

				//조회된 데이터가 있고 OPTION.DEFAULT_SELECTED 값이 있으면 데이터중에 해당 값이있는지 판단후 적용한다
				if(data.out_ROW1.length > 0){
						
					if(!util.isNull(view.OPTION.DEFAULT_SELECTED)){
						let match = data.out_ROW1.find(item => item.HD_CODE == view.OPTION.DEFAULT_SELECTED);
						if(match)
							selected.hdCode = view.OPTION.DEFAULT_SELECTED
						else if(!view.OPTION.ALL) { //전체 옵션이 false 이면
							//세션스토리지 선택값이 없을 경우 최초 선택값을 첫번째 hdCode로 적용
							selected.hdCode = util.getNull(selected.hdCode, data.out_ROW1[0].HD_CODE);
						}
					
					} else if(!view.OPTION.ALL) { //전체 옵션이 false 이면
						//세션스토리지 선택값이 없을 경우 최초 선택값을 첫번째 hdCode로 적용
						selected.hdCode = util.getNull(selected.hdCode, data.out_ROW1[0].HD_CODE);
					}
				}

				if(view.BR_YN && selected.hdCode != '')
					store.dispatch(Constant.SEARCH_BR_CODE_LIST, selected);
				
			}
		})

		//타입별 공통 전문 전송및 응답처리
		//tranType - 요청 타입, param - 파라메터, info - 셀렉트 박스 선택값

		//본사 리스트 요청시 그외 리스트 초기화
		store.commit(Constant.SEARCH_BR_CODE_LIST,[])
		store.commit(Constant.SEARCH_ST_CODE_LIST,[])
		store.commit(Constant.SEARCH_ST_MULTI_CODE_LIST,[])
	},

	 /** 총판 리스트 조회 */
	 [Constant.SEARCH_BR_CODE_LIST]: (store, payload) => {

		let param = new Object();
		// 전문번호
		param.REQ_NUM= "GR00_02_V01";
		// 전문데이터
		param.VALUE = "A│"               // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2│"               // 정렬_구분 (1: 코드순, 2: 이름순)
					+payload.hdCode+"│"; // 검색_제휴본사_코드
		getParam(param);

		//총판 리스트 조회
		let tranType = Constant.SEARCH_BR_CODE_LIST;
		//console.log('SEARCH_BR_CODE_LIST : ',store.getters.getSessionSelected); 

		//AXIOS API 호출
		Api.SEND_POST(param).then(
			(res) => {
				let data = httpUtil.getResData(res)
				if(data){
					//tranType 별로 응답 데이터 가져와서 리스트 셋팅
					store.commit(tranType, data.out_ROW1)
					//리스트 화면에서 검색시 참조할 선택 값 셋팅
					store.commit(Constant.SET_FIND_BRANCH_INFO, payload)
					//함수 호출 때 마다 멀티타입 표출 여부 판단
					store.dispatch(Constant.SET_FIND_BRANCH_ST_MULTI_VIEW)

					let view = store.getters.getFindBranchView;
					let selected = store.getters.getSessionSelected;

					if(view.ST_YN && selected.brCode != '')
						store.dispatch(Constant.SEARCH_ST_CODE_LIST, selected);
				}
			}
		)

		//총판 리스트 요청시 그외 리스트 초기화
		store.commit(Constant.SEARCH_ST_CODE_LIST,[])
		store.commit(Constant.SEARCH_ST_MULTI_CODE_LIST,[])
	},

	 /** 가맹점 리스트 조회 */
	 [Constant.SEARCH_ST_CODE_LIST]: (store, payload) => {

		let param = new Object();
		// 전문번호
		param.REQ_NUM= "GR00_03_V01";
		// 전문데이터
		param.VALUE = "A│"              // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2│"              // 정렬_구분 (1: 코드순, 2: 이름순)
					+payload.hdCode+"│" // 검색_제휴본사_코드
					+payload.brCode+"│" // 검색_총판_코드
					+"A│";              // 검색_멀티_구분 (NULL: 전체, N: 개별, M: 마스터, S: 종속, A: 개별/마스터) 
		getParam(param);

		//가맹점 리스트 조회
		let tranType = Constant.SEARCH_ST_CODE_LIST;
		//console.log('SEARCH_ST_CODE_LIST : ',store.getters.getSessionSelected); 

		//AXIOS API 호출
		Api.SEND_POST(param).then(
			(res) => {
				let data = httpUtil.getResData(res)
				if(data){
					//tranType 별로 응답 데이터 가져와서 리스트 셋팅
					store.commit(tranType, data.out_ROW1)
					//리스트 화면에서 검색시 참조할 선택 값 셋팅
					store.commit(Constant.SET_FIND_BRANCH_INFO, payload)
					//함수 호출 때 마다 멀티타입 표출 여부 판단
					store.dispatch(Constant.SET_FIND_BRANCH_ST_MULTI_VIEW)
					
					let view = store.getters.getFindBranchView;
					let selected = store.getters.getSessionSelected;

					if(view.ST_MULTI_YN && selected.stCode != '')
						store.dispatch(Constant.SEARCH_ST_MULTI_CODE_LIST, selected);
				}
			}
		)
	   
		//가맹점 리스트 요청시 그외 리스트 초기화
		store.commit(Constant.SEARCH_ST_MULTI_CODE_LIST,[])
	},

	 /** 멀티가맹점 리스트 조회 */
	 [Constant.SEARCH_ST_MULTI_CODE_LIST]: (store, payload) => {

		let param = new Object();
		// 전문번호
		param.REQ_NUM= "GR00_04_V01";
		// 전문데이터
		param.VALUE = "A│"               // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2│"               // 정렬_구분 (1: 코드순, 2: 이름순)
					+payload.stCode+"│";  // 검색_가맹점_코드 (마스터 가맹점)
		getParam(param);
		//멀티가맹점 리스트 조회
		let tranType = Constant.SEARCH_ST_MULTI_CODE_LIST;
		//console.log('SEARCH_ST_MULTI_CODE_LIST : ',store.getters.getSessionSelected); 
		
		//AXIOS API 호출
		Api.SEND_POST(param).then(
			(res) => {
				let data = httpUtil.getResData(res)
				if(data){
					//tranType 별로 응답 데이터 가져와서 리스트 셋팅
					store.commit(tranType, data.out_ROW1)
					//리스트 화면에서 검색시 참조할 선택 값 셋팅
					store.commit(Constant.SET_FIND_BRANCH_INFO, payload)
					//함수 호출 때 마다 멀티타입 표출 여부 판단
					store.dispatch(Constant.SET_FIND_BRANCH_ST_MULTI_VIEW)
				}
			}
		)
	}

}
/**
 * 전문 공통 셋팅
 * @param {any} param
 */
const getParam = param => {
	param.INFO = "";
	param.REQ_TYPE = "200";
}

export default {
	state,
	getters,
	mutations,
	actions
}