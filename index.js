const requiredEnumToHelperRule = require("./lib/rules/required-enum-to-helper");
const plugin = {
    rules: {
        "required-enum-to-helper": requiredEnumToHelperRule,
    } ,
};

module.exports = plugin;
