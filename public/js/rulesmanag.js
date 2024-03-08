
var rules = [];


// define options for select inputs
const propertyOptions = [
{ value: 'productSku', text: 'מק״ט' },
{ value: 'productName', text: 'שם מוצר' },
{ value: 'quantity', text: 'כמות המוצר' }
];

const conditionOperatorOptions = [
{ value: '==', text: 'שווה ל-' },
{ value: '!=', text: 'שונה מ- ' },
{ value: 'is_one_of', text: 'מכיל אחד מ -' },
{ value: '/', text: 'לחלק ל-' },
{ value: '*', text: 'כפול ' },
{ value: '%', text: 'מודולו' },
{ value: '>', text: 'גדול מ' },
{ value: '<', text: ' קטן מ' },
{ value: '<=', text: 'קטן שווה ל ' },
{ value: '>=', text: ' גדול שווה ל' },
];

const logicalOperatorOptions = [
{ value: '||', text: '&nbsp;&nbsp;או&nbsp;&nbsp;' },
{ value: '&', text: '&nbsp;&nbsp;וגם&nbsp;&nbsp;' }
];

const set_operator = [
{ value: '=', text: 'יהי שווה ל-' },
{ value: '/=', text: 'לחלק אותו ב-' },
{ value: '*=', text: 'לכפול אותו ב-' },
{ value: '+=', text: 'להוסיף לו -' },
{ value: '-=', text: 'להחסיר לו -' },
];
const set_select_prop = [
{ value: 'sum', text: 'מחיר סופי של מוצר' },
{ value: 'productName', text: 'שם המוצר' },
{ value: 'quantity', text: 'הכמות הסופית' },
];



function addRule() {

const tbody = document.querySelector('#ruleTable tbody');
const newRow = document.createElement('tr');
newRow.id = "row_to_add";
const actionButton_td = document.createElement('td');
actionButton_td.setAttribute('data-th', 'פעולה');
const btnremove = document.createElement("button");
btnremove.className = "btn btn-primary";
btnremove.innerHTML = '<span><i class="fa fa-remove" >מחיקה</i></span>';
btnremove.addEventListener("click",function(){
document.getElementById("addRuleBtn").style.display="block";
  tbody.removeChild(newRow);

});
actionButton_td.appendChild(btnremove);
newRow.appendChild(actionButton_td);
const propertyCell = document.createElement('td');
propertyCell.setAttribute('data-th', 'מאפיין');
const propertySelect = document.createElement('select');
propertyOptions.forEach(option => {
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.text = option.text;
propertySelect.appendChild(optionElem);
});
propertyCell.appendChild(propertySelect);
newRow.appendChild(propertyCell);

const conditionOperatorCell = document.createElement('td');
conditionOperatorCell.setAttribute('data-th', 'תנאי');
const conditionOperatorSelect = document.createElement('select');
conditionOperatorOptions.forEach(option => {
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.text = option.text;
conditionOperatorSelect.appendChild(optionElem);
});
conditionOperatorCell.appendChild(conditionOperatorSelect);
newRow.appendChild(conditionOperatorCell);

const propertyValueCell = document.createElement('td');
propertyValueCell.setAttribute('data-th', 'ערך');
const propertyValueInput = document.createElement('input');
propertyValueInput.type = 'text';
propertyValueInput.className = "form-control me-2";
propertyValueCell.appendChild(propertyValueInput);
newRow.appendChild(propertyValueCell);

const addMoreCell = document.createElement('td');
addMoreCell.setAttribute('data-th', 'תנאי לוגי');
const addMoreInput = document.createElement("select");

logicalOperatorOptions.forEach(option => {
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.innerHTML = option.text;
addMoreInput.appendChild(optionElem);
});

addMoreCell.appendChild(addMoreInput);
newRow.appendChild(addMoreCell);
const propertyCell2 = document.createElement('td');
propertyCell2.setAttribute('data-th', 'מאפיין שני ');
const propertySelect2 = document.createElement('select');
propertyOptions.forEach(option => {
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.text = option.text;
propertySelect2.appendChild(optionElem);
});
propertyCell2.appendChild(propertySelect2);
newRow.appendChild(propertyCell2);
const conditionOperatorCell2 = document.createElement('td');
conditionOperatorCell2.setAttribute('data-th', 'תנאי שני');
const conditionOperatorSelect2 = document.createElement('select');
conditionOperatorOptions.forEach(option => {
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.text = option.text;
conditionOperatorSelect2.appendChild(optionElem);
});
conditionOperatorCell2.appendChild(conditionOperatorSelect2);
newRow.appendChild(conditionOperatorCell2);
const propertyValueCell2 = document.createElement('td');
propertyValueCell2.setAttribute('data-th', 'ערך שני');
const propertyValueInput2 = document.createElement('input');
propertyValueInput2.type = 'text';
propertyValueInput2.className = "form-control me-2";
propertyValueCell2.appendChild(propertyValueInput2);
newRow.appendChild(propertyValueCell2);

const td_done = document.createElement('td');
td_done.setAttribute('data-th', 'השמה');
td_done.style.textAlign = "center";
const done_select_prop = document.createElement("select");
set_select_prop.forEach(option=>{
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.text = option.text;
done_select_prop.appendChild(optionElem);
});
td_done.appendChild(document.createElement("br"));
td_done.appendChild(done_select_prop);
const done_select = document.createElement("select");
set_operator.forEach(option =>{
const optionElem = document.createElement('option');
optionElem.value = option.value;
optionElem.text = option.text;
done_select.appendChild(optionElem);
});
td_done.appendChild(done_select);
td_done.appendChild(document.createElement("br"));
const input_text_3 = document.createElement("input");
input_text_3.type="text";
input_text_3.id="input_text_3";
input_text_3.className = "form-control me-2";
td_done.appendChild(input_text_3);

newRow.appendChild(td_done);

var last_td_btn = document.createElement("td");
last_td_btn.setAttribute('data-th', 'סיום');
const text_area_name_rule = document.createElement("textarea");
text_area_name_rule.id ="text_area_name_rule";
const label_rule_name = document.createElement("label");
label_rule_name.textContent = "שם החוק";
label_rule_name.setAttribute("for", "text_area_name_rule");
last_td_btn.appendChild(label_rule_name);
last_td_btn.appendChild(text_area_name_rule);

const btn_done = document.createElement("button");
btn_done.innerText = "שמירת שינויים";
btn_done.id = "btn_done";
btn_done.className = "btn btn-primary";
btn_done.onclick = saving_rules;
last_td_btn.appendChild(btn_done);
newRow.appendChild(last_td_btn);

tbody.appendChild(newRow);
const selectElems = document.querySelector('#ruleTable tbody').getElementsByTagName('select');

// Loop through each select element and add a class name
for (let i = 0; i < selectElems.length; i++) {
  selectElems[i].classList.add('custom-select');
}
}


