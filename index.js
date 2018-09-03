// 1.点击开始游戏 ->  动态生成100个小格 -> 100个div 
// 
// 2.leftClick 如果没有雷 -> 显示数字（代表以当前小格为中心，周围八个格的雷数）。
//                 有雷  ->  Game Over.
// 
// 扩散：如果当前周围八个小格都没有雷（数字为0），则要继续扩散到有数字（雷）或者到达边界为止。
// 
// 3.rightClick 没有标记且没有数字就进行标记、有标记就取消标记 -> 根据标记是否正确，来判断10个雷中被正确标记的个数。
//                                                            若都正确标记 -> 提示成功。
//              已经出现数字 -> 无效果。

var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var minesNum;
// 雷总数
var minesOver;
// 未标记雷数
var block;
var mineMap = [];
// 用来标记雷
var lock = true;
// 加锁 （防止点击开始游戏多次，而出现多个棋盘）

bindEvent();
function bindEvent() {
    startBtn.onclick = function () {
        if(lock == true) {
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init(); 
            lock = false;
        }
    }
    box.oncontextmenu = function () {
        // 在box区域 取消右键的默认事件。
        return false;
    }
    alertBox.oncontextmenu = function () {
        return false;
    }
    box.onmousedown = function (e) {
        // 事件委托找源事件（哪个格子）
        var event = e.target;
        if (e.which == 1) {
            leftClick(event);
        } else if (e.which == 3) {
            rightClick(event);
        }
    }
    closeBtn.onclick = function () {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        lock = true;
        // 置空
    }
}

function init() {
    minesNum = 10;
    minesOver = 10;
    score.innerHTML = minesOver;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var con = document.createElement('div');
            con.classList.add('block');
            // 添加类名
            con.setAttribute('id', i + "-" + j);
            // 加独有的ID值（添加指定的属性，并为其赋值/改变属性值）
            box.appendChild(con);
            mineMap.push({ mine: 0 });
            // 开始push进去100位，每一位mine都是0.
        }
    }
    block = document.getElementsByClassName('block');
    while (minesNum) {
        var mineIndex = Math.floor(Math.random() * 100);
        if (mineMap[mineIndex].mine === 0) {
            block[mineIndex].classList.add('isLei');
            // 生成block和插入数组mineMap的顺序是相同的。
            mineMap[mineIndex].mine === 1;
            minesNum--;
        }
    }


}

function leftClick(dom) {
    if(dom.classList.contains('flag')){
        return;
    }else {
        var isLei = document.getElementsByClassName('isLei');
        if (dom && dom.classList.contains('isLei')) {
            console.log('game over');
            for (var i = 0; i < isLei.length; i++) {
                isLei[i].classList.add('show');
            }
            setTimeout(function () {
                // 延迟执行
                alertBox.style.display = 'block';
                alertImg.style.backgroundImage = 'url("./img/lose.jpg")';
            }, 800);
        } else {
            var n = 0;
            var posArr = dom && dom.getAttribute('id').split('-');
            var posX = +posArr[0];
            var posY = +posArr[1];
            // 字符串隐式转换成数字
            dom && dom.classList.add('num');
    
            //   i-1,j-1    i-1,j    i-1,j+1
            //   i,j-1      i,j      i,j+1
            //   i+1,j-1    i+1,j    i+1,j+1
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var aroundBox = document.getElementById(i + "-" + j);
                    if (aroundBox && aroundBox.classList.contains('isLei')) {
                        n++;
                    }
                }
            }
            dom && (dom.innerHTML = n);
            if (n == 0) {
                for (var i = posX - 1; i <= posX + 1; i++) {
                    for (var j = posY - 1; j <= posY + 1; j++) {
                        var nearBox = document.getElementById(i + "-" + j);
                        console.log(i + "-" + j);
                        if (nearBox && nearBox.length != 0) {
                            if (!nearBox.classList.contains('check')) {
                                nearBox.classList.add('check');
                                leftClick(nearBox);
                                // 递归
                            }
                        }
                    }
                }
            }
        }
    }
}

function rightClick(dom) {
    if (dom.classList.contains('num')) {
        return;
    }
    dom.classList.toggle('flag');
    // toggle 切换：没有就加上；有就删除。

    if (dom.classList.contains('isLei') && dom.classList.contains('flag')) {
        minesOver--;
    }
    if (dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
        minesOver++;
    }
    score.innerHTML = minesOver;
    if (minesOver == 0) {
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("./img/win.jpg")';
    }
}