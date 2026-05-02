<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260408163431 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE billboard_announcement (id SERIAL NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, message VARCHAR(10000) NOT NULL, active BOOLEAN NOT NULL, title VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN billboard_announcement.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE book (id SERIAL NOT NULL, creator_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1000) DEFAULT NULL, image_path VARCHAR(255) NOT NULL, is_active BOOLEAN NOT NULL, status VARCHAR(255) NOT NULL, book_type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CBE5A33161220EA6 ON book (creator_id)');
        $this->addSql('CREATE TABLE book_tag (book_id INT NOT NULL, tag_id INT NOT NULL, PRIMARY KEY(book_id, tag_id))');
        $this->addSql('CREATE INDEX IDX_F2F4CE1516A2B381 ON book_tag (book_id)');
        $this->addSql('CREATE INDEX IDX_F2F4CE15BAD26311 ON book_tag (tag_id)');
        $this->addSql('CREATE TABLE book_report (id SERIAL NOT NULL, book_id INT NOT NULL, reason VARCHAR(2000) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_EDF87C0916A2B381 ON book_report (book_id)');
        $this->addSql('COMMENT ON COLUMN book_report.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE rating (id SERIAL NOT NULL, book_id INT NOT NULL, user_id INT NOT NULL, story INT NOT NULL, feeling INT NOT NULL, characters INT NOT NULL, art_style INT NOT NULL, comment VARCHAR(6000) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D889262216A2B381 ON rating (book_id)');
        $this->addSql('CREATE INDEX IDX_D8892622A76ED395 ON rating (user_id)');
        $this->addSql('CREATE TABLE rating_report (id SERIAL NOT NULL, rating_id INT NOT NULL, reason VARCHAR(2000) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_EBDD1D0CA32EFC6 ON rating_report (rating_id)');
        $this->addSql('COMMENT ON COLUMN rating_report.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE reading_list_entry (id SERIAL NOT NULL, user_id INT NOT NULL, book_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_3ADDC75A76ED395 ON reading_list_entry (user_id)');
        $this->addSql('CREATE INDEX IDX_3ADDC7516A2B381 ON reading_list_entry (book_id)');
        $this->addSql('CREATE TABLE refresh_tokens (id SERIAL NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('CREATE TABLE register_invite (id SERIAL NOT NULL, creator_id INT DEFAULT NULL, uid VARCHAR(36) NOT NULL, used BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, exp_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7452683D539B0606 ON register_invite (uid)');
        $this->addSql('CREATE INDEX IDX_7452683D61220EA6 ON register_invite (creator_id)');
        $this->addSql('COMMENT ON COLUMN register_invite.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN register_invite.exp_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE tag (id SERIAL NOT NULL, label VARCHAR(80) NOT NULL, is_active BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_389B783EA750E8 ON tag (label)');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, profile_picture VARCHAR(255) DEFAULT NULL, active BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME ON "user" (username)');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN "user".updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE messenger_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_75EA56E0FB7336F0 ON messenger_messages (queue_name)');
        $this->addSql('CREATE INDEX IDX_75EA56E0E3BD61CE ON messenger_messages (available_at)');
        $this->addSql('CREATE INDEX IDX_75EA56E016BA31DB ON messenger_messages (delivered_at)');
        $this->addSql('COMMENT ON COLUMN messenger_messages.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE OR REPLACE FUNCTION notify_messenger_messages() RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(\'messenger_messages\', NEW.queue_name::text);
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;');
        $this->addSql('DROP TRIGGER IF EXISTS notify_trigger ON messenger_messages;');
        $this->addSql('CREATE TRIGGER notify_trigger AFTER INSERT OR UPDATE ON messenger_messages FOR EACH ROW EXECUTE PROCEDURE notify_messenger_messages();');
        $this->addSql('ALTER TABLE book ADD CONSTRAINT FK_CBE5A33161220EA6 FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE book_tag ADD CONSTRAINT FK_F2F4CE1516A2B381 FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE book_tag ADD CONSTRAINT FK_F2F4CE15BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE book_report ADD CONSTRAINT FK_EDF87C0916A2B381 FOREIGN KEY (book_id) REFERENCES book (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE rating ADD CONSTRAINT FK_D889262216A2B381 FOREIGN KEY (book_id) REFERENCES book (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE rating ADD CONSTRAINT FK_D8892622A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE rating_report ADD CONSTRAINT FK_EBDD1D0CA32EFC6 FOREIGN KEY (rating_id) REFERENCES rating (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reading_list_entry ADD CONSTRAINT FK_3ADDC75A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reading_list_entry ADD CONSTRAINT FK_3ADDC7516A2B381 FOREIGN KEY (book_id) REFERENCES book (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE register_invite ADD CONSTRAINT FK_7452683D61220EA6 FOREIGN KEY (creator_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE book DROP CONSTRAINT FK_CBE5A33161220EA6');
        $this->addSql('ALTER TABLE book_tag DROP CONSTRAINT FK_F2F4CE1516A2B381');
        $this->addSql('ALTER TABLE book_tag DROP CONSTRAINT FK_F2F4CE15BAD26311');
        $this->addSql('ALTER TABLE book_report DROP CONSTRAINT FK_EDF87C0916A2B381');
        $this->addSql('ALTER TABLE rating DROP CONSTRAINT FK_D889262216A2B381');
        $this->addSql('ALTER TABLE rating DROP CONSTRAINT FK_D8892622A76ED395');
        $this->addSql('ALTER TABLE rating_report DROP CONSTRAINT FK_EBDD1D0CA32EFC6');
        $this->addSql('ALTER TABLE reading_list_entry DROP CONSTRAINT FK_3ADDC75A76ED395');
        $this->addSql('ALTER TABLE reading_list_entry DROP CONSTRAINT FK_3ADDC7516A2B381');
        $this->addSql('ALTER TABLE register_invite DROP CONSTRAINT FK_7452683D61220EA6');
        $this->addSql('DROP TABLE billboard_announcement');
        $this->addSql('DROP TABLE book');
        $this->addSql('DROP TABLE book_tag');
        $this->addSql('DROP TABLE book_report');
        $this->addSql('DROP TABLE rating');
        $this->addSql('DROP TABLE rating_report');
        $this->addSql('DROP TABLE reading_list_entry');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE register_invite');
        $this->addSql('DROP TABLE tag');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
