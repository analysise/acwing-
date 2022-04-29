import {ACGAMEOBJECT} from '/static/js/ac_game_object/base.js';
import {Att} from '/static/js/player/attack.js';
import { playko } from '/static/js/audio/base.js';


export class Player extends ACGAMEOBJECT{
  constructor(root,info){
    super();

    this.root=root;
    this.id=info.id;
    this.x=info.x;
    this.y=info.y;
    this.width=info.width;
    this.height=info.height;
    this.color=info.color;
    this.direction=1;

    this.vx=0;
    this.vy=0;

    this.speedx=400;
    this.speedy=-1000;

    this.gravity=50;

    this.ctx=this.root.gamemap.ctx;
    this.pressed_keys=this.root.gamemap.control.pressed_keys;

    this.status=3;//0 静止，1 向前，2 向后，3 跳跃，4 攻击，5 被打，6 死亡, 7 下蹲
    this.animations=new Map();

    this.frame_current_cnt=0;

    this.hp=100;
    this.$hp=this.root.$kof.find(`.kof-head-hp-${this.id}>div`);

  }

  strat(){

  }

  update_conlor(){  //人物移动控制
    let w,a,d,s,space;

    if(this.id===0){
      w=this.pressed_keys.has('w');
      a=this.pressed_keys.has('a');
      d=this.pressed_keys.has('d');
      s=this.pressed_keys.has('s');
      space=this.pressed_keys.has(' ');
    }else{
      w=this.pressed_keys.has('ArrowUp');
      a=this.pressed_keys.has('ArrowLeft');
      d=this.pressed_keys.has('ArrowRight');
      s=this.pressed_keys.has('ArrowDown');
      space=this.pressed_keys.has('Enter');      
    }

    if(this.status===0||this.status===1){
      if(space) {
        this.status=4;
        this.vx=0;
        this.frame_current_cnt=0;
      }
      else if(w){ //跳起
        if(d){
          this.vx=this.speedx;
        }else if(a){
          this.vx=-this.speedx;
        } else {
          this.vx=0;
        }
        this.vy=this.speedy;
        this.status=3;
        this.frame_current_cnt=0;
      }else if(d){  //前进
        this.vx=this.speedx;
        this.status=1;
      }
      else if(a) {  //后退
        this.vx=-this.speedx;
        this.status=1;      
      } else if(s) {  //下蹲
        if(d){
          this.vx=this.speedx;
        }else if(a){
          this.vx=-this.speedx;
        } else {
          this.vx=0;
        }       
        this.status=7;
        this.frame_current_cnt=0;
      } else {
          this.vx=0;
        
        this.status=0;
      }
    }
  }
  update_move(){  //移动速度

      this.vy+=this.gravity;
      this.x+=this.vx*this.timedelta/1000;
      this.y+=this.vy*this.timedelta/1000;  
      let [a,b]=this.root.players;

      if(a!==this) [a,b]=[b,a];
      let r1= {
        x1:a.x,
        y1:a.y,
        x2:a.x+a.width,
        y2:a.y+a.height,
      };
      let r2 ={
        x1:b.x,
        y1:b.y,
        x2:b.x+b.width,
        y2:b.y+b.height,       
      };

      if(this.is_collision(r1,r2)&&a.status!==6&&b.status!==6&&a.status!==3) {//人物碰撞移动
        b.x+=this.vx*this.timedelta/1000/2;
        b.y+=this.vy*this.timedelta/1000/2;
        a.x-=this.vx*this.timedelta/1000/2;
        a.y-=this.vy*this.timedelta/1000/2;

        if(this.status===3) {
          this.status=0;
        }
      }


    if(this.y>450){
      this.y=450;
      this.vy=0;
      if(this.status===3) {
        this.status=0;
      }
      
    }


    if(this.x<0){
      this.x=0;
    }else if(this.x+this.width>this.root.gamemap.$canvas.width()){
      this.x=this.root.gamemap.$canvas.width()-this.width;
    }
  }

