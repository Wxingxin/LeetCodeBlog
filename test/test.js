const pro = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('done');
  }, 1000);
})

pro.then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
});

const hel = 'this is my name'


try {
    let process = require('process');
} catch (error) {
    console.log(error)
}
