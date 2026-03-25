const {RuleTester} = require('eslint');
const rule = require('../required-enum-field-enum-name');

const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },
});

const withImport = code => `
import { EnumField } from '@steroidsjs/nest/infrastructure/decorators/fields';
${code}
`;

ruleTester.run('enum-field-enum-name', rule, {
    valid: [
        withImport(`
        class Foo {
            @EnumField({ enum: StatusEnum, enumName: 'StatusEnum' })
            status: string;
        }
        `),
        withImport(`
        class Foo {
            @EnumField({ enumName: 'StatusEnum', enum: StatusEnum, isArray: true })
            statuses: string[];
        }
        `),
        `
        class Foo {
            @OtherDecorator({ enum: StatusEnum })
            status: string;
        }
        `,
        `
        import { EnumField } from 'some-other-package';
        class Foo {
            @EnumField({ enum: StatusEnum })
            status: string;
        }
        `,
    ],
    invalid: [
        {
            code: withImport(`
            class Foo {
                @EnumField({ enum: StatusEnum })
                status: string;
            }
            `),
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: withImport(`
            class Foo {
                @EnumField({})
                status: string;
            }
            `),
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: withImport(`
            class Foo {
                @EnumField()
                status: string;
            }
            `),
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: withImport(`
            class Foo {
                @EnumField(someVar)
                status: string;
            }
            `),
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: withImport(`
            class Foo {
                @EnumField({ enum: StatusEnum, enumName: StatusEnum })
                status: string;
            }
            `),
            errors: [{messageId: 'invalidEnumName'}],
        },
        {
            code: withImport(`
            class Foo {
                @EnumField({ enum: StatusEnum, enumName: 123 })
                status: string;
            }
            `),
            errors: [{messageId: 'invalidEnumName'}],
        },
    ],
});