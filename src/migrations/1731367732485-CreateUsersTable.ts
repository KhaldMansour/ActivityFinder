import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1731367732485 implements MigrationInterface {
  name = 'CreateUsersTable1731367732485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `isAdmin` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`',
    );
    await queryRunner.query('DROP TABLE `users`');
  }
}
