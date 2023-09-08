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
  // res.download(mergedPdfPath);
  res.download(mergedPdfPath, {}, function (err) {
    if (err) {
      console.error('Error sending the merged PDF:', err);
      res.status(err.status).end();
    } else {
      // Delete the merged PDF file after it's been served
      fs.unlink(p1Path, (unlinkErr1) => {
        if (unlinkErr1) {
          console.error('Error deleting the path1 PDF:', unlinkErr1);
        } else {
          console.log('path1 PDF deleted successfully.');
        }
      });
      fs.unlink(p2Path, (unlinkErr2) => {
        if (unlinkErr2) {
          console.error('Error deleting the path2 PDF:', unlinkErr2);
        } else {
          console.log('path2 PDF deleted successfully.');
        }
      });
      fs.unlink(mergedPdfPath, (unlinkErr3) => {
        if (unlinkErr3) {
          console.error('Error deleting the merged PDF:', unlinkErr3);
        } else {
          console.log('Merged PDF deleted successfully.');
        }
      });
    };
  });
});

  // Send the merged PDF as a response
  // res.download(mergedPdfPath, {}, function (err) {
    // if (err) {
    //   console.error('Error sending the merged PDF:', err);
    //   res.status(err.status).end();
    // } else {
    //   // Delete the merged PDF file after it's been served
    //   setTimeout(() => {
    //     fs.unlink(mergedPdfPath, (unlinkErr) => {
    //       if (unlinkErr) {
    //         console.error('Error deleting the merged PDF:', unlinkErr);
    //       } else {
    //         console.log('Merged PDF deleted successfully.');
    //       }
    //     });
    //   }, 1000);

    //   setTimeout(() => {
    //     res.redirect('/');
    //   }, 5000);
    // }
  // });
// });

  


app.listen(port,()=>{
    console.log("server has started");
})