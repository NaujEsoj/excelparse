import { read, utils } from "xlsx";
import { useState } from "react";
//import loading from "../assets/img/loading.gif";

function Parse() {

  const [loadingIcon, setLoadingIcon] = useState(null);

  const handleFile = async (e) => {
    setLoadingIcon(true)
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data, {type:"binary", cellDates: true});

    const allFilteredData = [];

    for (let key in workbook.SheetNames) {
      const workSheet = workbook.Sheets[workbook.SheetNames[key]];
      const rawData = utils.sheet_to_json(workSheet, { header: 1 });


      //name Combined cells
      let hotelName = '';
      rawData.forEach(r => hotelName = r[0] = (r[0] != null ? r[0] : hotelName));


      // Remove anything after "\r"
      const removeAfterCR = (Hname) => {
        if (typeof Hname === "string") {
          return Hname.split("\r")[0].trim();
        } else {
          return Hname; // Return the Hotel NAme as it is, if not a string
        }
      };

      // Apply the function to each element of the arrays using map
      const  modifiedData = rawData.map((arr) => arr.map(removeAfterCR));

      // Filter arrays containing the specified names
      const namesToFilter = ["Royal Decameron Mompiche", "Decameron Mompiche", "Decameron Club Caribbean", "Grand Decameron Montego Beach", "Grand Decameron Cornwall", "Grand Decameron Los Cabos", "Decameron Isla Coral", "Decameron Los Cocos", "Decameron La Marina", "Grand Decameron Complex", "Royal Decameron Punta Centinela", "Royal Decameron Punta Sal", "Grand Decameron Panama", "Grand Decameron Panamá", "Grand Decameron Panama PLUS", "Royal Decameron Salinitas", "Punta Sal", "El Pueblo", "Aquarium", "Delfines", "Isleño", "Marazul", "Maryland", "San Luis", "Baru", "Barú", "Baru Plus", "Cartagena", "Galeon", "Galeón", "Heliconias", "Panaca", "Ticuna", "San Pedro", "Rancho Tota", "Santa Ines", "Mompiche", "Centinela", "Salinitas", "Panama", "Panama Plus", "Indigo", "Cornwall", "Club Caribbean", "Montego", "Complex", "Los Cocos", "La Marina", "Isla Coral", "Los Cabos", "Panamá",
        "mompiche",
        "punta centinela",
        "club caribbean",
        "montego beach",
        "cornwall",
        "los cabos",
        "los cabos plus",
        "isla coral",
        "los cocos",
        "la marina",
        "complex",
        "panama",
        "panama plus",
        "salinitas",
        "punta sal",
        "punta sal plus",
        "el pueblo",
        "aquarium",
        "delfines",
        "isleno",
        "marazul",
        "maryland",
        "san luis",
        "baru",
        "baru plus",
        "cartagena",
        "galeon",
        "heliconias",
        "panaca",
        "ticuna",
        "san pedro",
        "rancho tota",
        "santa ines"
      ];

      let filteredData = [];

      for (let key in modifiedData) {
        if (modifiedData[key][0] === "") {
            modifiedData[key].shift(); // Remove the first element if it's an empty string
        }
      }

/*       console.log(modifiedData);
      modifiedData.forEach(subArray => {
        if (typeof subArray === "string") {
          subArray[1] = subArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
      }); */

      filteredData = modifiedData.filter(arr => {
        const name = arr[0];
        return namesToFilter.includes(name);
      });

      filteredData.forEach(subArray => {
        subArray[1] = new Date(subArray[1]).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
        if (typeof subArray[2] === 'number') {
            subArray[2] = Math.round(subArray[2] * 100) / 100; // Rounding to three decimal places
        }
      });


      allFilteredData.push(filteredData);

      /* //creating a array element for each date
      filteredData.forEach(arr => {
        const startDate = new Date(arr[1]);
        //const endDate = new Date(arr[2]);

        for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
          const newEntry = [...arr];
          newEntry[1] = currentDate.toLocaleDateString('en-EN');

          if (newEntry.length >= 3) {
            newEntry.splice(2, 1); // Remove 1 element starting at index 2 (third element)
          }
          allFilteredData.push(newEntry);
        }
      }); */



    }

    const allFilteredData2 = allFilteredData[0];

    //Generates a JSON file with the sheetName object
    const fileName = "filtered_data.json"; // Customize file name
    const jsonData = JSON.stringify(allFilteredData2, null, 2); // Format JSON with indentation

    // Create a Blob object
    const blob = new Blob([jsonData], { type: "application/json" });

    if (window.navigator.webkitURL) { // WebKit-based browsers
      const blobURL = window.navigator.webkitURL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = fileName;
      link.click();
    } else { // Non-WebKit browsers
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setLoadingIcon(false);

  };

  return (
    <div className="w-fill flex h-screen">
      <div className="m-auto bg-white w-96 h-96 bg-opacity-20 rounded-md">
        <h1 className="text-6xl p-4 text-slate-50">Excel parse!</h1>
        <p className="p-8 text-slate-50 text-3xl">Please upload excel file:</p>
        <input className="block w-full text-sm text-slate-500 file:m-4 file:p-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-fuchsia-600 hover:file:bg-violet-100" type="file" onChange={(e) => handleFile(e)} />
        <div>{loadingIcon && (<img src="{loading}" alt="" />)}</div>
      </div>
    </div>
  );
}

export default Parse;
