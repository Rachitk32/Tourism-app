var myapp=angular.module('myapp',[]);
var mytimer=setInterval(time,500);
myapp.controller('myctrl',function($scope,$http)
{
    $http.post('/userdata').then(function(response)
    {
       var obj=response.data;
       $scope.name=obj.name;
       $scope.email=obj.email;
    })
});


function time()
{
    var d=new Date();
    document.getElementById("sestime").innerHTML=d.toLocaleTimeString();
}
