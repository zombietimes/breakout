var ZTIMES = ZTIMES || {};

ZTIMES.BUILTIN = {
  init: function(){
    this.createBuiltIn();
  },
  test: function(){
  },
  createBuiltIn: function(){
    ZTIMES.BUILTIN.Area = ZTIMES.SCREEN.AddStruct({
      name:'Area',
      merge_Link:ZTIMES.SCREEN.Element,
      events:{
        '#Setup':function(self){
          const shape = self.params.shape;
          shape.centerX = shape.x+shape.w/2;
          shape.centerY = shape.y+shape.h/2;
          shape.left = shape.x;
          shape.top = shape.y;
          shape.right = shape.x+shape.w;
          shape.bottom = shape.y+shape.h;
        },
      },
    });
    ZTIMES.BUILTIN.Label = ZTIMES.SCREEN.AddStruct({
      name:'Label',
      merge_Link:ZTIMES.SCREEN.Element,
      shape:{
        gridW:4,gridH:2,
        r:0
      },
      text:'',
      font:'16px Times New Roman',
    });
    ZTIMES.BUILTIN.Button = ZTIMES.SCREEN.AddStruct({
      name:'Button',
      merge_Link:ZTIMES.SCREEN.Element,
      shape:{
        w:60,h:30,r:5,    //for circle
      },
      text:'',
      font:'16px Times New Roman',
      colors:ZTIMES.BUILTIN.COLORS.WHITE_GRAY_,
      events:{
        '#Setup':function(self){},
        '#Pressed':function(self,coodinates){
          console.log('[Button] #Pressed');
        },
      },
    });
    ZTIMES.BUILTIN.Dot = ZTIMES.SCREEN.AddStruct({
      name:'Dot',
      merge_Link:ZTIMES.SCREEN.Element,
      shape:{
        radius:1,
      },
      colors:ZTIMES.BUILTIN.COLORS.WHITE_GREEN_,
      events:{
        '#Setup':function(self){
          self.params.showKind = '#Original';
          const layer = ZTIMES.SCREEN.ELEMENT.GetLayer(self);
          const color = self.params.colors.background;
          const x = self.params.shape.x;
          const y = self.params.shape.y;
          ZTIMES.BUILTIN.DOT.ShowDot(layer,color,x,y);
        },
      },
    });
    ZTIMES.BUILTIN.Curve = ZTIMES.SCREEN.AddStruct({
      name:'Curve',
      merge_Link:ZTIMES.SCREEN.Element,
      shape:{
        nameDotS:undefined,
        nameDotE:undefined,
        nameDotA:undefined,
        nameDotB:undefined,
      },
      colors:ZTIMES.BUILTIN.COLORS.WHITE_GREEN_,
      events:{
        '#Setup':function(self){
          const layer = ZTIMES.SCREEN.ELEMENT.GetLayer(self);
          const color = self.params.colors.background;
          const dotS = ZTIMES.SCREEN.GetStructObj(self.params.shape.nameDotS);
          const dotE = ZTIMES.SCREEN.GetStructObj(self.params.shape.nameDotE);
          const dotA = ZTIMES.SCREEN.GetStructObj(self.params.shape.nameDotA);
          const dotB = ZTIMES.SCREEN.GetStructObj(self.params.shape.nameDotB);
          ZTIMES.BUILTIN.CURVE.ShowCurve(
            layer,
            color,
            dotS.params.shape,
            dotE.params.shape,
            dotA.params.shape,
            dotB.params.shape
          );
        },
      },
    });
    ZTIMES.BUILTIN.Page = ZTIMES.SCREEN.AddStruct({
      name:'Page',
      merge_Link:ZTIMES.SCREEN.Element,
      page:{
        dispIndexTop:0,
        dataIndexMin:0,
        dataIndexMax:undefined,
        dispNum:undefined,
        dataLen:undefined,
        isPageMin:undefined,
        isPageMax:undefined,
        isOnly1Page:undefined,
        pageNo:undefined,
        pageNoMax:undefined,
        y:undefined,
      },
      events:{
        '#Setup2':function(self){
          ZTIMES.BUILTIN.PAGE.init(self.params.page);
        },
      },
      children:{
        'PagePrevious':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            svgs:{
              region:{svgPath:undefined,showKind:'#Transparent'},
              triangleUp:{svgPath:undefined,showKind:'#Fill',color:'Gray'},
            },
          },
          events:{
            '#Setup':function(self){
              const parent = self.params.parent_Link;
              if(parent.params.page.isOnly1Page === true){
                self.params.inInvalid = true;
                return;
              }
              self.params.inInvalid = false;
              self.params.shape.x = parent.params.shape.x;
              self.params.shape.y = parent.params.page.y;
              self.params.setSvgPath(self);
            },
            '#Pressed':function(self){
              const parent = self.params.parent_Link;
              ZTIMES.BUILTIN.PAGE.Previous(parent.params.page);
              parent.Redraw();
            },
          },
          setSvgPath: function(self){
            const x = Number(self.params.shape.x);
            const y = Number(self.params.shape.y);
            const w = Number(self.params.shape.w);
            const h = Number(self.params.shape.h);
            const left = Number(x);
            const top = Number(y);
            const right = Number(x+w);
            const bottom = Number(y+h);
            const triangleP = {x:Number(left+w/2),y:Number(top+7)};
            const triangleQ = {x:Number(left+14),y:Number(bottom-7)};
            const triangleR = {x:Number(right-14),y:Number(bottom-7)};
            const svgs = self.params.shape.svgs;
            svgs.region.svgPath = 'M'+left+' '+top +' L'+right+' '+top +' L'+right+' '+bottom +' L'+left+' '+bottom +' Z';
            svgs.triangleUp.svgPath = 'M'+triangleP.x+' '+triangleP.y +' L'+triangleQ.x+' '+triangleQ.y +' L'+triangleR.x+' '+triangleR.y +' Z';
          },
        },
        'PageLabel':{
          merge_Link:ZTIMES.BUILTIN.Label,
          shape:{
            gridW:2,gridH:1,
            offsetH:5,
          },
          text:'',
          events:{
            '#Setup':function(self){
              const parent = self.params.parent_Link;
              if(parent.params.page.isOnly1Page === true){
                self.params.inInvalid = true;
                return;
              }
              self.params.inInvalid = false;
              self.params.shape.x = parent.params.shape.w/2-self.params.shape.w/2;
              self.params.shape.y = parent.params.page.y+5;
              self.params.text = self.params.getPageText(parent);
            },
            '#Redraw':function(self){
              const parent = self.params.parent_Link;
              self.params.text = self.params.getPageText(parent);
            },
          },
          getPageText: function(parent){
            const paramsPage = parent.params.page;
            const pageText = paramsPage.pageNo + ' / ' + paramsPage.pageNoMax;
            return pageText;
          },
        },
        'PageNext':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            svgs:{
              region:{svgPath:undefined,showKind:'#Transparent'},
              triangleDown:{svgPath:undefined,showKind:'#Fill',color:'Gray'},
            },
          },
          events:{
            '#Setup':function(self){
              const parent = self.params.parent_Link;
              if(parent.params.page.isOnly1Page === true){
                self.params.inInvalid = true;
                return;
              }
              self.params.inInvalid = false;
              self.params.shape.x = parent.params.shape.x+parent.params.shape.w-self.params.shape.w;
              self.params.shape.y = parent.params.page.y;
              self.params.setSvgPath(self);
            },
            '#Pressed':function(self){
              const parent = self.params.parent_Link;
              ZTIMES.BUILTIN.PAGE.Next(parent.params.page);
              parent.Redraw();
            },
          },
          setSvgPath: function(self){
            const x = Number(self.params.shape.x);
            const y = Number(self.params.shape.y);
            const w = Number(self.params.shape.w);
            const h = Number(self.params.shape.h);
            const left = Number(x);
            const top = Number(y);
            const right = Number(x+w);
            const bottom = Number(y+h);
            const triangleP = {x:Number(left+14),y:Number(top+7)};
            const triangleQ = {x:Number(right-14),y:Number(top+7)};
            const triangleR = {x:Number(left+w/2),y:Number(bottom-7)};
            const svgs = self.params.shape.svgs;
            svgs.region.svgPath = 'M'+left+' '+top +' L'+right+' '+top +' L'+right+' '+bottom +' L'+left+' '+bottom +' Z';
            svgs.triangleDown.svgPath = 'M'+triangleP.x+' '+triangleP.y +' L'+triangleQ.x+' '+triangleQ.y +' L'+triangleR.x+' '+triangleR.y +' Z';
          },
        },
      },
      updatePage: function(self){
        const dataLen = self.params.rows.dataListList.length;
        ZTIMES.BUILTIN.PAGE.Reset(self.params.page,dataLen);
        const matrixName = self.params.name;
        const pagePreviousName = matrixName + ' PagePrevious';
        const pageLabelName = matrixName + ' PageLabel';
        const pageNextName = matrixName + ' PageNext';
        const pagePrevious = ZTIMES.SCREEN.GetStructObj(pagePreviousName);
        const pageLabel = ZTIMES.SCREEN.GetStructObj(pageLabelName);
        const pageNext = ZTIMES.SCREEN.GetStructObj(pageNextName);
        pagePrevious.Redraw();
        pageLabel.Redraw();
        pageNext.Redraw();
      },
    });
    ZTIMES.BUILTIN.Matrix = ZTIMES.SCREEN.AddStruct({
      name:'Matrix',
      mergeList_Link:[ZTIMES.SCREEN.Element,ZTIMES.BUILTIN.Page],
      clms:{
        dispIndexTop:0,
        headerLastY:0,
        dispNum:undefined,
        shapeList:undefined,
      },
      rows:{
        dispNum:undefined,
        dataListList:undefined,
      },
      colors:ZTIMES.BUILTIN.COLORS.BLACK__GRAY_GREEN,
      events:{
        '#Setup':function(self,commands){
          self.params.showKind = '#Original';
          const clmsName = self.params.name+'Clms';
          const rowsName = self.params.name+'Rows';
          const paramsClms = self.params.clms;
          const paramsRows = self.params.rows;
          const layer_Link = self.params.layer_Link;
          ZTIMES.GRID.VerifyTarget({
            name:clmsName,
            target:paramsClms,
            layer_Link:layer_Link,
          });
          ZTIMES.GRID.VerifyTarget({
            name:rowsName,
            target:paramsRows,
            layer_Link:layer_Link,
          });
          paramsClms.h += ZTIMES.BUILTIN.LINE.DEF.LineAreaH;
          paramsRows.h += ZTIMES.BUILTIN.LINE.DEF.LineAreaH;
          //Header
          const resultHeader = self.params.showHeader(self);
          const right = resultHeader.lastX;
          self.params.clms.headerLastY = resultHeader.lastY;
          //Rows
          const resultRows = self.params.showRows(self,commands);
          const bottom = resultRows.lastY;
          //Matrix
          self.params.shape.w = right-self.params.shape.x;
          self.params.shape.h = bottom-self.params.shape.y;
          //Page
          self.params.page.dispNum = paramsRows.dispNum;
          self.params.page.dataLen = paramsRows.dataListList.length;
          self.params.page.y = bottom;
        },
        '#Pressed':function(self,commands){
          const coodinates = commands.coodinates;
          const selectedRowIndex = ZTIMES.BUILTIN.MATRIX.GetSelectedRowIndex(self,coodinates);
          if(selectedRowIndex !== undefined){
            ZTIMES.BUILTIN.MATRIX.ShowSelectedRowLine(self,selectedRowIndex);
            self.params.selectedRowIndex = selectedRowIndex;
            self.params.notifySelectedRow(self);
          }
        },
        '#Redraw':function(self,commands){
          self.params.showKind = '#Original';
          self.params.showRows(self,commands);
          self.params.updatePage(self);
          if(self.params.selectedRowIndex !== undefined){
            self.params.notifySelectedRow(self);
          }
        },
        '#Selected':function(self,commands){
          console.log('dataIndex:'+commands.dataIndex);
        },
      },
      getSelectedDataIndex: function(self){
        const dataIndex = self.params.page.dispIndexTop + self.params.selectedRowIndex;
        return dataIndex
      },
      showHeader: function(self){
        const layer = ZTIMES.SCREEN.ELEMENT.GetLayer(self);
        const paramsClms = self.params.clms;
        const layer_Link = self.params.layer_Link;
        const fontColor = self.params.colors.font;
        const strokeColor = self.params.colors.stroke;
        const clmDispNum = paramsClms.dispNum;
        let lastX = ZTIMES.LIB.SetValue(0,self.params.shape.x);
        let lastY = ZTIMES.LIB.SetValue(0,self.params.shape.y);
        for(let clmIndex=0;clmIndex<clmDispNum;clmIndex+=1){
          const shape = paramsClms.shapeList[clmIndex+paramsClms.dispIndexTop];
          shape.x = lastX+paramsClms.x;
          shape.y = lastY+paramsClms.y;
          shape.h = paramsClms.h-ZTIMES.BUILTIN.LINE.DEF.LineAreaH;
          ZTIMES.SCREEN.ELEMENT.ShowTextHorizonLR({
            layer_Link:layer_Link,
            shape:shape,
            fontColor:fontColor,
            text:shape.text,
          });
          lastX += shape.w;
        }
        ZTIMES.BUILTIN.LINE.ShowBorderLine(layer,paramsClms,paramsClms.y,strokeColor);
        lastY += paramsClms.y+paramsClms.h;
        const result = {lastX:lastX,lastY:lastY};
        return result;
      },
      showRows: function(self,commands){
        const isErase = (commands.eventKind === '#Redraw') ? true : false;
        const layer = ZTIMES.SCREEN.ELEMENT.GetLayer(self);
        const paramsClms = self.params.clms;
        const paramsRows = self.params.rows;
        const paramsPage = self.params.page;
        const layer_Link = self.params.layer_Link;
        const fontColor = self.params.colors.font;
        let lastY = self.params.clms.headerLastY;
        const clmDispNum = paramsClms.dispNum;
        const dataListListLen = paramsRows.dataListList.length;
        const rowDispNum = paramsRows.dispNum;
        for(let rowIndex=0;rowIndex<rowDispNum;rowIndex+=1){
          const dataList = (rowIndex<dataListListLen) ? paramsRows.dataListList[rowIndex+paramsPage.dispIndexTop] : undefined;
          let lastX = 0;
          for(let clmIndex=0;clmIndex<clmDispNum;clmIndex+=1){
            const text = (dataList === undefined) ? '-' : dataList[clmIndex+paramsClms.dispIndexTop];
            const shape = paramsClms.shapeList[clmIndex+paramsClms.dispIndexTop];
            shape.x = lastX;
            shape.y = lastY;
            shape.h = paramsRows.h-ZTIMES.BUILTIN.LINE.DEF.LineAreaH;
            if(isErase === true){
              ZTIMES.SCREEN.ELEMENT.Erase(layer,shape);
            }
            ZTIMES.SCREEN.ELEMENT.ShowTextHorizonLR({
              layer_Link:layer_Link,
              shape:shape,
              fontColor:fontColor,
              text:text,
            });
            lastX += shape.w;
          }
          lastY += paramsRows.h;
        }
        const result = {lastY:lastY};
        return result;
      },
      notifySelectedRow: function(self){
        const dataIndex = self.params.getSelectedDataIndex(self);
        console.log('['+self.params.name+'] dataIndex:'+dataIndex);
        self.notifyEvent({eventKind:'#Selected',dataIndex:dataIndex});
      },
      reset: function(self){
        self.params.clms.dispIndexTop = 0;
        self.params.page.dispIndexTop = 0;
        ZTIMES.BUILTIN.MATRIX.EraseSelectedRowLine(self);
        self.Redraw();
      },
    });
    ZTIMES.BUILTIN.Table = ZTIMES.SCREEN.AddStruct({
      name:'Table',
      merge_Link:ZTIMES.SCREEN.Layer,
      colors:ZTIMES.BUILTIN.COLORS.BLACK__GRAY_GREEN,
      children:{
        'matrix':{
          merge_Link:ZTIMES.BUILTIN.Matrix,
        },
      },
    });
  },
  COLORS: {
    TRANSPARENT:'#Transparent',
    WHITE_GREEN_:{font:'White',background:'Green',pressedBackground:'DarkGreen'},
    WHITE_BLUE_:{font:'White',background:'Blue',pressedBackground:'DarkBlue'},
    WHITE_GRAY_:{font:'White',background:'Gray',pressedBackground:'DarkGray'},
    BLACK__GRAY_GREEN:{font:'Black',stroke:'Gray',pressedStroke:'Green'},
    BLACK__GRAY_BLUE:{font:'Black',stroke:'Gray',pressedStroke:'Blue'},
  },
  DOT: {
    ShowDot: function(layer,color,x,y){
      const orgStrokeStyle = layer.params.ctx.strokeStyle;
      layer.params.ctx.strokeStyle = color;
      layer.params.ctx.beginPath();
      layer.params.ctx.ellipse(x,y,1,1,0,0,Math.PI*2);
      layer.params.ctx.stroke();
      layer.params.ctx.strokeStyle = orgStrokeStyle;
    },
    EraseDot: function(layer,x,y){
      if((x === undefined)||(y === undefined)){
        return;
      }
      layer.params.ctx.clearRect(x-2, y-2, 4, 4);
    },
  },
  CIRCLE: {
    ShowCircleFill: function(layer,color,x,y,r){
      const orgFillStyle = layer.params.ctx.fillStyle;
      layer.params.ctx.fillStyle = color;
      layer.params.ctx.beginPath();
      layer.params.ctx.ellipse(x,y,r,r,0,0,Math.PI*2);
      layer.params.ctx.fill();
      layer.params.ctx.fillStyle = orgFillStyle;
    },
    ShowCircleStroke: function(layer,color,x,y,r){
      const orgStrokeStyle = layer.params.ctx.strokeStyle;
      layer.params.ctx.strokeStyle = color;
      layer.params.ctx.beginPath();
      layer.params.ctx.ellipse(x,y,r,r,0,0,Math.PI*2);
      layer.params.ctx.stroke();
      layer.params.ctx.strokeStyle = orgStrokeStyle;
    },
    EraseCircle: function(layer,x,y,r){
      if((x === undefined)||(y === undefined)){
        return;
      }
      const margin = 2;
      layer.params.ctx.clearRect(x-(r+margin), y-(r+margin), (r+margin)*2, (r+margin)*2);
    },
  },
  RECT: {
    EraseArea: function(layer,x,y,w,h,margin){
      if((x === undefined)||(y === undefined)||(w === undefined)||(h === undefined)){
        return;
      }
      margin = ZTIMES.LIB.SetValue(0,margin);
      layer.params.ctx.clearRect(x-margin, y-margin, w+margin*2, h+margin*2);
    },
  },
  CURVE: {
    ShowCurve: function(layer,color,dotS,dotE,dotA,dotB){
      if((dotS !== undefined)&&(dotE !== undefined)){
        if((dotA !== undefined)&&(dotB !== undefined)){
          this.showBezier3(layer,color,dotS,dotE,dotA,dotB);
        }
        else if((dotA !== undefined)&&(dotB === undefined)){
          this.showBezier2(layer,color,dotS,dotE,dotA);
        }
        else if((dotA === undefined)&&(dotB !== undefined)){
          this.showBezier2(layer,color,dotS,dotE,dotB);
        }
        else if((dotA === undefined)&&(dotB === undefined)){
          ZTIMES.BUILTIN.LINE.ShowLine(layer,color,dotS,dotE);
        }
      }
    },
    showBezier3: function(layer,color,start,end,cp1,cp2){
      const orgStrokeStyle = layer.params.ctx.strokeStyle;
      layer.params.ctx.strokeStyle = color;
      layer.params.ctx.beginPath();
      layer.params.ctx.moveTo(
        start.x,
        start.y
      );
      layer.params.ctx.bezierCurveTo(
        cp1.x,
        cp1.y,
        cp2.x,
        cp2.y,
        end.x,
        end.y
      );
      layer.params.ctx.stroke();
      layer.params.ctx.strokeStyle = orgStrokeStyle;
    },
    showBezier2: function(layer,color,start,end,cp1){
      const orgStrokeStyle = layer.params.ctx.strokeStyle;
      layer.params.ctx.strokeStyle = color;
      layer.params.ctx.beginPath();
      layer.params.ctx.moveTo(
        start.x,
        start.y
      );
      layer.params.ctx.quadraticCurveTo(
        cp1.x,
        cp1.y,
        end.x,
        end.y
      );
      layer.params.ctx.stroke();
      layer.params.ctx.strokeStyle = orgStrokeStyle;
    },
  },
  LINE: {
    DEF:{
      LineAreaH:3,
      Margin:1,
    },
    ShowLine: function(layer,color,start,end){
      const orgStrokeStyle = layer.params.ctx.strokeStyle;
      layer.params.ctx.strokeStyle = color;
      layer.params.ctx.beginPath();
      layer.params.ctx.moveTo(
        start.x,
        start.y
      );
      layer.params.ctx.lineTo(
        end.x,
        end.y
      );
      layer.params.ctx.stroke();
      layer.params.ctx.strokeStyle = orgStrokeStyle;
      // console.log('[LINE] startX:'+start.x+' startY:'+start.y+' endX:'+end.x+' endY:'+end.y);
    },
    ClearLine: function(layer,start,end){
      const lineW = end.x - start.x;
      layer.params.ctx.clearRect(
        start.x-1,
        start.y-1,
        lineW+2,
        ZTIMES.BUILTIN.LINE.DEF.LineAreaH
      );
      // console.log('[Clear] startX:'+(start.x-1));
      // console.log('[Clear] startY:'+(start.y-1));
      // console.log('[Clear] W:'+(lineW+2));
      // console.log('[Clear] H:'+ZTIMES.BUILTIN.LINE.DEF.LineAreaH);
    },
    ShowBorderLine: function(layer,shape,y,color){
      const borderPos = this.getBorderPos(layer,shape,y);
      this.ShowLine(layer,color,borderPos.dotS,borderPos.dotE);
    },
    ClearBorderLine: function(layer,shape,y){
      const borderPos = this.getBorderPos(layer,shape,y);
      this.ClearLine(layer,borderPos.dotS,borderPos.dotE);
    },
    getBorderPos: function(layer,shape,y){
      const startX = shape.x+ZTIMES.BUILTIN.LINE.DEF.Margin;
      const startY = y+shape.h-ZTIMES.BUILTIN.LINE.DEF.Margin;
      const lineW = shape.w-ZTIMES.BUILTIN.LINE.DEF.Margin*2;
      const dotS = {x:startX,y:startY};
      const dotE = {x:startX+lineW,y:startY};
      return {dotS:dotS,dotE:dotE};
    },
  },
  MATRIX: {
    ShowSelectedRowLine: function(self,selectedRowIndex){
      const oldSelectedRowIndex = self.params.selectedRowIndex;
      if(selectedRowIndex === oldSelectedRowIndex){
        return;
      }
      const layer = ZTIMES.SCREEN.ELEMENT.GetLayer(self);
      const paramsClms = self.params.clms;
      const paramsRows = self.params.rows;
      if(oldSelectedRowIndex !== undefined){
        const oldSelectedRowY = paramsRows.h * oldSelectedRowIndex + self.params.clms.headerLastY;
        ZTIMES.BUILTIN.LINE.ClearBorderLine(layer,paramsClms,oldSelectedRowY);
      }
      if(selectedRowIndex !== undefined){
        const selectedRowY = paramsRows.h * selectedRowIndex + self.params.clms.headerLastY;
        const pressedStrokeColor = self.params.colors.pressedStroke;
        ZTIMES.BUILTIN.LINE.ShowBorderLine(layer,paramsClms,selectedRowY,pressedStrokeColor);
      }
    },
    GetSelectedRowIndex: function(self,coodinates){
      const paramsRows = self.params.rows;
      const pressedY = coodinates.y;
      if(pressedY >= self.params.clms.headerLastY){
        const selectedRowIndex = parseInt((pressedY - self.params.clms.headerLastY) / paramsRows.h);
        return selectedRowIndex;
      }
      else{
        return undefined;
      }
    },
    EraseSelectedRowLine: function(self){
      const oldSelectedRowIndex = self.params.selectedRowIndex;
      const layer = ZTIMES.SCREEN.ELEMENT.GetLayer(self);
      const paramsClms = self.params.clms;
      const paramsRows = self.params.rows;
      if(oldSelectedRowIndex !== undefined){
        const oldSelectedRowY = paramsRows.h * oldSelectedRowIndex + self.params.clms.headerLastY;
        ZTIMES.BUILTIN.LINE.ClearBorderLine(layer,paramsClms,oldSelectedRowY);
      }
      self.params.selectedRowIndex = undefined;
    },
  },
  PAGE: {
    init: function(params){
      params.dataIndexMax = params.dataLen-1;
      this.update(params);
      if(params.pageNoMax <= 1){
        params.isOnly1Page = true;
      }
      else{
        params.isOnly1Page = false;
      }
    },
    Reset: function(params,dataLen){
      params.dataLen = dataLen;
      this.init(params);
    },
    update: function(params){
      params.isPageMin = this.isPageMin(params);
      params.isPageMax = this.isPageMax(params);
      params.pageNo = Math.ceil((params.dispIndexTop+params.dispNum)/params.dispNum);
      params.pageNoMax = Math.ceil(params.dataLen/params.dispNum);
    },
    isPageMin: function(params){
      if(params.dispIndexTop <= params.dataIndexMin){
        return true;
      }
      else{
        return false;
      }
    },
    isPageMax: function(params){
      if(params.dispIndexTop + params.dispNum > params.dataIndexMax){
        return true;
      }
      else{
        return false;
      }
    },
    Next: function(params){
      if(params.isOnly1Page === true){
        return;
      }
      if(this.isPageMax(params) === false){
        params.dispIndexTop += params.dispNum;
      }
      else{
        params.dispIndexTop = params.dataIndexMin;
      }
      if(this.isPageMax(params) === true){
        params.dispIndexTop = params.dataIndexMax - params.dispNum + 1;
      }
      this.update(params);
    },
    Previous: function(params){
      if(params.isOnly1Page === true){
        return;
      }
      if(this.isPageMin(params) === false){
        params.dispIndexTop -= params.dispNum;
      }
      else{
        params.dispIndexTop = params.dataIndexMax - params.dispNum + 1;
      }
      if(this.isPageMin(params) === true){
        params.dispIndexTop = params.dataIndexMin;
      }
      this.update(params);
    },
  },
}
