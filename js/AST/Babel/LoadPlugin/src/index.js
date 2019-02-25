import 'babel-plugin-demand-loading'
import {flatten,join} from 'lodash'

// import flatten from 'lodash/flatten'
// import join from 'lodash/join'


// // 第一句引用的话会全部引用进来，要70kb
// // 后面两句单独引用 flatten 和 join 的话，只要2.89kb

// // 如果安装 babel-plugin-import 插件并且在.babel中使用的话，实际只有1kb，比单独引用方法还要小,这里不做次方法

console.log(_.flatten([1, [2, [3, [4]], 5]]));
console.log(_.join(['a', 'b', 'c'], '~'));
