const requiredEnumToHelperRule = require("./lib/rules/required-enum-to-helper");
const requiredEnumFieldEnumNameRule = require("./lib/rules/required-enum-field-enum-name");

const plugin = {
    rules: {
        "required-enum-to-helper": requiredEnumToHelperRule,
        "required-enum-field-enum-name": requiredEnumFieldEnumNameRule,
    },
};

module.exports = plugin;