const addRuleBtn = document.querySelector('#addRuleBtn');
addRuleBtn.addEventListener('click', addRule);


function loadRules() {
var myHeaders = new Headers();
var requestOptions = {
method: 'GET',
headers: myHeaders,
redirect: 'follow'
};
fetch("/get_rules", requestOptions).then((res)=>{return res.json()}).then((data)=>{
rules = data;
});
setTimeout(() => {
build_table_rules();
}, 700);

}

function build_table_rules(){
document.querySelector('#ruleTable tbody').innerHTML = "";
rules.forEach(rule=>{

var expr = rule.expression;
split_array = expr.split('~');
first_rule = split_array[1];
var values_of_elements = first_rule.trim().split(" ").filter(elem => elem !== '');
second_rule = split_array[2];
var values_of_elements2 = second_rule.trim().split(" ").filter(elem => elem !== '');

const tbody = document.querySelector('#ruleTable tbody');
const newRow = document.createElement('tr');
newRow.id = rule.ruleid;
const actionButton_td = document.createElement('td');
actionButton_td.setAttribute('data-th', 'פעולה');
const btnremove = document.createElement("button");
btnremove.className = "btn btn-primary";
btnremove.innerHTML = '<span><i class="fa fa-remove" >מחיקה</i></span>';
btnremove.addEventListener("click",function(){
  document.getElementById("addRuleBtn").style.display="block";
    delete_rule(rule.ruleid);
    tbody.removeChild(newRow);
});
actionButton_td.appendChild(btnremove);
newRow.appendChild(actionButton_td);
const propertyCell = document.createElement('td');
propertyCell.setAttribute('data-th', 'מאפיין');
const propertySelect = document.createElement('select');
propertyOptions.forEach((option, index) => {
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.text = option.text;
  propertySelect.appendChild(optionElem);
  if (option.value === values_of_elements[0]) {
    propertySelect.selectedIndex = index;
  }
});
propertyCell.appendChild(propertySelect);
newRow.appendChild(propertyCell);

const conditionOperatorCell = document.createElement('td');
conditionOperatorCell.setAttribute('data-th', 'תנאי');
const conditionOperatorSelect = document.createElement('select');
conditionOperatorOptions.forEach((option,index) => {
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.text = option.text;
  conditionOperatorSelect.appendChild(optionElem);
  if(option.value == values_of_elements[1]){
    conditionOperatorSelect.selectedIndex = index;
  }
});
conditionOperatorCell.appendChild(conditionOperatorSelect);
newRow.appendChild(conditionOperatorCell);

const propertyValueCell = document.createElement('td');
propertyValueCell.setAttribute('data-th', 'ערך');
const propertyValueInput = document.createElement('input');
propertyValueInput.type = 'text';
propertyValueInput.className = "form-control me-2";
propertyValueInput.value = values_of_elements[2].replaceAll("'","");
propertyValueCell.appendChild(propertyValueInput);
newRow.appendChild(propertyValueCell);

const addMoreCell = document.createElement('td');
addMoreCell.setAttribute('data-th', 'תנאי לוגי');
const addMoreInput = document.createElement("select");
logicalOperatorOptions.forEach((option,index) => {
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.innerHTML = option.text;
  addMoreInput.appendChild(optionElem);
  if(option.value.length == 1 ){
    addMoreInput.selectedIndex = 1;
  }else{
    addMoreInput.selectedIndex = 0;
  }
});

addMoreCell.appendChild(addMoreInput);
newRow.appendChild(addMoreCell);
const propertyCell2 = document.createElement('td');
propertyCell2.setAttribute('data-th', 'מאפיין שני ');
const propertySelect2 = document.createElement('select');
propertyOptions.forEach((option,index) => {
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.text = option.text;
  propertySelect2.appendChild(optionElem);
  if(option.value == values_of_elements[4]){
    propertySelect2.selectedIndex = index;
  }
});
propertyCell2.appendChild(propertySelect2);
newRow.appendChild(propertyCell2);


const conditionOperatorCell2 = document.createElement('td');
conditionOperatorCell2.setAttribute('data-th', 'תנאי שני');
const conditionOperatorSelect2 = document.createElement('select');
conditionOperatorOptions.forEach((option,index) => {
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.text = option.text;
  conditionOperatorSelect2.appendChild(optionElem);
  if(option.value == values_of_elements[5]){
    conditionOperatorSelect2.selectedIndex = index;
  }
});
conditionOperatorCell2.appendChild(conditionOperatorSelect2);
newRow.appendChild(conditionOperatorCell2);

const propertyValueCell2 = document.createElement('td');
propertyValueCell2.setAttribute('data-th', 'ערך שני');
const propertyValueInput2 = document.createElement('input');
propertyValueInput2.type = 'text';
propertyValueInput2.className = "form-control me-2";
propertyValueInput2.value = values_of_elements[6];
propertyValueCell2.appendChild(propertyValueInput2);
newRow.appendChild(propertyValueCell2);

const td_done = document.createElement('td');
td_done.setAttribute('data-th', 'השמה');
td_done.style.textAlign = "center";
const done_select_prop = document.createElement("select");
set_select_prop.forEach((option,index)=>{
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.text = option.text;
  done_select_prop.appendChild(optionElem);
  if(option.value == values_of_elements2[0]){
    done_select_prop.selectedIndex = index;
  }
  
});
td_done.appendChild(done_select_prop);
td_done.appendChild(document.createElement("br"));
const done_select = document.createElement("select");
set_operator.forEach((option,index) =>{
  const optionElem = document.createElement('option');
  optionElem.value = option.value;
  optionElem.text = option.text;
  done_select.appendChild(optionElem);
  if(option.value == values_of_elements2[1]){
    done_select.selectedIndex = index;
  }
});
td_done.appendChild(done_select);
td_done.appendChild(document.createElement("br"));

const input_text_3 = document.createElement("input");
input_text_3.type="text";
input_text_3.className ="form-control me-2";
input_text_3.value=values_of_elements2[2];

td_done.appendChild(input_text_3);
newRow.appendChild(td_done);

const last_td_name  = document.createElement("td");
last_td_name.setAttribute('data-th', 'סיום');
const text_area_name_rule2 = document.createElement("textarea");
text_area_name_rule2.value = rule.name;
const label_rule_name2 = document.createElement("label");
label_rule_name2.textContent = "שם החוק";
label_rule_name2.setAttribute("for", "text_area_name_rule");
last_td_name.appendChild(label_rule_name2);
last_td_name.appendChild(text_area_name_rule2);
const btn_update = document.createElement("button");
btn_update.innerText = "עדכון חוק";
btn_update.className = "btn btn-primary";
btn_update.addEventListener("click",function(){
  update_rule(newRow.id);
});
last_td_name.appendChild(btn_update);
newRow.appendChild(last_td_name);


tbody.appendChild(newRow);
});

const selectElems = document.querySelector('#ruleTable tbody').getElementsByTagName('select');

// Loop through each select element and add a class name
for (let i = 0; i < selectElems.length; i++) {
  selectElems[i].classList.add('custom-select');
}
}


