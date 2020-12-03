var ZTIMES = ZTIMES || {};

ZTIMES.DEF = {
  NONE: undefined,    // ZTIMES.DEF.NONE
  DEFAULT: undefined,    // ZTIMES.DEF.DEFAULT
};
ZTIMES.LIB = {
  EVENT: {
    IsMobile: function(){
      const isMobile = 'ontouchend' in document;
      return isMobile;
    },
    AddEventPressed: function(element,action){
      // http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
      element.addEventListener('mouseup',function(eventInfo){
        eventInfo.preventDefault();
        action(eventInfo);
      },false);
      element.addEventListener("touchend",function(eventInfo){
        eventInfo.preventDefault();
        action(eventInfo);
      },false);
    },
  },
  TextToArray: function(text){
    const array = new TextEncoder().encode(text);
    return array;
  },
  ArrayToText: function(array){
    const text = new TextDecoder().decode(array);
    return text;
  },
  ToU8Array: function(array){
    const arrayLen = array.length;
    return new Uint8Array(array,0,arrayLen);
  },
  ToHex: function(array){
    const arrayHex = array.map(b => b.toString(16).padStart(2,'0')).join('');
    return arrayHex;
  },
  IsNumber: function(target){
    const ret = isNaN(target);
    if(ret === false){
      return true;
    }
    else{
      return false;
    }
  },
  ToPx: function(target){
    if(this.IsNumber(target) === true){
      return target + 'px';
    }
    else{
      return target;
    }
  },
  DeepCopy: function(input){
    const output = {};
    this.deepCopy(input,output);
    return output;
  },
  Override: function(commands){
    const addition = commands.addition;
    const output = this.DeepCopy(commands.base);
    this.deepCopy(addition,output);
    return output;
  },
  deepCopy: function(addition,outputParent){
    if((addition === undefined)||(outputParent === undefined)){
      return;
    }
    for(let [key,value] of Object.entries(addition)){
      if(this.isShortcut(key) === true){
        outputParent[key] = value;
      }
      else {
        const result = this.CheckType(value);
        if(result === 'object'){
          if(outputParent[key] === undefined){
            const outputChild = {};
            this.deepCopy(value,outputChild);
            outputParent[key] = outputChild;
          }
          else{
            const outputChild = outputParent[key];
            this.deepCopy(value,outputChild);
            outputParent[key] = outputChild;
          }
        }
        else if(result === 'array'){
          const it = this;
          outputParent[key] = value.map((child)=>{
            const outputChild = {};
            it.deepCopy(child,outputChild);
            return outputChild;
          });
        }
        else{
          outputParent[key] = value;
        }
      }
    }
  },
  isShortcut: function(key){
    const reg = new RegExp('_Link');
    const result = key.match(reg);
    if(result === null){
      return false;
    }
    else{
      return true;
    }
  },
  CheckType: function(target){
    const result = Object.prototype.toString.call(target).slice(8,-1).toLowerCase();
    // console.log(result);
    return result;
  },
  ToggleItem: function(value,itemList){
    const itemListLen = itemList.length;
    for(let cnt=0;cnt<itemListLen;cnt+=1){
      const item = itemList[cnt];
      if(item === value){
        const indexNext = (cnt+1 < itemListLen) ? cnt+1 : 0;
        const itemNext = itemList[indexNext];
        return itemNext;
      }
    }
    return itemList[0];
  },
  IsValidValue: function(value){
    if((value === undefined)||(value === null)||(value === '')){
      return false;
    }
    else{
      return true;
    }
  },
  SetValue: function(defaultValue,sourceValue){
    const isValid = this.IsValidValue(sourceValue);
    if(isValid === false){
      return defaultValue;
    }
    else{
      return sourceValue;
    }
  },
  Between: function(target,rangeMin,rangeMax){
    if(target < rangeMin){
      return false;
    }
    if(target > rangeMax){
      return false;
    }
    return true;
  },
  Distance: function(targetP,targetQ){
    if(targetP < targetQ){
      return targetQ - targetP;
    }
    else if(targetP > targetQ){
      return targetP - targetQ;
    }
    else{
      return 0;
    }
  },
  VALUES: function(){
    this.valueLists = {};
    this.init();
  },
};
ZTIMES.LIB.VALUES.prototype = {
  init: function(){

  },
  Add: function(key,value){
    if(this.valueLists[key] === undefined){
      this.valueLists[key] = [value];
    }
    else{
      const valueList = this.valueLists[key];
      valueList.push(value);
      this.valueLists[key] = valueList;
    }
  },
  Remove: function(key,value){
    if(key === undefined){
      return;
    }
    if(this.valueLists[key] === undefined){
      return;
    }
    const valueList = this.valueLists[key];
    const valueListLen = valueList.length;
    if(valueListLen === 1){
      delete this.valueLists[key];
    }
    else{
      const valueName = value.params.name;    //@
      for(let cnt=0;cnt<valueListLen;cnt+=1){
        const value = valueList[cnt];
        if(value.params.name === valueName){
          valueList.splice(cnt,1);
          break;
        }
      }
    }
  },
  Act: function(key,func){
    const valueList = this.valueLists[key];
    if(valueList !== undefined){
      valueList.map((value)=>{
        func(value);
      });
    }
  },
};

//ZTIMES.LIB
