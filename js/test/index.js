// var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

var arr= [6,7,1,2,3,9,4];

const radomSort = function(){
  arr.sort(function (a,b) {
    console.log('Math.random() ->', Math.random());
    // return Math.random() - 0.5
    return a - b  ; 
    // a - b  升序
    // b - a  倒叙
  })
  return arr;
}

console.log('arr ->', radomSort());