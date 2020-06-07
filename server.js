const express = require('express');
const app = express();
//required modules
var bodyParser = require('body-parser');
var user=require('./sources/js/mongo');
var cookieparser=require('cookie-parser');
const locations = require('./sources/js/locations');
var ses_flag=0;
//middlewares
app.use(express.static('./sources'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieparser());
app.set('views', __dirname+'/sources/views');
app.set('view engine', 'pug');
//home page loading
app.get('/', function(req, res) {
    res.sendFile(__dirname+ "/sources/html/home.html");
});

locations(app);
//sending singup files 
app.get('/signup',function(req,res)
{   console.log("request to load signup page recieved")
    res.sendFile(__dirname + '/sources/html/signup.html');
} 
)
//homepage get request
app.get('/homepage',function(req,res)
{
    if(ses_flag==1)
    res.sendFile(__dirname + '/sources/html/travelpage.html');
    else 
    res.render('info',{message: 'PLEASE LOGIN FIRST'});
  })

//Search get request
app.get('/search',function(req,res)
{
  res.sendFile(__dirname + '/sources/html/search.html');
})
//Gallery get request
app.get('/gallery',function(req,res)
{
  res.sendFile(__dirname + '/sources/html/gallery.html');
})
//recieveing signup data 
app.post('/rdata',function(req,res)
{
  user1=new user
  ({
    'name':req.body.name,
    'uname':req.body.uname,
    'pass':req.body.pass,
    'email':req.body.email
  })
  user1.save(function(err,data)
  {
    if(err) return console.log('error in saving registered data');
    console.log('data saved successfully');
  });
  res.redirect('/');
})
//login data 
app.post('/login',function(req,res)
{
  
  user.findOne({'uname':req.body.uname},
  function(err,user)
  {
    if(err)
      return console.log('error encountered');
    if(user==null)
      {
        //console.log(req.body);
        console.log('user does nott exist');
        res.render('info',{message:"USER DOES NOT EXIST"});
      }
    else if(user!=null) 
    { 
      //console.log(req.body);
      // console.log('hashed pass is ' + user.pass);
      user.comparepass(req.body.pass,function(err,ismatch)
      {
        if(err) 
        console.log('error in password');
        if(ismatch)
          {console.log('password correct');
           res.clearCookie('name');
           res.cookie('name',user.name);//sets cookie name='user name'
           ses_flag=1;
          //console.log("session flag set to " + ses_flag);
         res.redirect("/homepage");
        }
        else   
          {
           console.log('password wrong');
          //res.send("wp");
          res.render('info',{message:"WRONG PASSWORD"});
        }
      })
    }
      
  })
});

//send user name and email ses_flatg is used here
app.post('/userdata',function(req,res)
{
  if(ses_flag==1)
 { var curruser=new user();
  user.findOne({'name':req.cookies.name},function(err,user)
  {
    if(err)
      return console.log('error in finding the user');
    else if(user!=null)
    {
      curruser=user;
      var ans=0;   
      var uobj=
      {
        name:user.name,
        email:user.email
      } ;
      res.send(uobj);
    }
  })}
  else 
  res.send("no user found");
})

app.get('/logout',function(req,res)
{
  ses_flag=0;
  res.clearCookie('name');
  res.redirect('/');
})

app.get('/feedback',function(req,res)
{
  if(req.cookies.name!="admin")
    res.render('feedback');
  else 
  {
  
    var curruser=new user();
  user.findOne({'name':"admin"},function(err,user)
  {
    if(err)
      return console.log('error in finding the user');
    else if(user!=null)
    {
      curruser=user;
      res.render('submittedfeeds',{items:user.feedbacks});
    }
  })

  }
})

app.post('/submitfeedback',function(req,res){
  console.log("in submit feedback route");
  var curruser=new user();
  user.findOne({'uname':'admin'},
  function(err,user)
  {
    if(err)
      return console.log('error encountered');
    if(user==null)
      {
        //console.log(req.body);
        console.log('user does nott exist');
        res.send("user does nott exist");
      }
    else if(user!=null) 
    { 
      curruser=user;
     // console.log("curruser's is " + curruser);
      curruser.feedbacks.push({feed:req.body.feed});
      curruser.save(function(err,data)
      {
        if(err)return console.log("error in saving feedback");
        console.log('feedback saved succesfully')
        res.redirect('/homepage');
      })
    }
      
  })

  //res.send("Feedback recieved")
});

app.listen(3000,function() {
    console.log("Server started.....");
});

module.exports = app;