  update_direction() {
    if(this.status===6) return;
    let players= this.root.players;
    if(players[0]&&players[1]){
      let me=this, you =players[1-this.id];

      if(me.x<you.x) me.direction=1;
      else me.direction=-1;
    }

  }
  is_collision(r1,r2) { //碰撞检测
    if(Math.max(r1.x1,r2.x1)>Math.min(r1.x2,r2.x2))
      return false;
    if(Math.max(r1.y1,r2.y1)>Math.min(r1.y2,r2.y2))
      return false;

    return true;
  }

  is_attack() { //是否被攻击
    if(this.status===6) return;
    this.status=5;
    this.frame_current_cnt=0;

    this.hp=Math.max(this.hp-10,0);
    this.$hp.animate({
      width:this.$hp.parent().width()*this.hp/100
    },1000);
    if(this.hp<=0) {
      this.status=6;
      this.frame_current_cnt=0;
      this.vx=0;
      playko();
    }
  }
  update_ataack() {
    if(this.status===4 && this.frame_current_cnt===18) {
      let me=this, you=this.root.players[1-this.id];
      let r1;
      if(this.direction>0) {
        r1 = {
          x1 :me.x+Att[this.id][0],
          y1 :me.y+Att[this.id][1],
          x2 :me.x+Att[this.id][0]+Att[this.id][2],
          y2 :me.y+Att[this.id][1]+Att[this.id][3], 
        };
      } else {
        r1 = {
          x1 :me.x+Att[this.id][4],
          y1 :me.y+Att[this.id][5],
          x2 :me.x,
          y2 :me.y+Att[this.id][5]+Att[this.id][7], 
        };     
      }
      let r2= {
        x1 :you.x,
        y1 :you.y,
        x2 :you.x+you.width,
        y2 :you.y+you.height,
      }
      if(this.is_collision(r1,r2)) {
        you.is_attack();
      }
    }
  }
  update(){
    this.update_move();
    this.update_conlor();
    this.update_direction();
    this.update_ataack();

    this.render();
  }

  render(){
    // this.ctx.fillStyle='blue';
    
    // this.ctx.fillRect(this.x,this.y,this.width,this.height);
    // //console.log(`${this.id},${this.x},${this.y}`);
    // if(this.direction>0) {
    //   this.ctx.fillStyle='red';
    //   this.ctx.fillRect(this.x+Att[this.id][0],this.y+Att[this.id][1],Att[this.id][2],Att[this.id][3]);
    // } else {
    //   this.ctx.fillStyle='red';
    //   this.ctx.fillRect(this.x+Att[this.id][4],this.y+Att[this.id][5],Att[this.id][6],Att[this.id][7]);
    // }

    let status=this.status;

    if(this.status===1 && this.direction*this.vx<0) {
        status=2;
    }

    let obj=this.animations.get(status);

    if(obj&&obj.loaded) {
      if(this.direction>0) {
      let k=parseInt(this.frame_current_cnt/obj.frame_rate)%obj.frame_cnt;
      let image=obj.gif.frames[k].image;
      this.ctx.drawImage(image,this.x,this.y+obj.offset_y,image.width*obj.scale,image.height*obj.scale);
      } else {
        this.ctx.save();
        this.ctx.scale(-1,1);
        this.ctx.translate(-this.root.gamemap.$canvas.width(),0);

        let k=parseInt(this.frame_current_cnt/obj.frame_rate)%obj.frame_cnt;
        let image=obj.gif.frames[k].image;
        this.ctx.drawImage(image,this.root.gamemap.$canvas.width()-this.x-this.width,this.y+obj.offset_y,image.width*obj.scale,image.height*obj.scale);

        this.ctx.restore();
      }
    }

    if(status===4||status===5||status===6||status===7) {
      if(this.frame_current_cnt==obj.frame_rate*(obj.frame_cnt-1)) {
        if(status===6) {
          this.frame_current_cnt--;
        }
        else {
          this.status=0;
        }        
      }   
    }
    if(status===7) {
      if(this.frame_current_cnt==obj.frame_rate*(obj.frame_cnt-2)) {
          this.frame_current_cnt--;
  
      } 

      let s;
      if(this.id===0) {
        s=this.pressed_keys.has('s');
      }
      else {
        s=this.pressed_keys.has('ArrowDown');
      }
      
      if(!s) {
        this.status=0;
      }
    }
    this.frame_current_cnt++;
  }
}