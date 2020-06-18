import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUserTable1591152257381
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar' },
          { name: 'lastname', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          {
            name: 'user_type',
            type: 'varchar',
            length: '1',
            default: `'P'::character varying`,
          },
          {
            name: 'birthday',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'avatar',
            type: 'varchar',
            default: `'default.png'::character varying`,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mobile',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email_verification',
            type: 'boolean',
            default: `false`,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address_number',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'aditional_info',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cap',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
