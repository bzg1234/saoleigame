// 扫雷游戏js代码，2020-05-04

// 定义构造函数，生成相应的雷对象
function Mine(row, column, mineNum) {
    this.row = row; // 行数
    this.column = column; //列数
    this.mineNum = mineNum; // 雷的数量
    this.squares = [];  //存储所有方块的信息，二维数组，使用行与列的形式
    this.lis = []; // 存储所有的方格的dom
    this.surplusMine = mineNum; // 剩余雷的数量
    this.errorNum = 0; // 右击标的小红旗不是雷的个数，即错误的个数
    this.parent = document.getElementsByClassName('gamebox')[0];
    this.mineNumDom = document.getElementsByClassName('minenum')[0];
}

// 生成n个不重复的数字
Mine.prototype.randomNum = function() {
    var arr = [];
    var domNum = this.row * this.column; // 格子的总数
    for(var i = 0; i < domNum; i ++) {
        arr[i] = i;
    } 
    arr.sort(function(a, b) {
        return Math.random() - 0.5;
    });
    arr.length = this.mineNum;
    // console.log(arr);
    return arr;
}

//开始执行
Mine.prototype.init = function() {
    this.mineNumDom.innerHTML = this.surplusMine + "";
    this.mineInformation();
    // this.parent.oncontextmenu = function() {
    //     return false;
    // } //阻止默认事件
    addEvent(this.parent, 'contextmenu', stopContextMenu);
    this.updateNum();
    this.createDom();

    function stopContextMenu(e) {
        var event = e || window.event;
        cancelHandler(event);
    }


}

// 赋值雷对象的squares
Mine.prototype.mineInformation = function() {
    var randomMinePos = this.randomNum(); // mineNum维的数组，里面的值为第几个是雷,雷的位置
    // console.log(randomMinePos);
    var count = 0;  //计数器，表示正在对第几个方格赋值
    for(var i = 0; i < this.row; i ++) {
        this.squares[i] = [];
        for(var j = 0; j < this.column; j ++) {
            if(randomMinePos.indexOf(count) !== -1){ //if成立表明count是randomMinePos里面的一个值
                this.squares[i][j] = {
                    type: 'mine',
                    rw: i,
                    cl: j
                };
            }else {
                this.squares[i][j] = { // 每个格子的信息都是一个对象
                    type: 'num',
                    rw: i,
                    cl: j,
                    value: 0
                };
            }
            count ++;
        }
    }
    // console.log(this.squares);
}


// 创建dom结构
Mine.prototype.createDom = function() {
    var that = this;
    var div = document.createElement('div');
    for(var i = 0; i < this.row; i ++){
        var ul = document.createElement('ul'); // 每一个ul是一行
        this.lis[i] = [];
        for(var j = 0; j < this.column; j ++) {
            var li = document.createElement('li'); // 每一个li都是一个格子           
            this.lis[i][j] = li;  // 存储所有的格子的dom对象
//////////////////////////
            li.pos = [i, j]; // 把格子对应的行与列存到格子身上，为了下面用它取对应的数据
            // li.onmousedown = function(e) {
            //     var event = e || window.event;
            //     that.play(event, this); //this 指代点击的方格
            // }
            li.retMouseDown = addEvent(li, 'mousedown', function(e){
                var event = e || window.event;
                that.play(event, this); //this 指代点击的方格
            });
/////////////////////////////

            ul.appendChild(li);
        }
        div.appendChild(ul);
    }
    this.parent.innerHTML = ""; // 清空以前的
    this.parent.appendChild(div);
}

// 找某个方格周围的八个方格
Mine.prototype.getAround = function(square) {
    //传入某个方格对应的信息
    var x = square.rw;
    var y = square.cl;
    var result = []; // 存储周围的八个方格（边缘位置不是八个）

    for(var i = x - 1; i <= x + 1; i ++) {
        for(var j = y - 1; j <= y + 1; j ++){
            if(i >= 0 && i < this.row && j >= 0 && j < this.column && (!(i == x && j == y))) {
                if(this.squares[i][j].type !== 'mine'){
                    result.push([i, j]);
                }               
            }
        }
    }
    return result;
}

// 更新所有的数字
Mine.prototype.updateNum = function() {
    var updatePos; // 待更新的位置坐标
    for(var i = 0; i < this.row; i ++) {
        for(var j = 0; j < this.column; j ++) {
            if(this.squares[i][j].type == 'mine') {
                updatePos = this.getAround(this.squares[i][j]);
                for(var k = 0; k < updatePos.length; k ++) {
                    this.squares[updatePos[k][0]][updatePos[k][1]].value ++;
                }// 把雷周围的数字加一
            }
        }
    } 
}

