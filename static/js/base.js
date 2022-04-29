import {GameMap} from '/static/js/ac_map/base.js';
import {Kyo} from '/static/js/player/kyo.js';
import {Kyo2} from '/static/js/player/kyo2.js';

class KOF {
    constructor(id){
      this.$kof=$('#'+id);

      this.gamemap=new GameMap(this);
      this.players=[
        new Kyo(this,{
          id:0,
          x:200,
          y:450,
          width:120,
          height:200,
          color:'red',
        }),
        new Kyo2(this,{
          id:1,
          x:1100,
          y:450,
          width:120,
          height:200,
          color:'blue',
        })
      ]
    }
}

export{
  KOF
}