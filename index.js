//. and . in the same number
//* * not allowed, replace
//cant equal if ends with operator
//Never have more close brackets than open
//e π  √  log ln sin cos tan sin-1 cos-1 tan-1   factorial percent
//p.s ! % and ) are numbers
//v2 ²³ cuberoot
function Calculator() {
    this.numbers = ["!", ")", "."];
    this.operators = ["×", "÷", "%", "^"];
    this.unary = ["√", "log", "ln", "sin", "cos", "tan", "sin-l", "cos-l", "tan-l"];
    this.reg = /[0-9]/;
    this.createArray = function (str) {
        var arr = [];
        loop1:
        for (var i = 0; i < str.length; i++) {
            if (str[i] == 'e') {
                arr.push(Math.E);
            } else if (str[i] == 'π') {
                arr.push(Math.PI);
            }else if(str[i]=="("){
                let bcnt = 0;
                for(var j=i+1;j<str.length;j++){
                    if(str[j]=="("){
                        bcnt++;
                    }else if(str[j]==")"){
                        if(bcnt==0){
                            arr.push(this.createArray(str.slice(i+1,j)));
                            break;
                        }else{
                            bcnt--;
                        }
                    }
                   
                }
                i=j;
                continue loop1;

            }else if(this.reg.test(str[i])){
                for(var num=i+1;num<=str.length;num++){
                    if(!(this.reg.test(str[num])||str[num]==".")){
                       
                        break;
                    }
                }
                arr.push(str.slice(i,num));
                i=num-1;
                continue loop1;
            } else {
                loop2:
                for (var len = 5; len >= 1; len--) {
                    if (this.unary.includes(str.slice(i, i+len))) {
                        arr.push(str.slice(i,i+ len));
                        i=(i+len)-1;
                        continue loop1;
                    }
                }
                arr.push(str[i]);

            }
        }
        return this.FixArray(arr);
    };
    this.Press = function (pr, b4) {
        //Input e and pi
        if (this.reg.test(pr)) {
            if (b4[b4.length - 1] != 0) {
                return b4 + pr;
            }
            if (b4[b4.length - 1] == 0) {
                if (this.reg.test(b4[b4.length - 2]) || b4[b4.length - 2] == ".") {
                    return b4 + pr;
                } else {
                    return b4.slice(0, b4.length - 1) + pr;
                }
            }
            /*if(b4[b4.length-1]==")"){
                return b4;
            }*/



        }
        var brac = false;
        var point = false;
        if (pr == ")") {
            var tot = 0;
            brac = true;
            if(b4[b4.length-1]=="("){
                return b4.slice(0,b4.length-1);
            }
        }
        if (pr == ".") {
            point = true;
            if (!(this.reg.test(b4[b4.length - 1])||b4[b4.length - 1]==".")) {
                return b4 + "0.";
            }
        }
        for (let i = b4.length - 1; i >= 0; i--) {
            if (point) {
                if (b4[i] == ".") {
                    return b4;
                }
                if (!(this.reg.test(b4[i]) || b4[i] == ".")) {
                    return b4 + pr;
                }
            }
            if (brac) {
                if (b4[i] == ")") {
                    tot--;
                } else if (b4[i] == "(") {
                    tot++;
                }
            }
        }
        if (brac) {
            if (tot > 0) {
                return b4 + pr;
            } else {
                return b4;
            }
        }
        if (this.numbers.includes(pr) || this.operators.includes(pr)) {
            if ((this.numbers.includes(b4[b4.length - 1])) || (this.reg.test(b4[b4.length - 1]))) {
                return b4 + pr;
            } else {
                if (!this.operators.includes(pr)) {
                    return b4;
                } else {
                    //Pop from string
                    if (b4.length == 0 || b4[b4.length - 1] == "(") {
                        return b4 + "0"+pr;
                    }
                    b4 = b4.slice(0, b4.length - 1);
                    return this.Press(pr, b4);
                }
                return b4;
            }
        }
       /* if (["+", "-"].includes(pr)) {
            if (this.operators.includes(b4[b4.length - 1])) {
                //TODO remove from string
                return b4.slice(0, b4.length - 1) + pr;
            } else {
                return b4 + pr;
            }
        }*/

        return b4 + pr;
        /* 
        //o.1, 0.2
            * / and ! must come after a number
            ) must have less number of ( before
            . must not exist in the number


        */

    };

    this.BackSpace = function (b4) {
        /*if peek is num or op no p
        if ( 
            remove brac
            if sin or log (b4) remove
            */
            var newstr;
            if(b4[b4.length-1] == "("){
                let k = b4.length-1;
                if(this.unary.includes(b4.substring(k-3,k))){
                    newstr = b4.substring(0,k-3);
                }else{
                    newstr = b4.substring(0,b4.length-1);
                }
            }
            else{
                newstr = b4.substring(0,b4.length-1);
            }
            return newstr;
            

    };
    this.Solution = function (b4) {
        if (!((this.numbers.includes(b4[b4.length - 1])) || (this.reg.test(b4[b4.length - 1])))) {
            return "";
        }
        //If ends with operator(except !)
        var braccount = 0;
        for (var i = 0; i < b4.length; i++) {
            if (b4[i] == "(") {
                braccount++;
            } else if (b4[i] == ")") {
                braccount--;
            }
        }
        for (i = 0; i < braccount; i++) {
            b4 += ")";
        }
         /*Close all open brackets*/
        let stck = this.createArray(b4);
      //  console.log(stck);
        return this.Resolve(stck);
       // return stck;
    };
    this.FixArray = function(stck){
        let stck2 =[];
       
        while(stck.length>0){
             //bracket all - and + not preceeded by number, close) is a number, to (0- whatever(brackets =0) close) iterate from right
            let x = stck.length-1;
            if (["+", "-"].includes(stck[x])) {
                if (!((this.numbers.includes(stck[x- 1])) || (this.reg.test(stck[x - 1])))) {
                    let Inner =[];
                    Inner.push(0);
                    Inner.push(stck.pop());
                    Inner.push(stck2.pop());
                    stck.push(Inner);

                }
            }
            //bracket all unary ops (% and ! with who hey are after)
            if(stck[x]=="!"){
                let Inner=[];
                let hld = stck.pop();
                Inner.push(stck.pop());
                Inner.push(hld);
                stck.push(Inner);
            }
            if(this.unary.includes(stck[x])){
                let Inner=[];
                Inner.push(stck.pop());
                Inner.push(stck2.pop());
                stck.push(Inner);
            }
            //Exponent is right most
            if(stck[x]=="^"){
                let Inner=[];
                let op = stck.pop();
                let first = stck.pop();
                let second = stck2.pop();
                Inner.push(first);
                Inner.push(op);
                Inner.push(second);
                stck.push(Inner);
            }
            //all ( imm after a num put * before it and bracket number before and after
            if(Array.isArray(stck[x])){
                if( (this.reg.test(stck[x - 1]))||(Array.isArray(stck[x-1]))){
                    let Inner =[];
                   let hld = stck.pop();
                    Inner.push(stck.pop());
                    Inner.push("×");
                    Inner.push(hld);
                    stck.push(Inner);
                }
                let peekS2 = stck2[stck2.length-1];
                if((this.reg.test(peekS2))||(Array.isArray(peekS2))){
                    let Inner =[];
                    Inner.push(stck.pop());
                    Inner.push("×");
                    Inner.push(stck2.pop());
                    stck.push(Inner);
                }
            }
            //all ( not after a num put * before it and bracket number before and after
         /*   if(Array.isArray(stck[x])){
                if ((this.reg.test(stck[x - 1]))||(Array.isArray(stck[x-1]))){
                    let Inner =[];
                   let hld = stck.pop();
                    Inner.push(stck.pop());
                    Inner.push("×");
                    Inner.push(hld);
                    stck.push(Inner);
                }
            }*/
            if(stck[x]!=undefined){
            stck2.push(stck.pop());
            }


        }
        while(stck2.length>0){
            let x = stck2.length-1;
            if(this.operators.includes(stck2[x])){
                let Inner =[];
                Inner.push(stck.pop());
                Inner.push(stck2.pop());
                Inner.push(stck2.pop());
                stck2.push(Inner);
            }
            if(stck2[x]!=undefined){
            stck.push(stck2.pop());
            }
        }
        return stck;
        /*

Bracket all guys using PEDMAS and left most

Bracket all numbers preceeded or followed immediately by )( * and bracket

Push all guys into the stack, new stack with each open bracket
call resolve on stack
*/
   

    };
    this.Mult = function(fst,scnd){
        return fst*scnd;
    };
    this.Calculate={
        "×":(a,b) =>a*b,
        "+":(a,b)=>a+b,
        "-":(a,b) =>a-b,
        "÷":(a,b)=>a/b,
        "%":(a,b) =>a%b,
        "^":(a,b)=>Math.pow(a,b),
        "sin":(a) => Math.sin(a),
        "cos":(a) => Math.cos(a),
        "tan":(a) => Math.tan(a),
        "log":(a) => Math.log10(a),
        "ln":(a) => Math.log(a),

        "/":"div"
    
    };
    this.Resolve = function (stack) {
        if(Array.isArray(stack)){
        while(stack.length>1){
            let x = stack.length-1;
            if(stack[x]=="!"){
                
                //Call factorial on
                stack.push( this.Calculate[stack.pop()](this.Resolve(stack.pop())));
            }
            if(Array.isArray(stack[x])||this.reg.test(stack[x])){
                if(this.unary.includes(stack[x-1])){
                    let val = stack.pop();
                    stack.push(this.Calculate[stack.pop()](this.Resolve(val)));
                }else{
                    let sec = stack.pop();
                    let op = stack.pop();
                    let first = stack.pop();
                    stack.push(this.Calculate[op](this.Resolve(first),this.Resolve(sec)));
                }

            }
            
        }
        return Number(this.Resolve(stack[0]));
        }else{
            return Number(stack);
        }
        /*
        while(stack count >1)
         Pop from array
            if stack, resolve and push
            if number (e or pi), hold=right pop (operator --- if not operator, error) 
              if log, sin or unary op,
                ans = op right
                push ans
              else
                op = poped operator pop (number or stack, ---- error)
                left = poped num;
                ans = left op right
                push ans;
            if(operator % or !)
                pop num
                ans = num op
                push ans
            end while 
            retrun pop(from array)
        */
    };
}
var a = new Calculator();
function Press(inpt){
    let b4 = document.getElementById("scr").value;
    var layout = a.Press(inpt,b4);
    var ans = "";
    for(let a = 0; a <layout.length; a++){
        if(layout[a] =="÷"){
            ans += '\u00F7';
        }
        else if(layout[a] == "×"){
            ans += '\u00D7';
        }
        else if(layout[a] == "√"){
            ans += '\u221A';
        }
        else{
            ans += layout[a];
        }
    }
    

    document.getElementById("scr").value=ans;
}

function ClearFunction(){
    document.getElementById("scr").value='';
}

function BackSp(){
   var st= a.BackSpace(document.getElementById("scr").value);
   document.getElementById("scr").value= st;

   
}
function equals(){
    var st = a.Solution(document.getElementById("scr").value);
   document.getElementById("scr").value= st;
}