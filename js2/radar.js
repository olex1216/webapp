/* 雷达图组件对象 */

var H5ComponentRadar = function(name, cfg) {
    var component = new H5ComponentBase(name, cfg);

    // 1.背景层
    var w =cfg.width;
    var h =cfg.height;
    // 1-1 网格线
    var cns =document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    /*
        计算一个圆周上的坐标（计算多边形的顶点坐标）
         已知：圆心坐标(a,b)、半径 r；角度deg。
         rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i
         x = a + Math.sin( rad ) * r;
         y = b + Math.cos( rad ) * r;
    */
    var r = w/2;//半径
    var step = cfg.data.length;//项目个数
    var isBlue = false;
    //绘制10份，分面绘制
    for(var s = 10;s > 0;s--){
        ctx.beginPath();
        for(var i = 0;i<step;i++){
            var rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;//多边形顶点的角度
            var x = r + Math.sin(rad) * r * (s/10);//多边形顶点的横坐标
            var y = r + Math.cos(rad) * r * (s/10);//多边形顶点的纵坐标
            ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff';
        ctx.fill();
    }

    //1-2 绘制伞骨
    for(var i = 0;i<step;i++){
      var  rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;

      var x = r + Math.sin( rad ) * r ;
      var y = r + Math.cos( rad ) * r ;
      ctx.moveTo(r,r);
      ctx.lineTo(x,y);
      //项目名称
      var text = $('<div class="text">');
      text.text( cfg.data[i][0] );
      text.css('transition','all .5s '+ i*.1 + 's');
      //项目名称的位置
      if( x > w/2 ){
       text.css('left',x/2+5);
      }else{
       text.css('right',(w-x)/2+5);
      }

      if( y > h/2){
        text.css('top',y/2+5);
      }else{
        text.css('bottom',(h-y)/2+5);
      }
      if( cfg.data[i][2] ){
        text.css('color',cfg.data[i][2]);
      }
      text.css('opacity',0);

      component.append(text);
    }
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();

    //2.数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height =h;
    component.append(cns);

    var draw = function(per) {
        ctx.clearRect(0,0,w,h);
        if(per <= 1){
            component.find('.text').css('opacity',0);
        }
        if(per >= 1){
            component.find('.text').css('opacity',1);
        }
        //  输出数据的折线
        ctx.beginPath();
        for(var i = 0;i<step;i++)   {
            var rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;

            var rate  = cfg.data[i][1] * per;

            var x = r + Math.sin( rad ) * r * rate;
            var y = r + Math.cos( rad ) * r * rate ;

            ctx.lineTo(x,y);
        }
        ctx.strokeStyle = '#f00';
        ctx.closePath();
        ctx.stroke();

        //  输出数据的点
        ctx.fillStyle = '#ff7676';
        for(var i=0;i<step;i++){
          var rad = ( 2*Math.PI / 360 ) * ( 360 / step ) * i;

          var rate  = cfg.data[i][1] * per ;

          var x = r + Math.sin( rad ) * r * rate;
          var y = r + Math.cos( rad ) * r * rate ;

          ctx.beginPath();
          ctx.arc(x,y,5,0,2*Math.PI);
          ctx.fill();
          ctx.closePath();
        }

    };

    component.on('onLoad', function() {
        //  雷达图生长动画
        var p = 0;
        for (i = 0; i < 100; i++) {
            setTimeout(function() {
                p += 0.01;
                draw(p);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave', function() {
        //  雷达图退场动画
        var p = 1;
        for (i = 0; i < 100; i++) {
            setTimeout(function() {
                p -= 0.01;
                draw(p);
            }, i * 10);
        }
    });


    return component;
};
