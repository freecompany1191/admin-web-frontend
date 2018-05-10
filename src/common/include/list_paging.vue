<template>
	<div class="paging-box" v-if="info.arrPaging.length != 0">
		<div class="paging-inner">
			<a class="arr arr-prev" v-if="info.pageNo > 1" v-on:click="pageChange(info.pageNo - 1);"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
			<a class="arr arr-prev" v-else><i class="fa fa-angle-left" aria-hidden="true"></i></a>

			<a class="num" v-for="row in info.arrPaging" :key="row.no" v-if="info.pageNo != row.no" v-on:click="pageChange(row.no);" >
			{{row.no}}
			</a>
			<b class="num" v-else>{{row.no}}</b>

			<a class="arr arr-next" v-if="info.pageLength > info.pageNo" v-on:click="pageChange(info.pageNo + 1);"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
			<a class="arr arr-next" v-else><i class="fa fa-angle-right" aria-hidden="true"></i></a>
		</div>
	</div>
</template>

<script>
import util from '@/common/js/utils/util.js';
import eventBus from '@/common/include/eventBus.js';

export default {
	name: 'list_paging',
	data () {
		return {
			info: {
				pageNo: 1
				, pageSize: 30
				, totalData: 0
				, pageLength: 1
				, arrPaging: []
			}
		}
	},
	created() {
		//로드시 실행
		
		/**
		 * 리스트 이벤트버스
		 * type : 0:정보만 넘기기, 1:정보넘기면서 페이징 셋팅
		 * info : 정보
		 */
		this.$EventBus.$on(eventBus.LIST_PAGING_CALLBACK, (type, param) => {
			param.pageNo = util.getNull(param.pageNo, 1);
			param.pageSize = util.getNull(param.pageSize, 30);
			param.totalData = util.getNull(param.totalData, 0);
			param.pageLength = util.getNull(param.pageLength, 1);
			param.arrPaging = util.getNull(param.arrPaging, []);
			
			this.info = param;

			if (type == 1) {
				this.schPaging();
			}
		});

		this.$EventBus.$emit(eventBus.LIST_PAGING_RECEIVER, 0, this.info);

		this.$nextTick(function () {
		});
	},
	computed: {
		//계산형 단일 실행
	},
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징 선택
		pageChange: function(no) {
			this.info.pageNo = no;

			this.$EventBus.$emit(eventBus.LIST_PAGING_RECEIVER, 1, this.info);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징 셋팅
		schPaging : function() {
			this.info.arrPaging = [];
			let pagingLength = Math.ceil(this.info.totalData / this.info.pageSize);
			let ForNum = 1;
			let ToNum = ((((this.info.pageNo - 1) / 10) + 1) * 10);
			ToNum -= this.info.pageNo;
			for (let i = 1; i <= pagingLength; i++) {
				if (i % 10 == 0) {
					ForNum = i;
					ToNum = i + 9;
				} else {
					ForNum = ForNum;
					ToNum = ToNum;
				}
				if (this.info.pageNo == i) {
					break;
				}
			}
			for (let i= ForNum; i <= ToNum; i++) {
				if (i > pagingLength) {
					break;
				}
				if (i == this.info.pageNo) {
					this.info.arrPaging.push({no:i});
				} else {
					this.info.arrPaging.push({no:i});
				}
			}
			this.info.pageLength = pagingLength;
		}
	},
	watch: {
		//비동기 적합
		//데이터가 변할시마다 함수 호출
	}
	,
	beforeDestroy() {
		this.$EventBus.$off(eventBus.LIST_PAGING_CALLBACK);
	}
	
}
</script>

<style>

</style>
