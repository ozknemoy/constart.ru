﻿window.onload = function() {
	img = document.getElementById('img'),
	width = img.clientWidth,
	height = img.clientHeight,
	canvas = document.getElementById('slow'),
	ctx = canvas.getContext('2d');
	canvas.width = width;//для хрома
	canvas.height =  height;//для хрома
    ctx.drawImage(img, 0, 0);
}
var value = 0,
    br = document.getElementById('br'),
    co = document.getElementById('co');
br.addEventListener('change', update);
co.addEventListener('change', update);

function update () {
    valueBr = parseInt(br.value);
	valueCo = parseInt(co.value);
    commonF(img, ctx, width, height, valueBr, valueCo);	
}
function commonF(img, ctx, w, h, valueBr, valueCo) {
    ctx.drawImage(img, 0, 0);
    var imageData = ctx.getImageData(0, 0, w, h),
        d = imageData.data;
	var factor = (259 * (valueCo + 255)) / (255 * (259 - valueCo));	
    for(var i = 0, l = d.length;i<l;i+=4) {
		//изменение яркости
		d[i] += valueBr; 
		d[i+1] += valueBr; 
		d[i+2] += valueBr;
		//прибавляем код контраста
        d[i] = factor * (d[i] - 128) + 128;
        d[i+1] = factor * (d[i+1] - 128) + 128;
        d[i+2] = factor * (d[i+2] - 128) + 128;
    }
    ctx.putImageData(imageData, 0, 0);
}