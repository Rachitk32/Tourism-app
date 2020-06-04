    var mongoose=require('mongoose');
    var bcrypt=require('bcryptjs');
    var swf=10;
  
    mongoose.connect('mongodb+srv://pulkit:pulkit@cluster0-dwuul.mongodb.net/traveldb?retryWrites=true&w=majority');
    
    var db=mongoose.connection;
    db.on('error',console.error.bind(console,'connection error:'));
    db.once('open',function(){console.log("connection estabilished")})

  
    var schema=new mongoose.Schema(//update for signup page
      {
        name:{type:String,required:true},
        uname:{type:String, required:true, unique:true},
        pass:{type:String, required:true},
        email:{type:String,requierd:true},
        //array of objects
       // tlist:{lname:String,lvalues:[]}//object which has an array
      })

     
      schema.pre('save',function(next)
      {
      var user=this;
      if(!user.isModified('pass'))return next();/*to prevent dual hashing in case password is not changed at all  will be useful in editing password case */
      
      bcrypt.genSalt(swf,function(err,salt)
      {
        if(err) return next(err);

        bcrypt.hash(user.pass,salt,function(err,hash)
        {
          if(err) return next(err);
          user.pass=hash;
          next();
        })
      })
      })

      schema.methods.comparepass=function(loginpass,cb)
      {
        bcrypt.compare(loginpass,this.pass,function(err,ismatch)
        {
          if(err)return cb(err,null);
          cb(null,ismatch);
          // console.log("is match is " + ismatch);
        })
      }


    var user=mongoose.model('user',schema);
    module.exports=user;