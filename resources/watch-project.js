#!/usr/bin/env node

const path = require('path');
const Kefir = require('kefir');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const flowRemoveTypes = require('flow-remove-types');

const JS_PATTERN = '**/*.js';

const resetColor = '\x1b[0m';
const greenText = '\x1b[32m';

const destination = './lib';

function kefirCopyFile(src, dest) {
  return Kefir.fromPromise(fs.copy(src, dest)).map(() => ({ src, dest }));
}

function runCommand() {
  return Kefir.merge(
    ['./src'].map(src => {
      let filesToCopy;
      const watcher = chokidar.watch(JS_PATTERN, {
        cwd: src,
      });
      filesToCopy = Kefir.merge([
        Kefir.fromEvents(watcher, 'add'),
        Kefir.fromEvents(watcher, 'change'),
      ]);

      return filesToCopy.map(match => ({ src, match }));
    })
  )
    .flatMap(pair => {
      const srcPath = path.join(pair.src, pair.match);
      const destPath = path.join(destination, pair.match);
      const destPathFlow = path.join(destination, pair.match + '.flow');
      var input = fs.readFileSync(srcPath, 'utf8');
      var output = flowRemoveTypes(input);
      fs.writeFileSync(destPath, output.toString());

      return kefirCopyFile(srcPath, destPathFlow);
    })
    .takeErrors(1)
    .onValue(result => {
      // eslint-disable-next-line
      console.log(`${greenText}Transpiled file:${resetColor} ${result.src}`);
    })
    .scan((list, result) => {
      list.push(result);
      return list;
    }, [])
    .toPromise();
}

runCommand();
