const Safeify = require('safeify').default;

module.exports = async function sandboxFn(context, script) {
    // 创建 safeify 实例
    const safeVm = new Safeify({
        unsafe: {
            modules: {
              // 引入assert断言库
                assert: 'assert'
            }
        },
        unrestricted: true,
        timeout: 3000,
        asyncTimeout: 60000
    })

    safeVm.preset('const assert = require("assert");');

    script += `; return {
        Function: this.Function,
        eval: this.eval,
        header: this.header,
        query: this.query,
        body: this.body,
        mockJson: this.mockJson,
        params: this.params,
        resHeader: this.resHeader,
        httpCode: this.httpCode,
        delay: this.delay,
        Random: this.Random,
        cookie: this.cookie
    }`;
    // 执行动态代码
    const result = await safeVm.run(script, context)

    // 释放资源
    safeVm.destroy()
    return result
}
