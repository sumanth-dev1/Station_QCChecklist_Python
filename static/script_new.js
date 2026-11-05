let unsavedChanges=false;
const rowImages = new Map(); // Store images for each row
// Delegated event listener: if an <input>, <select>, or <textarea> changes anywhere
// in the document, set unsavedChanges=true.
document.addEventListener("change", function (event) {
  if (event.target.matches("input, select, textarea")) {
    unsavedChanges = true;
  }
});
const k=0
// Variables to store station info from session or none
let stationId = "";
let stationName = "";
let zone = [];
let division = [];
let sectionName=[];
let initialDate = "";
let updatedDate = "";

var data = [];



// Update division dropdown based on selected zone
function updateDivisionNames() {
  const zoneSelect = document.getElementById("zone");
  const divisionSelect = document.getElementById("division");
  const selectedZone = zoneSelect.value;

  console.log("updateDivisionNames called with zone:", selectedZone);

  // Store the current division value to restore it if possible
  const currentDivision = divisionSelect.value;
  console.log("Current division value:", currentDivision);

  // Clear existing options
  divisionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

  // If no zone is selected, don't populate divisions
  if (!selectedZone) {
    console.log("No zone selected, returning early");
    return;
  }

  // Define all divisions with their corresponding zones
  const divisions = [
    { name: "Mumbai", zone: "CR" },
    { name: "Nagpur", zone: "CR" },
    { name: "Bhusawal", zone: "CR" },
    { name: "Pune", zone: "CR" },
    { name: "Sholapur", zone: "CR" },
    { name: "Howrah-COO", zone: "ER" },
    { name: "Pt Deendayal Upadhy - Pradhankhnta", zone: "ECR" },
    { name: "Matura-Palwal", zone: "NCR" },
    { name: "Jhansi", zone: "NCR" },
    { name: "Nanded-Aurangabad", zone: "SCR" },
    { name: "Vijayawada - Ballarshah", zone: "SCR" },
    { name: "Bangalore - Mysore", zone: "SWR" },
    { name: "Bajva - Ahmedabad", zone: "WR" },
    { name: "Ahmedabad", zone: "WR" },
    { name: "Ratlam", zone: "WR" },
    { name: "Rajkot", zone: "WR" },
    { name: "Bhopal", zone: "WCR" },
    { name: "Matura-Nagda", zone: "WCR" }
  ];

  // Filter divisions for the selected zone
  const filteredDivisions = divisions.filter(div => div.zone === selectedZone);

  // Add filtered divisions to the dropdown
  filteredDivisions.forEach(div => {
    const option = document.createElement("option");
    option.value = div.name;
    option.text = div.name;
    option.setAttribute("data-zone", div.zone);
    if (div.name === currentDivision) {
      option.selected = true;
    }
    divisionSelect.appendChild(option);
  });

  // If no divisions are available for the selected zone, ensure the dropdown is reset
  if (filteredDivisions.length === 0) {
    divisionSelect.value = "";
  }

  console.log("updateDivisionNames completed. Final division value:", divisionSelect.value);
}

function updateSectionNames() {
  const zoneSelect = document.getElementById("zone");
  const sectionSelect = document.getElementById("section-name");
  const selectedZone = zoneSelect.value;

  console.log("updateSectionNames called with zone:", selectedZone);

  // Store the current section value to restore it if possible
  const currentSection = sectionSelect.value;
  console.log("Current division value:", currentSection);

  // Clear existing options
  sectionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

  // If no zone is selected, don't populate sections
  if (!selectedZone) {
    console.log("No zone selected, returning early");
    return;
  }

  // Define all sections with their corresponding zones
  const sections = [
    { name: "Mumbai", zone: "CR" },
    { name: "Nagpur", zone: "CR" },
    { name: "Bhusawal", zone: "CR" },
    { name: "Pune", zone: "CR" },
    { name: "Sholapur", zone: "CR" },
    { name: "Howrah-COO", zone: "ER" },
    { name: "Pt Deendayal Upadhy - Pradhankhnta", zone: "ECR" },
    { name: "Matura-Palwal", zone: "NCR" },
    { name: "Jhansi", zone: "NCR" },
    { name: "Nanded-Aurangabad", zone: "SCR" },
    { name: "Vijayawada - Ballarshah", zone: "SCR" },
    { name: "Bangalore - Mysore", zone: "SWR" },
    { name: "Bajva - Ahmedabad", zone: "WR" },
    { name: "Ahmedabad", zone: "WR" },
    { name: "Ratlam", zone: "WR" },
    { name: "Rajkot", zone: "WR" },
    { name: "Bhopal", zone: "WCR" },
    { name: "Matura-Nagda", zone: "WCR" }
  ];

  // Filter sections for the selected zone
  const filteredSections = sections.filter(sec => sec.zone === selectedZone);

  // Add filtered sections to the dropdown
  filteredSections.forEach(sec => {
    const option = document.createElement("option");
    option.value = sec.name;
    option.text = sec.name;
    option.setAttribute("data-zone", sec.zone);
    if (sec.name === currentSection) {
      option.selected = true;
    }
    sectionSelect.appendChild(option);
  });

  // If no sections are available for the selected zone, ensure the dropdown is reset
  if (filteredSections.length === 0) {
    sectionSelect.value = "";
  }

  console.log("updateSectionNames completed. Final section value:", sectionSelect.value);
}




