# Shengchao Lin's Personal Page

Instructions for using this repo.
1. Follow the [Jekyll instruction](https://jekyllrb.com/docs/) to make sure it is installed. Remember to check the prerequisite.
    * You can update the Ruby on Mac with RVM, `\curl -sSL https://get.rvm.io | bash -s stable`, and `rvm install ruby`. This will take a while.
2. Go the `shengchao-lin.github.io/docs/` and run `bundle install` to install all dependencies.
    * If faced with error "fatal error: 'openssl/ssl.h' file not found", try `brew install openssl` then `brew link --force openssl`.
4. Run `bundle exec jekyll serve`.
5. Go to `localhost:4000` to see the built website.

Trouble shooting:
* If you get errors like "fatal error: 'openssl/ssl.h' file not found", try to get `ssl.h` first. Do `gem install jekyll -- -- with-cppflags=-I/usr/local/opt/openssl/include`
