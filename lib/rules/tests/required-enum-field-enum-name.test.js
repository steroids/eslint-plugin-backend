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

ruleTester.run('enum-field-enum-name', rule, {
    valid: [
        `
        class Foo {
            @EnumField({ enum: StatusEnum, enumName: 'StatusEnum' })
            status: string;
        }
        `,
        `
        class Foo {
            @EnumField({ enumName: 'StatusEnum', enum: StatusEnum,  isArray: true })
            statuses: string[];
        }
        `,
        `
        class Foo {
            @OtherDecorator({ enum: StatusEnum })
            status: string;
        }
        `,
        `
        class Foo {
            @EnumField({ ...options })
            status: string;
        }
        `,
        `
        class Foo {
            @EnumField({ enumName: 'StatusEnum', ...options })
            status: string;
        }
        `,
    ],
    invalid: [
        {
            code: `
            class Foo {
                @EnumField({ enum: StatusEnum })
                status: string;
            }
            `,
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: `
            class Foo {
                @EnumField({})
                status: string;
            }
            `,
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: `
            class Foo {
                @EnumField()
                status: string;
            }
            `,
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: `
            class Foo {
                @EnumField(someVar)
                status: string;
            }
            `,
            errors: [{messageId: 'missingEnumName'}],
        },
        {
            code: `
            class Foo {
                @EnumField({ enum: StatusEnum, enumName: StatusEnum })
                status: string;
            }
            `,
            errors: [{messageId: 'invalidEnumName'}],
        },
        {
            code: `
            class Foo {
                @EnumField({ enum: StatusEnum, enumName: 123 })
                status: string;
            }
            `,
            errors: [{messageId: 'invalidEnumName'}],
        },
    ],
});