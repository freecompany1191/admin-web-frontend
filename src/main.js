// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import es6Promise from 'es6-promise' 
// es6Promise.polyfill()
// import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import VueCookie from 'vue-cookie'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'

Vue.use(VueCookie)
Vue.use(VueLodash, lodash)
Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue();

/* 
Vue.config.errorHandler = function (err, vm, info) {
	console.log("TTTTTTT : "+err, vm, info)
}
*/
/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	VueCookie,
	template: '<App/>',
	components: { App }
})
