import {Player} from '/static/js/player/base.js';
import {GIF} from '/static/js/utils/gif.js';

export class Kyo2 extends Player {
  constructor(root,info) {
    super(root,info);

    this.init_animations(info.id);
  }

  init_animations(id) {
      let outer=this;
      let offsets=[25,0,10,-200,-25,40,-80,0];
      for(let i=0;i<8;i++) {
        let gif=GIF();
          gif.load(`/static/images/player/kyo2/${i}.gif`);

        
        this.animations.set(i, {
          gif:gif,
          frame_cnt:0, //总帧数
          frame_rate:5,//每5帧过度一次
          offset_y:offsets[i],
          loaded:false,//是否加载完成
          scale:2,  //放大多少倍
        });

        gif.onload=function() {
          let obj=outer.animations.get(i);
          obj.frame_cnt=gif.frames.length;
          console.log(`${id},${i},${obj.frame_cnt}`);
          obj.loaded=true;
          if(i===3) {
            obj.frame_rate=4;
          }
          if(i===4) {
            //obj.frame_rate=3;
            obj.frame_cnt=5;
          }
          if(i===5) {
            obj.frame_rate=5;
            obj.frame_cnt=4;
          }
          if(i==6) {
            obj.frame_rate=4;
            obj.frame_cnt=13;
          }
          if(i===7) {
            obj.frame_rate=6;
            obj.frame_cnt=9;
          }
        }


      }
  }
}