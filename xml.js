const fs = require('fs');

//Render XML files as links
function renderFileLinks() {
  //Get all XML files
  let xmlFiles;
  fs.readdir('./data', (err, files)=>{
    console.log(files);
    xmlFiles = files;
    //map through files and create html link
    let count = 1;
    xmlFiles.map(file =>{
      let xmlFile = document.createElement('a');
      xmlFile.className = "xml-link"
      xmlFile.innerText = count++;
      // xmlFile.href = `data/${file}`;
      xmlFile.addEventListener('click', function(){
        convertedDiv.innerText = "";
        convertedDiv.className = "";
        //add loading
        loadXML(`data/${file}`);
      });
      document.getElementById('links').appendChild(xmlFile);
    })
  })
}

//Onclick load and convert contents of file
function loadXML(file) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this);
      // console.log(this.responseXML);
      // console.log(this.responseText);
      xml.convertXML(this.responseText);
    }
  }
  xhttp.open("GET", file, true);
  xhttp.send();
}

//Convert XML
function convertXML(data) {
  // use the DOMParser browser API to convert text to a Document
  let XML = new DOMParser().parseFromString(data, "text/xml");
  console.log(XML);

  let x = XML.documentElement.childNodes;
  let txt;
  let htmlContainer = document.createElement('div');
  htmlContainer.className = "htmlContainer";
  let xIcon = document.createElement('div');
  xIcon.id = "xIcon";
  xIcon.innerHTML += "<h6 class='xIcon'>X</h6></br>";
  htmlContainer.appendChild(xIcon);

  document.getElementById('converted-data').innerText = "";
  document.getElementById('converted-data').className = "";

  for (let i = 0; i < x.length; i++) {
    // console.log(x[i].nodeName);
    // console.log(x[i]);
    if (x[i].childNodes.length > 0 ){
      // console.log(x[i].childNodes[0].nodeValue);
      // console.log(x[i].childNodes);
      for (let y = 0; y <x[i].childNodes.length; y++) {
        // console.log(x[i].childNodes[y].textContent);
        txt = "<div class='converted'>" + x[i].childNodes[y].textContent + "</div></br>";
        htmlContainer.innerHTML += txt;
      }
      document.getElementById('converted-data').appendChild(htmlContainer);
      document.getElementById('converted-data').className = "converted-data";
      //Remove data
      document.querySelector("#xIcon").addEventListener('click', function(){
        console.log('clicked!');
        document.getElementById('converted-data').innerText = "";
        document.getElementById('converted-data').className = "";
      });
    }
  }
}

module.exports = { convertXML, loadXML, renderFileLinks };