// In showSection, decide if it's okay to switch sections, and if so, highlight the new button.
async function showSection(section) {
  if (unsavedChanges) {
    const proceed = confirm("You have unsaved changes in this section. Do you want to continue?");
    if (!proceed) {
      return;
    } else {
      unsavedChanges = false;
    }
  }

  const buttons = document.querySelectorAll(".sidebar .button");
  buttons.forEach(btn => btn.classList.remove("active"));

  const newActiveBtn = [...buttons].find(btn => {
    return btn.getAttribute('onclick') === `showSection('${section}')`;
  });

  if (newActiveBtn) {
    newActiveBtn.classList.add("active");
  }



  const mainContent = document.getElementById("main-content");
  const currentDate = new Date().toISOString().split("T")[0];

  const storedLocal = localStorage.getItem("stationDetails");
  const storedSession = sessionStorage.getItem("stationInfo");

  console.log("Stored session data:", storedSession);

  let stationInfo = {};
  if (storedLocal) {
    stationInfo=JSON.parse(storedLocal);
  }
  else if(storedSession){
    stationInfo=JSON.parse(storedSession);
  } else {
    stationInfo = {
      stationId: "",
      stationName: "",
      zone: "",
      division: "",
      sectionName: "",
      initialDate: "",
      updatedDate: ""
    };
    console.log("No stored session data, using default station info");
  }



  /*const stationId = document.getElementById("station-id")?.value;
  const division = document.getElementById("division")?.value;
  const zone = document.getElementById("zone")?.value;*/
  const stationId=stationInfo.stationId;
  const division=stationInfo.division;
  const zone=stationInfo.zone;


  let backendSectionId=section;
    if (["0.0","2.0","3.0","4.0","5.0","6.0","7.0"].includes(section)) {
    backendSectionId = parseInt(section, 10);
  }


  const exists = await checkExistingObservations(stationId, division, zone, backendSectionId);

  setTimeout(() => {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
      const saveBtn = actionButtons.querySelector('#save-btn');
      const getDetailsBtn = actionButtons.querySelector('#get-details-btn');
      const updateBtn = actionButtons.querySelector('#update-btn');

      if (exists) {
        if (saveBtn) saveBtn.style.display = 'none';
        if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
        if (updateBtn) updateBtn.style.display = 'none';
      } else {
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (getDetailsBtn) getDetailsBtn.style.display = 'none';
        if (updateBtn) updateBtn.style.display = 'none';
      }
    }
  }, 100);

  const stationIdElem = document.getElementById("station-id");
  if (stationIdElem) {
    stationIdElem.value = stationInfo.stationId || "";
  }

  const stationNameElem = document.getElementById("station-name");
  if (stationNameElem) {
    stationNameElem.value = stationInfo.stationName || "";
  }

   const zoneElem = document.getElementById("zone");
  if (zoneElem) {
    // Temporarily remove the onchange event to prevent updateDivisionNames from being called
    const originalOnChange = zoneElem.getAttribute('onchange');
    zoneElem.removeAttribute('onchange');

    zoneElem.value = stationInfo.zone || "";

    // If zone is set, update division dropdown and then set division value
    if (stationInfo.zone) {
      updateDivisionNames();
      // Set division value after a short delay to ensure dropdown is populated
      setTimeout(() => {
        const divisionElem = document.getElementById("division");
        if (divisionElem && stationInfo.division) {
          divisionElem.value = stationInfo.division;
          console.log("Setting division value to:", stationInfo.division);
        }
      }, 50);

      updateSectionNames();
      // Set section value after a short delay to ensure dropdown is populated.

      setTimeout(()=>{
        const sectionNameElem=document.getElementById("section-name");
        if(sectionNameElem && stationInfo.sectionName){
          sectionNameElem.value=stationInfo.sectionName;
          console.log("Setting section value to:", stationInfo.sectionName);
        }
      },50);
    }

    // Restore the onchange event
    if (originalOnChange) {
      zoneElem.setAttribute('onchange', originalOnChange);
    }
  } else {
    // If zone is not set, still try to set division value
    const divisionElem = document.getElementById("division");
    if (divisionElem) {
      divisionElem.value = stationInfo.division || "";
    }

    const sectionNameElem = document.getElementById("section-name");
    if (sectionNameElem) {
      sectionNameElem.value = stationInfo.sectionName || "";
  }
}
  const initialDateElem = document.getElementById("initial-date");
  if (initialDateElem) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    initialDateElem.value = `${year}-${month}-${day}`;
  }

  const updatedDateElem = document.getElementById("updated-date");
  if (updatedDateElem) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    updatedDateElem.value = `${year}-${month}-${day}`;
  }

  const stationDetailsHTML = `
    <div id="form-container">
      <section>
        <form id="stationForm" action="connect" method="POST" onsubmit="event.preventDefault(); return false;">
          <table class="detail-box station-table">
            <tr>
              <td><strong>Station ID:</strong><input type="text" id="station-id" placeholder="Enter the Station ID" value="${stationInfo ? stationInfo.stationId : ""}"></td>
              <td><strong>Station Name:</strong><input type="text" id="station-name" placeholder="Enter the Station Name" value="${stationInfo ? stationInfo.stationName : ""}"></td>
              <td><strong>Zone:</strong>
                <select name="zone" id="zone" onchange="updateDivisionNames()">
                  <option value="" disabled selected>Select</option>
                  <option value="CR" ${stationInfo && stationInfo.zone === "CR" ? "selected" : ""}>Central Railway</option>
                  <option value="ER" ${stationInfo && stationInfo.zone === "ER" ? "selected" : ""}>Eastern Railway</option>
                  <option value="ECR" ${stationInfo && stationInfo.zone === "ECR" ? "selected" : ""}>East Central Railway</option>
                  <option value="ECoR" ${stationInfo && stationInfo.zone === "ECoR" ? "selected" : ""}>East Coast Railway</option>
                  <option value="NR" ${stationInfo && stationInfo.zone === "NR" ? "selected" : ""}>Northern Railway</option>
                  <option value="NCR" ${stationInfo && stationInfo.zone === "NCR" ? "selected" : ""}>North Central Railway</option>
                  <option value="NER" ${stationInfo && stationInfo.zone === "NER" ? "selected" : ""}>North Eastern Railway</option>
                  <option value="NFR" ${stationInfo && stationInfo.zone === "NFR" ? "selected" : ""}>North Frontier Railway</option>
                  <option value="NWR" ${stationInfo && stationInfo.zone === "NWR" ? "selected" : ""}>North Western Railway</option>
                  <option value="SR" ${stationInfo && stationInfo.zone === "SR" ? "selected" : ""}>Southern Railway</option>
                  <option value="SCR" ${stationInfo && stationInfo.zone === "SCR" ? "selected" : ""}>South Central Railway</option>
                  <option value="SER" ${stationInfo && stationInfo.zone === "SER" ? "selected" : ""}>South Eastern Railway</option>
                  <option value="SECR" ${stationInfo && stationInfo.zone === "SECR" ? "selected" : ""}>South East Central Railway</option>
                  <option value="SWR" ${stationInfo && stationInfo.zone === "SWR" ? "selected" : ""}>South Western Railway</option>
                  <option value="WR" ${stationInfo && stationInfo.zone === "WR" ? "selected" : ""}>Western Railway</option>
                  <option value="WCR" ${stationInfo && stationInfo.zone === "WCR" ? "selected" : ""}>West Central Railway</option>
                </select>
              </td>
              <td><strong>Division:</strong>
                <select id="division">
                  <option value="" disabled selected>Select</option>
                  <option value="Mumbai" data-zone="CR" ${stationInfo && stationInfo.division === "Mumbai" ? "selected" : ""}>Mumbai</option>
                  <option value="Nagpur" data-zone="CR" ${stationInfo && stationInfo.division === "Nagpur" ? "selected" : ""}>Nagpur</option>
                  <option value="Bhusawal" data-zone="CR" ${stationInfo && stationInfo.division === "Bhusawal" ? "selected" : ""}>Bhusawal</option>
                  <option value="Pune" data-zone="CR" ${stationInfo && stationInfo.division === "Pune" ? "selected" : ""}>Pune</option>
                  <option value="Sholapur" data-zone="CR" ${stationInfo && stationInfo.division === "Sholapur" ? "selected" : ""}>Sholapur</option>
                  <option value="Howrah-COO" data-zone="ER" ${stationInfo && stationInfo.division === "Howrah-COO" ? "selected" : ""}>Howrah-COO</option>
                  <option value="Pt Deendayal Upadhy - Pradhankhnta" data-zone="ECR" ${stationInfo && stationInfo.division === "Pt Deendayal Upadhy - Pradhankhnta" ? "selected" : ""}>Pt Deendayal Upadhy - Pradhankhnta</option>
                  <option value="Matura-Palwal" data-zone="NCR" ${stationInfo && stationInfo.division === "Matura-Palwal" ? "selected" : ""}>Matura-Palwal</option>
                  <option value="Jhansi" data-zone="NCR" ${stationInfo && stationInfo.division === "Jhansi" ? "selected" : ""}>Jhansi</option>
                  <option value="Nanded-Aurangabad" data-zone="SCR" ${stationInfo && stationInfo.division === "Nanded-Aurangabad" ? "selected" : ""}>Nanded-Aurangabad</option>
                  <option value="Vijayawada - Ballarshah" data-zone="SCR" ${stationInfo && stationInfo.division === "Vijayawada - Ballarshah" ? "selected" : ""}>Vijayawada - Ballarshah</option>
                  <option value="Bangalore - Mysore" data-zone="SWR" ${stationInfo && stationInfo.division === "Bangalore - Mysore" ? "selected" : ""}>Bangalore - Mysore</option>
                  <option value="Bajva - Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.division === "Bajva - Ahmedabad" ? "selected" : ""}>Bajva - Ahmedabad</option>
                  <option value="Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.division === "Ahmedabad" ? "selected" : ""}>Ahmedabad</option>
                  <option value="Ratlam" data-zone="WR" ${stationInfo && stationInfo.division === "Ratlam" ? "selected" : ""}>Ratlam</option>
                  <option value="Rajkot" data-zone="WR" ${stationInfo && stationInfo.division === "Rajkot" ? "selected" : ""}>Rajkot</option>
                  <option value="Bhopal" data-zone="WCR" ${stationInfo && stationInfo.division === "Bhopal" ? "selected" : ""}>Bhopal</option>
                  <option value="Matura-Nagda" data-zone="WCR" ${stationInfo && stationInfo.division === "Matura-Nagda" ? "selected" : ""}>Matura-Nagda</option>
                </select>
              </td>
             <td><strong>Section :</strong>
                <select id="section-name">
                  <option value="" disabled selected>Select</option>
                  <option value="Mumbai" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Mumbai" ? "selected" : ""}>Mumbai</option>
                  <option value="Nagpur" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Nagpur" ? "selected" : ""}>Nagpur</option>
                  <option value="Bhusawal" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Bhusawal" ? "selected" : ""}>Bhusawal</option>
                  <option value="Pune" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Pune" ? "selected" : ""}>Pune</option>
                  <option value="Sholapur" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Sholapur" ? "selected" : ""}>Sholapur</option>
                  <option value="Howrah-COO" data-zone="ER" ${stationInfo && stationInfo.sectionName === "Howrah-COO" ? "selected" : ""}>Howrah-COO</option>
                  <option value="Pt Deendayal Upadhy - Pradhankhnta" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Pt Deendayal Upadhy - Pradhankhnta" ? "selected" : ""}>Pt Deendayal Upadhy - Pradhankhnta</option>
                  <option value="Matura-Palwal" data-zone="NCR" ${stationInfo && stationInfo.sectionName === "Matura-Palwal" ? "selected" : ""}>Matura-Palwal</option>
                  <option value="Jhansi" data-zone="NCR" ${stationInfo && stationInfo.sectionName === "Jhansi" ? "selected" : ""}>Jhansi</option>
                  <option value="Nanded-Aurangabad" data-zone="SCR" ${stationInfo && stationInfo.sectionName === "Nanded-Aurangabad" ? "selected" : ""}>Nanded-Aurangabad</option>
                  <option value="Vijayawada - Ballarshah" data-zone="SCR" ${stationInfo && stationInfo.sectionName === "Vijayawada - Ballarshah" ? "selected" : ""}>Vijayawada - Ballarshah</option>
                  <option value="Bangalore - Mysore" data-zone="SWR" ${stationInfo && stationInfo.sectionName === "Bangalore - Mysore" ? "selected" : ""}>Bangalore - Mysore</option>
                  <option value="Bajva - Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Bajva - Ahmedabad" ? "selected" : ""}>Bajva - Ahmedabad</option>
                  <option value="Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Ahmedabad" ? "selected" : ""}>Ahmedabad</option>
                  <option value="Ratlam" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Ratlam" ? "selected" : ""}>Ratlam</option>
                  <option value="Rajkot" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Rajkot" ? "selected" : ""}>Rajkot</option>
                  <option value="Bhopal" data-zone="WCR" ${stationInfo && stationInfo.sectionName === "Bhopal" ? "selected" : ""}>Bhopal</option>
                  <option value="Matura-Nagda" data-zone="WCR" ${stationInfo && stationInfo.sectionName === "Matura-Nagda" ? "selected" : ""}>Matura-Nagda</option>
                </select>
              </td>
              <td><strong>Initial Date:</strong><input type="date" id="initial-date" style="font-family: inherit; font-size: inherit; color: inherit; border: 1px solid #ccc; padding: 5px 10px;" /></td>
              <td><strong>Updated Date:</strong><input type="date" id="updated-date" style="font-family: inherit; font-size: inherit; color: inherit; border: 1px solid #ccc; padding: 5px 10px;" /></td>
            </tr>
          </table>
        </form>
      </section>
    </div>
  `;

  mainContent.innerHTML = stationDetailsHTML;
  console.log(k);

  // Note: Division dropdown is already populated in the HTML template above
  // and the zone value is already set, so updateDivisionNames() will be called
  // automatically when the zone dropdown's onchange event fires

  setTimeout(() => {
    const initialDateInput = document.getElementById("initial-date");
    if (initialDateInput) {
      let dateValue = stationInfo && stationInfo.initialDate ? new Date(stationInfo.initialDate) : new Date(currentDate);
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, "0");
      const day = String(dateValue.getDate()).padStart(2, "0");
      initialDateInput.value = `${year}-${month}-${day}`;
    } else {
      console.error('Input with id="initial-date" not found.');
    }
  }, 0);

  setTimeout(() => {
    const updatedDateInput = document.getElementById("updated-date");
    if (updatedDateInput) {
      let dateValue = stationInfo && stationInfo.updatedDate ? new Date(stationInfo.updatedDate) : new Date(currentDate);
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, "0");
      const day = String(dateValue.getDate()).padStart(2, "0");
      updatedDateInput.value = `${year}-${month}-${day}`;
    } else {
      console.error('Input with id="updated-date" not found.');
    }
  }, 0);

  // Dynamically load content based on the section clicked
  if (section === "0.0") {
    let saveBtnDisplay = "inline-block";
    let getDetailsBtnDisplay = "none";

    // Check if we came from the Edit button in viewReports
    const urlParams = new URLSearchParams(window.location.search);
    const stationIdFromUrl = urlParams.get('station_id');

    // If we came from the Edit button, show Get Details and hide Save
    if (stationIdFromUrl) {
      saveBtnDisplay = "none";
      getDetailsBtnDisplay = "inline-block";
    }
    mainContent.innerHTML += `
      <div class="actio-buttons">
         <button
          id="station-info-btn"
          type="button"
          onclick="saveStationInfo('station-info')"
          style="display:${saveBtnDisplay};"
        >
          Save Station Info
        </button>
        <button
          id="get-details-btn"
          data-section="0.0"
          onclick="getDetails()"
          style="display:${getDetailsBtnDisplay};"
        >
          Get Details
        </button>
        
      </div>
    `;
  }else if (section === "2.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading">VERIFICATION OF EQUIPMENT SERIAL NUMBERS AS PER INSPECTION CERTIFICATE (IC)</h3>
      <div class="table-container">
      <table class="observations" id="observations-section-2_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-2_0">
        <tr id="row-4">
        <td>1.1</td>
      <td class="observation_text" style="padding-right: 10px;">
    Stationary Kavach Unit
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "/>
  </td>
      <td>
        
    <select id="status-dropdown" onchange="highlightSelect(this)" style="width: 180px; padding: 5px; font-size: 14px;">

           <option value="Select">Select</option>
           <option value="Present">Present</option>
           <option value="Not Present">Not Present</option>
        </select>
      </td>
      <td class ="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
      </td>
      <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(4)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-4" style="display: none;">
      <button class="add-image" onclick="startCamera(4)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-4" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-4" accept="image/*" multiple onchange="displayImages(this, 4)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-4"></div>
      <!-- Camera Container -->
    <div id="camera-container-4" style="display: none;">
      <video id="camera-4" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(4)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(4)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(4)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-4" style="display: none;"></canvas>
    </div>
  </td>

    </tr>

    <tr id="row-5">
  <td>1.2</td>
  <td class="observation_text" style="padding-right: 10px;">
    Peripheral Processing Card 1
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "/>
  </td>
  

  
  <td class="select" style="padding-right: 10px;">
    <select id="status-dropdown" onchange="highlightSelect(this)" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  
  <td class="remarks" style="padding-right: 10px;">
    <textarea placeholder="Verify with IC" rows="2" cols="20" style="width: 180px; padding: 5px; font-size: 14px;"></textarea><br>
  </td>
  
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(5)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-5" style="display: none;">
      <button class="add-image" onclick="startCamera(5)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-5" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-5" accept="image/*" multiple onchange="displayImages(this, 5)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-5"></div>
      <!-- Camera Container -->
    <div id="camera-container-5" style="display: none;">
      <video id="camera-5" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(5)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(5)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(5)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-5" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-6">
  <td>1.3</td>
  <td class="observation_text" style="padding-right: 10px;">
    Peripheral Processing Card 2
    <input 
      type="text" 
      id="kavach-main-unit" 
      name="barcode_kavach_main_unit" 
      pattern="^\d{10,15}$" 
      title="Enter a number between 10 to 15 digits" 
      placeholder="Scan Barcode" 
      style="width:180px; padding:5px; font-size:14px;" 
      oninput="
        if (this.value.length > 15) this.value = this.value.slice(-15);
        toggleNotInstalledOption(this);
      "
    >
  </td>
  <td class="select" style="padding-right: 10px;">
    <select id="status-dropdown" onchange="highlightSelect(this)" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  
  <td class="remarks" style="padding-right: 10px;">
    <textarea placeholder="Verify with IC" rows="2" cols="20" style="width: 180px; padding: 5px; font-size: 14px;"></textarea><br>
  </td>
  
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(6)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-6" style="display: none;">
      <button class="add-image" onclick="startCamera(6)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-6" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-6" accept="image/*" multiple onchange="displayImages(this, 6)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-6"></div>
      <!-- Camera Container -->
    <div id="camera-container-6" style="display: none;">
      <video id="camera-6" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(6)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(6)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(6)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-6" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-7">
  <td>1.4</td>
  <td class="observation_text">
    Vital Computer Card 1
    <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  <td class="select">
    <select id="status-dropdown" onchange="highlightSelect(this)" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20" style="width: 180px; height: 50px; padding: 5px; font-size: 14px; margin-bottom: 10px;"></textarea><br>
  </td>
 <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(7)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-7" style="display: none;">
      <button class="add-image" onclick="startCamera(7)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-7" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-7" accept="image/*" multiple onchange="displayImages(this, 7)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-7"></div>
      <!-- Camera Container -->
    <div id="camera-container-7" style="display: none;">
      <video id="camera-7" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(7)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(7)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(7)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-7" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-8">
  <td>1.5</td>
   <td class="observation_text">
    Vital Computer Card 2<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
   oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  
  </td>
  <td class="select">
    <select id="status-dropdown" onchange="highlightSelect(this)" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20" style="width: 180px; height: 50px; padding: 5px; font-size: 14px; margin-bottom: 10px;"></textarea><br>
  </td>
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(8)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-8" style="display: none;">
      <button class="add-image" onclick="startCamera(8)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-8" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-8" accept="image/*" multiple onchange="displayImages(this, 8)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-8"></div>
      <!-- Camera Container -->
    <div id="camera-container-8" style="display: none;">
      <video id="camera-8" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(8)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(8)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(8)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-8" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-9">
  <td>1.6</td>
   <td class="observation_text">
    Vital Computer Card 3<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </td>
  
  <td class="select">
    <select id="status-dropdown" onchange="highlightSelect(this)" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20" style="width: 180px; height: 50px; padding: 5px; font-size: 14px; margin-bottom: 10px;"></textarea><br>
  </td>
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(9)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-9" style="display: none;">
      <button class="add-image" onclick="startCamera(9)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-9" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-9" accept="image/*" multiple onchange="displayImages(this, 9)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-9"></div>
      <!-- Camera Container -->
    <div id="camera-container-9" style="display: none;">
      <video id="camera-9" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(9)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(9)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(9)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-9" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-10">
  <td>1.7</td>
  <td class="observation_text">
     Voter Card 1<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </td>
  <td class="select">
    <select id="status-dropdown" onchange="highlightSelect(this)">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(10)">Add Image</button>
    <div class="upload-options" id="upload-options-10" style="display: none;">
      <button class="add-image" onclick="startCamera(10)">Camera</button>
      <label for="file-input-10" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-10" accept="image/*" multiple onchange="displayImages(this, 10)">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-10"></div>
      <!-- Camera Container -->
    <div id="camera-container-10" style="display: none;">
      <video id="camera-10" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(10)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(10)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(10)">🔄 Switch Camera</button>
      <canvas id="canvas-10" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-11">
  <td>1.8</td>
  <td class="observation_text">
    Voter Card 2<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </td>
  <td class="select">
    <select id="status-dropdown" onchange="highlightSelect(this)">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(11)">Add Image</button>
    <div class="upload-options" id="upload-options-11" style="display: none;">
      <button class="add-image" onclick="startCamera(11)">Camera</button>
      <label for="file-input-11" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-11" accept="image/*" multiple onchange="displayImages(this, 11)">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-11"></div>
      <!-- Camera Container -->
    <div id="camera-container-11" style="display: none;">
      <video id="camera-11" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(11)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(11)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(11)">🔄 Switch Camera</button>
      <canvas id="canvas-11" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-12">
  <td>1.9</td>
  <td class="observation_text">
   Vital Gateway Card 1 <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  
  </td>
  <td class="select">
    <select id="status-dropdown" onchange="highlightSelect(this)">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(12)">Add Image</button>
    <div class="upload-options" id="upload-options-12" style="display: none;">
      <button class="add-image" onclick="startCamera(12)">Camera</button>
      <label for="file-input-12" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-12" accept="image/*" multiple onchange="displayImages(this, 12)">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-12"></div>
      <!-- Camera Container -->
    <div id="camera-container-12" style="display: none;">
      <video id="camera-12" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(12)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(12)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(12)">🔄 Switch Camera</button>
      <canvas id="canvas-12" style="display: none;"></canvas>
    </div>
  </td>
</tr>

          </tr>
          <tr id="row-13">
            <td>1.10</td>
           <td class="observation_text">Vital Gateway Card 2
           <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
           
          </td>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
              <td>
       <button class="add-image" onclick="showUploadOptions(13)">Add Image</button>
<div class="upload-options" id="upload-options-13" style="display: none;">
  <button class="add-image" onclick="startCamera(13)">Camera</button>
  <label for="file-input-13" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-13" accept="image/*" multiple onchange="displayImages(this, 13)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-13"></div>
      <!-- Camera Container -->
<div id="camera-container-13" style="display: none;">
  <video id="camera-13" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(13)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(13)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(13)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-13" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-14">
            <td >1.11</td>
           <td class="observation_text"> Vital Gateway Card 3
           <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
   oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> 
          </td>

        
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
             <td>
       <button class="add-image" onclick="showUploadOptions(14)">Add Image</button>
<div class="upload-options" id="upload-options-14" style="display: none;">
  <button class="add-image" onclick="startCamera(14)">Camera</button>
  <label for="file-input-14" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-14" accept="image/*" multiple onchange="displayImages(this, 14)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-14"></div>
      <!-- Camera Container -->
<div id="camera-container-14" style="display: none;">
  <video id="camera-14" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(14)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(14)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(14)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-14" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-15">
            <td>1.12</td>
           <td class="observation_text"> Dual GSM Card
        <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>  

            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
          <td>
       <button class="add-image" onclick="showUploadOptions(15)">Add Image</button>
<div class="upload-options" id="upload-options-15" style="display: none;">
  <button class="add-image" onclick="startCamera(15)">Camera</button>
 <label for="file-input-15" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-15" accept="image/*" multiple onchange="displayImages(this, 15)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-15"></div>
      <!-- Camera Container -->
<div id="camera-container-15" style="display: none;">
  <video id="camera-15" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(15)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(15)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(15)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-15" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-16">
            <td>1.13</td>
           <td class="observation_text">
  Field Scanner Card 1
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </div>
</td>

            <td class="select">
             <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(16)">Add Image</button>
<div class="upload-options" id="upload-options-16" style="display: none;">
  <button class="add-image" onclick="startCamera(16)">Camera</button>
  <label for="file-input-16" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-16" accept="image/*" multiple onchange="displayImages(this, 16)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-16"></div>
      <!-- Camera Container -->
<div id="camera-container-16" style="display: none;">
  <video id="camera-16" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(16)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(16)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(16)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-16" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-17">
            <td>1.14</td>
           <td class="observation_text">Field Scanner Card 2
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
   oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(17)">Add Image</button>
<div class="upload-options" id="upload-options-17" style="display: none;">
  <button class="add-image" onclick="startCamera(17)">Camera</button>
 <label for="file-input-17" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-17" accept="image/*" multiple onchange="displayImages(this, 17)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-17"></div>
      <!-- Camera Container -->
<div id="camera-container-17" style="display: none;">
  <video id="camera-17" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(17)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(17)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(17)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-17" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-18">
            <td>1.15</td>
           <td class="observation_text">Field Scanner Card 3
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(18)">Add Image</button>
<div class="upload-options" id="upload-options-18" style="display: none;">
  <button class="add-image" onclick="startCamera(18)">Camera</button>
<label for="file-input-18" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-18" accept="image/*" onchange="displayImages(this, 18)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-18"></div>
      <!-- Camera Container -->
<div id="camera-container-18" style="display: none;">
  <video id="camera-18" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(18)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(18)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(18)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-18" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-19">
            <td>1.16</td>
           <td class="observation_text">Field Scanner Card 4
           <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(19)">Add Image</button>
<div class="upload-options" id="upload-options-19" style="display: none;">
  <button class="add-image" onclick="startCamera(19)">Camera</button>
  <label for="file-input-19" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-19" accept="image/*" multiple onchange="displayImages(this, 19)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-19"></div>
      <!-- Camera Container -->
<div id="camera-container-19" style="display: none;">
  <video id="camera-19" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(19)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(19)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(19)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-19" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-20">
            <td>1.17</td>
           <td class="observation_text">Field Scanner Card 5
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(20)">Add Image</button>
<div class="upload-options" id="upload-options-20" style="display: none;">
  <button class="add-image" onclick="startCamera(20)">Camera</button>
 <label for="file-input-20" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-20" accept="image/*" multiple onchange="displayImages(this, 20)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-20"></div>
      <!-- Camera Container -->
<div id="camera-container-20" style="display: none;">
  <video id="camera-20" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(20)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(20)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(20)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-20" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-21">
            <td>1.18</td>
           <td class="observation_text">Field Scanner Card 6
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(21)">Add Image</button>
<div class="upload-options" id="upload-options-21" style="display: none;">
  <button class="add-image" onclick="startCamera(21)">Camera</button>
 <label for="file-input-21" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-21" accept="image/*" multiple onchange="displayImages(this, 21)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-21"></div>
      <!-- Camera Container -->
<div id="camera-container-21" style="display: none;">
  <video id="camera-21" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(21)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(21)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(21)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-21" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>

          <tr id="row-22">
            <td>1.19</td>
           <td class = "observation_text">Field Scanner Card 7
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(22)">Add Image</button>
<div class="upload-options" id="upload-options-22" style="display: none;">
  <button class="add-image" onclick="startCamera(22)">Camera</button>
  <label for="file-input-22" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22" accept="image/*" multiple onchange="displayImages(this, 22)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-22"></div>
      <!-- Camera Container -->
<div id="camera-container-22" style="display: none;">
  <video id="camera-22" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-222">
            <td>1.20</td>
           <td class = "observation_text">Field Scanner Card 8
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(222)">Add Image</button>
<div class="upload-options" id="upload-options-222" style="display: none;">
  <button class="add-image" onclick="startCamera(222)">Camera</button>
  <label for="file-input-222" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-222" accept="image/*" multiple onchange="displayImages(this, 222)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-222"></div>
      <!-- Camera Container -->
<div id="camera-container-222" style="display: none;">
  <video id="camera-222" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(222)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(222)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(222)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-222" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-223">
            <td>1.21</td>
           <td class = "observation_text">SMOCIP Unit
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(223)">Add Image</button>
<div class="upload-options" id="upload-options-223" style="display: none;">
  <button class="add-image" onclick="startCamera(223)">Camera</button>
  <label for="file-input-223" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-223" accept="image/*" multiple onchange="displayImages(this, 223)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-223"></div>
      <!-- Camera Container -->
<div id="camera-container-223" style="display: none;">
  <video id="camera-223" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(223)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(223)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(223)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-223" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-224">
            <td>1.22</td>
           <td class = "observation_text">Station Radio Power Supply card-1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(224)">Add Image</button>
<div class="upload-options" id="upload-options-224" style="display: none;">
  <button class="add-image" onclick="startCamera(224)">Camera</button>
  <label for="file-input-224" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-224" accept="image/*" multiple onchange="displayImages(this, 224)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-224"></div>
      <!-- Camera Container -->
<div id="camera-container-224" style="display: none;">
  <video id="camera-224" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(224)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(224)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(224)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-224" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-225">
            <td>1.23</td>
           <td class = "observation_text">Next Gen/. Cal Amp Radio Modem-1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(225)">Add Image</button>
<div class="upload-options" id="upload-options-225" style="display: none;">
  <button class="add-image" onclick="startCamera(225)">Camera</button>
  <label for="file-input-225" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-225" accept="image/*" multiple onchange="displayImages(this, 225)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-225"></div>
      <!-- Camera Container -->
<div id="camera-container-225" style="display: none;">
  <video id="camera-225" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(225)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(225)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(225)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-225" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-226">
            <td>1.24</td>
           <td class = "observation_text">Station Radio Power Supply card-2
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(226)">Add Image</button>
<div class="upload-options" id="upload-options-226" style="display: none;">
  <button class="add-image" onclick="startCamera(226)">Camera</button>
  <label for="file-input-226" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-226" accept="image/*" multiple onchange="displayImages(this, 226)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-226"></div>
      <!-- Camera Container -->
<div id="camera-container-226" style="display: none;">
  <video id="camera-226" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(226)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(226)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(226)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-226" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-2257865435764">
            <td>1.25</td>
           <td class = "observation_text">Next Gen/. Cal Amp Radio Modem-2
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(225)">Add Image</button>
<div class="upload-options" id="upload-options-225" style="display: none;">
  <button class="add-image" onclick="startCamera(225)">Camera</button>
  <label for="file-input-225" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-225" accept="image/*" multiple onchange="displayImages(this, 225)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-225"></div>
      <!-- Camera Container -->
<div id="camera-container-225" style="display: none;">
  <video id="camera-225" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(225)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(225)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(225)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-225" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-227">
            <td>1.26</td>
           <td class = "observation_text">GPS & GSM Antenna 1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(227)">Add Image</button>
<div class="upload-options" id="upload-options-227" style="display: none;">
  <button class="add-image" onclick="startCamera(227)">Camera</button>
  <label for="file-input-227" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-227" accept="image/*" multiple onchange="displayImages(this, 227)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-227"></div>
      <!-- Camera Container -->
<div id="camera-container-227" style="display: none;">
  <video id="camera-227" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(227)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(227)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(227)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-227" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-228">
            <td>1.27</td>
           <td class = "observation_text">GPS & GSM Antenna 2
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(228)">Add Image</button>
<div class="upload-options" id="upload-options-228" style="display: none;">
  <button class="add-image" onclick="startCamera(228)">Camera</button>
  <label for="file-input-228" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-228" accept="image/*" multiple onchange="displayImages(this, 228)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-228"></div>
      <!-- Camera Container -->
<div id="camera-container-228" style="display: none;">
  <video id="camera-228" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(228)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(228)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(228)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-228" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-2229">
            <td>1.28</td>
           <td class = "observation_text">DPS Card 1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2229)">Add Image</button>
<div class="upload-options" id="upload-options-2229" style="display: none;">
  <button class="add-image" onclick="startCamera(2229)">Camera</button>
  <label for="file-input-2229" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2229" accept="image/*" multiple onchange="displayImages(this, 2229)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2229"></div>
      <!-- Camera Container -->
<div id="camera-container-2229" style="display: none;">
  <video id="camera-2229" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2229)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2229)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2229)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2229" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-229">
            <td>1.29</td>
           <td class = "observation_text">DPS Card 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(229)">Add Image</button>
<div class="upload-options" id="upload-options-229" style="display: none;">
  <button class="add-image" onclick="startCamera(229)">Camera</button>
  <label for="file-input-229" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-229" accept="image/*" multiple onchange="displayImages(this, 229)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-229"></div>
      <!-- Camera Container -->
<div id="camera-container-229" style="display: none;">
  <video id="camera-229" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(229)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(229)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(229)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-229" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-230">
            <td>1.30</td>
           <td class = "observation_text">EMI Filter 1

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(230)">Add Image</button>
<div class="upload-options" id="upload-options-230" style="display: none;">
  <button class="add-image" onclick="startCamera(230)">Camera</button>
  <label for="file-input-230" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-230" accept="image/*" multiple onchange="displayImages(this, 230)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-230"></div>
      <!-- Camera Container -->
<div id="camera-container-230" style="display: none;">
  <video id="camera-230" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(230)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(230)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(230)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-230" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-231">
            <td>1.31</td>
           <td class = "observation_text">EMI Filter 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(231)">Add Image</button>
<div class="upload-options" id="upload-options-231" style="display: none;">
  <button class="add-image" onclick="startCamera(231)">Camera</button>
  <label for="file-input-231" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-231" accept="image/*" multiple onchange="displayImages(this, 231)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-231"></div>
      <!-- Camera Container -->
<div id="camera-container-231" style="display: none;">
  <video id="camera-231" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(231)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(231)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(231)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-231" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-232">
            <td>1.32</td>
           <td class = "observation_text">Media Converter 1

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(232)">Add Image</button>
<div class="upload-options" id="upload-options-232" style="display: none;">
  <button class="add-image" onclick="startCamera(232)">Camera</button>
  <label for="file-input-232" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-232" accept="image/*" multiple onchange="displayImages(this, 232)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-232"></div>
      <!-- Camera Container -->
<div id="camera-container-232" style="display: none;">
  <video id="camera-232" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(232)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(232)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(232)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-232" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-233">
            <td>1.33</td>
           <td class = "observation_text">Media Converter 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(233)">Add Image</button>
<div class="upload-options" id="upload-options-233" style="display: none;">
  <button class="add-image" onclick="startCamera(233)">Camera</button>
  <label for="file-input-233" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-233" accept="image/*" multiple onchange="displayImages(this, 233)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-233"></div>
      <!-- Camera Container -->
<div id="camera-container-233" style="display: none;">
  <video id="camera-233" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(233)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(233)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(233)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-233" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
            <tr id="row-234">
            <td>1.34</td>
           <td class = "observation_text">Media Converter 3

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(234)">Add Image</button>
<div class="upload-options" id="upload-options-234" style="display: none;">
  <button class="add-image" onclick="startCamera(234)">Camera</button>
  <label for="file-input-234" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-234" accept="image/*" multiple onchange="displayImages(this, 234)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-234"></div>
      <!-- Camera Container -->
<div id="camera-container-234" style="display: none;">
  <video id="camera-234" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(234)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(234)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(234)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-234" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-235">
            <td>1.35</td>
           <td class = "observation_text">Cable Extender

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(235)">Add Image</button>
<div class="upload-options" id="upload-options-235" style="display: none;">
  <button class="add-image" onclick="startCamera(235)">Camera</button>
  <label for="file-input-235" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-235" accept="image/*" multiple onchange="displayImages(this, 235)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-235"></div>
      <!-- Camera Container -->
<div id="camera-container-235" style="display: none;">
  <video id="camera-235" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(235)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(235)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(235)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-235" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-240">
            <td>1.36</td>
           <td class = "observation_text">RIU-COM 1

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(240)">Add Image</button>
<div class="upload-options" id="upload-options-240" style="display: none;">
  <button class="add-image" onclick="startCamera(240)">Camera</button>
  <label for="file-input-240" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-240" accept="image/*" multiple onchange="displayImages(this, 240)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-240"></div>
      <!-- Camera Container -->
<div id="camera-container-240" style="display: none;">
  <video id="camera-240" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(240)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(240)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(240)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-240" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-236">
            <td>1.37</td>
           <td class = "observation_text">RIU-COM 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(236)">Add Image</button>
<div class="upload-options" id="upload-options-236" style="display: none;">
  <button class="add-image" onclick="startCamera(236)">Camera</button>
  <label for="file-input-236" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-236" accept="image/*" multiple onchange="displayImages(this, 236)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-236"></div>
      <!-- Camera Container -->
<div id="camera-container-236" style="display: none;">
  <video id="camera-236" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(236)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(236)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(236)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-236" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-237">
            <td>1.38</td>
           <td class = "observation_text">FIU Termination Card 1

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(237)">Add Image</button>
<div class="upload-options" id="upload-options-237" style="display: none;">
  <button class="add-image" onclick="startCamera(237)">Camera</button>
  <label for="file-input-237" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-237" accept="image/*" multiple onchange="displayImages(this, 237)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-237"></div>
      <!-- Camera Container -->
<div id="camera-container-237" style="display: none;">
  <video id="camera-237" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(237)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(237)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(237)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-237" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-238">
            <td>1.39</td>
           <td class = "observation_text">FIU Termination Card 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(238)">Add Image</button>
<div class="upload-options" id="upload-options-238" style="display: none;">
  <button class="add-image" onclick="startCamera(238)">Camera</button>
  <label for="file-input-238" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-238" accept="image/*" multiple onchange="displayImages(this, 238)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-238"></div>
      <!-- Camera Container -->
<div id="camera-container-238" style="display: none;">
  <video id="camera-238" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(238)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(238)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(238)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-238" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-239">
            <td>1.40</td>
           <td class = "observation_text">FIU Termination Card 3

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(239)">Add Image</button>
<div class="upload-options" id="upload-options-239" style="display: none;">
  <button class="add-image" onclick="startCamera(239)">Camera</button>
  <label for="file-input-239" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-239" accept="image/*" multiple onchange="displayImages(this, 239)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-239"></div>
      <!-- Camera Container -->
<div id="camera-container-239" style="display: none;">
  <video id="camera-239" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(239)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(239)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(239)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-239" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-2390">
            <td>1.41</td>
           <td class = "observation_text">FIU Termination Card 4

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2390)">Add Image</button>
<div class="upload-options" id="upload-options-2390" style="display: none;">
  <button class="add-image" onclick="startCamera(2390)">Camera</button>
  <label for="file-input-2390" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2390" accept="image/*" multiple onchange="displayImages(this, 2390)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2390"></div>
      <!-- Camera Container -->
<div id="camera-container-2390" style="display: none;">
  <video id="camera-2390" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2390)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2390)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2390)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2390" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-2391">
            <td>1.42</td>
           <td class = "observation_text">FIU Termination Card 5

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2391)">Add Image</button>
<div class="upload-options" id="upload-options-2391" style="display: none;">
  <button class="add-image" onclick="startCamera(2391)">Camera</button>
  <label for="file-input-2391" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2391" accept="image/*" multiple onchange="displayImages(this,2391)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2391"></div>
      <!-- Camera Container -->
<div id="camera-container-2391" style="display: none;">
  <video id="camera-2391" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2391)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2391)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2391)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2391" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>


          <tr id="row-2392">
            <td>1.43</td>
           <td class = "observation_text">FIU Termination Card 6

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2392)">Add Image</button>
<div class="upload-options" id="upload-options-2392" style="display: none;">
  <button class="add-image" onclick="startCamera(2392)">Camera</button>
  <label for="file-input-2392" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2392" accept="image/*" multiple onchange="displayImages(this, 2392)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2392"></div>
      <!-- Camera Container -->
<div id="camera-container-2392" style="display: none;">
  <video id="camera-2392" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2392)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2392)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2392)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2392" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-2393">
            <td>1.44</td>
           <td class = "observation_text">FIU Termination Card 7

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2393)">Add Image</button>
<div class="upload-options" id="upload-options-2393" style="display: none;">
  <button class="add-image" onclick="startCamera(2393)">Camera</button>
  <label for="file-input-2393" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2393" accept="image/*" multiple onchange="displayImages(this, 2393)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2393"></div>
      <!-- Camera Container -->
<div id="camera-container-2393" style="display: none;">
  <video id="camera-2393" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2393)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2393)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2393)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2393" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>


         <tr id="row-2394">
            <td>1.45</td>
           <td class = "observation_text">FIU Termination Card 8

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2394)">Add Image</button>
<div class="upload-options" id="upload-options-2394" style="display: none;">
  <button class="add-image" onclick="startCamera(2394)">Camera</button>
  <label for="file-input-2394" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2394" accept="image/*" multiple onchange="displayImages(this, 2394)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2394"></div>
      <!-- Camera Container -->
<div id="camera-container-2394" style="display: none;">
  <video id="camera-2394" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2394)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2394)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2394)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2394" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>


        <tr id="row-2395">
            <td>1.46</td>
           <td class = "observation_text">PDU Box

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2395)">Add Image</button>
<div class="upload-options" id="upload-options-2395" style="display: none;">
  <button class="add-image" onclick="startCamera(2395)">Camera</button>
  <label for="file-input-2395" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2395" accept="image/*" multiple onchange="displayImages(this, 2395)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2395"></div>
      <!-- Camera Container -->
<div id="camera-container-2395" style="display: none;">
  <video id="camera-2395" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2395)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2395)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2395)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2395" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

         <tr id="row-2396">
            <td>1.47</td>
           <td class = "observation_text">RTU 1

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2396)">Add Image</button>
<div class="upload-options" id="upload-options-2396" style="display: none;">
  <button class="add-image" onclick="startCamera(2396)">Camera</button>
  <label for="file-input-2396" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2396" accept="image/*" multiple onchange="displayImages(this, 2396)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2396"></div>
      <!-- Camera Container -->
<div id="camera-container-2396" style="display: none;">
  <video id="camera-2396" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2396)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2396)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2396)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2396" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

        
        <tr id="row-2397">
            <td>1.48</td>
           <td class = "observation_text">RTU 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2397)">Add Image</button>
<div class="upload-options" id="upload-options-2397" style="display: none;">
  <button class="add-image" onclick="startCamera(2397)">Camera</button>
  <label for="file-input-2397" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2397" accept="image/*" multiple onchange="displayImages(this, 2397)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2397"></div>
      <!-- Camera Container -->
<div id="camera-container-2397" style="display: none;">
  <video id="camera-2397" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2397)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2397)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2397)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2397" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

        <tr id="row-2398">
            <td>1.49</td>
           <td class = "observation_text">RADIO 1

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2398)">Add Image</button>
<div class="upload-options" id="upload-options-2398" style="display: none;">
  <button class="add-image" onclick="startCamera(2398)">Camera</button>
  <label for="file-input-2398" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2398" accept="image/*" multiple onchange="displayImages(this, 2398)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2398"></div>
      <!-- Camera Container -->
<div id="camera-container-2398" style="display: none;">
  <video id="camera-2398" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2398)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2398)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2398)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2398" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>


        <tr id="row-2399">
            <td>1.50</td>
           <td class = "observation_text">RADIO 2

          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select">
              <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Matching">Matching</option>
                <option value="Not Matching">Not Matching</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(2399)">Add Image</button>
<div class="upload-options" id="upload-options-2399" style="display: none;">
  <button class="add-image" onclick="startCamera(2399)">Camera</button>
  <label for="file-input-2399" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-2399" accept="image/*" multiple onchange="displayImages(this, 2399)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-2399"></div>
      <!-- Camera Container -->
<div id="camera-container-2399" style="display: none;">
  <video id="camera-2399" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(2399)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(2399)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(2399)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-2399" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
        </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('2_0')">
        Update
      </button>
    <button type="button" id= "save-btn" style = "display: inline-block;" onclick="saveObservation('2_0')">Save</button>
     <button id="get-details-btn" onclick="getDetails()">Get Details</button>
</div>`;


  } else if (section === "3.0") {
   // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > PERSONAL SAFETY </h3>
       <div class="table-container">
      <table class="observations" id="observations-section-3_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-3_0">
          <tr id="row-23">
              <td>2.1</td>
              <td class="observation_text">Check Safety during Towers installation and verification</td>
              <td class="select">
                 <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Compliance">Compliance</option>
                <option value="Non-Compliance">Non-Compliance</option>
                <option value="Not Available">Not Available</option>
              </select>
              </td>
              <td class="remarks">
                  <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
              </td>
             <td>
       <button class="add-image" onclick="showUploadOptions(23)">Add Image</button>
<div class="upload-options" id="upload-options-23" style="display: none;">
  <button class="add-image" onclick="startCamera(23)">Camera</button>
  <label for="file-input-23" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-23" accept="image/*" multiple onchange="displayImages(this, 23)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-23"></div>
      <!-- Camera Container -->
<div id="camera-container-23" style="display: none;">
  <video id="camera-23" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(23)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(23)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(23)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-23" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
</tr>
<tr id="row-24">
      <td>2.2</td>
      <td class="observation_text">Check Safety during STCAS installation and verification</td> 
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Compliance">Compliance</option>
                <option value="Non-Compliance">Non-Compliance</option>
                <option value="Not Available">Not Available</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(24)">Add Image</button>
<div class="upload-options" id="upload-options-24" style="display: none;">
  <button class="add-image" onclick="startCamera(24)">Camera</button>
  <label for="file-input-24" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-24" accept="image/*" multiple onchange="displayImages(this, 24)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-24"></div>
      <!-- Camera Container -->
<div id="camera-container-24" style="display: none;">
  <video id="camera-24" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(24)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(24)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(24)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-24" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-25">
      <td>2.3</td>
      <td class="observation_text">Check Safety during RFID TAG Marking, Installation and Verification</td>
      <td class="select">
     <select id="status-dropdown"  onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Joined">Joined</option>
                <option value="Not Joined">Not Joined</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(25)">Add Image</button>
<div class="upload-options" id="upload-options-25" style="display: none;">
  <button class="add-image" onclick="startCamera(25)">Camera</button>
  <label for="file-input-25" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-25" accept="image/*" multiple onchange="displayImages(this, 25)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-25"></div>
      <!-- Camera Container -->
<div id="camera-container-25" style="display: none;">
  <video id="camera-25" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(25)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(25)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(25)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-25" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
        </tbody>
      </table>
      </div>
     <div class="action-buttons">
       <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display:none;" 
              onclick="updateObservation('3_0')">
        Update
      </button>
        <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('3_0')) { saveObservation('3_0'); }">Save</button>
        <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

  } else if (section === "4.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > SURVEY </h3>
       <div class="table-container">
      <table class="observations" id="observations-section-4_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-4_0">
          <tr id="row-34">
      <td>3.1</td>
      <td class="observation_text">RSSI SURVEY</td>
       <td class = "select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(34)">Add Image</button>
<div class="upload-options" id="upload-options-34" style="display: none;">
  <button class="add-image" onclick="startCamera(34)">Camera</button>
  <label for="file-input-34" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-34" accept="image/*" multiple onchange="displayImages(this, 34)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-34"></div>
      <!-- Camera Container -->
<div id="camera-container-34" style="display: none;">
  <video id="camera-34" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(34)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(34)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(34)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-34" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>


    <tr id="row-35">
      <td>3.2</td>
      <td class="observation_text">Track survey by using LIDAR</td>
        <td class = "select">
         <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

     <tr id="row-351">
      <td>3.3</td>
      <td class="observation_text">Floor Plan</td>
        <td class = "select">
         <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-352">
      <td>3.4</td>
      <td class="observation_text">Cable Route Plan from SKavach to Tower and SKavach to Station Manager Room</td>
        <td class = "select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>


    <tr id="row-353">
      <td>3.5</td>
      <td class="observation_text">OFC Cable Route Survey</td>
        <td class = "select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>


    <tr id="row-354">
      <td>3.6</td>
      <td class="observation_text">Building Plan for SKavach</td>
        <td class = "select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>


    <tr id="row-355">
      <td>3.7</td>
      <td class="observation_text">Proposed Tower Location Survey</td>
        <td class = "select">
      <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-356">
      <td>3.8</td>
      <td class="observation_text">Verification of RFID Tag ABS location as per RFID Layout</td>
        <td class = "select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

     <tr id="row-357">
      <td>3.9</td>
      <td class="observation_text">Kavach equipment, Telecom equipment, Building and Tower Earthing Plan</td>
        <td class = "select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Done "> Done </option>
                <option value="Not done">Not done</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35"></div>
      <!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

        </tbody>
      </table>
      </div>
     <div class="action-buttons">
       <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display:none;" 
              onclick="updateObservation('4_0')">
        Update
      </button>
        <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('4_0')) { saveObservation('4_0'); }">Save</button>
        <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  } else if (section === "5.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading">SITE DRAWINGS/DOCUMENTS/REPORTS</h3>
       <div class="table-container">
      <table class="observations" id="observations-section-5_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-5_0">
          <tr id="row-36">
      <td>4.1</td>
      <td class="observation_text">Floor Plans</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(36)">Add Image</button>
<div class="upload-options" id="upload-options-36" style="display: none;">
  <button class="add-image" onclick="startCamera(36)">Camera</button>
  <label for="file-input-36" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-36" accept="image/*" multiple onchange="displayImages(this, 36)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-36"></div>
      <!-- Camera Container -->
<div id="camera-container-36" style="display: none;">
  <video id="camera-36" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(36)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(36)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(36)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-36" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-37">
      <td>4.2</td>
      <td class="observation_text">Cable Route Plan from Kavach to Tower location</td>
      <td class = "select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(37)">Add Image</button>
<div class="upload-options" id="upload-options-37" style="display: none;">
  <button class="add-image" onclick="startCamera(37)">Camera</button>
  <label for="file-input-37" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-37" accept="image/*" multiple onchange="displayImages(this, 37)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-37"></div>
      <!-- Camera Container -->
<div id="camera-container-37" style="display: none;">
  <video id="camera-37" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(37)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(37)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(37)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-37" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-38">
      <td>4.3</td>
      <td class="observation_text">Power Supply Drawing (PSD & Load calculation)</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(38)">Add Image</button>
<div class="upload-options" id="upload-options-38" style="display: none;">
  <button class="add-image" onclick="startCamera(38)">Camera</button>
  <label for="file-input-38" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-38" accept="image/*" multiple onchange="displayImages(this, 38)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-38"></div>
      <!-- Camera Container -->
<div id="camera-container-38" style="display: none;">
  <video id="camera-38" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(38)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(38)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(38)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-38" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
<tr id="row-39">
      <td>4.4</td>
      <td class="observation_text">OFC Network Drawings</td>
      <td class="select">
           <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>   
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(39)">Add Image</button>
<div class="upload-options" id="upload-options-39" style="display: none;">
  <button class="add-image" onclick="startCamera(39)">Camera</button>
  <label for="file-input-39" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-39" accept="image/*" multiple onchange="displayImages(this, 39)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-39"></div>
      <!-- Camera Container -->
<div id="camera-container-39" style="display: none;">
  <video id="camera-39" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(39)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(39)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(39)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-39" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-39088">
      <td>4.5</td>
      <td class="observation_text">OFC Cable Route Plan (Foot by Foot Survey)</td>
      <td class="select">
          <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>    
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(39088)">Add Image</button>
<div class="upload-options" id="upload-options-39088" style="display: none;">
  <button class="add-image" onclick="startCamera(39088)">Camera</button>
  <label for="file-input-39088" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-39088" accept="image/*" multiple onchange="displayImages(this, 39088)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-39088"></div>
      <!-- Camera Container -->
<div id="camera-container-39088" style="display: none;">
  <video id="camera-39088" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(39088)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(39088)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(39088)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-39088" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
<tr id="row-1339">
      <td>4.6</td>
      <td class="observation_text">Towers Typical Earthing Plan for Kavach Tower</td>
      <td class="select">
         <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>  
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(1339)">Add Image</button>
<div class="upload-options" id="upload-options-1339" style="display: none;">
  <button class="add-image" onclick="startCamera(1339)">Camera</button>
  <label for="file-input-1339" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1339" accept="image/*" multiple onchange="displayImages(this, 1339)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1339"></div>
      <!-- Camera Container -->
<div id="camera-container-1339" style="display: none;">
  <video id="camera-1339" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1339)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1339)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1339)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1339" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-40">
      <td>4.7</td>
      <td class="observation_text">Proposed Tower Location approved copy</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(40)">Add Image</button>
<div class="upload-options" id="upload-options-40" style="display: none;">
  <button class="add-image" onclick="startCamera(40)">Camera</button>
  <label for="file-input-40" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-40" accept="image/*" multiple onchange="displayImages(this, 40)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-40"></div>
      <!-- Camera Container -->
<div id="camera-container-40" style="display: none;">
  <video id="camera-40" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(40)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(40)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(40)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-40" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

    <tr id="row-4079">
      <td>4.8</td>
      <td class="observation_text">Proposed Tower Location approved copy</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(4079)">Add Image</button>
<div class="upload-options" id="upload-options-4079" style="display: none;">
  <button class="add-image" onclick="startCamera(4079)">Camera</button>
  <label for="file-input-4079" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-4079" accept="image/*" multiple onchange="displayImages(this, 4079)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-4079"></div>
      <!-- Camera Container -->
<div id="camera-container-4079" style="display: none;">
  <video id="camera-4079" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(4079)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(4079)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(4079)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-4079" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

    <tr id="row-40678">
      <td>4.9</td>
      <td class="observation_text">Tower Foundation Diagram</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(40678)">Add Image</button>
<div class="upload-options" id="upload-options-40678" style="display: none;">
  <button class="add-image" onclick="startCamera(40678)">Camera</button>
  <label for="file-input-40678" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-40678" accept="image/*" multiple onchange="displayImages(this, 40678)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-40678"></div>
      <!-- Camera Container -->
<div id="camera-container-40678" style="display: none;">
  <video id="camera-40678" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(40678)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(40678)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(40678)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-40678" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

  <tr id="row-406768">
      <td>4.10</td>
      <td class="observation_text">SIM Registration with RDSO server</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Approved Hand Sketch">Approved Hand Sketch</option>
                <option value="Approved document">Approved document</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(406768)">Add Image</button>
<div class="upload-options" id="upload-options-406768" style="display: none;">
  <button class="add-image" onclick="startCamera(406768)">Camera</button>
  <label for="file-input-406768" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-40678" accept="image/*" multiple onchange="displayImages(this, 406768)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-406768"></div>
      <!-- Camera Container -->
<div id="camera-container-406768" style="display: none;">
  <video id="camera-406768" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(406768)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(406768)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(406768)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-406768" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

    
  <tr id="row-7868">
      <td>4.11</td>
      <td class="observation_text">Data logger Validation Report for Kavach Relay</td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(7868)">Add Image</button>
<div class="upload-options" id="upload-options-7868" style="display: none;">
  <button class="add-image" onclick="startCamera(7868)">Camera</button>
  <label for="file-input-7868" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-7868" accept="image/*" multiple onchange="displayImages(this, 7868)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-7868"></div>
      <!-- Camera Container -->
<div id="camera-container-7868" style="display: none;">
  <video id="camera-7868" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(7868)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(7868)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(7868)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-7868" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

     <tr id="row-78645">
      <td>4.12</td>
      <td class="observation_text">Approved IP Plan</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(78645)">Add Image</button>
<div class="upload-options" id="upload-options-78645" style="display: none;">
  <button class="add-image" onclick="startCamera(78645)">Camera</button>
  <label for="file-input-78645" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-78645" accept="image/*" multiple onchange="displayImages(this, 78645)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-78645"></div>
      <!-- Camera Container -->
<div id="camera-container-78645" style="display: none;">
  <video id="camera-78645" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(78645)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(78645)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(78645)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-78645" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

     <tr id="row-76969">
      <td>4.13</td>
      <td class="observation_text">Point wise TAN complaince</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(76969)">Add Image</button>
<div class="upload-options" id="upload-options-76969" style="display: none;">
  <button class="add-image" onclick="startCamera(76969)">Camera</button>
  <label for="file-input-76969" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-76969" accept="image/*" multiple onchange="displayImages(this, 76969)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-76969"></div>
      <!-- Camera Container -->
<div id="camera-container-76969" style="display: none;">
  <video id="camera-76969" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(76969)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(76969)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(76969)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-76969" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

     <tr id="row-9786">
      <td>4.14</td>
      <td class="observation_text">OFC OTDR Report</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(9786)">Add Image</button>
<div class="upload-options" id="upload-options-9786" style="display: none;">
  <button class="add-image" onclick="startCamera(9786)">Camera</button>
  <label for="file-input-9786" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-9786" accept="image/*" multiple onchange="displayImages(this, 9786)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-9786"></div>
      <!-- Camera Container -->
<div id="camera-container-9786" style="display: none;">
  <video id="camera-9786" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(9786)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(9786)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(9786)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-9786" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>
    
    <tr id="row-57474">
      <td>4.15</td>
      <td class="observation_text">Signal Cable Meggering Report</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(57474)">Add Image</button>
<div class="upload-options" id="upload-options-57474" style="display: none;">
  <button class="add-image" onclick="startCamera(57474)">Camera</button>
  <label for="file-input-57474" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-57474" accept="image/*" multiple onchange="displayImages(this, 57474)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-57474"></div>
      <!-- Camera Container -->
<div id="camera-container-57474" style="display: none;">
  <video id="camera-57474" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(57474)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(57474)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(57474)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-57474" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>  
    <tr id="row-5657">
      <td>4.16</td>
      <td class="observation_text">Check the validity of Calibration certificates of all testing instruments to be used at site</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(5657)">Add Image</button>
<div class="upload-options" id="upload-options-5657" style="display: none;">
  <button class="add-image" onclick="startCamera(5657)">Camera</button>
  <label for="file-input-5657" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-5657" accept="image/*" multiple onchange="displayImages(this, 5657)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-5657"></div>
      <!-- Camera Container -->
<div id="camera-container-5657" style="display: none;">
  <video id="camera-5657" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(5657)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(5657)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(5657)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-5657" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>  
    <tr id="row-67765">
      <td>4.16a</td>
      <td class="observation_text">List of instruments</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(67765)">Add Image</button>
<div class="upload-options" id="upload-options-67765" style="display: none;">
  <button class="add-image" onclick="startCamera(67765)">Camera</button>
  <label for="file-input-67765" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-67765" accept="image/*" multiple onchange="displayImages(this, 67765)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-67765"></div>
      <!-- Camera Container -->
<div id="camera-container-67765" style="display: none;">
  <video id="camera-67765" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(67765)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(67765)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(67765)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-67765" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>  
    <tr id="row-857678">
      <td>4.16b</td>
      <td class="observation_text">List of instruments</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(857678)">Add Image</button>
<div class="upload-options" id="upload-options-857678" style="display: none;">
  <button class="add-image" onclick="startCamera(857678)">Camera</button>
  <label for="file-input-857678" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-857678" accept="image/*" multiple onchange="displayImages(this, 857678)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-857678"></div>
      <!-- Camera Container -->
<div id="camera-container-857678" style="display: none;">
  <video id="camera-857678" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(857678)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(857678)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(857678)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-857678" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>  
    <tr id="row-65844">
      <td>4.16c</td>
      <td class="observation_text">List of instruments</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(65844)">Add Image</button>
<div class="upload-options" id="upload-options-65844" style="display: none;">
  <button class="add-image" onclick="startCamera(65844)">Camera</button>
  <label for="file-input-65844" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-65844" accept="image/*" multiple onchange="displayImages(this, 65844)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-65844"></div>
      <!-- Camera Container -->
<div id="camera-container-65844" style="display: none;">
  <video id="camera-65844" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(65844)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(65844)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(65844)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-65844  323
  " style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>
    <tr id="row-7696">
      <td>4.16d</td>
      <td class="observation_text">List of instruments</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(7696)">Add Image</button>
<div class="upload-options" id="upload-options-7696" style="display: none;">
  <button class="add-image" onclick="startCamera(7696)">Camera</button>
  <label for="file-input-7696" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-7696" accept="image/*" multiple onchange="displayImages(this, 7696)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-7696"></div>
      <!-- Camera Container -->
<div id="camera-container-7696" style="display: none;">
  <video id="camera-7696" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(7696)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(7696)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(7696)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-7696" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>    

  <tr id="row-7696">
      <td>4.16e</td>
      <td class="observation_text">List of instruments</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
        </select>

      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(7696)">Add Image</button>
<div class="upload-options" id="upload-options-7696" style="display: none;">
  <button class="add-image" onclick="startCamera(7696)">Camera</button>
  <label for="file-input-7696" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-7696" accept="image/*" multiple onchange="displayImages(this, 7696)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-7696"></div>
      <!-- Camera Container -->
<div id="camera-container-7696" style="display: none;">
  <video id="camera-7696" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(7696)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(7696)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(7696)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-7696" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>  

    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('5_0')">
        Update
      </button>
       <button type="button" id= "save-btn" style = "display: inline-block;"  onclick="if(validateMandatoryImages('5_0')) { saveObservation('5_0'); }">Save</button>
        <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

  }
  else if (section === "6.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > Tower </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-6_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-6_0">
          <tr id="row-41">
      <td>5.1</td>
      <td class="observation_text">Visual Checks</td>
       <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(41)">Add Image</button>
<div class="upload-options" id="upload-options-41" style="display: none;">
  <button class="add-image" onclick="startCamera(41)">Camera</button>
  <label for="file-input-41" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-41" accept="image/*" multiple onchange="displayImages(this, 41)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-41"></div>
      <!-- Camera Container -->
<div id="camera-container-41" style="display: none;">
  <video id="camera-41" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(41)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(41)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(41)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-41" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-4265">
      <td>5.2</td>
      <td class="observation_text">Verify Installation of Tower, Ladder, Climbing Arrangement, Plat form, Gate and safety features done as per </td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(4265)">Add Image</button>
<div class="upload-options" id="upload-options-4265" style="display: none;">
  <button class="add-image" onclick="startCamera(4265)">Camera</button>
  <label for="file-input-4265" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-4265" accept="image/*" multiple onchange="displayImages(this, 4265)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-4265"></div>
<!-- Camera Container -->
<div id="camera-container-4265" style="display: none;">
  <video id="camera-4265" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(4265)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(4265)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(4265)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-4265" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-42">
      <td>5.2a</td>
      <td class="observation_text">RDSO Approved drawing for Tower, Drawing No.:
RDSO/TC/TOWER/L/40/180/T/6.5</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(42)">Add Image</button>
<div class="upload-options" id="upload-options-42" style="display: none;">
  <button class="add-image" onclick="startCamera(42)">Camera</button>
  <label for="file-input-42" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-42" accept="image/*" multiple onchange="displayImages(this, 42)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-42"></div>
<!-- Camera Container -->
<div id="camera-container-42" style="display: none;">
  <video id="camera-42" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(42)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(42)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(42)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-42" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-43">
      <td>5.2b</td>
      <td class="observation_text">Stationary TCAS Tower (I&C), Drawing No.: 5 16 76 0009</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(43)">Add Image</button>
<div class="upload-options" id="upload-options-43" style="display: none;">
  <button class="add-image" onclick="startCamera(43)">Camera</button>
  <label for="file-input-43" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-43" accept="image/*" multiple onchange="displayImages(this, 43)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-43"></div>
<!-- Camera Container -->
<div id="camera-container-43" style="display: none;">
  <video id="camera-43" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(43)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(43)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(43)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-43" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-44">
      <td>5.3</td>
      <td class="observation_text">Verify Tower Foundation & Grouting (No Cracks, proper curing, level alignment etc.)</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(44)">Add Image</button>
<div class="upload-options" id="upload-options-44" style="display: none;">
  <button class="add-image" onclick="startCamera(44)">Camera</button>
  <label for="file-input-44" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-44" accept="image/*" multiple onchange="displayImages(this, 44)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-44"></div>
<!-- Camera Container -->
<div id="camera-container-44" style="display: none;">
  <video id="camera-44" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(44)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(44)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(44)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-44" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-45">
      <td>5.4</td>
      <td class="observation_text">Verify Torque of Foundation bolts as per specification Torque value:  Nm  (or)
Foundation bolts are welded </td>
     <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(45)">Add Image</button>
<div class="upload-options" id="upload-options-45" style="display: none;">
  <button class="add-image" onclick="startCamera(45)">Camera</button>
  <label for="file-input-45" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-45" accept="image/*" multiple onchange="displayImages(this, 45)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-45"></div>
<!-- Camera Container -->
<div id="camera-container-45" style="display: none;">
  <video id="camera-45" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(45)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(45)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(45)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-45" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-45098">
      <td>5.5</td>
      <td class="observation_text">Verify all Lightning Rods are properly earthed as per Tower earth diagram.
Station TCAS Tower Earth Drawing No.: 5 16 76 0043 </td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(45)">Add Image</button>
<div class="upload-options" id="upload-options-45" style="display: none;">
  <button class="add-image" onclick="startCamera(45)">Camera</button>
  <label for="file-input-45" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-45" accept="image/*" multiple onchange="displayImages(this, 45)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-45"></div>
<!-- Camera Container -->
<div id="camera-container-45" style="display: none;">
  <video id="camera-45" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(45)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(45)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(45)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-45" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-4675">
      <td>5.6</td>
      <td class="observation_text">Verify Lightening Protection (air terminal and down conductor) is installed as per standard
Station TCAS Tower Earth Drawing No.: 5 16 76 0043</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(45)">Add Image</button>
<div class="upload-options" id="upload-options-45" style="display: none;">
  <button class="add-image" onclick="startCamera(45)">Camera</button>
  <label for="file-input-45" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-45" accept="image/*" multiple onchange="displayImages(this, 45)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-45"></div>
<!-- Camera Container -->
<div id="camera-container-45" style="display: none;">
  <video id="camera-45" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(45)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(45)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(45)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-45" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-494325">
      <td>5.7</td>
      <td class="observation_text">Verify Earthing of Tower (as per Specification <2Ω) 
Station TCAS Tower Earth Drawing No.: 5 16 76 0043</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(494325)">Add Image</button>
<div class="upload-options" id="upload-options-494325" style="display: none;">
  <button class="add-image" onclick="startCamera(494325)">Camera</button>
  <label for="file-input-494325" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-494325" accept="image/*" multiple onchange="displayImages(this, 494325)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-494325"></div>
<!-- Camera Container -->
<div id="camera-container-494325" style="display: none;">
  <video id="camera-494325" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(494325)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(494325)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(494325)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-494325" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-46705">
      <td>5.8</td>
      <td class="observation_text">Verify Dual OFC and dual power cables provided in diverse paths up to Tower enclosure box</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(46705)">Add Image</button>
<div class="upload-options" id="upload-options-46705" style="display: none;">
  <button class="add-image" onclick="startCamera(46705)">Camera</button>
  <label for="file-input-46705" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-46705" accept="image/*" multiple onchange="displayImages(this, 46705)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-46705"></div>
<!-- Camera Container -->
<div id="camera-container-46705" style="display: none;">
  <video id="camera-46705" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(46705)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(46705)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(46705)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-46705" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
  <tr id="row-46905">
      <td>5.9</td>
      <td class="observation_text">Verify GI Earthing strip routing</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(46905)">Add Image</button>
<div class="upload-options" id="upload-options-46905" style="display: none;">
  <button class="add-image" onclick="startCamera(46905)">Camera</button>
  <label for="file-input-46905" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-46905" accept="image/*" multiple onchange="displayImages(this, 46905)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-46905"></div>
<!-- Camera Container -->
<div id="camera-container-46905" style="display: none;">
  <video id="camera-46905" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(46905)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(46905)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(46905)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-46905" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
  <tr id="row-469405">
      <td>5.10</td>
      <td class="observation_text">Verify Tower Earth Pit arrangement is done with brazing</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(469405)">Add Image</button>
<div class="upload-options" id="upload-options-469405" style="display: none;">
  <button class="add-image" onclick="startCamera(469405)">Camera</button>
  <label for="file-input-469405" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-469405" accept="image/*" multiple onchange="displayImages(this, 469405)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-469405"></div>
<!-- Camera Container -->
<div id="camera-container-469405" style="display: none;">
  <video id="camera-469405" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(469405)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(469405)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(469405)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-469405" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>     
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('6_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('6_0')) { saveObservation('6_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }else if (section === "7.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > RTU </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-7_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-7_0">
          <tr id="row-411287">
      <td>6.1</td>
      <td class="observation_text">Visual Checks</td>
       <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(411287)">Add Image</button>
<div class="upload-options" id="upload-options-411287" style="display: none;">
  <button class="add-image" onclick="startCamera(411287)">Camera</button>
  <label for="file-input-411287" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-411287" accept="image/*" multiple onchange="displayImages(this, 411287)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-411287"></div>
      <!-- Camera Container -->
<div id="camera-container-411287" style="display: none;">
  <video id="camera-411287" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(411287)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(411287)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(411287)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-411287" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-14265">
      <td>6.2</td>
      <td class="observation_text">Verify RTU mounting on Tower Platform is as per Drawing.
Kavach RTU Installation Drawing No. 5 16 76 0042</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(14265)">Add Image</button>
<div class="upload-options" id="upload-options-14265" style="display: none;">
  <button class="add-image" onclick="startCamera(14265)">Camera</button>
  <label for="file-input-14265" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-14265" accept="image/*" multiple onchange="displayImages(this, 14265)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-14265"></div>
<!-- Camera Container -->
<div id="camera-container-14265" style="display: none;">
  <video id="camera-14265" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(14265)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(14265)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(14265)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-14265" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-93542">
      <td>6.3</td>
      <td class="observation_text">Verify separate Earthing connection of RTU (Earth Pit 4) is made as per Diagram and brazing done.
Station TCAS Tower Earth Drawing No.: 5 16 76 0043</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(93542)">Add Image</button>
<div class="upload-options" id="upload-options-93542" style="display: none;">
  <button class="add-image" onclick="startCamera(93542)">Camera</button>
  <label for="file-input-93542" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-93542" accept="image/*" multiple onchange="displayImages(this, 93542)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-93542"></div>
<!-- Camera Container -->
<div id="camera-container-93542" style="display: none;">
  <video id="camera-93542" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(93542)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(93542)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(93542)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-93542" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-51343">
      <td>6.4</td>
      <td class="observation_text">Verify cable terminations (OFC and Power cable) are made correctly as per Diagram</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(51343)">Add Image</button>
<div class="upload-options" id="upload-options-51343" style="display: none;">
  <button class="add-image" onclick="startCamera(51343)">Camera</button>
  <label for="file-input-51343" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-51343" accept="image/*" multiple onchange="displayImages(this, 51343)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-51343"></div>
<!-- Camera Container -->
<div id="camera-container-51343" style="display: none;">
  <video id="camera-51343" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(51343)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(51343)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(51343)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-51343" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-87543">
      <td>6.5</td>
      <td class="observation_text">Power ON the RTU and Verify LED indicators / health status is as per RTU user Manual.</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(875434)">Add Image</button>
<div class="upload-options" id="upload-options-87543" style="display: none;">
  <button class="add-image" onclick="startCamera(87543)">Camera</button>
  <label for="file-input-87543" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-87543" accept="image/*" multiple onchange="displayImages(this, 87543)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-87543"></div>
<!-- Camera Container -->
<div id="camera-container-87543" style="display: none;">
  <video id="camera-87543" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(87543)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(87543)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(87543)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-87543" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-42135">
      <td>6.6</td>
      <td class="observation_text">Verify Radios Power supply is 110V </td>
     <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(42135)">Add Image</button>
<div class="upload-options" id="upload-options-42135" style="display: none;">
  <button class="add-image" onclick="startCamera(42135)">Camera</button>
  <label for="file-input-42135" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-42135" accept="image/*" multiple onchange="displayImages(this, 42135)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-42135"></div>
<!-- Camera Container -->
<div id="camera-container-42135" style="display: none;">
  <video id="camera-42135" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(42135)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(42135)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(42135)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-42135" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-22198">
      <td>6.7</td>
      <td class="observation_text">Verify LMR cable fixing</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(22198)">Add Image</button>
<div class="upload-options" id="upload-options-22198" style="display: none;">
  <button class="add-image" onclick="startCamera(22198)">Camera</button>
  <label for="file-input-22198" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22198" accept="image/*" multiple onchange="displayImages(this, 22198)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-22198"></div>
<!-- Camera Container -->
<div id="camera-container-22198" style="display: none;">
  <video id="camera-22198" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22198)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22198)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22198)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22198" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-22675">
      <td>6.8</td>
      <td class="observation_text">Verify Communication link between RTU and Station equipment</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(22675)">Add Image</button>
<div class="upload-options" id="upload-options-22675" style="display: none;">
  <button class="add-image" onclick="startCamera(22675)">Camera</button>
  <label for="file-input-22675" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22675" accept="image/*" multiple onchange="displayImages(this, 22675)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-22675"></div>
<!-- Camera Container -->
<div id="camera-container-22675" style="display: none;">
  <video id="camera-22675" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22675)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22675)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22675)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22675" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-22123">
      <td>6.9</td>
      <td class="observation_text">Verify Power supply for Aviation Lamp is 110V</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(22123)">Add Image</button>
<div class="upload-options" id="upload-options-22123" style="display: none;">
  <button class="add-image" onclick="startCamera(22123)">Camera</button>
  <label for="file-input-22123" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22123" accept="image/*" multiple onchange="displayImages(this, 22123)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-22123"></div>
<!-- Camera Container -->
<div id="camera-container-22123" style="display: none;">
  <video id="camera-22123" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22123)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22123)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22123)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22123" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-22215">
      <td>6.10</td>
      <td class="observation_text">Verify Cable is tied to Structure by using Stainless Steel Cable Ties</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(22215)">Add Image</button>
<div class="upload-options" id="upload-options-22215" style="display: none;">
  <button class="add-image" onclick="startCamera(22215)">Camera</button>
  <label for="file-input-22215" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22215" accept="image/*" multiple onchange="displayImages(this, 22215)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-22215"></div>
<!-- Camera Container -->
<div id="camera-container-22215" style="display: none;">
  <video id="camera-22215" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22215)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22215)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22215)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22215" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>    
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('6_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('6_0')) { saveObservation('6_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }else if (section === "8.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > RF Antennas </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-7_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-7_0">
          <tr id="row-8941">
      <td>7.1</td>
      <td class="observation_text">Visual Checks</td>
       <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(8941)">Add Image</button>
<div class="upload-options" id="upload-options-8941" style="display: none;">
  <button class="add-image" onclick="startCamera(8941)">Camera</button>
  <label for="file-input-8941" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-8941" accept="image/*" multiple onchange="displayImages(this, 8941)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-8941"></div>
      <!-- Camera Container -->
<div id="camera-container-8941" style="display: none;">
  <video id="camera-8941" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(8941)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(8941)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(8941)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-8941" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-14265">
      <td>7.2</td>
      <td class="observation_text">Verify RF Antenna Type, Height and Orientation as per Desktop survey report</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(14265)">Add Image</button>
<div class="upload-options" id="upload-options-14265" style="display: none;">
  <button class="add-image" onclick="startCamera(14265)">Camera</button>
  <label for="file-input-14265" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-14265" accept="image/*" multiple onchange="displayImages(this, 14265)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-14265"></div>
<!-- Camera Container -->
<div id="camera-container-14265" style="display: none;">
  <video id="camera-14265" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(14265)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(14265)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(14265)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-14265" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-32142">
      <td>7.3</td>
      <td class="observation_text">Verify all Antennas mounted on the Tower are at the same level.
Ref: 5 16 90 0018 and
5 16 76 0041</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(32142)">Add Image</button>
<div class="upload-options" id="upload-options-32142" style="display: none;">
  <button class="add-image" onclick="startCamera(32142)">Camera</button>
  <label for="file-input-32142" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-32142" accept="image/*" multiple onchange="displayImages(this, 32142)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-32142"></div>
<!-- Camera Container -->
<div id="camera-container-32142" style="display: none;">
  <video id="camera-32142" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(32142)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(32142)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(32142)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-32142" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-443543">
      <td>7.4</td>
      <td class="observation_text">Verify that Antennas are properly fixed with clamps at the bottom side of antenna</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(443543)">Add Image</button>
<div class="upload-options" id="upload-options-443543" style="display: none;">
  <button class="add-image" onclick="startCamera(443543)">Camera</button>
  <label for="file-input-443543" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-443543" accept="image/*" multiple onchange="displayImages(this, 443543)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-443543"></div>
<!-- Camera Container -->
<div id="camera-container-443543" style="display: none;">
  <video id="camera-443543" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(443543)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(443543)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(443543)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-443543" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-98744">
      <td>7.5</td>
      <td class="observation_text">Verify that Surge suppressors are connected to all radio transmit and receive antenna cables.</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(98744)">Add Image</button>
<div class="upload-options" id="upload-options-98744" style="display: none;">
  <button class="add-image" onclick="startCamera(98744)">Camera</button>
  <label for="file-input-98744" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-98744" accept="image/*" multiple onchange="displayImages(this, 98744)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-98744"></div>
<!-- Camera Container -->
<div id="camera-container-98744" style="display: none;">
  <video id="camera-98744" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(98744)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(98744)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(98744)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-98744" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-78645">
      <td>7.6</td>
      <td class="observation_text">Verify Antenna feeder cable routing such that,
i - There should be no sharp bends,
ii - Proper clamping at intervals,
iii - And weather proofing at joints.
Ref: 5 16 90 0018 </td>
     <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(78645)">Add Image</button>
<div class="upload-options" id="upload-options-78645" style="display: none;">
  <button class="add-image" onclick="startCamera(78645)">Camera</button>
  <label for="file-input-78645" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-78645" accept="image/*" multiple onchange="displayImages(this, 78645)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-78645"></div>
<!-- Camera Container -->
<div id="camera-container-78645" style="display: none;">
  <video id="camera-78645" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(78645)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(78645)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(78645)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-78645" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-86465">
      <td>7.7</td>
      <td class="observation_text">Verify Connector termination for Tightness, Weather proof taping, Shrink sleeve
Ref: 5 16 90 0018</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(86465)">Add Image</button>
<div class="upload-options" id="upload-options-86465" style="display: none;">
  <button class="add-image" onclick="startCamera(86465)">Camera</button>
  <label for="file-input-86465" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86465" accept="image/*" multiple onchange="displayImages(this, 86465)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-86465"></div>
<!-- Camera Container -->
<div id="camera-container-86465" style="display: none;">
  <video id="camera-86465" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86465)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86465)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86465)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-45" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-74675">
      <td>7.8</td>
      <td class="observation_text">Verify the measurement of VSWR / return loss of RF feeder cable within acceptable limits.</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(74675)">Add Image</button>
<div class="upload-options" id="upload-options-74675" style="display: none;">
  <button class="add-image" onclick="startCamera(74675)">Camera</button>
  <label for="file-input-74675" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-74675" accept="image/*" multiple onchange="displayImages(this, 74675)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-74675"></div>
<!-- Camera Container -->
<div id="camera-container-74675" style="display: none;">
  <video id="camera-74675" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(74675)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(74675)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(74675)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-74675" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-47679">
      <td>7.9</td>
      <td class="observation_text">Verify and Record Antenna alignment and connectivity test results in QC report.</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(47679)">Add Image</button>
<div class="upload-options" id="upload-options-47679" style="display: none;">
  <button class="add-image" onclick="startCamera(47679)">Camera</button>
  <label for="file-input-47679" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-47679" accept="image/*" multiple onchange="displayImages(this, 47679)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-47679"></div>
<!-- Camera Container -->
<div id="camera-container-47679" style="display: none;">
  <video id="camera-47679" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(47679)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(47679)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(47679)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-47679" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-86705">
      <td>7.10</td>
      <td class="observation_text">Verify open connectors are weather-proof sealed</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(86705)">Add Image</button>
<div class="upload-options" id="upload-options-86705" style="display: none;">
  <button class="add-image" onclick="startCamera(86705)">Camera</button>
  <label for="file-input-86705" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86705" accept="image/*" multiple onchange="displayImages(this, 86705)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-86705"></div>
<!-- Camera Container -->
<div id="camera-container-86705" style="display: none;">
  <video id="camera-46705" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86705)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86705)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86705)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86705" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
  <tr id="row-40905">
      <td>7.11</td>
      <td class="observation_text">Verify that an Aviation Lamp is installed at the top of the Tower for visibility. </td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(40905)">Add Image</button>
<div class="upload-options" id="upload-options-40905" style="display: none;">
  <button class="add-image" onclick="startCamera(40905)">Camera</button>
  <label for="file-input-40905" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-40905" accept="image/*" multiple onchange="displayImages(this, 40905)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-40905"></div>
<!-- Camera Container -->
<div id="camera-container-40905" style="display: none;">
  <video id="camera-40905" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(40905)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(40905)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(40905)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-40905" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
  <tr id="row-488405">
      <td>7.12</td>
      <td class="observation_text">Verify that Radio tower is provided with Lightening arrestor (Franklin rod) and connected to earth along with Aviation Lamp.</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(488405)">Add Image</button>
<div class="upload-options" id="upload-options-488405" style="display: none;">
  <button class="add-image" onclick="startCamera(488405)">Camera</button>
  <label for="file-input-488405" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-488405" accept="image/*" multiple onchange="displayImages(this, 488405)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-488405"></div>
<!-- Camera Container -->
<div id="camera-container-488405" style="display: none;">
  <video id="camera-488405" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(488405)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(488405)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(488405)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-488405" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
    <tr id="row-463285">
      <td>7.13</td>
      <td class="observation_text">Verify RF cable joining at Antenna</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(463285)">Add Image</button>
<div class="upload-options" id="upload-options-463285" style="display: none;">
  <button class="add-image" onclick="startCamera(463285)">Camera</button>
  <label for="file-input-463285" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-463285" accept="image/*" multiple onchange="displayImages(this, 463285)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-463285"></div>
<!-- Camera Container -->
<div id="camera-container-463285" style="display: none;">
  <video id="camera-463285" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(463285)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(463285)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(463285)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-463285" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
    <tr id="row-43021">
      <td>7.14</td>
      <td class="observation_text">Verify cables arevtied to dipole antenna by using stainless steel cable tie at four locations</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(43021)">Add Image</button>
<div class="upload-options" id="upload-options-43021" style="display: none;">
  <button class="add-image" onclick="startCamera(43021)">Camera</button>
  <label for="file-input-43021" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-43021" accept="image/*" multiple onchange="displayImages(this, 43021)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-43021"></div>
<!-- Camera Container -->
<div id="camera-container-43021" style="display: none;">
  <video id="camera-43021" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(43021)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(43021)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(43021)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-43021" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>    
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('6_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('6_0')) { saveObservation('6_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  } else if (section === "9.0") {
 mainContent.innerHTML += `
      <h3 class="section-heading" > Installation of Kavach equipment  </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-9_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-9_0">
          <tr id="row-4167">
      <td>8.1</td>
      <td class="observation_text">SKAVACH</td>
       <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(4167)">Add Image</button>
<div class="upload-options" id="upload-options-4167" style="display: none;">
  <button class="add-image" onclick="startCamera(4167)">Camera</button>
  <label for="file-input-4167" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-4167" accept="image/*" multiple onchange="displayImages(this, 4167)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-4167"></div>
      <!-- Camera Container -->
<div id="camera-container-4167" style="display: none;">
  <video id="camera-4167" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(4167)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(4167)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(4167)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-4167" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-98765">
      <td>8.2</td>
      <td class="observation_text">Visual Checks
(eg: Equipment labels, External appearance, Dents, Shade, Rust, etc.,)</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(98765)">Add Image</button>
<div class="upload-options" id="upload-options-98765" style="display: none;">
  <button class="add-image" onclick="startCamera(98765)">Camera</button>
  <label for="file-input-98765" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-98765" accept="image/*" multiple onchange="displayImages(this, 98765)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-98765"></div>
<!-- Camera Container -->
<div id="camera-container-98765" style="display: none;">
  <video id="camera-98765" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(98765)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(98765)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(98765)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-98765" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-45362">
      <td>8.3</td>
      <td class="observation_text">Verify the Grouting quality of Stand with insulator</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(45362)">Add Image</button>
<div class="upload-options" id="upload-options-45362" style="display: none;">
  <button class="add-image" onclick="startCamera(45362)">Camera</button>
  <label for="file-input-45362" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-45362" accept="image/*" multiple onchange="displayImages(this, 45362)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-45362"></div>
<!-- Camera Container -->
<div id="camera-container-45362" style="display: none;">
  <video id="camera-45362" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(45362)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(45362)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(45362)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-45362" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-78643">
      <td>8.4</td>
      <td class="observation_text">Verify that Antennas are properly fixed with clamps at the bottom side of antenna</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(78643)">Add Image</button>
<div class="upload-options" id="upload-options-78643" style="display: none;">
  <button class="add-image" onclick="startCamera(78643)">Camera</button>
  <label for="file-input-78643" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-78643" accept="image/*" multiple onchange="displayImages(this, 78643)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-78643"></div>
<!-- Camera Container -->
<div id="camera-container-78643" style="display: none;">
  <video id="camera-78643" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(78643)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(78643)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(78643)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-78643" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-574744">
      <td>8.5</td>
      <td class="observation_text">Verify the Stand is securely fixed using Mounting bolts tightened to the required torque
Torque : ??? Nm </td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(574744)">Add Image</button>
<div class="upload-options" id="upload-options-574744" style="display: none;">
  <button class="add-image" onclick="startCamera(574744)">Camera</button>
  <label for="file-input-574744" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-574744" accept="image/*" multiple onchange="displayImages(this, 574744)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-574744"></div>
<!-- Camera Container -->
<div id="camera-container-574744" style="display: none;">
  <video id="camera-574744" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(574744)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(574744)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(574744)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-574744" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-36745">
      <td>8.6</td>
      <td class="observation_text">Ensure Earthing is connected to the Ring earth/bus bar earth</td>
     <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(36745)">Add Image</button>
<div class="upload-options" id="upload-options-36745" style="display: none;">
  <button class="add-image" onclick="startCamera(36745)">Camera</button>
  <label for="file-input-36745" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-36745" accept="image/*" multiple onchange="displayImages(this, 36745)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-36745"></div>
<!-- Camera Container -->
<div id="camera-container-36745" style="display: none;">
  <video id="camera-36745" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(36745)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(36745)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(36745)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-36745" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-95218">
      <td>8.7</td>
      <td class="observation_text">Ensure the quality of all local materials such as Ladders, Troughs, Lugs etc.,</td>
      <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(95218)">Add Image</button>
<div class="upload-options" id="upload-options-95218" style="display: none;">
  <button class="add-image" onclick="startCamera(95218)">Camera</button>
  <label for="file-input-95218" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-95218" accept="image/*" multiple onchange="displayImages(this, 95218)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-95218"></div>
<!-- Camera Container -->
<div id="camera-container-95218" style="display: none;">
  <video id="camera-95218" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(95218)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(95218)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(95218)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-95218" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-84675">
      <td>8.8</td>
      <td class="observation_text">Ensure all cable routing shall be done properly as per Relay Room Layout. It should be neat, safe and no cable is hanging.</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(84675)">Add Image</button>
<div class="upload-options" id="upload-options-84675" style="display: none;">
  <button class="add-image" onclick="startCamera(84675)">Camera</button>
  <label for="file-input-84675" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-84675" accept="image/*" multiple onchange="displayImages(this, 84675)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-84675"></div>
<!-- Camera Container -->
<div id="camera-container-84675" style="display: none;">
  <video id="camera-84675" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(84675)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(84675)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(84675)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-84675" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-87495">
      <td>8.9</td>
      <td class="observation_text">Verify that appropriate Cable Glands are used for all cable entries.</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(87495)">Add Image</button>
<div class="upload-options" id="upload-options-87495" style="display: none;">
  <button class="add-image" onclick="startCamera(87495)">Camera</button>
  <label for="file-input-87495" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-87495" accept="image/*" multiple onchange="displayImages(this, 87495)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-87495"></div>
<!-- Camera Container -->
<div id="camera-container-87495" style="display: none;">
  <video id="camera-87495" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(87495)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(87495)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(87495)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-87495" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
     <tr id="row-321405">
      <td>8.10</td>
      <td class="observation_text">Verify wherever cable glands are not used, openings are closed with dummy glands.</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(321405)">Add Image</button>
<div class="upload-options" id="upload-options-321405" style="display: none;">
  <button class="add-image" onclick="startCamera(321405)">Camera</button>
  <label for="file-input-321405" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-321405" accept="image/*" multiple onchange="displayImages(this, 321405)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-321405"></div>
<!-- Camera Container -->
<div id="camera-container-321405" style="display: none;">
  <video id="camera-321405" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(321405)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(321405)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(321405)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-321405" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
  <tr id="row-96905">
      <td>8.11</td>
      <td class="observation_text">Ensure there is no gap between the floor and the door of the Kavach room </td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(96905)">Add Image</button>
<div class="upload-options" id="upload-options-96905" style="display: none;">
  <button class="add-image" onclick="startCamera(96905)">Camera</button>
  <label for="file-input-96905" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-96905" accept="image/*" multiple onchange="displayImages(this, 96905)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-96905"></div>
<!-- Camera Container -->
<div id="camera-container-96905" style="display: none;">
  <video id="camera-96905" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(96905)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(96905)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(96905)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-96905" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
  <tr id="row-57405">
      <td>8.12</td>
      <td class="observation_text">Verify all cable entry and exit points to Relay room is completely sealed with cement</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(57405)">Add Image</button>
<div class="upload-options" id="upload-options-57405" style="display: none;">
  <button class="add-image" onclick="startCamera(57405)">Camera</button>
  <label for="file-input-57405" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-57405" accept="image/*" multiple onchange="displayImages(this, 57405)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-57405"></div>
<!-- Camera Container -->
<div id="camera-container-57405" style="display: none;">
  <video id="camera-57405" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(57405)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(57405)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(57405)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-57405" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
    <tr id="row-75476">
      <td>8.13</td>
      <td class="observation_text">Verify the cables are properly connected as per OFC block diagram.
Ref : 5 16 49 0559
Ref : 5 16 76 0045</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(75476)">Add Image</button>
<div class="upload-options" id="upload-options-75476" style="display: none;">
  <button class="add-image" onclick="startCamera(75476)">Camera</button>
  <label for="file-input-75476" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-75476" accept="image/*" multiple onchange="displayImages(this, 75476)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-75476"></div>
<!-- Camera Container -->
<div id="camera-container-75476" style="display: none;">
  <video id="camera-75476" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(75476)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(75476)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(75476)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-75476" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
    <tr id="row-86421">
      <td>8.14</td>
      <td class="observation_text">Verify LED’s of all modules showing healthy when system is ON</td>
    <td class="select">
       <select id="status-dropdown" onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
      </td> 
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(86421)">Add Image</button>
<div class="upload-options" id="upload-options-86421" style="display: none;">
  <button class="add-image" onclick="startCamera(86421)">Camera</button>
  <label for="file-input-86421" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86421" accept="image/*" multiple onchange="displayImages(this, 86421)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-86421"></div>
<!-- Camera Container -->
<div id="camera-container-86421" style="display: none;">
  <video id="camera-86421" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86421)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86421)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86421)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86421" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>    
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('9_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('9_0')) { saveObservation('9_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
}
else if (section === "10.0") {
  mainContent.innerHTML += `
    <h3 class="section-heading">RFID tags</h3>
   <!-- Upload & Extract Section -->
<div>
    <button onclick="chooseAndUploadFile()">Upload File</button>
    <button onclick="extractExcelTags()">Extract TAG_ID</button>

    <!-- Allow .db files now -->
    <input type="file" id="supporting-file-10_0" name="supportingFile" accept=".db" style="display:none;" />

    <div id="uploaded-file-container"></div>
</div>


    <div class="table-container"> 
      <table class="observations" id="observations-section-10_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Description (TAG_ID)</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-10_0">
          <!-- Rows will be filled after extracting TAG_IDs -->
        </tbody>
      </table>
    </div>

    <div class="action-buttons">
      <button type="button" id="update-btn" style="background-color: blue; color: white; display:none;" onclick="updateObservation('10_0')">Update</button>
      <button type="button" id="save-btn" style="display: inline-block;" onclick="if(validateMandatoryImages('10_0')) { saveObservation('10_0'); }">Save</button>
      <button id="get-details-btn" onclick="getDetails()">Get Details</button>
    </div>
  `;
}

 else if (section === "11.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading">Tag to Tag Distance</h3>
      <div class="table-container"> 
      <table class="observations" id="observations-section-11_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Tag_No</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-11_0">
          <tr id="row-951">
      <td>10.1</td>
      <td class="tag_no" style="width: 20%;"><input type="text" id="tag-no-951" placeholder="enter tag no" style="width: 100%; box-sizing: border-box;"></td>
      <td class="select">
        <select id="status-dropdown" onchange="highlightSelect(this)">
          <option value="Select">Select</option>
          <option value="Fixed">Fixed</option>
          <option value="Not Fixed">Not Fixed</option>
        </select>
      </td>
      <td class="remarks" style="width: 40%;">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20" style="width: 100%; box-sizing: border-box;" oninput="enableUpdateButton(); markDataAsUnsaved();"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(951)">Add Image</button>
<div class="upload-options" id="upload-options-951" style="display: none;">
  <button class="add-image" onclick="startCamera(951)">Camera</button>
  <label for="file-input-951" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-951" accept="image/*" multiple onchange="displayImages(this, 951)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-951"></div>
<!-- Camera Container -->
<div id="camera-container-951" style="display: none;">
  <video id="camera-951" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(951)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(951)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(951)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-951" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr class="add-row-placeholder" id="add-row-11_0">
      <td colspan="5" style="text-align: left;">
        <button type="button" class="add-row" onclick="addRowSection8()">Add Row</button>
      </td>
    </tr>
     </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn-11_0" 
              style="background-color: blue; color: white; display:none;" 
              onclick="updateObservation('11_0')">
        Update
      </button>
        <button type="button" id= "save-btn-11_0" style = "display: inline-block;"  onclick="if(validateMandatoryImages('11_0')) { saveObservation('11_0'); }">Save</button>
         <button id="get-details-btn-11_0" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }

}


// Trigger file chooser, upload DB file, and convert to Excel
function chooseAndUploadFile() {
    let fileInput = document.getElementById("supporting-file-11_0");
    fileInput.click();

    fileInput.onchange = function () {
        let file = fileInput.files[0];
        if (!file) return;

        let formData = new FormData();
        formData.append("dbFile", file);

        // STEP 1: Upload DB file
        fetch("Db File Converter/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.text())
        .then(uploadResult => {
            document.getElementById("uploaded-file-container").innerText = uploadResult;

            if (uploadResult.includes("uploaded")) {
                // STEP 2: Call export to convert to Excel
                let dbFileName = file.name;
                let exportFormData = new FormData();
                exportFormData.append("dbFile", dbFileName);

                return fetch("Db File Converter/export", {
                    method: "POST",
                    body: exportFormData
                });
            } else {
                throw new Error("DB Upload failed");
            }
        })
        .then(res => res.text())
        .then(exportResult => {
            // STEP 3: Move the Excel file into /uploads/files (handled in export)
            document.getElementById("uploaded-file-container").innerHTML +=
                "<br>" + exportResult;

            alert("DB converted to Excel. Now you can extract TAG_ID.");
        })
        .catch(err => console.error("Error:", err));
    };
}

// Upload Excel to server (PHP handles saving)
function uploadSupportingFile7() {
    let fileInput = document.getElementById("supporting-file-11_0");
    let file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first.");
        return;
    }

    let formData = new FormData();
    formData.append("supportingFile", file);

    fetch("upload_Excelfile", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("uploaded-file-container").innerHTML = data;
    })
    .catch(error => console.error("Error:", error));
}
async function extractExcelTags() {
    const excelUrl = "uploads/files/database.xlsx"; // relative path from your HTML file

    const response = await fetch(excelUrl);
    if (!response.ok) {
        alert("Excel file not found. Please export DB to Excel first.");
        return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const tbody = document.getElementById("observations-tbody-11_0");
    tbody.innerHTML = ""; // clear old rows
    tbody.
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (rows.length === 0) return;

        const headerRow = rows[0];
        const uidIndex = headerRow.indexOf("UID");
        if (uidIndex === -1) return;

        rows.slice(1).forEach(row => {
            const uid = row[uidIndex];
            if (uid) {
                const displayIndex = tbody.rows.length + 1;
                tbody.innerHTML += `
                  <tr id="row-${displayIndex}">
                    <td>${displayIndex}</td>
                    <td class="observation_text">${uid}</td>
                    <td class="select">
                      <select onchange="highlightSelect(this)">
                        <option value="Select">Select</option>
                        <option value="Found Ok">Found Ok</option>
                        <option value="Found Not Ok">Found Not Ok</option>
                      </select>
                    </td>
                    <td class="remarks">
                      <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea>
                    </td>
                    <td>
                      <button class="add-image" onclick="showUploadOptions(${displayIndex})">Add Image</button>
                      <div class="upload-options" id="upload-options-${displayIndex}" style="display: none;">
                        <button class="add-image" onclick="startCamera(${displayIndex})">Camera</button>
                        <label for="file-input-${displayIndex}" class="upload-label">Upload from Device</label>
                        <input type="file" id="file-input-${displayIndex}" accept="image/*" multiple onchange="displayImages(this, ${displayIndex})">
                      </div>
                      <div id="image-container-${displayIndex}"></div>
                      <div id="camera-container-${displayIndex}" style="display: none;">
                        <video id="camera-${displayIndex}" width="100%" height="auto" autoplay></video>
                        <button class="add-image" onclick="captureImage(${displayIndex})">Capture Image</button>
                        <button class="add-image" onclick="stopCamera(${displayIndex})">Stop Camera</button>
                        <button class="reverse-camera" onclick="switchCamera(${displayIndex})">🔄 Switch Camera</button>
                        <canvas id="canvas-${displayIndex}" style="display: none;"></canvas>
                      </div>
                    </td>
                  </tr>
                `;
            }
        });
    });
}


// Function to handle the logout
function logout() {
  window.location.href = "login.html"; // Replace with your actual login page URL
}

// Event listener for dynamic shed name update

document.addEventListener("DOMContentLoaded", function () {


  function initDivisionLogic() {
    // Attempt to get the newly loaded or dynamically injected selects
    const zoneSelect = document.getElementById("zone");
    const divisionSelect = document.getElementById("division");



    // If they don't exist yet (because the form is injected later), re-check soon
    if (!divisionSelect || !zoneSelect) {

      setTimeout(initDivisionLogic, 100);
      return;
    }

    // Now that we have them, gather the <option data-zone="...">
    const allDivisionOptions = Array.from(
      divisionSelect.querySelectorAll("option[data-zone]")
    );

    // Expose a global function so inline onchange="updateDivisionNames()" works
    window.updateDivisionNames = function () {
      if (!zoneSelect || !divisionSelect) return;

      const selectedZone = zoneSelect.value;


      // Reset to a single 'Select' placeholder
      divisionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

      // Inject only those options whose data-zone matches
      allDivisionOptions.forEach(option => {
        if (option.getAttribute("data-zone") === selectedZone) {
          divisionSelect.appendChild(option.cloneNode(true));
        }
      });

      // Optionally disable if no valid division
      divisionSelect.disabled = !selectedZone;
    };

    // If a division is already selected (e.g. from session), update immediately
    window.updateDivisionNames();

  }

  function initSectionLogic() {
    // Attempt to get the newly loaded or dynamically injected selects
    const zoneSelect = document.getElementById("zone");
    const sectionSelect = document.getElementById("section-name");



    // If they don't exist yet (because the form is injected later), re-check soon
    if (!sectionSelect || !zoneSelect) {

      setTimeout(initSectionLogic, 100);
      return;
    }

    // Now that we have them, gather the <option data-zone="...">
    const allSectionOptions = Array.from(
      sectionSelect.querySelectorAll("option[data-zone]")
    );

    // Expose a global function so inline onchange="updateDivisionNames()" works
    window.updateSectionNames = function () {
      if (!zoneSelect || !sectionSelect) return;

      const selectedZone = zoneSelect.value;  


      // Reset to a single 'Select' placeholder
      sectionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

      // Inject only those options whose data-zone matches
      allSectionOptions.forEach(option => {
        if (option.getAttribute("data-zone") === selectedZone) {
          sectionSelect.appendChild(option.cloneNode(true));
        }
      });

      // Optionally disable if no valid division
      sectionSelect.disabled = !selectedZone;
    };

    // If a division is already selected (e.g. from session), update immediately
    window.updateSectionNames();

  }

  // Try to attach logic now; if the elements aren't there, we'll retry
  initDivisionLogic();
  initSectionLogic();
});


async function generateReport() {
  // Remove the beforeunload listener so that it won't trigger when clicking the button.
  window.removeEventListener("beforeunload", beforeUnloadHandler);
  const stationInfo=JSON.parse(sessionStorage.getItem("stationInfo")||"{}");
  const stationId = stationInfo.stationId;
  const division = stationInfo.division;
  const zone = stationInfo.zone;
  const sectionName = stationInfo.sectionName;

  if (!stationId || !division || !zone || !sectionName) {
    alert("Please fill all the fields.");
    return;
  }

  const response = await fetch("generateReport", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "station-id": stationId,
      "zone": zone,
      "division": division,
      "section-name": sectionName,
    }),
  });

  const data = await response.json();

  if (data.success) {
    // Store the fetched data in sessionStorage
    console.log("SOMETHING IS FISHYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    sessionStorage.setItem("stationDetails", JSON.stringify(data.stationDetails));
     sessionStorage.setItem(
      "observationsData",
      JSON.stringify(data.observations)
    );

    // Redirect to the observations page
    window.location.href = "observations.html";
  } else {
    alert(data.message || "Failed to generate the report");
  }

  if (data.success) {
    // Optional: Display Station Details on console
    console.log(data.stationDetails);
    console.log(data.observations);
  } else {
    alert(data.message);
  }
}


function showUploadOptions(rowId) {
  const uploadOptions = document.getElementById(`upload-options-${rowId}`);
  if (!uploadOptions) return;
  uploadOptions.style.display =
    uploadOptions.style.display === "none" ? "block" : "none";
}


// ---------------------------------------------------------------------------
// The "completeData" function
function completeData() {
  sessionStorage.removeItem("stationInfo");
  sessionStorage.removeItem("observations");
  // Observations table removed as per user request
  alert(
    "Data has been saved and cleared. You can now enter information for a new station."
  );
  document.getElementById("main-content").innerHTML = "";
}

function validateBarcode(input) {
  // Get the value from the input
  let value = input.value;

  // Remove any non-numeric characters
  value = value.replace(/\D/g, '');

  // Trim to the last 15 digits
  if (value.length > 15) {
    value = value.slice(-15);
  }

  // Update the input value with the last 15 digits
  input.value = value;
}

// ---------------------------------------------------------------------------
// Save Station Info
async function saveStationInfo(section) {
  const stationId = document.getElementById("station-id").value;
  const stationName = document.getElementById("station-name").value;
  const zone = document.getElementById("zone").value;
  const division = document.getElementById("division").value;
  const sectionName = document.getElementById("section-name").value;
  const initialDate = document.getElementById("initial-date").value;
  const updatedDate = document.getElementById("updated-date").value;

  if (
    !stationId ||
    !stationName ||
    !zone ||
    !division ||
    !sectionName ||
    !initialDate ||
    !updatedDate
  ) {
    alert("Please fill out all fields before saving.");
    return;
  }

  const stationData = {
    stationId: stationId,
    stationName: stationName,
    zone: zone,
    division: division,
    sectionName: sectionName,
    initialDate: initialDate,
    updatedDate: updatedDate,
  };

  // Save to sessionStorage
  sessionStorage.setItem("stationInfo", JSON.stringify(stationData));

  try {
    const response = await fetch("connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "station-id": stationId,
        "station-name": stationName,
        "zone": zone,
        "division": division,
        "section-name": sectionName,
        "initial-date": initialDate,
        "updated-date": updatedDate,
      }),
    });

    const data = await response.json();


    if (data.success) {
      showModal("Station info saved successfully!");
      // Once saved, no unsaved changes
      unsavedChanges = false;
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while saving the data.");
  }

  enableButtons();
}
document.addEventListener("click", function (event) {
  // Check if a "Get Details" button was clicked
  if (event.target.id === "get-details-btn") {
    // Remove highlight from all buttons
    document.querySelectorAll("#get-details-btn").forEach(btn => btn.classList.remove("highlight"));

    // Check if the button belongs to section "0.0" (using a data attribute)
    if (event.target.dataset.section === "0.0") {
      event.target.classList.add("highlight");
    }
  }
});


async function checkAndHighlightSections(stationId, zone, division) {
  // List of section IDs you want to check.
  // Adjust this list as needed.
  const sectionIds = ['0.0','2.0', '3.0', '4.0', '5.0', '6.0', '7.0'];
  let numSectionId;

  for (const sectionId of sectionIds) {
    if (sectionId==='0.0'){
        numSectionId=0;
    }
    else if(sectionId==='2.0'){
        numSectionId=2;
    }
    else if(sectionId==='3.0'){
        numSectionId=3;
    }
    else if(sectionId==='4.0'){
        numSectionId=4;
    }
    else if(sectionId==='5.0'){
        numSectionId=5;
    }
    else if(sectionId==='6.0'){
        numSectionId=6;
    }
    else if(sectionId==='7.0'){
        numSectionId=7;
    }
    const exists =await checkExistingObservations(stationId, division, zone, numSectionId);

    // Convert sectionId to a button ID.
    // For example: "1_0" becomes "button-1" and "2.0" becomes "button-2".
    let buttonId;
    if (sectionId.indexOf('_') !== -1) {
      buttonId = "button-" + sectionId.split('_')[0];
    } else if (sectionId.indexOf('.') !== -1) {
      buttonId = "button-" + sectionId.split('.')[0];
    } else {
      buttonId = "button-" + sectionId;
    }

    // Get the sidebar button by its ID.
    const button = document.getElementById(buttonId);

    if (button) {
      if (exists) {
        // When the section is filled, change the background color (light green) and enable the button.
        button.style.backgroundColor = "#b2ebf2";
        button.disabled = false;
      } else {
        // Otherwise, reset the background and keep it disabled.
        button.style.backgroundColor = "";
        button.disabled = false;
      }
    }
  }
}


async function checkExistingObservations(stationId, division, zone, sectionId) {
  try {

    const requestData = { stationId, division, zone, sectionId };


    const response = await fetch("checkObservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();


    return data.exists;
  } catch (error) {
    console.error("❌ Error checking existing observations:", error);
    return false;
  }
}

async function saveObservation(section) {
  const stationInfo=JSON.parse(sessionStorage.getItem("stationInfo")||"{}");

  const stationId=stationInfo.stationId||"";
  const stationName=stationInfo.stationName||"";
  const zone=stationInfo.zone||"";
  const division=stationInfo.division||"";
  const sectionName=stationInfo.sectionName||"";
  const initialDate=stationInfo.initialDate||"";
  const updatedDate=stationInfo.updatedDate||"";

  const saveBtn = document.querySelector(`#save-btn`);
  if (saveBtn) saveBtn.disabled = true;

  // ✅ Validate Station info
  if (!stationId || !zone || !division) {
    alert("⚠️ Please enter Station ID, Zone, and division.");
    if (saveBtn) saveBtn.disabled = false;
    return;
  }



  const formData = new FormData();
  formData.append("station-id", stationId);
  formData.append("station-name", stationName);
  formData.append("initial-date", initialDate);
  formData.append("division", division);
  formData.append("section-name", sectionName);
  formData.append("zone", zone);
  formData.append("updated-date", updatedDate);
  formData.append("section-id", section);

  const rows = document.querySelectorAll(`#observations-section-${section} tbody tr`);
  const observations = [];

  let anyDropdownSelected = false;

  for (const row of rows) {
    // Skip the Add Row placeholder if present
    if (row.classList.contains('add-row-placeholder')) continue;
    const S_no = row.querySelector("td:first-child")?.innerText.trim() || "";
    const obsField = row.querySelector(".observation_text");

    if (!obsField && section !== "11_0") {
      alert(`❌ Missing description field for S.No ${S_no}`);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    let descriptionHtml = "";
    if (obsField) {
      const clone = obsField.cloneNode(true);
      clone.querySelectorAll("input").forEach(i => i.remove());
      descriptionHtml = clone.innerHTML.trim();
    } else if (section === "11_0") {
      descriptionHtml = "Tag_No:";
    }

    if ((!descriptionHtml || descriptionHtml.toUpperCase() === "N/A") && section !== "11_0") {
      alert(`⚠️ Description cannot be empty or "N/A" for S.No ${S_no}`);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    const barcode = row.querySelector("input[type='text']")?.value.trim() || "";
    const text = (descriptionHtml + " " + barcode).trim();
    const remarks = row.querySelector(".remarks textarea")?.value.trim() || "";
    //const status = row.querySelector("select")?.value || "";
     let status = "";

      // ✅ Special case for S.No 4.2
      if (S_no === "4.2") {
        const inputs = row.querySelectorAll(".input-grid input");
        let values = [];
        inputs.forEach(inp => values.push(inp.value.trim()));
        status = values.join(" | "); // You can format however you like
        anyDropdownSelected=true;
      } else {
        status = row.querySelector("select")?.value || "";
        if (status && status !== "Select") {
          anyDropdownSelected = true;
        }
      }

    if (status && status !== "Select") {
      anyDropdownSelected = true;
    }

    const rowId = row.id.replace("row-", "");
    let imagePaths = [];

    try {
      imagePaths = await uploadDeviceImages(rowId);
    } catch (e) {
      alert(`❌ Image upload failed for row ${S_no}`);
      console.error("Image upload error:", e);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    observations.push({
      S_no,
      observation_text: text,
      remarks,
      observation_status: status,
      image_paths: imagePaths,
    });
  }

  // ✅ Check if at least one observation status is selected
  if (!anyDropdownSelected) {
    alert("⚠️ Please select at least one observation status before saving.");
    if (saveBtn) saveBtn.disabled = false;
    return;
  }

  formData.append("observations", JSON.stringify(observations));

  if (!confirm("💾 Do you want to save observations?")) {
    if (saveBtn) saveBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch(`section${section}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("❌ Network error while saving observations.");

    const data = await response.json();

    if (data.success) {
      document.getElementById("messageBox").innerText = "🎉 Observations saved successfully!";
      setTimeout(() => {
        document.getElementById("messageBox").innerText = "";
      }, 2000);

      unsavedChanges = false;

      const getDetailsBtn = document.querySelector(`#get-details-btn`);
      const updateBtn = document.querySelector(`#update-btn`);

      if (saveBtn) saveBtn.style.display = 'none';
      if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
      if (updateBtn) updateBtn.style.display = 'none';

        sessionStorage.setItem("stationInfo", JSON.stringify({
        stationId,
        stationName,
        zone,
        division,
        sectionName,
        initialDate,
        updatedDate
      }));


    } else {
      alert(data.message || "❌ Server returned failure.");
    }
  } catch (error) {
    alert("❌ Error saving observations.");
    console.error(error);
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}


// Function to populate station details
function populateStationDetails(stationDetails) {
  console.log("Station Details Response from DB:",stationDetails);
  sessionStorage.setItem("stationDetails", JSON.stringify(stationDetails));

  const normalizedStationInfo={
    stationId: stationDetails.station_id,
    stationName: stationDetails.station_name,
    zone: stationDetails.railway_zone||stationDetails.zone||"",
    division: stationDetails.division||stationDetails.railway_division||"",
    sectionName: stationDetails.section_name,
    initialDate: stationDetails.initial_date,
    updatedDate: stationDetails.updated_date
  };

  console.log("Normalized station Info to be stored:",normalizedStationInfo);

  sessionStorage.setItem("stationInfo",JSON.stringify(normalizedStationInfo));
  console.log("Stored in sessionStorage under 'stationInfo':",sessionStorage.getItem("stationInfo"));

   // Populate the form fields
  const stationIdInput = document.getElementById("station-id");
  const stationNameInput = document.getElementById("station-name");
  const zoneInput = document.getElementById("zone");
  const divisionInput = document.getElementById("division");
  const sectionNameInput=document.getElementById("section-name");
  const initialDateInput = document.getElementById("initial-date");
  const updateDateInput = document.getElementById("updated-date");

  if (stationIdInput) {
    stationIdInput.value = normalizedStationInfo.stationId || "";
    console.log("🔑 stationId set to:", stationIdInput.value);
  }

  if (stationNameInput) {
    stationNameInput.value = normalizedStationInfo.stationName || "";
    console.log("🏷️ stationName set to:", stationNameInput.value);
  }

  if (zoneInput) {
    zoneInput.value = normalizedStationInfo.zone || "";
    console.log("🌍 zone set to:", zoneInput.value);
  }

  if (divisionInput) {
    divisionInput.value = normalizedStationInfo.division || "";
    console.log("📌 division set to:", divisionInput.value);
  }

  if (sectionNameInput) {
    sectionNameInput.value = normalizedStationInfo.sectionName || "";
    console.log("📌 sectionName set to:", sectionNameInput.value);
  }

  // Dates (fallback to today if empty)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

  if (initialDateInput) {
    initialDateInput.value = normalizedStationInfo.initialDate || today;
    console.log("📅 initialDate set to:", initialDateInput.value);
  }

  if (updateDateInput) {
    updateDateInput.value = normalizedStationInfo.updatedDate || today;
    console.log("🕒 updatedDate set to:", updateDateInput.value);
  }

}



// Observations table removed as per user request
// Global store of everything you've fetched
window.allObservations = [];



// Global object to store edited barcode values keyed by rowId.
window.editedBarcodes = window.editedBarcodes || {};



/**
 * Filter & render a single section's table.
 */
function updateSections(observations, sectionID, sno) {
  const sectionContainer = document.getElementById(`observations-section-${sectionID}`);
  if (!sectionContainer) {
    console.warn(`⚠️ Section container not found for sectionID: ${sectionID}`);
    return;
  }
  enableSectionButtons(sectionID);
  const filtered = observations.filter(o => o.section_id === sectionID);
  if (filtered.length) {
    updateObservationsTable(sectionID, filtered, sno);
  } else {
    console.warn(`⚠️ No observations for section ${sectionID}`);
  }
}

/**
 * Rebuilds the <tbody> for one section.
 */
// Call this on input so the updated value is saved globally.
function updateEditedBarcode(rowId, value) {
  console.log("Updating barcode for row", rowId, "to:", value);
  window.editedBarcodes[rowId] = value;
}

function updateObservationsTable(sectionID, observations, sno) {
  const tbody = document.getElementById(`observations-tbody-${sectionID}`);
  if (!tbody) {
    console.error(`Table body #observations-tbody-${sectionID} not found.`);
    return;
  }

  tbody.innerHTML = "";

  // Filter observations for the current section.
  const filteredObservations = observations.filter(obs => obs.section_id === sectionID);

  // For each serial number, find an existing observation or create a default one.
  const allRows = sno.map(snoValue => {
    return filteredObservations.find(obs => obs.S_no === snoValue) || { S_no: snoValue, section_id: sectionID };
  });

  allRows.forEach((observation) => {
    const S_no = observation.S_no;
    let rowId = observation.rowId || S_no;

    // Only for section "2_0", override the barcode with any edited value.
    if (sectionID === "2_0" && S_no !== "2.1" && window.editedBarcodes && window.editedBarcodes[rowId] !== undefined) {
      console.log(`Row ${rowId} using edited barcode: ${window.editedBarcodes[rowId]}`);
      observation.barcode = window.editedBarcodes[rowId];
    }

    const dropdownOptions = getDropdownOptions(S_no, observation.observation_status);

    let imageHTML = "";
    if (observation.images && observation.images.length > 0) {
      imageHTML = observation.images
        .map((imgPath, idx) => `
          <div class="image-container" style="position: relative; display: inline-block;">
            <img
              id="captured-image-${rowId}-${idx}"
              src="${imgPath}"
              alt="Uploaded Image"
              width="100"
              style="margin:5px;"
              onerror="console.error('Error loading image:', this.src')">
            <span style="position:absolute; top:0; right:0; cursor:pointer; color:red; font-weight:bold;" onclick="deleteImage(event, '${sectionID}', '${S_no}', '${imgPath}')">&times;</span>
          </div>
        `).join("");
    }

    const imageUploadBlock = `
      <div class="image-container" id="image-container-${rowId}">
        ${imageHTML}
      </div>
      <button type="button" class="add-image" onclick="showUploadOptions('${rowId}')">
        Add/Update Image
      </button>
      <div class="upload-options" id="upload-options-${rowId}" style="display: none;">
        <button class="add-image" onclick="startCamera('${rowId}')">Camera</button>
        <label for="file-input-${rowId}" class="upload-label">Upload from Device</label>
        <input
          type="file"
          id="file-input-${rowId}"
          name="images[]"
          accept="image/*"
          multiple
          style="display:none;"
          onchange="displayImages(this, '${rowId}')">
      </div>
      <div id="camera-container-${rowId}" style="display: none;">
        <video id="camera-${rowId}" width="100%" height="auto" autoplay></video>
        <button class="add-image" onclick="captureImage('${rowId}')">Capture Image</button>
        <button class="add-image" onclick="stopCamera('${rowId}')">Stop Camera</button>
        <button class="reverse-camera" onclick="switchCamera('${rowId}')">🔄 Switch Camera</button>
        <canvas id="canvas-${rowId}" style="display: none;"></canvas>
      </div>
    `;

    // For the observation text cell, include the barcode input field only for section "2_0"
    let observationContent = observation.observation_text || "N/A";
    if (sectionID === "2_0" && S_no !== "2.1") {
      observationContent += `<br>
        <input
          type="text"
          id="barcode-input-${rowId}"
          name="barcode_kavach_main_unit"
          pattern="^\\d{10,15}$"
          title="Enter a number between 10 to 15 digits"
          placeholder="Scan Barcode"
          style="width: 180px; padding: 5px; font-size: 14px;"
          value="${observation.barcode || ''}"
oninput="
  // Keep only digits
  let cleaned = this.value.replace(/\D/g, '');
  if (cleaned.length > 15) cleaned = cleaned.slice(-15);
  this.value = cleaned;

  // Only update if barcode is between 10 and 15 digits
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    updateEditedBarcode('${rowId}', cleaned);
  } else {
    delete window.editedBarcodes['${rowId}'];
  }

  toggleNotInstalledOption(this);
"
/>`;
    }

    const row = document.createElement("tr");
    row.setAttribute("data-sno", S_no);
    row.setAttribute("id", `row-${rowId}`);

    row.innerHTML = `
      <td>${S_no}</td>
      <td class="observation_text">${observationContent}</td>
      <td>
        <select name="observation-status-${rowId}" id="status-${rowId}" onchange="highlightSelect(this); markDataAsUnsaved();">
          ${dropdownOptions}
        </select>
      </td>
      <td class="remarks">
        <textarea rows="2" cols="20" oninput="enableUpdateButton(); markDataAsUnsaved();">${observation.remarks || ""}</textarea>
      </td>
      ${sectionID !== "1_0" ? `<td>${imageUploadBlock}</td>` : ""}
    `;
        // ❌ Skip appending the row if description is empty or "N/A"
    if (!observationContent || observationContent.trim() === "N/A") {
      console.warn(`❌ Skipping row ${S_no} due to invalid description`);
      return;
    }


    tbody.appendChild(row);

    setTimeout(() => {
      const statusDropdown = document.getElementById(`status-${rowId}`);
      if (statusDropdown) {
        let valueToSet = observation.observation_status?.trim() || "Select";
        console.log(`Row ${rowId}: Setting dropdown value to "${valueToSet}"`);
        statusDropdown.value = valueToSet;

        const optionsArray = Array.from(statusDropdown.options).map(opt => opt.value);
        console.log(`Row ${rowId} options:`, optionsArray);

        highlightSelect(statusDropdown);
      }
    }, 100);
  });
}

function deleteImage(event, sectionID, s_no, imgPath) {
  event.preventDefault();
  event.stopPropagation();

  if (!confirm("Are you sure you want to delete this image?")) return;

  const stationId = document.getElementById("station-id").value;
  const relativePath = imgPath.replace(/^.*\/uploads\//, 'uploads/');

  fetch('deleteImage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ station_id: stationId, s_no, imgPath: relativePath })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Image deleted successfully.");

      // Remove the image element from DOM directly
      const imgContainer = event.target.closest('.image-container');
      if (imgContainer) {
        imgContainer.remove();
      }

      // Also update the observation object to remove this image
      const obs = observations.find(o => o.S_no === s_no && o.section_id === sectionID);
      if (obs && obs.images) {
        obs.images = obs.images.filter(path => path !== imgPath);
      }

    } else {
      alert("Failed to delete image: " + data.message);
    }
  })
  .catch(error => console.error('Error deleting image:', error));
}







