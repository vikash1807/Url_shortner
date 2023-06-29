const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');


const app = express();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shortUrl');

}

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}))
app.use(flash());




const srtUrlSchema = new mongoose.Schema({
    fullurl: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    
})

const SrtUrl = mongoose.model('SrtUrl', srtUrlSchema);


// app.get('/', async (req, res) => {
//     res.render('home');
// })

app.get('/search', async (req, res) => {
    let temp1 = 
    res.render('search',{tr2:req.flash('tr2')});
})


app.get('/', async (req, res) => {
    // let temp3 = req.flash('tr5')
    // let temp4 = req.flash('tr6')
    const url2 = await SrtUrl.find({ fullurl:req.flash('tr3')});

    console.log(await SrtUrl.find({ fullurl:req.flash('tr3')}));
    res.render('index',{tr1: req.flash('tr1'),tr3:url2});
})



app.post('/create', async (req, res) => {
    const FullUrl = req.body.cUrl;
    const Note = req.body.cNote;
    const url = await SrtUrl.find({ fullurl: FullUrl });
    const note = await SrtUrl.find({ note: Note });

    // console.log(note);
    // if (note.length > 0) {
    //     req.flash('tr6', "Note already exists")
    //     return res.redirect('/index');
    // }

    if (url.length == 0) {
        const shortUrl = new SrtUrl({
            fullurl: FullUrl,
            note: Note
        })
        // shortUrl.save()

        // console.log(shortUrl);
        let temp = shortUrl.save();
        if (temp) {
            req.flash('tr1', "Short URL created trfully")
            req.flash('tr3', FullUrl)
        }

        res.redirect('/');
    }
    else {
        // console.log("note already exists1212")
        req.flash('tr2', "Short URL already exists, you can search short url here")
        res.redirect('/search')

    }
})

// app.post('/search', async (req, res) => {
//     const FullUrl1 = req.body.fullUrl1;
//     let Note1 = req.body.note1;
//     let url1;
//     // console.log(FullUrl1,Note1);
//     if (FullUrl1 == "" && Note1 == "") {
//         req.flash('tr6', "Fill out one of the section below to search");
//         return res.redirect('/search');
//     }
//     if (FullUrl1 != "") {
//         url1 = await ShortUrl.find({ fullurl: FullUrl1 });
//     }
//     else if (Note1 != "") {
//         url1 = await ShortUrl.find({ note: Note1 });
//     }

//     // console.log(url1)

//     if (url1.length > 0) {
//         req.flash('tr4', url1);
//         res.redirect('/search');
//     }
//     else {
//         req.flash('tr5', "Short URL not exists, you can create short url here")
//         res.redirect('/index')
//     }

// })

app.get('/:shortUrl', async (req, res) => {
    const temp = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (temp == null) return res.sendStatus(404);

    temp.save();
    res.redirect(temp.fullurl);
})



const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`server started on port ${port}`);
});






