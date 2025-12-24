// let obj = {
//     age : 12,
//     wt : 68,
//     ht : 180
// };
// console.log(obj)
// obj.color = "white";
// console.log(obj);

// object cloning by spread operator

let src = {
     age : 12,
     wt : 68,
     ht : 180
 };
//  src.age = 90;
//  let dest = {...src};
//  console.log("src :",src);
//  console.log("dest :",dest);
 
// object cloning by  assign operator

// let dest = Object.assign({},src);
//  console.log("src :",src);
//  console.log("dest :",dest);

// object cloning by iteration

// let dest = {};
// for (let key in src) {
//     let newKey = key;
//     let newValue = src[key];
//     dest[newKey] = newValue;
// }
// console.log("src :",src);
// console.log("dest :",dest); 