// Function to update only the description part (if needed)
function updateObservationText(rowId, barcodeValue) {
  // Look for a span with class "description" within the observation cell.
  const descriptionSpan = document.querySelector(`#row-${rowId} td.observation_text .description`);
  if (descriptionSpan) {
    // For example, if you want to update the description to reflect the barcode:
    // (Adjust the logic as needed—you might simply leave the description unchanged.)
    descriptionSpan.textContent = `Updated Barcode: ${barcodeValue}`;
  }
}

// Function to handle barcode scanning
function handleBarcodeScan(rowId, barcodeValue) {
  // Update the input field's value
  const barcodeInput = document.querySelector(`#row-${rowId} input[name="barcode_kavach_main_unit"]`);
  if (barcodeInput) {
    barcodeInput.value = barcodeValue;
    updateEditedBarcode(rowId, barcodeValue);
  }
  // Optionally update the display of the description
  updateObservationText(rowId, barcodeValue);
}


// Enable update button if any changes occur
function enableUpdateButton() {
  const btn = document.getElementById("update-btn") || document.getElementById("update-button");
  if (btn) btn.disabled = false;
}

// Function to track changes in inputs (used for enabling the update button)
function trackChanges(element, isFile = false) {
  let initialValue = element.getAttribute("data-initial");
  let currentValue = isFile ? element.files.length > 0 : element.value;

  if (initialValue != currentValue) {
    const btn = document.getElementById("update-btn") || document.getElementById("update-button");
    if (btn) btn.disabled = false;
    unsavedChanges = true;
  }
}

