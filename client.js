
//包引入
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
    oneofs:true,
});


//创建包 helloworld属性 要跟.proto 文件的包名一致
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld

//初始化客户端
console.log('init client');
//hello 方法是服务名 要跟.proto 文件的服务名一致 第一个参数是ip和端口要跟服务端保持一致
const client = new hello_proto.helloTest('127.0.0.1:8888',grpc.credentials.createInsecure());

//调用服务的 SayHello 方法  并 按照proto 约定传参
client.SayHiMark({name: 'mark_fu', age : 18}, (err,response) => {
    if(err){
        console.log(err);
        return ;
    }
    console.log(response.message);
});
