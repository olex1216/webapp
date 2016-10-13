/* 柱图组件对象 */

var H5ComponentPolyline =function ( name, cfg ) {
    var component = new H5ComponentBase( name ,cfg);

    // 1.绘制网格线
    var w =cfg.width;
    var h =cfg.height;
    // 1-1 网格线背景
    var cns =document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);
    // 1-2水平网格线
    var step = 10 ;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#AAAAAA";

    for (var i = 0; i < step + 1; i++) {
        var y = (h / step) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y)
    }


    // 1-3垂直网格线
    step = cfg.data.length + 1;

    var text_w = w / step >> 0;

    for (var i = 0; i < step + 1; i++) {
        var x = (w / step) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);

        // 绘制项目名称
        if (cfg.data[i]) {
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);
            text.css('width', text_w / 2)
                .css('left', (x / 2 - text_w / 4) + text_w / 2);
            component.append(text);
        }
    }
    ctx.stroke();

    // 2.数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    /**
     * 绘制折线以及对应的数据和阴影
     * @param  {floot} per 0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
     * @return {DOM}     Component元素
     */
    var draw = function(per) {
        //  清空画布
        ctx.clearRect(0, 0, w, h);

        // 2-1绘制折线数据
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8878";

        var x = 0;
        var y = 0;
        var row_w = (w / (cfg.data.length + 1));
        // 2-2 画点
        for (var i in cfg.data){
            var item =cfg.data[i];
            x = row_w*i + row_w;
            y = h - (h*item[1]*per);
            ctx.moveTo(x,y);
            ctx.arc(x, y, 5, 0, 2 * Math.PI);

        }


        // 2-3 连线
        ctx.moveTo(row_w, h - (cfg.data[0][1] * h *per));
        for (var i in cfg.data){
            var item =cfg.data[i];
            x = row_w*i + row_w;
            y = h - (h*item[1]*per);
            ctx.lineTo(x,y);
        }
        ctx.stroke();

        // 2-4 绘制阴影
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0)";
        ctx.lineTo(x,h);
        ctx.lineTo(row_w,h);
        ctx.fillStyle = 'rgba(255, 136, 120, 0.2)';
        ctx.fill();
        ctx.stroke();

        // 2-5 写数据
        for (var i in cfg.data){
            var item =cfg.data[i];
            x = row_w*i + row_w;
            y = h - (h*item[1]*per);
            ctx.moveTo(x,y);
            ctx.fillStyle = item[2] ? item[2] : '#595959';

            ctx.fillText(((item[1] * 100) >> 0) + '%', x - 10, y - 10);
        }
        ctx.stroke();
    }

    component.on('onLoad', function() {
        //  折现图生长动画
        var p = 0;
        for (i = 0; i < 100; i++) {
            setTimeout(function() {
                p += 0.01;
                draw(p);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave', function() {
        //  折现图退场动画
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