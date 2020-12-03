var ZTIMES = ZTIMES || {};

ZTIMES.GRID = {
  baseX: 20,
  baseY: 15,
  init: function(){
  },
  SetBase: function(bases){
    this.baseX = bases.baseX;
    this.baseY = bases.baseY;
  },
  VerifyShape: function(params){
    const shape = params.shape;
    if(shape === undefined){
      return;
    }
    const layerInfo = this.parseLayer(params);
    this.parseShape(shape);
    this.parseCircle(shape);
    this.parseGridW(shape,layerInfo);
    this.parseGridH(shape,layerInfo);
    this.parseGridX(shape,layerInfo);
    this.parseGridY(shape,layerInfo);
    this.parseOffset(shape);
    this.parseLimit(shape,layerInfo);
  },
  VerifyTarget: function(targets){
    const name = targets.name;
    const shape = targets.target;
    const layer_Link = targets.layer_Link;
    const params = {
      name:name,
      shape:shape,
      layer_Link:layer_Link,
    };
    const layerInfo = this.parseLayer(params);
    this.parseShape(shape);
    this.parseCircle(shape);
    this.parseGridW(shape,layerInfo);
    this.parseGridH(shape,layerInfo);
    this.parseGridX(shape,layerInfo);
    this.parseGridY(shape,layerInfo);
    this.parseOffset(shape);
    this.parseShapeList({
      name:name,
      target:shape,
      layer_Link:layer_Link,
    });
    this.parseLimit(shape,layerInfo);
  },
  parseShapeList: function(targets){
    const it = this;
    if(targets.target.shapeList !== undefined){
      let cnt = 0;
      targets.target.shapeList.map((shape)=>{
        it.VerifyTarget({
          name:targets.name+cnt,
          target:shape,
          layer_Link:targets.layer_Link,
        });
        cnt += 1;
      });
    }
  },
  parseLayer: function(params){
    if(params.layer_Link === undefined){
      const layerMaxW = window.screen.availWidth;
      const layerMaxH = window.screen.availHeight;
      const layerCenterX = parseInt(layerMaxW/2);
      const layerInfo = {
        layerMaxW:layerMaxW,
        layerMaxH:layerMaxH,
        layerCenterX:layerCenterX,
      };
      return layerInfo;
    }
    else{
      const layerMaxW = params.layer_Link.params.shape.w;
      const layerMaxH = params.layer_Link.params.shape.h;
      const layerCenterX = parseInt(layerMaxW/2);
      const layerInfo = {
        layerMaxW:layerMaxW,
        layerMaxH:layerMaxH,
        layerCenterX:layerCenterX,
      };
      return layerInfo;
    }
  },
  parseShape: function(shape){
    shape.x = ZTIMES.LIB.SetValue(0,shape.x);
    shape.y = ZTIMES.LIB.SetValue(0,shape.y);
    shape.w = ZTIMES.LIB.SetValue(0,shape.w);
    shape.h = ZTIMES.LIB.SetValue(0,shape.h);
    shape.r = ZTIMES.LIB.SetValue(0,shape.r);
  },
  parseCircle: function(shape){
    if(shape.radius !== undefined){
      shape.w = shape.radius*2;
      shape.h = shape.radius*2;
      shape.r = shape.radius;
      shape.isCircle = true;
    }
  },
  parseGridW: function(shape,layerInfo){
    if(shape.gridW !== undefined){
      const gridW = shape.gridW;
      if(gridW === '#None'){
        delete shape.gridW;
      }
      else if(gridW === '#Max'){
        shape.w = '#Max';
      }
      else{
        if(gridW < 0){
          console.log('[ERR] parseGridW()');
        }
        shape.w = gridW * this.baseX;
      }
    }
    if(shape.w === '#Default'){
      shape.w = 320;
    }
    else if(shape.w === '#Max'){
      shape.w = layerInfo.layerMaxW;
    }
  },
  parseGridH: function(shape,layerInfo){
    if(shape.gridH !== undefined){
      const gridH = shape.gridH;
      if(gridH === '#None'){
        delete shape.gridH;
      }
      else if(gridH === '#Max'){
        shape.h = '#Max';
      }
      else{
        if(gridH < 0){
          console.log('[ERR] parseGridH()');
        }
        shape.h = gridH * this.baseY;
      }
    }
    if(shape.h === '#Default'){
      shape.h = 480;
    }
    else if(shape.h === '#Max'){
      shape.h = layerInfo.layerMaxH;
    }
  },
  parseGridX: function(shape,layerInfo){
    if(shape.gridX !== undefined){
      const gridX = shape.gridX;
      if(gridX === '#None'){
        delete shape.gridX;
      }
      else if(gridX === '#Center'){
        shape.x = layerInfo.layerCenterX - shape.w/2;
      }
      else if(gridX === '#Left'){
        shape.x = 0;
      }
      else if(gridX === '#Right'){
        shape.x = layerInfo.layerMaxW;
      }
      else{
        shape.x = gridX * this.baseX + layerInfo.layerCenterX;
      }
    }
  },
  parseGridY: function(shape,layerInfo){
    if(shape.gridY !== undefined){
      const gridY = shape.gridY;
      if(gridY === '#None'){
        delete shape.gridY;
      }
      else{
        if(gridY < 0){
          console.log('[ERR] parseGridY()');
        }
        else if(gridY === '#Next'){
        }
        else{
          shape.y = gridY * this.baseY;
        }
      }
    }
  },
  parseOffset: function(shape){
    if(shape.offsetX !== undefined){
      shape.x += shape.offsetX;
    }
    if(shape.offsetY !== undefined){
      shape.y += shape.offsetY;
    }
    if(shape.offsetW !== undefined){
      shape.w += shape.offsetW;
    }
    if(shape.offsetH !== undefined){
      shape.h += shape.offsetH;
    }
  },
  parseLimit: function(shape,layerInfo){
    if(shape.x < 0){shape.x = 0;}
    if(shape.y < 0){shape.y = 0;}
    if(shape.w < 0){shape.w = 0;}
    if(shape.h < 0){shape.h = 0;}
    if(shape.w > layerInfo.layerMaxW){shape.w = layerInfo.layerMaxW;}
    if(shape.h > layerInfo.layerMaxH){shape.h = layerInfo.layerMaxH;}
  },
  LogOut: function(params){
    const parent = params.parent_Link;
    const name = params.name;
    const shape = params.shape;
    if(shape !== undefined){
      const logText = '['+name+'] x:'+shape.x +' y:'+shape.y +' w:'+shape.w +' h:'+shape.h;
      if(parent === undefined){
        console.log(logText);
      }
      else{
        console.log('-['+parent.params.name+']' + logText);
      }
    }
  },
}
ZTIMES.SCREEN = {
  DEF:{
    DomRootName:'iCanvasRoot',
    GridBaseX:20,
    GridBaseY:15,
  },
  domRoot: undefined,
  init: function(){
    ZTIMES.GRID.SetBase({
      baseX:ZTIMES.SCREEN.DEF.GridBaseX,
      baseY:ZTIMES.SCREEN.DEF.GridBaseY,
    });
    this.domRoot = document.getElementById(ZTIMES.SCREEN.DEF.DomRootName);
    this.createPrimitive();
    ZTIMES.SCREEN.MOVE.Animate();
  },
  test: function(){
  },
  debug: {},
  DebugSetStructObj: function(nameList,func){
    this.debug.nameList = nameList;
    this.debug.func = func;
  },
  DebugCheckStructObj: function(name){
    const nameList = this.debug.nameList.length;
    for(let cnt=0;cnt<nameList;cnt+=1){
      if(this.debug.nameList[cnt] === name){
        return this.debug.func(name);
      }
    }
    return undefined;
  },
  createPrimitive: function(){
    ZTIMES.SCREEN.Layer = ZTIMES.SCREEN.AddStruct({
      name:'Layer',
      primitiveKind:'#Layer',
      zIndex:1,
      shape:{
        x:0,y:0,w:'#Max',h:'#Max',
        offsetY:0,
        offsetH:0,
      },
      ctx:undefined,
      pressedEvents:{},
    });
    ZTIMES.SCREEN.Element = ZTIMES.SCREEN.AddStruct({
      name:'Element',
      primitiveKind:'#Element',
      shape:{
        r:0,
        offsetX:0,
        offsetY:0,
        offsetW:0,
        offsetH:0,
      },
      colors:{},
      path2D:undefined,
      isOnEvent:false,
    });
    ZTIMES.SCREEN.DomNode = ZTIMES.SCREEN.AddStruct({
      name:'DomNode',
      primitiveKind:'#DomNode',
      zIndex:1,
      shape:{
        gridW:10,gridH:2,
        r:0,
      },
    });
  },
  structObjs: {},
  AddStruct: function(params){
    params.structObjKind = '#Struct';
    return this.addStructObj(params);
  },
  AddObj: function(params){
    params.structObjKind = '#Obj';
    return this.addStructObj(params);
  },
  addStructObj: function(params){
    const structObj = new this.STRUCTOBJ(params);
    this.structObjs[params.name] = structObj;
    return structObj;
  },
  GetStructObj: function(name){
    const structObj = this.structObjs[name];
    return structObj;
  },
  GetSibling: function(self,siblingName){
    const parent = self.params.parent_Link;
    const siblings = parent.params.children;
    for(let [key,value] of Object.entries(siblings)){
      if(key === siblingName){
        const fullName = value.name;
        const structObj = ZTIMES.SCREEN.GetStructObj(fullName);
        return structObj;
      }
    }
    return undefined;
  },
  STRUCTOBJ: function(params){
    this.params = {};
    this.init(params);
  },
  SetDomVisible: function(name,visible){
    const structObj = this.GetStructObj(name);
    if(structObj.params.primitiveKind === '#Element'){
      ZTIMES.SCREEN.ELEMENT.setDomVisible(structObj,visible);
    }
    else{
      ZTIMES.SCREEN.LAYER.setDomVisibleR(structObj,visible);
    }
  },
  LAYER: {
    //@ layer on root or layer : not on element
    CreateDom: function(self){
      const params = self.params;
      if(params.structObjKind === '#Struct'){}
      else if(params.structObjKind === '#Obj'){
        params.dom = document.createElement('canvas');
        params.dom.id = params.name;
        params.dom.style.zIndex = params.zIndex;
        params.dom.style.position = 'absolute';
        params.dom.style.left = ZTIMES.LIB.ToPx(params.shape.x);
        params.dom.style.top = ZTIMES.LIB.ToPx(params.shape.y);
        params.dom.width = params.shape.w;
        params.dom.height = params.shape.h;
        params.ctx = params.dom.getContext('2d');
        params.dom.style.visibility = 'hidden';
        ZTIMES.SCREEN.domRoot.appendChild(params.dom);
      }
    },
    Show: function(self){
      const params = self.params;
      if(params.structObjKind === '#Struct'){}
      else if(params.structObjKind === '#Obj'){
        this.showBackground(self);
      }
    },
    showBackground: function(self){
      const params = self.params;
      if(
        (params.colors === undefined)||
        (params.colors.background === undefined)
      ){
        return;
      }
      const ctx = params.ctx;
      if(params.colors.globalAlpha !== undefined){
        ctx.globalAlpha = params.colors.globalAlpha;
      }
      ctx.fillStyle = params.colors.background;
      ctx.fillRect(0,0,params.dom.width,params.dom.height);
      if(ctx.globalAlpha !== 1){
        ctx.globalAlpha = 1;
      }
    },
    setDomVisibleR: function(structObjLayer,visible){
      if((structObjLayer.params.primitiveKind === '#Layer')||
         (structObjLayer.params.primitiveKind === '#DomNode')){
        this.setDomVisible(structObjLayer,visible);
        const children = structObjLayer.params.children;
        if(children !== undefined){
          for(let [key,value] of Object.entries(children)){
            const childName = value.name;
            const structObjChildLayer = ZTIMES.SCREEN.GetStructObj(childName);
            this.setDomVisibleR(structObjChildLayer,visible);
          }
        }
      }
    },
    setDomVisible: function(structObjLayer,visible){
      const params = structObjLayer.params;
      if(params.dom !== undefined){
        params.visible = visible;
        if(visible === '#Hide'){
          params.dom.style.visibility = 'hidden';
        }
        else{
          params.dom.style.visibility = 'visible';
        }
      }
    },
    CreateEvent: function(self){
      const it = this;
      const params = self.params;
      const layerName = params.name;
      ZTIMES.LIB.EVENT.AddEventPressed(params.dom,function(eventInfo){
        const eventKind = eventInfo.type;
        if(eventKind === 'mouseup'){
          const coodinates = {};
          coodinates.x = eventInfo.offsetX;
          coodinates.y = eventInfo.offsetY;
          it.onPressedEvent(layerName,eventKind,coodinates);
        }
        else if(eventKind === 'touchend'){
          const touches = eventInfo.changedTouches;
          const touchesLen = touches.length;
          if(touchesLen > 0){
            const indelastX = touchesLen - 1;
            const rect = params.dom.getBoundingClientRect();
            const coodinates = {};
            coodinates.x = eventInfo.changedTouches[0].clientX - rect.left;
            coodinates.y = eventInfo.changedTouches[0].clientY - rect.top;
            it.onPressedEvent(layerName,eventKind,coodinates);
          }
        }
      });
    },
    onPressedEvent: function(layerName,eventKind,coodinates){
      const it = this;
      const structObjLayer = ZTIMES.SCREEN.GetStructObj(layerName);
      const params = structObjLayer.params;
      Object.values(params.pressedEvents).forEach((pressedEvent)=>{
        const structObjElement = pressedEvent.element_Link;
        const beginX = structObjElement.params.shape.x;
        const beginY = structObjElement.params.shape.y;
        const endX = beginX + structObjElement.params.shape.w;
        const endY = beginY + structObjElement.params.shape.h;
        console.log('*['+layerName+'] '+ '#Pressed('+eventKind+') x:' + coodinates.x + ' y:' + coodinates.y);
        if(structObjElement.params.isOnEvent === false){
          if(it.inRange(structObjLayer,structObjElement,coodinates) === true){
            const elementName = structObjElement.params.name;
            // console.log('['+elementName+'] '+ '#Pressed('+eventKind+') x:' + coodinates.x + ' y:' + coodinates.y);
            ZTIMES.SCREEN.DebugCheckStructObj(structObjElement.params.name);
            structObjElement.notifyEvent({
              eventKind:'#Pressed',
              coodinates:coodinates,
            });
          }
        }
      });
    },
    inRange: function(structObjLayer,structObjElement,coodinates){
      if(structObjElement.params.visible === '#Hide'){
        return false;
      }
      if(structObjElement.params.path2D !== undefined){
        const ret = structObjLayer.params.ctx.isPointInPath(structObjElement.params.path2D,coodinates.x,coodinates.y);
        return ret;
      }
      else{
        const shape = structObjElement.params.shape;
        if((ZTIMES.LIB.Between(coodinates.x,shape.x,shape.x+shape.w) === true)&&
           (ZTIMES.LIB.Between(coodinates.y,shape.y,shape.y+shape.h) === true)){
          return true;
        }
        else{
          return false;
        }
      }
    },
    AddPressedEvent: function(structObjElement){
      if(structObjElement.params.events !== undefined){
        const eventHandler = structObjElement.params.events['#Pressed'];
        if(eventHandler !== undefined){
          const structObjLayer = structObjElement.params.layer_Link;
          const name = structObjElement.params.name;
          if(structObjLayer.params.pressedEvents[name] === undefined){
            structObjLayer.params.pressedEvents[name] = {
              element_Link:structObjElement,
            };
          }
          else{
            console.log("Duplicated name.");
          }
        }
      }
    },
    RemovePressedEvent: function(structObjElement){
      const structObjLayer = structObjElement.params.layer_Link;
      const name = structObjElement.params.name;
      if(structObjLayer.params.pressedEvents[name] === undefined){
        console.log("No name.");
      }
      else{
        delete structObjLayer.params.pressedEvents[name];
      }
    },
  },
  ELEMENT: {
    Create: function(self){
      //@ element on layer : not on element or root
      ZTIMES.SCREEN.LAYER.AddPressedEvent(self);
      if(self.params.structObjKind === '#Obj'){
        const moves = self.params.shape.moves;
        if(moves !== undefined){
          this.create2D(self);
        }
        else{
          const svgs = self.params.shape.svgs;
          if(svgs !== undefined){
            const svgPath = svgs.region.svgPath;
            self.params.path2D = new Path2D(svgPath);
          }
          else {
            this.createPath2D(self);
          }
        }
      }
    },
    GetLayer: function(self){
      const structObjParent = self.params.parent_Link;
      if(structObjParent !== undefined){
        const primitiveKind = structObjParent.params.primitiveKind;
        if(primitiveKind === '#Layer'){
          return structObjParent;
        }
        return this.GetLayer(structObjParent);
      }
    },
    create2D: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        const shape = self.params.shape;
        const x = shape.x;
        const y = shape.y;
        const w = shape.w;
        const h = shape.h;
        const r = ZTIMES.LIB.SetValue(0,shape.r);
        // Background
        ctx.beginPath();
        ctx.moveTo(x, y+r);
        ctx.lineTo(x, y+h-r);
        ctx.arcTo(x, y+h, x+r, y+h, r);
        ctx.lineTo(x+w-r, y+h);
        ctx.arcTo(x+w, y+h, x+w, y+h-r, r);
        ctx.lineTo(x+w, y+r);
        ctx.arcTo(x+w, y, x+w-r, y, r);
        ctx.lineTo(x+r, y);
        ctx.arcTo(x, y, x, y+r, r);
        ctx.closePath();
      }
    },
    createPath2D: function(self){
      self.params.path2D = new Path2D();
      const shape = self.params.shape;
      const x = shape.x;
      const y = shape.y;
      const w = shape.w;
      const h = shape.h;
      const r = ZTIMES.LIB.SetValue(0,shape.r);
      // Background
      self.params.path2D.moveTo(x, y+r);
      self.params.path2D.lineTo(x, y+h-r);
      self.params.path2D.arcTo(x, y+h, x+r, y+h, r);
      self.params.path2D.lineTo(x+w-r, y+h);
      self.params.path2D.arcTo(x+w, y+h, x+w, y+h-r, r);
      self.params.path2D.lineTo(x+w, y+r);
      self.params.path2D.arcTo(x+w, y, x+w-r, y, r);
      self.params.path2D.lineTo(x+r, y);
      self.params.path2D.arcTo(x, y, x, y+r, r);
      self.params.path2D.closePath();
    },
    Redraw: function(self){
      this.erase(self);
      this.Show(self);
    },
    setDomVisible: function(self,visible){
      if(self.params.visible === visible){
        return;
      }
      self.params.visible = visible;
      if(self.params.visible === '#Hide'){
        this.erase(self);
        this.gone(self);
      }
      else{
        this.Show(self);
      }
    },
    Erase: function(layer,shape){
      const ctx = layer.params.ctx;
      ctx.clearRect(
        shape.x,
        shape.y,
        shape.w,
        shape.h
      );
    },
    erase: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      ctx.clearRect(
        self.params.shape.x,
        self.params.shape.y,
        self.params.shape.w,
        self.params.shape.h
      );
    },
    eraseLast: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      ctx.clearRect(
        self.params.shape.lastX,
        self.params.shape.lastY,
        self.params.shape.w,
        self.params.shape.h
      );
    },
    Show: function(self){
      if(self.params.shape.svgs !== undefined){
        this.showSvgs(self);
      }
      else if(self.params.shape.images !== undefined){
        this.showImage(self);
      }
      else{
        this.fillBackground(self);
        this.showText(self);
      }
    },
    showSvgs: function(self){
      const svgs = self.params.shape.svgs;
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        for(let [key,value] of Object.entries(svgs)){
          if(value.showKind === '#Fill'){
            const orgFillStyle = ctx.fillStyle;
            ctx.fillStyle = value.color;
            const path2D = new Path2D(value.svgPath);
            ctx.fill(path2D);
            ctx.fillStyle = orgFillStyle;
          }
          else if(value.showKind === '#Stroke'){
            const orgStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = value.color;
            const path2D = new Path2D(value.svgPath);
            ctx.stroke(path2D);
            ctx.strokeStyle = orgStrokeStyle;
          }
        }
      }
    },
    cacheImages: {},
    showImage: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const it = this;
        const shape = self.params.shape;
        const images = self.params.shape.images;
        const src = images.src;
        const name = self.params.name;
        if(this.cacheImages[name] === undefined){
          const elImage = new Image();
          elImage.src = images.src;
          this.cacheImages[name] = '#Loading';
          elImage.onload = function(){
            it.cacheImages[name] = elImage;
            if(images.scalePercent !== undefined){
              const fullW = shape.w;
              const fullH = shape.h;
              shape.w = elImage.width * images.scalePercent / 100;
              shape.h = elImage.height * images.scalePercent / 100;
              shape.x -= (shape.w-fullW)>0 ? (shape.w-fullW)/2 : 0;
              shape.y -= (shape.h-fullH)>0 ? (shape.h-fullH)/2 : 0;
            }
            else{
              if(images.scaleFullW === true){
                const scaleRate = elImage.width / shape.w;
                const fullH = shape.h;
                shape.h = elImage.height / scaleRate;
                shape.y += (fullH-shape.h)>0 ? (fullH-shape.h)/2 : 0;
              }
              if(images.scaleFullH === true){
                const scaleRate = elImage.height / shape.h;
                const fullW = shape.w;
                shape.w = elImage.width / scaleRate;
                shape.x += (fullW-shape.w)>0 ? (fullW-shape.w)/2 : 0;
              }
            }
            it.drawImage(structObjLayer,self,elImage);
          };
        }
        else if(this.cacheImages[name] === '#Loading'){
          ;
        }
        else{
          const elImage = this.cacheImages[name];
          this.drawImage(structObjLayer,self,elImage);
        }
      }
    },
    drawImage: function(structObjLayer,self,elImage){
      const ctx = structObjLayer.params.ctx;
      const shape = self.params.shape;
      const images = self.params.shape.images;
      const blocks = images.blocks;
      if(blocks !== undefined){
        ctx.drawImage(elImage,blocks.x,blocks.y,blocks.w,blocks.h,shape.x,shape.y,shape.w,shape.h);
      }
      else{
        ctx.drawImage(elImage,shape.x,shape.y,shape.w,shape.h);
      }
    },
    fillBackground: function(self,kind){
      if(self.params.colors === '#Transparent'){
        this.fillTransparent(self);
      }
      else if(self.params.colors === undefined){
        this.fillTransparent(self);
      }
      else{
        if(self.params.colors.background === undefined){
          this.fillTransparent(self);
        }
        else{
          if(kind === '#Pressed'){
            if(self.params.colors.pressedBackground === undefined){
              this.fillTransparent(self);
            }
            else{
              this.fill(self);
            }
          }
          else{
            this.fill(self);
          }
        }
      }
    },
    fillTransparent: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        ctx.globalAlpha = 0;
        const path2D = self.params.path2D;
        if(path2D === undefined){
          ctx.fill();
        }
        else{
          ctx.fill(path2D);
        }
        ctx.globalAlpha = 1;
      }
    },
    fill: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        const params = self.params;
        if(params.colors.globalAlpha !== undefined){
          ctx.globalAlpha = params.colors.globalAlpha;
        }
        const orgFillStyle = ctx.fillStyle;
        ctx.fillStyle = params.colors.background;
        const path2D = params.path2D;
        if(path2D === undefined){
          ctx.fill();
        }
        else{
          ctx.fill(path2D);
        }
        ctx.fillStyle = orgFillStyle;
        if(ctx.globalAlpha !== 1){
          ctx.globalAlpha = 1;
        }
      }
    },
    showText: function(self){
      if(self.params.text === undefined){
        return;
      }
      if(self.params.textDirection === '#Vertical'){
        this.showTextVertical(self);
      }
      else{
        this.showTextHorizonLR(self);
      }
    },
    ShowTextHorizonLR: function(targets){
      const layer_Link = targets.layer_Link;
      const shape = targets.shape;
      const font = targets.font;
      const fontColor = targets.fontColor;
      const text = targets.text;
      const structObjLayer = layer_Link;
      const ctx = structObjLayer.params.ctx;
      ctx.font = ZTIMES.LIB.SetValue('16px Times New Roman',font);
      const orgFillStyle = ctx.fillStyle;
      ctx.fillStyle = ZTIMES.LIB.SetValue('Black',fontColor);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const offsetY = 2;
      ctx.fillText(text, shape.x+shape.w/2, shape.y+shape.h/2+offsetY);
      ctx.fillStyle = orgFillStyle;
    },
    showTextHorizonLR: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      const params = self.params;
      const shape = self.params.shape;
      ctx.font = ZTIMES.LIB.SetValue('16px Times New Roman',params.font);
      const orgFillStyle = ctx.fillStyle;
      ctx.fillStyle = ZTIMES.LIB.SetValue('Black',params.colors.font);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const offsetY = 2;
      ctx.fillText(params.text, shape.x+shape.w/2, shape.y+shape.h/2+offsetY);
      ctx.fillStyle = orgFillStyle;
    },
    showTextVertical: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      const params = self.params;
      const shape = self.params.shape;
      ctx.font = ZTIMES.LIB.SetValue('16px Times New Roman', params.font);
      const orgFillStyle = ctx.fillStyle;
      ctx.fillStyle = ZTIMES.LIB.SetValue('Black',params.colors.font);
      const startX = shape.x + shape.w;
      const startY = shape.y;
      const baseChar = shape.text[0];
      const lineList = shape.text.split('\n');
      const charSize = ctx.measureText(baseChar).width;
      const charSpaceW = charSize * 0.5;
      const charSpaceH = charSize * 0.3;
      lineList.forEach((lineText,clm) => {
        Array.prototype.forEach.call(lineText,function(char,row) {
          const x = startX - (charSize + charSpaceW) * (clm + 1);
          const y = startY + (charSize + charSpaceH) * (row + 1);
          ctx.fillText(char,x,y);
        });
      });
      ctx.fillStyle = orgFillStyle;
    },
    UpdatePos: function(self){
      const moves = self.params.shape.moves;
      if(moves !== undefined){
        self.params.shape.lastX = self.params.shape.x;
        self.params.shape.lastY = self.params.shape.y;
        self.params.shape.x += moves.velocity.x;
        self.params.shape.y += moves.velocity.y;
        this.updateProjections(self);
      }
    },
    initProjections: function(self,cross){
      const shape = self.params.shape;
      shape.projections = ZTIMES.LIB.SetValue({
        cross:cross,
        center:undefined,
        rangeMin:undefined,
        rangeMax:undefined,
      },shape.projections);
    },
    updateProjections: function(self){
      const shape = self.params.shape;
      const projections = shape.projections;
      const cross = projections.cross;
      this.removeProjections(self,projections,cross);
      const mod = this.getMod(shape);
      const modCenterX = mod.modCenterX;
      const modCenterY = mod.modCenterY;
      const modRadius = mod.modRadius;
      const center2 = modCenterX*modCenterX+modCenterY*modCenterY;
      const center = parseInt(Math.sqrt(center2));
      const rangeMin = parseInt(center-modRadius);
      const rangeMax = parseInt(center+modRadius);
      projections.center = center;
      projections.rangeMin = rangeMin;
      projections.rangeMax = rangeMax;
      cross.AddValueLists(projections.center,self);
      cross.AddValueLists(projections.rangeMin,self);
      cross.AddValueLists(projections.rangeMax,self);
    },
    removeProjections: function(self,projections,cross){
      cross.RemoveValueLists(projections.center,self);
      cross.RemoveValueLists(projections.rangeMin,self);
      cross.RemoveValueLists(projections.rangeMax,self);
    },
    getMod: function(shape){
      const x = shape.x;
      const y = shape.y;
      const w = shape.w;
      const h = shape.h;
      if(shape.isCircle === true){
        shape.centerX = parseInt(x+w/2);
        shape.centerY = parseInt(y+h/2);
        const modCenterX = parseInt(shape.centerX/ZTIMES.SCREEN.MOVE.DEF.ModBase);
        const modCenterY = parseInt(shape.centerY/ZTIMES.SCREEN.MOVE.DEF.ModBase);
        const modRadius = parseInt(shape.radius/ZTIMES.SCREEN.MOVE.DEF.ModBase);
        return {
          modCenterX:modCenterX,
          modCenterY:modCenterY,
          modRadius:modRadius,
        };
      }
      else{
        shape.centerX = parseInt(x+w/2);
        shape.centerY = parseInt(y+h/2);
        shape.radius = ZTIMES.LIB.SetValue(parseInt(Math.sqrt(w*w+h*h)/2),shape.radius);
        const modCenterX = parseInt(shape.centerX/ZTIMES.SCREEN.MOVE.DEF.ModBase);
        const modCenterY = parseInt(shape.centerY/ZTIMES.SCREEN.MOVE.DEF.ModBase);
        const modRadius = parseInt(shape.radius/ZTIMES.SCREEN.MOVE.DEF.ModBase);
        return {
          modCenterX:modCenterX,
          modCenterY:modCenterY,
          modRadius:modRadius,
        };
      }
    },
    moveCollision: function(self,commands){
      console.log('<Cross> '+commands.crossKind+' '+self.params.name
        +' : '+commands.peer.params.name
        +' : '+commands.collisions.shapeShape
        +' '+commands.collisions.place
        +' '+commands.collisions.angle
        +' '+commands.collisions.directionX
        +' '+commands.collisions.directionY);
      if(commands.crossKind === '#Enter'){
        const shapeShape = commands.collisions.shapeShape;
        const place = commands.collisions.place;
        const angle = commands.collisions.angle;
        const directionX = commands.collisions.directionX;
        const directionY = commands.collisions.directionY;
        const moves = self.params.shape.moves;
        const velocity = moves.velocity;
        if(place === '#RightBottom'){
          if(angle === '#Vertical'){
            this.reverseMoveX(velocity,directionX,place);
          }
          else if(angle === '#Horizon'){
            this.reverseMoveY(velocity,directionY,place);
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
            this.reverseMoveY(velocity,directionY,place);
          }
        }
        else if(place === '#Right'){
          if(angle === '#Vertical'){
            this.reverseMoveX(velocity,directionX,place);
          }
          else if(angle === '#Horizon'){
            ;
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
          }
        }
        else if(place === '#RightTop'){
          if(angle === '#Vertical'){
            this.reverseMoveX(velocity,directionX,place);
          }
          else if(angle === '#Horizon'){
            this.reverseMoveY(velocity,directionY,place);
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
            this.reverseMoveY(velocity,directionY,place);
          }
        }
        else if(place === '#Bottom'){
          if(angle === '#Vertical'){
            ;
          }
          else if(angle === '#Horizon'){
            this.reverseMoveY(velocity,directionY,place);
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
            this.reverseMoveY(velocity,directionY,place);
          }
        }
        else if(place === '#Just'){
          ;
        }
        else if(place === '#Top'){
          if(angle === '#Vertical'){
            ;
          }
          else if(angle === '#Horizon'){
            this.reverseMoveY(velocity,directionY,place);
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveY(velocity,directionY,place);
          }
        }
        else if(place === '#LeftBottom'){
          if(angle === '#Vertical'){
            this.reverseMoveX(velocity,directionX,place);
          }
          else if(angle === '#Horizon'){
            this.reverseMoveY(velocity,directionY,place);
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
            this.reverseMoveY(velocity,directionY,place);
          }
        }
        else if(place === '#Left'){
          if(angle === '#Vertical'){
            this.reverseMoveX(velocity,directionX,place);
          }
          else if(angle === '#Horizon'){
            ;
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
          }
        }
        else if(place === '#LeftTop'){
          if(angle === '#Vertical'){
            this.reverseMoveX(velocity,directionX,place);
          }
          else if(angle === '#Horizon'){
            this.reverseMoveY(velocity,directionY,place);
          }
          else if(angle === '#Diagonal'){
            this.reverseMoveX(velocity,directionX,place);
            this.reverseMoveY(velocity,directionY,place);
          }
        }
      }
      commands.eventKind = '#Cross';
      self.notifyEvent(commands);
    },
    reverseMoveX: function(velocity,directionX,place){
      if(directionX === '#OneWayPeerStop'){
        this.reverseX(velocity);
      }
      else if(directionX === '#Opposite'){
        this.reverseX(velocity);
      }
      else if(directionX === '#Same'){
        if(velocity.x < 0){
          if((place === '#LeftTop')||(place === '#Left')||(place === '#LeftBottom')){
            this.reverseX(velocity);
          }
        }
        else if(velocity.x > 0){
          if((place === '#RightTop')||(place === '#Right')||(place === '#RightBottom')){
            this.reverseX(velocity);
          }
        }
      }
    },
    reverseMoveY: function(velocity,directionY,place){
      if(directionY === '#OneWayPeerStop'){
        this.reverseY(velocity);
      }
      else if(directionY === '#Opposite'){
        this.reverseY(velocity);
      }
      else if(directionY === '#Same'){
        if(velocity.y < 0){
          if((place === '#RightTop')||(place === '#Top')||(place === '#LeftTop')){
            this.reverseY(velocity);
          }
        }
        else if(velocity.y > 0){
          if((place === '#RightBottom')||(place === '#Bottom')||(place === '#LeftBottom')){
            this.reverseY(velocity);
          }
        }
      }
    },
    reverseX: function(velocity){
      velocity.x = -1 * velocity.x;
    },
    reverseY: function(velocity){
      velocity.y = -1 * velocity.y;
    },
    gone: function(self){
      const projections = self.params.shape.projections;
      if(projections === undefined){
        return;
      }
      const cross = projections.cross;
      if(cross === undefined){
        return;
      }
      cross.Remove(self);
      this.removeProjections(self,projections,cross);
      self.notifyEvent({eventKind:'#Gone'});
    },
    moveBoundary: function(self){
      const moves = self.params.shape.moves;
      if(moves !== undefined){
        const info = this.isBoundary(self);
        if(info !== false){
          const velocity = moves.velocity;
          moves.boundary = ZTIMES.LIB.SetValue('#Gone',moves.boundary);
          const boundary = moves.boundary;
          const infoX = info.x;
          const infoY = info.y;
          if(boundary === '#Reverse'){
            if((infoX === '#OverLeft')||(infoX === '#TouchLeft')||(infoX === '#OverRight')||(infoX === '#TouchRight')){
              this.reverseX(velocity);
            }
            if((infoY === '#OverTop')||(infoY === '#TouchTop')||(infoY === '#OverBottom')||(infoY === '#TouchBottom')){
              this.reverseY(velocity);
            }
          }
          else if(boundary === '#ReverseBottomGone'){
            if(infoY === '#OverBottom'){
              this.gone(self);
            }
            if((infoX === '#OverLeft')||(infoX === '#TouchLeft')||(infoX === '#OverRight')||(infoX === '#TouchRight')){
              this.reverseX(velocity);
            }
            if((infoY === '#OverTop')||(infoY === '#TouchTop')){
              this.reverseY(velocity);
            }
          }
          else if(boundary === '#SideWarp'){
            if(infoX === '#OverLeft'){
              self.params.shape.x = info.layerRight - self.params.shape.w;
            }
            if(infoX === '#OverRight'){
              self.params.shape.x = 0;
            }
            if((infoY === '#OverTop')||(infoY === '#TouchTop')||(infoY === '#OverBottom')||(infoY === '#TouchBottom')){
              this.reverseY(velocity);
            }
          }
          else if(boundary === '#Gone'){
            if((infoX === '#OverLeft')||(infoX === '#OverRight')||(infoY === '#OverTop')||(infoY === '#OverBottom')){
              this.gone(self);
            }
          }
        }
      }
    },
    isBoundary: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const layerX = 0;
        const layerY = 0;
        const layerW = structObjLayer.params.shape.w;
        const layerH = structObjLayer.params.shape.h;
        const layerRight = layerX+layerW;
        const layerBottom = layerY+layerH;
        const x = self.params.shape.x;
        const y = self.params.shape.y;
        const w = self.params.shape.w;
        const h = self.params.shape.h;
        const info = {
          layerLeft:layerX,
          layerTop:layerY,
          layerRight:layerRight,
          layerBottom:layerBottom,
        };
        if(x+w < layerX){
          info.x = '#OverLeft';
        }
        else if(x <= layerX){
          info.x = '#TouchLeft';
        }
        else if(x > layerRight){
          info.x = '#OverRight';
        }
        else if(x+w >= layerRight){
          info.x = '#TouchRight';
        }
        if(y+h < layerY){
          info.y = '#OverTop';
        }
        else if(y <= layerY){
          info.y = '#TouchTop';
        }
        else if(y > layerBottom){
          info.y = '#OverBottom';
        }
        else if(y+h >= layerBottom){
          info.y = '#TouchBottom';
        }
        if((info.x !== undefined)||(info.y !== undefined)){
          return info;
        }
      }
      return false;
    },
  },
  DOMLAYER: {
    getDomParent: function(self){
      const params = self.params;
      const structObjParent = params.parent_Link;
      if(structObjParent === undefined){
        return ZTIMES.SCREEN.domRoot;
      }
      else{
        if(structObjParent.params.primitiveKind === '#Layer'){
          return ZTIMES.SCREEN.domRoot;
        }
        else{
          return structObjParent.params.dom;
        }
      }
    },
    CreateDom: function(self){
      const params = self.params;
      const doms = params.doms;
      if(params.structObjKind === '#Struct'){}
      else if(params.structObjKind === '#Obj'){
        const domParent = this.getDomParent(self);
        if(doms === undefined){
          params.dom = document.createElement('div');
          params.dom.id = params.name;
          params.dom.style.zIndex = params.zIndex;
          params.dom.style.position = 'absolute';
          params.dom.style.left = ZTIMES.LIB.ToPx(params.shape.x);
          params.dom.style.top = ZTIMES.LIB.ToPx(params.shape.y);
          params.dom.width = params.shape.w;
          params.dom.height = params.shape.h;
          domParent.appendChild(params.dom);
        }
        else{
          const tag = doms.tag;
          params.dom = document.createElement(tag);
          const attrs = doms.attrs;
          for(let [key,value] of Object.entries(attrs)){
            params.dom.setAttribute(key,value);
          }
          params.dom.id = params.name;
          params.dom.style.position = 'relative';
          params.dom.style.left = ZTIMES.LIB.ToPx(params.shape.x);
          params.dom.style.top = ZTIMES.LIB.ToPx(params.shape.y);
          domParent.appendChild(params.dom);
          const isLineBreak = doms.isLineBreak;
          if(isLineBreak === true){
            const domBr = document.createElement('br');
            domParent.appendChild(domBr);
          }
        }
      }
    },
  },
  MOVE: {
    DEF:{
      ModBase:10,
      MsecPolling:10,
    },
    moves: {},
    AddMove: function(self){
      const name = self.params.name;
      this.moves[name] = self;
    },
    RemoveMove: function(self){
      const name = self.params.name;
      delete this.moves[name];
    },
    timer: undefined,
    Animate: function(){
      const it = this;
      this.timer = setInterval((it)=>{
        it.animate(it);
      },ZTIMES.SCREEN.MOVE.DEF.MsecPolling,it);
    },
    animate: function(it){
      const moveList = [];
      for(let [name,self] of Object.entries(it.moves)){
        const obj = ZTIMES.SCREEN.GetStructObj(name);
        obj.MoveUpdatePos();
        moveList.push(obj);
      }
      for(let [name,self] of Object.entries(it.moves)){
        const obj = ZTIMES.SCREEN.GetStructObj(name);
        obj.MoveEraceLast();
      }
      for(let [name,self] of Object.entries(it.moves)){
        const obj = ZTIMES.SCREEN.GetStructObj(name);
        obj.MoveRedraw();
      }
      for(let [name,cross] of Object.entries(it.crosses)){
        const crossPairList = cross.GetCrossPairList(moveList);
        crossPairList.map((crossPair)=>{
          crossPair.self.MoveCollision({
            crossKind:crossPair.crossKind,
            peer:crossPair.peer,
            collisions:crossPair.collisions,
          });
        });
      }
      for(let [name,self] of Object.entries(it.moves)){
        const obj = ZTIMES.SCREEN.GetStructObj(name);
        obj.MoveBoundary();
      }
    },
    StopAnimate: function(){
      clearInterval(this.timer);
    },
    crosses: {},
    AddCross: function(name){
      const cross = new this.CROSS();
      this.crosses[name] = cross;
      return cross;
    },
    GetCross: function(name){
      return this.crosses[name];
    },
    CROSS: function(){
      this.values = new ZTIMES.LIB.VALUES();
      this.enterPairLists = [];
    },
  },
};
ZTIMES.SCREEN.STRUCTOBJ.prototype = {
  init: function(params){
    ZTIMES.SCREEN.DebugCheckStructObj(params.name);
    this.params = this.mergeParams(params);
    this.initParams();
    this.setup();if(this.params.inInvalid){return;};
    this.addChildren();
    this.addParents();
  },
  mergeParams: function(params){
    let paramsTemp = {};
    if(params.merge_Link !== undefined){
      paramsTemp = ZTIMES.LIB.Override({
        base:paramsTemp,
        addition:params.merge_Link.params,
      });
    }
    if(params.mergeList_Link !== undefined){
      params.mergeList_Link.map((merge_Link)=>{
        paramsTemp = ZTIMES.LIB.Override({
          base:paramsTemp,
          addition:merge_Link.params,
        });
      });
    }
    const paramsOut = ZTIMES.LIB.Override({
      base:paramsTemp,
      addition:params,
    });
    if(paramsOut.merge_Link !== undefined){
      delete paramsOut.merge_Link;
    }
    if(paramsOut.mergeList_Link !== undefined){
      delete paramsOut.mergeList_Link;
    }
    return paramsOut;
  },
  initParams: function(){
    this.setLayer_Link();
    ZTIMES.GRID.VerifyShape(this.params);
  },
  setLayer_Link: function(){
    if(this.params.primitiveKind === '#Element'){
      const structObjLayer = ZTIMES.SCREEN.ELEMENT.GetLayer(this);
      if(structObjLayer !== undefined){
        this.params.layer_Link = structObjLayer;
      }
    }
  },
  setup: function(){
    if(this.params.structObjKind === '#Obj'){
      this.notifyEvent({eventKind:'#Setup'});if(this.params.inInvalid){return;};
      this.notifyEvent({eventKind:'#Setup2'});if(this.params.inInvalid){return;};
      this.notifyEvent({eventKind:'#Setup3'});if(this.params.inInvalid){return;};
    }
    const self = this;
    const primitiveKind = this.params.primitiveKind;
    const structObjKind = this.params.structObjKind;
    if(structObjKind === '#Obj'){
      if(primitiveKind === '#Layer'){
        this.setupLayerObj(self);
      }
      else if(primitiveKind === '#Element'){
        this.setupElementObj(self);
      }
      else if(primitiveKind === '#DomNode'){
        this.setupDomNodeObj(self);
      }
    }
    ZTIMES.GRID.LogOut(this.params);
  },
  notifyEvent: function(commands){
    const eventKind = commands.eventKind;
    const events = this.params.events;
    if(events !== undefined){
      const func = events[eventKind];
      if(func !== undefined){
        func(this,commands);
      }
    }
  },
  setupLayerObj: function(self){
    this.setLayerOffset(self);
    ZTIMES.SCREEN.LAYER.CreateDom(self);
    ZTIMES.SCREEN.LAYER.CreateEvent(self);
    self.params.visible = this.getParentVisibleR(self);
    ZTIMES.SCREEN.LAYER.setDomVisible(this,this.params.visible);
    if(self.params.showKind === '#Original'){
      ;
    }
    else{
      ZTIMES.SCREEN.LAYER.Show(self);
    }
  },
  setupElementObj: function(self){
    ZTIMES.SCREEN.ELEMENT.Create(self);
    if(self.params.showKind === '#Original'){
      ;
    }
    else{
      if(this.params.visible === '#Hide'){
        ZTIMES.SCREEN.ELEMENT.erase(self);
      }
      else{
        ZTIMES.SCREEN.ELEMENT.Show(self);
      }
    }
  },
  setupDomNodeObj: function(self){
    this.setLayerOffset(self);
    ZTIMES.SCREEN.DOMLAYER.CreateDom(self);
    self.params.visible = this.getParentVisibleR(self);
    ZTIMES.SCREEN.LAYER.setDomVisible(self,self.params.visible);
  },
  setLayerOffset: function(self){
    const structObjParent = self.params.parent_Link;
    if(structObjParent !== undefined){
      const primitiveKind = structObjParent.params.primitiveKind;
      if(primitiveKind === '#Layer'){
        const paramsParent = structObjParent.params;
        const paramsSelf = self.params;
        if((paramsParent.shape === undefined)||
           (paramsSelf.shape === undefined)){
          return;
        }
        paramsSelf.shape.x += paramsParent.shape.x;
        paramsSelf.shape.y += paramsParent.shape.y;
      }
    }
  },
  getParentVisibleR: function(self){
    if(self.params.visible === undefined){
      const structObjParent = self.params.parent_Link;
      if(structObjParent === undefined){
        return '#Show';
      }
      else{
        return this.getParentVisibleR(structObjParent);
      }
    }
    else{
      return self.params.visible;
    }
  },
  addChildren: function(){
    const children = this.params.children;
    if(children !== undefined){
      const name = this.params.name;
      const structObjKind = this.params.structObjKind;
      const zIndex = this.params.zIndex;
      for(let [key,value] of Object.entries(children)){
        const childName = name+' '+key;
        value.name = childName;
        value.structObjKind = structObjKind;
        value.parent_Link = this;
        value.zIndex = zIndex+1;
        ZTIMES.SCREEN.addStructObj(value);
      }
    }
  },
  addParents: function(){
    const structObjChild = this.params.child_Link;
    if(structObjChild !== undefined){
      const parentName = this.params.name;
      structObjChild.params.parents = ZTIMES.LIB.SetValue({},structObjChild.params.parents);
      structObjChild.params.parents[parentName] = {
        parent_Link:this,
      };
    }
  },
  Redraw: function(){
    const self = this;
    if(self.params.primitiveKind === '#Element'){
      if(self.params.showKind === '#Original'){
        ;
      }
      else{
        if(self.params.path2D === undefined){
          this.setup();if(self.params.inInvalid){return;};
          this.addChildren();
          this.addParents();
        }
      }
    }
    this.notifyEvent({eventKind:'#Redraw'});
    if(self.params.primitiveKind === '#Element'){
      if(self.params.showKind === '#Original'){
        ;
      }
      else{
        ZTIMES.SCREEN.ELEMENT.Redraw(self);
      }
    }
  },
  Erase: function(){
    const self = this;
    ZTIMES.SCREEN.ELEMENT.erase(self);
  },
  Show: function(){
    const self = this;
    ZTIMES.SCREEN.ELEMENT.Show(self);
  },
  InitProjections: function(cross){
    const self = this;
    ZTIMES.SCREEN.ELEMENT.initProjections(self,cross);
    const projections = ZTIMES.SCREEN.ELEMENT.updateProjections(self);
    return projections;
  },
  MoveUpdatePos: function(){
    const self = this;
    if(self.params.visible === '#Hide'){
      return;
    }
    ZTIMES.SCREEN.ELEMENT.UpdatePos(self);
  },
  MoveEraceLast: function(){
    const self = this;
    if(self.params.visible === '#Hide'){
      return;
    }
    ZTIMES.SCREEN.ELEMENT.eraseLast(self);
  },
  MoveRedraw: function(){
    const self = this;
    if(self.params.visible === '#Hide'){
      return;
    }
    ZTIMES.SCREEN.ELEMENT.create2D(self);
    ZTIMES.SCREEN.ELEMENT.Show(self);
  },
  MoveCollision: function(commands){
    const self = this;
    if(self.params.visible === '#Hide'){
      return;
    }
    ZTIMES.SCREEN.ELEMENT.moveCollision(self,commands);
  },
  MoveBoundary: function(){
    const self = this;
    if(self.params.visible === '#Hide'){
      return;
    }
    ZTIMES.SCREEN.ELEMENT.moveBoundary(self);
  },
};
ZTIMES.SCREEN.MOVE.CROSS.prototype = {
  Add: function(obj){
    this.setupObj(obj);
    obj.InitProjections(this);
    ZTIMES.SCREEN.MOVE.AddMove(obj);
  },
  Remove: function(obj){
    ZTIMES.SCREEN.MOVE.RemoveMove(obj);
  },
  setupObj: function(obj){
    if(obj.params.shape.moves === undefined){
      obj.params.shape.moves = {};
    }
    if(obj.params.shape.moves.velocity === undefined){
      obj.params.shape.moves.velocity = {x:0,y:0};
    }
    if(obj.params.shape.moves.collisionCenterRadius === undefined){
      const shape = obj.params.shape;
      obj.params.shape.moves.collisionCenterRadius = Math.max(shape.w,shape.h) / 2;
    }
  },
  AddValueLists: function(key,obj){
    this.values.Add(key,obj);
  },
  RemoveValueLists: function(key,obj){
    this.values.Remove(key,obj);
  },
  GetCrossPairList: function(selfList){
    const it = this;
    let selfMin = undefined;
    let selfMax = undefined;
    selfList.map((self)=>{
      const rangeMin = self.params.shape.projections.rangeMin;
      if(selfMin === undefined){
        selfMin = rangeMin;
      }
      else if(rangeMin < selfMin){
        selfMin = rangeMin;
      }
      const rangeMax = self.params.shape.projections.rangeMax;
      if(selfMax === undefined){
        selfMax = rangeMax;
      }
      else if(selfMax < rangeMax){
        selfMax = rangeMax;
      }
    });
    const rangeObjs = {};
    for(let cnt=selfMin;cnt<=selfMax;cnt+=1){
      const key = cnt;
      this.values.Act(key,(obj)=>{
        const name = obj.params.name;
        if(rangeObjs[name] === undefined){
          rangeObjs[name] = obj;
        }
      });
    }
    const crossPairList = [];
    for(let [crossName,enterPair] of Object.entries(this.enterPairLists)){
      const self = enterPair.self;
      const peer = enterPair.peer;
      const selfShape = self.params.shape;
      const peerShape = peer.params.shape;
      const collisions = it.getCollisons(crossName,selfShape,peerShape);
      if(collisions === false){
        const crossPair = {crossKind:'#Leave',self:self,peer:peer,collisions:collisions};
        crossPairList.push(crossPair);
        delete it.enterPairLists[crossName];
      }
    }
    selfList.map((self)=>{
      const selfName = self.params.name;
      const selfShape = self.params.shape;
      for(let [name,peer] of Object.entries(rangeObjs)){
        if(name === selfName){
          ;
        }
        else{
          const peerName = peer.params.name;
          const peerShape = peer.params.shape;
          const crossName = selfName+':'+peerName;
          if(it.enterPairLists[crossName] === undefined){
            const collisions = it.getCollisons(crossName,selfShape,peerShape);
            if(collisions !== false){
              const crossPair = {crossKind:'#Enter',self:self,peer:peer,collisions:collisions};
              crossPairList.push(crossPair);
              it.enterPairLists[crossName] = crossPair;
            }
          }
        }
      }
    });
    return crossPairList;
  },
  getCollisons: function(crossName,selfShape,peerShape){
    if(selfShape.isCircle === true){
      if(peerShape.isCircle === true){
        return this.isCollisionCircleCircle(crossName,selfShape,peerShape);
      }
      else{
        return this.isCollisionCircleRect(crossName,selfShape,peerShape);
      }
    }
    else{
      if(peerShape.isCircle === true){
        return this.isCollisionCircleRect(crossName,peerShape,selfShape);
      }
      else{
        return this.isCollisionRectRect(crossName,selfShape,peerShape);
      }
    }
  },
  isCollisionCircleCircle: function(crossName,selfShape,peerShape){
    const diffCenterX = peerShape.centerX - selfShape.centerX;
    const diffCenterY = peerShape.centerY - selfShape.centerY;
    const diffCenterX2 = diffCenterX*diffCenterX;
    const diffCenterY2 = diffCenterY*diffCenterY;
    const diffDiagonal2 = diffCenterX2+diffCenterY2;
    const diffRadius = selfShape.radius+peerShape.radius;
    const diffRadius2 = diffRadius*diffRadius;
    if(diffDiagonal2 <= diffRadius2){
      const place = this.getPlace(crossName,diffCenterX,diffCenterY);
      const angle = this.getAngle(crossName,place,selfShape,peerShape);
      const selfVelocityX = selfShape.moves.velocity.x;
      const selfVelocityY = selfShape.moves.velocity.y;
      const peerVelocityX = peerShape.moves.velocity.x;
      const peerVelocityY = peerShape.moves.velocity.y;
      const directionX = this.getCollisionDirection(crossName,selfVelocityX,peerVelocityX);
      const directionY = this.getCollisionDirection(crossName,selfVelocityY,peerVelocityY);
      return {shapeShape:'#CircleCircle',place:place,angle:angle,directionX:directionX,directionY:directionY};
    }
    else{
      return false;
    }
  },
  isCollisionRectRect: function(crossName,selfShape,peerShape){
    const ret = this.isCollisionRectRectBetween(crossName,selfShape,peerShape);
    if(ret === true){
      const diffCenterX = peerShape.centerX - selfShape.centerX;
      const diffCenterY = peerShape.centerY - selfShape.centerY;
      const place = this.getPlace(crossName,diffCenterX,diffCenterY);
      const angle = this.getAngle(crossName,place,selfShape,peerShape);
      const selfVelocityX = selfShape.moves.velocity.x;
      const selfVelocityY = selfShape.moves.velocity.y;
      const peerVelocityX = peerShape.moves.velocity.x;
      const peerVelocityY = peerShape.moves.velocity.y;
      const directionX = this.getCollisionDirection(crossName,selfVelocityX,peerVelocityX);
      const directionY = this.getCollisionDirection(crossName,selfVelocityY,peerVelocityY);
      return {shapeShape:'#RectRect',place:place,angle:angle,directionX:directionX,directionY:directionY};
    }
    else{
      return false;
    }
  },
  isCollisionRectRectBetween: function(crossName,selfShape,peerShape){
    if(ZTIMES.LIB.Between(selfShape.x,peerShape.x,peerShape.x+peerShape.w)===true){
      if(ZTIMES.LIB.Between(selfShape.y,peerShape.y,peerShape.y+peerShape.h)===true){
        return true;
      }
      if(ZTIMES.LIB.Between(selfShape.y+selfShape.h,peerShape.y,peerShape.y+peerShape.h)===true){
        return true;
      }
    }
    if(ZTIMES.LIB.Between(selfShape.x+selfShape.w,peerShape.x,peerShape.x+peerShape.w)===true){
      if(ZTIMES.LIB.Between(selfShape.y,peerShape.y,peerShape.y+peerShape.h)===true){
        return true;
      }
      if(ZTIMES.LIB.Between(selfShape.y+selfShape.h,peerShape.y,peerShape.y+peerShape.h)===true){
        return true;
      }
    }

    if(ZTIMES.LIB.Between(peerShape.x,selfShape.x,selfShape.x+selfShape.w)===true){
      if(ZTIMES.LIB.Between(peerShape.y,selfShape.y,selfShape.y+selfShape.h)===true){
        return true;
      }
      if(ZTIMES.LIB.Between(peerShape.y+peerShape.h,selfShape.y,selfShape.y+selfShape.h)===true){
        return true;
      }
    }
    if(ZTIMES.LIB.Between(peerShape.x+peerShape.w,selfShape.x,selfShape.x+selfShape.w)===true){
      if(ZTIMES.LIB.Between(peerShape.y,selfShape.y,selfShape.y+selfShape.h)===true){
        return true;
      }
      if(ZTIMES.LIB.Between(peerShape.y+peerShape.h,selfShape.y,selfShape.y+selfShape.h)===true){
        return true;
      }
    }
    return false;
  },
  isCollisionCircleRect: function(crossName,circleShape,rectShape){
    return this.isCollisionRectRect(crossName,circleShape,rectShape); //@
  },
  getPlace: function(crossName,diffCenterX,diffCenterY){
    if(diffCenterX>0 && diffCenterY>0){
      return '#RightBottom';
    }
    if(diffCenterX>0 && diffCenterY===0){
      return '#Right';
    }
    if(diffCenterX>0 && diffCenterY<0){
      return '#RightTop';
    }
    if(diffCenterX===0 && diffCenterY>0){
      return '#Bottom';
    }
    if(diffCenterX===0 && diffCenterY===0){
      return '#Just';
    }
    if(diffCenterX===0 && diffCenterY<0){
      return '#Top';
    }
    if(diffCenterX<0 && diffCenterY>0){
      return '#LeftBottom';
    }
    if(diffCenterX<0 && diffCenterY===0){
      return '#Left';
    }
    if(diffCenterX<0 && diffCenterY<0){
      return '#LeftTop';
    }
  },
  getAngle: function(crossName,place,selfShape,peerShape){
    if(place === '#Left'){
      return '#Vertical';
    }
    if(place === '#Right'){
      return '#Vertical';
    }
    if(place === '#Top'){
      return '#Horizon';
    }
    if(place === '#Bottom'){
      return '#Horizon';
    }
    if(place === '#Just'){
      return '#Diagonal';
    }
    const selfCollCenterRadius = selfShape.moves.collisionCenterRadius;
    const peerCollCenterRadius = peerShape.moves.collisionCenterRadius;
    let selfCollCenterX = 0;
    let selfCollCenterY = 0;
    let peerCollCenterX = 0;
    let peerCollCenterY = 0;
    if(place === '#LeftTop'){
      selfCollCenterX = selfShape.x + selfCollCenterRadius;
      selfCollCenterY = selfShape.y + selfCollCenterRadius;
      peerCollCenterX = peerShape.x + peerShape.w - peerCollCenterRadius;
      peerCollCenterY = peerShape.y + peerShape.h - peerCollCenterRadius;
    }
    else if(place === '#RightBottom'){
      selfCollCenterX = selfShape.x + selfShape.w - selfCollCenterRadius;
      selfCollCenterY = selfShape.y + selfShape.h - selfCollCenterRadius;
      peerCollCenterX = peerShape.x + peerCollCenterRadius;
      peerCollCenterY = peerShape.y + peerCollCenterRadius;
    }
    else if(place === '#LeftBottom'){
      selfCollCenterX = selfShape.x + selfCollCenterRadius;
      selfCollCenterY = selfShape.y + selfShape.h - selfCollCenterRadius;
      peerCollCenterX = peerShape.x + peerShape.w - peerCollCenterRadius;
      peerCollCenterY = peerShape.y + peerCollCenterRadius;
    }
    else if(place === '#RightTop'){
      selfCollCenterX = selfShape.x + selfShape.w - selfCollCenterRadius;
      selfCollCenterY = selfShape.y + selfCollCenterRadius;
      peerCollCenterX = peerShape.x + peerCollCenterRadius;
      peerCollCenterY = peerShape.y + peerShape.h - peerCollCenterRadius;
    }
    const diffCollCenterX = peerCollCenterX - selfCollCenterX;
    const diffCollCenterY = peerCollCenterY - selfCollCenterY;
    const diffCollCenterX2 = diffCollCenterX * diffCollCenterX;
    const diffCollCenterY2 = diffCollCenterY * diffCollCenterY;
    if(diffCollCenterX2 > diffCollCenterY2){
      return '#Vertical';
    }
    else if(diffCollCenterX2 < diffCollCenterY2){
      return '#Horizon';
    }
    else{
      return '#Diagonal';
    }
  },
  getCollisionDirection: function(crossName,selfVelocityXY,peerVelocityXY){
    if(selfVelocityXY === 0){
      return '#OneWaySelfStop';
    }
    if(peerVelocityXY === 0){
      return '#OneWayPeerStop';
    }
    if(selfVelocityXY<0 && peerVelocityXY<0){
      return '#Same';
    }
    if(selfVelocityXY>0 && peerVelocityXY>0){
      return '#Same';
    }
    return '#Opposite';
  },
};
