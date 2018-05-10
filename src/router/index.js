import Vue from 'vue'
import Router from 'vue-router'

import main from '@/components/main/main'
//페이지 임포트
////////////////////////////////////////로그인
import login from '@/components/login'
////////////////////////////////////////등록및수정

////////////////////////////////////////정산
//수수료정산비율
import feeList from '@/components/act/fee/list'
////////////////////////////////////////통계

////////////////////////////////////////고객분석

////////////////////////////////////////설정
import stEventList from '@/components/st/event/list';
import stEventView from '@/components/st/event/view';
import stGoodsPopupView from '@/components/st/event/goodsPopup';

////////////////////////////////////////게시물관리

////////////////////////////////////////주문관리

////////////////////////////////////////카카오주문관리
//신청관리
import kakaoOrdReqList from '@/components/kakaoOrd/request/list';
import kakaoOrdReqView from '@/components/kakaoOrd/request/view';
import kakaoOrdReqViewIns from '@/components/kakaoOrd/request/ins/view'
import kakaoOrdReqViewAct from '@/components/kakaoOrd/request/act/view'
import kakaoOrdReqViewPlus from '@/components/kakaoOrd/request/plus/view'
//템플릿관리
import kakaoOrdTmpList from '@/components/kakaoOrd/template/list';
import kakaoOrdTmpView from '@/components/kakaoOrd/template/view';
//해피톡
import happyTalkList from '@/components/kakaoOrd/happytalk/list';
import happyTalkView from '@/components/kakaoOrd/happytalk/view';
//주문톡
import ordTalkList from '@/components/kakaoOrd/ordTalk/list';
import ordTalkView from '@/components/kakaoOrd/ordTalk/view';

//테스트
import testList from '@/components/test/happytalk/list';
import testView from '@/components/test/happytalk/view';
import testSyCodeView from '@/components/test/sycode/View';


Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		//루트
		{path: '/', redirect:'/login'},
		//로그인
		{path: '/login',name: 'login',component: login},
		//메인
		{path: '/main', name: 'main',component: main},
		//정산
		{path: '/feeList', name: 'feeList',component: feeList},
		//카카오주문관리
		{path: '/kakaoOrdReqList',name: 'kakaoOrdReqList',component: kakaoOrdReqList},
		{
			path: '/kakaoOrdReqView/:st_code/:multi_type',name: 'kakaoOrdReqView',component: kakaoOrdReqView, props : true,
				children: [
					{path:'ins', name:'ins',component: kakaoOrdReqViewIns, props : true},
					{path:'act', name:'act',component: kakaoOrdReqViewAct, props : true},
					{path:'plus', name:'plus',component: kakaoOrdReqViewPlus, props : true}
				]  
		},
		{path: '/kakaoOrdTmpList',name: 'kakaoOrdTmpList',component: kakaoOrdTmpList},
		{path: '/kakaoOrdTmpView/:tplt_code',name: 'kakaoOrdTmpView',component: kakaoOrdTmpView, props : true},
		{path: '/happyTalkList',name: 'happyTalkList',component: happyTalkList},
		{path: '/happyTalkView/:no',name: 'happyTalkView',component: happyTalkView, props : true},
		{path: '/ordTalkList',name: 'ordTalkList',component: ordTalkList},
		{path: '/ordTalkView/:no',name: 'ordTalkView',component: ordTalkView, props : true},
		//설정
		{path: '/stEventList',name: 'stEventList',component: stEventList},
		{path: '/stEventView/:st_code',name: 'stEventView',component: stEventView, props : true},
		{path: '/stGoodsPopupView/:st_code',name: 'stGoodsPopupView',component: stGoodsPopupView, props : true},
		//테스트
		{path: '/testList',name: 'testList',component: testList},
		{path: '/testView/:no',name: 'testView',component: testView, props : true},
		{path: '/testSyCodeView',name: 'testSyCodeView',component: testSyCodeView},

	]
})
