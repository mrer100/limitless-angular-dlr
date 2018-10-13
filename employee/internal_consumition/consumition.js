(function () {
	var controllerId = 'app.views.employee.consumition';
	angular.module('app').controller(controllerId, [
		'$scope',        
		'gtObject',
		'gtUI',
		'gtPlataform', 
		'gtMessage',
		'gtString',		      
		function ($scope, gtObject,gtUI,gtPlataform,gtMessage,gtString) {
			var vm = this;	
        
            vm.gofrom= function(from,to){
                $('#'+from).hide();;
                $('#'+to).show();;
               

            }

            function initUI(){
                console.log("consumition");

            }
            initUI();

	  }	  
	
	]) 
})(); 