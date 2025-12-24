// function changeText() {
//     let para = document.getElementById('fpara');
//     para.textContent = "Hello Anshu";
// }
// let para = document.getElementById('fpara');

// para.addEventListener('click',changeText);

// //para.removeEventListener('click',changeText);

// let anchorElement = document.getElementById('fanchor');

// function change() {
//     event.preventDefault();
//     anchorElement.textContent = "Click Done Bhai";
// }

// anchorElement.addEventListener('click', change);

// let paras = document.querySelectorAll('p');

// for(let i=0; i<paras.length; i++){
//     let para = paras[i];
//     para.addEventListener('click', call);
// }
function call() {
    if(event.target.nodeName === 'SPAN') {
    alert("You have clicked on para: "+ event.target.textContent);
} }

let mydiv = document.getElementById('wrapper');
mydiv.addEventListener('click',call);

