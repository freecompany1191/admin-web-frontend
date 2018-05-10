<template>
	<div class="content overflowH">
		<div class="loginBorder">
			<table>
				<tr>
					<td class="w60">아이디</td>
					<td>
						<input type="text" class="w200" v-model="userId" placeholder="아이디" autocomplete="off">
					</td>
					<td rowspan="2">
						<button class="btn-box-r bgGray overflowH floatRight" style="line-height: 50px;width:90px;" @click="validate()">로그인</button>
					</td>
				</tr>
				<tr>
					<td>비 번</td>
					<td>
						<input type="password" class="w200" v-model="userPwd" placeholder="비밀번호" autocomplete="off"
								v-on:keyup.enter="validate()">
					</td>
				</tr>
			</table>
		</div>
		<div class="bannerWrap"><img src="@/assets/banner.png" class="bannerImage"></div>
	</div>
</template>

<script>
// import httpCommon from '@/common/js/http/http-common'
import util from '@/common/js/utils/util'
import authUtil from '@/common/js/utils/authUtil'
import httpUtil from '@/common/js/utils/httpUtil'
import eventBus from '@/common/include/eventBus'
import Constant from '@/common/js/constant'
import { common } from '@/common/js/common'
import { mapGetters } from 'vuex';

import Api from '@/common/js/http/axiosApi'

export default {
	name: 'login',
	data () {
		return {
			userId: ''
			, userPwd: ''
		}
	},
	created() {
		//로드시 실행
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.$EventBus.$emit(eventBus.APP_VUE_CALLBACK, {popup:true});

			if (common.SERVICE_YN == 'N') {
				this.userId = 'system';
				this.userPwd = 'o2osys2017';
			}
		})
	},
	mounted : function() {
		//로드시 실행
	},
	//계산형 단일 실행
	computed: mapGetters([Constant.IS_LOGIN]), //VUEX 로그인 여부
	methods: {
		
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		validate: function() {
			if (util.isNull(this.userId) && util.isNull(this.userPwd)) {
				alert('아이디와 패스워드를 입력하세요');
				return;
			}
			if (util.isNull(this.userId)) {
				alert('아이디를 입력하세요');
				return;
			}
			if (util.isNull(this.userPwd)) {
				alert('비밀번호를 입력하세요');
				return;
			}

			this.loginSubmit();
		},
		loginSubmit() {

			let param = {
				userId : this.userId    //아이디
				,userPwd : this.userPwd //패스워드
			}
			//VEUX 로그인 처리
			this.$store.dispatch(Constant.LOGIN_SUBMIT, param);

			/* 
			//통신 호출
			httpCommon.sendPost(this, "100", IN_REQ_NUM, IN_VALUE
			, function suc(vue, data) {
				//로그인 쿠키정보 비우기
				authUtil.logout();
				let row = data.out_ROW1[0];
				//console.log('row = '+ JSON.stringify(row));

				//userInfo JSON 파서
				var userInfo = authUtil.userInfoRowParser(vue, row);
				//로그인처리
				if(authUtil.login(userInfo)) {
					//쿠키 로그인 유저 정보 가져오기
					//console.log(authUtil.getUserInfo());
					//console.log('SUCCESS : '+JSON.stringify(authUtil.getUserInfo()));
				}
			});
			 */
		},
		//async 용 로그인 메서드
		async loginSync(param) {
			//VUEX 로그인 처리 
			await this.$store.dispatch(Constant.ASYNC_LOGIN_SUBMIT, param);
			
			if(this.isLogin){
				// this.$EventBus.$emit(eventBus.APP_VUE_CALLBACK, {popup:false});
				this.$router.push({ path: '/main'});
			}
	
		}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	},
	watch: {
		//비동기 적합
		//데이터가 변할시마다 함수 호출
		//로그인 성공시 즉시 메인으로 이동 시킴
		isLogin: function(val) {
			if(val){
				this.$EventBus.$emit(eventBus.APP_VUE_CALLBACK, {popup:false});
				this.$router.push({ path: '/main'})
			}
		}
		
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {margin-top: 20px;}
.bannerWrap,
.loginBorder {float:left;border: 1px solid #ebebeb;border-radius:20px;}
.loginBorder {margin-right: 5px;width: 540px;padding: 30px;}
.bannerImage {border-radius:19px; vertical-align:middle;}
.loginBorder table {margin:0 auto; width:360px;}
</style>