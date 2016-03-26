//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;
    private timeStart;
    private touchTime;
    private overText: egret.TextField = new egret.TextField;
    private timeText: egret.TextField = new egret.TextField;
    private touching: Boolean = true;


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.timeStart = egret.getTimer();
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/default.res.json","resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if(event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if(event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private textfield: egret.TextField;
    
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private uiLayer: eui.UILayer = new eui.UILayer();
    private createGameScene(): void {

        var sky: egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);

        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        

        
        
        //  sky.touchEnabled = true;
        // sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.timeBegin,this);
        // sky.addEventListener(egret.TouchEvent.TOUCH_END,this.timeOver,this);

        this.addChild(this.uiLayer);
        this.people();
        this.board();
        this.breadImage();
        this.breadMask();

        this.overText.text = "DEMO_0324.点击绿色区域开始测试！"
        this.overText.width = 400;
        this.addChild(this.overText);
        this.overText.textAlign = "center";
        this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
        this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;

       // this.timeText.text = "000秒";
        //this.timeText.size = 50;
       // this.addChild(this.timeText);
       // this.timeText.textAlign = "center";
       // this.timeText.x = this.stage.stageWidth - this.timeText.width >> 1;
       // this.timeText.y = this.stage.stageHeight / 4;



    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */


    /**
     * 切换描述内容
     * Switch to described content
     */


    private timeBegin(event: egret.TouchEvent) {
        this.timeStart = egret.getTimer();
        this.breadMaskImage.alpha = 0;
        console.log("触摸开始");
        egret.Tween.get(this.breadMaskImage).to({ alpha: 1 },6000,egret.Ease.circIn);
        this.timeCount();
        

    }

    private timeOver(evt: egret.TouchEvent) {
        var lastTime = this.timeStart;
        this.touchTime = egret.getTimer() - lastTime;
        console.log(this.touchTime);
      //  this.breadMaskImage.alpha = this.breadMaskImage.alpha;
        egret.Tween.pauseTweens(this.breadMaskImage);
        this.gameManager();
    }

    private gameManager() {

        switch(true) {
            case this.touchTime >= 1000 && this.touchTime < 2000:
                console.log("触摸结束，触摸时间为" + this.touchTime);
                // textField.text = "哎呀,你太心急了，你得到了一个夹生的蛋糕！"
                this.overText.text = "哎呀,你太心急了，烤箱还没热呢！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime < 1000:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "同学，你是来捣乱的吧";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 2000 && this.touchTime < 3000:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "你太心急了，面包才刚开始烘焙！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 3000 && this.touchTime < 3500:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "经过不懈的努力，你获得了五分熟的面包，打败了全国32%的面包师!";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 3500 && this.touchTime < 4100:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "经过不懈的努力，你获得了六分熟的面包，打败了全国53%的面包师";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 4100 && this.touchTime < 4500:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "经过不懈的努力，你获得了七分熟的面包，打败了全国60%的面包师";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 4500 && this.touchTime < 4800:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "经过不懈的努力，你获得了八分熟的面包，打败了全国80%的面包师！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 4800 && this.touchTime < 4950:
                console.log("触摸结束,触摸时间不为" + this.touchTime);
                this.overText.text = "天呐！经过不懈的努力，你获得了九分熟的面包，打败了全国90%的面包师！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 4950 && this.touchTime < 5050:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "简直完美，经过不懈的努力，你获得了色香味俱全的黄金面包，打败了全国99%的面包师！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 5050 && this.touchTime < 5300:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "经过你不懈的努力，你获得了略微烤糊的面包，超过了全国60%的面包师";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 5300 && this.touchTime < 6000:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "太遗憾了，面包烤的太久了，你获得了烤焦了的面包"
                //this.overText.text = "天呐！世上真的有这样的面包师，你居然做出了品质为10的绝世面包，据说，这种品质的面包已经有1000年没有出世了！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;

            case this.touchTime >= 6000:                                //&& this.touchTime < 7000:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "糟糕，烤的时间太长了，面包都快被烤成炭了！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;
/*
            case this.touchTime >= 7000:
                console.log("触摸结束,触摸时间为" + this.touchTime);
                this.overText.text = "这是什么东西？！你是故意来做焦炭的吗！";
                this.overText.x = this.stage.stageWidth - this.overText.width >> 1;
                this.overText.y = this.stage.stageHeight - this.stage.stageHeight / 5;
                break;
*/
        }


    }

    private timeCount() {
        this.touching = true;
        this.timeText.text = "touch";
    }
    
    
    
    private people() {
        var peopleImg: eui.Image = new eui.Image();
        peopleImg.source = "resource/assets/people.png";
        // peopleImg.top = 182;
        peopleImg.horizontalCenter = 0;
        peopleImg.top = window.screen.height * 0.2;
        this.uiLayer.addChild(peopleImg);
        //this.setChildIndex(peopleImg,3);
        //var peopleImg: egret.Bitmap = this.createBitmapByName("people");
        //this.addChild(peopleImg);
        //peopleImg.x = this.stage.width - peopleImg.width >> 1;
        //peopleImg.y = 182;
        //console.log("加载图片成功"+peopleImg);
    }

    private breadyposition:number;
    private board() {
        var board: eui.Image = new eui.Image();
        board.source = "resource/assets/board.png";
        board.bottom = window.screen.height * 0.1;;//118
        board.horizontalCenter = 0;
        // var boardImg: egret.Bitmap = this.createBitmapByName("board");
        // this.addChild(boardImg);
        // board.x = this.stage.width - board.width >> 1;
        this.uiLayer.addChild(board);

        board.touchEnabled = true;
        board.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.timeBegin,this);
        board.addEventListener(egret.TouchEvent.TOUCH_END,this.timeOver,this);
        
        //  this.setChildIndex(board,4);
        console.log("yijiazai");
        //boardImg.y = 489.5;
       this.breadyposition= board.y;
        
    }
    
    private breadImage() {
        var breadImage: egret.Bitmap = new egret.Bitmap();
        breadImage = this.createBitmapByName("bread");
        this.addChild(breadImage);
        
        breadImage.x = this.stage.width - breadImage.width >> 1;
        //breadImage.y = this.breadyposition;
        breadImage.y = this.stage.height - window.screen.height * 0.7;
    }
    
     private breadMaskImage: egret.Bitmap = new egret.Bitmap();
    private breadMask (){
        
        this.breadMaskImage= this.createBitmapByName("bread_mask");
        this.addChild(this.breadMaskImage);
        this.breadMaskImage.alpha = 0;
        
        this.breadMaskImage.x = this.stage.width - this.breadMaskImage.width >> 1;
        this.breadMaskImage.y = this.stage.height - window.screen.height * 0.671;
    }
    
    
    
    
  
    
}


