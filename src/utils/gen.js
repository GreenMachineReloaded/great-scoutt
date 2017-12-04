module.exports = (g) => {
    let it = g();
    let ret;

    // iterate over generator function
    (function iterate (val) {
        // step to next yield/return
        ret = it.next(val);
        // if generator is not done
        if (!ret.done) {
            // if the next function to run is a promise
            if (ret.value && 'then' in ret.value) {
                // call iterate() again when promise resolves, that way you can step to the next thing to execute
                ret.value.then(iterate).catch((err) => {
                    it.throw(err);
                });
            }
        }
    })();
};
