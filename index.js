#!/usr/bin/env node
const { ArgumentParser } = require('argparse');
const path = require('path');
const fs = require('fs');
const { version } = require('./package.json');
const { exit } = require('process');
const { execSync } = require('child_process');

const command = `ffmpeg -hide_banner -i "$1" -c:v dnxhd -profile:v dnxhr_hq -pix_fmt yuv422p -c:a pcm_s16le "$2"`

const parser = new ArgumentParser({
    description: 'Quickway to convert alot of files'
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

const exts = data.ext.split('/');

console.log("Filter extensions:", exts);

inpps.filter(x => x.isDirectory()).forEach(dir => {
    let full = path.join(dir.parentPath, dir.name);
    const rel = full.replace(data.input + "/", "");
    fs.mkdirSync(path.join(data.output, rel), {recursive: true});
});

inpps.filter(x => x.isFile()).forEach(file => {
    let full = path.join(file.parentPath, file.name);
    let rel = full.replace(data.input + "/", "");
    const ext = path.extname(full);
    const index = exts.findIndex(x => x == ext);
    if(index == -1) return;
    rel = rel.replaceAll(ext, ".mov");
    const com = command
        .replaceAll("$1", full)
        .replaceAll("$2", path.join(data.output, rel));
    console.log("command:", com);
    execSync(com,
        {
            stdio: [0, 1, 2]
        }
    );
});
