const express = require('express');
const path=require('path');
const app = express();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const {mergefunction}=require('./merging');
const fs = require('fs');


const port=3000;

app.use(express.static(path.join(__dirname,"../Frontend/")));
app.use('/static',express.static("mergedfiles"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,"../Frontend/index.html"));
})

// app.post('/merge', upload.array('mypdfs', 2), async function (req, res, next) {

//   const d=await mergefunction(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))
//   console.log('sended for merging');
  
//   res.redirect(`http://localhost:3000/static/${d}.pdf` );
//   // console.log(req.files);
//   // res.end;
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// })

app.post('/merge', upload.array('mypdfs', 2), async function (req, res, next) {
  const p1Path = path.join(__dirname, req.files[0].path);
  const p2Path = path.join(__dirname, req.files[1].path);

  const d = await mergefunction(p1Path, p2Path);

  const mergedPdfPath = path.join(__dirname, 'mergedfiles', `${d}.pdf`);

  // Send the merged PDF as a response
  res.sendFile(mergedPdfPath, {}, function (err) {
    if (err) {
      console.error('Error sending the merged PDF:', err);
      res.status(err.status).end();
    } else {
      // Delete the merged PDF file after it's been served
      setTimeout(() => {
        fs.unlink(mergedPdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting the merged PDF:', unlinkErr);
          } else {
            console.log('Merged PDF deleted successfully.');
          }
        });
      }, 1000);
    }

    res.sendFile(path.join(__dirname,"../Frontend/index.html"));
  });
});

app.get('/merge', function (req, res) {
  res.sendFile(path.join(__dirname,"../Frontend/index.html"));
})
  


app.listen(port,()=>{
    console.log("server has started");
})