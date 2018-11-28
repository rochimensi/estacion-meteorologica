$(document).ready(function (){
	$("#login").click(function(event) {
		    var email = $("#user").val();
	        var password = $("#pwd").val();
	        event.preventDefault(); 
	        $.post('http://localhost:4000/auth/login',{"email": email, "password":password} ,function(data,status) {
	             sessionStorage.setItem('isAdmin', data.isAdmin);
	             sessionStorage.setItem('token', data.token);	 
	           	 window.location = 'dashboard.html';
	        });
	});


	if (sessionStorage.getItem('isAdmin') != null && sessionStorage.getItem('isAdmin') != "true"){
	   $("#setup").hide();
	}else{
	   $("#setup").show();
	}

});