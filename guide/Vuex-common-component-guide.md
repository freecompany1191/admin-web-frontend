# VUEX 공통 컴포넌트 사용 가이드
---------------------------------------------------
> [**Vuex**](https://github.com/stepanowon/vuejs_book/blob/master/vuex/about_vuex.md)의 기본 개념이나 [**Vue**](https://kr.vuejs.org/v2/guide/index.html)의 [**라이프 사이클**](https://medium.com/witinweb/vue-js-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-7780cdd97dd4)에 대해서는 깊게 다루지 않겠다 
> 기본 개념은 해당 링크를 참조 하기 바란다
> 참고로 초기에 [**Vuex**](https://github.com/stepanowon/vuejs_book/blob/master/vuex/about_vuex.md)를 간략히 훑어보기로는 **captain-pangyo**님의  [**Vuex 시작하기**](https://joshua1988.github.io/web-development/vuejs/vuex-start/)가 좋다

[TOC]
## VUEX 공통 컴포넌트 파일 구조
```
├─common
│  ├─include
│  │      FindBranch.vue - 가맹점 선택 컴포넌트
│  │      FindSycode.vue - 시스템 코드 컴포넌트
│  │      ListPaging.vue - 리스트 페이징 컴포넌트
│  │      
│  └─js
│      │  constant.js - 공통 상수 정의
│      │  
│      ├─http
│      │      axiosApi.js - VUEX 공통 모듈에서 사용하는 Axios API
│      │      constantHttp.js - Axios API에서 사용하는 URL경로 상수 정의
│      │      
│      └─utils
│              httpUtil.js - Axios API 사용시 함께 사용하는 HTTP 관련 Util
│              
├─components
│  └─test
│      ├─happytalk
│      │      list.vue - 가맹점 선택 컴포넌트 사용 테스트 화면
│      │      view.vue
│      │      
│      └─sycode
│              View.vue - 시스템 코드 컴포넌트 사용 테스트 화면
│              
└─store
    │  index.js - VUEX STORE 메인
    │  
    └─modules
        │  auth.js - 인증 STORE
        │  
        └─common
            ├─http
            │      httpTransfer.js - 공통 HTTP통신 STORE
            │      
            ├─include
            │      findBranch.js - 가맹점 선택 STORE
            │      findSycode.js - 시스템 코드 STORE
            │      listPaging.js - 리스트 페이징 STORE
            │      
            └─storage
                    cookie.js - 쿠키 STORE
                    local.js - 로컬 스토리지 STORE
                    session.js - 세션 스토리지 STORE
```
------------------------------------------------------------------------------------------------------------------------------
## 공통 사항
### 컴포넌트 적용 공통 사항
#### 1. 공통 import 항목
```javascript
import Constant from '@/common/js/constant' //Vuex 상수 설정 파일
import util from '@/common/js/utils/util'   //util 파일
import { mapGetters} from 'vuex'            //Vuex Getter 모듈
```

#### 2. 공통 beforeCreate 셋팅`<데이터 초기화>`
> `this.$store.dispatch(Constant.RESET_HTTP_DATA);` 
> 최초 화면 로드 전 **Vuex Store**에 저장된 HTTP응답 데이터를 초기화 한다
> **Vue**의 라이플 사이클 단계중 `beforeCreate()`훅은 가장 먼저 실행되는 훅이다
```javascript
beforeCreate() {
	//VUEX HTTP DATA 리셋
	this.$store.dispatch(Constant.RESET_HTTP_DATA);
},
```

#### 3. 공통 data 셋팅`<커스텀 선택값 유지 오브젝트 생성>`
> 해당 화면에서 유지해야 할 선택 값이 있다면 `data`에 셋팅한다
> `saveValue` 오브젝트를 생성하고 유지할 선택 값 변수를 셋팅한다
```javascript
data () {
	return {
		//선택값 유지 오브젝트
		saveValue: {
			sendTimeType: '' //유지할 선택값 변수
		}, 
		sendTimeType: '' //선택값 변수
	}
}
```

#### 4. cumputed 셋팅`<Vuex Store 데이터 가져오기>`
> `mapGetters`라는 `vuex`의 모듈을 `import` 시키고
> `cumputed` 항목에 **Vuex Store**에서 가져올 데이터의 **getter**를 가져와서 셋팅하면
> **Vuex Store** 값이 변경되면 즉시 화면에 렌더링 해준다
> 사용 하는 방법은 사용할 곳에서 `this.sessionValue` 형식으로 사용하면 된다
```javascript
import { mapGetters} from 'vuex'

computed : {
	...mapGetters({
		pageInfo   : Constant.GET_PAGE_INFO,        //Vuex 페이지 정보 가져오기
		dataList   : Constant.GET_OUT_ROW1,         //Vuex 리스트 데이터 가져오기
		sessionValue : Constant.GET_SESSION_VALUE	//Vuex 세션스토리지 파라메터 VALUE 가져오기
	})
}
```

<a id="commonSelectKeepGuide"></a>
#### 5. 공통 methods 셋팅`<화면별 커스텀 선택값 유지 셋팅>`

##### 선택 값 저장을 위한 메서드 구성 가이드
> 선택 값을 유지하기 위해 **Vuex Store**에 **sessionStorage**를 사용해야 한다
> 검색 버튼 클릭 시에만 선택 값을 유지 해야하므로 **_데이터 리스트_** 를 가져오는 메서드와
> 검색 버튼 클릭 시 **_선택값 저장_** 이 되는 메서드를 분리 하여 개발한다
> `methods`항목의 `getDataList()`에 전문 요청 로직을 구현하고
> `search()`에 `getDataList()`를 호출 후 **선택값을 저장**하는 로직을 구현한다

##### Vuex Action 사용 가이드
> `this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)`는 
> `Constant.SEARCH_HTTP_DATA_PAGING` 항목으로 지정된 **Vuex**에 지정된 `action`을
> 호출하는데 파라메터는 `param`으로 넘겨준다는 것이다
> `dispatch`는 **Vuex**의 `action`을 호출 하는 것이고
> `commit`는 **Vuex**의 `mutation`을 호출 하는 것이다 **_지정된 항목이 같다고 햇갈리지말자_**
 
##### 화면별 커스텀 선택값 유지
 > `this.$store.dispatch(Constant.SET_SESSION_VALUE, this.saveValue)`
 > 화면별 커스텀 선택값을 유지 하기 위해서는 `search()` 부분에 위와 같이 명시 하면된다
 > 새로고침을 하거나 선택값 유지 지정 라우터 이동시 선택값이 유지 된다

```javascript
methods: {
	getDataList() {
	
		//전문데이터 조합을 위한 배열 생성
		let inValue = [];
		inValue.push(this.pageInfo.pageNo);	//페이지_요청번호	
		inValue.push(this.pageInfo.pageSize); //페이지_출력개수 (화면출력 데이터 수)
		inValue.push(this.sendTimeType); //발송시점
		
		//전문 데이터
		let param = {
			REQ_TYPE : "204",        //전송타입
			REQ_NUM : "AW04_02_V01", //전문번호
			VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
		}
	
		//VUEX 페이징 리스트 조회
		this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)
	},
	//화면에서 직접 검색 클릭시에만 세션에 저장하도록 화면 클릭 이벤트에는 아래처럼 적용
	search() {
		this.getDataList();
		//화면별 커스텀 선택값 유지를 위해 saveValue 오브젝트에 담아 세션스토리지 VALUE에 저장
		this.saveValue.sendTimeType = this.sendTimeType;
		//화면별 커스텀 선택값 유지 정보(세션스토리지 VALUE에 저장)
		this.$store.dispatch(Constant.SET_SESSION_VALUE, this.saveValue)
	},
}
```

#### 6. 공통 mounted 셋팅`<커스텀 선택값 유지정보 셋팅>`
> 모든 컴포넌트들이 생성되고 데이터가 셋팅된 다음 최초 리스트를 호출 한다
> `mountead`훅에서 기존에 해당화면에서 저장한 선택값 정보를 받아와 있으면 셋팅한다
```javascript
mounted() { //컴포넌트, 템플릿, 렌더링된 돔에 접근할 수있는 훅
	//세션스토리지에 발송시점 선택 정보 있으면 셋팅
	if(!util.isNull(this.sessionValue)){
		if(!util.isNull(this.sessionValue.sendTimeType)){
			this.sendTimeType = this.sessionValue.sendTimeType;
		}
	}

	//컴포넌트들이 모두 생성된 후 페이지 로드
	//컴포넌트에서 선택값 셋팅 이 후 로드 하기 위함
	 this.getDataList();
}
```

#### 7. destroyed 셋팅`<데이터 초기화 및 선택값 유지 페이지 설정>`
##### 데이터 초기화
> 라우터 이동시 **Vuex Store**에 있는 HTTP응답 데이터와 `sessionStorage`에 있는 데이터를 모두 초기화 한다
> `beforeCreate`훅에서 호출했던 `this.$store.dispatch(Constant.RESET_HTTP_DATA);`을
> `destroyed`훅에서도 호출한다

##### 선택값 유지 페이지 설정
> `keepPage`라는 배열 변수를 선언하고 라우터 이동시 선택값을 유지할 **페이지네임**을 지정하면
> 지정된 페이지네임으로 라우터 이동시에는 `sessionStorage`에 있는 선택값을 초기화 하지 않는다
>  내부의 페이지를 라우터 이동 후 다시 돌아왔을때 선택값이 유지되어있기를 원할떄 사용한다
> `this.$store.dispatch(Constant.RESET_SESSION_STORAGE);` 
> `sessionStorage`를 초기화할때는 위와 같은 **Vuex Action**을 호출한다.
```javascript
destroyed() { //라우터 이동시 적용되는 훅
	//VUEX HTTP DATA 리셋
	this.$store.dispatch(Constant.RESET_HTTP_DATA);
	
	//유지시킬 페이지 목록을 배열에 담는다
	let keepPage = [];
	keepPage.push('testView');

	//라우터 이동 후 선택값 유지를 위한 페이지 설정
	for( let keepPageStr of keepPage){
		if(this.$route.name != keepPageStr){
			//세션스토리지 초기화
			this.$store.dispatch(Constant.RESET_SESSION_STORAGE);
		}
	}
}
```
------------------------------------------------------------------------------------------------------------------------------

## 리스트 페이징`<ListPaging.vue>`
### 리스트 페이징 컴포넌트 적용 가이드
`리스트 페이징 컴포넌트 사용 테스트 화면` 참조
#### 1. components 셋팅`<컴포넌트 적용>`
##### 컴포넌트 적용 방법
> 리스트 페이징 컴포넌트 셋팅은 적용할 컴포넌트 파일을 `import` 시키고 
> `components ` 항목에 설정하면 된다.
```javascript
import includeListPaging from '@/common/include/ListPaging'

components: {
	'include-list-paging' : includeListPaging //리스트 페이징 컴포넌트
}
```

##### HTML 적용 방법
> 페이징을 표시할 곳에 아래와 같이 코드를 넣어주면 된다
```htmlbars
<include-list-paging></include-list-paging>
```

#### 2. cumputed 셋팅`<Vuex Store 데이터 가져오기>`
> `cumputed` 항목에 **Vuex Store**에서 가져올 데이터의 **getter**를 가져와서 셋팅하면
> **Vuex Store** 값이 변경되면 즉시 화면에 렌더링 해준다
> 사용 하는 방법은 사용할 곳에서 `this.pageInfo` 형식으로 사용하면 된다
```javascript
import Constant from '@/common/js/constant'
import { mapGetters} from 'vuex'

computed : {
	...mapGetters({
		pageInfo : Constant.GET_PAGE_INFO, //Vuex 페이지 정보 가져오기
		dataList : Constant.GET_OUT_ROW1,  //Vuex 리스트 데이터 가져오기
	})
}
```

#### 3. methods 셋팅`<선택값 유지 셋팅>`
##### 리스트 페이징 HTTTP 요청
> `this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)`
> 리스트 페이징 정보는 HTTP요청을 할 때 설정된 `param`오브젝트를 파라메터를 위의 **VuexAction** 
> 요청시 넘기면 **Vuex Store**에서 셋팅 된다
> `computed`에 지정한 `mapGetters`가 **Vuex Store**데이터가 변경될때 마다 즉시 변경된 정보를 받아오므로 
> 전문 요청시 응답 데이터를 즉시 리스트에 렌더링해준다
```javascript
methods: {      
	getDataList() {

		//전문데이터 조합을 위한 배열 생성
		let inValue = [];
		inValue.push(this.pageInfo.pageNo);		// 페이지_요청번호	
		inValue.push(this.pageInfo.pageSize);	// 페이지_출력개수 (화면출력 데이터 수)

		//전문 데이터
		let param = {
			REQ_TYPE : "203",        //전송타입
			REQ_NUM : "AW03_06_V01", //전문번호
			VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
		}

		//페이징 리스트 조회
		this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)
	}
}
```

------------------------------------------------------------------------------------------------------------------------------

## 가맹점 선택`<FindBranch.vue>`
### 가맹점 선택 컴포넌트 적용 가이드
`가맹점 선택 컴포넌트 사용 테스트 화면` 참조
#### 1. components 셋팅`<컴포넌트 적용>`
##### 컴포넌트 적용 방법
> 가맹점 선택 컴포넌트 셋팅은 적용할 컴포넌트 파일을 `import` 시키고 
> `components ` 항목에 설정하면 된다.
```javascript
import includeFindBranch from '@/common/include/FindBranch'

components: {
	'include-find-branch' : includeFindBranch //가맹점 선택 컴포넌트
}
```

##### HTML 적용 방법
```htmlbars
<table>
	<tr v-if="this.userInfo.multiType != 'S' && this.userInfo.multiType != 'N'">
		<td class="search-title">가맹점선택</td>
		<td><include-find-branch></include-find-branch></td>
	</tr>
</table>
```

#### 2. cumputed 셋팅`<Vuex Store 데이터 가져오기>`
> `mapGetters`라는 `vuex`의 모듈을 `import` 시키고
> `cumputed` 항목에 **Vuex Store**에서 가져올 데이터의 **getter**를 가져와서 셋팅하면
> **Vuex Store** 값이 변경되면 즉시 화면에 렌더링 해준다
> 사용 하는 방법은 사용할 곳에서 `this.branchInfo` 형식으로 사용하면 된다
```javascript
import { mapGetters} from 'vuex'

computed : {
	...mapGetters({
		branchInfo : Constant.GET_FIND_BRANCH_INFO, //Vuex 가맹점 선택 정보 가져오기
	})
}
```

#### 3. methods 셋팅`<선택값 유지 셋팅>`
##### 가맹점선택 선택값 유지
> 선택 값 저장을 위한 자세한 `methods`셋팅 설명은 [**공통 methods 셋팅**](#commonSelectKeepGuide)을 참조
> `this.$store.dispatch(Constant.SET_SESSION_SELECTED, this.branchInfo)`
> 가맹점선택 값을 유지 하기 위해서는 `search()` 부분에 위와 같이 명시 하면된다
> `this.branchInfo`는 **Vuex Store**에 현재 선택된 가맹점선택 정보를 담고있고
> `computed`에 지정한 `mapGetters`가 **Vuex Store**데이터가 변경될때 마다 즉시 변경된 정보를 받아오므로 
> 전문 요청시 현재 선택된 가맹점 선택값을 가져올 수 있다
```javascript
methods: {
	getDataList() {
	
		//전문데이터 조합을 위한 배열 생성
		let inValue = [];
		inValue.push(this.pageInfo.pageNo);	//페이지_요청번호	
		inValue.push(this.pageInfo.pageSize); //페이지_출력개수 (화면출력 데이터 수)
		inValue.push(this.branchInfo.hdCode); //검색_제휴본사_코드 (로그인정보, NULL: 전체)
		inValue.push(this.branchInfo.brCode); //검색_총판_코드 (로그인정보, NULL: 전체)
		inValue.push(this.branchInfo.stCode); //검색_가맹점_코드 (로그인정보, NULL: 전체)
		inValue.push(this.branchInfo.multiType); //검색_멀티_구분 (로그인정보, 검색가맹점의 멀티구분)	
		inValue.push(this.branchInfo.multiStCode); //검색_멀티_가맹점_코드 (NULL: 전체)
		
		//전문 데이터
		let param = {
			REQ_TYPE : "204",        //전송타입
			REQ_NUM : "AW04_02_V01", //전문번호
			VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
		}
	
		//VUEX 페이징 리스트 조회
		this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)
	},
	//화면에서 직접 검색 클릭시에만 세션에 저장하도록 화면 클릭 이벤트에는 아래처럼 적용
	search() {
		this.getDataList();
		//FIND_BRANCH 선택값 유지 정보(세션스토리지 SELECTED에 저장)
		this.$store.dispatch(Constant.SET_SESSION_SELECTED, this.branchInfo)
	},
}
```

#### 5. created 셋팅`<옵션 설정>`
##### 가맹점 선택 컴포넌트 옵션
> **필수 설정 사항은 없다 **
> - [ ] **TYPE**
> - [ ] **?_YN**
> - [ ] **?_WIDTH**
> - [ ] **OPTION**
> 중 변경할 옵션만 설정하면 된다
```javascript
view : {
	// 가맹점 선택 표출 타입(ALL:전체 HD:본사 BR:총판 ST:가맹점(멀티가맹점제외))
	TYPE: 'ALL'
	,HD_YN:      false
	,BR_YN:      false
	,ST_YN:      false
	,ST_MULTI_YN: false

	,HD_WIDTH: '170px' //본사 SELECT박스 WIDTH
	,BR_WIDTH: '170px' //총판 SELECT박스 WIDTH
	,ST_WIDTH: '170px' //가맹점 SELECT박스 WIDTH
	,ST_MULTI_WIDTH: '170px' //멀티가맹점본사 SELECT박스 WIDTH

	,OPTION: { //옵션
		ALL: true //본사 전체 선택 표출여부
		,ALL_NAME:'본사 전체'  //본사 전체 선택 표출명
		,DEFAULT_SELECTED:'' //본사 기본 선택값
	}
}
```

##### 적용 예시
> 아래의 예시는 가맹점 선택 표출 타입을 `ALL`로 지정하고 
> 본사 전체 선택 옵션을 `true`로 지정하였다
> `this.$store.dispatch(Constant.SET_FIND_BRANCH_TYPE, viewType);`
> 지정된 옵션 오브젝트를  'created'훅에서 위의  **Vuex Action** 호출하고 파라메터로 보내면 셋팅된다
```javascript
created() { //최초 로드시 data와 events가 활성화되는 훅
	//가맹점 선택 셀렉트 박스 표출 TYPE ALL 셋팅(ALL, HD, BR, ST)
	let viewType = {
		TYPE: 'ALL',
		OPTION : { //옵션
			ALL : true //본사 전체 선택 표출여부
			,ALL_NAME:'본사 전체'  //본사 전체 선택 표출명
			,DEFAULT_SELECTED:'H0003' //본사 기본 선택값
		}
	}
	//VUEX 가맹점 선택 옵션 셋팅
	this.$store.dispatch(Constant.SET_FIND_BRANCH_TYPE, viewType);
}
```
------------------------------------------------------------------------------------------------------------------------------
## 시스템 코드`<FindSycode.vue>`
### 시스템 코드 컴포넌트 적용 가이드
`시스템 코드 컴포넌트 사용 테스트 화면` 참조
#### 1. components 셋팅`<컴포넌트 적용>`
##### 컴포넌트 적용 방법
> 시스템 코드 컴포넌트 셋팅은 적용할 컴포넌트 파일을 `import` 시키고 
> `components ` 항목에 설정하면 된다.
```javascript
import includeFindSycode from '@/common/include/FindSycode'

components: {
	'include-find-sycode' : includeFindSycode //시스템 코드 컴포넌트
}
```

##### HTML 적용 방법
> `codeList`를 `v-for`로 루프 돌면서 설정된 수만큼 시스템 코드 항목을 만든다
> 옵션중 `SY_NAME`을 특별하게 설정하지 않으면 기본적으로 **DB**에 있는 `SY_NAME`을
> 필터링하여 가져온다 `ex) 주문_구분_코드 -> 주문구분`
> 루프문을 돌면서 전달 오브젝트인 `req-info`에 개별`code` 설정 오브젝트를
> 하나씩 따로 시스템 코드 컴포넌트로 넘겨서 `codeList`에 설정된 모든 항목을 셋팅한다
```htmlbars
<table>
	<tr v-for="(code, index) in codeList" :key="index">
		<td class="search-title">{{code.SY_NAME}}</td>
		<td><include-find-sycode :req-info="code"></include-find-sycode></td>
	</tr>
</table>
```

#### 2. cumputed 셋팅`<Vuex Store 데이터 가져오기>`
> `cumputed` 항목에 **Vuex Store**에서 가져올 데이터의 **getter**를 가져와서 셋팅하면
> **Vuex Store** 값이 변경되면 즉시 화면에 렌더링 해준다
> 사용 하는 방법은 사용할 곳에서 `this.codeList` 형식으로 사용하면 된다
```javascript
import Constant from '@/common/js/constant'
import { mapGetters} from 'vuex'

computed : {
	...mapGetters({
		codeList : Constant.GET_FIND_SY_CODE_LIST, //Vuex 시스템코드 리스트 가져오기
	})
}
```

#### 3. methods 셋팅`<선택값 유지 셋팅>`
##### 시스템 코드 선택값 유지
> 선택 값 저장을 위한 자세한 `methods`셋팅 설명은 [**공통 methods 셋팅**](#commonSelectKeepGuide)을 참조
> `this.$store.dispatch(Constant.SET_SESSION_ARRAY_SELECTED, this.codeList)`
> 시스템 코드 선택 값을 유지 하기 위해서는 `search()` 부분에 위와 같이 명시 하면된다
> `this.codeList`는 **Vuex Store**에 현재 선택된 시스템 코드 정보를 담고있고
> `computed`에 지정한 `mapGetters`가 **Vuex Store**데이터가 변경될때 마다 즉시 변경된 정보를 받아오므로 
> 전문 요청시 현재 시스템 코드 선택값을 가져올 수 있다
```javascript
methods: {      
	getDataList() {

		//전문데이터 조합을 위한 배열 생성
		let inValue = [];
		inValue.push(this.pageInfo.pageNo);		// 페이지_요청번호	
		inValue.push(this.pageInfo.pageSize);	// 페이지_출력개수 (화면출력 데이터 수)
		//코드리스트 만큼 순서대로 배열에 담는다
		for(let code of this.codeList){
			inValue.push(code.SELECTED);
		}
		inValue.push('');
		inValue.push('');
		inValue.push('');
		inValue.push('');
		inValue.push('');
		inValue.push('');

		//전문 데이터
		let param = {
			REQ_TYPE : "203",        //전송타입
			REQ_NUM : "AW03_06_V01", //전문번호
			VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
		}

		//페이징 리스트 조회
		this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)
	},
	search(){
		this.getDataList();
		//FIND_SY_CODE 선택값 유지 정보(세션스토리지 SELECTED에 저장)
		this.$store.dispatch(Constant.SET_SESSION_ARRAY_SELECTED, this.codeList)

	}
}
```

#### 4. created 셋팅`<옵션 설정>`
<a id="systemCodeOption"></a>
##### 시스템 코드 컴포넌트 옵션
> 시스템 코드 옵션
> 필수 값인 
> - [x] **SY_CODE**
> - [x] **TYPE**
> 를 제외하고는 비워도 무방하다
```javascript
/**
 * 각 화면 data에 셋팅 해야되는 SY_CODE를 셋팅하고
 * created에서 Constant.SET_FIND_SY_CODE_LIST Action을 통해 codeList를 셋팅한다
 * 필수 값인 SY_CODE, TYPE 을 제외하고는 비워도 무방하다
 */
codeList: [
	{
		SY_CODE: 'C1'   //필수 시스템 코드*
		SY_NAME: '업무1' //시스템 코드 명
		, PARENT_SY_CODE: '' //분류_코드 (NULL: 전체)
		, PARENT_DT_CODE: '' //상위_분류_코드 (NULL: 없음)
		, DATA_STATUS: ''   //(NULL: 전체, 0: 삭제, 1: 정상, 2: 정지)
		, LAST_SYNC_DATE: '' //마지막_동기화_일시 (NULL: 전체, YYYYMMDDHH24MISS)
		, TYPE:'checkbox'  //템플릿 타입 (checkbox, select, radio)*
		, OPTION:{
			ALL:true //전체 선택 옵션 표출여부
			,ALL_NAME:'커스텀 전체' //전체 선택 옵션 표출시 표출되는 문자
			,DEFAULT_SELECTED:''  //기본 선택값
		} 
		, WIDTH:'220px' //TYPE이 select이면 설정한 사이즈로 조정한다 기본값은 170px이다
		, SELECT:[]	//선택정보
		, DATA:[]	//조회된 데이터
	}
 ]
```

##### 적용 예시
> 아래는 항목이 여러개일때 여러 시스템 코드 옵션을 설정한 예시이다
> 'created'훅에 **시스템 코드 항목**을 셋팅할 `findSyCodeConfigs` 오브젝트를 생성한다
> [**시스템 코드 컴포넌트 옵션**](#systemCodeOption)을 참조하여 필요한 항목의 옵션을 설정하면 된다
> **_필수 옵션은 반드시 설정해야 한다!_**
```javascript
created() { //최초 로드시 data와 events가 활성화되는 훅
	let findSyCodeConfigs = [
			{
				SY_CODE: 'O1'
				, SY_NAME: '주문구분'
				, PARENT_SY_CODE: '' //분류_코드 (NULL: 전체)
				, PARENT_DT_CODE: '' //상위_분류_코드 (NULL: 없음)
				, DATA_STATUS: ''    //(NULL: 전체, 0: 삭제, 1: 정상, 2: 정지)
				, LAST_SYNC_DATE: '' //마지막_동기화_일시 (NULL: 전체, YYYYMMDDHH24MISS
				, TYPE:'checkbox'  	 //템플릿 타입 (checkbox, select, radio)
				, SELECTED:[]		 //선택정보
				, DATA:[]		     //조회된 데이터
			}
			, {SY_CODE: 'O2', TYPE:'checkbox'}
			, {SY_CODE: 'O3', TYPE:'checkbox'}
			, {SY_CODE: 'O4', TYPE:'select', WIDTH:'220px' 
				OPTION:{
					ALL:true //전체 선택 옵션 표출여부
					,ALL_NAME:'커스텀 전체' //전체 선택 옵션 표출시 표출되는 문자
					,DEFAULT_SELECTED:'1001' //기본 선택값
				}, 
			}
			, {SY_CODE: 'O7', TYPE:'radio', OPTION:{ALL:true}}
			, {SY_CODE: 'O8', TYPE:'select', OPTION:{ALL:true}}
			, {SY_CODE: 'PT', TYPE:'checkbox'}
		]
}
```

##### 시스템 코드 컴포넌트 옵션 적용
> `this.$store.dispatch(Constant.SET_FIND_SY_CODE_LIST, findSyCodeConfigs)`
> 설정한 옵션을 `created`훅에서 위의 **Vuex Action** 호출하고 파라메터로 보내면 **옵션 설정사항**이 **적용**된다
```javascript
created() { //최초 로드시 data와 events가 활성화되는 훅
	//VUEX STORE에 시스템 코드 초기값 셋팅
	this.$store.dispatch(Constant.SET_FIND_SY_CODE_LIST, findSyCodeConfigs)
}
```