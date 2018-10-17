(function () {
	var controllerId = 'app.views.employee.consumition';
	angular.module('app').controller(controllerId, [
		'$scope',
		'gtObject',		
		'gtString',
		function ($scope, gtObject, gtString) {
			var vm = this;
			
			vm.consumitionList = [];

			function initConsumitionList(){
				var consumitionList=[
					{id:1,date:"15/10/2017",monto:"$ 137.50",customer:2},
					{id:3,date:"15/10/2017",monto:"$ 120.00",customer:3},
					{id:10,date:"16/10/2017",monto:"$ 100.00",customer:2},
					{id:11,date:"16/10/2017",monto:"$ 147.50",customer:3},
					{id:14,date:"16/10/2017",monto:"$ 110.00",customer:4}
				];
				vm.consumitionList = consumitionList;
				
			}
			function initUI(){
				initConsumitionList();
			}

			initUI();
			
		}

	])
})(); 