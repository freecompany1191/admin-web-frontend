<template>
	<div class="paging-box" v-if="info.totalCount != 0">
		<div class="paging-inner">
			<a class="arr arr-prev" v-if="info.pageNo > 1" v-on:click="pageChange(info.pageNo - 1);"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
			<a class="arr arr-prev" v-else><i class="fa fa-angle-left" aria-hidden="true"></i></a>

			<a class="num" v-for="row in info.pageArray" :key="row.no" v-if="info.pageNo != row.no" v-on:click="pageChange(row.no);" >
			{{row.no}}
			</a>
			<b class="num" v-else>{{row.no}}</b>

			<a class="arr arr-next" v-if="info.pageLength > info.pageNo" v-on:click="pageChange(info.pageNo + 1);"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
			<a class="arr arr-next" v-else><i class="fa fa-angle-right" aria-hidden="true"></i></a>
		</div>
	</div>
</template>

<script>
import Constant from '@/common/js/constant'
import util from '@/common/js/utils/util.js'
import { mapGetters } from 'vuex'

export default {
	name: 'list_paging',
	data () {
		return {
			
		}
	},
	//계산형 단일 실행
	computed: mapGetters({ 
		info : Constant.GET_PAGE_INFO , //VUEX 페이징 정보
		param : Constant.GET_PARAM      //VUEX 전문 파라메터
	}),
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징 선택
		pageChange: function(no) {
			//라우트 변경 처리
			this.$router.push({ name: this.info.pageName, query: { pageNo: no } })
		}
		
	},
	watch: {
		'$route' (to, from) {
			// console.log('this.info.pageName = ',this.info.pageName);
			// console.log('this.$route.name = ',this.$route.name);
			if (!util.isNull(to.query.pageNo)) {

				//VUEX pageNo 와 라우트 query pageNo가 다르면 수행
				if (this.info.pageNo != to.query.pageNo){
					//라우터 pageNo에 따라 VUEX pageNo 변경
					this.$store.dispatch(Constant.PAGE_CHANGE, to.query.pageNo);
				}
			} else {
				this.$router.go(-1);
			}
		}
	},
	beforeCreate() {//console.log('list paging beforeCreate');
		//VUEX 페이징 정보 초기화
		this.$store.dispatch(Constant.RESET_PAGE_INFO);
		
	},
	created() {//console.log('...list paging created');
		//로드시 실행
		//VUEX 페이지 네임 셋팅
		this.$store.dispatch(Constant.SET_PAGE_INFO, { pageName: this.$route.name });

		//query PageNo가 없으면 1로 셋팅하고 있으면 query PageNo로 셋팅
		let pageNo = !util.isNull(this.$route.query.pageNo) ? this.$route.query.pageNo : 1;
		//VUEX pageNo 와 라우트 query pageNo가 다르면 수행
		if (this.info.pageNo != pageNo){
			//라우터 pageNo에 따라 VUEX pageNo 변경
			this.$store.dispatch(Constant.PAGE_CHANGE, pageNo);
		}
			
	}
	 
	// ,
	// beforeMount(){console.log('list paging beforeMount');},
	// ,mounted() {console.log('list paging mounted');}
	// beforeUpdate() {console.log('list paging beforeUpdate');},
	// updated() {console.log('list paging updated');},
	// activated() {console.log('list paging activated');},
	// deactivated() {console.log('list paging deactivated');},
	// beforeDestroy() {console.log('list paging beforeDestroy');},
	,destroyed() {//console.log('list paging destroyed');
		//VUEX 페이징 정보 초기화
		this.$store.dispatch(Constant.RESET_PAGE_INFO);
	}
}
</script>

<style>

</style>
