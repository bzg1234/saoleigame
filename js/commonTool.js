//对象的深度拷贝
function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = '[object Array]';
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== null && typeof (origin[prop]) == 'object') {
                if (toStr.call(origin[prop]) == arrStr) {
                    target[prop] = [];
                } else {
                    target[prop] = {};
                }
                deepClone(origin[prop], target[prop]);

            } else {
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}
//返回类型
function type(target) {
    var obj = {
        '[object Object]': 'object',
        '[object Array]': 'array',
        '[object Number]': 'number-object',
        '[object Boolean]': 'boolean-object',
        '[object String]': 'string-object',
    };
    if (target === null) {
        return 'null';
    } else if (typeof (target) == 'object') {
        var str = Object.prototype.toString.call(target);
        return obj[str];
    } else {
        return typeof (target);
    }
}

//数组去重  unique--独一无二的
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = 'abc';
            arr.push(this[i]);
        }
    }
    return arr;
}

function retSibling(e, n) {
    //返回e的第n个兄弟元素节点, n > 0 返回后面的，n为负返回前面的，n为0返回自己
    while (e && n) {
        if (n > 0) {
            if (e.nextElementSibling) {
                e = e.nextElementSibling;
            } else {
                e = e.nextSibling;
                while (e !== null && e.nodeType != 1) {
                    e = e.nextSibling;
                }
            }

            n--;
        } else {
            if (e.previousElementSibling) {
                e = e.previousElementSibling;
            } else {
                e = e.previousSibling;
                while (e !== null && e.nodeType != 1) {
                    e = e.previousSibling;
                }
            }
            n++;
        }
    }
    return e;
}


Element.prototype.insertAfter = function (targetNode, afterNode) {
    //  insertAfter, 和insertBefore类似
    var theNextNode;
    if (afterNode.nextElementSibling) {
        theNextNode = afterNode.nextElementSibling;
    } else {
        theNextNode = afterNode.nextSibling;
        while (theNextNode !== null && theNextNode.nodeType != 1) {
            theNextNode = theNextNode.nextSibling;
        }
    }
    if (theNextNode === null) {
        this.appendChild(targetNode);
    } else {
        this.insertBefore(targetNode, theNextNode);
    }
}

function getTheNowTime() {
    //封装函数，打印当前时间
    var date = new Date();
    var change = function (target) {
        return (target < 10 ? '0' + target : target);
    };
    var month = change(date.getMonth() + 1),
        theDate = change(date.getDate()),
        hour = change(date.getHours()),
        minute = change(date.getMinutes()),
        second = change(date.getSeconds());
    return date.getFullYear() + "-" + month + "-" + theDate + ' ' + hour + ':' + minute + ":" + second;
}

// 封装兼容性方法 滚动条滚动距离
// 返回对象    x，y的滚动距离
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

// 封装兼容性方法，返回视口的宽高
// 返回对象   w h 表示像素值，数字类型
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode == 'BackCompat') {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }
}

// 封装实用性兼容性方法，获取元素样式，CSS属性值
function getStyle(elem, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop];
    } else {
        return elem.currentStyle[prop];
    }
}

// 封装兼容性方法，处理不同的浏览器
// 给一个dom元素添加一个该事件类型的处理函数     
function addEvent(elem, type, handle) {
    function ieHandle(e) {
        handle.call(elem, e);
    }
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
        return handle;
    } else {
        elem.attachEvent('on' + type, ieHandle);
        return ieHandle;
    }
}

// 移除事件
function removeEvent(elem, type, retHandle) {
    if (elem.addEventListener) {
        elem.removeEventListener(type, retHandle, false);
    } else {
        elem.detachEvent('on' + type, retHandle);
    }
}



// 封装函数，取消冒泡
function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

// 封装阻止默认事件函数
function cancelHandler(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

// 拖拽元素
function drag(elem) {
    var disX, disY;
    var retMouseMove;
    var retMouseUp;
    addEvent(elem, 'mousedown', function (e) {
        var event = e || window.event;
        disX = event.clientX - parseInt(getStyle(elem, 'left'));
        disY = event.clientY - parseInt(getStyle(elem, 'top'));
        retMouseMove = addEvent(document, 'mousemove', mouseMove);
        retMouseUp = addEvent(document, 'mouseup', mouseUp);
        stopBubble(event);
        cancelHandler(event);
    });

    function mouseMove(e) {
        var event = e || window.event;
        elem.style.left = event.clientX - disX + 'px';
        // 事件发生，鼠标点击的位置 event.clientX 
        elem.style.top = event.clientY - disY + 'px';
    }
    function mouseUp(e) {
        var event = e || window.event;

        removeEvent(document, 'mousemove', retMouseMove);
        removeEvent(document, 'mouseup', retMouseUp);
    }
}