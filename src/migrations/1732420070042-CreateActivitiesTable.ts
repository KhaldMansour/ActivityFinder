import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivitiesTable1732420070042 implements MigrationInterface {
  name = 'CreateActivitiesTable1732420070042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `activities` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `price` float NOT NULL, `rating` float NULL, `hasOffer` tinyint NOT NULL DEFAULT 0, `user_id` int NULL, INDEX `IDX_13ed6c247f66cc50e29ebec1da` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('ALTER TABLE `activities` ADD CONSTRAINT `FK_b82f1d8368dd5305ae7e7e664c2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `activities` DROP FOREIGN KEY `FK_b82f1d8368dd5305ae7e7e664c2`');
    await queryRunner.query('DROP INDEX `IDX_13ed6c247f66cc50e29ebec1da` ON `activities`');
    await queryRunner.query('DROP TABLE `activities`');
  }
}
