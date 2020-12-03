var ZTIMES = ZTIMES || {};

ZTIMES.VIEW = {
  init: function(){
    this.createObj();
    this.startGame();
  },
  test: function(){
  },
  startGame: function(){
    const cross = ZTIMES.SCREEN.MOVE.AddCross('items');
    const ball = ZTIMES.SCREEN.GetStructObj('layerMove ball');
    const paddle = ZTIMES.SCREEN.GetStructObj('layerFloor paddle');
    cross.Add(ball);
    cross.Add(paddle);
    for(let [name,info] of Object.entries(this.enemyInfos)){
      const enemy = ZTIMES.SCREEN.GetStructObj(name);
      cross.Add(enemy);
    }
  },
  enemyInfos: {},
  numEnemyDead: 0,
  numEnemyAll: 0,
  addEnemyInfo: function(info){
    this.enemyInfos[info.name] = info;
    this.numEnemyAll += 1;
  },
  getEnemyInfo: function(name){
    const info = this.enemyInfos[name];
    return info;
  },
  createObj: function(){
    const layerShape = {
      gridX:'#Center',
      w:400,h:600,
      r:0,
    };
    const paddleY = 500;
    const clmMax = 5;
    const rowMax = 3;
    for(let clm=0;clm<clmMax;clm+=1){
      for(let row=0;row<rowMax;row+=1){
        const name = 'layerFloor enemy'+row+clm;
        const x = 20+clm*80;
        const y = 80+row*80;
        this.addEnemyInfo({name:name,x:x,y:y});
      }
    }
    const enemyParams = {
      merge_Link:ZTIMES.SCREEN.Element,
      shape:{
        w:40,h:40,
        images:{
          src:'./images/enemy.png',
          blocks:{
            x:0,y:0,w:40,h:40,
          },
        },
      },
      events:{
        '#Setup':function(self){
          ZTIMES.VIEW.enemySetup(self);
        },
        '#Cross':function(self,commands){
          ZTIMES.VIEW.enemyCross(self,commands);
        },
      },
    };

    this.layerFloor = ZTIMES.SCREEN.AddObj({
      name:'layerFloor',
      merge_Link:ZTIMES.SCREEN.Layer,
      shape:layerShape,
      colors:ZTIMES.BUILTIN.COLORS.TRANSPARENT,
      children:{
        'enemy00':enemyParams,
        'enemy01':enemyParams,
        'enemy02':enemyParams,
        'enemy03':enemyParams,
        'enemy04':enemyParams,
        'enemy10':enemyParams,
        'enemy11':enemyParams,
        'enemy12':enemyParams,
        'enemy13':enemyParams,
        'enemy14':enemyParams,
        'enemy20':enemyParams,
        'enemy21':enemyParams,
        'enemy22':enemyParams,
        'enemy23':enemyParams,
        'enemy24':enemyParams,
        'paddle':{
          merge_Link:ZTIMES.SCREEN.Element,
          shape:{
            gridX:-2,
            y:paddleY,
            w:74,h:38,
            images:{
              src:'./images/paddle.png',
            },
          },
        },
      },
    });
    this.layerMove = ZTIMES.SCREEN.AddObj({
      name:'layerMove',
      merge_Link:ZTIMES.SCREEN.Layer,
      shape:layerShape,
      colors:ZTIMES.BUILTIN.COLORS.TRANSPARENT,
      children:{
        'ball':{
          merge_Link:ZTIMES.SCREEN.Element,
          shape:{
            gridX:0,gridY:30,
            w:40,h:23,
            images:{
              src:'./images/ball.png',
            },
            moves:{
              velocity:{x:1,y:-1},
              boundary:'#ReverseBottomGone',
            },
          },
          events:{
            '#Gone':function(self,commands){
              ZTIMES.VIEW.endGame();
            },
          },
        },
      },
    });
    this.layerUI = ZTIMES.SCREEN.AddObj({
      name:'layerUI',
      merge_Link:ZTIMES.SCREEN.Layer,
      shape:layerShape,
      colors:ZTIMES.BUILTIN.COLORS.TRANSPARENT,
      children:{
        'btnReload':{
          merge_Link:ZTIMES.BUILTIN.Button,
          visible:'#Hide',
          shape:{
            gridX:-3,gridW:6,gridH:3,
            y:paddleY-80,
            r:5,
            offsetX:5,
          },
          text:'Reload',
          font:'20px Times New Roman',
          events:{
            '#Pressed':function(self,commands){
              document.location.reload();
            },
          },
        },
        'btnLeft':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:-10,gridW:4,gridH:4,
            y:paddleY+40,
            r:5,
            offsetX:5,
          },
          colors:{font:'DarkGray',background:'LightGray',globalAlpha:0.3},
          text:'＜',
          font:'20px Times New Roman',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.VIEW.paddleMove('#Left');
            },
          },
        },
        'btnRight':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:5,gridW:4,gridH:4,
            y:paddleY+40,
            r:5,
            offsetX:5,
          },
          colors:{font:'DarkGray',background:'LightGray',globalAlpha:0.3},
          text:'＞',
          font:'20px Times New Roman',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.VIEW.paddleMove('#Right');
            },
          },
        },

      },
    });
  },
  enemySetup: function(self){
    const info = ZTIMES.VIEW.getEnemyInfo(self.params.name);
    self.params.shape.x = info.x;
    self.params.shape.y = info.y;
  },
  enemyCross: function(self,commands){
    if(commands.crossKind === '#Enter'){
      const selfName = self.params.name;
      ZTIMES.SCREEN.SetDomVisible(selfName,'#Hide');
      this.numEnemyDead += 1;
      if(this.numEnemyDead >= this.numEnemyAll){
        this.endGame();
      }
    }
  },
  endGame: function(){
    ZTIMES.SCREEN.MOVE.StopAnimate();
    const cross = ZTIMES.SCREEN.MOVE.GetCross('items');
    const ball = ZTIMES.SCREEN.GetStructObj('layerMove ball');
    const paddle = ZTIMES.SCREEN.GetStructObj('layerFloor paddle');
    cross.Remove(ball);
    cross.Remove(paddle);
    for(let [name,info] of Object.entries(this.enemyInfos)){
      const enemy = ZTIMES.SCREEN.GetStructObj(name);
      cross.Remove(enemy);
    }
    ZTIMES.SCREEN.SetDomVisible('layerUI btnReload','#Show');
  },
  paddleMove: function(direction){
    const moveX = 20;
    const layerShape = ZTIMES.VIEW.layerFloor.params.shape;
    const paddle = ZTIMES.SCREEN.GetStructObj('layerFloor paddle');
    const paddleShape = paddle.params.shape;
    if(direction === '#Left'){
      if(paddleShape.x-moveX >= 0){
        paddle.Erase();
        paddleShape.x -= moveX;
        paddle.Show();
      }
    }
    else if(direction === '#Right'){
      if(paddleShape.x+paddleShape.w+moveX <= 0+layerShape.w){
        paddle.Erase();
        paddleShape.x += moveX;
        paddle.Show();
      }
    }
  },

};

ZTIMES.RUN = {
  debug: function(){
    ZTIMES.SCREEN.DebugSetStructObj([
      // 'layerMove ball',
      // 'layerFloor paddle',
      // 'layerUI btnRight',
    ],function(name){
      console.log('[Debug] '+name);      //BreakPoint here!
    });
  },
  init: function(){
    ZTIMES.CRYPTOGRAPH.init();
    ZTIMES.SECRETDB.init();
    ZTIMES.GRID.init();
    ZTIMES.SCREEN.init();
    ZTIMES.BUILTIN.init();
    ZTIMES.VIEW.init();
  },
  test: function(){
    ZTIMES.SCREEN.test();
    ZTIMES.VIEW.test();
  },
};
ZTIMES.RUN.debug();
ZTIMES.RUN.init();
ZTIMES.RUN.test();
