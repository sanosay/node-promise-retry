# node-promise-retry
A module that encapsulates promise retry logic
## Example usage: 
```javascript
  ...
  var retry = new Retry({
    // max number of tries. 
    maxTries: 2,
    // the delay between each retries
    delay : 500, 
    // fires on every error
    onError : function(error){
        console.log(error);
    },
    // a promise factory function
    promiseFactory: function () {
        return new Promise(function(res,rej){
            setTimeout(function(){
                if(retry.getRetries()==2){
                    res(true);
                }else{
                    rej(new Error("An error!"));
                }
            },100);
        });
    }
});
// execute 
retry.execute().then(function(result){
    console.log("Result : "+result);
    console.log("Errors : ");
    console.log(retry.getErrors());
    console.log("Retries :" + retry.getRetries());
}).catch(function(error){
    console.log(error);
});
```
