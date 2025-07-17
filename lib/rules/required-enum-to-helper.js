const {AST_NODE_TYPES} = require('@typescript-eslint/types/dist/generated/ast-spec');

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'The rule requires a corresponding enum for each class inheriting BaseEnum from @steroidsjs/nest/domain/base/BaseEnum.',
        },
        messages: {
            missingEnum: 'Helper class "{{ helperName }}" requires a corresponding enum.',
        },
    },

    create(context) {
        const enumsNames = new Map();
        const helpersNames = new Map();
        const importsNames = new Map();

        function checkForHelperClass(node) {
            const className = node.id?.name;

            if (!className) {
                return;
            }

            const baseEnumImport = importsNames.get('BaseEnum');

            if (node.superClass?.name === 'BaseEnum' && baseEnumImport === '@steroidsjs/nest/domain/base/BaseEnum') {
                helpersNames.set(className, node);
            }
        }

        return {
            TSEnumDeclaration(node) {
                const enumName = node.id.name;
                enumsNames.set(enumName, node);
            },

            ImportDeclaration(node) {
                const source = node.source.value;

                node.specifiers.forEach((specifier) => {
                    if (specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
                        importsNames.set(specifier.local.name, source);
                    }
                });
            },

            ClassDeclaration(node) {
                checkForHelperClass(node);
            },

            'Program:exit'() {
                for (const helperName of helpersNames.keys()) {
                    if (!Array.from(enumsNames.keys()).some(value => helperName.startsWith(value))) {
                        context.report({
                            node: helpersNames.get(helperName),
                            messageId: 'missingEnum',
                            data: {
                                helperName,
                            },
                        });
                    }
                }
            },
        };
    },
};
