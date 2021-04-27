const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatRoom',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
const conn = mongoose.connection;
conn.on('connected',function(){
    console.log('数据库成功连接');
})
//定义文档结构
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true,set(val){
        return require('bcrypt').hashSync(val,10);
    }},
    friendList:Array
})
const messageSchema = mongoose.Schema({
    from:String,
    date:String,
    msg:String,
    id:String,
    to:String
})
//定义model(与集合对应，可以操作集合)
const UserModel = mongoose.model('user',userSchema);
const MessageModel = mongoose.model('message',messageSchema);
exports.UserModel = UserModel;
exports.MessageModel = MessageModel;