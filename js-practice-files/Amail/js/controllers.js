//为核心的Amail服务创建模块
var aMailServices = angular.module('AMail',[]);
//在URL、模版和控制器之间建立映射关系
function emailRouteConfig($routeProvider){
	$routeProvider.
	when('/',{
		controller : ListController,
		templateUrl : 'list.html'
	}).
	//注意，为了创建详情视图，我们在id前面加了一个冒号，从而指定了一个参数化的URL组件
	when('/view/:id',{
		controller : DetailController,
		templateUrl : 'detail.html'
	}).otherwise({
		redirectTo : '/'
	});
}

//配置我们的路由，以便AMail服务能够找到它
aMailServices.config(emailRouteConfig);

//一些虚拟的邮件
messages = [{
	id : 0,
	sender : '123123@qq.com',
	subject : 'hi there,old friend',
	date : 'Dec 7,2013 12:00:00',
	recipients : ['ajkshdkah@qq.com'],
	message : 'hey,we should get together for lunch sometime and catch up.' 
	+ 'should get together for lunch sometime and catch up.' 
},{
	id : 1,
	sender : 'qweqweqwe@qq.com',
	subject : 'hi there,old friend',
	date : 'Dec 7,2013 12:00:00',
	recipients : ['ajkshdkah@qq.com'],
	message : 'hey,we should get together for lunch sometime and catch up.' 
	+ 'should get together for lunch sometime and catch up.' 
},{
	id : 2,
	sender : 'fghfghfghfgh@qq.com',
	subject : 'hi there,old friend',
	date : 'Dec 7,2013 12:00:00',
	recipients : ['ajkshdkah@qq.com'],
	message : 'hey,we should get together for lunch sometime and catch up.' 
	+ 'should get together for lunch sometime and catch up.' 
},{
	id : 3,
	sender : 'hgjgjghj@qq.com',
	subject : 'hi there,old friend',
	date : 'Dec 7,2013 12:00:00',
	recipients : ['ajkshdkah@qq.com'],
	message : 'hey,we should get together for lunch sometime and catch up.' 
	+ 'should get together for lunch sometime and catch up.' 
}];

//把我们的邮件发布邮件列表模版
function ListController($scope){
	$scope.messages = messages;
}

//从路由信息（从URL中解析出来的）中获取邮件ID，然后用它找到正确的邮件对象
function DetailController($scope,$routeParams){
	$scope.message = messages[$routeParams.id];
}

