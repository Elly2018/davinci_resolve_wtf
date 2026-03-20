#!/usr/bin/env node
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');
const { version } = require('./package.json');
const { exit } = require('process');

const parser = new ArgumentParser({
    description: 'Argparse example'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-i', '--input', { help: 'The input source folder', default: '.' });
parser.add_argument('-o', '--output', { help: 'The output source folder', default: './../result' });
parser.add_argument('-e', '--ext', { help: 'Filter extensions', default: '.mp4/.mov/.mkv/.wmv/.flv'  });
parser.add_argument('-f', '--force', { help: 'Overwrite exist files, 0: Skip, 1: YES', default: 0 });

const data = JSON.parse(JSON.stringify(parser.parse_args()));

data.input = path.resolve(data.input);
data.output = path.resolve(data.output);

if(!fs.existsSync(data.input)){
    console.error("Are you kidding me, You give me a path that does not exist?")
    console.error("Path: " + data.input);
    exit(0);
}

if(!fs.existsSync(data.output)){
    fs.mkdirSync(data.output, { recursive: true });
}

const inpps = fs.readdirSync(data.input, {
    withFileTypes: true,
    recursive: true,
})

inpps.filter(x => x.isDirectory()).forEach(dir => {
    let rel = path.join(dir.parentPath, dir.name);
    rel = rel.replace(data.input + "/", "");
    fs.mkdirSync(path.join(data.output, rel), {recursive: true});
});