Mine.prototype.play = function(ev, obj) {
    var that = this;
    if(ev.button == 0) { 
        //点击的是左键
        // console.log(obj);
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var numArr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        if(curSquare.type == 'mine'){
            this.gameOver(obj);
        }else{
            obj.innerHTML = curSquare.value + '';
            obj.className = numArr[curSquare.value];

            if(curSquare.value === 0){
                //点到了数字0
                obj.innerHTML = '';
                function getAllZero(square) {
                    var around = that.getAround(square); // 找到周围的n个数字的格子
                    for(var i = 0; i < around.length; i ++) {
                        var x = around[i][0];
                        var y = around[i][1];
                        that.lis[x][y].innerHTML = that.squares[x][y].value + '';
                        that.lis[x][y].className = numArr[that.squares[x][y].value];
                        if(that.squares[x][y].value === 0) {
                            that.lis[x][y].innerHTML = "";
                            if(!that.lis[x][y].check){
                                //添加一个属性，表明这个格子有没有被找过，以免重复寻找
                                that.lis[x][y].check = true;
                                getAllZero(that.squares[x][y]);  // 递归
                            }                        
                        }
                    }
                }
                getAllZero(curSquare);
            }
        }

    }else if(ev.button == 2) {
        //点击的是右键
        // 如果右击的是数字，则不能点击
        if(!obj.className) {
            obj.className = 'flag';
            this.surplusMine --;
            this.mineNumDom.innerHTML = this.surplusMine + "";
            if(this.squares[obj.pos[0]][obj.pos[1]].type == 'num') {
                this.errorNum ++;
            }
        }else if(obj.className == 'flag'){ //有小红旗，去掉，剩余雷数加一
            obj.className = "";
            this.surplusMine ++;
            this.mineNumDom.innerHTML = this.surplusMine + "";
            if(this.squares[obj.pos[0]][obj.pos[1]].type == 'num') {
                this.errorNum --;
            }
        }

        if(this.surplusMine == 0){
            //剩余雷数为0，游戏结束
            if(!this.errorNum){
                for(var i = 0; i < this.row; i ++) {
                    for(var j = 0; j < this.column; j ++) {
                        // this.lis[i][j].onmousedown = null;
                        removeEvent(this.lis[i][j], 'mousedown', this.lis[i][j].retMouseDown);
                    }
                }
                setTimeout(function(){
                    alert('游戏通过');
                }, 300);           
            }else{
                this.gameOver();
            }
        }
    }

}

// 游戏失败函数
Mine.prototype.gameOver = function(clickLi) {
    // 显示所有的雷
    // 取消所有格子的点击事件
    // 给点中的雷标红
    for(var i = 0; i < this.row; i ++) {
        for(var j = 0; j < this.column; j ++) {
            if(this.squares[i][j].type == 'mine') {
                this.lis[i][j].className = 'bg-mine';
            }
            // this.lis[i][j].onmousedown = null;
            removeEvent(this.lis[i][j], 'mousedown', this.lis[i][j].retMouseDown);

        }
    }
    if(clickLi){
        clickLi.style.backgroundColor = '#f40';
    }
    setTimeout(function(){
        alert('游戏失败');
    }, 300); 
}


var myMine = new Mine(9,9,10);
myMine.init();
// 添加button的功能
var btns = document.getElementsByTagName('button');
var ln = 0;
var arr = [[9, 9, 10], [16, 16, 40], [28, 28, 99]];
for(var i = 0; i < btns.length; i ++) {
    (function(i){
        if(i == 3){
            btns[i].onclick = function() {
                var that = this;
                btns[ln].className = "";
                this.className = "active";
                myMine = new Mine(...arr[ln]);
                myMine.init();    
                setTimeout(function(){
                    // console.log(this);//this 指向window
                    that.className = "";
                    btns[ln].className = "active";
                }, 300);
            }
        }else{
            btns[i].onclick = function() {
                btns[ln].className = "";
                this.className = "active";
                ln = i;
                // myMine = new Mine(arr[i][0], arr[i][1], arr[i][2]);
                myMine = new Mine(...arr[i]);// 新的写法
                myMine.init();          
            }
        }
    }(i))
}




