const express = require('express');
const pdf = require('pdf-parse');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const nlp = require('compromise');
const os = require('os');
bodyParser = require('body-parser');

const app = express();
const port = 4000;

let files = []
const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/im;
const emailRegex = /\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(fileUpload());
// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));
const fileFolder = 'uploads/'

app.post('/parse', (req, res) => {
    const pdfFile = req.files.pdfFile

    // Save File
    pdfFile.mv(fileFolder + req.files.pdfFile.name, e => {
        if (e) return res.status(500).send(e);
        res.send('File uploaded');
    });

    console.log('Received request')
    console.log(req.files.pdfFile)
    pdf(req.files.pdfFile).then(result => {
        let wordCounts = count(result.text);

        let phone = phoneRegex.exec(result.text)
        phone = phone == null ? 'null' : phone[0]

        let email = emailRegex.exec(result.text);
        email = email == null ? 'null' : email[0]

        let doc = nlp(result.text);
        let names = doc.people().normalize().text();
        let name = names.split(' ').slice(0, 2).join(' ') // first 2 words in `names` string

        files.push({
            fileName: pdfFile.name,
            wordCounts: wordCounts,
            phone: phone,
            email: email,
            name: name
        })
    })

})

app.get('/search/:query', (req, res) => {
    let searchQuery = req.params.query.toLowerCase();

    let queryMatches = []

    for (let i = 0; i < files.length; i++) {
        let currFile = files[i];
        if (searchQuery in currFile.wordCounts) {
            queryMatches.push({ ...currFile, fileIndex: i })
        }
    }

    res.json(queryMatches);
})

app.get('/download/:fileIndex', (req, res) => {
    let filePath = fileFolder + files[req.params.fileIndex].fileName;

    res.download(filePath);
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});

function count(str) {
    var obj = {};

    str.split(" ").forEach(function (el, i, arr) {
        let ele = el.toLowerCase();
        ele.replace(/\W/g, '')

        obj[ele] = obj[ele] ? ++obj[ele] : 1;
    });

    return obj;
}