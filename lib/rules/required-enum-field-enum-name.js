const {AST_NODE_TYPES} = require('@typescript-eslint/types/dist/generated/ast-spec');

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require enumName property in EnumField decorator.',
        },
        messages: {
            missingEnumName: 'EnumField decorator requires the "enumName" option.',
            invalidEnumName: 'The "enumName" option must be a string literal.',
        },
    },

    create(context) {
        return {
            Decorator(node) {
                const {expression} = node;

                if (
                    expression.type !== 'CallExpression' ||
                    expression.callee.type !== 'Identifier' ||
                    expression.callee.name !== 'EnumField'
                ) {
                    return;
                }

                const [firstArg] = expression.arguments;

                if (!firstArg || firstArg.type !== 'ObjectExpression') {
                    context.report({
                        node,
                        messageId: 'missingEnumName',
                    });
                    return;
                }

                const hasSpread = firstArg.properties.some(
                    prop => prop.type === 'SpreadElement',
                );

                if (hasSpread) {
                    return;
                }

                const enumNameProp = firstArg.properties.find(
                    prop =>
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        prop.key.name === 'enumName',
                );

                if (!enumNameProp) {
                    context.report({
                        node,
                        messageId: 'missingEnumName',
                    });
                    return;
                }

                const isStringLiteral =
                    enumNameProp.value.type === AST_NODE_TYPES.Literal &&
                    typeof enumNameProp.value.value === 'string';

                if (!isStringLiteral) {
                    context.report({
                        node,
                        messageId: 'invalidEnumName',
                    });
                }
            },
        };
    },
};