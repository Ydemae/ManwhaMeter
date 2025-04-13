# ManwhaMeter

## Introduction

The goal of this project is to create an app to rate and list books, be it manga, webtoons, or novels.
I personally want this to be a platform for me and my friends to share our recommandations.

This project is still in one of its early versions, don't be too harsh on it yet since it's only the beginning.
Any feedback would be appreciated, wether it is about possible improvements or functionnalities you might want to see in the app.

This file is kind of a notebook for me to remember commands until I set up an automatic deployment process.
Proper documentation will come with later versions.

## Credits
Logout icon by picons.


<a href="https://www.flaticon.com/free-icons/eye" title="eye icons">Eye icons created by Gregor Cresnar - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/eye-password" title="eye password icons">Eye password icons created by sonnycandra - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/copy" title="copy icons">Copy icons created by Freepik - Flaticon</a>

## How to deploy

Clone git repo
```
git clone https://github.com/Ydemae/ManwhaMeter.git
cd ManwhaMeter
```

Setup your symfony .env.local
```
sudo vim backend/.env.local
```

Copy database (It's the only way for the time being)
```
scp -r ./backend/data user@remote:path/to/project/backend/data
```


Build docker images :
```
sudo docker build -f angular-build.dockerfile -t angular-build:latest .
sudo docker build -f symfony-php.dockerfile -t symfony-php:latest .
sudo docker build -f custom-nginx.dockerfile -t custom-nginx:latest .
```

Deploy :
```
sudo docker compose up
```

JWT certs generation
```
sudo docker exec -it symfony
php bin/console lexik:jwt:generate-keypair
```