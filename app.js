require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const morgan=require('morgan');
const mongoose=require('mongoose');
const hbs=require('hbs');
const path=require('path');
const session = require('express-session');
const multer=require('multer');
const MongoStore = require('connect-mongo');
const fs = require('fs');
const bodyParser = require('body-parser');

//connect to db
const uri=process.env.MONGO_COMN; 
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log("mongo db connected ")});


//app usings:
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.set('views',path.join(__dirname,'views'));
app.use('/public', express.static('public'));
app.set('view engine','hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(morgan('dev'));   
app.use(cors());

//sessions:
const thirtyMin = 1000 * 60 * 30;
  app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:thirtyMin},
    store: MongoStore.create({
        mongoUrl: uri
         
      })
}));

//routers:
const reports = require('./api/v1/routes/reports');
app.use("/reports",reports);
const content_us_router = require('./api/v1/routes/content_us');
app.use("/content",content_us_router);
const whiteList_router = require('./api/v1/routes/white_list.js');
app.use("/whitelist",whiteList_router);
const pdf_db_router = require('./api/v1/routes/pdf_binary.js');
app.use("/pdf",pdf_db_router);
const redirects_router = require('./api/v1/routes/redirects.js');
app.use("/redirects",redirects_router);
const couponsrouter = require('./api/v1/routes/coupons.js');
app.use("/coupon",couponsrouter);
const logsrouter = require('./api/v1/routes/logs.js');
app.use("/logs",logsrouter);
const memebershiprouter = require('./api/v1/routes/membership.js');
app.use("/member",memebershiprouter);
const productrouter = require('./api/v1/routes/products.js');
app.use("/product",productrouter);
const categoryrouter = require('./api/v1/routes/category.js');
app.use("/category",categoryrouter);
const manager_router = require('./api/v1/routes/managers.js');
app.use("/managers",manager_router);
const cart_router = require('./api/v1/routes/cart.js');
app.use("/cart",cart_router);
const order_router = require('./api/v1/routes/order.js');
app.use("/order",order_router);



app.use(async (req, res, next) => {
  const Redirect = require('./api/v1/models/redirects');

  try {
    const redirects = await Redirect.find({}).exec();

    
   
    const redirect = redirects.find((r) => r.Request_path === req.path);

    if (redirect) {
      console.log(redirect);
      const targetPath = redirect.Target_path;
    
      return res.redirect(301, targetPath);
    }
  } catch (error) {
    
    console.error(error);
  }

  next();
});


 //routes:
app.get('/',(req,res)=>{
  res.render('homepage');
});
app.get('/order_detials',(req,res)=>{
  res.render('ordersearch');
});
app.get('/prodbycat',(req,res)=>{
  res.render('prodbycat');
});
app.get('/product/prodpage',(req,res)=>{
  res.render('prodpage');
});
app.get('/cart',(req,res)=>{
  res.render('cart');
});
app.get('/register',(req,res)=>{
  res.render('register2');
});
app.get('/LoginMember',(req,res)=>{
  res.render('login');
});
app.get('/negishot',(req,res)=>{
  res.render('negishot');
});
app.get('/content_us',(req,res)=>{
  res.render('content_us');
});


const authenticateUser = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    return res.redirect('/loginwm');
  }
};
app.get('/wm', authenticateUser, (req, res) => {
  res.render('wm');
});

const RecoverUser = (req, res, next) => {
  const members = require('./api/v1/models/membership.js');
  const Email = req.query.Email;
  members.findOneAndUpdate(
    { Email, RecoverMod: true },
    { RecoverMod: false },
    (err, member) => {
      if (err || !member) {
        return res.redirect('/');
      }
      return next();
    }
  );
};
const RecoverManager = (req, res, next) => {
  const managers = require('./api/v1/models/managers.js');
  const email = req.query.email;
  managers.findOneAndUpdate(
    { email, RecoverMod: true },
    { RecoverMod: false },
    (err, manager) => {
      if (err || !manager) {
        return res.redirect('/loginwm');
      }
      return next();
    }
  );
};



app.post('/save_client_ip', (req, res) => {
  let ipAddress = req.body.ipaddress;
 
  req.session.ipAddress = ipAddress;
  return res.status(200).json({ message: 'Client IP address saved successfully.' });
});


const auth_whiteList = (req, res, next) => {
  // Check if the IP address exists in the session
  if (req.session.ipAddress) {
    const whiteList = require('./api/v1/models/white_list.js');

    whiteList.find()
      .exec()
      .then((white_list) => {
        const clientIp = req.session.ipAddress;
        const isIpInWhiteList = white_list.some(entry => entry.ipAddress === clientIp);
        if (isIpInWhiteList) {
          next();
        } else {
          res.status(403).render('forbidden');
        }
      })
      .catch((error) => {
        console.error('Failed to read IP whitelist:', error);
        res.status(500).send('Failed to read IP whitelist');
      });
  } else {
    
    res.redirect('/');
  }
};



app.get('/recover_m_pass',RecoverManager,(req,res)=>{
  res.render('recover_m_pass');
});
app.get('/recover_member_pass',RecoverUser,(req,res)=>{
  res.render('recover_member_pass');
});
app.get('/loginwm',auth_whiteList,(req,res)=>{
  res.render('loginwm');
});
app.get('/success',(req,res)=>{
  res.render('success');
});
app.get('/personal_area',(req,res)=>{
  res.render('personal_area');
});
app.get('/terms',(req,res)=>{
  res.render('takanon');
});
app.get('/sitemap',(req,res)=>{
  res.render('sitemap');
});

//saving files: 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/pics/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname, () => {
      console.log('File saved:', file.originalname);
    });
  }
});
const uploadFiles = multer({
  storage: storage
});
app.post('/uploadpic', uploadFiles.single('ProdPic'), (req, res) => {
  res.status(200).send('File uploaded');
});

//saving configurations Views:
app.post('/save-views_hp',(req,res)=>{
  require('./views_conf.js').save_view_hp(req, res);
});
app.get('/get_views_hp',(req,res)=>{
  require('./views_conf.js').get_view_hp(req, res);
});
app.post('/save-views_prods',(req,res)=>{
  require('./views_conf.js').save_view_prods(req, res);
});
app.get('/get_views_prods',(req,res)=>{
  require('./views_conf.js').get_view_prods(req, res);
});
app.get('/get_banner_rashi',(req,res)=>{
  require('./views_conf.js').get_banner_rashi(req, res);
});
app.post('/save_banner_rashi',uploadFiles.single('banner_rashi_pic'),(req,res)=>{
  require('./views_conf.js').save_banner_rashi(req, res);
});
app.get('/get_categories_banners',(req,res)=>{
  require('./views_conf.js').get_categories_banners(req, res);
});

app.post('/save_categories_banners',uploadFiles.array('catfile', 6),(req,res)=>{
  require('./views_conf.js').save_categories_banners(req, res);
});







//saving configurations:
app.post('/save-rules', (req, res) => {
  require('./core_rules.js').save_rules(req, res);
});
app.get('/get_rules',(req,res)=>{
  require('./core_rules.js').get_all_rules(req, res);
});

app.delete('/delete-rule/:id', (req, res) => {
  require('./core_rules.js').delete_rule(req, res);
});
app.put('/update-rule/:id', (req, res) => {
  require('./core_rules.js').update_rules(req,res);
});

//last route:
app.all("*",(req,res)=>{
   res.render('notfound');
});




module.exports=app; 