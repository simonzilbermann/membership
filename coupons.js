
function GetRandomString(length){
    let str="";
    const chars="abcdefghijklmnopqrstuvwxyz0123456789";
    let index;
    for(let i=0;i<length;i++)
    {
        index=Math.floor(Math.random() * chars.length);
        str+=chars[index]+"-";
    }
    return str;

}
module.exports={
    checkBday:()=>{
        let currentDate = new Date().toISOString().slice(5,10).split('-');
        const membership = require('./api/v1/models/membership');
        membership.find({Status:true}).then((data)=>{
            if(data.length > 0){
                for(let i=0;i<data.length;i++){
                    let datesplited = data[i].Dob.split('-');
                    if(datesplited[1] == currentDate[0] && datesplited[2] == currentDate[1]){
                        let subj = "קופון יום הולדת";
                        let coupon = GetRandomString(9);
                        let body = `<div style="direction:rtl;"> <h1>מזל טוב ${data[i].Name} ${data[i].Lastname}</h1><br/><h3>רצינו לפנק אותך בקופון מתנה לכבוד יום הולדתך </h3><br/><h4> קוד הקופון הוא: ${coupon} </h4><br/><h6> מאחלים לך את כל הטוב שבעולם בניחוחות של קפה </h6></div>`;
                        require('./emailsend').SendEmail(data[i].Email,subj,body);
                       break;   
                    }
                }
            }
        });
    }
}