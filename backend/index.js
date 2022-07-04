const express = require('express');
const pdf = require('pdf-parse');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const port = 4000;

let files = []
const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/im;
const emailRegex = /\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.post('/parse', (req, res) => {
    console.log('Received request')

    pdf(req.files.pdf).then(result => {
        let fileData = count(result.text);
        
        let phone = phoneRegex.exec(result.text)
        phone = phone == null ? 'null' : phone[0]

        let email = emailRegex.exec(result.text);
        email = email == null ? 'null' : email[0]

        files.push({
            file: req.files.pdf,
            phone: phone,
            email: email
        })

        console.log(files);
    })

})

app.get('/search', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});

function count(str) {
    var obj = {};
    
    str.split(" ").forEach(function(el, i, arr) {
      obj[el] = obj[el] ? ++obj[el] : 1;
    });
    
    return obj;
  }