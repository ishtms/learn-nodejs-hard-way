const {Logger} = require('./index')

async function initialize() {
    const logger = Logger.with_defaults();
    await logger.init();
    return logger;
}

async function main() {
    let logger = await initialize()
    logger.critical('From the main() function')
    nested_func(logger)
}

function nested_func(logger) {
    logger.critical('From the nested_func() function')
    super_nested(logger)
}

function super_nested(logger) {
    logger.critical('From the super_nested() function')
}

main()

