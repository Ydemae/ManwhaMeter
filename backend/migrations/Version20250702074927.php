<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250702074927 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__book AS SELECT id, name, description, image_path, is_active, status, book_type FROM book');
        $this->addSql('DROP TABLE book');
        $this->addSql('CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, creator_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1000) DEFAULT NULL, image_path VARCHAR(255) NOT NULL, is_active BOOLEAN NOT NULL, status VARCHAR(255) NOT NULL, book_type VARCHAR(255) NOT NULL, CONSTRAINT FK_CBE5A33161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO book (id, name, description, image_path, is_active, status, book_type) SELECT id, name, description, image_path, is_active, status, book_type FROM __temp__book');
        $this->addSql('DROP TABLE __temp__book');
        $this->addSql('CREATE INDEX IDX_CBE5A33161220EA6 ON book (creator_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__book AS SELECT id, name, description, image_path, is_active, status, book_type FROM book');
        $this->addSql('DROP TABLE book');
        $this->addSql('CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1000) DEFAULT NULL, image_path VARCHAR(255) NOT NULL, is_active BOOLEAN NOT NULL, status VARCHAR(255) NOT NULL, book_type VARCHAR(255) NOT NULL)');
        $this->addSql('INSERT INTO book (id, name, description, image_path, is_active, status, book_type) SELECT id, name, description, image_path, is_active, status, book_type FROM __temp__book');
        $this->addSql('DROP TABLE __temp__book');
    }
}
