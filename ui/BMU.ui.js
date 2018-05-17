;"use strict";
(function(){
	var BMUvue = new Vue({
		el:'#BMUvue',
		data:{},
		methods:{
			version:function(){
				return BMU.v();
			}
		}
	});
})();