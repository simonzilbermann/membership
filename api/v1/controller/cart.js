const categories = require('../models/category');
const products = require('../models/products');
const rules = require('../../../public/configurationjson/config.json');
let if_the_rule_in_cart = false;

function GetRandomString(length){
  let str="";
  const chars="abcdefghijklmnopqrstuvwxyz0123456789";
  let index;
  for(let i=0;i<length;i++){
    index=Math.floor(Math.random() * chars.length);
    str+=chars[index];
  }
  return str;
}
//cart|productSku=='pk-1mauro' & quantity==3|sum=299
function apply_rules_oncart(rule,cart){
  let if_cond = rule[1];
  let do_cond = rule[2];
  for(let i=0;i<cart.length;i++ ){
    const expression = if_cond;
    const productSku = cart[i].productSku;
    const productName = cart[i].productName;
    const quantity = cart[i].quantity;
    let sum = cart[i].sum ;
    try{
    const result = eval(expression);
    if(result){
      eval(do_cond);
      cart[i].sum= sum;
      if_the_rule_in_cart = true;
    }
   
  }catch(err){
    console.error('Error evaluating expression:', expression);
    console.error('Error message:', err.message);
    break;
  }
  }
  return cart;
}
function apply_rules_onProds(rule,products){
  console.log(products);
  console.log(rule);
}
function apply_rules_onCategories(rule,categories){
  console.log(categories);
  console.log(rule);
}


module.exports={
  core_of_rules:async (req,res)=>{
    // let allProducts = await products.find({},{_id:false});
    // let allCategories = await categories.find({},{_id:false});
    let cart =  req.session.cart || [];
    let allRules = rules;
    let rules_in_cart_names = [];
    for(let i=0;i < allRules.length;i++){
      let current_expression = allRules[i].expression;
      current_expression = current_expression.split('~');
      if(current_expression[0] == "cart"){
        cart =  apply_rules_oncart(current_expression,cart);
        if(if_the_rule_in_cart){
          rules_in_cart_names.push(allRules[i]);
          if_the_rule_in_cart = false;
        }
        
      }
    }
    return res.status(200).json({msg:cart,rules_names:rules_in_cart_names});
  },
  add_to_cart: async(req,res)=>{
    const { productSku, productName ,prodPic} = req.body;
    let productPrice = parseInt(req.body.productPrice);
    let quantity = parseInt(req.body.quantity);
    let cart = req.session.cart || [];
    let cartId = "";

    if(cart.length > 0 ){
      cartId =  cart.cartId;
    } else cartId = GetRandomString(10);
    
    let sum = cart.sum || 0 ;
    const existingItem = cart.find(item => item.productSku === productSku);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.sum += productPrice * existingItem.quantity; 
    } else { 
      sum += productPrice * quantity; 
      cart.push({ cartId,productSku, productName, productPrice, quantity,prodPic, sum});
    }
    cart = await apply_rules_oncart( rules,cart);
    req.session.cart = cart;
    return  res.status(200).json({ msg:'Item added to cart', cart });
  },
  get_cart:(req,res)=>{
    let cart = req.session.cart || [];
    return res.status(200).json({ msg:cart });
  },
  get_cart_render:(req,res)=>{
    const cart = req.session.cart || [];
    return res.render('cart',{cart:cart});
  },
  clearcart:(req,res)=>{
    req.session.cart = [];
    let cart = req.session.cart;
    return res.status(200).json({msg:'your cart: ',cart});
  },
  delProd_fromcart:(req,res)=>{
    const {sku} = req.body;
    let cart = req.session.cart || [];
    const existingItemIndex = cart.findIndex(item => item.productSku === sku);
    if (existingItemIndex !== -1) {
      const existingItem = cart[existingItemIndex];
      cart.splice(existingItemIndex, 1); 
      req.session.cart = cart; 
      return res.status(200).json({msg:cart});
    } else {
      return res.status(404).json({msg: 'Item not found in cart'});
    }
  },
  add_to_quantity: (req, res) => {
    const { sku } = req.body;
    let quantity =parseInt(req.body.quantity);
    let cart = req.session.cart || [];
    const existingItem = cart.find(item => item.productSku === sku);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.sum += existingItem.productPrice * quantity;
      req.session.cart = cart;
      return res.status(200).json({ msg: cart });
    } else {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
  },
  remove_from_quantity: (req, res) => {
    const { sku } = req.body;
    let quantity =parseInt(req.body.quantity);
    let cart = req.session.cart || [];
    const existingItem = cart.find(item => item.productSku === sku);
    if (existingItem) {
      console.log(quantity);
      if (existingItem.quantity > quantity) {
        console.log(existingItem.quantity);
        existingItem.quantity -= quantity;
        console.log(existingItem.quantity);
        existingItem.sum = existingItem.productPrice * existingItem.quantity;
        req.session.cart = cart;
      } else {
        existingItem.quantity = 0;
        existingItem.sum = 0;
      }
      return res.status(200).json({ msg: cart });
    } else {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
  },
  remove_all_carts: (req, res) => {
    req.session.cart = [];
    req.session.ordered = false;
    return res.status(200).json({ msg: 'All carts removed from session' });
  },
  apply_coupon_on_cart: (req, res) => {
    const { CouponCode } = req.body; 
  
    let cart = req.session.cart || [];
  
    let coupons = require('../models/coupons');
    coupons.findOne({ CouponCode: CouponCode }).then((existingCoupon) => {
        if (existingCoupon) {
          if(!existingCoupon.Active) return res.status(200).json({msg:null});
          let type = existingCoupon.TypeSale;
          if (type === '%') {
            let value = 1 - (existingCoupon.valueSale / 100);
            for (let i = 0; i < cart.length; i++) {
              cart[i].sum *= value;
            }
            console.log(cart);
            req.session.cart = cart;
            return res.status(200).json({ msg: cart });
          } else if (type === '$') { 
            let sale_per_prod =  existingCoupon.valueSale / cart.length;
            for (let i = 0; i < cart.length; i++) {
              cart[i].sum -= sale_per_prod;
              if( cart[i].sum < 0){
                cart[i].sum = 0;
                break;
              }   
            }
            req.session.cart = cart;
            return res.status(200).json({ msg: cart });
          }
        } else {
          return res.status(200).json({ msg: null });
        }
    });
  },
  cancel_coupon:(req,res)=>{
    let cart = req.session.cart || [];
    for (let i = 0; i < cart.length; i++) {
      cart[i].sum = cart[i].productPrice * cart[i].quantity;
    }
    req.session.cart = cart;
    return res.status(200).json({ msg: cart });
  }

  
}