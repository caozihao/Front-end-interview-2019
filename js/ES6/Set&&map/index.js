var set = new Set([1, 2, 3, 4, 5, 6, {}]);
set.add(11).add(21).add(31).add(41)
// console.log('set ->',set);

var map = new Map();
// let word = {p:'hello map',h:'123'};
let word = 'p';
map.set(word, 'content');
// console.log('map->',map.get('p'));
map.delete('p');
// console.log('map.has(0)->',map.has('o'));
// console.log('map.size->',map.size);

var map2 = new Map([
  ['name', "zhangsan"],
  ['age', 12]
]);

console.log('map.get(name)->', map2.get('name'));