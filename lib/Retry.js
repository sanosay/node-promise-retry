var valueOrDefault = function (value, _default) {
    if (typeof value === 'undefined') {
        return _default;
    }
    return value;
};
/**
 *
 * @param options
 * @constructor
 */
var Retry = function (options) {
     
    this._maxTries = valueOrDefault(options.maxTries, 1);
    this._delayBetweenRetries = valueOrDefault(options.delay, -1);
    this._onError = valueOrDefault(options.onError, function(error){});
    this._currentRetries = 0;
    this._errors = [];
    this._started = false;
    this._promiseFactory = valueOrDefault(options.promiseFactory, function () {
        return Promise.resolve(true);
    });
};


Retry.prototype.execute = function () {
    return new Promise(this._execute.bind(this));
};
Retry.prototype.getRetries = function(){
    return this._currentRetries;
};
Retry.prototype.getErrors = function(){
    return this._errors;
};
Retry.prototype._execute = function (res, rej) {
    var task = function () {
        this._currentRetries++;
        if (this._maxTries >= this._currentRetries) {
            this._promiseFactory().then(
                function (result) {
                    res(result);
                }.bind(this),
                function (error) {
                    //push error to the stack
                    this._errors.push(error);
                    this._onError(error);
                    this._execute(res, rej);
                }.bind(this)
            );
        } else {
            return rej(this._errors);
        }
    }.bind(this);
    if(!this._started){
        this._started = true;
        task();
    }else{
        if(this._delayBetweenRetries >=0){
            setTimeout(task.bind(this),this._delayBetweenRetries);
        }else{
            task();
        }
    }
};

module.exports = Retry;