// Explicit helper used in inline handlers to flag unsaved state
function markDataAsUnsaved() {
  unsavedChanges = true;
  const btn = document.getElementById("update-btn") || document.getElementById("update-button");
  if (btn) btn.disabled = false;
}

// Function to delete an image





function toggleNotInstalledOption(inputElement) {
  // Find the row containing this input
  const row = inputElement.closest('tr');
  if (!row) return;

  // Grab the dropdown in the same row
  const dropdown = row.querySelector('select');
  if (!dropdown) return;

  // Locate the "Not Installed" <option> in that dropdown
  const notInstalledOption = [...dropdown.options].find(
    option => option.value === 'Not Installed'
  );
  if (!notInstalledOption) return; // fixed typo: using notInstalledOption

  // If there's any text in the barcode input, disable "Not Installed"
  if (inputElement.value.trim() !== '') {
    notInstalledOption.disabled = true;

    // If the dropdown was already set to "Not Installed", reset it
    if (dropdown.value === 'Not Installed') {
      dropdown.value = 'Select';
    }
  } else {
    // If input is empty, re-enable "Not Installed"
    notInstalledOption.disabled = false;
  }
}


// Function to format observation description
function formatDescription(observationText) {
  let normalized = observationText.trim();

  // Match trailing numbers
  const trailingMatch = normalized.match(/(\d+\s*)+$/);
  if (!trailingMatch) return normalized; // No trailing numbers found, return the original text

  const trailingNumbers = trailingMatch[0].trim().split(/\s+/); // Split trailing numbers
  const labelsText = normalized.substring(0, trailingMatch.index).trim(); // Get text before the trailing numbers

  // Match labels that end with a colon
  const labels = labelsText.match(/[^:]+:/g);
  if (!labels) return normalized; // No labels found, return the original text

  // Return formatted string combining labels and numbers
  return labels.slice(0, trailingNumbers.length)
    .map((label, i) => label.trim() + trailingNumbers[i]) // Combine each label with its corresponding number
    .join(" , ");
}