function saving_rules(){
  document.getElementById("btn_done").style.display="none";
  var table = document.getElementById("ruleTable");
  var rows = table.getElementsByTagName("tr");
  var output = "cart~";

  var lastRowIndex = rows.length - 1; // get the index of the last row

  var cells = rows[lastRowIndex].getElementsByTagName("td");
  var rowOutput = "";
  for (var j = 0; j < cells.length; j++) {
    var inputs = cells[j].getElementsByTagName("input");
    var selects = cells[j].getElementsByTagName("select");
    if (selects.length > 0) {
      var selectedOption = selects[0].options[selects[0].selectedIndex].value;
  
      if(j == 8){
          rowOutput += "~ "+selectedOption+" ";
      }else{
          rowOutput += " "+selectedOption+" ";
      }
    
    }
    if (selects.length == 2) {
      var selectedOption = selects[1].options[selects[1].selectedIndex].value;
      rowOutput += " "+selectedOption+" ";
    }

    if (inputs.length > 0) {
      if(j == 3 ){
        rowOutput += "'" + inputs[0].value + "'";
      }else{
        rowOutput +=" "+inputs[0].value+" ";
      }
      
    }
  }
  output += rowOutput.trim();
  if(output.includes("is_one_of")){

  }

  const rule = {name: document.getElementById("text_area_name_rule").value, description: "", expression: output , ruleid:GetRandomString(10)};
  rules.push(rule); 
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(rule);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  make_alog('rules','add-rule',`הכנסת חוק חדש${rule.name}`);
  fetch("/save-rules", requestOptions);
  
}
function delete_rule(ruleid){
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };
    
    fetch(`/delete-rule/${ruleid}`, requestOptions);
    
    setTimeout(() => {
      make_alog('rules','delete-rule',`מחיקת חוק${ruleid}`);
      location.reload();
    }, 1300);
}

