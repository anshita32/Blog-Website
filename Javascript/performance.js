// // Code 1

// const t1 = performance.now();

// for(let i=1; i<=100; i++) {
// let para = document.createElement('p');
// para.textContent = "This is a Para" + i;
// document.body.appendChild(para);
// }

// const t2 = performance.now();

// console.log("Total time taken by code 1:" + (t2-t1));

// // Code 2

// const t3 = performance.now();

// let mydiv = document.createElement('div');

// for(let i=1; i<=100; i++) {
//     let para = document.createElement('p');
//     para.textContent = 'This is a Para' + i;
//     mydiv.appendChild(para);
// }
// document.body.appendChild(mydiv);

// const t4 = performance.now();

// console.log("The time taken by code 2:" + (t4-t3));

// // reflow is the process of calculating position / dimension of element and it is slower.
// // repaint is the process of displaying content/element pixel by pixel and it is faster.


// best code (document fragment)

// let fragment = document.createDocumentFragment();

// for(let i=1; i<=100; i++) {
//     let para = document.createElement('p');
//     // no reflow and no repaint for the below line
//     para.textContent = "This is a Para" + i;
//     fragment.appendChild(para);
// }
// // the below line takes 1 reflow and 1 repaint
// document.body.appendChild(fragment);