// Function to fetch updated details when clicking "Get Details"
function getDetails() {
  let  stationId= document.getElementById("station-id").value.trim();
  let zone = document.getElementById("zone").value.trim();
  let division = document.getElementById("division").value.trim();
  let sectionName = document.getElementById("section-name").value.trim();


  if (!stationId || !zone || !division || !sectionName) {
    alert("Please fill in all the fields.");
    return;
  }

  console.log("📢 Fetching details for:", { stationId, zone, division, sectionName });

  $.ajax({
    url: "generateReport",
    type: "POST",
    data: {
      "station-id": stationId,
      "zone": zone,
      "division": division,
      "section-name": sectionName,

    },
    dataType: "json",
    success: async function (response) {
      console.log("✅ Server Response:", response);

      if (!response.success) {
        console.warn("⚠️ No details found:", response.message);
        alert(response.message);
        return;
      }


      console.log("🚂 Station Details Found:", response.stationDetails);
      populateStationDetails(response.stationDetails);


      let sectionWiseSno = {};

       response.observations.forEach((observation) => {
        let sectionID = observation.section_id;
        if (!sectionWiseSno[sectionID]) {
          sectionWiseSno[sectionID] = [];
        }
        sectionWiseSno[sectionID].push(observation.S_no);
      });

      console.log("📌 Section-wise S_no mapping:", sectionWiseSno);

      Object.keys(sectionWiseSno).forEach((sectionID) => {
        updateSections(response.observations, sectionID, sectionWiseSno[sectionID]);

        let updateBtn = document.getElementById(`update-btn-${sectionID}`);
        if (updateBtn) {
          updateBtn.disabled = false;
        }
      });

      setTimeout(() => {
        response.observations.forEach((observation) => {
          if (observation.images && observation.images.length > 0) {
            console.log(`📸 Displaying images for S_no: ${observation.S_no}`, observation.images);
            displayImagesWithDelete(observation.images, observation.rowId);
          }
        });
      }, 500);

      await checkAndHighlightSections(stationId, zone, division);

      // Hide Save button and show Update button when Get Details is clicked
      document.getElementById('save-btn').style.display = 'none';
      document.getElementById('update-btn').style.display = 'inline-block'; // Show Update button
      // After details are reloaded, consider state clean
      unsavedChanges = false;
      const btn = document.getElementById('update-btn');
      if (btn) btn.disabled = true;
    },
    error: function (xhr, status, error) {
      console.error("❌ Error fetching data from server:", status, error);
      alert("There was an error fetching the data.");
    },
  });
}

