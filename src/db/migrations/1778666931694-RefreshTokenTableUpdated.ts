import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshTokenTableUpdated1778666931694 implements MigrationInterface {
    name = 'RefreshTokenTableUpdated1778666931694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "token" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "token" character varying NOT NULL`);
    }

}
