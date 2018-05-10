<template>
  <div style="padding:0; margin:0; width:100%;">
    <label  v-for="chkbox in arrSyCode" :key="chkbox.DT_CODE" ><input type="checkbox" v-bind:value="chkbox.DT_CODE">{{chkbox.DT_NAME}}</label>
  </div>
</template>
<script>
//포멧변환
import moment from "moment";
//달력
import Datepicker from 'vuejs-datepicker'
import DateLanguages from '@/common/js/utils/DateLanguages.js'
//HTTP 통신 임포트
import httpCommon from '@/common/js/http/http-common.js';
//로그인 쿠키
import authUtil from '@/common/js/utils/authUtil.js';
//FNC
import util from '@/common/js/utils/util.js';
import util_validate from '@/common/js/utils/util_validate.js';
import fnc from '@/common/js/utils/function.js';
//INCLUDE
//이벤트 버스 전역변수
import eventBus from '@/common/include/eventBus.js';

export default {
	name: 'find_sycode',
	data () {
		return {
            //리턴 파라미터
            find_param: {
                sycode : ''
            }
            //시스템코드 배열
			, arrSyCode: []
		}
	},
	created() {
        // 시스템코드 이벤트버스 정보 수신
        this.$EventBus.$on(eventBus.FIND_SYCODE_CALLBACK, (param) => {
            this.find_param = param;
        });

		//로드시 실행
		this.$nextTick(function () {
            // 모든 화면이 렌더링된 후 실행합니다.
            this.schSyCode();
		})		
	},
	computed : {
		//계산형 단일 실행
	},
	methods: {
		//이벤트 기능정의
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////시스템코드
        schSyCode: function(){
            //변수할당
			var tmp0 = this.find_param.sycode;
			var tmp1 = "";
            var tmp2 = "";
            var tmp3 = "1";
            var tmp4 = "";            
			//전문번호
			var IN_REQ_NUM = "GR00_05_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   //분류_코드 (NULL: 전체)
					+ tmp1 + "│" //상위_분류_코드 (NULL: 없음)
                    + tmp2 + "│" //상위_구분_코드 (NULL: 없음)
                    + tmp3 + "│" //(NULL: 전체, 0: 삭제, 1: 정상, 2: 정지)
                    + tmp4 + "│" //마지막_동기화_일시 (NULL: 전체, YYYYMMDDHH24MISS (예: 20160518085059)
					;
			// console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
            this.arrSyCode = [];			
			//통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrSyCode = data.out_ROW1;				
			});
        }		
	},
	watch : {
		//데이터가 변할시마다 함수 호출
		
	},
	beforeDestroy() {
		this.$EventBus.$off(eventBus.FIND_SYCODE_CALLBACK);
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