// Modified displayImages function to include delete icon
function displayImagesWithDelete(images, rowId) {
  const imageContainer = document.getElementById(`image-container-${rowId}`);
  if (imageContainer) {
    images.forEach((imgPath, idx) => {
      const imgHTML = `
        <div class="image-container">
          <img
            id="captured-image-${rowId}-${idx}"
            src="${imgPath}"
            alt="Uploaded Image"
            width="100"
            style="display:block; margin:5px;"
            onerror="console.error('Error loading image:', this.src)">
          <button type="button" onclick="deleteImage('${rowId}', '${imgPath}')">Delete</button>
        </div>
      `;
      imageContainer.innerHTML += imgHTML;
    });
  }
}


/**
 * Update existing observations for a given section.
 * Uses rowFiles map, deletedImagesMap, uploadImages helper,
 * and preserves multi-file uploads from device and camera captures.
 */
async function updateObservation(section) {
  // 1) Section mapping (optional index)
  const sectionMapping = {
    "2_0": 0,  "3_0": 1,  "4_0": 2,
    "5_0": 3,  "6_0": 4,  "7_0": 5,  "8_0": 6, "9_0":7, "10_0":8, "11_0":9
  };

  // 2) Section‐level fields
  const stationId          = document.getElementById("station-id").value;
  const zone       = document.getElementById("zone").value;
  const division = document.getElementById("division").value;
  const sectionName=document.getElementById("section-name").value;

  if (sectionMapping[section] === undefined) {
    alert("Invalid section provided.");
    return;
  }

  // 3) Mandatory‐images check
  if (!validateMandatoryImages(section)) return;

  // 4) Build base FormData
  const formData = new FormData();
  formData.append("station-id",          stationId);
  formData.append("station-name",        document.getElementById("station-name").value);
  formData.append("initial-date",       document.getElementById("initial-date").value);
  formData.append("zone", zone);
  formData.append("division",        division);
  formData.append("section-name",       sectionName);
  formData.append("updated-date",  document.getElementById("updated-date").value);
  formData.append("section-id",       section);
  formData.append("action",           "update");
  formData.append("section_index",    sectionMapping[section]);

  // 5) Gather per-row observations
  const observations = [];
  let hasChanges = false;
  const rows = document.querySelectorAll(`#observations-section-${section} tbody tr`);

  for (const row of rows) {
    const rowId = row.id.replace("row-", "");
    const S_no  = row.querySelector("td:nth-child(1)")?.innerText.trim() || "";

    // 5a) Text, barcode (for 2_0), remarks, status
    let observationText = row.querySelector(".observation_text")?.textContent.trim() || "";
    if (section === "11_0") {
      const tagInput = row.querySelector("td:nth-child(2) input[type='text']");
      const tagVal = tagInput ? tagInput.value.trim() : "";
      observationText = tagVal ? `Tag_No: ${tagVal}` : "";
      if (tagVal) hasChanges = true;
    }
    let barcodeValue    = "";
    if (section === "2_0") {
      const bcInput = row.querySelector("input[name='barcode_kavach_main_unit']");
      if (bcInput) {
        barcodeValue = bcInput.value.trim().slice(-15);
        if (bcInput.dataset.initialValue !== barcodeValue) hasChanges = true;
      }
    }

    const remarks           = row.querySelector(".remarks textarea")?.value.trim() || "";
    const observationStatus = row.querySelector("select")?.value || "";
    if (observationStatus && observationStatus !== "Select") hasChanges = true;
    if (observationText || remarks || barcodeValue)        hasChanges = true;
    if (!observationStatus && !remarks && !barcodeValue && !observationText) continue;

    // 5b) Gather ALL images currently in the container
    const existingPaths = [];
    const imgContainer  = document.getElementById(`image-container-${rowId}`);
    if (imgContainer) {
      imgContainer.querySelectorAll("img").forEach(img => {
        const rel = img.src.replace(/^.*\/uploads\//, "uploads/");
        existingPaths.push(rel);
      });
    }

    // 5c) Deleted images
    const deletedPaths = Array.from(deletedImagesMap[rowId] || []);

    // 5d) Upload new Files/Blobs from rowFiles map
    let uploadedPaths = [];
    const newFiles = rowFiles.get(rowId) || [];
    if (newFiles.length) {
      try {
        uploadedPaths = await uploadImages(newFiles);
        rowFiles.set(rowId, []); // clear queue
      } catch (err) {
        alert(`❌ Failed to upload images for row ${rowId}: ${err}`);
        return;
      }
    }

    // 5e) Consolidate final image list
    const allImages = [
      ...existingPaths.filter(p => !deletedPaths.includes(p)),
      ...uploadedPaths
    ];

    observations.push({
      S_no,
      observation_text:  observationText,
      barcode:           barcodeValue,
      remarks,
      observation_status: observationStatus,
      image_paths:       allImages,
      deleted_images:    deletedPaths
    });
  }

  // 6) Abort if no modifications
  if (!hasChanges) {
    alert("No changes detected. Modify at least one entry before updating.");
    return;
  }

  // 7) Append JSON payload
  formData.append("observations", JSON.stringify(observations));

  // 8) Submit update
  try {
    const resp = await fetch("updateObservations", { method: "POST", body: formData });
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error("Server returned non-JSON response"); }

    if (data.success) {
      alert("✅ Observations updated successfully!");
      unsavedChanges = false;
      // Disable update button after successful save
      const btn = document.getElementById('update-btn') || document.getElementById('update-button');
      if (btn) btn.disabled = true;
      getDetails();
    } else {
      alert(`Error from server: ${data.message}`);
    }
  } catch (err) {
    console.error("Error updating observations:", err);
    alert("An error occurred during update: " + err.message);
  }
}
// Function to enable section buttons dynamically
function enableSectionButtons(sectionID) {
  // Extract only the main section number (before underscore, if present)
  const sectionNumber = sectionID.split("_")[0];

  const button = document.getElementById(`button-${sectionNumber}`);
  if (button) {
    button.disabled = false;
  } else {
    console.warn(`Button not found for section: ${sectionID}`);
  }
}

