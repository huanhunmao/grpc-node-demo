
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

//包定义信息，加载 hello.proto 文件的对应信息 这个文件服务端和客户端都会使用到
/*
参数：
    filename –一个或多个要加载的文件路径。 可以是绝对路径，也可以是相对于包含路径的路径。
选项 -
    配置选项：
        keepCase –保留字段名称。 默认设置是将它们更改为驼峰式。
        longs –应该用于表示long值的类型。 有效选项是Number和String 。 默认为库中的Long对象类型。
        enums –应该用于表示enum值的类型。 唯一有效的选项是String 。 默认为数值。
        bytes –应该用于表示bytes值的类型。 有效选项是Array和String 。 默认是使用Buffer 。
        defaults –在输出对象上设置默认值。 默认为false 。
        arrays –为空数组设置缺少的数组值，即使defaults值为false 。 默认为false 。
        objects –即使defaults值为false也为缺少的对象值设置空对象。 默认为false 。
        oneofs –将虚拟的oneof属性设置为当前字段的名称
        includeDirs –搜索导入的.proto文件的路径。
*/
const packageDefinition = protoLoader.loadSync('helloTest.proto',{
    keepCase:true,
    longs:String,
    enums:String,
    defaults:true,
    onefs:true,
});


//创建包 helloworld属性 要跟.proto 文件的包名一致
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
//创建server
const server = new grpc.Server();

//添加服务  helloTest 为服务名 要跟.proto 文件一致
server.addService(hello_proto.helloTest.service, {
    //实现 SayHello 要跟.proto 文件一致定义的方法名一致
    //call 获取请求信息, callback用来向客户端返回信息
    SayHiMark : (call,callback) => {
        try{
            //获取.proto 文件里定义的 name,age 也就是请求参数
            let {name,age} = call.request;
            //判断有没有它，有就执行callback()【这是一个回调函数】,没有，就不执行
            //callback 两个参数  第一个参数,如果报错可以传入 error 第二参数按proto 文件里的约定传值
            callback && callback(null,{ message:`我叫${name},年龄${age}岁`});
        }catch (error) {
            console.log('服务端出错', error);
            callback && callback(error);
        }

    }
});

//绑定ip和端口
server.bind('127.0.0.1:8888',grpc.ServerCredentials.createInsecure());

//启动服务
server.start();
console.log('服务已经启动，请启动客户端 ........');