function GetRandomString(length){
    let str="";
    const chars="0120345607890";
    let index;
    for(let i=0;i<length;i++){
      index=Math.floor(Math.random() * chars.length);
      str+=chars[index];
    }
    return str;
  }

  function update_rule(roleid){

    var output = "cart~";
    var cells = document.getElementById(roleid).cells;   
    for (var j = 0; j < cells.length; j++) {
        var inputs = cells[j].getElementsByTagName("input");
        var selects = cells[j].getElementsByTagName("select");
        var rowOutput = "";
        if (selects.length > 0) {
            var selectedOption = selects[0].options[selects[0].selectedIndex].value;
        
            if(j == 8){
                rowOutput += "~ "+selectedOption+" ";
            }else{
                rowOutput += " "+selectedOption+" ";
            }
   
        }
        if (selects.length == 2) {
            var selectedOption = selects[1].options[selects[1].selectedIndex].value;
            rowOutput += " "+selectedOption+" ";
        }

        if (inputs.length > 0) {
            if(j == 3 ){
                rowOutput += "'" + inputs[0].value + "'";
            }else{
                rowOutput +=" "+inputs[0].value+" ";
            }
            
        }
        output += rowOutput;
    }
    const rule = {name:cells[cells.length-1].getElementsByTagName("textarea")[0].value, description: "", expression: output , ruleid:roleid};
    fetch(`/update-rule/${roleid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rule)
    });
    
    setTimeout(() => {
      make_alog('rules','update-rule',`עדכון חוק ${rule.name}`);
      location.reload();
    }, 1200);
      
  }