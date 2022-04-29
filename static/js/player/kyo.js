import {Player} from '/static/js/player/base.js';
import {GIF} from '/static/js/utils/gif.js';

export class Kyo extends Player {
  constructor(root,info) {
    super(root,info);
    
    this.init_animations(info.id);
  }

  init_animations(id) {
      let outer=this;
      let offsets=[0,-22,-22,-150,0,0,0,0];
      for(let i=0;i<8;i++) {
        let gif=GIF();
          gif.load(`/static/images/player/kyo/${i}.gif`);

        
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
          //console.log(`${id},${i},${obj.frame_cnt}`);
          obj.loaded=true;
          if(i===3) {
            obj.frame_rate=4;
          }
          if(i===7) {
            obj.frame_rate=6;
          }
        }


      }
  }
}