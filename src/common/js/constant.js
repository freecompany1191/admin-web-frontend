export default {
	/**
	 * 공통 Store
	 * index.js
	 */
	IS_LOADING : "isLoading", //로딩 getter
	CHANGE_LOADING : "changeLoding", //로딩 상태 변경 액션
	
	/**
	 * 인증 Store
	 * auth.js
	 */
	IS_LOGIN : "isLogin", //로그인 여부
	CHANGE_LOGIN : "changeLogin", //로그인 로그아웃 상태 true false 처리
	ASYNC_LOGIN_SUBMIT : "asyncLoginSubmit", //동기 로그인 처리 액션
	LOGIN_SUBMIT : "loginSubmit", //로그인 처리 액션
	LOGIN_USER_INFO : "loginUserInfo", //로그인 유저 getter

	/**
	 * HTTP Store
	 * common/http/httpTransfer.js
	 */
	/** 비동기 처리 */
	SEND_POST : "sendPost", //공통전문 전송 
	SEND_FILE_POST : "sendFilePost", //파일&객체 전송
	SEND_BIZ_TALK : "sendBizTalk", //비즈톡 상태확인
	SEND_EXCEL_DOWN : "sendExcelDown", //엑셀다운로드

	/** 동기 처리 */
	ASYNC_SEND_POST : "sendPost", //공통전문 전송 
	ASYNC_SEND_FILE_POST : "sendFilePost", //파일&객체 전송
	ASYNC_SEND_BIZ_TALK : "sendBizTalk", //비즈톡 상태확인
	ASYNC_SEND_EXCEL_DOWN : "sendExcelDown", //엑셀다운로드

	GET_RES_DATA : "getResData", //응답 데이터 가져오기

	/** 파라메터 SET GET */
	RESET_PARAM: "resetParam",
	SET_PARAM: "setParam",
	GET_PARAM: "getParam",

	/** 공통 조회 */
	RESET_HTTP_DATA : "resetOutData",				//HTTP 데이터 조회 초기화
	SEARCH_HTTP_DATA : "searchOutData",				//공통 HTTP 데이터 조회 및 응답처리
	SEARCH_HTTP_DATA_PAGING : "searchOutDataPaging",//페이징 공통 HTTP 데이터 조회 및 응답처리
	ASYNC_SEARCH_HTTP_DATA : "asyncSearchHttpData", //ASYNC 공통 HTTP 데이터 조회 및 응답처리
	ASYNC_SEARCH_HTTP_DATA_PAGING : "asyncSearchHttpDataPaging", //ASYNC 페이징 공통 HTTP 데이터 조회 및 응답처리
	GET_OUT_VALUE : "getOutValue",					//조회 OUT_VALUE
	GET_OUT_ROW1  : "getOutRow1",					//조회 OUT_ROW1
	GET_OUT_ROW2  : "getOutRow2",					//조회 OUT_ROW2
	GET_OUT_ROW3  : "getOutRow3",					//조회 OUT_ROW3

	/** 
	 * SESSION Store(세션 스토리지)
	 * common/storage/session 
	 */
	RESET_SESSION_STORAGE: "resetSessionStorage",   //세션스토리지 초기화
	RESET_SESSION_SELECTED: "resetSessionSelected", //선택값 초기화
	SET_SESSION_STORAGE: "setSessionStorage",       //세션스토리지 셋팅
	SET_SESSION_PARAM: "setSessionParam",           //파라메터 세션에 저장
	SET_SESSION_VALUE: "setSessionValue",			//선택값 세션에 저장
	SET_SESSION_SELECTED: "setSessionSelected",     //오브젝트 선택값 세션에 저장
	SET_SESSION_ARRAY_SELECTED: "setSessionArraySelected", //배열 선택값 세션에 저장
	GET_SESSION_STORAGE: "getSessionStorage",       //세션스토리지 가져오기
	GET_SESSION_PARAM: "getSessionParam",           //파라메터 가져오기
	GET_SESSION_VALUE: "getSessionValue",			//파라메터 VALUE 가져오기
	GET_SESSION_SELECTED: "getSessionSelected",     //오브젝트 선택값 가져오기
	GET_SESSION_ARRAY_SELECTED: "getSessionArraySelected", //배열 선택값 가져오기

	/** 
	 * Include Store
	 * common/include
	 */
	/** common/include/findBranch */
	FIND_BRANCH: "findBranch",
	SEARCH_HD_CODE_LIST: "GR00_01_V01",       //본사 리스트 조회 
	SEARCH_BR_CODE_LIST: "GR00_02_V01",       //총판 리스트 조회
	SEARCH_ST_CODE_LIST: "GR00_03_V01",       //가맹점 리스트 조회
	SEARCH_ST_MULTI_CODE_LIST: "GR00_04_V01", //멀티가맹점 리스트 조회

	RESET_FIND_BRANCH_INFO: 'resetFindBranchInfo', //가맹점 선택 정보 리셋
	SET_FIND_BRANCH_INFO: "setFindBranchInfo", //가맹점 선택 정보
	SET_FIND_BRANCH_TYPE: "setFindBranchType", //가맹점 선택 타입 지정
	SET_FIND_BRANCH_VIEW: "setFindBranchView", //가맹점 타입별 표출 리스트 정보
	SET_FIND_BRANCH_ST_MULTI_VIEW: "setFindBranchStMultiView", //멀티타입 표출 여부
	
	GET_FIND_BRANCH_INFO: "getFindBranchInfo",
	GET_FIND_BARNCH_VIEW: "getFindBranchView", //보여줄 리스트 정보
	GET_HD_CODE_LIST: "getHdCodeList", //본사 리스트
	GET_BR_CODE_LIST: "getBrCodeList", //총판 리스트
	GET_ST_CODE_LIST: "getStCodeList", //가맹점 리스트
	GET_ST_MULTI_CODE_LIST: "getStMultiCodeList", //멀티가맹점 리스트


	/** common/include/listPaging */
	RESET_PAGE_INFO: "resetPageInfo", //페이지 정보 초기화
	GET_PAGE_INFO: "getPageInfo",     //페이지 정보 가져오기
	SET_PAGE_INFO: "setPageInfo",     //페이지 정보 셋팅
	PAGE_CHANGE: "pageChange",        //페이지 이동


	/** common/include/findSyCode */
	FIND_SY_CODE: "findSyCode",
	SEARCH_FIND_SY_CODE: "GR00_05_V01",				//시스템 코드 조회
	GET_FIND_SY_CODE_LIST: "getFindSyCodeList",		//시스템 코드 리스트 가져오기
	GET_FIND_SY_CODE_INFO: "getFubdSyCodeInfo",		//시스템 코드 선택값 가져오기
	SET_FIND_SY_CODE_LIST: "setFindSyCodeList",		//시스템 코드 리스트 셋팅
	RESET_FIND_SY_CODE_LIST: "resetFindSyCodeList",	//시스템 코드 리스트 리셋
	SET_FIND_SY_CODE_SELECTED: "setFindSyCodeSelected" //시스템 코드 선택값 셋팅
}