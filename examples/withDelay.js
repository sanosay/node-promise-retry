var Retry = require('../index').Retry;

var retry = new Retry({
    maxTries: 2,
    delay : 500,
    onError : function(error){
        console.log(error);
    },
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

retry.execute().then(function(result){
    console.log("Result : "+result);
    console.log("Errors : ");
    console.log(retry.getErrors());
    console.log("Retries :" + retry.getRetries());
}).catch(function(error){
    console.log(error);
});