// variable assign in function

// let greet = function() {
    // console.log("Greeting of the day")
// }
// greet();

// function pass

// function greetMegreet,(fullName) {
//   console.log("Hello",fullName);
//   greet();
// }
// greetMe(greet,'Anshita');

// return function

// function solve(number) {
//     return function(number) {
//         return number*number;
//     }
// }
// let ans = solve(5);
// let finalAns = ans(10);
// console.log(finalAns);

// store in data structure

// const arr = [
//     function(a,b) {
//         return a+b;
//     },
//     function(a,b){
//         return a-b;
//     },
//     function(a,b){
//         return a*b;
//     }
// ];
// let first = arr[0];
// let ans = first(5,10);
// console.log(ans);

// use as a object
// let obj = {
//     age:25,
//     wt:36,
//     ht:180,
//     greet : ()=>{
//         console.log("Hello duniya");
//     }
// }
// console.log(obj.age);
// obj.greet();

// Temporal Dead Zone 
// console.log(marks);
// console.log("hii");
// consosle.log("Hello");
// let marks = 100;
// console.log(marks);
// line no 57 to 59 is called temoral dead zone because we cannot access 
// marks inbetween them.