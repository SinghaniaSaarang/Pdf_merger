const PDFMerger = require('pdf-merger-js');

let merger = new PDFMerger();

const mergefunction=async (p1,p2) => {
  await merger.add(p1);  //merge all pages. parameter is the path to file and filename.
  await merger.add(p2); 
  
  let d=new Date().getTime().toLocaleString();
  await merger.save(`mergedfiles/${d}.pdf`); //save under given name and reset the internal document
  return d;
  
  // Export the merged PDF as a nodejs Buffer
  // const mergedPdfBuffer = await merger.saveAsBuffer();
  // fs.writeSync('merged.pdf', mergedPdfBuffer);
}

module.exports={mergefunction};