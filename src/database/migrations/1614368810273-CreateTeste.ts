import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTeste1614368810273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "teste",
        columns: [{ name: "id", type: "uuid", isPrimary: true }],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("teste");
  }
}
