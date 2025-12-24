// Object

// let obj = {
//     "full name" : "Anshita",
//     age : 21,
//     weight : 44,

//     // function in object

//     greet : function() {
//  console.log("Hello Jee Kaise ho saare");
//     }
// };
// console.log(obj)
// obj.greet();
// console.log(typeof(obj));

// creation of array

// let arr=[1,2,3,4,5];
// console.log(arr);

// array constructor

// let brr = new Array('Hii',1,true);
// console.log(brr);

// console.log(typeof(arr));
// console.log(typeof(brr));

// accessing of array
// console.log(brr[2]);

// push fn is used to insert anything on the last index of the array
// brr.push('babbar');

//pop operation is used to remove last element of array
// brr.pop();

// shift is used to remove left most element of array
// brr.shift();

// unshift is used to add elemnt on the left foremost of array
// brr.unshift("Anshu");

// brr.push(20);
//  brr.push(40);
//  brr.push(70);

 // slice is used to take part of an array (shallow copy) (exclude last index)
// console.log(brr.slice(2,4));

//splice is used to change the array content which means we can insert,replace,remove
// anything from any place in the array
// brr.splice(1,2,'kunal') // 1 is showing index ,2 is showing remove two element and kunal is showing to add kunal in it
// console.log(brr);

//map is a type of function which takes the value perform the operation and return the ans.
// let arr = new Array(10,20,30);
// let ansArray = arr.map((number)=> {
//     return number*number;
// })
// console.log(ansArray);

// arr.map((number) => {
//     console.log(number+1);
// })

// arr.map((number,index) => {
//     console.log(number , index);
// })

// filter is used to filter the array  
// let arr=[10,20,30,11,21,44,51];

// let evenArray = arr.filter((number) => {
//     return number%2 === 0;
//  if(number%2 === 0) {
//     return true;
//  }
//  else {
//     return false;
//  }
//  });
// console.log(evenArray);

// let arr = [1,2,'love','kunal',null];

// let getAns = arr.filter((value) => {
//     if(typeof(value) === 'string') {
//         return true;
//     }
//     else {
//         return false;
//     }
// });
// console.log(getAns);
 
// reduce is used to perform mathematical operations
// let arr = [10,20,30,40]

// let ans = arr.reduce((acc,curr) => {
//     return acc+curr;
// },0);
// console.log(ans);

// Sorting of array
// let arr = [9,1,7,4,2,8]
// arr.sort();
// console.log(arr);
// console.log(arr.indexOf(2));

// foreach function

// let arr = [10,20,30];
// arr.forEach((value , index) =>
// {
// console.log("Number:",value , "Index:",index);
// })
// let length = arr.length;
// console.log("Length" ,length);

// for in

// let obj = {
//     "full name" : "Anshita",
//      age : 21,
//      weight : 44,
//     greet : function() {
//   console.log("Hello Jee Kaise ho saare");
//      }
//  };

// for of

//  for (let key in obj) {
//     console.log(key," ",obj[key]);
//  }

// let fullName = "Anshita";
// for(let val of fullName) {
//     console.log(val);
// } 

// array with function

 let arr = [10,20,30,40,50];
// function getSum(arr) {
//     let len = arr.length;
//     let sum = 0;
//     for(let index=0;index<len;index++)
//     {
//         sum = sum+arr[index];
//     }
//     return sum;
// }
// let totalSum = getSum(arr);
// console.log(totalSum);
