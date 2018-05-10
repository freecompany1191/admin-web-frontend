<template>
  <div class="content overflowH">    
    <div class="loginBorder">
      <table>
        <tr>
          <td>메인화면</td>
          <!-- <td>{{isLogin}}</td> -->
        </tr>
        <tr>
          <!-- <td><button type="button" v-on:click="excelDown()">엑셀다운로드</button></td> -->
        </tr>
        <tr>
          <!-- <td><include-find-branch></include-find-branch></td> -->
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil.js';
import includeFindSycode from '@/common/include/FindSycode';
import { mapGetters} from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      loading: false,
      userId: 'system',
      userPwd: 'o2osys2017'
    }
  },
  created(){
  
  },
  components: {
		'include-find-sycode' : includeFindSycode
	},
  computed : mapGetters(['isLogin'])  //계산형 단일 실행
  ,
  methods: {      
    //이벤트 기능정의
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    excelDown: function() { //전문 데이터 전송
      try {
           
           var param = {
                REQ_TYPE:"203"
              , REQ_NUM:'AW03_05_V01'
              , VALUE:"│" //조회 조건
              // 엑셀 헤더 String 배열로 입력된 그대로 헤더를 만든다
              // 헤더를 지정하지 않으면 기본 컬럼 키 값으로 헤더를 만든다
              , HEADER: ["템플릿_코드","템플릿_구분","템플릿_구분 값","템플릿_제목","템플릿_내용","버튼_정보 (버튼명)","입력_일시","승인_상태","승인_상태 값","반려 메세지"]
           }

            // 통신 호출
            httpCommon.sendExcelDown(this, param
            , function suc(vue, data) {
              console.log('test complete');
            });
      
       }
            catch(e) {
                console.log("Error Message: " + e.message);
                console.log("Error Code: " +e.number & 0xFFFF);
                console.log("Error Name: " + e.name);
            }
		},
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },
  watch : {
    //비동기 적합
    //데이터가 변할시마다 함수 호출
  }
  // ,beforeCreate() {// console.log('beforeCreate');},
  ,created() {// console.log('created');
    // console.log('store = ',this.$store.state.auth.isLogin);
  }
	// ,beforeMounted(){console.log('beforeMounted');}
	// ,mounted() {console.log('mounted');}
	// ,beforeUpdate() {console.log('beforeUpdate');}
	// ,updated() {console.log('updated');}
	// ,activated() {console.log(' activated');}
	// ,deactivated() {console.log('deactivated');}
	// ,beforeDestroy() {console.log('beforeDestroy');}
	// ,destroyed() {console.log("destroyed");}
}
</script>

<style>

</style>
