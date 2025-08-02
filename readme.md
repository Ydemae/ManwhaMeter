# ManwhaMeter

## Introduction

The goal of this project is to create an app to rate and list books, be it manga, webtoons, or novels.
I personally want this to be a platform for me and my friends to share our recommendations.

Any feedback would be appreciated, wether it is about possible improvements or features you might want to see in the app.

This file is kind of a notebook for me to remember commands until I set up an automatic deployment process.
A proper and cleaner documentation may come with later versions.

## Credits

<a href="https://www.flaticon.com/free-icons/eye" title="eye icons">Eye icons created by Gregor Cresnar - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/eye-password" title="eye password icons">Eye password icons created by sonnycandra - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/copy" title="copy icons">Copy icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/education" title="education icons">Education icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/no" title="No icons">No icons created by Ylivdesign - Flaticon</a>

## How to deploy

Clone git repo

```bash
git clone https://github.com/Ydemae/ManwhaMeter.git
cd ManwhaMeter
```

Setup your symfony .env.local

```bash
sudo vim backend/.env.local
```

Copy database (It's the only way for the time being)

```bash
scp -r ./backend/data user@remote:path/to/project/backend/data
```

Build docker images :

```bash
sudo docker build -f symfony-php.dockerfile -t symfony-php:latest .
sudo docker build -f custom-nginx.dockerfile -t custom-nginx:latest .
```

Transpile angular app to js :

```bash
docker compose --profile build run angular-build
```

Deploy :

```bash
docker compose --env-file .env.local up
```

JWT certs generation

```bash
sudo docker exec -it symfony
php bin/console lexik:jwt:generate-keypair
```

setup the db

```bash
php bin/console doctrine:migrations:version --delete --all
php bin/console doctrine:schema:drop --force
php bin/console doctrine:schema:create
php bin/console doctrine:migrations:diff
```

Create an invite

```bash
INSERT INTO register_invite (uid, used, created_at, exp_date) VALUES ('6cac456385174911bfe9b40618ba4f15', false, NOW(), NOW() + interval '1 day');
```

Then create a user and reset it
