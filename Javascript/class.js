// class Human {
    //properties
    // age = 13; // public
    // #wt = 80; //private
    // ht = 180;

    // behaviour
    // walking(){
    //     console.log("I am walking")
    //     console.log("I am walking",this.#wt)
        // we can access private value using this keyword only inside the class
    // }
    // running(){
    //     console.log("I am running")
    // }
    // get(getter) is used to access private value and also access it outside the class
    // by calling get

    // get fetchWeight() {
    //     return this.#wt;
    // }
    // set(setter) is used to access private value and modify it
//     set modifyWeight(val) {
//     this.#wt = val;
//    }     

   // constructor
//    constructor(newAge,newHeight){
//     this.age = newAge;
//     this.ht = newHeight;
//    }
// }
// let obj = new Human();
// console.log(obj.age);
// obj.walking();

// passing parameter to constructor
// let obj = new Human(15,190);
// console.log(obj.age);
// console.log(obj.ht);
// console.log(obj.fetchWeight);

//Default parameter is set when we forget to assign value at function call
// it will display that default value

// function myName(fName = "Kunal") {
//     console.log("My name is :",fName);
// }
// myName();

// function solve(value = {age : 10, ht : 20}){
//     console.log("Hello Jee",value);
// }
// solve();

//function as default parameter
// function getAge() {
//     return 190;
// }
// function utility(name = "hii", age=getAge()) {
//     console.log(name," ",age);
// }
// utility();