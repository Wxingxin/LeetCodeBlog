```js
function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  for (let num of arr) count[num]++;
  
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i]--) arr[idx++] = i;
  }
  return arr;
}
```