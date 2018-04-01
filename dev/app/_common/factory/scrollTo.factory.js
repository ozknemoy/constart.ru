/**
 * Created by ozknemoy on 23.11.2016.
 * с использованием requestAnimationFrame
 * либо тег/ид/класс для querySelector, либо число(отступ от верха) + скорость вторым параметром
 */
export function scrollToF () {
    /*return {
        set ret(d) {this._ret = d},
        get get123 () {return this.get1234},
        get get1234 () {return this._ret},

    }*/
    // easing functions http://goo.gl/5HLl8
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) {
            return c/2*t*t + b
        }
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    /* не использую пока
    Math.easeInCubic = function(t, b, c, d) {
        var tc = (t/=d)*t*t;
        return b+c*(tc);
    };

    Math.inOutQuintic = function(t, b, c, d) {
        var ts = (t/=d)*t,
            tc = ts*t;
        return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
    };*/

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
    var requestAnimFrame = (function(){
        return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
    })();

    function offsetPosition(element) {
        var offsetLeft = 0, offsetTop = 0;
        do {
            offsetLeft += element.offsetLeft;
            offsetTop  += element.offsetTop
        } while (element = element.offsetParent);
        return [offsetLeft, offsetTop]
    }

    return function scrollTo(to, duration, callback) {
        if(!to) return;
        
        // если передаю ид элемента а не число
        if(typeof to === 'string') {
            to = offsetPosition(document.querySelector(to))[1]
        }

        // because it's so fucking difficult to detect the scrolling element, just move them all
        function move(amount) {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        }
        function position() {
            return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
        }
        var start = position(),
            change = to - start,
            currentTime = 0,
            increment = 20;
        duration = (typeof(duration) === 'undefined') ? 500 : duration;
        var animateScroll = function() {
            // increment the time
            currentTime += increment;
            // find the value with the quadratic in-out easing function
            var val = Math.easeInOutQuad(currentTime, start, change, duration);
            // move the document.body
            move(val);
            // do the animation unless its over
            if (currentTime < duration) {
                requestAnimFrame(animateScroll);
            } else {
                if (callback && typeof(callback) === 'function') {
                    // the animation is done so lets callback
                    callback();
                }
            }
        };
        animateScroll();
    }
}