// Build the dropdown options (your function provided earlier)
function getDropdownOptions(sno, observationStatus) {
  let isSelected = !observationStatus || observationStatus.trim() === "" || observationStatus.trim() === "Select";
  let defaultOption = `<option value="Select" ${isSelected ? "selected" : ""}>Select</option>`;

  if (!sno || typeof sno !== "string") {
    console.error("Invalid S_no value:", sno);
    return defaultOption;
  }
const specificOptions = {
   "1.1": ["Present", "Not Present"],
    "1.38,1.39,1.40,1.41,1.42,1.43,1.50,1.44,1.45,1.46,1.47,1.48,1.49" : ["Matching", "Not Matching", "Not Installed", "Not Applicable"],    "1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,1.10,1.11,1.12,1.13,1.14,1.15,1.16,1.17,1.18,1.19,1.20,1.21,1.22,1.23,1.24,1.25,1.26,1.27,1.28,1.29,1.30,1.31,1.32,1.33,1.34,1.35,1.36,1.37": ["Matching", "Not Matching", "Not Installed"],
    "2.1,3.1,3.3,3.12,3.17,3.23,3.24,4.1,4.5,3.18,3.19,5.1,5.3,5.4,6.1,6.2,6.3,6.4" : ["Found Ok","Found Not Ok"],
    "3.4,3.5,3.6,3.15,3.22" : ["Implemented","Not Implemeneted"],
    "2.2,2.7,2.8,2.13" : ["Fixed","Not Fixed"],
    "3.16,3.21,4.3,5.2,5.5": ["Connected","Not Connected"],
    "2.5,2.14,3.2,3.14,3.25" : ["Routing done", "Routing Not done"],
    "2.10,2.17,3.9,3.10" : ["Voltage found Ok" , "Voltage found not Ok"],
    "2.12,2.15,3.20" : ["Done","Not Done"],
    "2.16,5.7,5.8,4.4,2.18": ["Ok","Not Ok"],
    "3.11": ["PCCL Done","PCCL Not Done"],
    "2.11": ["Earth Connected","Earth not connected"],
    "5.6": ["Matching","Not Matching"],
    "3.13": ["Identification Done","Identification Not Done"],
    "2.4,2.9": ["Cable ties implemented","Cable ties not implemented"],
    "2.3":["Joined","Not Joined"],
    "3.7": ["Installed","Not Installed"],
    "3.8":["Rating as per Diagram:","Actual Rating:"],
    "4.2": ["Quantity Matched","Quantity Not Matched"],
    "4.6":["Connected","Not Connected","Not Applicable"],
    "4.7,2.6":["Yes","No"],
  };


  for (const [key, values] of Object.entries(specificOptions)) {
    const keys = key.split(",").map(k => k.trim());
    for (const k of keys) {
      if (k.includes("-")) {
        const [start, end] = k.split("-").map(Number);
        const numSno = parseFloat(sno);
        if (numSno >= start && numSno <= end) {
          const matchedOptions = values.map(value =>
            `<option value="${value}" ${observationStatus?.trim() === value ? "selected" : ""}>${value}</option>`
          ).join("\n");
          return defaultOption + "\n" + matchedOptions;
        }
      } else if (sno === k) {
        const matchedOptions = values.map(value =>
          `<option value="${value}" ${observationStatus?.trim() === value ? "selected" : ""}>${value}</option>`
        ).join("\n");
        return defaultOption + "\n" + matchedOptions;
      }
    }
  }

  return defaultOption;
}





function formatDescription(description) {
  let normalized = description.trim();
  const trailingMatch = normalized.match(/(\d+\s*)+$/);
  if (!trailingMatch) return normalized;

  const trailingNumbers = trailingMatch[0].trim().split(/\s+/);
  const labelsText = normalized.substring(0, trailingMatch.index).trim();
  const labels = labelsText.match(/[^:]+:/g);
  if (!labels) return normalized;

  return labels.slice(0, trailingNumbers.length)
    .map((label, i) => label.trim() + trailingNumbers[i])
    .join(" , ");
}



