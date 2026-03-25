const {AST_NODE_TYPES} = require('@typescript-eslint/types/dist/generated/ast-spec');

const STEROIDS_NEST_PACKAGE = '@steroidsjs/nest/infrastructure/decorators/fields';

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
        const importsNames = new Map();

        return {
            ImportDeclaration(node) {
                const source = node.source.value;

                node.specifiers.forEach((specifier) => {
                    if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                        importsNames.set(specifier.local.name, source);
                    }
                });
            },

            Decorator(node) {
                const {expression} = node;

                if (
                    expression.type !== 'CallExpression' ||
                    expression.callee.type !== 'Identifier' ||
                    expression.callee.name !== 'EnumField' ||
                    !importsNames.get(expression.callee.name)?.startsWith(STEROIDS_NEST_PACKAGE)
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