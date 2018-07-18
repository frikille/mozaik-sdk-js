if [ "$CI" != true ]; then
  echo "\n\n\n  \033[101;30m Only CI can publish to NPM. \033[0m" 1>&2;
  echo "\n\n\n  \033[101;30m If you publish locally, make sure that you do not commit anything after publis and you clean up the branch. \033[0m" 1>&2;
  exit 1;
fi;

npm run build
# cp -r ./lib/* ./