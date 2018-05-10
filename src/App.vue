<template>
	<div>
		<div class="wrap" v-show="popup == false">
			<div class="header">
				<div class="logo-header overflowH">
					<div class="floatLeft textLeft">MANNA <br>더 간편한 매장관리, <font style="font-size:18px;color:#ED4A65;">만나</font>다</div>
					<div class="floatLeft textCenter">&nbsp;</div>
					<div class="floatLeft textRight">
						<ul class="top-navi-right">
							<li v-if="isLogin == false"><router-link to="/"><i class="fa fa-circle-o-notch"></i> 로그인</router-link></li>
							<li v-if="isLogin == true" v-on:click="btnLogout()"><router-link to=""><i class="fa fa-power-off"></i> 로그아웃</router-link></li>
							<li v-if="isLogin == true" v-on:click="btnUserInfo()"><router-link to="/"><i class="fa fa-address-book-o"></i> 정보수정</router-link></li>
						</ul>
					</div>
				</div>
			</div>
			
			<div class="submenu" >
				<ul class="submenu-wrap">
					<li id="submenuTitle" v-if="false"><router-link to="/">등록 및 수정</router-link></li>
					<li id="submenuTitle"><router-link to="/feeList">정산</router-link></li>
					<li id="submenuTitle" v-if="false"><router-link to="/">통계</router-link></li>
					<li id="submenuTitle" v-if="false"><router-link to="/">고객분석</router-link></li>
					<li id="submenuTitle"><router-link to="/stEventList">설정</router-link></li>
					<li id="submenuTitle" v-if="false"><router-link to="/">게시물관리</router-link></li>
					<li id="submenuTitle" v-if="false"><router-link to="/">주문관리</router-link></li>
					<li id="submenuTitle"><router-link to="/kakaoOrdReqList">카카오주문관리</router-link></li>
				</ul><!--submenu-wrap-->
			</div>

			<!-- 등록 및 수정 -->
			<div class="sub-undermenu" v-if="false">
				<ul class="sub-undermenu-wrap">
					<li><router-link to="/">본사관리</router-link></li>
					<li><router-link to="/">총판관리</router-link></li>
					<li><router-link to="/">가맹점관리</router-link></li>
					<li><router-link to="/">가맹점설정복사</router-link></li>
					<li><router-link to="/">멀티가맹점</router-link></li>
					<li><router-link to="/">상품관리</router-link></li>
					<li><router-link to="/">상품그룹</router-link></li>
					<li><router-link to="/">배송원관리</router-link></li>
					<li><router-link to="/">배송그룹</router-link></li>
					<li><router-link to="/">배송그룹공유</router-link></li>
					<li><router-link to="/">명칭관리</router-link></li>
				</ul>
			</div>

			<!-- 정산 -->
			<div class="sub-undermenu">
				<ul class="sub-undermenu-wrap">
					<li v-if="false"><router-link to="/">매출실적</router-link></li>
					<li><router-link to="/feeList">수수료정산비율</router-link></li>
					<li v-if="false"><router-link to="/">만나페이</router-link></li>
					<li v-if="false"><router-link to="/">세금계산서</router-link></li>
					<li v-if="false"><router-link to="/">예수금관리</router-link></li>
					<li v-if="false"><router-link to="/">출금이체관리</router-link></li>
					<li v-if="false"><router-link to="/">이동정산관리</router-link></li>
				</ul>
			</div>
			
			<!-- 통계 -->
			<div class="sub-undermenu" v-if="false">
				<ul class="sub-undermenu-wrap">
					<li><router-link to="/">일별통계</router-link></li>
					<li><router-link to="/">월별통계</router-link></li>
					<li><router-link to="/">요일별통계</router-link></li>
					<li><router-link to="/">시간대별통계</router-link></li>
					<li><router-link to="/">상품별통계</router-link></li>
					<li><router-link to="/">가맹점분포도</router-link></li>
				</ul>
			</div>

			<!-- 고객분석 -->
			<div class="sub-undermenu" v-if="false">
				<ul class="sub-undermenu-wrap">
					<li><router-link to="/">회원관리</router-link></li>
				</ul>
			</div>
			
			<!-- 설정 -->
			<div class="sub-undermenu">
				<ul class="sub-undermenu-wrap">
					<li v-if="false"><router-link to="/">메인배너</router-link></li>
					<li v-if="false"><router-link to="/">시스템상품</router-link></li>
					<li v-if="false"><router-link to="/">고객추천정보초기화</router-link></li>
					<li v-if="false"><router-link to="/">고객주소이력관리</router-link></li>
					<li v-if="false"><router-link to="/">매장코드외부맵핑(포스)</router-link></li>
					<li v-if="false"><router-link to="/">매장코드외부맵핑(배달)</router-link></li>
					<li><router-link to="/stEventList">가맹점 이벤트</router-link></li>
				</ul>
			</div>
			
			<!-- 게시물관리 -->
			<div class="sub-undermenu" v-if="false">
				<ul class="sub-undermenu-wrap">
					<li><router-link to="/">게시물관리</router-link></li>
				</ul>
			</div>

			<!-- 주문내역 -->
			<div class="sub-undermenu" v-if="false">
				<ul class="sub-undermenu-wrap">
					<li><router-link to="/">주문내역</router-link></li>
				</ul>
			</div>

			<!-- 카카오주문관리 -->
			<div class="sub-undermenu">
				<ul class="sub-undermenu-wrap">
					<li><router-link to="/kakaoOrdReqList">신청관리</router-link></li>
					<li><router-link to="/kakaoOrdTmpList">템플릿관리</router-link></li>
					<li><router-link to="/happyTalkList">해피톡관리</router-link></li>
					<li><router-link to="/ordTalkList">주문톡관리</router-link></li>
					<li><router-link to="/testList">TEST</router-link></li>
					<li><router-link to="/testSyCodeView">SY_CODE</router-link></li>
				</ul>
			</div>

			<div class="content overflowH">
				<!-- 라우터 전환 -->
				<router-view/>
				<!-- 라우터 전환 -->
			</div>

			<div class="footer" v-show="popup == false">
				<div class="footer-wrap">
					<div class="o2oimage">
						<img src="./assets/logos.png" alt="Manna : Multi-Platform">
					</div>
					<p>
						오투오시스㈜ 대표전화 :  070-5126-2900 | 상담시간 : 평일 10:00 ~ 19:00<br/>
						Copyright O+OO Corp. All Rights Reserved.
					</p>
				</div>
			</div>
		</div>

		<div class="" v-if="popup == true">
			<!-- 라우터 전환 -->
			<router-view/>
			<!-- 라우터 전환 -->
		</div>
		<div class="loading_gif" v-if="isLoading">
			<img src="@/assets/loading.gif">
		</div>
		
		<div class="loading_gif" v-if="common.IS_LOADING">
			<img src="@/assets/loading.gif">
		</div>
	</div>
