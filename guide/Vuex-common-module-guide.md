# VUEX 공통 모듈 가이드
---------------------------------------------------
[**Vuex**](https://github.com/stepanowon/vuejs_book/blob/master/vuex/about_vuex.md)로 처리 하는 공통 모듈 적용 가이드

[TOC]
## VUEX 공통 모듈 파일구조
```
├─common
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
│      └─sycode
│              View.vue - 시스템 코드 컴포넌트 사용 테스트 화면
│              
└─store
    │  index.js - VUEX STORE 메인
    │  
    └─modules
        │  
        └─common
            └─http
                   httpTransfer.js - 공통 HTTP통신 STORE
```
------------------------------------------------------------------------------------------------------------------------------
## 데이터 조회`<httpTransfer.js>`
일반적인 리스트 화면이나 데이터를 조회하는 화면에 사용 할 수 있다
기본적인 공통 적용 사항은 [**VEUX 공통 컴포넌트 가이드**](https://bitbucket.org/YongJik-Song/admin.mannashop.co.kr/wiki/VUEX%20%EA%B3%B5%ED%86%B5%20%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%20%EC%82%AC%EC%9A%A9%20%EA%B0%80%EC%9D%B4%EB%93%9C)에 작성한 내용 중 [**공통사항**](https://bitbucket.org/YongJik-Song/admin.mannashop.co.kr/wiki/VUEX%20%EA%B3%B5%ED%86%B5%20%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%20%EC%82%AC%EC%9A%A9%20%EA%B0%80%EC%9D%B4%EB%93%9C#markdown-header-)과 동일하므로 
순수하게 데이터 조회 모듈에 대한 가이드만 작성한다

### 데이터 조회 모듈 적용 가이드
#### 1. cumputed 셋팅`<Vuex Store 데이터 가져오기>`
##### 데이터 조회 모듈의 `getters` 항목
```javascript
const getters = {
	[Constant.GET_PARAM]: state => state.param,        //전송한 파라메터
	[Constant.GET_RES_DATA]: state => state.resData,   //응답 받은 data
	[Constant.GET_OUT_VALUE]: state => state.outValue, //응답 받은 out_VALUE
	[Constant.GET_OUT_ROW1]: state => state.outRow1,   //응답 받은 out_ROW1
	[Constant.GET_OUT_ROW2]: state => state.outRow2,   //응답 받은 out_ROW2
	[Constant.GET_OUT_ROW3]: state => state.outRow3,   //응답 받은 out_ROW3
}
```

##### `mapGetters` 셋팅 방법
> `mapGetters`라는 `vuex`의 모듈을 `import` 시키고
> `cumputed` 항목에 **Vuex Store**에서 가져올 데이터의 **getter**를 가져와서 셋팅하면
> **Vuex Store** 값이 변경되면 즉시 화면에 렌더링 해준다
> 사용 하는 방법은 사용할 곳에서 `this.dataList` 형식으로 사용하면 된다
> 다른 데이터를 가져오려면 위의 `getters`항목을 참조하여 셋팅하면 된다
```javascript
import { mapGetters} from 'vuex'

computed : {
	...mapGetters({
		dataList   : Constant.GET_OUT_ROW1 //Vuex 리스트 데이터 가져오기
	})
}
```

#### 2. HTML 셋팅`<Vuex Getter 데이터 보여주기>`
> 아래와 같이 `v-for`문으로 `dataList`를 처리하도록 작성하면 된다
```htmlbars
<!-- 리스트 -->
<div class="table-list">
	<table>
		<thead>
			<tr>
				<th width="10%">주문일련번호</th>
				<th width="10%">주문구분</th>
				<th width="10%">주문상태</th>
				<th width="10%">주문경로</th>
			</tr>
		</thead>
		<tbody id="dataList">
			<tr v-if="pageInfo.totalCount == 0">
				<td colspan="4">내역이 없습니다</td>
			</tr>
			<tr v-else v-for="row in dataList" :key="row.ORD_NO">
				<td style="text-align:left;">{{row.ORD_NO}}</td>
				<td>{{row.ORD_TYPE_CD}}</td>
				<td>{{row.ORD_STATUS_CD}}</td>
				<td>{{row.ORD_PATH_CD}}</td>
			</tr>
		</tbody>
	</table>
</div>
```


#### 3. methods 셋팅`<데이터 조회를 위한 메서드 구성>`

##### 1) 페이징을 위한 데이터 조회 메서드 구성 가이드
> `this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)` 
> 페이징 리스트 데이터를 조회를 위한 모듈은 위와 같이 파라메터를 작성하여 요청하여 조회가 완료되면
> 즉시 `mapGetters`에서 **Vuex Store**에 변경된 데이터로 렌더링 해준다
> 자세한 리스트 페이징 컴포넌트 적용법은 [**VEUX 공통 컴포넌트 가이드**](https://bitbucket.org/YongJik-Song/admin.mannashop.co.kr/wiki/VUEX%20%EA%B3%B5%ED%86%B5%20%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%20%EC%82%AC%EC%9A%A9%20%EA%B0%80%EC%9D%B4%EB%93%9C)의 [**리스트 페이징**](https://bitbucket.org/YongJik-Song/admin.mannashop.co.kr/wiki/VUEX%20%EA%B3%B5%ED%86%B5%20%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%20%EC%82%AC%EC%9A%A9%20%EA%B0%80%EC%9D%B4%EB%93%9C#markdown-header-listpagingvue)을 참조하기 바란다
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
	}
}
```

##### 2) 일반 데이터 조회 메서드 구성 가이드
> `this.$store.dispatch(Constant.SEARCH_HTTP_DATA, param)`
> 일반 데이터를 조회를 위한 모듈은 위와 같이 파라메터를 작성하여 요청하여 조회가 완료되면
> 즉시 `mapGetters`에서 **Vuex Store**에 변경된 데이터로 렌더링 해준다
```javascript
methods: {
	getDataList() {
	
		//전문데이터 조합을 위한 배열 생성
		let inValue = [];
		inValue.push(this.sendTimeType); //발송시점
		
		//전문 데이터
		let param = {
			REQ_TYPE : "204",        //전송타입
			REQ_NUM : "AW04_02_V01", //전문번호
			VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
		}
	
		//VUEX 데이터 조회
		this.$store.dispatch(Constant.SEARCH_HTTP_DATA, param)
	}
}
```

##### 3) VALUE 조합 함수
전문 요청시 파라메터로 보내는 `VALUE` 값에 반복적으로 붙이는 `│`특수문자에 대해 **인적오류**를 방지하고자
`util.js`파일에 `getValue()` 함수를 사용한다
> 아래와 같이 `inValue` 배열을 생성하고 요청해야되는 순서대로 배열에 `push`  한다음
>  `util.getValue(inValue)` 라고 작성하면 배열 순서대로 돌면서 `│`특수문자를 자동으로 붙인다
>  `getValue()` 함수는 기본적으로 빈 값을 **2**개 더 추가 하므로 모자란 수 만큼 계산해서
>  `inValue.push('')` 이렇게 빈 공백을 `push`해주면 된다
```javascript
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

//전문 데이터
let param = {
	REQ_TYPE : "203",        //전송타입
	REQ_NUM : "AW03_06_V01", //전문번호
	VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
}
```