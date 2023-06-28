const express = require('express');
const mongoose = require('mongoose');
var flash = require('connect-flash');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
const shortId = require('shortid');
const session = require('express-session');

const app = express();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shortUrl');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}))
app.use(flash());

const srtUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    srturl: {
        type: String,
        required: true,
        default: shortId.generate
    },
});


const srtUrl = mongoose.model('srtUrl', srtUrlSchema);
app.get('/', async (req, res) => {
    res.render('index');
})

app.post('/create', async (req, res) => {
    const fullUrl = req.body.cUrl;
    const Note = req.body.cNote;
    const url = await srtUrl.find({ fullurl: fullUrl });
    const note = await srtUrl.find({ note: Note });

    // console.log(note);
    if (note.length > 0) {
        req.flash('success6', "Note already exists")
        return res.redirect('/');
    }

    if (url.length == 0) {
        const shortUrl = new srtUrl({
            fullurl: fullUrl,
            note: Note
        })

        let temp = shortUrl.save();
        if (temp) {
            req.flash('success1', "Short URL created successfully")
            req.flash('success3', fullUrl)
        }

        res.redirect('/');
    }
    else {
        // console.log("note already exists1212")
        req.flash('success2', "Short URL already exists, you can search short url here")
        res.redirect('/')

    }
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`server started on port ${port}`);
});