</template>

<!-- 공통 스타일 -->
<style>
@import './common/css/style.css';
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
</style>

<script>
import './common/js/jquery/jquery-1.11.1.min.js';
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil.js';
import Constant from '@/common/js/constant'
import eventBus from '@/common/include/eventBus.js';
import { common } from '@/common/js/common'
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'menuControll',
	data() {
		//초기데이터 선언
		return {
			popup:false
			, common: common
		}
	},
	created() {
		this.topMenu();

		/**
		 * 이벤트버스
		 * param.popup : 팝업여부 (위,아래 탭 보이기여부 => Y:안보임 N:보임)
		 */
		this.$EventBus.$on(eventBus.APP_VUE_CALLBACK, (param) => {
			this.popup = util.getNull(param.popup, false);
		});
		
		// 로그인정보 초기화
		this.changeLogin(authUtil.getUserInfo() ? true : false);
	},
	//계산형 단일 실행
	computed: mapGetters([
		Constant.IS_LOGIN,  //로그인 여부
		Constant.IS_LOADING //로딩바 여부
	]) ,
	methods: {
		...mapActions([Constant.CHANGE_LOGIN]), //auth.js Action 정의
		//이벤트 기능정의
		////////////////////////////////////////////메뉴토글
		topMenu: function () {
			//최초 로드시 숨김
			$(document).ready(function () {
				$(".sub-undermenu ul").hide();
				$(".sub-undermenu ul").eq(0).show();
			});
			//이벤트 처리
			$(function() {
				//클릭시
				$("li[id=submenuTitle]").click(function() {
					$(".sub-undermenu ul").hide();
					var index = $("li[id=submenuTitle]").index($(this));
					$(".sub-undermenu ul").eq(index).show();
				});
				//호버시
				$("li[id=submenuTitle]").hover(function() {
					$(".sub-undermenu ul").hide();
					var index = $("li[id=submenuTitle]").index($(this));
					$(".sub-undermenu ul").eq(index).show();
				});
			});
		}, ////////////////////////////////////////////end topMenu
		btnLogout: function() {
			authUtil.logout();
			this.$router.push({ name: 'login' })
			alert("로그아웃 되었습니다.");
		},
		btnUserInfo: function() {

		}
	},
	watch: {
		//비동기 적합
		//데이터가 변할시마다 함수 호출
	},
	beforeDestroy() {
		this.$EventBus.$off(eventBus.APP_VUE_CALLBACK);
	}
}
</script>




