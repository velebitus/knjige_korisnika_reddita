let lastQuery = "all";

function populateTable(data) {
  const table = document.getElementById("tablica");
  table.innerHTML = "";

  const tableRow = table.insertRow();

  const datum = tableRow.insertCell(0);
  const link_reddit = tableRow.insertCell(1);
  const korisnik = tableRow.insertCell(2);
  const broj_upvote = tableRow.insertCell(3);
  const knjiga = tableRow.insertCell(4);
  const ISBN10 = tableRow.insertCell(5);
  const autori = tableRow.insertCell(6);
  const područje = tableRow.insertCell(7);
  const potpodručje = tableRow.insertCell(8);
  const link_amazon = tableRow.insertCell(9);
  const ocjena_amazon = tableRow.insertCell(10);

  datum.innerHTML = "datum";
  link_reddit.innerHTML = "link_reddit";
  korisnik.innerHTML = "korisnik";
  broj_upvote.innerHTML = "broj_upvote";
  knjiga.innerHTML = "knjiga";
  ISBN10.innerHTML = "ISBN10";
  autori.innerHTML = "autori";
  područje.innerHTML = "područje";
  potpodručje.innerHTML = "potpodručje";
  link_amazon.innerHTML = "link_amazon";
  ocjena_amazon.innerHTML = "ocjena_amazon";

  for (row of data) {
    const tableRow = table.insertRow();

    const datum = tableRow.insertCell(0);
    const link_reddit = tableRow.insertCell(1);
    const korisnik = tableRow.insertCell(2);
    const broj_upvote = tableRow.insertCell(3);
    const knjiga = tableRow.insertCell(4);
    const ISBN10 = tableRow.insertCell(5);
    const autori = tableRow.insertCell(6);
    const područje = tableRow.insertCell(7);
    const potpodručje = tableRow.insertCell(8);
    const link_amazon = tableRow.insertCell(9);
    const ocjena_amazon = tableRow.insertCell(10);

    datum.innerHTML = row.datum.slice(0, 10);
    link_reddit.innerHTML = `<a href=${row.link_reddit}>  link </a>`;
    korisnik.innerHTML = row.korisnik;
    broj_upvote.innerHTML = row.broj_upvote;
    knjiga.innerHTML = row.knjiga;
    ISBN10.innerHTML = row.ISBN10;
    autori.innerHTML = row.autori
      .map((a) => `${a.ime} ${a.prezime.trim()}`)
      .join(", ");
    područje.innerHTML = row.područje;
    potpodručje.innerHTML = row.potpodručje;
    link_amazon.innerHTML = `<a href=${row.link_amazon}>  link </a>`;
    ocjena_amazon.innerHTML = row.ocjena_amazon;
  }
}

const formUpit = document.forms["upit"];

formUpit.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = formUpit.querySelector('input[type="text"]').value;

  const radioSelection = document.querySelector(
    'input[name="chooseField"]:checked'
  ).value;

  if (radioSelection == "sve") {
    populateData();
  } else if (!value) {
    populateData();
  } else if (radioSelection == "wildcard") {
    populateData(`allFields\\${value}`);
  } else {
    populateData(`${radioSelection}\\${value}`);
  }
});

async function populateData(path = "all") {
  const url = `http://localhost:3000/${path}`;
  lastQuery = url;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    if (result) populateTable(result);
  } catch (error) {
    console.error(error.message);
  }
}

populateData();

async function getData(url = "all") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

function downloadObjectAsJson(exportObj, exportName) {
  let dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj, null, 2));
  let downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function convertToCsv(object) {
  let headers = Object.keys(object[0]);
  headers = headers.splice(1);
  const csvArr = [];
  csvArr.push(headers);
  const main = object.map((row) => {
    const arr = [];
    for (field in row) {
      if (
        field != "autori" &&
        field != "područje" &&
        field != "potpodručje" &&
        field != "_id"
      ) {
        arr.push(row[field]);
      }

      if (field == "autori") {
        const autori = [];
        for (autor of row.autori) {
          autori.push(`${autor.ime} ${autor.prezime}`);
        }
        arr.push(autori.join(";"));
      }

      if (field == "područje" || field == "potpodručje") {
        const fieldValues = [];
        for (thing of row[field]) {
          fieldValues.push(thing);
        }
        arr.push(fieldValues.join(";"));
      }
    }
    csvArr.push(arr);
  });

  let csvString = "";
  for (item of csvArr) {
    let itemStringify = JSON.stringify(item);
    csvString =
      csvString + `${itemStringify.substring(1, itemStringify.length - 1)}\n`;
  }

  return csvString;
}

async function downloadObjectAsCsv(exportObj, exportName) {
  let csvStr = convertToCsv(exportObj);
  let dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvStr);
  let downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".csv");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

const datatableJsonDownload = document.getElementById("datatableJsonDownload");
const datatableCsvDownload = document.getElementById("datatableCSVDownload");

datatableJsonDownload.addEventListener("click", async function (e) {
  e.preventDefault();
  const filename = "data";
  const jsonObj = await getData(lastQuery);
  downloadObjectAsJson(jsonObj, filename);
});

datatableCsvDownload.addEventListener("click", async function (e) {
  e.preventDefault();
  const filename = "data";
  const jsonObj = await getData(lastQuery);
  downloadObjectAsCsv(jsonObj, filename);
});
