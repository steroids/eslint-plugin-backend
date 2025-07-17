const { RuleTester } = require('eslint');
const rule = require('../required-enum-to-helper');

const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('required-enum-to-helper', rule, {
    valid: [
        `
      import BaseEnum from '@steroidsjs/nest/domain/base/BaseEnum';

      export enum RolesEnum {
        Admin = 'admin',
        User = 'user',
        Guest = 'guest',
      }

      export class RolesEnumHelper extends BaseEnum {}
    `,
        `
      export class RolesEnumHelper {}
    `,
    ],
    invalid: [
        {
            code: `
      import BaseEnum from '@steroidsjs/nest/domain/base/BaseEnum';

      export class RolesEnum extends BaseEnum {
          static ADMIN = 'admin';
          static USER = 'user';

          static getLabels() {
              return {
                  [this.ADMIN]: 'Админ',
                  [this.USER]: 'Пользователь',
              };
          }
      }
    `,
            errors: [
                {
                    messageId: 'missingEnum',
                    data: {helperName: 'RolesEnum'},
                },
            ],
        }
    ],
});