function showModal() {
  const modal = document.getElementById("success-modal");
  modal.style.display = "block"; // Show modal
  setTimeout(() => {
    modal.style.display = "none"; // Hide modal after 3 seconds
  }, 3000);
}

// Helper function to handle input selection (only one checked)
function onlyOneChecked(target, name) {
  const checkboxes = document.getElementsByName(name);
  checkboxes.forEach((checkbox) => {
    if (checkbox !== target) checkbox.checked = false;
  });
}



function showUploadOptions(rowId) {
  const uploadBox = document.getElementById(`upload-options-${rowId}`);
  if (!uploadBox) {
    console.warn(`Upload options not found for rowId: ${rowId}`);
    return;
  }
  uploadBox.style.display = uploadBox.style.display === "none" ? "block" : "none";
}


let currentCamera = "environment"; // Default to back camera
let observations = [];

// ✅ Start Camera
async function startCamera(rowId) {
  const cameraContainer = document.getElementById(`camera-container-${rowId}`);
  const video = document.getElementById(`camera-${rowId}`);

  if (!video || !cameraContainer) {
    console.error(`❌ Missing camera elements for row ${rowId}`);
    return;
  }

  try {
    const constraints = {
      video: { facingMode: currentCamera },
      audio: false,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    cameraContainer.style.display = "block";
    console.log(`🎥 Camera started (Mode: ${currentCamera})`);
  } catch (error) {
    console.error("🚨 Error starting the camera:", error);
    alert("⚠️ Unable to access the camera. Please check permissions.");
  }
}

// ✅ Stop Camera
function stopCamera(rowId) {
  const video = document.getElementById(`camera-${rowId}`);
  if (!video) return;

  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }

  const cameraContainer = document.getElementById(`camera-container-${rowId}`);
  if (cameraContainer) cameraContainer.style.display = "none";

  console.log("🛑 Camera stopped.");
}

function enableButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = false));
}

// ✅ Capture Image
function captureImage(rowId) {
  const canvas = document.getElementById(`canvas-${rowId}`);
  const video = document.getElementById(`camera-${rowId}`);
  const imageContainer = document.getElementById(`image-container-${rowId}`);

  if (!canvas || !video || !imageContainer) {
    console.error(`❌ Missing elements for row ${rowId}`);
    return;
  }

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    alert("⚠️ Camera not active. Please start the camera first.");
    return;
  }

  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  console.log("📸 Capturing image...");

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error("⚠️ Failed to create image blob.");
      return;
    }

    // Log the blob size and type to confirm it was created correctly
    console.log("📝 Image blob created. Size:", blob.size, "Type:", blob.type);

    // Upload the captured image
    uploadCapturedImage(blob, rowId, imageContainer);
  }, "image/png");

  stopCamera(rowId); // Stop the camera only after the image is captured
}


// ✅ Upload Captured Image and Add to rowFiles
function uploadCapturedImage(blob, rowId, imageContainer) {
  const formData = new FormData();
  formData.append("images[]", blob, `capture-${rowId}.png`);

  console.log("📤 Uploading captured image...");

  fetch("upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📜 Upload response:", data);

      if (data.success && data.file_paths && data.file_paths.length > 0) {
        const imageUrl = data.file_paths[0];

        // Add the captured image URL to the image container and rowFiles map
        addImageWithDeleteIcon(imageUrl, imageContainer, rowId); // Use reusable function
        updateObservations(rowId, imageUrl);

        // Add captured image URL to rowFiles (if it's not already in there)
        const files = rowFiles.get(rowId) || [];
        files.push(imageUrl);  // Add imageUrl from captured image
        rowFiles.set(rowId, files);

        console.log(`✅ Image uploaded: ${imageUrl}`);
      } else {
        alert(`⚠️ Capture upload failed: ${data.message || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("🚨 Error uploading image:", error);
      alert("⚠️ Image upload failed.");
    });
}


async function uploadDeviceImages(rowId) {
  let imagePaths = [];

  const imageContainer = document.getElementById(`image-container-${rowId}`);
  if (imageContainer) {
    const imgs = imageContainer.querySelectorAll("img");
    for (const img of imgs) {
      const src = img.getAttribute("src");
      if (src.startsWith("data:image")) {
        // Optional: convert base64 to blob + upload here if needed
        console.warn("Base64 image detected. Already uploaded via camera.");
      } else {
        const relative = src.replace(/^.*\/uploads\//, "uploads/");
        imagePaths.push(relative);
      }
    }
  }

  // Then upload files from rowFiles map (device uploads)
  const files = rowFiles.get(rowId) || [];
  if (files.length > 0) {
    const fd = new FormData();
    files.forEach(f => fd.append("images[]", f));

    try {
      const response = await fetch("upload", {
        method: "POST",
        body: fd
      });
      const data = await response.json();
      if (data.success && data.file_paths) {
        data.file_paths.forEach(path => {
          imagePaths.push(path);
        });
      } else {
        alert("❌ Upload failed.");
        return [];
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      return [];
    }
  }

  return imagePaths;
}

// ✅ Reusable function to add image with delete icon
function addImageWithDeleteIcon(imageUrl, imageContainer, rowId) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "inline-block";
  wrapper.style.position = "relative";
  wrapper.style.margin = "5px";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.width = "100px";
  img.style.display = "block";
  img.style.border = "1px solid #ccc";

  // Create delete icon
  const deleteIcon = document.createElement("span");
  deleteIcon.innerHTML = "&times;"; // × symbol
  deleteIcon.style.position = "absolute";
  deleteIcon.style.top = "-8px";
  deleteIcon.style.right = "-8px";
  deleteIcon.style.backgroundColor = "#f44336";
  deleteIcon.style.color = "#fff";
  deleteIcon.style.width = "20px";
  deleteIcon.style.height = "20px";
  deleteIcon.style.borderRadius = "50%";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.style.textAlign = "center";
  deleteIcon.style.lineHeight = "20px";
  deleteIcon.style.fontWeight = "bold";
  deleteIcon.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

  deleteIcon.onclick = () => {
    wrapper.remove();
    console.log("✅ Deleted image:", imageUrl);
    removeImageFromObservations(rowId, imageUrl); // optional backend logic
  };

  wrapper.appendChild(img);
  wrapper.appendChild(deleteIcon);
  imageContainer.appendChild(wrapper);
}


// Optional: Function to remove image from backend observations (if needed)
function removeImageFromObservations(rowId, imageUrl) {
  // Implement backend deletion logic here
  fetch("deleteImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ rowId, imageUrl })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("🗑️ Image removed from backend.");
      } else {
        console.error("⚠️ Failed to remove image from backend:", data.message);
      }
    })
    .catch(error => {
      console.error("🚨 Error in removing image from backend:", error);
    });
}


// ✅ Update Observations Array
function updateObservations(rowId, imagePath) {
  let observation = observations.find((obs) => obs.S_no === rowId);

  if (observation) {
    observation.image_path = imagePath;
  } else {
    observations.push({
      S_no: rowId,
      observation_text: "",
      remarks: "",
      observation_status: "",
      image_path: imagePath,
    });
  }

  console.log("📜 Updated Observations:", observations);
}

// ✅ Switch Camera (Front/Back)
function switchCamera(rowId) {
  currentCamera = currentCamera === "environment" ? "user" : "environment";
  stopCamera(rowId);
  startCamera(rowId);
}


// Step 1: Function to handle file upload
function handleFileUpload(rowId, imgElementId) {
  const files = rowFiles.get(rowId); // Get the list of files for the specific row
  if (!files || files.length === 0) {
    alert("No files selected for upload.");
    return;
  }

  const formData = new FormData();

  // Step 2: Append each file with a unique name (timestamp to avoid overwriting)
  files.forEach((file) => {
    console.log(`📤 Adding ${file.name} to formData...`);

    // Append file with a unique identifier
    const timestamp = Date.now();
    formData.append("images[]", file, `${file.name.split('.')[0]}_${timestamp}.${file.name.split('.').pop()}`);
  });

  console.log('🔄 Sending images to upload...');

  // Step 3: Send the request to upload via Fetch API
  fetch("upload", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      console.log("Upload Response:", data); // Debugging log
      if (data.success) {
        // Step 4: If upload is successful, update the image elements with the uploaded file paths
        const imgElement = document.getElementById(imgElementId);

        // Check if the file paths are returned as expected
        data.file_paths.forEach((filePath) => {
          // Display uploaded image(s)
          const img = document.createElement("img");
          img.src = filePath; // Use the returned file path
          img.style.display = "block";
          imgElement.appendChild(img); // Append to the imgElement
        });
      } else {
        alert("Upload failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload.");
    });
}


// at top of your script:
const rowFiles = new Map();  // rowId → Array<File>
function displayImages(inputElement, rowId) {
  rowId = String(rowId); // ✅ Always treat rowId as a string
  console.log(`📥 Triggered displayImages for row ${rowId}`);

  const imageContainer = document.getElementById(`image-container-${rowId}`);
  if (!imageContainer) {
    console.error(`❌ Image container not found for rowId: ${rowId}`);
    return;
  }

  const newFiles = Array.from(inputElement.files);
  if (newFiles.length === 0) {
    console.warn("⚠️ No files selected for upload.");
    return;
  }

  const existing = rowFiles.get(rowId) || [];
  existing.push(...newFiles);
  rowFiles.set(rowId, existing);
  console.log(`📦 After pick, row ${rowId} has ${existing.length} total files`);

  newFiles.forEach(file => {
    console.log(`🔍 Reading file: ${file.name}`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      console.log(`🖼️ Preview ready for: ${file.name}`);

      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        display: "inline-block", position: "relative", margin: "5px"
      });

      const img = document.createElement("img");
      img.src = imageUrl;
      Object.assign(img.style, { width: "100px", border: "1px solid #ccc" });

      const del = document.createElement("span");
      del.innerHTML = "&times;";
      Object.assign(del.style, {
        position: "absolute", top: "-8px", right: "-8px",
        backgroundColor: "#f44336", color: "#fff",
        width: "20px", height: "20px", borderRadius: "50%",
        cursor: "pointer", textAlign: "center", lineHeight: "20px",
        fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      });

      del.onclick = () => {
        wrapper.remove();
        const arr = rowFiles.get(rowId).filter(f => f !== file);
        rowFiles.set(rowId, arr);
        console.log(`🗑️ Deleted file ${file.name}; ${arr.length} remain for row ${rowId}`);
      };

      wrapper.append(img, del);
      imageContainer.append(wrapper);
    };
    reader.readAsDataURL(file);
  });
}


function uploadImages(files) {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      return resolve([]); // nothing to do
    }

    const formData = new FormData();
    let appended = 0;

    files.forEach((f, idx) => {
      // only append File or Blob instances
      if (f instanceof File || f instanceof Blob) {
        // preserve original name if available, else give a default
        const filename = f.name || `capture_${idx}.png`;
        console.log(`📤 Adding ${filename} to formData…`);
        formData.append('images[]', f, filename);
        appended++;
      } else {
        console.log(`⚠️ Skipping non-file entry at index ${idx}:`, f);
      }
    });

    if (appended === 0) {
      console.log('⚠️ No valid File/Blob objects to upload.');
      return resolve([]);
    }

    console.log('🔄 Sending images to upload…');
    fetch('upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Response from server:', data);
        if (data.success) {
          resolve(data.file_paths);
        } else {
          console.error('❌ Image upload failed:', data.message);
          reject(data.message);
        }
      })
      .catch(err => {
        console.error('🚨 Upload error:', err);
        alert('Upload failed due to a network or server error.');
      });
  });
}


function highlightSelect(selectElement) {
   if (selectElement.value === "Not Present") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Present") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Matching") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Matching") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Found Ok") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Installed") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Implemented") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Applicable") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Fixed") {
    selectElement.style.backgroundColor = "Green";
  } else if (selectElement.value === "Found Not Ok") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Connected") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Implemeneted") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Routing done") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Fixed") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Voltage found Ok") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Connected") {
    selectElement.style.backgroundColor = "yellow";
  } else if (selectElement.value === "Done") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Voltage found not Ok") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Ok") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Done") {
    selectElement.style.backgroundColor = "red";
  }else if (selectElement.value === "Routing Not done") {
    selectElement.style.backgroundColor = "red";
  }  else if (selectElement.value === "PCCL Done") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Ok") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Earth Connected") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "PCCL Not Done") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Functioning") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Earth not connected") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Identification Done") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Cable ties implemented") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Functioning") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Joined") {
    selectElement.style.backgroundColor = "Green";
  } else if (selectElement.value === "Identification Not Done") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Installed") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Cable ties not implemented") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Rating as per Diagram:") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Joined") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "Actual Rating:") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Not Installed") {
    selectElement.style.backgroundColor = "red";
  }else if (selectElement.value === "Quantity Matched") {
    selectElement.style.backgroundColor = "green";
  }
  else if (selectElement.value === "Yes") {
    selectElement.style.backgroundColor = "green";
  } else if (selectElement.value === "Quantity Not Matched") {
    selectElement.style.backgroundColor = "red";
  } else if (selectElement.value === "No") {
    selectElement.style.backgroundColor = "red";
  } else {
    selectElement.style.backgroundColor = "";
  }

}

const deletedImagesMap = {}; // Tracks deleted image URLs for each observationID

// 1) define per‑section lists of S_no that require an image
const mandatoryImageRowsBySection = {
  "3_0": ["3.1","3.5","3.7","3.8","3.11"],
  "4_0": ["4.1","4.2"],
  "5_0": ["5.2","5.3","5.4","5.5"],
  "6_0": ["6.2","6.3","6.6","6.8","6.9","6.10"],
  "7_0": ["7.1","7.3"],

};

function validateMandatoryImages(sectionID) {
  const mandatory = mandatoryImageRowsBySection[sectionID] || [];
  const tbody     = document.querySelector(`#observations-tbody-${sectionID}`);
  const missing   = [];

  if (!tbody) return true;

  tbody.querySelectorAll("tr").forEach(tr => {
    const sno = tr.cells[0]?.textContent.trim();
    if (!mandatory.includes(sno)) return;       // not one of the must‑have rows

    const sel = tr.querySelector("select");
    if (!sel || sel.value === "Select") return; // still default → skip

    // **NEW**: look for any <img> in the 5th cell
    const imgCell = tr.cells[4];
    const imgs    = imgCell?.querySelectorAll("img") || [];

    if (imgs.length === 0) {
      missing.push(sno);
    }
  });

  if (missing.length) {
    alert(`🚫 Image required for rows: ${missing.join(", ")}`);
    return false;
  }
  return true;
}

// Add new row for section 8.0 (RFID PS Unit Observations)
function addRowSection8() {
  const sectionId = "11_0";
  const tbody = document.getElementById(`observations-tbody-${sectionId}`);
  if (!tbody) return;

  // Determine next S_no: find last numeric s_no in existing rows
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const sNos = rows
    .map(tr => parseFloat(tr.cells?.[0]?.textContent))
    .filter(n => !isNaN(n));
  const base = 7.0; // continue after 7.x as per first row 7.1
  const nextIndex = sNos.length ? Math.max(...sNos) + 0.1 : base + 0.1;
  const nextSno = nextIndex.toFixed(1);

  // Create a unique rowId using sno without dot
  const rowId = nextSno.replace(".", "");

  // Build row HTML
  const tr = document.createElement("tr");
  tr.id = `row-${rowId}`;
  tr.innerHTML = `
      <td>${nextSno}</td>
      <td class="tag_no" style="width: 20%;"><input type="text" id="tag-no-${rowId}" placeholder="enter tag no" style="width: 100%; box-sizing: border-box;"></td>
      <td class="select">
        <select onchange="highlightSelect(this)">
          <option value="Select">Select</option>
          <option value="Torquing done">Details in annexure -A</option>
        </select>
      </td>
      <td class="remarks" style="width: 40%;">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20" style="width: 100%; box-sizing: border-box;"></textarea><br>
      </td>
      <td>
        <button class="add-image" onclick="showUploadOptions(${rowId})">Add Image</button>
        <div class="upload-options" id="upload-options-${rowId}" style="display: none;">
          <button class="add-image" onclick="startCamera(${rowId})">Camera</button>
          <label for="file-input-${rowId}" class="upload-label">Upload from Device</label>
          <input type="file" id="file-input-${rowId}" accept="image/*" multiple onchange="displayImages(this, ${rowId})">
        </div>
        <div id="image-container-${rowId}"></div>
        <div id="camera-container-${rowId}" style="display: none;">
          <video id="camera-${rowId}" width="100%" height="auto" autoplay></video>
          <button class="add-image" onclick="captureImage(${rowId})">Capture Image</button>
          <button class="add-image" onclick="stopCamera(${rowId})">Stop Camera</button>
          <button class="reverse-camera" onclick="switchCamera(${rowId})">🔄 Switch Camera</button>
          <canvas id="canvas-${rowId}" style="display: none;"></canvas>
        </div>
      </td>
  `;

  // Insert before the add-row placeholder if it exists, else append
  const addRowPlaceholder = document.getElementById(`add-row-${sectionId}`);
  if (addRowPlaceholder) {
    tbody.insertBefore(tr, addRowPlaceholder);
  } else {
    tbody.appendChild(tr);
  }
}

function addRowSection9() {
  const sectionId = "9_0";
  const tbody = document.getElementById(`observations-tbody-${sectionId}`);
  if (!tbody) return;

  // Determine next S_no: find last numeric s_no in existing rows
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const sNos = rows
    .map(tr => parseFloat(tr.cells?.[0]?.textContent))
    .filter(n => !isNaN(n));

  const base = 1;
  const nextIndex = sNos.length ? Math.max(...sNos) + 1 : base + 1;
  const nextSno = nextIndex.toFixed(1);

  // Create a unique rowId using sno without dot
  const rowId = nextSno.replace(".", "");

  // Build row HTML
  const tr = document.createElement("tr");
  tr.id = `row-${rowId}`;
  tr.innerHTML = `
    <td>${nextSno}</td>
    <td class="SA_tag_no">
      <input type="text" id="SA_tag-no-${rowId}" placeholder="enter SA tag no" style="width: 100%; box-sizing: border-box;">
    </td>
    <td class="SF_tag_no">
      <input type="text" id="SF_tag-no-${rowId}" placeholder="enter SF tag no" style="width: 100%; box-sizing: border-box;">
    </td>
    <td class="Req-Dis">
      <input type="text" id="Req-Dis-${rowId}" placeholder="enter Required Distance as per Layout" style="width: 100%; box-sizing: border-box;">
    </td>
    <td class="Act-Dis">
      <input type="text" id="Act-Dis-${rowId}" placeholder="enter Actual Distance" style="width: 100%; box-sizing: border-box;">
    </td>
    <td>
      <button class="add-image" onclick="showUploadOptions(${rowId})">Add Image</button>
      <div class="upload-options" id="upload-options-${rowId}" style="display: none;">
        <button class="add-image" onclick="startCamera(${rowId})">Camera</button>
        <label for="file-input-${rowId}" class="upload-label">Upload from Device</label>
        <input type="file" id="file-input-${rowId}" accept="image/*" multiple onchange="displayImages(this, ${rowId})">
      </div>
      <div id="image-container-${rowId}"></div>
      <div id="camera-container-${rowId}" style="display: none;">
        <video id="camera-${rowId}" width="100%" height="auto" autoplay></video>
        <button class="add-image" onclick="captureImage(${rowId})">Capture Image</button>
        <button class="add-image" onclick="stopCamera(${rowId})">Stop Camera</button>
        <button class="reverse-camera" onclick="switchCamera(${rowId})">🔄 Switch Camera</button>
        <canvas id="canvas-${rowId}" style="display: none;"></canvas>
      </div>
    </td>
  `;

  // Insert before the add-row placeholder if it exists, else append
  const addNextRowPlaceholder = document.getElementById(`add-next-row-${sectionId}`);
  if (addNextRowPlaceholder) {
    tbody.insertBefore(tr, addNextRowPlaceholder);
  } else {
    tbody.appendChild(tr);
  }
}

// Function to ensure only one checkbox is selected at a time for a given group
function onlyOneChecked(checkbox, groupClass) {
  // Get all checkboxes in the same group
  const checkboxes = document.querySelectorAll(`.${groupClass}`);

  // Count how many checkboxes in the group are checked
  const checkedCount = Array.from(checkboxes).filter(
    (box) => box.checked
  ).length;

  // If more than one checkbox is checked, uncheck all others
  if (checkedCount > 1) {
    checkboxes.forEach((box) => {
      if (box !== checkbox) {
        box.checked = false; // Uncheck other checkboxes
      }
    });
  }
}





