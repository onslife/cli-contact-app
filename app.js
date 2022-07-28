// Import module
import fs from 'fs';
import readline from 'readline'
import { Console } from "console";
import { Transform } from "stream";
import chalk from 'chalk';

// Cek Ketersediaan Direktori Data
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// Cek ketersediaan file contact.json
const fileDataPath = './data/contact.json';
try {
    fs.readFileSync(fileDataPath);
} catch (err) {
    fs.writeFileSync(fileDataPath, "[]", 'utf-8');
}

const data = JSON.parse(fs.readFileSync(fileDataPath, 'utf-8'));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const open = chalk`{bgHex('#27282e').rgb(200,200,250)
==================================================
========== }{bgHex('#27282e').rgb(200,190,10) Program Pengolahan Data Kontak}{bgHex('#27282e').rgb(200,200,250) =========
==================================================}

[1] {rgb(0, 140, 255) 📃 Daftar kontak}     [2] {rgb(20,200,10) ➕ Masukan kontak baru}
[3] {rgb(200,10,10) 📤 Keluar}

Pilih ==>  `;

const masukan = chalk`{bgHex('#27282e').rgb(200,200,250).bold
==================================================
================ }{bgHex('#27282e').rgb(20,200,10).bold ➕ Masukan data}{bgHex('#27282e').rgb(200,200,250).bold  =================
==================================================}`;

const tanya = () => {
    return new Promise(resolve => {
        rl.question(open, (pilihan) => {
            resolve(pilihan);
        })
    })
};

function masukanData(data) {
    rl.question(masukan + "\nMasukan nama : ", (nama) => {
        rl.question("masukan noHp : ", (noHp) => {
            const newData = { nama, noHp };
            data.push(newData);

            // Masukan Data ke contact.json
            fs.writeFileSync(fileDataPath, JSON.stringify(data), 'utf-8');
            console.log(chalk`\n {bgHex('#167d04').rgb(250,250,250).bold ===== Data berhasil di tambahkan =====}`)
            app(data);
        });
    });
};

function table(input) {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');
        result += `${r}\n`;
    }
    console.log(chalk`\n{bgHex('#27282e').bold ==================================================
================ }{bgHex('#27282e').bold.rgb(0, 140, 255) 📃 Daftar kontak}{bgHex('#27282e').bold  ================
==================================================}`)
    console.log(result);
};

const app = async (data) => {
    const pilihan = await tanya()
    if (pilihan == '1') {
        data != '' ? table(data) : console.log("Data belum ada");
        app(data)
    } else if (pilihan == '2') {
        masukanData(data);
        app(data)
    } else if (pilihan == '3') {
        rl.close()
    } else {
        app(data);
    }
};

// jalankan app
app(data)