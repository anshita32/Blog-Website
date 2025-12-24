// let firstPromise = new Promise( (resolve,reject) => {
//     setTimeout(function sayMyName ()
// {
//     console.log("My name is anshita");
// } , 15000); 
// });

// Then and catch on promise

// let promise1 = new Promise( (resolve , reject) => {
//     let success = true;
//     if(success) {
//         resolve("Promise fullfilled");
//     }
//     else {
//         reject("Promise Rejectes");
//     }
// });

// promise1.then ((message) => {
//     console.log("The ka message" + message);
// }) . catch ((error) => {
//     console.log("Error" + error);
// });

// Multiple then also called it as promise chaining

// let promise1 = new Promise( (resolve , reject) => {
//   let success = true;
//     if(false) {
//         resolve(10);
//     }
//     else {
//         reject(-1);
//     }
// });

// promise1.then((message) => {
//     console.log("first msg" + message);
//     return 20;
// }).then ((message) => {
//     console.log("second msg" + message);
//     return 30;
// }).then((message) => {
//     console.log("third msg" + message);
// }).catch( (error) => {
//     console.error(error);
// }).finally ((message) =>{
//     console.log("Ma to final hu chaluga hee pkka");
// })

// Multiple promise or promise all

let promise1 = new Promise ((resolve , reject)=> {
    setTimeout(resolve , 1000 , "First");
} )

let promise2= new Promise ((resolve , reject)=> {
    setTimeout(resolve , 2000 , "Second");
} )

let promise3 = new Promise ((resolve , reject)=> {
    setTimeout(resolve , 3000 , "Third");
} )

Promise.all([promise1, promise2, promise3])
.then((values)=>
{
    console.log(values);
})
.catch((error)=>{
    console.error("Error" + error);
})