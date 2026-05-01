import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateToMenuItem1777675314358 implements MigrationInterface {
  name = 'MigrateToMenuItem1777675314358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipe_menus" RENAME TO "menu_items"`,
    );

    await queryRunner.query(
      `ALTER TABLE "menu_items" DROP CONSTRAINT "FK_55f55797f109cd008ad8162168e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_items" RENAME COLUMN "recipe_id" TO "item_id"`,
    );
    await queryRunner.query(`
        UPDATE "menu_items" mi
        SET "item_id" = i."id"
        FROM "items" i
        WHERE i."recipe_id" = mi."item_id"
    `);

    await queryRunner.query(
      `ALTER TABLE "menu_items" ADD CONSTRAINT "FK_426476682ea6b786c12cdccc8c2" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu_items" DROP CONSTRAINT "FK_426476682ea6b786c12cdccc8c2"`,
    );

    await queryRunner.query(`
        UPDATE "menu_items" mi
        SET "item_id" = i."recipe_id"
        FROM "items" i
        WHERE i."id" = mi."item_id"
    `);

    await queryRunner.query(
      `ALTER TABLE "menu_items" RENAME COLUMN "item_id" TO "recipe_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "menu_items" ADD CONSTRAINT "FK_55f55797f109cd008ad8162168e" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "menu_items" RENAME TO "recipe_menus"`,
    );
  }
}
