function sum(...a)
{
let sumnum=0;
for(let i=0;i<a.length;i++)
{
 if(a[i]%2===0)
  {
  sumnum=sumnum+a[i];
  }
}
return sumnum;
}
let result=sum(1,2,3,4,5,6,7,8,9,10);
console.log(result);