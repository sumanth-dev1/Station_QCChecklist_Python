let unsavedChanges = false;
const rowImages = new Map(); // Store images for each row
// Delegated event listeners to track any changes and enable the Update button automatically
document.addEventListener("change", function (event) {
  if (event.target.matches("input, select, textarea")) {
    markDataAsUnsaved();
    autoSaveToDB();
  }
});
document.addEventListener("input", function (event) {
  if (event.target.matches("input, textarea")) {
    markDataAsUnsaved();
    autoSaveToDB();
  }
});

function collectTableData() {
  const rows = document.querySelectorAll("#observations-tbody-2_0 tr");
  let data = [];
  rows.forEach((row) => {
    const row_key = row.getAttribute("data-key");
    if (!row_key) return; // Skip rows without data-key

    let sno = (row.querySelector(".sno") || row.querySelector("td:first-child"))?.innerText || "";
    sno = sno.trim().replace("🗑️", "").trim();

    const barcode = row.querySelector('input[name="barcode_kavach_main_unit"]')?.value.trim() || "";
    const status = row.querySelector("select")?.value || "";
    const remarks = row.querySelector("textarea")?.value || "";

    const obsField = row.querySelector(".observation_text");
    let descriptionHtml = "";
    if (obsField) {
      const clone = obsField.cloneNode(true);
      clone.querySelectorAll("input").forEach(i => i.remove());
      descriptionHtml = clone.innerHTML.trim().replace(/<br\s*\/?>$/i, "").trim();
    }
    const text = (descriptionHtml + " " + barcode).trim();

    data.push({
      row_key,
      sno,
      barcode,
      status,
      remarks,
      observation_text: text
    });
  });
  return data;
}

let saveTimer;
function autoSaveToDB() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tbody = document.getElementById("observations-tbody-2_0");
    if (!tbody) return; // Only apply auto-save to section 2.0 right now

    const stationIdElem = document.getElementById("station-id");
    if (!stationIdElem || !stationIdElem.value) return;

    const tableData = collectTableData();
    if (tableData.length === 0) return;

    fetch("update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        station_id: stationIdElem.value,
        rows: tableData
      })
    })
    .then(res => {
        if (!res.ok) throw new Error("Network response was not ok: " + res.status);
        return res.text();
    })
    .then(data => {
      console.log("Auto saved:", data);
    })
    .catch(err => {
      console.error("Auto save error:", err);
    });
  }, 1000);
}

const k = 0
// Variables to store station info from session or none
let stationId = "";
let stationName = "";
let zone = [];
let division = [];
let sectionName = [];
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
    { name: "Solapur", zone: "CR" },
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
    { name: "Solapur", zone: "CR" },
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

// Toggle subsections visibility
function toggleSubsections(button) {
  const subsectionsDiv = button.nextElementSibling;
  if (subsectionsDiv && subsectionsDiv.classList.contains('subsections')) {
    // Toggle the display
    const isHidden = subsectionsDiv.style.display === 'none' || subsectionsDiv.style.display === '';

    if (isHidden) {
      subsectionsDiv.style.display = 'block';
      subsectionsDiv.classList.add('show');
      // Update arrow icon by replacing text content carefully
      const text = button.innerText;
      if (text.startsWith('▶')) {
        button.innerText = text.replace('▶', '▼');
      }
      button.classList.add('expanded');
    } else {
      subsectionsDiv.style.display = 'none';
      subsectionsDiv.classList.remove('show');
      // Update arrow icon by replacing text content carefully
      const text = button.innerText;
      if (text.startsWith('▼')) {
        button.innerText = text.replace('▼', '▶');
      }
      button.classList.remove('expanded');
    }
  }
}

// Store current active subsection globally
let activeSubsection = null;

// Function to clear section content while preserving station info
function clearSectionContent() {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  // Find and remove all table containers (sections)
  const tableContainers = mainContent.querySelectorAll('.table-container');
  tableContainers.forEach(container => container.remove());

  // Find and remove action buttons div
  const actionButtons = mainContent.querySelector('.action-buttons');
  if (actionButtons) {
    actionButtons.remove();
  }

  // Find and remove section headings
  const headings = mainContent.querySelectorAll('.section-heading');
  headings.forEach(heading => heading.remove());
}

// Function to filter table rows based on subsection
function filterTableRows(tableId, subsection) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.warn(`Table with ID ${tableId} not found`);
    return;
  }

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    // Get the first cell content (S_No)
    const firstCell = row.querySelector('td:first-child');
    const sNo = firstCell ? firstCell.innerText.trim() : '';

    if (!subsection) {
      // If no subsection specified, show all rows
      row.style.display = '';
      visibleCount++;
    } else {
      // Only show rows that start with the subsection number
      if (sNo && sNo.startsWith(subsection)) {
        row.style.display = '';
        visibleCount++;
        console.log(`Showing row: ${sNo}`);
      } else {
        row.style.display = 'none';
        console.log(`Hiding row: ${sNo} (looking for: ${subsection})`);
      }
    }
  });

  console.log(`Filter complete. Showing ${visibleCount} out of ${rows.length} rows for subsection ${subsection}`);
}

// In showSection, decide if it's okay to switch sections, and if so, highlight the new button.
async function showSection(section, subsection) {
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

  // Handle subsection buttons
  const allSubsectionButtons = document.querySelectorAll(".sidebar .subsection-button");
  allSubsectionButtons.forEach(btn => btn.classList.remove("active"));

  // If subsection is provided, highlight the active subsection button
  if (subsection) {
    activeSubsection = subsection;
    const activeSubBtn = [...allSubsectionButtons].find(btn => {
      return btn.getAttribute('onclick') === `showSection('${section}', '${subsection}')`;
    });
    if (activeSubBtn) {
      activeSubBtn.classList.add("active");
    }
  } else {
    activeSubsection = null;
  }

  const newActiveBtn = [...buttons].find(btn => {
    return btn.getAttribute('onclick') === `showSection('${section}')`;
  });

  if (newActiveBtn) {
    newActiveBtn.classList.add("active");
  }



  const mainContent = document.getElementById("main-content");
  const currentDate = new Date().toISOString().split("T")[0];

  // ✅ Global listeners to ensure ANY change in the section enables the Update button
  mainContent.removeEventListener("input", markDataAsUnsaved);
  mainContent.removeEventListener("change", markDataAsUnsaved);
  mainContent.addEventListener("input", markDataAsUnsaved);
  mainContent.addEventListener("change", markDataAsUnsaved);

  const storedLocal = localStorage.getItem("stationDetails");
  const storedSession = sessionStorage.getItem("stationInfo");

  console.log("Stored session data:", storedSession);

  let stationInfo = {};
  if (storedLocal) {
    stationInfo = JSON.parse(storedLocal);
  }
  else if (storedSession) {
    stationInfo = JSON.parse(storedSession);
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
  const stationId = stationInfo.stationId;
  const division = stationInfo.division;
  const zone = stationInfo.zone;


  let backendSectionId = section;
  if (["0.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0", "9.0", "10.0", "11.0", "12.0", "13.0", "14.0"].includes(section)) {
    backendSectionId = parseInt(section, 10);
  }


  const existsPromise = checkExistingObservations(stationId, division, zone, backendSectionId, subsection);

  setTimeout(async () => {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
      const saveBtn = actionButtons.querySelector('#save-btn');
      const getDetailsBtn = actionButtons.querySelector('#get-details-btn');
      const updateBtn = actionButtons.querySelector('#update-btn');

      // NEW: Check in-memory observations first to maintain state across subsection navigation
      if (window.allObservations && window.allObservations.length > 0) {
        let hasDataForCurrentSection = false;
        let renderSectionId = section.replace('.', '_');

        if (subsection) {
          // Check if currently loaded data has entries for this specific subsection/prefix
          hasDataForCurrentSection = window.allObservations.some(obs => obs.S_no && String(obs.S_no).startsWith(subsection));
          console.log(`[showSection] In-memory check for subsection ${subsection}: ${hasDataForCurrentSection}`);
        } else {
          // If no subsection, check if we have data for this specific section ID
          hasDataForCurrentSection = window.allObservations.some(obs => obs.section_id === renderSectionId);
          console.log(`[showSection] In-memory check for section ${section} (${renderSectionId}): ${hasDataForCurrentSection}`);
        }

        if (hasDataForCurrentSection) {
          // RENDER DATA IF AVAILABLE to ensure form is populated
          if (window.sectionWiseSno && window.sectionWiseSno[renderSectionId]) {
            console.log("Rendering in-memory data for section:", renderSectionId);
            updateSections(window.allObservations, renderSectionId, window.sectionWiseSno[renderSectionId]);
          }

          if (saveBtn) saveBtn.style.display = 'none';
          if (getDetailsBtn) getDetailsBtn.style.display = 'none';
          if (updateBtn) updateBtn.style.display = 'inline-block';
        } else {
          // Current section has NO data, so show Save button (user can enter new data)
          if (saveBtn) saveBtn.style.display = 'inline-block';
          if (getDetailsBtn) getDetailsBtn.style.display = 'none';
          if (updateBtn) updateBtn.style.display = 'none';
        }
        return;
      }

      const exists = await existsPromise;

      // If we don't have local data, but DB says exists:
      if (exists) {
        console.log("DB indicates data exists. Showing Get Details button...");
        // USER REQUEST: Show Get Details button instead of auto-fetching
        if (saveBtn) saveBtn.style.display = 'none';
        if (section === "0.0") {
          // Section 0.0 might have different behavior, but keeping consistent
          if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
        } else {
          if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
        }
        if (updateBtn) updateBtn.style.display = 'none';
        return;
      }

      // If exists is false:
      if (saveBtn) saveBtn.style.display = 'inline-block';
      if (getDetailsBtn) getDetailsBtn.style.display = 'none';
      if (updateBtn) updateBtn.style.display = 'none';

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

      setTimeout(() => {
        const sectionNameElem = document.getElementById("section-name");
        if (sectionNameElem && stationInfo.sectionName) {
          sectionNameElem.value = stationInfo.sectionName;
          console.log("Setting section value to:", stationInfo.sectionName);
        }
      }, 50);
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



  const stationDetailsHTML = `
    <div id="form-container">
      <section>
        <form id="stationForm" action="connect" method="POST" onsubmit="event.preventDefault(); return false;">
          <table class="detail-box station-table">
            <tr>
              <td><strong>Station ID:</strong><input type="text" id="station-id" placeholder="Enter the Station ID" value="${stationInfo ? stationInfo.stationId : ""}"></td>
              <td><strong>Station Name:</strong><input type="text" id="station-name" placeholder="Enter the Station Name" value="${stationInfo ? stationInfo.stationName : ""}"></td>
              <td><strong>Zone:</strong>
                <select name="zone" id="zone" onchange="updateDivisionNames(); updateSectionNames();">
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
                  <option value="Solapur" data-zone="CR" ${stationInfo && stationInfo.division === "Solapur" ? "selected" : ""}>Solapur</option>
                  <option value="Howrah-COO" data-zone="ER" ${stationInfo && stationInfo.division === "Howrah-COO" ? "selected" : ""}>Howrah-COO</option>
                  <option value="Pt Deendayal Upadhy - Pradhankhnta" data-zone="ECR" ${stationInfo && stationInfo.division === "Pt Deendayal Upadhy - Pradhankhnta" ? "selected" : ""}>Pt Deendayal Upadhy - Pradhankhnta</option>
                  <option value="Fly-over Cabin to Bhabua Road" data-zone="ECR" ${stationInfo && stationInfo.division === "Fly-over Cabin to Bhabua Road" ? "selected" : ""}>Fly-over Cabin to Bhabua Road</option>
                  <option value="Yadudih to Nimiyaghat" data-zone="ECR" ${stationInfo && stationInfo.division === "Yadudih to Nimiyaghat" ? "selected" : ""}>Yadudih to Nimiyaghat</option>
                  <option value="Sasaram to Rafigunj" data-zone="ECR" ${stationInfo && stationInfo.division === "Sasaram to Rafigunj" ? "selected" : ""}>Sasaram to Rafigunj</option>
                  <option value="Manpur to Sharmantnar" data-zone="ECR" ${stationInfo && stationInfo.division === "Manpur to Sharmantnar" ? "selected" : ""}>Manpur to Sharmantnar</option>
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
                  <option value="Kota_Ruthiyai Jn" data-zone="WCR" ${stationInfo && stationInfo.division === "Kota_Ruthiyai Jn" ? "selected" : ""}>Kota_Ruthiyai Jn</option>
                </select>
              </td>
              <td><strong>Section :</strong>
                <select id="section-name">
                  <option value="" disabled selected>Select</option>
                  <option value="Mumbai" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Mumbai" ? "selected" : ""}>Mumbai</option>
                  <option value="Nagpur" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Nagpur" ? "selected" : ""}>Nagpur</option>
                  <option value="Bhusawal" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Bhusawal" ? "selected" : ""}>Bhusawal</option>
                  <option value="Pune" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Pune" ? "selected" : ""}>Pune</option>
                  <option value="Solapur" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Solapur" ? "selected" : ""}>Solapur</option>
                  <option value="Howrah-COO" data-zone="ER" ${stationInfo && stationInfo.sectionName === "Howrah-COO" ? "selected" : ""}>Howrah-COO</option>
                  <option value="Pt Deendayal Upadhy - Pradhankhnta" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Pt Deendayal Upadhy - Pradhankhnta" ? "selected" : ""}>Pt Deendayal Upadhy - Pradhankhnta</option>
                  <option value="Fly-over Cabin to Bhabua Road" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Fly-over Cabin to Bhabua Road" ? "selected" : ""}>Fly-over Cabin to Bhabua Road</option>
                  <option value="Yadudih to Nimiyaghat" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Yadudih to Nimiyaghat" ? "selected" : ""}>Yadudih to Nimiyaghat</option>
                  <option value="Sasaram to Rafigunj" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Sasaram to Rafigunj" ? "selected" : ""}>Sasaram to Rafigunj</option>
                  <option value="Manpur to Sharmantnar" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Manpur to Sharmantnar" ? "selected" : ""}>Manpur to Sharmantnar</option>
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
                  <option value="Kota_Ruthiyai Jn" data-zone="WCR" ${stationInfo && stationInfo.sectionName === "Kota_Ruthiyai Jn" ? "selected" : ""}>Kota_Ruthiyai Jn</option>
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

  // Function toggleNotInstalledOption if missing (adding it here globally or checking if it exists)
  if (typeof window.toggleNotInstalledOption === 'undefined') {
    window.toggleNotInstalledOption = function (input) {
      const row = input.closest('tr');
      if (!row) return;
      const select = row.querySelector('.status-dropdown');
      if (!select) return;

      if (input.value.trim() === "") {
        // If previously set to Not Installed automatically, maybe reset?
        // But requirements are vague. For now, empty implementation to stop errors.
      } else {
        // If user enters barcode, maybe they expect status to update?
        // Existing logic in other sections suggests:
        // if (input.value.length >= 10) select.value = "Matching"; // Example logic
      }
    };

    console.log("toggleNotInstalledOption function added to prevent errors.");
  }

  // Function enableUpdateButton if missing
  if (typeof window.enableUpdateButton === 'undefined') {
    window.enableUpdateButton = function () {
      const updateBtn = document.getElementById('update-btn');
      if (updateBtn) {
        updateBtn.style.display = 'inline-block';
        updateBtn.disabled = false;

        // Also hide save button if update is available?
        // Based on context, usually one or the other.
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) saveBtn.style.display = 'none';
      }
    };
    console.log("enableUpdateButton function added to prevent errors.");
  }


  console.log(k);

  // Note: Division dropdown is already populated in the HTML template above
  // and the zone value is already set, so updateDivisionNames() will be called
  // automatically when the zone dropdown's onchange event fires

  setTimeout(() => {
    const initialDateInput = document.getElementById("initial-date");
    if (initialDateInput) {
      // Use stored initialDate if available, otherwise use today
      let dateValue = (stationInfo && stationInfo.initialDate) ? new Date(stationInfo.initialDate) : new Date();
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, "0");
      const day = String(dateValue.getDate()).padStart(2, "0");
      initialDateInput.value = `${year}-${month}-${day}`;
    }

    const updatedDateInput = document.getElementById("updated-date");
    if (updatedDateInput) {
      // Always use today for updatedDate when opening to edit
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      updatedDateInput.value = `${year}-${month}-${day}`;
    }
  }, 10);



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
  } else if (section === "2.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading">SERIAL NUMBER VERIFICATION</h3>
      <div class="table-container">
      <table class="observations" id="observations-section-2_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Units/Serial Numbers</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-2_0">
        <tr id="row-11" data-key="stationary-kavach-unit">
        <td class="sno">1.1</td>
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
      
      <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
  
      <td class ="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
      </td>
      <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-11" style="display: none;">
      <button class="add-image" onclick="startCamera(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-11" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-11" accept="image/*" multiple onchange="displayImages(this, 11)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-11"></div>
      <!-- Camera Container -->
    <div id="camera-container-11" style="display: none;">
      <video id="camera-11" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-11" style="display: none;"></canvas>
    </div>
  </td>
    </tr>
        <tr id="row-12" data-key="ppc_1">
        <td class="sno">1.2</td>
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
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
      <td class ="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
      </td>
      <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-12" style="display: none;">
      <button class="add-image" onclick="startCamera(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-12" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-12" accept="image/*" multiple onchange="displayImages(this, 12)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-12"></div>
      <!-- Camera Container -->
    <div id="camera-container-12" style="display: none;">
      <video id="camera-12" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-12" style="display: none;"></canvas>
    </div>
  </td>

    </tr>

    <tr id="row-13" data-key="ppc_2">
  <td class="sno">1.3</td>
  <td class="observation_text" style="padding-right: 10px;">
    Peripheral Processing Card 2
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 113) {
      this.value = this.value.slice(-113);
    }
    toggleNotInstalledOption(this);
  "/>
  </td>
  

  
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
  
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-13" style="display: none;">
      <button class="add-image" onclick="startCamera(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-13" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-13" accept="image/*" multiple onchange="displayImages(this, 13)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-13"></div>
      <!-- Camera Container -->
    <div id="camera-container-13" style="display: none;">
      <video id="camera-13" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-13" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-14" data-key="vcc_1">
  <td class="sno">1.4</td>
  <td class="observation_text" style="padding-right: 10px;">
   Vital Computer Card -1
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
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
  
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-14" style="display: none;">
      <button class="add-image" onclick="startCamera(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-14" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-14" accept="image/*" multiple onchange="displayImages(this, 14)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-14"></div>
      <!-- Camera Container -->
    <div id="camera-container-14" style="display: none;">
      <video id="camera-14" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-14" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-15" data-key="vcc-2">
  <td class="sno">1.5</td>
  <td class="observation_text">
    Vital Computer Card -2
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
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
 <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-15" style="display: none;">
      <button class="add-image" onclick="startCamera(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-15" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-15" accept="image/*" multiple onchange="displayImages(this, 15)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-15"></div>
      <!-- Camera Container -->
    <div id="camera-container-15" style="display: none;">
      <video id="camera-15" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-15" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-16" data-key="vcc-3">
  <td class="sno">1.6</td>
   <td class="observation_text">
    Vital Computer Card -3<input 
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
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-16" style="display: none;">
      <button class="add-image" onclick="startCamera(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-16" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-16" accept="image/*" multiple onchange="displayImages(this, 16)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-16"></div>
      <!-- Camera Container -->
    <div id="camera-container-16" style="display: none;">
      <video id="camera-16" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-16" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-17" data-key="vc-1">
  <td class="sno">1.7</td>
   <td class="observation_text">
    Voter Card -1 <input 
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
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-17" style="display: none;">
      <button class="add-image" onclick="startCamera(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-17" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-17" accept="image/*" multiple onchange="displayImages(this, 17)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-17"></div>
      <!-- Camera Container -->
    <div id="camera-container-17" style="display: none;">
      <video id="camera-17" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-17" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-18" data-key="vc-2">
  <td class="sno">1.8</td>
  <td class="observation_text">
     Voter Card -2<input 
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
   <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(18)">Add Image</button>
    <div class="upload-options" id="upload-options-18" style="display: none;">
      <button class="add-image" onclick="startCamera(18)">Camera</button>
      <label for="file-input-18" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-18" accept="image/*" multiple onchange="displayImages(this, 18)">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-18"></div>
      <!-- Camera Container -->
    <div id="camera-container-18" style="display: none;">
      <video id="camera-18" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(18)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(18)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(18)">🔄 Switch Camera</button>
      <canvas id="canvas-18" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-19" data-key="vgc-1">
  <td class="sno">1.9</td>
  <td class="observation_text">
    Vital Gateway Card 1 (S2S) <input 
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
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
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
      <button class="reverse-camera" onclick="switchCamera(19)">🔄 Switch Camera</button>
      <canvas id="canvas-19" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-110" data-key="vgc-2">
  <td class="sno">1.10</td>
  <td class="observation_text">      
   Vital Gateway Card 2 (S2S) <input 
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
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
       <button class="add-image" onclick="showUploadOptions(110)">Add Image</button>
<div class="upload-options" id="upload-options-110" style="display: none;">
  <button class="add-image" onclick="startCamera(110)">Camera</button>
  <label for="file-input-110" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-110" accept="image/*" multiple onchange="displayImages(this, 110)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-110"></div>
      <!-- Camera Container -->
<div id="camera-container-110" style="display: none;">
  <video id="camera-110" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(110)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(110)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(110)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-110" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>

          </tr>
          <tr id="row-111" data-key="vgc-3">
            <td class="sno">1.11</td>
           <td class="observation_text">Vital Gateway Card 3 (NMS)
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
              <td>
       <button class="add-image" onclick="showUploadOptions(111)">Add Image</button>
<div class="upload-options" id="upload-options-111" style="display: none;">
  <button class="add-image" onclick="startCamera(111)">Camera</button>
  <label for="file-input-111" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-111" accept="image/*" multiple onchange="displayImages(this, 111)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-111"></div>
      <!-- Camera Container -->
<div id="camera-container-111" style="display: none;">
  <video id="camera-111" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(111)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(111)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(111)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-111" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-14" data-key="eig-1">
            <td class="sno">1.12</td>
           <td class="observation_text"> EI Gateway-1
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

        
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
             <td>
       <button class="add-image" onclick="showUploadOptions(1111)">Add Image</button>
<div class="upload-options" id="upload-options-1111" style="display: none;">
  <button class="add-image" onclick="startCamera(1111)">Camera</button>
  <label for="file-input-1111" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-1111" accept="image/*" multiple onchange="displayImages(this, 1111)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1111"></div>
      <!-- Camera Container -->
<div id="camera-container-1111" style="display: none;">
  <video id="camera-1111" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1111)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1111)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1111)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1111" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-113" data-key="eig-2">
            <td class="sno">1.13</td>
           <td class="observation_text"> EI Gateway-2
        <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 113) {
      this.value = this.value.slice(-113);
    }
    toggleNotInstalledOption(this);
  "
/>  
 <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
          <td>
       <button class="add-image" onclick="showUploadOptions(113)">Add Image</button>
<div class="upload-options" id="upload-options-113" style="display: none;">
  <button class="add-image" onclick="startCamera(113)">Camera</button>
 <label for="file-input-113" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-113" accept="image/*" multiple onchange="displayImages(this, 113)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-113"></div>
      <!-- Camera Container -->
<div id="camera-container-113" style="display: none;">
  <video id="camera-113" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(113)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(113)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(113)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-113" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-114" data-key="fiu-1">
            <td class="sno">1.14</td>
           <td class="observation_text">
FIU Scanner Card 1
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

            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(114)">Add Image</button>
<div class="upload-options" id="upload-options-114" style="display: none;">
  <button class="add-image" onclick="startCamera(114)">Camera</button>
  <label for="file-input-114" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-114" accept="image/*" multiple onchange="displayImages(this, 114)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-114"></div>
      <!-- Camera Container -->
<div id="camera-container-114" style="display: none;">
  <video id="camera-114" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(114)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(114)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(114)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-114" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-115" data-key="fiu-2">
            <td class="sno">1.15</td>
           <td class="observation_text">FIU Scanner Card 2
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(115)">Add Image</button>
<div class="upload-options" id="upload-options-115" style="display: none;">
  <button class="add-image" onclick="startCamera(115)">Camera</button>
 <label for="file-input-115" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-115" accept="image/*" multiple onchange="displayImages(this, 115)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-115"></div>
      <!-- Camera Container -->
<div id="camera-container-115" style="display: none;">
  <video id="camera-115" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(115)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(115)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(115)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-115" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-1150" data-key="fiu-3">
            <td class="sno">1.16</td>
           <td class="observation_text">FIU Scanner Card 3
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(1150)">Add Image</button>
<div class="upload-options" id="upload-options-1150" style="display: none;">
  <button class="add-image" onclick="startCamera(1150)">Camera</button>
 <label for="file-input-1150" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-1150" accept="image/*" multiple onchange="displayImages(this, 1150)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1150"></div>
      <!-- Camera Container -->
<div id="camera-container-1150" style="display: none;">
  <video id="camera-1150" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1150)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1150)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1150)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1150" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-11554" data-key="fiu-4">
            <td class="sno">1.17</td>
           <td class="observation_text">FIU Scanner Card 4
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(11554)">Add Image</button>
<div class="upload-options" id="upload-options-11554" style="display: none;">
  <button class="add-image" onclick="startCamera(11554)">Camera</button>
 <label for="file-input-11554" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-11554" accept="image/*" multiple onchange="displayImages(this, 11554)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-11554"></div>
      <!-- Camera Container -->
<div id="camera-container-11554" style="display: none;">
  <video id="camera-11554" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(11554)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(11554)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(11554)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-11554" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
           </tr>
          <tr id="row-11550" data-key="fiu-5">
            <td class="sno">1.18</td>
           <td class="observation_text">FIU Scanner Card 5
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(11550)">Add Image</button>
<div class="upload-options" id="upload-options-11550" style="display: none;">
  <button class="add-image" onclick="startCamera(11550)">Camera</button>
 <label for="file-input-11550" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-11550" accept="image/*" multiple onchange="displayImages(this, 11550)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-11550"></div>
      <!-- Camera Container -->
<div id="camera-container-11550" style="display: none;">
  <video id="camera-11550" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(11550)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(11550)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(11550)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-11550" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          </tr>
          <tr id="row-11458" data-key="fiu-6">
            <td class="sno">1.19</td>
           <td class="observation_text">FIU Scanner Card 6
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(11458)">Add Image</button>
<div class="upload-options" id="upload-options-11458" style="display: none;">
  <button class="add-image" onclick="startCamera(11458)">Camera</button>
 <label for="file-input-11458" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-11458" accept="image/*" multiple onchange="displayImages(this, 11458)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-11458"></div>
      <!-- Camera Container -->
<div id="camera-container-11458" style="display: none;">
  <video id="camera-11458" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(11458)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(11458)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(11458)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-11458" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-116" data-key="fiu-7">
            <td class="sno">1.20</td>
           <td class="observation_text"> FIU Scanner Card 7
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(116)">Add Image</button>
<div class="upload-options" id="upload-options-116" style="display: none;">
  <button class="add-image" onclick="startCamera(116)">Camera</button>
<label for="file-input-116" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-116" accept="image/*" onchange="displayImages(this, 116)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-116"></div>
      <!-- Camera Container -->
<div id="camera-container-116" style="display: none;">
  <video id="camera-116" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(116)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(116)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(116)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-116" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-117" data-key="fiu-8">
            <td class="sno">1.21</td>
           <td class="observation_text"> FIU Scanner Card 8
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
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(117)">Add Image</button>
<div class="upload-options" id="upload-options-117" style="display: none;">
  <button class="add-image" onclick="startCamera(117)">Camera</button>
  <label for="file-input-117" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-117" accept="image/*" multiple onchange="displayImages(this, 117)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-117"></div>
      <!-- Camera Container -->
<div id="camera-container-117" style="display: none;">
  <video id="camera-117" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(117)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(117)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(117)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-117" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-118" data-key="riu-comm-1">
            <td class="sno">1.22</td>
           <td class="observation_text"> RIU communication card 1-Host
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(118)">Add Image</button>
<div class="upload-options" id="upload-options-118" style="display: none;">
  <button class="add-image" onclick="startCamera(118)">Camera</button>
 <label for="file-input-118" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-118" accept="image/*" multiple onchange="displayImages(this, 118)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-118"></div>
      <!-- Camera Container -->
<div id="camera-container-118" style="display: none;">
  <video id="camera-118" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(118)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(118)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(118)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-118" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-119" data-key="riu-comm-2">
            <td class="sno">1.23</td>
           <td class="observation_text"> RIU communication card 2-Host
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
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(119)">Add Image</button>
<div class="upload-options" id="upload-options-119" style="display: none;">
  <button class="add-image" onclick="startCamera(119)">Camera</button>
 <label for="file-input-119" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-119" accept="image/*" multiple onchange="displayImages(this, 119)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-119"></div>
      <!-- Camera Container -->
<div id="camera-container-119" style="display: none;">
  <video id="camera-119" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(119)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(119)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(119)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-119" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>

          <tr id="row-120" data-key="rs-232-conv-1">
            <td class="sno">1.24</td>
           <td class = "observation_text"> RS 232-OFC converter 1 (STATION)
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
           <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(120)">Add Image</button>
<div class="upload-options" id="upload-options-120" style="display: none;">
  <button class="add-image" onclick="startCamera(120)">Camera</button>
  <label for="file-input-120" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-120" accept="image/*" multiple onchange="displayImages(this, 120)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-120"></div>
      <!-- Camera Container -->
<div id="camera-container-120" style="display: none;">
  <video id="camera-120" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(120)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(120)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(120)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-120" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-121" data-key="rs-232-conv-2">
            <td class="sno">1.25</td>
           <td class = "observation_text">RS 232-OFC converter 2 (STATION)
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
           <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(121)">Add Image</button>
<div class="upload-options" id="upload-options-121" style="display: none;">
  <button class="add-image" onclick="startCamera(121)">Camera</button>
  <label for="file-input-121" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-121" accept="image/*" multiple onchange="displayImages(this, 121)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-121"></div>
      <!-- Camera Container -->
<div id="camera-container-121" style="display: none;">
  <video id="camera-121" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(121)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(121)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(121)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-121" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-122" data-key="rs-485-conv">
            <td class="sno">1.26</td>
           <td class = "observation_text"> RS 485-OFC converter (STATION)
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
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(122)">Add Image</button>
<div class="upload-options" id="upload-options-122" style="display: none;">
  <button class="add-image" onclick="startCamera(122)">Camera</button>
  <label for="file-input-122" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-122" accept="image/*" multiple onchange="displayImages(this, 122)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-122"></div>
      <!-- Camera Container -->
<div id="camera-container-122" style="display: none;">
  <video id="camera-122" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(122)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(122)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(122)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-122" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-12232" data-key="fiu-term-1">
            <td class="sno">1.27</td>
           <td class = "observation_text"> FIU Termination Card 1
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
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(12232)">Add Image</button>
<div class="upload-options" id="upload-options-12232" style="display: none;">
  <button class="add-image" onclick="startCamera(12232)">Camera</button>
  <label for="file-input-12232" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-12232" accept="image/*" multiple onchange="displayImages(this, 12232)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-12232"></div>
      <!-- Camera Container -->
<div id="camera-container-12232" style="display: none;">
  <video id="camera-12232" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(12232)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(12232)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(12232)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-12232" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-123" data-key="fiu-term-2">
            <td class="sno">1.28</td>
           <td class = "observation_text"> FIU Termination Card 2
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(123)">Add Image</button>
<div class="upload-options" id="upload-options-123" style="display: none;">
  <button class="add-image" onclick="startCamera(123)">Camera</button>
  <label for="file-input-123" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-123" accept="image/*" multiple onchange="displayImages(this, 123)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-123"></div>
      <!-- Camera Container -->
<div id="camera-container-123" style="display: none;">
  <video id="camera-123" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(123)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(123)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(123)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-123" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-22435" data-key="fiu-term-3">
            <td class="sno">1.29</td>
           <td class = "observation_text"> FIU Termination Card 3
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
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(22435)">Add Image</button>
<div class="upload-options" id="upload-options-22435" style="display: none;">
  <button class="add-image" onclick="startCamera(22435)">Camera</button>
  <label for="file-input-22435" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22435" accept="image/*" multiple onchange="displayImages(this, 22435)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-22435"></div>
      <!-- Camera Container -->
<div id="camera-container-22435" style="display: none;">
  <video id="camera-22435" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22435)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22435)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22435)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22435" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-125" data-key="fiu-term-4">
            <td class="sno">1.30</td>
           <td class = "observation_text"> FIU Termination Card 4
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
 <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(125)">Add Image</button>
<div class="upload-options" id="upload-options-125" style="display: none;">
  <button class="add-image" onclick="startCamera(125)">Camera</button>
  <label for="file-input-125" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-125" accept="image/*" multiple onchange="displayImages(this, 125)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-125"></div>
      <!-- Camera Container -->
<div id="camera-container-125" style="display: none;">
  <video id="camera-125" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(125)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(125)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(125)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-125" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-1335" data-key="fiu-term-5">
            <td class="sno">1.31</td>
           <td class = "observation_text"> FIU Termination Card 5
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(1335)">Add Image</button>
<div class="upload-options" id="upload-options-1335" style="display: none;">
  <button class="add-image" onclick="startCamera(1335)">Camera</button>
  <label for="file-input-1335" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1335" accept="image/*" multiple onchange="displayImages(this, 1335)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1335"></div>
      <!-- Camera Container -->
<div id="camera-container-1335" style="display: none;">
  <video id="camera-1335" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1335)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1335)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1335)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1335" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-1385" data-key="fiu-term-6">
            <td class="sno">1.32</td>
           <td class = "observation_text"> FIU Termination Card 6
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(1385)">Add Image</button>
<div class="upload-options" id="upload-options-1385" style="display: none;">
  <button class="add-image" onclick="startCamera(1385)">Camera</button>
  <label for="file-input-1385" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1385" accept="image/*" multiple onchange="displayImages(this, 1385)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1385"></div>
      <!-- Camera Container -->
<div id="camera-container-1385" style="display: none;">
  <video id="camera-1385" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1385)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1385)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1385)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1385" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-1657" data-key="fiu-term-7">
            <td class="sno">1.33</td>
           <td class = "observation_text"> FIU Termination Card 7
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(1657)">Add Image</button>
<div class="upload-options" id="upload-options-1657" style="display: none;">
  <button class="add-image" onclick="startCamera(1657)">Camera</button>
  <label for="file-input-1657" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1657" accept="image/*" multiple onchange="displayImages(this, 1657)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1657"></div>
      <!-- Camera Container -->
<div id="camera-container-1657" style="display: none;">
  <video id="camera-1657" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1657)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1657)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1657)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1657" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-1979" data-key="fiu-term-8">
            <td class="sno">1.34</td>
           <td class = "observation_text"> FIU Termination Card 8
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(1979)">Add Image</button>
<div class="upload-options" id="upload-options-1979" style="display: none;">
  <button class="add-image" onclick="startCamera(1979)">Camera</button>
  <label for="file-input-1979" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1979" accept="image/*" multiple onchange="displayImages(this, 1979)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1979"></div>
      <!-- Camera Container -->
<div id="camera-container-1979" style="display: none;">
  <video id="camera-1979" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1979)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1979)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1979)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1979" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
          <tr id="row-19798" data-key="dps-1">
            <td class="sno">1.35</td>
           <td class = "observation_text"> DPS Card 1
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(19798)">Add Image</button>
<div class="upload-options" id="upload-options-19798" style="display: none;">
  <button class="add-image" onclick="startCamera(19798)">Camera</button>
  <label for="file-input-19798" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-19798" accept="image/*" multiple onchange="displayImages(this, 19798)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-19798"></div>
      <!-- Camera Container -->
<div id="camera-container-19798" style="display: none;">
  <video id="camera-19798" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(19798)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(19798)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(19798)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-19798" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-10798" data-key="dps-2">
            <td class="sno">1.36</td>
           <td class = "observation_text"> DPS Card 2
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(10798)">Add Image</button>
<div class="upload-options" id="upload-options-10798" style="display: none;">
  <button class="add-image" onclick="startCamera(10798)">Camera</button>
  <label for="file-input-10798" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-10798" accept="image/*" multiple onchange="displayImages(this, 10798)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-10798"></div>
      <!-- Camera Container -->
<div id="camera-container-10798" style="display: none;">
  <video id="camera-10798" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(10798)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(10798)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(10798)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-10798" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
            <tr id="row-24324" data-key="gps-gsm-1">
            <td class="sno">1.37</td>
           <td class = "observation_text"> GPS & GSM Antenna-1
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(24324)">Add Image</button>
<div class="upload-options" id="upload-options-24324" style="display: none;">
  <button class="add-image" onclick="startCamera(24324)">Camera</button>
  <label for="file-input-24324" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-24324" accept="image/*" multiple onchange="displayImages(this, 24324)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-24324"></div>
      <!-- Camera Container -->
<div id="camera-container-24324" style="display: none;">
  <video id="camera-24324" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(24324)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(24324)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(24324)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-24324" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
         
           <tr id="row-57657" data-key="gps-gsm-2">
            <td class="sno">1.38</td>
           <td class = "observation_text"> GPS & GSM Antenna-2
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(57657)">Add Image</button>
<div class="upload-options" id="upload-options-57657" style="display: none;">
  <button class="add-image" onclick="startCamera(57657)">Camera</button>
  <label for="file-input-57657" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-57657" accept="image/*" multiple onchange="displayImages(this, 57657)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-57657"></div>
      <!-- Camera Container -->
<div id="camera-container-57657" style="display: none;">
  <video id="camera-57657" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(57657)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(57657)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(57657)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-57657" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-255467" data-key="smocip">
            <td class="sno">1.39</td>
           <td class = "observation_text"> SMOCIP Unit
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(255467)">Add Image</button>
<div class="upload-options" id="upload-options-255467" style="display: none;">
  <button class="add-image" onclick="startCamera(255467)">Camera</button>
  <label for="file-input-255467" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-255467" accept="image/*" multiple onchange="displayImages(this, 255467)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-255467"></div>
      <!-- Camera Container -->
<div id="camera-container-255467" style="display: none;">
  <video id="camera-255467" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(255467)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(255467)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(255467)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-255467" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-76576" data-key="smocip-term">
            <td class="sno">1.40</td>
           <td class = "observation_text"> SMOCIP Termination Panel
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(76576)">Add Image</button>
<div class="upload-options" id="upload-options-76576" style="display: none;">
  <button class="add-image" onclick="startCamera(76576)">Camera</button>
  <label for="file-input-76576" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-765766255467" accept="image/*" multiple onchange="displayImages(this, 76576)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-76576"></div>
      <!-- Camera Container -->
<div id="camera-container-76576" style="display: none;">
  <video id="camera-76576" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(76576)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(76576)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(76576)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-76576" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-35454" data-key="station-term-panel">
            <td class="sno">1.41</td>
           <td class = "observation_text"> Station Termination Panel
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(35454)">Add Image</button>
<div class="upload-options" id="upload-options-35454" style="display: none;">
  <button class="add-image" onclick="startCamera(35454)">Camera</button>
  <label for="file-input-35454" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35454" accept="image/*" multiple onchange="displayImages(this, 35454)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-35454"></div>
      <!-- Camera Container -->
<div id="camera-container-35454" style="display: none;">
  <video id="camera-35454" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35454)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35454)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35454)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35454" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
           <tr id="row-86664765" data-key="station-pdu-box">
            <td class="sno">1.42</td>
           <td class = "observation_text"> Stationary PDU Box
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
      this.value = this.value.slice(-15);86664765
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664765)">Add Image</button>
<div class="upload-options" id="upload-options-86664765" style="display: none;">
  <button class="add-image" onclick="startCamera(86664765)">Camera</button>
  <label for="file-input-86664765" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664765" accept="image/*" multiple onchange="displayImages(this, 86664765)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664765"></div>
      <!-- Camera Container -->
<div id="camera-container-86664765" style="display: none;">
  <video id="camera-86664765" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664765)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664765)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664765)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664765" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664766" data-key="ips-pdu">
            <td class="sno">1.43</td>
           <td class = "observation_text"> IPS PDU Box
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
      this.value = this.value.slice(-15);86664766
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664766)">Add Image</button>
<div class="upload-options" id="upload-options-86664766" style="display: none;">
  <button class="add-image" onclick="startCamera(86664766)">Camera</button>
  <label for="file-input-86664766" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664766" accept="image/*" multiple onchange="displayImages(this, 86664766)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664766"></div>
      <!-- Camera Container -->
<div id="camera-container-86664766" style="display: none;">
  <video id="camera-86664766" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664766)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664766)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664766)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664766" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664767" data-key="dc-dc-conv">
            <td class="sno">1.44</td>
           <td class = "observation_text"> DC-DC Converter (Relay racks)
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
      this.value = this.value.slice(-15);86664767
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664767)">Add Image</button>
<div class="upload-options" id="upload-options-86664767" style="display: none;">
  <button class="add-image" onclick="startCamera(86664767)">Camera</button>
  <label for="file-input-86664767" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664767" accept="image/*" multiple onchange="displayImages(this, 86664767)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664767"></div>
      <!-- Camera Container -->
<div id="camera-container-86664767" style="display: none;">
  <video id="camera-86664767" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664767)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664767)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664767)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664767" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664768" data-key="rtu-1">
            <td class="sno">1.45</td>
           <td class = "observation_text"> RTU-1
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
      this.value = this.value.slice(-15);86664768
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664768)">Add Image</button>
<div class="upload-options" id="upload-options-86664768" style="display: none;">
  <button class="add-image" onclick="startCamera(86664768)">Camera</button>
  <label for="file-input-86664768" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664768" accept="image/*" multiple onchange="displayImages(this, 86664768)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664768"></div>
      <!-- Camera Container -->
<div id="camera-container-86664768" style="display: none;">
  <video id="camera-86664768" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664768)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664768)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664768)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664768" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664769" data-key="rtu-2">
            <td class="sno">1.46</td>
           <td class = "observation_text"> RTU-2
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
      this.value = this.value.slice(-15);86664769
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664769)">Add Image</button>
<div class="upload-options" id="upload-options-86664769" style="display: none;">
  <button class="add-image" onclick="startCamera(86664769)">Camera</button>
  <label for="file-input-86664769" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664769" accept="image/*" multiple onchange="displayImages(this, 86664769)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664769"></div>
      <!-- Camera Container -->
<div id="camera-container-86664769" style="display: none;">
  <video id="camera-86664769" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664769)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664769)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664769)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664769" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664770" data-key="station-radio-1">
            <td class="sno">1.47</td>
           <td class = "observation_text"> Station Radio Power Supply card-1
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
      this.value = this.value.slice(-15);86664770
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664770)">Add Image</button>
<div class="upload-options" id="upload-options-86664770" style="display: none;">
  <button class="add-image" onclick="startCamera(86664770)">Camera</button>
  <label for="file-input-86664770" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664770" accept="image/*" multiple onchange="displayImages(this, 86664770)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664770"></div>
      <!-- Camera Container -->
<div id="camera-container-86664770" style="display: none;">
  <video id="camera-86664770" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664770)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664770)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664770)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664770" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664771" data-key="station-radio-2">
            <td class="sno">1.48</td>
           <td class = "observation_text"> Station Radio Power Supply card-2
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
      this.value = this.value.slice(-15);86664771
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664771)">Add Image</button>
<div class="upload-options" id="upload-options-86664771" style="display: none;">
  <button class="add-image" onclick="startCamera(86664771)">Camera</button>
  <label for="file-input-86664771" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664771" accept="image/*" multiple onchange="displayImages(this, 86664771)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664771"></div>
      <!-- Camera Container -->
<div id="camera-container-86664771" style="display: none;">
  <video id="camera-86664771" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664771)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664771)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664771)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664771" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664772" data-key="next-gen-radio-1">
            <td class="sno">1.49</td>
           <td class = "observation_text"> Next Gen/. Cal Amp Radio Modem-1
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
      this.value = this.value.slice(-15);86664772
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664772)">Add Image</button>
<div class="upload-options" id="upload-options-86664772" style="display: none;">
  <button class="add-image" onclick="startCamera(86664772)">Camera</button>
  <label for="file-input-86664772" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664772" accept="image/*" multiple onchange="displayImages(this, 86664772)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664772"></div>
      <!-- Camera Container -->
<div id="camera-container-86664772" style="display: none;">
  <video id="camera-86664772" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664772)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664772)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664772)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664772" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664773" data-key="next-gen-radio-2">
            <td class="sno">1.50</td>
           <td class = "observation_text"> Next Gen/. Cal Amp Radio Modem-2
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
      this.value = this.value.slice(-15);86664773
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664773)">Add Image</button>
<div class="upload-options" id="upload-options-86664773" style="display: none;">
  <button class="add-image" onclick="startCamera(86664773)">Camera</button>
  <label for="file-input-86664773" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664773" accept="image/*" multiple onchange="displayImages(this, 86664773)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664773"></div>
      <!-- Camera Container -->
<div id="camera-container-86664773" style="display: none;">
  <video id="camera-86664773" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664773)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664773)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664773)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664773" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664774" data-key="rs-232-conv-rtu-1">
            <td class="sno">1.51</td>
           <td class = "observation_text"> RS 232-OFC converter 1 (RTU-1)
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
      this.value = this.value.slice(-15);86664774
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664774)">Add Image</button>
<div class="upload-options" id="upload-options-86664774" style="display: none;">
  <button class="add-image" onclick="startCamera(86664774)">Camera</button>
  <label for="file-input-86664774" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664774" accept="image/*" multiple onchange="displayImages(this, 86664774)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664774"></div>
      <!-- Camera Container -->
<div id="camera-container-86664774" style="display: none;">
  <video id="camera-86664774" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664774)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664774)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664774)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664774" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664775" data-key="rs-232-conv-rtu-2">
            <td class="sno">1.52</td>
           <td class = "observation_text"> RS 232-OFC converter 2 (RTU-2)
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
      this.value = this.value.slice(-15);86664775
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664775)">Add Image</button>
<div class="upload-options" id="upload-options-86664775" style="display: none;">
  <button class="add-image" onclick="startCamera(86664775)">Camera</button>
  <label for="file-input-86664775" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664775" accept="image/*" multiple onchange="displayImages(this, 86664775)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664775"></div>
      <!-- Camera Container -->
<div id="camera-container-86664775" style="display: none;">
  <video id="camera-86664775" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664775)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664775)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664775)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664775" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664777" data-key="riu">
            <td class="sno">1.53</td>
           <td class = "observation_text"> RIU
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
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664777)">Add Image</button>
<div class="upload-options" id="upload-options-86664777" style="display: none;">
  <button class="add-image" onclick="startCamera(86664777)">Camera</button>
  <label for="file-input-86664777" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664777" accept="image/*" multiple onchange="displayImages(this, 86664777)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664777"></div>
      <!-- Camera Container -->
<div id="camera-container-86664777" style="display: none;">
  <video id="camera-86664777" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664777)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664777)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664777)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664777" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664778" data-key="riu-power-1">
            <td class="sno">1.54</td>
           <td class = "observation_text"> RIU Power Supply Card-1
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
      this.value = this.value.slice(-15);86664778
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664778)">Add Image</button>
<div class="upload-options" id="upload-options-86664778" style="display: none;">
  <button class="add-image" onclick="startCamera(86664778)">Camera</button>
  <label for="file-input-86664778" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664778" accept="image/*" multiple onchange="displayImages(this, 86664778)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664778"></div>
      <!-- Camera Container -->
<div id="camera-container-86664778" style="display: none;">
  <video id="camera-86664778" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664778)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664778)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664778)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664778" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664779" data-key="riu-power-2">
            <td class="sno">1.55</td>
           <td class = "observation_text"> RIU Power Supply Card-2
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
      this.value = this.value.slice(-15);86664779
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664779)">Add Image</button>
<div class="upload-options" id="upload-options-86664779" style="display: none;">
  <button class="add-image" onclick="startCamera(86664779)">Camera</button>
  <label for="file-input-86664779" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664779" accept="image/*" multiple onchange="displayImages(this, 86664779)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664779"></div>
      <!-- Camera Container -->
<div id="camera-container-86664779" style="display: none;">
  <video id="camera-86664779" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664779)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664779)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664779)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664779" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664780" data-key="riu-comm-remote-1">
            <td class="sno">1.56</td>
           <td class = "observation_text"> RIU communication card 1-Remote
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
      this.value = this.value.slice(-15);86664780
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664780)">Add Image</button>
<div class="upload-options" id="upload-options-86664780" style="display: none;">
  <button class="add-image" onclick="startCamera(86664780)">Camera</button>
  <label for="file-input-86664780" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664780" accept="image/*" multiple onchange="displayImages(this, 86664780)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664780"></div>
      <!-- Camera Container -->
<div id="camera-container-86664780" style="display: none;">
  <video id="camera-86664780" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664780)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664780)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664780)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664780" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664781" data-key="riu-comm-remote-2">
            <td class="sno">1.57</td>
           <td class = "observation_text"> RIU communication card 2-Remote
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
      this.value = this.value.slice(-15);86664781
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664781)">Add Image</button>
<div class="upload-options" id="upload-options-86664781" style="display: none;">
  <button class="add-image" onclick="startCamera(86664781)">Camera</button>
  <label for="file-input-86664781" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664781" accept="image/*" multiple onchange="displayImages(this, 86664781)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664781"></div>
      <!-- Camera Container -->
<div id="camera-container-86664781" style="display: none;">
  <video id="camera-86664781" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664781)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664781)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664781)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664781" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664782" data-key="fiu-scan-1">
            <td class="sno">1.58</td>
           <td class = "observation_text"> FIU Scanner Card 1
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
      this.value = this.value.slice(-15);86664782
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664782)">Add Image</button>
<div class="upload-options" id="upload-options-86664782" style="display: none;">
  <button class="add-image" onclick="startCamera(86664782)">Camera</button>
  <label for="file-input-86664782" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664782" accept="image/*" multiple onchange="displayImages(this, 86664782)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664782"></div>
      <!-- Camera Container -->
<div id="camera-container-86664782" style="display: none;">
  <video id="camera-86664782" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664782)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664782)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664782)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664782" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664783" data-key="fiu-scan-2">
            <td class="sno">1.59</td>
           <td class = "observation_text"> FIU Scanner Card 2
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
      this.value = this.value.slice(-15);86664783
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664783)">Add Image</button>
<div class="upload-options" id="upload-options-86664783" style="display: none;">
  <button class="add-image" onclick="startCamera(86664783)">Camera</button>
  <label for="file-input-86664783" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664783" accept="image/*" multiple onchange="displayImages(this, 86664783)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664783"></div>
      <!-- Camera Container -->
<div id="camera-container-86664783" style="display: none;">
  <video id="camera-86664783" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664783)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664783)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664783)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664783" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664784" data-key="fiu-scan-3">
            <td class="sno">1.60</td>
           <td class = "observation_text"> FIU Scanner Card 3
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
      this.value = this.value.slice(-15);86664784
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664784)">Add Image</button>
<div class="upload-options" id="upload-options-86664784" style="display: none;">
  <button class="add-image" onclick="startCamera(86664784)">Camera</button>
  <label for="file-input-86664784" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664784" accept="image/*" multiple onchange="displayImages(this, 86664784)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664784"></div>
      <!-- Camera Container -->
<div id="camera-container-86664784" style="display: none;">
  <video id="camera-86664784" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664784)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664784)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664784)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664784" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664785" data-key="fiu-scan-4">
            <td class="sno">1.61</td>
           <td class = "observation_text"> FIU Scanner Card 4
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
      this.value = this.value.slice(-15);86664785
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664785)">Add Image</button>
<div class="upload-options" id="upload-options-86664785" style="display: none;">
  <button class="add-image" onclick="startCamera(86664785)">Camera</button>
  <label for="file-input-86664785" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664785" accept="image/*" multiple onchange="displayImages(this, 86664785)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664785"></div>
      <!-- Camera Container -->
<div id="camera-container-86664785" style="display: none;">
  <video id="camera-86664785" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664785)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664785)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664785)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664785" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          <tr id="row-86664786" data-key="riu-battery-1">
            <td class="sno">1.62</td>
           <td class = "observation_text"> RIU Battery Charge Cum Filter-1
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
      this.value = this.value.slice(-15);86664786
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664786)">Add Image</button>
<div class="upload-options" id="upload-options-86664786" style="display: none;">
  <button class="add-image" onclick="startCamera(86664786)">Camera</button>
  <label for="file-input-86664786" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664786" accept="image/*" multiple onchange="displayImages(this, 86664786)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664786"></div>
      <!-- Camera Container -->
<div id="camera-container-86664786" style="display: none;">
  <video id="camera-86664786" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664786)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664786)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664786)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664786" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

         <tr id="row-86664787" data-key="riu-battery-2">
            <td class="sno">1.63</td>
           <td class = "observation_text"> RIU Battery Charge Cum Filter-2
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
      this.value = this.value.slice(-15);86664787
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(86664787)">Add Image</button>
<div class="upload-options" id="upload-options-86664787" style="display: none;">
  <button class="add-image" onclick="startCamera(86664787)">Camera</button>
  <label for="file-input-86664787" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-86664787" accept="image/*" multiple onchange="displayImages(this, 86664787)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-86664787"></div>
      <!-- Camera Container -->
<div id="camera-container-86664787" style="display: none;">
  <video id="camera-86664787" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(86664787)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(86664787)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(86664787)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-86664787" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
        <tr id="row-1783634" data-key="riu-emi-1">
            <td class="sno">1.64</td>
           <td class = "observation_text"> RTU EMI FILTER_1
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
      this.value = this.value.slice(-15);1783634
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(1783634)">Add Image</button>
<div class="upload-options" id="upload-options-1783634" style="display: none;">
  <button class="add-image" onclick="startCamera(1783634)">Camera</button>
  <label for="file-input-1783634" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1783634" accept="image/*" multiple onchange="displayImages(this, 1783634)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1783634"></div>
      <!-- Camera Container -->
<div id="camera-container-1783634" style="display: none;">
  <video id="camera-1783634" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1783634)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1783634)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1783634)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1783634" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
        <tr id="row-17832634" data-key="riu-emi-2">
            <td class="sno">1.65</td>
           <td class = "observation_text"> RTU EMI FILTER_2
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
      this.value = this.value.slice(-15);17832634
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(17832634)">Add Image</button>
<div class="upload-options" id="upload-options-17832634" style="display: none;">
  <button class="add-image" onclick="startCamera(17832634)">Camera</button>
  <label for="file-input-17832634" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-17832634" accept="image/*" multiple onchange="displayImages(this, 17832634)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-17832634"></div>
      <!-- Camera Container -->
<div id="camera-container-17832634" style="display: none;">
  <video id="camera-17832634" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(17832634)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(17832634)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(17832634)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-17832634" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
    <tr id="row-5437352" data-key="tcas-emi-1">
            <td class="sno">1.66</td>
           <td class = "observation_text"> TCAS EMI FILTER _1
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
      this.value = this.value.slice(-15);5437352
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(5437352)">Add Image</button>
<div class="upload-options" id="upload-options-5437352" style="display: none;">
  <button class="add-image" onclick="startCamera(5437352)">Camera</button>
  <label for="file-input-5437352" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-5437352" accept="image/*" multiple onchange="displayImages(this, 5437352)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-5437352"></div>
      <!-- Camera Container -->
<div id="camera-container-5437352" style="display: none;">
  <video id="camera-5437352" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(5437352)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(5437352)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(5437352)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-5437352" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            </tr>
      <tr id="row-342543" data-key="tcas-emi-2">
            <td class="sno">1.67</td>
           <td class = "observation_text"> TCAS EMI FILTER _2
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
      this.value = this.value.slice(-15);342543
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(342543)">Add Image</button>
<div class="upload-options" id="upload-options-342543" style="display: none;">
  <button class="add-image" onclick="startCamera(342543)">Camera</button>
  <label for="file-input-342543" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-342543" accept="image/*" multiple onchange="displayImages(this, 342543)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-342543"></div>
      <!-- Camera Container -->
<div id="camera-container-342543" style="display: none;">
  <video id="camera-342543" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(342543)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(342543)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(342543)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-342543" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
  </tr>
       <tr id="row-765745" data-key="tcas-cable-extender">
            <td class="sno">1.68</td>
           <td class = "observation_text"> TCAS Cable Extender
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
      this.value = this.value.slice(-15);765745
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Verified">Verified</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not Installed">Not Installed</option>
      <option value="Not Applicable">Not Applicable</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(765745)">Add Image</button>
<div class="upload-options" id="upload-options-765745" style="display: none;">
  <button class="add-image" onclick="startCamera(765745)">Camera</button>
  <label for="file-input-765745" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-765745" accept="image/*" multiple onchange="displayImages(this, 765745)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-765745"></div>
      <!-- Camera Container -->
<div id="camera-container-765745" style="display: none;">
  <video id="camera-765745" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(765745)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(765745)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(765745)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-765745" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>
          
        </tbody>
      </table>
      </div>
      <div class="note" 
     style="display: inline-block; 
            background-color: #fff8dc; 
            border-left: 5px solid #a88314; 
            font-family: Arial, sans-serif; 
            color: #856404; 
            padding: 6px 12px; 
            margin-left: 40px; 
            border-radius: 4px; 
            white-space: nowrap;">
  ⚠️ <strong>Note:</strong> If any card or unit is replaced, kindly enter the new number and mention FSR details along with the old card number in the <strong>Remarks</strong> section.
</div>

      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('2_0', null, true)">
        Update
      </button>
    <button type="button" id= "save-btn" style = "display: inline-block;" onclick="saveObservation('2_0')">Save</button>
     <button id="get-details-btn" onclick="getDetails()">Get Details</button>
     <button type="button" id="add-row-btn" style="background-color: #28a745; color: white;" onclick="addRowWithPassword('2_0')">Add Row</button>
</div>`;
    loadCustomRows("2_0");
  } else if (section === "3.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <div style="position: relative; margin-bottom: 20px;">
        <h3 class="section-heading"> Building</h3>
        <select id="section-na-dropdown-3_0" style="position: absolute; top: 0; right: 0; width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('3_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
      <h4 style="color: red; font-style: italic; margin-bottom: 10px;">Following table must be filled up, if a new building is constructed, by HBL, for Kavach installation</h4>

       <div class="table-container">
      <table class="observations" id="observations-section-3_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-3_0">

    <tr id="row-21">
      <td>2.1</td>
      <td class="observation_text">KAVACH Building Works</td>
      <td class="requirement_text">Building Commissioning Report from the contractor shall be available with the customer's sign-off, and there shall be no open points in the report.</td>
      <td class = "select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(21)">Add Image</button>
<div class="upload-options" id="upload-options-21" style="display: none;">
  <button class="add-image" onclick="startCamera(21)">Camera</button>
  <label for="file-input-21" class="upload-label">Upload from Device</label>
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
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('3_0')">
        Update
      </button>
       <button type="button" id= "save-btn" style = "display: inline-block;"  onclick="if(validateMandatoryImages('3_0')) { saveObservation('3_0'); }">Save</button>
        <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

  } else if (section === "4.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <div style="position: relative; margin-bottom: 20px;">
        <h3 class="section-heading" > Tower </h3>
        <select id="section-na-dropdown-4_0" style="position: absolute; top: 0; right: 0; width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('4_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
      <h4 style="color: red; font-style: italic; margin-bottom: 10px;">Following table must be filled up, if a new tower is constructed, by HBL, for Kavach project.</h4>

       <div  class="table-container">
      <table class="observations" id="observations-section-4_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-4_0">
          <tr id="row-31">
      <td>3.1</td>
      <td class="observation_text">Tower Installation</td>
      <td class="requirement_text">Tower Commissioning Report from the contractor shall be available with the customer's sign-off, and there shall be no open points in the report.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(31)">Add Image</button>
<div class="upload-options" id="upload-options-31" style="display: none;">
  <button class="add-image" onclick="startCamera(31)">Camera</button>
  <label for="file-input-31" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-31" accept="image/*" multiple onchange="displayImages(this, 31)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-31"></div>
      <!-- Camera Container -->
<div id="camera-container-31" style="display: none;">
  <video id="camera-31" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(31)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(31)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(31)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-31" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('4_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('4_0')) { saveObservation('4_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if (section === "5.0") {
    // RF Antennas section with 3 subsections
    // Clear old section content but preserve station info
    clearSectionContent();
    mainContent.innerHTML += `
      <div style="position: relative; margin-bottom: 20px;">
        <h3 class="section-heading" id="section-heading-5_0"> Power Supply </h3>
        <select id="section-na-dropdown-5_0" style="position: absolute; top: 0; right: 0; width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('5_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
       <div  class="table-container">
      <table class="observations" id="observations-section-5_0">
        <thead>
         <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-5_0">
          <tr id="row-41">
      <td>4.1.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 7 Nm as per diagram 5 16 76 0053</td>
       <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
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
    <tr id="row-411">
      <td>4.1.2</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 7 Nm as per diagram 5 16 76 0054</td>
       <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                 <option value="Not Verified">Not Verified</option>
                  <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(411)">Add Image</button>
<div class="upload-options" id="upload-options-411" style="display: none;">
  <button class="add-image" onclick="startCamera(411)">Camera</button>
  <label for="file-input-411" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-411" accept="image/*" multiple onchange="displayImages(this, 411)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-411"></div>
      <!-- Camera Container -->
<div id="camera-container-411" style="display: none;">
  <video id="camera-411" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(411)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(411)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(411)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-411" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-412">
      <td>4.1.3</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(412)">Add Image</button>
<div class="upload-options" id="upload-options-412" style="display: none;">
  <button class="add-image" onclick="startCamera(412)">Camera</button>
  <label for="file-input-412" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-412" accept="image/*" multiple onchange="displayImages(this, 412)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-412"></div>
      <!-- Camera Container -->
<div id="camera-container-412" style="display: none;">
  <video id="camera-412" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(412)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(412)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(412)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-412" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-413">
      <td>4.1.4</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                 <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(413)">Add Image</button>
<div class="upload-options" id="upload-options-413" style="display: none;">
  <button class="add-image" onclick="startCamera(413)">Camera</button>
  <label for="file-input-413" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-413" accept="image/*" multiple onchange="displayImages(this, 413)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-413"></div>
      <!-- Camera Container -->
<div id="camera-container-413" style="display: none;">
  <video id="camera-413" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(413)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(413)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(413)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-413" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-414">
      <td>4.1.5</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                 <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(414)">Add Image</button>
<div class="upload-options" id="upload-options-414" style="display: none;">
  <button class="add-image" onclick="startCamera(414)">Camera</button>
  <label for="file-input-414" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-414" accept="image/*" multiple onchange="displayImages(this, 414)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-414"></div>
      <!-- Camera Container -->
<div id="camera-container-414" style="display: none;">
  <video id="camera-414" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(414)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(414)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(414)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-414" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-415">
      <td>4.1.6</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(415)">Add Image</button>
<div class="upload-options" id="upload-options-415" style="display: none;">
  <button class="add-image" onclick="startCamera(415)">Camera</button>
  <label for="file-input-415" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-415" accept="image/*" multiple onchange="displayImages(this, 415)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-415"></div>
      <!-- Camera Container -->
<div id="camera-container-415" style="display: none;">
  <video id="camera-415" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(415)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(415)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(415)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-415" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-416">
      <td>4.1.7</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                 <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(416)">Add Image</button>
<div class="upload-options" id="upload-options-416" style="display: none;">
  <button class="add-image" onclick="startCamera(416)">Camera</button>
  <label for="file-input-416" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-416" accept="image/*" multiple onchange="displayImages(this, 416)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-416"></div>
      <!-- Camera Container -->
<div id="camera-container-416" style="display: none;">
  <video id="camera-416" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(416)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(416)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(416)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-416" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-417">
      <td>4.1.8</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(417)">Add Image</button>
<div class="upload-options" id="upload-options-417" style="display: none;">
  <button class="add-image" onclick="startCamera(417)">Camera</button>
  <label for="file-input-417" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-417" accept="image/*" multiple onchange="displayImages(this, 417)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-417"></div>
      <!-- Camera Container -->
<div id="camera-container-417" style="display: none;">
  <video id="camera-417" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(417)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(417)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(417)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-417" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-42">
      <td>4.2.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">DC-DC Converter unit shall be installed as per the approved floor plan drawing, mounted on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0055</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
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
    <tr id="row-421">
      <td>4.2.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering the unit shall pass through cable glands and ensure no cable entry opening.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(421)">Add Image</button>
<div class="upload-options" id="upload-options-421" style="display: none;">
  <button class="add-image" onclick="startCamera(421)">Camera</button>
  <label for="file-input-421" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-421" accept="image/*" multiple onchange="displayImages(this, 421)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-421"></div>
      <!-- Camera Container -->
<div id="camera-container-421" style="display: none;">
  <video id="camera-421" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(421)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(421)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(421)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-421" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-422">
      <td>4.2.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(422)">Add Image</button>
<div class="upload-options" id="upload-options-422" style="display: none;">
  <button class="add-image" onclick="startCamera(422)">Camera</button>
  <label for="file-input-422" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-422" accept="image/*" multiple onchange="displayImages(this, 422)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-422"></div>
      <!-- Camera Container -->
<div id="camera-container-422" style="display: none;">
  <video id="camera-422" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(422)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(422)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(422)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-422" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-423">
      <td>4.2.4</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(423)">Add Image</button>
<div class="upload-options" id="upload-options-423" style="display: none;">
  <button class="add-image" onclick="startCamera(423)">Camera</button>
  <label for="file-input-423" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-423" accept="image/*" multiple onchange="displayImages(this, 423)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-423"></div>
      <!-- Camera Container -->
<div id="camera-container-423" style="display: none;">
  <video id="camera-423" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(423)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(423)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(423)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-423" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-424">
      <td>4.2.5</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">DC-DC converter output voltage shall be minimum 24 V DC, +/- 5% 
(22.8 VDC to 25.2 VDC)
</td>
      <td class="select">
        <input type="number" min="0" step="0.1" placeholder="Enter voltage"
         oninput="checkVoltage(this, 424)" style="margin-bottom:5px; width:100%;">
       <select id="status-424" class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="opacity:1; color:#000; background-color:#fff;">
                <option value="Select">Select</option>
                <option value="Ok" style="display:none;">Ok</option>
                <option value="Not Ok" style="display:none;">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                 <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea id="remarks-424" placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(424)">Add Image</button>
<div class="upload-options" id="upload-options-424" style="display: none;">
  <button class="add-image" onclick="startCamera(424)">Camera</button>
  <label for="file-input-424" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-424" accept="image/*" multiple onchange="displayImages(this, 424)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-424"></div>
      <!-- Camera Container -->
<div id="camera-container-424" style="display: none;">
  <video id="camera-424" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(424)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(424)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(424)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-424" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('5_0', activeSubsection)">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('5_0')) { saveObservation('5_0', activeSubsection); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

    // Immediately filter rows if subsection is specified
    if (subsection) {
      console.log(`Section 5.0 rendered, applying filter for subsection: ${subsection}`);
      setTimeout(() => {
        filterTableRows('observations-section-5_0', subsection);
        const heading = document.getElementById('section-heading-5_0');
        if (heading) {
          if (subsection.startsWith("4.1")) heading.textContent = "4.1 PDU (Power Distribution Unit)";
          else if (subsection.startsWith("4.2")) heading.textContent = "4.2 DC-DC Converter";
          else if (subsection.startsWith("4.3")) heading.textContent = "4.3 (not configured yet)";
        }
      }, 100);
    }
  }
  else if (section === "6.0") {
    // Installation of Kavach equipment - 4 subsections
    // Clear old section content but preserve station info
    clearSectionContent();
    mainContent.innerHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative;">
        <div id="oem-container-5_5" style="display: none; align-items: center; gap: 10px; white-space: nowrap;">
          <label for="oem-select-5_5" style="font-weight: bold; font-size: 15px; color: #111; white-space: nowrap; margin: 0;">OEM Name:</label>
          <select id="oem-select-5_5" class="oem-dropdown" style="padding: 6px 12px; border: 1.5px solid #007bff; border-radius: 5px; font-size: 14px; background-color: #f8f9fa; font-weight: bold; color: #111; cursor: pointer;" onchange="saveOemSelection(this.value); markDataAsUnsaved();">
            <option value="">Select OEM</option>
            <option value="Medha">Medha</option>
            <option value="Siemens">Siemens</option>
            <option value="Hitachi">Hitachi</option>
            <option value="Kyosan">Kyosan</option>
          </select>
        </div>
        <h3 class="section-heading" id="section-heading-6_0" style="margin: 0; flex-grow: 1; text-align: center; font-size: 18px; font-weight: bold;"> Kavach Equipment </h3>
        <select id="section-na-dropdown-6_0" style="width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('6_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
       <div  class="table-container">
      <table class="observations" id="observations-section-6_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-6_0">
    <tr id="row-51">
      <td>5.1.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Kavach unit shall be installed as per the approved floor plan drawing, mounted on the floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0056.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                 <option value="Not Verified">Not Verified</option>
                 <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(51)">Add Image</button>
<div class="upload-options" id="upload-options-51" style="display: none;">
  <button class="add-image" onclick="startCamera(51)">Camera</button>
  <label for="file-input-51" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-51" accept="image/*" multiple onchange="displayImages(this, 51)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-51"></div>
      <!-- Camera Container -->
<div id="camera-container-51" style="display: none;">
  <video id="camera-51" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(51)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(51)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(51)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-51" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>  
    <tr id="row-512">
      <td>5.1.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables shall enter through cable glands only.
No unused cable entries left open.
Ensure mill connector shall be locked properly.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                 <option value="Not Verified">Not Verified</option>
                 <option value="Not Installed">Not Installed</option>
                 <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(512)">Add Image</button>
<div class="upload-options" id="upload-options-512" style="display: none;">
  <button class="add-image" onclick="startCamera(512)">Camera</button>
  <label for="file-input-512" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-512" accept="image/*" multiple onchange="displayImages(this, 512)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-512"></div>
      <!-- Camera Container -->
<div id="camera-container-512" style="display: none;">
  <video id="camera-512" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(512)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(512)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(512)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-512" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-517">
      <td>5.1.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(517)">Add Image</button>
<div class="upload-options" id="upload-options-517" style="display: none;">
  <button class="add-image" onclick="startCamera(517)">Camera</button>
  <label for="file-input-517" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-517" accept="image/*" multiple onchange="displayImages(this, 517)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-517"></div>
      <!-- Camera Container -->
<div id="camera-container-517" style="display: none;">
  <video id="camera-517" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(517)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(517)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(517)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-517" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-518">
      <td>5.1.4</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(518)">Add Image</button>
<div class="upload-options" id="upload-options-518" style="display: none;">
  <button class="add-image" onclick="startCamera(518)">Camera</button>
  <label for="file-input-518" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-518" accept="image/*" multiple onchange="displayImages(this, 518)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-518"></div>
      <!-- Camera Container -->
<div id="camera-container-518" style="display: none;">
  <video id="camera-518" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(518)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(518)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(518)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-518" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-5110">
      <td>5.1.5</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">Station Kavach Termination Unit shall be wall-mounted near the Kavach unit using insulators, secured with M8 bolts, and tightened to a torque of 7 Nm as per diagram 5 16 76 0045.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
                
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(5110)">Add Image</button>
<div class="upload-options" id="upload-options-5110" style="display: none;">
  <button class="add-image" onclick="startCamera(5110)">Camera</button>
  <label for="file-input-5110" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-5110" accept="image/*" multiple onchange="displayImages(this, 5110)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-5110"></div>
      <!-- Camera Container -->
<div id="camera-container-5110" style="display: none;">
  <video id="camera-5110" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(5110)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(5110)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(5110)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-5110" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-51110">
      <td>5.1.6</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">OFC cables for SMOCIP and RTU shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(51110)">Add Image</button>
<div class="upload-options" id="upload-options-51110" style="display: none;">
  <button class="add-image" onclick="startCamera(51110)">Camera</button>
  <label for="file-input-51110" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-51110" accept="image/*" multiple onchange="displayImages(this, 51110)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-51110"></div>
      <!-- Camera Container -->
<div id="camera-container-51110" style="display: none;">
  <video id="camera-51110" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(51110)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(51110)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(51110)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-51110" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-52">
      <td>5.2.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">SMOCIP shall be installed in the Station Master’s room at an ergonomic height. The panel shall be securely fixed using M6 screws and tightened to a torque of 5 Nm with torque marking applied, as per diagram 5 16 76 0040</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(52)">Add Image</button>
<div class="upload-options" id="upload-options-52" style="display: none;">
  <button class="add-image" onclick="startCamera(52)">Camera</button>
  <label for="file-input-52" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-52" accept="image/*" multiple onchange="displayImages(this, 52)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-52"></div>
      <!-- Camera Container -->
<div id="camera-container-52" style="display: none;">
  <video id="camera-52" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(52)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(52)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(52)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-52" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-522">
      <td>5.2.2</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">SMOCIP Termination Unit shall be wall-mounted near the SMOCIP unit, using insulators, secured with M6 bolts, and tightened to a torque of 5 Nm as per diagram  5 16 76 0046</td>
        <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(522)">Add Image</button>
<div class="upload-options" id="upload-options-522" style="display: none;">
  <button class="add-image" onclick="startCamera(522)">Camera</button>
  <label for="file-input-522" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-522" accept="image/*" multiple onchange="displayImages(this, 522)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-522"></div>
      <!-- Camera Container -->
<div id="camera-container-522" style="display: none;">
  <video id="camera-522" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(522)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(522)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(522)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-522" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-523">
      <td>5.2.3</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">Power and OFC cables from Kavach termination unit shall be terminated as per diagram 5 16 49 0559.</td>
        <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(523)">Add Image</button>
<div class="upload-options" id="upload-options-523" style="display: none;">
  <button class="add-image" onclick="startCamera(523)">Camera</button>
  <label for="file-input-523" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-523" accept="image/*" multiple onchange="displayImages(this, 523)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-523"></div>
      <!-- Camera Container -->
<div id="camera-container-523" style="display: none;">
  <video id="camera-523" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(523)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(523)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(523)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-523" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-5230">
      <td>5.2.4</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">OFC cables of SMOCIP shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.</td>
        <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(5230)">Add Image</button>
<div class="upload-options" id="upload-options-5230" style="display: none;">
  <button class="add-image" onclick="startCamera(5230)">Camera</button>
  <label for="file-input-5230" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-5230" accept="image/*" multiple onchange="displayImages(this, 5230)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-5230"></div>
      <!-- Camera Container -->
<div id="camera-container-5230" style="display: none;">
  <video id="camera-5230" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(5230)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(5230)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(5230)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-5230" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-524">
      <td>5.2.5</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.</td>
        <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(524)">Add Image</button>
<div class="upload-options" id="upload-options-524" style="display: none;">
  <button class="add-image" onclick="startCamera(524)">Camera</button>
  <label for="file-input-524" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-524" accept="image/*" multiple onchange="displayImages(this, 524)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-524"></div>
      <!-- Camera Container -->
<div id="camera-container-524" style="display: none;">
  <video id="camera-524" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(524)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(524)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(524)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-524" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-525">
      <td>5.2.6</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(525)">Add Image</button>
<div class="upload-options" id="upload-options-525" style="display: none;">
  <button class="add-image" onclick="startCamera(525)">Camera</button>
  <label for="file-input-525" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-525" accept="image/*" multiple onchange="displayImages(this, 525)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-525"></div>
      <!-- Camera Container -->
<div id="camera-container-525" style="display: none;">
  <video id="camera-525" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(525)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(525)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(525)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-525" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-526">
      <td>5.2.7</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">System Health LED shall blink and ensure SYSTEM OK along with the respective station name shall be displayed on the Display.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(526)">Add Image</button>
<div class="upload-options" id="upload-options-526" style="display: none;">
  <button class="add-image" onclick="startCamera(526)">Camera</button>
  <label for="file-input-526" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-526" accept="image/*" multiple onchange="displayImages(this, 526)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-526"></div>
      <!-- Camera Container -->
<div id="camera-container-526" style="display: none;">
  <video id="camera-526" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(526)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(526)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(526)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-526" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
       <tr id="row-5262">
      <td>5.2.8</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">Verify that pressing the SOS and Common buttons on the SM-OCIP increments the mechanical counter by one.</td>
        <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(5262)">Add Image</button>
<div class="upload-options" id="upload-options-5262" style="display: none;">
  <button class="add-image" onclick="startCamera(5262)">Camera</button>
  <label for="file-input-5262" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-5262" accept="image/*" multiple onchange="displayImages(this, 5262)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-5262"></div>
      <!-- Camera Container -->
<div id="camera-container-5262" style="display: none;">
  <video id="camera-5262" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(5262)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(5262)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(5262)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-5262" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-527">
      <td>5.2.9</td>
      <td class="observation_text">Checksum</td>
      <td class="requirement_text">Verify the checksums as per the FAT certificate.</td>
       <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Applicable">Not Applicable</option>
      <option value="Not Verified">Not Verified</option>
      <option value="Not deployed">Not deployed</option>
    </select>
  </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(527)">Add Image</button>
<div class="upload-options" id="upload-options-527" style="display: none;">
  <button class="add-image" onclick="startCamera(527)">Camera</button>
  <label for="file-input-527" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-527" accept="image/*" multiple onchange="displayImages(this, 527)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-527"></div>
      <!-- Camera Container -->
<div id="camera-container-527" style="display: none;">
  <video id="camera-527" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(527)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(527)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(527)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-527" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-53">
      <td>5.3.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Two antennas shall be installed on the Kavach room rooftop with a minimum separation of 3 meters, grouting shall be carried out as per diagram 5 16 67 0039, and torque of 5 Nm shall be applied for M6 fasteners with torque marking provided.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(53)">Add Image</button>
<div class="upload-options" id="upload-options-53" style="display: none;">
  <button class="add-image" onclick="startCamera(53)">Camera</button>
  <label for="file-input-53" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-53" accept="image/*" multiple onchange="displayImages(this, 53)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-53"></div>
      <!-- Camera Container -->
<div id="camera-container-53" style="display: none;">
  <video id="camera-53" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(53)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(53)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(53)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-53" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-531">
      <td>5.3.2</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">No obstruction above antennas like tree branches, sun-shades, and ensure open to sky etc.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(531)">Add Image</button>
<div class="upload-options" id="upload-options-531" style="display: none;">
  <button class="add-image" onclick="startCamera(531)">Camera</button>
  <label for="file-input-531" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-531" accept="image/*" multiple onchange="displayImages(this, 531)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-531"></div>
      <!-- Camera Container -->
<div id="camera-container-531" style="display: none;">
  <video id="camera-531" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(531)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(531)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(531)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-531" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-534">
      <td>5.3.3</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">Antenna cables shall be routed via diverse paths.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(534)">Add Image</button>
<div class="upload-options" id="upload-options-534" style="display: none;">
  <button class="add-image" onclick="startCamera(534)">Camera</button>
  <label for="file-input-534" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-534" accept="image/*" multiple onchange="displayImages(this, 534)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-534"></div>
      <!-- Camera Container -->
<div id="camera-container-534" style="display: none;">
  <video id="camera-534" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(534)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(534)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(534)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-534" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-535">
      <td>5.3.4</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">Separate conduits shall be used and Roof conduits shall be sealed against dust, water, and insects.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(535)">Add Image</button>
<div class="upload-options" id="upload-options-535" style="display: none;">
  <button class="add-image" onclick="startCamera(535)">Camera</button>
  <label for="file-input-535" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-535" accept="image/*" multiple onchange="displayImages(this, 535)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-535"></div>
      <!-- Camera Container -->
<div id="camera-container-535" style="display: none;">
  <video id="camera-535" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(535)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(535)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(535)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-535" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-536">
      <td>5.3.5</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">In each antenna, the GPS and GSM cables shall be connected to their respective connectors as per the labels provided on the antenna.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(536)">Add Image</button>
<div class="upload-options" id="upload-options-536" style="display: none;">
  <button class="add-image" onclick="startCamera(536)">Camera</button>
  <label for="file-input-536" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-536" accept="image/*" multiple onchange="displayImages(this, 536)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-536"></div>
      <!-- Camera Container -->
<div id="camera-container-536" style="display: none;">
  <video id="camera-536" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(536)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(536)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(536)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-536" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-54">
      <td>5.4.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0057.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(54)">Add Image</button>
<div class="upload-options" id="upload-options-54" style="display: none;">
  <button class="add-image" onclick="startCamera(54)">Camera</button>
  <label for="file-input-54" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-54" accept="image/*" multiple onchange="displayImages(this, 54)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-54"></div>
      <!-- Camera Container -->
<div id="camera-container-54" style="display: none;">
  <video id="camera-54" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(54)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(54)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(54)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-54" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-542">
      <td>5.4.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening .</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(542)">Add Image</button>
<div class="upload-options" id="upload-options-542" style="display: none;">
  <button class="add-image" onclick="startCamera(542)">Camera</button>
  <label for="file-input-542" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-542" accept="image/*" multiple onchange="displayImages(this, 542)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-542"></div>
      <!-- Camera Container -->
<div id="camera-container-542" style="display: none;">
  <video id="camera-542" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(542)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(542)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(542)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-542" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-543">
      <td>5.4.3</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">OFC patch cords shall be properly tagged to identify default and standby links.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(543)">Add Image</button>
<div class="upload-options" id="upload-options-543" style="display: none;">
  <button class="add-image" onclick="startCamera(543)">Camera</button>
  <label for="file-input-543" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-543" accept="image/*" multiple onchange="displayImages(this, 543)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-543"></div>
      <!-- Camera Container -->
<div id="camera-container-543" style="display: none;">
  <video id="camera-543" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(543)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(543)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(543)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-543" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-544">
      <td>5.4.4</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(544)">Add Image</button>
<div class="upload-options" id="upload-options-544" style="display: none;">
  <button class="add-image" onclick="startCamera(544)">Camera</button>
  <label for="file-input-544" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-544" accept="image/*" multiple onchange="displayImages(this, 544)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-544"></div>
      <!-- Camera Container -->
<div id="camera-container-544" style="display: none;">
  <video id="camera-544" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(544)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(544)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(544)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-544" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-545">
      <td>5.4.5</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(545)">Add Image</button>
<div class="upload-options" id="upload-options-545" style="display: none;">
  <button class="add-image" onclick="startCamera(545)">Camera</button>
  <label for="file-input-545" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-545" accept="image/*" multiple onchange="displayImages(this, 545)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-545"></div>
      <!-- Camera Container -->
<div id="camera-container-545" style="display: none;">
  <video id="camera-545" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(545)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(545)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(545)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-545" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-546">
      <td>5.4.6</td>
      <td class="observation_text">FDMS Box installation</td>
      <td class="requirement_text">FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(546)">Add Image</button>
<div class="upload-options" id="upload-options-546" style="display: none;">
  <button class="add-image" onclick="startCamera(546)">Camera</button>
  <label for="file-input-546" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-546" accept="image/*" multiple onchange="displayImages(this, 546)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-546"></div>
      <!-- Camera Container -->
<div id="camera-container-546" style="display: none;">
  <video id="camera-546" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(546)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(546)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(546)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-546" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-54212">
      <td>5.5.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">EI protocol converter shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm or unit shall be mounted on wall with M10 nut & Bolts as per respective diagram.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(54212)">Add Image</button>
<div class="upload-options" id="upload-options-54212" style="display: none;">
  <button class="add-image" onclick="startCamera(54212)">Camera</button>
  <label for="file-input-54212" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-54212" accept="image/*" multiple onchange="displayImages(this, 54212)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-54212"></div>
      <!-- Camera Container -->
<div id="camera-container-54212" style="display: none;">
  <video id="camera-54212" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(54212)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(54212)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(54212)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-54212" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-542343">
      <td>5.5.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering into the EI protocol converter unit shall pass through cable glands and ensure no cable entry opening without a cable glands/grommets.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(542343)">Add Image</button>
<div class="upload-options" id="upload-options-542343" style="display: none;">
  <button class="add-image" onclick="startCamera(542343)">Camera</button>
  <label for="file-input-542343" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-542343" accept="image/*" multiple onchange="displayImages(this, 542343)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-542343"></div>
      <!-- Camera Container -->
<div id="camera-container-542343" style="display: none;">
  <video id="camera-542343" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(542343)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(542343)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(542343)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-542343" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-54353">
      <td>5.5.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth/bus bar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5  NM with torque marking applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(54353)">Add Image</button>
<div class="upload-options" id="upload-options-54353" style="display: none;">
  <button class="add-image" onclick="startCamera(54353)">Camera</button>
  <label for="file-input-54353" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-54353" accept="image/*" multiple onchange="displayImages(this, 54353)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-54353"></div>
      <!-- Camera Container -->
<div id="camera-container-54353" style="display: none;">
  <video id="camera-54353" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(54353)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(54353)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(54353)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-54353" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-513344">
      <td>5.5.4</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(513344)">Add Image</button>
<div class="upload-options" id="upload-options-513344" style="display: none;">
  <button class="add-image" onclick="startCamera(513344)">Camera</button>
  <label for="file-input-513344" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-513344" accept="image/*" multiple onchange="displayImages(this, 513344)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-513344"></div>
      <!-- Camera Container -->
<div id="camera-container-513344" style="display: none;">
  <video id="camera-513344" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(513344)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(513344)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(513344)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-513344" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-14545">
      <td>5.5.5</td>
      <td class="observation_text">EI Interface test report</td>
      <td class="requirement_text">Verify the EI Interface Test Report is available in WFMS with OEM and customer sign-off, and there are no open points.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Available with Comments">Available with Comments</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(14545)">Add Image</button>
<div class="upload-options" id="upload-options-14545" style="display: none;">
  <button class="add-image" onclick="startCamera(14545)">Camera</button>
  <label for="file-input-14545" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-14545" accept="image/*" multiple onchange="displayImages(this, 14545)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-14545"></div>
      <!-- Camera Container -->
<div id="camera-container-14545" style="display: none;">
  <video id="camera-14545" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(14545)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(14545)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(14545)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-14545" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('6_0', activeSubsection)">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('6_0')) { saveObservation('6_0', activeSubsection); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

    // Immediately filter rows if subsection is specified
    if (subsection) {
      console.log(`Section 6.0 rendered, applying filter for subsection: ${subsection}`);
      setTimeout(() => {
        filterTableRows('observations-section-6_0', subsection);
        const heading = document.getElementById('section-heading-6_0');
        const oemContainer = document.getElementById('oem-container-5_5');
        const oemSelect = document.getElementById('oem-select-5_5');

        if (oemContainer) {
          if (subsection.startsWith("5.5")) {
            oemContainer.style.display = 'flex';
            const stationIdInput = document.getElementById('station-id');
            const stationId = stationIdInput ? (stationIdInput.value || stationIdInput.textContent || '').trim() : '';
            const savedOem = (stationId ? localStorage.getItem(`oem_name_5_5_${stationId}`) : null) || localStorage.getItem('oem_name_5_5') || '';
            if (oemSelect && savedOem) oemSelect.value = savedOem;
          } else {
            oemContainer.style.display = 'none';
          }
        }

        if (heading) {
          if (subsection.startsWith("5.1")) {
            heading.textContent = "5.1 Kavach Unit";
            const dropdown = document.getElementById('section-na-dropdown-6_0');
            if (dropdown) dropdown.style.display = 'none';
          }
          else if (subsection.startsWith("5.2")) heading.textContent = "5.2 SMOCIP(Station Master's Operation-Cum-Indication Panel)";
          else if (subsection.startsWith("5.3")) heading.textContent = "5.3 GPS/GSM Antennas";
          else if (subsection.startsWith("5.4")) heading.textContent = "5.4 RIU(Remote Interface Unit)";
          else if (subsection.startsWith("5.5")) heading.textContent = "5.5 EI Protocol Converter";
        }
      }, 100);
    }
  }
  else if (section === "7.0") {
    // Clear old section content but preserve station info
    clearSectionContent();
    mainContent.innerHTML += `
      <div style="position: relative; margin-bottom: 20px;">
        <h3 class="section-heading" id="section-heading-7_0"> RF Communication equipment on tower </h3>
        <select id="section-na-dropdown-7_0" style="position: absolute; top: 0; right: 0; width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('7_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
       <div  class="table-container">
      <table class="observations" id="observations-section-7_0">
        <thead>
         <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-7_0">
    <tr id="row-61">
      <td>6.1.1</td>
      <td class="observation_text">RTU Fixing</td>
      <td class="requirement_text">Both RTUs shall be firmly secured to the tower platform using M12 bolts and nuts, and a torque of 42 Nm shall be applied as per diagram 5 16 67 0983.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(61)">Add Image</button>
<div class="upload-options" id="upload-options-61" style="display: none;">
  <button class="add-image" onclick="startCamera(61)">Camera</button>
  <label for="file-input-61" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-61" accept="image/*" multiple onchange="displayImages(this, 61)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-61"></div>
      <!-- Camera Container -->
<div id="camera-container-61" style="display: none;">
  <video id="camera-61" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(61)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(61)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(61)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-61" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
  
<tr id="row-601">
      <td>6.1.2</td>
      <td class="observation_text">RTU Fixing</td>
      <td class="requirement_text">Ensure RTU doors are fully closed and locked.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(601)">Add Image</button>
<div class="upload-options" id="upload-options-601" style="display: none;">
  <button class="add-image" onclick="startCamera(601)">Camera</button>
  <label for="file-input-601" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-601" accept="image/*" multiple onchange="displayImages(this, 601)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-601"></div>
      <!-- Camera Container -->
<div id="camera-container-601" style="display: none;">
  <video id="camera-601" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(601)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(601)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(601)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-601" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-612">
      <td>6.1.3</td>
      <td class="observation_text">RTU Earthing</td>
      <td class="requirement_text">RTU shall be properly earthed by connecting a 16 sq.mm Y/G copper cable to GI strip earthing conductor from the RTU earthing bolt to the designated earth pit-4, as per diagram 5 16 49 0614</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(612)">Add Image</button>
<div class="upload-options" id="upload-options-612" style="display: none;">
  <button class="add-image" onclick="startCamera(612)">Camera</button>
  <label for="file-input-612" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-612" accept="image/*" multiple onchange="displayImages(this, 612)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-612"></div>
      <!-- Camera Container -->
<div id="camera-container-612" style="display: none;">
  <video id="camera-612" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(612)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(612)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(612)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-612" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-613">
      <td>6.1.4</td>
      <td class="observation_text">RTU Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(613)">Add Image</button>
<div class="upload-options" id="upload-options-613" style="display: none;">
  <button class="add-image" onclick="startCamera(613)">Camera</button>
  <label for="file-input-613" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-613" accept="image/*" multiple onchange="displayImages(this, 613)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-613"></div>
      <!-- Camera Container -->
<div id="camera-container-613" style="display: none;">
  <video id="camera-613" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(613)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(613)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(613)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-613" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-615">
      <td>6.1.5</td>
      <td class="observation_text">OFC cable termination</td>
      <td class="requirement_text">OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU.<br>(Ref. Drawing: 5 16 49 0559)</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(615)">Add Image</button>
<div class="upload-options" id="upload-options-615" style="display: none;">
  <button class="add-image" onclick="startCamera(615)">Camera</button>
  <label for="file-input-615" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-615" accept="image/*" multiple onchange="displayImages(this, 615)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-615"></div>
      <!-- Camera Container -->
<div id="camera-container-615" style="display: none;">
  <video id="camera-615" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(615)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(615)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(615)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-615" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-616">
      <td>6.1.6</td>
      <td class="observation_text">OFC cable termination</td>
      <td class="requirement_text">OFC cables for RTU shall be spliced as per diagram 5 16 49 0559 and ensure bunching and routing shall be done properly.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(616)">Add Image</button>
<div class="upload-options" id="upload-options-616" style="display: none;">
  <button class="add-image" onclick="startCamera(616)">Camera</button>
  <label for="file-input-616" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-616" accept="image/*" multiple onchange="displayImages(this, 616)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-616"></div>
      <!-- Camera Container -->
<div id="camera-container-616" style="display: none;">
  <video id="camera-616" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(616)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(616)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(616)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-616" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-617">
      <td>6.1.7</td>
      <td class="observation_text">110V Power cable termination</td>
      <td class="requirement_text">Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(617)">Add Image</button>
<div class="upload-options" id="upload-options-617" style="display: none;">
  <button class="add-image" onclick="startCamera(617)">Camera</button>
  <label for="file-input-617" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-617" accept="image/*" multiple onchange="displayImages(this, 617)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-617"></div>
      <!-- Camera Container -->
<div id="camera-container-617" style="display: none;">
  <video id="camera-617" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(617)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(617)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(617)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-617" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-618">
      <td>6.1.8</td>
      <td class="observation_text">110V Power cable termination</td>
      <td class="requirement_text">110 V DC power cables shall be terminated on RTU MCB as per diagram 5 16 49 0672.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(618)">Add Image</button>
<div class="upload-options" id="upload-options-618" style="display: none;">
  <button class="add-image" onclick="startCamera(618)">Camera</button>
  <label for="file-input-618" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-618" accept="image/*" multiple onchange="displayImages(this, 618)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-618"></div>
      <!-- Camera Container -->
<div id="camera-container-618" style="display: none;">
  <video id="camera-618" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(618)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(618)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(618)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-618" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-619">
      <td>6.1.9</td>
      <td class="observation_text">110V Power cable termination</td>
      <td class="requirement_text">Ensure lugs with sleeves / Ferrules are  properly crimped and inserted into the terminal; no loose strands shall be left.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(619)">Add Image</button>
<div class="upload-options" id="upload-options-619" style="display: none;">
  <button class="add-image" onclick="startCamera(619)">Camera</button>
  <label for="file-input-619" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-619" accept="image/*" multiple onchange="displayImages(this, 619)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-619"></div>
      <!-- Camera Container -->
<div id="camera-container-619" style="display: none;">
  <video id="camera-619" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(619)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(619)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(619)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-619" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-6112">
      <td>6.1.10</td>
      <td class="observation_text">Cabiling</td>
      <td class="requirement_text">LMR 600 connection with proper routing; and clamping; No Joints shall be done, as per Tower SOP 5 16 90 0018.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(6112)">Add Image</button>
<div class="upload-options" id="upload-options-6112" style="display: none;">
  <button class="add-image" onclick="startCamera(6112)">Camera</button>
  <label for="file-input-6112" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-6112" accept="image/*" multiple onchange="displayImages(this, 6112)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-6112"></div>
      <!-- Camera Container -->
<div id="camera-container-6112" style="display: none;">
  <video id="camera-6112" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(6112)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(6112)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(6112)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-6112" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-61120">
      <td>6.1.11</td>
      <td class="observation_text">Radio Configuration</td>
      <td class="requirement_text">Radio power shall be configured as 10W.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(61120)">Add Image</button>
<div class="upload-options" id="upload-options-61120" style="display: none;">
  <button class="add-image" onclick="startCamera(61120)">Camera</button>
  <label for="file-input-61120" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-61120" accept="image/*" multiple onchange="displayImages(this, 61120)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-61120"></div>
      <!-- Camera Container -->
<div id="camera-container-61120" style="display: none;">
  <video id="camera-61120" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(61120)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(61120)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(61120)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-61120" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-62">
      <td>6.2.1</td>
      <td class="observation_text">RF antenna installation and Audit</td>
      <td class="requirement_text">RF antenna installation and orientation shall be done as per 10.2dBi omni-directional anteena diagram 5 16 67 0983.</td>
        <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(62)">Add Image</button>
<div class="upload-options" id="upload-options-62" style="display: none;">
  <button class="add-image" onclick="startCamera(62)">Camera</button>
  <label for="file-input-62" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-62" accept="image/*" multiple onchange="displayImages(this, 62)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-62"></div>
      <!-- Camera Container -->
<div id="camera-container-62" style="display: none;">
  <video id="camera-62" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(62)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(62)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(62)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-62" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-621">
      <td>6.2.2</td>
      <td class="observation_text">RF antenna installation and Audit</td>
      <td class="requirement_text">RF antenna installation audit report from the installation contractor shall be available in WFMS and there shall be no open points in the audit report.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>        
                </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(621)">Add Image</button>
<div class="upload-options" id="upload-options-621" style="display: none;">
  <button class="add-image" onclick="startCamera(621)">Camera</button>
  <label for="file-input-621" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-621" accept="image/*" multiple onchange="displayImages(this, 621)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-621"></div>
      <!-- Camera Container -->
<div id="camera-container-621" style="display: none;">
  <video id="camera-621" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(621)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(621)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(621)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-621" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('7_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('7_0')) { saveObservation('7_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  } else if (section === "8.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <div style="position: relative; margin-bottom: 20px;">
        <h3 class="section-heading" > OFC Networking rack </h3>
        <select id="section-na-dropdown-8_0" style="position: absolute; top: 0; right: 0; width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('8_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
       <div  class="table-container">
      <table class="observations" id="observations-section-8_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-8_0">
          <tr id="row-711">
      <td>7.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Network rack shall be installed as per approved floor plan and installation shall be done as per diagram 5 16 76 0058.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(711)">Add Image</button>
<div class="upload-options" id="upload-options-711" style="display: none;">
  <button class="add-image" onclick="startCamera(711)">Camera</button>
  <label for="file-input-711" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-711" accept="image/*" multiple onchange="displayImages(this, 711)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-711"></div>
      <!-- Camera Container -->
<div id="camera-container-711" style="display: none;">
  <video id="camera-711" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(711)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(711)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(711)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-711" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-712">
      <td>7.2</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Patch cord routing shall be neat & bend radius to be maintained.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(712)">Add Image</button>
<div class="upload-options" id="upload-options-712" style="display: none;">
  <button class="add-image" onclick="startCamera(712)">Camera</button>
  <label for="file-input-712" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-712" accept="image/*" multiple onchange="displayImages(this, 712)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-712"></div>
      <!-- Camera Container -->
<div id="camera-container-712" style="display: none;">
  <video id="camera-712" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(712)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(712)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(712)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-712" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-713">
      <td>7.3</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering the network rack shall pass through the grommets.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(713)">Add Image</button>
<div class="upload-options" id="upload-options-713" style="display: none;">
  <button class="add-image" onclick="startCamera(713)">Camera</button>
  <label for="file-input-713" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-713" accept="image/*" multiple onchange="displayImages(this, 713)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-713"></div>
      <!-- Camera Container -->
<div id="camera-container-713" style="display: none;">
  <video id="camera-713" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(713)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(713)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(713)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-713" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

 <tr id="row-721">
      <td>7.4</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
       <td>
       <button class="add-image" onclick="showUploadOptions(721)">Add Image</button>
<div class="upload-options" id="upload-options-721" style="display: none;">
  <button class="add-image" onclick="startCamera(721)">Camera</button>
  <label for="file-input-721" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-721" accept="image/*" multiple onchange="displayImages(this, 721)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-721"></div>
<!-- Camera Container -->
<div id="camera-container-721" style="display: none;">
  <video id="camera-721" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(721)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(721)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(721)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-721" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-731">
      <td>7.5</td>
      <td class="observation_text">Earthing</td>
       <td class="requirement_text">All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(731)">Add Image</button>
<div class="upload-options" id="upload-options-731" style="display: none;">
  <button class="add-image" onclick="startCamera(731)">Camera</button>
  <label for="file-input-731" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-731" accept="image/*" multiple onchange="displayImages(this, 731)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-731"></div>
<!-- Camera Container -->
<div id="camera-container-731" style="display: none;">
  <video id="camera-731" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(731)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(731)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(731)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-731" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-732">
      <td>7.6</td>
      <td class="observation_text">Earthing</td>
       <td class="requirement_text">Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(732)">Add Image</button>
<div class="upload-options" id="upload-options-732" style="display: none;">
  <button class="add-image" onclick="startCamera(732)">Camera</button>
  <label for="file-input-732" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-732" accept="image/*" multiple onchange="displayImages(this, 732)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-732"></div>
<!-- Camera Container -->
<div id="camera-container-732" style="display: none;">
  <video id="camera-732" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(732)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(732)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(732)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-732" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-733">
      <td>7.7</td>
      <td class="observation_text">Earthing</td>
       <td class="requirement_text">Bolts shall be tightened to a torque of 5 Nm, and torque marking shall be applied using yellow paint.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(733)">Add Image</button>
<div class="upload-options" id="upload-options-733" style="display: none;">
  <button class="add-image" onclick="startCamera(733)">Camera</button>
  <label for="file-input-733" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-733" accept="image/*" multiple onchange="displayImages(this, 733)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-733"></div>
<!-- Camera Container -->
<div id="camera-container-733" style="display: none;">
  <video id="camera-733" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(733)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(733)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(733)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-733" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-741">
      <td>7.8</td>
      <td class="observation_text">FDMS Box Installation in Network Rack</td>
      <td class="requirement_text">OFC cables shall be spliced in the FDMS box as per network drawing.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(741)">Add Image</button>
<div class="upload-options" id="upload-options-741" style="display: none;">
  <button class="add-image" onclick="startCamera(741)">Camera</button>
  <label for="file-input-741" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-741" accept="image/*" multiple onchange="displayImages(this, 741)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-741"></div>
<!-- Camera Container -->
<div id="camera-container-741" style="display: none;">
  <video id="camera-741" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(741)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(741)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(741)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-741" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-742">
      <td>7.9</td>
      <td class="observation_text">FDMS Box Installation in Network Rack</td>
      <td class="requirement_text">FDMS boxes shall be clearly marked to identify up and down links.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(742)">Add Image</button>
<div class="upload-options" id="upload-options-742" style="display: none;">
  <button class="add-image" onclick="startCamera(742)">Camera</button>
  <label for="file-input-742" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-742" accept="image/*" multiple onchange="displayImages(this, 742)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-742"></div>
<!-- Camera Container -->
<div id="camera-container-742" style="display: none;">
  <video id="camera-742" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(742)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(742)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(742)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-742" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-75">
      <td>7.10</td>
      <td class="observation_text">OFC cable continuity check, after splicing</td>
      <td class="requirement_text">OTDR test reports shall be available.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(75)">Add Image</button>
<div class="upload-options" id="upload-options-75" style="display: none;">
  <button class="add-image" onclick="startCamera(75)">Camera</button>
  <label for="file-input-75" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-75" accept="image/*" multiple onchange="displayImages(this, 75)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-75"></div>
<!-- Camera Container -->
<div id="camera-container-75" style="display: none;">
  <video id="camera-75" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(75)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(75)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(75)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-75" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('8_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('8_0')) { saveObservation('8_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  } else if (section === "9.0") {
    mainContent.innerHTML += `
      <div style="position: relative; margin-bottom: 20px;">
        <h3 class="section-heading" > Relay rack </h3>
        <select id="section-na-dropdown-9_0" style="position: absolute; top: 0; right: 0; width: 140px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; background-color: white;" onchange="if(this.value) { markSectionAsNotApplicable('9_0', this.value); this.value=''; }">
          <option value="">Mark Section As:</option>
          <option value="mark">Mark All as Not Applicable</option>
          <option value="clear">Clear All Selections</option>
        </select>
      </div>
       <div  class="table-container">
      <table class="observations" id="observations-section-9_0">
        <thead>
         <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-9_0">
          <tr id="row-81">
      <td>8.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Relay rack shall be installed as per the approved Floor Plan drawing, mounted on insulators, and secured to the floor by grouting as per diagram 5 16 76 0059.
</td>
    <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(81)">Add Image</button>
<div class="upload-options" id="upload-options-81" style="display: none;">
  <button class="add-image" onclick="startCamera(81)">Camera</button>
  <label for="file-input-81" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-81" accept="image/*" multiple onchange="displayImages(this, 81)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-81"></div>
      <!-- Camera Container -->
<div id="camera-container-81" style="display: none;">
  <video id="camera-81" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(81)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(81)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(81)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-81" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
</tr>
 <tr id="row-912">
      <td>8.2</td>
      <td class="observation_text">Wiring</td>
      <td class="requirement_text">Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & contact type, Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach. </td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(912)">Add Image</button>
<div class="upload-options" id="upload-options-912" style="display: none;">
  <button class="add-image" onclick="startCamera(912)">Camera</button>
  <label for="file-input-912" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-912" accept="image/*" multiple onchange="displayImages(this, 912)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-912"></div>
<!-- Camera Container -->
<div id="camera-container-912" style="display: none;">
  <video id="camera-912" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(912)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(912)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(912)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-912" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-828756">
      <td>8.3</td>
      <td class="observation_text">Wiring</td>
      <td class="requirement_text">For EI Stations, verify all connections as per the approved EI Interface diagrams (vendor specific).</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(828756)">Add Image</button>
<div class="upload-options" id="upload-options-828756" style="display: none;">
  <button class="add-image" onclick="startCamera(828756)">Camera</button>
  <label for="file-input-828756" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-828756" accept="image/*" multiple onchange="displayImages(this, 828756)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-828756"></div>
<!-- Camera Container -->
<div id="camera-container-828756" style="display: none;">
  <video id="camera-828756" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(828756)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(828756)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(828756)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-828756" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-8287967">
      <td>8.4</td>
      <td class="observation_text">Wiring</td>
      <td class="requirement_text">WAGO terminal details shall be as per interface circuit diagram 5 16 49 0685.
</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(8287967)">Add Image</button>
<div class="upload-options" id="upload-options-8287967" style="display: none;">
  <button class="add-image" onclick="startCamera(8287967)">Camera</button>
  <label for="file-input-8287967" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-8287967" accept="image/*" multiple onchange="displayImages(this, 8287967)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-8287967"></div>
<!-- Camera Container -->
<div id="camera-container-8287967" style="display: none;">
  <video id="camera-8287967" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(8287967)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(8287967)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(8287967)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-8287967" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
</tr>
   <tr id="row-83">
      <td>8.5</td>
      <td class="observation_text">Continuity Test / Bell Test</td>
      <td class="requirement_text">Completed Station Analyser and Bell Test reports shall be available.</td>
    <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(83)">Add Image</button>
<div class="upload-options" id="upload-options-83" style="display: none;">
  <button class="add-image" onclick="startCamera(83)">Camera</button>
  <label for="file-input-83" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-83" accept="image/*" multiple onchange="displayImages(this, 83)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-83"></div>
<!-- Camera Container -->
<div id="camera-container-83" style="display: none;">
  <video id="camera-83" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(83)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(83)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(83)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-83" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-914">
      <td>8.6</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(914)">Add Image</button>
<div class="upload-options" id="upload-options-914" style="display: none;">
  <button class="add-image" onclick="startCamera(914)">Camera</button>
  <label for="file-input-914" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-914" accept="image/*" multiple onchange="displayImages(this, 914)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-914"></div>
<!-- Camera Container -->
<div id="camera-container-914" style="display: none;">
  <video id="camera-914" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(914)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(914)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(914)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-914" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     </tr>
    <tr id="row-9134">
      <td>8.7</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(9134)">Add Image</button>
<div class="upload-options" id="upload-options-9134" style="display: none;">
  <button class="add-image" onclick="startCamera(9134)">Camera</button>
  <label for="file-input-9134" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-9134" accept="image/*" multiple onchange="displayImages(this, 9134)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-9134"></div>
<!-- Camera Container -->
<div id="camera-container-9134" style="display: none;">
  <video id="camera-9134" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(9134)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(9134)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(9134)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-9134" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > Earthing</h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-10_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-10_0">
          <tr id="row-91">
      <td>9.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Earthing shall be done as per RDSO Spec RDSO/SPN/197/2008</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(91)">Add Image</button>
<div class="upload-options" id="upload-options-91" style="display: none;">
  <button class="add-image" onclick="startCamera(91)">Camera</button>
  <label for="file-input-91" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-91" accept="image/*" multiple onchange="displayImages(this, 91)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-91"></div>
      <!-- Camera Container -->
<div id="camera-container-91" style="display: none;">
  <video id="camera-91" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(91)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(91)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(91)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-91" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-1012">
      <td>9.2</td>
      <td class="observation_text">Earth Resistance Measurement</td>
      <td class="requirement_text">Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be lessthan or equal to 1 Ohm.</td>
     <td class="select">
        <input type="number" min="0" step="0.01" placeholder="Enter resistance (Ohm)"
              oninput="checkEarthResistance(this, 1012)"
              style="margin-bottom:3px; width:70%; height: 30%">

        <select id="status-1012" class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();"
                style="opacity:1; color:#000; background-color:#fff;">
          <option value="Select">Select</option>
          <option value="Ok" style="display:none;">Ok</option>
          <option value="Not Ok" style="display:none;">Not Ok</option>
          <option value="Not Verified">Not Verified</option>
          <option value="Not Applicable">Not Applicable</option>
          
        </select>
      </td>
      <td class="remarks">
        <textarea id="remarks-1012" placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1012)">Add Image</button>
<div class="upload-options" id="upload-options-1012" style="display: none;">
  <button class="add-image" onclick="startCamera(1012)">Camera</button>
  <label for="file-input-1012" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1012" accept="image/*" multiple onchange="displayImages(this, 1012)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1012"></div>
      <!-- Camera Container -->
<div id="camera-container-1012" style="display: none;">
  <video id="camera-1012" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1012)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1012)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1012)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1012" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-10120">
      <td>9.2.1</td>
      <td class="observation_text">Earth Resistance Measurement</td>
      <td class="requirement_text">Check the value of earth resistance at earth of the radio tower. The measured value shall be lessthan or equal to 2 Ohm.</td>
     <td class="select">
        <input type="number" min="0" step="0.01" placeholder="Enter resistance (Ohm)"
              oninput="checkEarthResistance(this, 10120)"
              style="margin-bottom:3px; width:70%; height: 30%">

        <select id="status-10120" class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();"
                style="opacity:1; color:#000; background-color:#fff;">
          <option value="Select">Select</option>
          <option value="Ok" style="display:none;">Ok</option>
          <option value="Not Ok" style="display:none;">Not Ok</option>
          <option value="Not Verified">Not Verified</option>
          <option value="Not Applicable">Not Applicable</option>
        
        </select>
      </td>
      <td class="remarks">
        <textarea id="remarks-10120" placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(10120)">Add Image</button>
<div class="upload-options" id="upload-options-10120" style="display: none;">
  <button class="add-image" onclick="startCamera(10120)">Camera</button>
  <label for="file-input-10120" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-10120" accept="image/*" multiple onchange="displayImages(this, 10120)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-10120"></div>
      <!-- Camera Container -->
<div id="camera-container-10120" style="display: none;">
  <video id="camera-10120" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(10120)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(10120)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(10120)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-10120" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-93">
      <td>9.3</td>
      <td class="observation_text">Test Reports</td>
      <td class="requirement_text">Earth resistance test reports shall be available</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(93)">Add Image</button>
<div class="upload-options" id="upload-options-93" style="display: none;">
  <button class="add-image" onclick="startCamera(93)">Camera</button>
  <label for="file-input-93" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-93" accept="image/*" multiple onchange="displayImages(this, 93)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-93"></div>
      <!-- Camera Container -->
<div id="camera-container-93" style="display: none;">
  <video id="camera-93" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(93)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(93)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(93)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-93" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-1014">
      <td>9.4</td>
      <td class="observation_text">Labeling</td>
      <td class="requirement_text">All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.</td>
    <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1014)">Add Image</button>
<div class="upload-options" id="upload-options-1014" style="display: none;">
  <button class="add-image" onclick="startCamera(1014)">Camera</button>
  <label for="file-input-1014" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1014" accept="image/*" multiple onchange="displayImages(this, 1014)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1014"></div>
      <!-- Camera Container -->
<div id="camera-container-1014" style="display: none;">
  <video id="camera-1014" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1014)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1014)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1014)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1014" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('10_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('10_0')) { saveObservation('10_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if (section === "11.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > Indoor wiring / cabling </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-11_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-11_0">
          <tr id="row-101">
      <td>10.1</td>
      <td class="observation_text">Redundant cabling</td>
      <td class="requirement_text">Cabling shall be done as per station connectivity diagram 5 16 49 0614 <br>
      Segregation of power & communication cables.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Applicable">Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(101)">Add Image</button>
<div class="upload-options" id="upload-options-101" style="display: none;">
  <button class="add-image" onclick="startCamera(101)">Camera</button>
  <label for="file-input-101" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-101" accept="image/*" multiple onchange="displayImages(this, 101)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-101"></div>
      <!-- Camera Container -->
<div id="camera-container-101" style="display: none;">
  <video id="camera-101" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(101)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(101)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(101)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-101" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    
     <tr id="row-1102">
      <td>10.2</td>
      <td class="observation_text">SMOCIP</td>
      <td class="requirement_text">12 Core Signaling cable shall be used for
button, counter & power supply.<br>
OFC armoured cables shall be used for communication.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Applicable">Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Connected">Not Connected</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1102)">Add Image</button>
<div class="upload-options" id="upload-options-1102" style="display: none;">
  <button class="add-image" onclick="startCamera(1102)">Camera</button>
  <label for="file-input-1102" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1102" accept="image/*" multiple onchange="displayImages(this, 1102)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1102"></div>
      <!-- Camera Container -->
<div id="camera-container-1102" style="display: none;">
  <video id="camera-1102" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1102)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1102)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1102)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1102" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-103">
      <td>10.3</td>
      <td class="observation_text">No Joints</td>
      <td class="requirement_text">No joints permitted except inside junction boxes or panels.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Applicable">Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(103)">Add Image</button>
<div class="upload-options" id="upload-options-103" style="display: none;">
  <button class="add-image" onclick="startCamera(103)">Camera</button>
  <label for="file-input-103" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-103" accept="image/*" multiple onchange="displayImages(this, 103)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-103"></div>
      <!-- Camera Container -->
<div id="camera-container-103" style="display: none;">
  <video id="camera-103" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(103)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(103)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(103)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-103" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-104">
      <td>10.4</td>
      <td class="observation_text">Color Coding</td>
      <td class="requirement_text">Colour codes shall be followed for phase, neutral, and earth.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Applicable">Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(104)">Add Image</button>
<div class="upload-options" id="upload-options-104" style="display: none;">
  <button class="add-image" onclick="startCamera(104)">Camera</button>
  <label for="file-input-104" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-104" accept="image/*" multiple onchange="displayImages(this, 104)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-104"></div>
      <!-- Camera Container -->
<div id="camera-container-104" style="display: none;">
  <video id="camera-104" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(104)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(104)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(104)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-104" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-1104">
      <td>10.5</td>
      <td class="observation_text">Tagging/Labeling</td>
      <td class="requirement_text">Cables shall be tagged at both ends.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Applicable">Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1104)">Add Image</button>
<div class="upload-options" id="upload-options-1104" style="display: none;">
  <button class="add-image" onclick="startCamera(1104)">Camera</button>
  <label for="file-input-1104" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1104" accept="image/*" multiple onchange="displayImages(this, 1104)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1104"></div>
      <!-- Camera Container -->
<div id="camera-container-1104" style="display: none;">
  <video id="camera-1104" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1104)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1104)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1104)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1104" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-106">
      <td>10.6</td>
      <td class="observation_text">Termination & Connection</td>
      <td class="requirement_text">Proper lugs/ferrules shall be used and terminals tightened correctly.</td>
     <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Applicable">Applicable</option>
                <option value="Not Verified">Not Verified</option>  
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(106)">Add Image</button>
<div class="upload-options" id="upload-options-106" style="display: none;">
  <button class="add-image" onclick="startCamera(106)">Camera</button>
  <label for="file-input-106" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-106" accept="image/*" multiple onchange="displayImages(this, 106)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-106"></div>
      <!-- Camera Container -->
<div id="camera-container-106" style="display: none;">
  <video id="camera-106" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(106)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(106)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(106)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-106" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('11_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('11_0')) { saveObservation('11_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if (section === "12.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > Outdoor cabling </h3>

       <div  class="table-container">
      <table class="observations" id="observations-section-12_0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-12_0">
          <tr id="row-111">
      <td>11.1</td>
      <td class="observation_text">Cable route plan for OFC & Power cable (Relay Room to Tower)</td>
      <td class="requirement_text">Railway-approved outdoor signalling cable route plan shall be available.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
               
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(111)">Add Image</button>
<div class="upload-options" id="upload-options-111" style="display: none;">
  <button class="add-image" onclick="startCamera(111)">Camera</button>
  <label for="file-input-111" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-111" accept="image/*" multiple onchange="displayImages(this, 111)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-111"></div>
      <!-- Camera Container -->
<div id="camera-container-111" style="display: none;">
  <video id="camera-111" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(111)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(111)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(111)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-111" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-1202">
      <td>11.2</td>
      <td class="observation_text">Cable route markers</td>
      <td class="requirement_text">Route markers shall be installed and clearly visible.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1202)">Add Image</button>
<div class="upload-options" id="upload-options-1202" style="display: none;">
  <button class="add-image" onclick="startCamera(1202)">Camera</button>
  <label for="file-input-1202" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1202" accept="image/*" multiple onchange="displayImages(this, 1202)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1202"></div>
      <!-- Camera Container -->
<div id="camera-container-1202" style="display: none;">
  <video id="camera-1202" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1202)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1202)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1202)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1202" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('12_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('12_0')) { saveObservation('12_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if (section === "13.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" >  RFID Tags </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-13_0">
        <thead>
         <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-13_0">
          <tr id="row-121">
      <td>12.1</td>
      <td class="observation_text">RFID Tag Installation</td>
       <td class="requirement_text">Ensure the main RFID tag is installed in the direction specified in the RFID tag layout, and a duplicate RFID tag shall be installed at a distance of 3–5 meters from the main tag, except for turnout tags.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                  <option value="Not Verified">Not Verified</option>
                  <option value="Not Installed">Not Installed</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(121)">Add Image</button>
<div class="upload-options" id="upload-options-121" style="display: none;">
  <button class="add-image" onclick="startCamera(121)">Camera</button>
  <label for="file-input-121" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-121" accept="image/*" multiple onchange="displayImages(this, 121)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-121"></div>
      <!-- Camera Container -->
<div id="camera-container-121" style="display: none;">
  <video id="camera-121" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(121)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(121)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(121)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-121" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
      <tr id="row-1302">
      <td>12.2</td>
      <td class="observation_text">RFID Tag Installation</td>
       <td class="requirement_text">RFID tag mounting shall be firm and secure, ensuring no gap or mechanical play as per RFID tag installation procedure 5 53 76 0055.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
                 
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1302)">Add Image</button>
<div class="upload-options" id="upload-options-1302" style="display: none;">
  <button class="add-image" onclick="startCamera(1302)">Camera</button>
  <label for="file-input-1302" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1302" accept="image/*" multiple onchange="displayImages(this, 1302)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1302"></div>
      <!-- Camera Container -->
<div id="camera-container-1302" style="display: none;">
  <video id="camera-1302" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1302)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1302)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1302)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1302" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-123">
      <td>12.3</td>
      <td class="observation_text">RFID Tag data Validation and Placement verification</td>
      <td class="requirement_text">System-generated RFID data validation report and Placement verification report shall be available.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(123)">Add Image</button>
<div class="upload-options" id="upload-options-123" style="display: none;">
  <button class="add-image" onclick="startCamera(123)">Camera</button>
  <label for="file-input-123" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-123" accept="image/*" multiple onchange="displayImages(this, 123)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-123"></div>
      <!-- Camera Container -->
<div id="camera-container-123" style="display: none;">
  <video id="camera-123" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(123)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(123)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(123)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-123" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-12398">
      <td>12.4</td>
      <td class="observation_text">Verify replacement of RFID Point Tags with the new FRP Tag Mounting Base</td>
      <td class="requirement_text">All RFID Point Tags are installed using the FRP Tag Mounting Base.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Verified">Not Verified</option>
                <option value="Not Completed">Not Completed</option>
                option value="Not Verified">Not Verified</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add Tag Numbers..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(12398)">Add Image</button>
<div class="upload-options" id="upload-options-12398" style="display: none;">
  <button class="add-image" onclick="startCamera(12398)">Camera</button>
  <label for="file-input-12398" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-12398" accept="image/*" multiple onchange="displayImages(this, 12398)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-12398"></div>
      <!-- Camera Container -->
<div id="camera-container-12398" style="display: none;">
  <video id="camera-12398" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(12398)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(12398)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(12398)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-12398" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('13_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('13_0')) { saveObservation('13_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if (section === "14.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" >  Components Inspection: </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-14_0">
        <thead>
         <tr>
            <th>S.No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-14_0">
          <tr id="row-17621">
      <td>13.1</td>
      <td class="observation_text">Materials Inspection (Which are not Inspected by RDSO or Consignee)</td>
       <td class="requirement_text">Verify that all subcontractors and HBL personnel use only approved make and part numbers as per the List of Acceptable I&C Materials EG-EN-FT-34.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Not Verified">Not Verified</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(17621)">Add Image</button>
<div class="upload-options" id="upload-options-17621" style="display: none;">
  <button class="add-image" onclick="startCamera(17621)">Camera</button>
  <label for="file-input-17621" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-17621" accept="image/*" multiple onchange="displayImages(this, 17621)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-17621"></div>
      <!-- Camera Container -->
<div id="camera-container-17621" style="display: none;">
  <video id="camera-17621" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(17621)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(17621)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(17621)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-17621" style="display: none;"></canvas> <!-- Canvas to capture the image -->
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
              onclick="updateObservation('14_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('14_0')) { saveObservation('14_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }

}


// Trigger file chooser, upload DB file, and convert to Excel
// Upload .db file, then call export to convert it to Excel
async function chooseAndUploadFile(sectionId) {
  const fileInput = document.getElementById(`supporting-file-${sectionId}`);
  const container = document.getElementById(`uploaded-file-container-${sectionId}`);

  if (!fileInput) {
    console.error("File input not found for section:", sectionId);
    return;
  }
  if (!container) {
    console.error("Uploaded file container not found for section:", sectionId);
    return;
  }

  // open file picker
  fileInput.click();

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    container.innerText = "Uploading DB file...";

    const formData = new FormData();
    formData.append("dbFile", file); // send actual File object

    try {
      // STEP 1: upload the DB file
      const uploadResp = await fetch("Db File Converter/upload", {
        method: "POST",
        body: formData
      });
      const uploadResult = await uploadResp.text();
      container.innerText = uploadResult;

      // check success - adjust this check if your PHP returns different text
      if (uploadResp.ok && uploadResult.toLowerCase().includes("uploaded")) {
        // STEP 2: call export (many server scripts expect filename string;
        // if export expects the filename, pass the name; if it expects the file,
        // pass the file again. Most common: pass filename that was saved on the server.)
        const exportForm = new FormData();
        exportForm.append("dbFile", file.name); // or append the path your server expects

        container.innerText += "\nConverting to Excel...";
        const exportResp = await fetch("Db File Converter/export", {
          method: "POST",
          body: exportForm
        });
        const exportResult = await exportResp.text();
        container.innerHTML += "<br>" + exportResult;

        alert("DB converted to Excel. Now you can extract TAG_ID.");
      } else {
        throw new Error("Upload failed: " + uploadResult);
      }
    } catch (err) {
      console.error("Upload/convert error:", err);
      container.innerHTML += `<br><span style="color:red;">Error: ${err.message || err}</span>`;
      alert("Error uploading/converting file — check console/network for details.");
    }
  };
}




async function extractExcelTags(sectionId) {
  const excelUrl = "uploads/files/database.xlsx"; // relative path

  const response = await fetch(excelUrl);
  if (!response.ok) {
    alert("Excel file not found. Please export DB to Excel first.");
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });

  const tbody = document.getElementById(`observations-tbody-${sectionId}`);
  if (!tbody) {
    console.error(`❌ Table body not found: observations-tbody-${sectionId}`);
    alert(`Error: Could not find table body for section ${sectionId}`);
    return;
  }

  tbody.innerHTML = ""; // clear old rows

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
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
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
  if (unsavedChanges) {
    alert("⚠️ You have unsaved changes in the current section. Please click 'Save' or 'Update' at the bottom of the table before generating the report.");
    return;
  }
  // Remove the beforeunload listener so that it won't trigger when clicking the button.
  window.removeEventListener("beforeunload", beforeUnloadHandler);
  const stationInfo = JSON.parse(sessionStorage.getItem("stationInfo") || "{}");
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

    // Redirect to the observations page with a cache-buster
    window.location.href = "observations.html?_t=" + Date.now();
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
  const sections = [
    { id: '0.0', dbId: 0, btn: 'station-info-button' },
    { id: '2.0', dbId: 2, btn: 'button-2' },
    { id: '3.0', dbId: 3, btn: 'button-3' },
    { id: '4.0', dbId: 4, btn: 'button-4' },
    {
      id: '5.0', dbId: 5, btn: 'button-5',
      subsections: ['4.1', '4.2', '4.3']
    },
    {
      id: '6.0', dbId: 6, btn: 'button-6',
      subsections: ['5.1', '5.2', '5.3', '5.4', '5.5']
    },
    {
      id: '7.0', dbId: 7, btn: 'button-7',
      subsections: ['6.1', '6.2']
    },
    { id: '8.0', dbId: 8, btn: 'button-8' },
    { id: '9.0', dbId: 9, btn: 'button-9' },
    { id: '10.0', dbId: 10, btn: 'button-10' },
    { id: '11.0', dbId: 11, btn: 'button-11' },
    { id: '12.0', dbId: 12, btn: 'button-12' },
    { id: '13.0', dbId: 13, btn: 'button-13' },
    { id: '14.0', dbId: 14, btn: 'button-14' },
    { id: '15.0', dbId: 15, btn: 'button-15' },
    { id: '16.0', dbId: 16, btn: 'button-16' },
    { id: '17.0', dbId: 17, btn: 'button-17' },
    { id: '18.0', dbId: 18, btn: 'button-18' }
  ];

  for (const section of sections) {
    if (section.subsections) {
      let filledCount = 0;
      for (const sub of section.subsections) {
        const subExists = await checkExistingObservations(stationId, division, zone, section.dbId, sub);
        const subBtn = document.getElementById(`button-${sub}`);
        if (subBtn) {
          subBtn.disabled = false;
          if (subExists) {
            subBtn.style.backgroundColor = "#b2ebf2"; // Light cyan background
            subBtn.style.color = "black"; // Ensuring text is visible on light background
            filledCount++;
          } else {
            subBtn.style.backgroundColor = "";
            subBtn.style.color = "";
          }
        }
      }

      const mainBtn = document.getElementById(section.btn);
      if (mainBtn) {
        mainBtn.disabled = false;
        if (filledCount === section.subsections.length) {
          mainBtn.style.backgroundColor = "#b2ebf2"; // Fully filled (Light cyan)
          mainBtn.style.color = "black"; // Black text on light cyan
        } else if (filledCount > 0) {
          mainBtn.style.backgroundColor = "#4682b4"; // Steel Blue (Darker, so white text ok)
          mainBtn.style.color = "white"; // White text on darker background
        } else {
          mainBtn.style.backgroundColor = "";
          mainBtn.style.color = "";
        }
      }
    } else {
      const exists = await checkExistingObservations(stationId, division, zone, section.dbId);
      const btn = document.getElementById(section.btn);
      if (btn) {
        btn.disabled = false;
        if (exists) {
          btn.style.backgroundColor = "#b2ebf2";
          btn.style.color = "black"; // Ensure text is visible on light cyan
        } else {
          btn.style.backgroundColor = "";
          btn.style.color = "";
        }
      }
    }
  }
}


async function checkExistingObservations(stationId, division, zone, sectionId, subsection) {
  try {

    const requestData = { stationId, division, zone, sectionId, subsection };


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

async function saveObservation(section, subsection) {
  const stationInfo = JSON.parse(sessionStorage.getItem("stationInfo") || "{}");

  const stationId = stationInfo.stationId || "";
  const stationName = stationInfo.stationName || "";
  const zone = stationInfo.zone || "";
  const division = stationInfo.division || "";
  const sectionName = stationInfo.sectionName || "";
  const initialDate = stationInfo.initialDate || "";
  const updatedDate = stationInfo.updatedDate || "";

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
    const S_no = row.querySelector("td:first-child")?.innerText.trim().replace("🗑️", "").trim() || "";

    // If subsection is specified, only collect rows that belong to that subsection
    if (subsection && !S_no.startsWith(subsection)) continue;

    const obsField = row.querySelector(".observation_text");

    if (!obsField && section !== "17_0") {
      alert(`❌ Missing description field for S.No ${S_no}`);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    let descriptionHtml = "";
    if (obsField) {
      const clone = obsField.cloneNode(true);
      clone.querySelectorAll("input").forEach(i => i.remove());
      descriptionHtml = clone.innerHTML.trim().replace(/<br\s*\/?>$/i, "").trim();
    } else if (section === "17_0") {
      descriptionHtml = "Tag_No:";
    }

    // Extract requirement text
    const reqField = row.querySelector(".requirement_text");
    const requirementText = reqField ? reqField.innerText.trim() : "";

    if ((!descriptionHtml || descriptionHtml.toUpperCase() === "N/A") && section !== "17_0") {
      alert(`⚠️ Description cannot be empty or "N/A" for S.No ${S_no}`);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    const barcode = row.querySelector("input[type='text']")?.value.trim() || "";
    const text = (descriptionHtml + " " + barcode).trim();
    const remarks = row.querySelector(".remarks textarea")?.value.trim() || "";
    let status = row.querySelector("select")?.value || "";

    // ✅ Allow saving rows even if status is 'Select' to ensure DB completeness
    // if (!status || status === "Select") {
    //   continue; // Skip this row, don't save it
    // }

    anyDropdownSelected = true;

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
      row_key: row.getAttribute("data-key"),
      observation_text: text,
      requirement_text: requirementText,
      barcode_kavach_main_unit: barcode,
      remarks,
      observation_status: status,
      image_paths: imagePaths,
    });
  }

  // Deduplicate observations by S_no (keep the last one)
  const uniqueObservationsMap = new Map();
  observations.forEach(obs => {
    uniqueObservationsMap.set(obs.S_no, obs);
  });
  const uniqueObservations = Array.from(uniqueObservationsMap.values());

  // ✅ Check if at least one observation status is selected
  if (!anyDropdownSelected) {
    alert("⚠️ Please select at least one observation status before saving.");
    if (saveBtn) saveBtn.disabled = false;
    return;
  }

  /* Refactored to use generic updateObservations for robustness */
  const sectionMapping = {
    "2_0": 0, "3_0": 1, "4_0": 2,
    "5_0": 3, "6_0": 4, "7_0": 5, "8_0": 6, "9_0": 7, "10_0": 8, "11_0": 9,
    "12_0": 10, "13_0": 11, "14_0": 12, "15_0": 13, "16_0": 14, "17_0": 15, "18_0": 16
  };

  let targetUrl = `section${section}`; // Fallback
  if (sectionMapping[section] !== undefined) {
    formData.append("section_index", sectionMapping[section]);
    targetUrl = "updateObservations";
  }

  formData.append("observations", JSON.stringify(uniqueObservations));

  if (!confirm("💾 Do you want to save observations?")) {
    if (saveBtn) saveBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch(targetUrl, {
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

      // ✅ Refresh Details to show saved data/images correctly
      getDetails();

      // ✅ Store saved observations in memory so showSection knows data exists
      if (!window.allObservations) {
        window.allObservations = [];
      }
      if (!window.sectionWiseSno) {
        window.sectionWiseSno = {};
      }

      // Add observations to in-memory storage with section_id
      const sectionId = section.replace('.', '_');
      observations.forEach(obs => {
        obs.section_id = sectionId;
        // Remove duplicates for this S_no from the same section
        window.allObservations = window.allObservations.filter(o =>
          !(o.section_id === sectionId && o.S_no === obs.S_no)
        );
        window.allObservations.push(obs);
      });

      // Update sectionWiseSno mapping
      if (!window.sectionWiseSno[sectionId]) {
        window.sectionWiseSno[sectionId] = [];
      }
      observations.forEach(obs => {
        if (!window.sectionWiseSno[sectionId].includes(obs.S_no)) {
          window.sectionWiseSno[sectionId].push(obs.S_no);
        }
      });

      const getDetailsBtn = document.querySelector(`#get-details-btn`);
      const updateBtn = document.querySelector(`#update-btn`);

      if (saveBtn) saveBtn.style.display = 'none';
      if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
      if (updateBtn) {
        updateBtn.style.display = 'none';
        updateBtn.disabled = false;
      }

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
  console.log("Station Details Response from DB:", stationDetails);
  sessionStorage.setItem("stationDetails", JSON.stringify(stationDetails));

  const normalizedStationInfo = {
    stationId: stationDetails.station_id,
    stationName: stationDetails.station_name,
    zone: stationDetails.railway_zone || stationDetails.zone || "",
    division: stationDetails.division || stationDetails.railway_division || "",
    sectionName: stationDetails.section_name,
    initialDate: stationDetails.initial_date,
    updatedDate: stationDetails.updated_date
  };

  console.log("Normalized station Info to be stored:", normalizedStationInfo);

  sessionStorage.setItem("stationInfo", JSON.stringify(normalizedStationInfo));
  console.log("Stored in sessionStorage under 'stationInfo':", sessionStorage.getItem("stationInfo"));

  // Populate the form fields
  const stationIdInput = document.getElementById("station-id");
  const stationNameInput = document.getElementById("station-name");
  const zoneInput = document.getElementById("zone");
  const divisionInput = document.getElementById("division");
  const sectionNameInput = document.getElementById("section-name");
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
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (initialDateInput) {
    initialDateInput.value = normalizedStationInfo.initialDate || today;
    console.log("📅 initialDate set to:", initialDateInput.value);
  }

  if (updateDateInput) {
    // Current date should be the updated date when opening to edit
    updateDateInput.value = today;
    console.log("🕒 updatedDate set to today:", updateDateInput.value);
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
  // Deduplicate S_No list to prevent duplicate rows in UI
  const uniqueSno = [...new Set(sno)];

  if (filtered.length) {
    updateObservationsTable(sectionID, filtered, uniqueSno);
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

  // Check if the table already has rows (static template or previously rendered)
  const existingRows = tbody.querySelectorAll("tr");
  if (existingRows.length > 0) {
    console.log(`Update existing rows for section ${sectionID} instead of rebuilding.`);

    // Map observations by S_no for easy lookup
    const obsMap = {};
    observations.forEach(obs => { obsMap[obs.S_no] = obs; });

    existingRows.forEach(row => {
      // Identify S_no from the first cell
      const firstCell = row.cells[0];
      if (!firstCell) return;
      const sNo = firstCell.innerText.trim().split(' ')[0]; // Handle cases like "1.1 (button)"

      // If we have saved data for this S_no, update the UI
      if (obsMap[sNo]) {
        const p = obsMap[sNo];

        // Update Dropdown
        const select = row.querySelector("select.status-dropdown");
        if (select) {
          select.value = p.observation_status ? p.observation_status.trim() : 'Select';
          select.setAttribute('data-initial', select.value);
          highlightSelect(select);
        }

        // Update Remarks
        const textarea = row.querySelector("td.remarks textarea");
        if (textarea) {
          textarea.value = p.remarks || '';
          textarea.setAttribute('data-initial', textarea.value);
        }

        // Update Number Input if it exists (for checkEarthResistance/checkVoltage)
        const numberInput = row.querySelector("input[type='number']");
        if (numberInput && p.remarks) {
          const val = parseFloat(p.remarks);
          if (!isNaN(val)) {
            numberInput.value = val;
            numberInput.setAttribute('data-initial', val);
            if (select) {
              select.disabled = true;
              // Ensure Ok and Not Ok options are displayed, and Not Applicable is hidden
              const optNA = select.querySelector('option[value="Not Applicable"]');
              const optOk = select.querySelector('option[value="Ok"]');
              const optNotOk = select.querySelector('option[value="Not Ok"]');
              if (optNA) optNA.style.display = 'none';
              if (optOk) optOk.style.display = '';
              if (optNotOk) optNotOk.style.display = '';
            }
            if (textarea) {
              textarea.readOnly = true;
            }
          }
        }

        // Update Images
        // We need to find the image container. In static HTML, IDs might differ (row-411 vs rowId 4.1.1)
        // But the image container is usually inside the last cell.
        // Let's rely on the row structure or find container by ID pattern if possible.
        // Static HTML uses id="image-container-411" (numeric).
        // We can search for div[id^="image-container-"] within the row.
        const imgContainer = row.querySelector('div[id^="image-container-"]');
        if (imgContainer) {
          // Extract the numeric/string rowId suffix from the container ID
          const containerId = imgContainer.id;
          const rowIdPart = containerId.replace('image-container-', '');

          if (p.images && p.images.length > 0) {
            imgContainer.innerHTML = p.images.map((imgPath, idx) => `
                        <div class="image-container" style="position: relative; display: inline-block;">
                            <img id="captured-image-${rowIdPart}-${idx}" src="${imgPath}" alt="Uploaded Image" width="100" style="margin:5px;" onerror="console.error('Error loading image')">
                            <span style="position:absolute; top:0; right:0; cursor:pointer; color:red; font-weight:bold;" onclick="deleteImage(event, '${sectionID}', '${sNo}', '${imgPath}')">&times;</span>
                        </div>
                     `).join("");
          } else {
            imgContainer.innerHTML = "";
          }
        }

        // Handle Barcode (Section 2.0 specific)
        if (sectionID === "2_0") {
          const bcInput = row.querySelector("input[name='barcode_kavach_main_unit']");
          if (bcInput) {
            // Custom edited barcode logic
            let rowId = sNo; // Fallback
            // Try to guess match rowId used in static HTML? usually sNo
            if (window.editedBarcodes && window.editedBarcodes[rowId] !== undefined) {
              p.barcode_kavach_main_unit = window.editedBarcodes[rowId];
            }
            bcInput.value = p.barcode_kavach_main_unit || '';
            bcInput.setAttribute('data-initial', bcInput.value);
          }
        }
      }
    });
    return; // Done updating, skip rebuild
  }

  // Fallback: Rebuild from scratch (Original Data-Driven Logic)
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
      observation.barcode_kavach_main_unit = window.editedBarcodes[rowId];
    }

    const dropdownOptions = getDropdownOptions(S_no, observation.observation_status, sectionID);

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
    // Use a helper to decode any escaped HTML entities (like &lt;br&gt; becoming <br>)
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    let observationContent = decodeHTMLEntities(observation.observation_text || "N/A");
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
          value="${observation.barcode_kavach_main_unit || ''}"
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
  markDataAsUnsaved();
"
/>`;
    }

    const row = document.createElement("tr");
    row.setAttribute("data-sno", S_no);
    row.setAttribute("id", `row-${rowId}`);

    // Detect if this section has a "Requirement" column (usually 6 columns total)
    // Section 2.0 has 5 columns (no Requirement).
    const hasRequirement = (sectionID !== "2_0");

    // Logic to determine if it is a custom row (Section 2.0 and s_no > 1.25)
    let isCustomRow = false;
    if (sectionID === "2_0") {
      const parts = S_no.split('.');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > 25) {
          isCustomRow = true;
        }
      }
    }

    // Prepare S_No cell content
    let sNoContent = S_no;
    if (isCustomRow) {
      sNoContent += ` <button type="button" onclick="deleteRowTemplate(this, '${S_no}', '${sectionID}')" style="background: none; border: none; cursor: pointer; font-size: 14px;" title="Delete Row">🗑️</button>`;
    }

    row.innerHTML = `
      <td>${sNoContent}</td>
      <td class="observation_text">${observationContent}</td>
      ${hasRequirement ? `<td class="requirement_text">${observation.requirement_text || "N/A"}</td>` : ""}
      <td>
        <select name="status-dropdown" class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
          ${dropdownOptions}
        </select>
      </td>
      <td class="remarks">
        <textarea rows="2" cols="20" oninput="enableUpdateButton(); markDataAsUnsaved();">${observation.remarks || ""}</textarea>
      </td>
      <td>${imageUploadBlock}</td>
    `;
    // ❌ Skip appending the row if description is empty or "N/A"
    if (!observationContent || observationContent.trim() === "N/A") {
      console.warn(`❌ Skipping row ${S_no} due to invalid description`);
      return;
    }


    tbody.appendChild(row);

    // Initialize values and 'data-initial' tracking immediately
    const statusDropdown = row.querySelector(".status-dropdown");
    if (statusDropdown) {
      let valueToSet = observation.observation_status?.trim() || "Select";
      statusDropdown.value = valueToSet;
      statusDropdown.setAttribute('data-initial', valueToSet);
      highlightSelect(statusDropdown);
    }
    const remarksArea = row.querySelector(".remarks textarea");
    if (remarksArea) {
      const initialRemark = observation.remarks || "";
      remarksArea.value = initialRemark;
      remarksArea.setAttribute('data-initial', initialRemark);
    }
    const bcInput = row.querySelector("input[name='barcode_kavach_main_unit']");
    if (bcInput) {
      const initialBC = observation.barcode_kavach_main_unit || "";
      bcInput.value = initialBC;
      bcInput.setAttribute('data-initial', initialBC);
    }
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
        markDataAsUnsaved();

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
  console.log("markDataAsUnsaved called");
  unsavedChanges = true;
  // Enable all update buttons (handling potential multiple instances or IDs)
  const buttons = document.querySelectorAll("#update-btn, #update-button, .update-btn");
  console.log(`Found ${buttons.length} update buttons to enable.`);
  buttons.forEach(btn => {
    console.log("Enabling button:", btn.id);
    btn.disabled = false;
  });
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
  let stationId = document.getElementById("station-id").value.trim();
  let zone = document.getElementById("zone").value.trim();
  let division = document.getElementById("division").value.trim();
  let sectionName = document.getElementById("section-name").value.trim();


  if (!stationId || !zone || !division || !sectionName) {
    alert("Please fill in all the fields.");
    return;
  }

  console.log("📢 Fetching details for:", { stationId, zone, division, sectionName });

  // Replace jQuery $.ajax with native fetch
  const formData = new FormData();
  formData.append("station-id", stationId);
  formData.append("zone", zone);
  formData.append("division", division);
  formData.append("section-name", sectionName);

  fetch("generateReport", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(async function (response) {
      console.log("✅ Server Response:", response);

      if (!response.success) {
        console.warn("⚠️ No details found:", response.message);
        alert(response.message);
        return;
      }


      console.log("🚂 Station Details Found:", response.stationDetails);
      populateStationDetails(response.stationDetails);


      window.allObservations = response.observations;
      let sectionWiseSno = {};

      response.observations.forEach((observation) => {
        let sectionID = observation.section_id;
        if (!sectionWiseSno[sectionID]) {
          sectionWiseSno[sectionID] = [];
        }
        if (!sectionWiseSno[sectionID].includes(observation.S_no)) {
          sectionWiseSno[sectionID].push(observation.S_no);
        }
      });
      window.sectionWiseSno = sectionWiseSno;

      console.log("📌 Section-wise S_no mapping stored:", sectionWiseSno);

      Object.keys(sectionWiseSno).forEach((sectionID) => {
        const container = document.getElementById(`observations-section-${sectionID}`);
        if (container) {
          updateSections(response.observations, sectionID, sectionWiseSno[sectionID]);
        }
      });

      await checkAndHighlightSections(stationId, zone, division);

      // Logic to toggle Save vs Update buttons based on whether data exists for the ACTIVE subsection
      const saveBtn = document.getElementById('save-btn');
      const getDetailsBtn = document.getElementById('get-details-btn');
      const updateBtn = document.getElementById('update-btn');

      // Default state: Show Save, Hide Update
      if (saveBtn) saveBtn.style.display = 'inline-block';
      if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
      if (updateBtn) updateBtn.style.display = 'none';

      // Check if we have any observations for the CURRENT section
      // If we are in a subsection context (activeSubsection is global), check if *that* subsection has data.
      let hasDataForCurrentContext = false;

      if (typeof activeSubsection !== 'undefined' && activeSubsection) {
        // Check if any fetched observation belongs to this subsection
        hasDataForCurrentContext = response.observations.some(obs =>
          obs.S_no && String(obs.S_no).startsWith(activeSubsection)
        );
        console.log(`[getDetails] Checking data for subsection ${activeSubsection}: ${hasDataForCurrentContext}`);
      } else {
        // If no subsection active (main view), checking if *any* data returned suggests update mode is available
        // FIX: Check if data exists for the CURRENTLY VISIBLE section specifically.
        const visibleTable = document.querySelector('table[id^="observations-section-"]');
        if (visibleTable) {
          const currentSectionId = visibleTable.id.replace('observations-section-', '');
          hasDataForCurrentContext = response.observations.some(obs => obs.section_id === currentSectionId);
          console.log(`[getDetails] Checking data for section ${currentSectionId}: ${hasDataForCurrentContext}`);
        } else {
          // Fallback if we can't determine section (unlikely)
          if (response.observations && response.observations.length > 0) {
            hasDataForCurrentContext = true;
          }
        }
      }

      if (hasDataForCurrentContext) {
        if (saveBtn) saveBtn.style.display = 'none';
        if (getDetailsBtn) getDetailsBtn.style.display = 'none';
        if (updateBtn) {
          updateBtn.style.display = 'inline-block';
        }
      } else {
        if (saveBtn) saveBtn.style.display = 'none';
        if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
        if (updateBtn) updateBtn.style.display = 'none';
      }

      unsavedChanges = false;
    })
    .catch(error => {
      console.error("❌ Error fetching data from server:", error);
      alert("There was an error fetching the data.");
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
async function updateObservation(section, subsection, forceUpdate = false) {
  // Normalize section ID (ensure underscore for mapping)
  const mappingSectionId = section.replace('.', '_');

  // 1) Section mapping
  const sectionMapping = {
    "2_0": 0, "3_0": 1, "4_0": 2,
    "5_0": 3, "6_0": 4, "7_0": 5, "8_0": 6, "9_0": 7, "10_0": 8, "11_0": 9,
    "12_0": 10, "13_0": 11, "14_0": 12, "15_0": 13, "16_0": 14, "17_0": 15, "18_0": 16,
  };

  // 2) Section‐level fields
  const stationId = document.getElementById("station-id").value;
  const zone = document.getElementById("zone").value;
  const division = document.getElementById("division").value;
  const sectionName = document.getElementById("section-name").value;

  if (sectionMapping[mappingSectionId] === undefined) {
    console.error(`Invalid section provided: ${section} (mapped: ${mappingSectionId})`);
    alert("Invalid section provided.");
    return;
  }

  const sectionIndex = sectionMapping[mappingSectionId];

  // 3) Mandatory‐images check
  if (!validateMandatoryImages(section)) return;

  // 4) Build base FormData
  const formData = new FormData();
  formData.append("station-id", stationId);
  formData.append("station-name", document.getElementById("station-name").value);
  formData.append("initial-date", document.getElementById("initial-date").value);
  formData.append("zone", zone);
  formData.append("division", division);
  formData.append("section-name", sectionName);
  formData.append("updated-date", document.getElementById("updated-date").value);
  formData.append("section-id", section);
  formData.append("action", "update");
  formData.append("section_index", sectionIndex);

  // 5) Gather per-row observations
  const observations = [];
  let hasChanges = false;

  // Try both formats to find the table body/rows
  let rows = document.querySelectorAll(`#observations-section-${section} tbody tr`);
  if (rows.length === 0 && section.includes('_')) {
    const dotSection = section.replace('_', '.');
    rows = document.querySelectorAll(`#observations-section-${dotSection} tbody tr`);
  }
  if (rows.length === 0 && section.includes('.')) {
    const underSection = section.replace('.', '_');
    rows = document.querySelectorAll(`#observations-section-${underSection} tbody tr`);
  }

  for (const row of rows) {
    const rowId = row.id.replace("row-", "");
    // Stricter S_no extraction: keep only numbers and dots
    const rawSno = row.querySelector("td:nth-child(1)")?.innerText || "";
    const S_no = rawSno.split(/\s/)[0].trim(); // Take only the first part before any space/icon

    // If subsection is specified, only collect rows that belong to that subsection
    if (subsection && !S_no.startsWith(subsection)) continue;

    // 5a) Text, barcode (for 2_0), remarks, status
    let observationText = row.querySelector(".observation_text")?.textContent.trim() || "";
    const requirementText = row.querySelector(".requirement_text")?.textContent.trim() || "";

    if (section === "17_0") {
      const tagInput = row.querySelector("td:nth-child(2) input[type='text']");
      const tagVal = tagInput ? tagInput.value.trim() : "";
      observationText = tagVal ? `Tag_No: ${tagVal}` : "";
      if (tagVal) hasChanges = true;
    }
    const remarksArea = row.querySelector(".remarks textarea");
    const remarks = remarksArea?.value.trim() || "";
    const initialRemarks = remarksArea?.getAttribute('data-initial') || "";

    const statusDropdown = row.querySelector(".status-dropdown") || row.querySelector("select");
    const observationStatus = statusDropdown?.value || "";
    const initialStatus = statusDropdown?.getAttribute('data-initial') || "";

    const bcInput = row.querySelector("input[name='barcode_kavach_main_unit']");
    const barcodeValue = bcInput ? bcInput.value.trim().slice(-15) : "";
    const initialBarcode = bcInput ? bcInput.getAttribute('data-initial') || "" : "";

    // Check if anything changed in this row
    let rowChanged = false;
    if (String(observationStatus).trim() !== String(initialStatus).trim()) rowChanged = true;
    if (String(remarks).trim() !== String(initialRemarks).trim()) rowChanged = true;
    if (String(barcodeValue).trim() !== String(initialBarcode).trim()) rowChanged = true;

    console.log(`Row: ${S_no}`, {
      observationStatus,
      initialStatus,
      remarks,
      initialRemarks,
      barcodeValue,
      initialBarcode,
      rowChanged
    });

    // Set global hasChanges if this row has a modification
    if (rowChanged) hasChanges = true;

    // For backward compatibility/safety, also set hasChanges if status/remarks is non-empty
    // (though real change detection is better)
    // For backward compatibility/safety, also set hasChanges if status/remarks is non-empty
    // (though real change detection is better)
    if ((observationStatus && observationStatus !== "Select") || forceUpdate) {
      // If it's not "Select", we usually want to include it anyway to be safe
      console.log(`Row ${S_no} has valid status ${observationStatus}, forcing hasChanges=true`);
      hasChanges = true;
    }

    // Always include the row in the payload if it HAS some data,
    // but the global hasChanges depends on whether SOMETHING changed.
    // If forceUpdate is true, we should include the row even if status is 'Select' or empty, to ensure completeness if needed.
    // However, usually we skip completely empty rows. Let's keep the basic check but allow 'Select' if needed.
    if (!observationStatus && !remarks && !barcodeValue && !observationText) continue;

    // ... (gathering images) ...
    const existingPaths = [];
    const imgContainer = document.getElementById(`image-container-${rowId}`);
    if (imgContainer) {
      imgContainer.querySelectorAll("img").forEach(img => {
        // Skip base64 data URIs (previews of files to be uploaded)
        if (img.src.startsWith('data:')) return;

        // Normalize path: if it contains /uploads/, take that part.
        // Otherwise, use the src as is (though it might be full URL).
        let rel = img.src;
        if (rel.includes('/uploads/')) {
          rel = rel.substring(rel.indexOf('uploads/'));
        } else if (rel.includes('uploads/')) {
          rel = rel.substring(rel.indexOf('uploads/'));
        }

        existingPaths.push(rel);
      });
    }

    // 5c) Deleted images
    const deletedPaths = Array.from(deletedImagesMap[rowId] || []);
    if (deletedPaths.length > 0) hasChanges = true;

    // 5d) Upload new Files/Blobs from rowFiles map
    let uploadedPaths = [];
    const newFiles = rowFiles.get(rowId) || [];
    if (newFiles.length) {
      hasChanges = true;
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
      row_key: row.getAttribute("data-key"),
      observation_text: observationText,
      requirement_text: requirementText,
      barcode_kavach_main_unit: barcodeValue,
      remarks,
      observation_status: observationStatus,
      image_paths: allImages,
      deleted_images: deletedPaths
    });
  }

  // 6) Abort if no modifications
  if (!hasChanges) {
    alert("No changes detected. Modify at least one entry before updating.");
    return;
  }

  // 7) Append JSON payload
  console.log("Observations Payload:", observations);
  console.log("hasChanges:", hasChanges);
  formData.append("observations", JSON.stringify(observations));

  // Log all formData entries for debugging
  for (var pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  // 8) Submit update
  try {
    const resp = await fetch("updateObservations", { method: "POST", body: formData });
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error("Server returned non-JSON response"); }

    if (data.success) {
      alert("✅ Observations updated successfully!");
      // Force reload or UI update if needed
      // getDetails(); // Optional: Reload to reflect server state

      unsavedChanges = false;
      // Disable update button after successful save
      const btn = document.getElementById('update-btn') || document.getElementById('update-button');
      // if (btn) btn.disabled = true; // Keep button enabled to allow updates at any time
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
// Build the dropdown options
function getDropdownOptions(sno, observationStatus, sectionID = null) {
  let isSelected = !observationStatus || observationStatus.trim() === "" || observationStatus.trim() === "Select";
  let defaultOption = `<option value="Select" ${isSelected ? "selected" : ""}>Select</option>`;

  if (!sno) {
    console.error("Invalid S_no value:", sno);
    return defaultOption;
  }
  const sNoStr = String(sno).trim().toLowerCase();

  // 1. Explicitly defined options for standard rows
  // We check this first to honor specific mappings
  const specificOptions = {
    "1.38,1.40,1.41,1.42,1.43,1.45,1.46,1.47,1.48,1.49,1.50,1.51,1.52,1.53,1.54,1.55,1.56,1.57,1.58,1.59,1.60,1.61,1.62,1.63,1.64": ["Matching", "Not Matching", "Verified", "Not Verified", "Not Installed", "Not Applicable"],
    "1.39,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,1.10,1.11,1.12,1.13,1.14,1.15,1.16,1.17,1.18,1.19,1.20,1.21,1.22,1.23,1.24,1.25,1.26,1.27,1.28,1.29,1.30,1.31,1.32,1.33,1.34,1.35,1.36,1.37,1.65,1.66,1.67,1.68": ["Matching", "Not Matching", "Verified", "Not Verified", "Not Installed", "Not Applicable"],
    "3.1,2.1": ["Ok", "Not Ok", "Not Applicable"],
    "5.1.2,5.1.4,5.1.6,9.1,9.2,9.2.1,9.4": ["Ok", "Not Ok","Not Verified"],
    "8.2,8.4,8.7,6.1.2,6.1.4,6.1.5,6.1.6,6.1.7,6.1.8,6.1.9,6.1.11,4.1.4,4.1.5,4.1.7,4.1.8,4.2.4,4.2.5,7.2,7.3,7.4,7.7,7.8,7.9,5.2.4,5.2.6,5.2.7,5.2.8,5.3.2,5.3.3,5.3.4,5.4.5,5.5.4,13.1": ["Ok", "Not Ok", "Not Applicable","Not Verified"],
    "10.1,10.3,10.4,10.5,10.6": ["Ok", "Not Ok", "Not Applicable", "Applicable", "Not Verified"],
    "5.5.1,4.1.1,4.1.2,4.2.1,5.1.1,5.1.5,5.2.1,5.2.2,5.3.1,5.4.1,5.4.6,6.1.1,6.2.1,7.1,8.1,11.2,12.1,12.2":["Ok", "Not Ok", "Not Applicable", "Not Verified","Not Installed"],
    "5.5.2,5.5.3,4.1.3,4.1.6,4.2.2,4.2.3,5.1.3,5.2.3,5.3.5,5.4.2,5.4.3,5.4.4,6.1.3,6.1.10,7.5,7.6,8.3,8.6,10.2,5.2.5":["Ok", "Not Ok", "Not Applicable", "Not Verified","Not Connected"],
    "5.1.2":["Ok", "Not Ok", "Not Applicable", "Not Verified","Not Installed","Not Connected"],
    "5.5.5":["Available", "Not Available", "Available with Comments", "Not Verified","Not Applicable"],
    "6.2.2,7.10,8.5,9.3,11.1": ["Available", "Not Available", "Not Applicable","Not Verified"],
    "5.2.9": ["Available", "Not Available", "Not Applicable","Not Verified","Not deployed"],
    "12.3": ["Available", "Not Available", "Not Applicable"],
    "1.44": ["Matching", "Not Matching", "Verified", "Not Verified", "Not Installed", "Not Applicable"],
    "12.4": ["Ok", "Not Ok", "Not Applicable", "Not Verified","Not Installed","Not Completed"],
  };


  for (const [key, values] of Object.entries(specificOptions)) {
    const keys = key.split(",").map(k => k.trim().toLowerCase());
    if (keys.includes(sNoStr)) {
      const matchedOptions = values.map(value =>
        `<option value="${value}" ${observationStatus?.trim().toLowerCase() === value.toLowerCase() ? "selected" : ""}>${value}</option>`
      ).join("\n");
      return defaultOption + "\n" + matchedOptions;
    }
  }

  // 2. Fallback Logic: Prioritize sectionID if available, else use sno prefix
  let options = ["Yes", "No"]; // Default to Yes/No

  if (sectionID) {
    // Label 1.0 is Section "2_0"
    if (sectionID === "2_0" || sectionID === "2.0") {
      options = ["Matching", "Not Matching", "Verified", "Not Verified", "Not Installed", "Not Applicable"];
    }
  } else {
    // Fallback to S_no prefix if sectionID is not provided
    const parts = sNoStr.split('.');
    if (parts[0] === "1") {
      options = ["Matching", "Not Matching", "Verified", "Not Verified", "Not Installed", "Not Applicable"];
    }
  }

  const optionsHTML = options.map(value =>
    `<option value="${value}" ${observationStatus?.trim().toLowerCase() === value.toLowerCase() ? "selected" : ""}>${value}</option>`
  ).join("\n");

  return defaultOption + "\n" + optionsHTML;
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
    let stream = null;

    // 1. If asking for environment (back), try to force it with 'exact' first
    if (currentCamera === 'environment') {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
          audio: false
        });
        console.log("🎥 Camera started with exact environment mode.");
      } catch (e) {
        console.warn("⚠️ Exact environment mode failed, falling back to ideal/default...", e);
      }
    }

    // 2. If 'exact' failed or we want 'user' (front), use standard constraints
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentCamera },
        audio: false
      });
      console.log(`🎥 Camera started (Fallback/Normal Mode: ${currentCamera})`);
    }

    video.srcObject = stream;
    cameraContainer.style.display = "block";
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

        console.log(`✅ Image uploaded: ${imageUrl}`);
        markDataAsUnsaved(); // Enable update button
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
  markDataAsUnsaved();
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
        markDataAsUnsaved();
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



const statusColors = {
  "Present": "green", "Matching": "green", "Found Ok": "green", "Implemented": "green",
  "Not Applicable": "green", "Applicable": "green", "Fixed": "Green", "Connected": "green", "Routing done": "green",
  "Verified": "green", "Done": "green", "Ok": "green", "Earth Connected": "green",
  "Functioning": "green", "Identification Done": "green", "Cable ties implemented": "green",
  "Joined": "Green", "Installed": "green", "Available": "green", "Actual Rating:": "green",
  "Compliance": "green", "Yes": "green",

  "Not Present": "red", "Not Matching": "red", "Not Installed": "red", "Found Not Ok": "red",
  "Not Verified": "red", "Not Fixed": "red", "Voltage found not Ok": "red",
  "Not Done": "red", "Routing Not done": "red", "Not Ok": "red", "PCCL Not Done": "red",
  "Earth not connected": "red", "Not deployed": "red", "Identification Not Done": "red",
  "Cable ties not implemented": "red", "Not Joined": "red", "Non-Compliance": "red", "No": "red",
  "Not Available": "red", "Not Completed": "red", "Available with Comments": "red", "Not Connected": "red"
};

function highlightSelect(selectElement) {
  try {
    if (!selectElement) return;
    // console.log("highlightSelect called", selectElement.value); // optimize log

    const color = statusColors[selectElement.value] || "";
    selectElement.style.backgroundColor = color;

  } catch (e) {
    console.error("highlightSelect error:", e);
  }
}

function saveOemSelection(val) {
  const stationIdInput = document.getElementById('station-id');
  const stationId = stationIdInput ? (stationIdInput.value || stationIdInput.textContent || '').trim() : '';
  if (val) {
    localStorage.setItem('oem_name_5_5', val);
    if (stationId) {
      localStorage.setItem(`oem_name_5_5_${stationId}`, val);
    }
  }
}

// Function to mark entire section as Not Applicable
function markSectionAsNotApplicable(sectionId, action) {
  if (action === "mark") {
    const tbody = document.querySelector(`#observations-tbody-${sectionId}`);
    if (!tbody) return;

    const selects = tbody.querySelectorAll(".status-dropdown");
    selects.forEach(select => {
      select.value = "Not Applicable";
      highlightSelect(select);
    });
    markDataAsUnsaved();

    // Reset dropdown after action
    const dropdown = document.getElementById(`section-na-dropdown-${sectionId}`);
    if (dropdown) {
      setTimeout(() => {
        dropdown.value = "";
      }, 100);
    }
  } else if (action === "clear") {
    const tbody = document.querySelector(`#observations-tbody-${sectionId}`);
    if (!tbody) return;

    const selects = tbody.querySelectorAll(".status-dropdown");
    selects.forEach(select => {
      select.value = "Select";
      highlightSelect(select);
    });
    markDataAsUnsaved();

    // Reset dropdown after action
    const dropdown = document.getElementById(`section-na-dropdown-${sectionId}`);
    if (dropdown) {
      setTimeout(() => {
        dropdown.value = "";
      }, 100);
    }
  }
}

const deletedImagesMap = {}; // Tracks deleted image URLs for each observationID

// 1) define per‑section lists of S_no that require an image
const mandatoryImageRowsBySection = {
  "3_0": [], // Section 2.0 Building
  "4_0": ["3.1", "3.5", "3.7", "3.8", "3.11"], // Section 3.0 Tower (includes 3.1)
  // "5_0": ["4.1.1", "4.1.2","4.1.3", "4.2.1","4.2.2","4.2.3","4.2.5"], // Section 4.0 Power Supply (matches 4.1.x and 4.2.x)
  //"6_0": ["5.2", "5.3", "5.4", "5.5"], // Section 5.0 Kavach Equipment (matches 5.2.x, 5.3.x, 5.4.x, etc.)
 // "7_0": ["6.1.2", "6.1.3", "6.1.6", "6.1.8", "6.1.9", "6.1.10", "6.1.11"], // Section 6.0 RF Communication (matches specified 6.1.x and all 6.2.x)
  "8_0": ["7.1", "7.3"] // Section 7.0 OFC Networking rack
};

function validateMandatoryImages(sectionID) {
  const mandatory = mandatoryImageRowsBySection[sectionID] || [];
  const tbody = document.querySelector(`#observations-tbody-${sectionID}`);
  const missing = [];

  if (!tbody) return true;

  tbody.querySelectorAll("tr").forEach(tr => {
    const sno = tr.cells[0]?.textContent.trim();
    // Check if sno matches any mandatory item exactly or as a subsection prefix
    const isMandatory = mandatory.some(m => sno === m || sno.startsWith(m + "."));
    if (!isMandatory) return;       // not one of the must‑have rows

    const sel = tr.querySelector("select");
    if (!sel) return;
    const val = sel.value;
    // Skip if default "Select", "Not Applicable", or any status styled in red
    const isRedStatus = statusColors[val] && statusColors[val].toLowerCase() === "red";
    if (val === "Select" || val === "Not Applicable" || isRedStatus) return;

    // IMAGE IS ALWAYS IN THE LAST CELL
    const imgCell = tr.cells[tr.cells.length - 1];
    const imgs = imgCell?.querySelectorAll("img") || [];

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
function addRowSection18() {
  const sectionId = "18_0";
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
      <td class="SA_tag_no" style="width: 20%;"><input type="text" id="SA_tag-no-${rowId}" placeholder="enter SA tag no" style="width: 100%; box-sizing: border-box;"></td>
      <td class="SF_tag_no" style="width: 20%;"><input type="text" id="SF_tag-no-${rowId}" placeholder="enter SF tag no" style="width: 100%; box-sizing: border-box;"></td>
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



// Function to ensure only one checkbox is selected at a time for a given group
function onlyOneChecked(checkbox, groupClass) {
  const checkboxes = document.querySelectorAll(`.${groupClass}`);
  const checkedCount = Array.from(checkboxes).filter((box) => box.checked).length;
  if (checkedCount > 1) {
    checkboxes.forEach((box) => {
      if (box !== checkbox) box.checked = false;
    });
  }
}

// Render a custom row (used by addRow and loadCustomRows)
function renderCustomRow(sectionId, s_no, description, templateId) {
  const tbodyId = `observations-tbody-${sectionId.replace('.', '_')}`;
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  // Check if row already exists to avoid duplicates
  const existingRowId = `row-${s_no}`;
  if (document.getElementById(existingRowId)) {
    console.log(`Row ${s_no} already exists, skipping duplicate.`);
    return;
  }

  const tr = document.createElement("tr");
  tr.id = `row-${s_no}`; // Keep dots to match updateObservationsTable
  tr.className = "custom-row"; // Marker class
  if (templateId) {
      tr.setAttribute("data-key", `template_row_${templateId}`);
  }

  // Small delete icon in S_No column
  tr.innerHTML = `
      <td>
        ${s_no} <button type="button" onclick="deleteRowTemplate(this, '${s_no}', '${sectionId}')" style="background: none; border: none; cursor: pointer; font-size: 14px;" title="Delete Row">🗑️</button>
      </td>
      <td class="observation_text">${description}<br>
        <input type="text" name="barcode_kavach_main_unit" placeholder="Scan Barcode" 
               style="width: 180px; padding: 5px; font-size: 14px;" 
               oninput="toggleNotInstalledOption(this); markDataAsUnsaved();">
      </td>
      <td>
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
          ${(function () {
      const sId = String(sectionId).replace('_', '.');
      // Label 1.0 is Section 2.0 (but ID passed is often "2_0")
      if (sId.startsWith('1.') || sId === "2_0" || sId === "2.0") {
        return `
                      <option value="Select">Select</option>
                      <option value="Matching">Matching</option>
                      <option value="Not Matching">Not Matching</option>
                      <option value="Verified">Verified</option>
                      <option value="Not Verified">Not Verified</option>
                      <option value="Not Installed">Not Installed</option>
                      <option value="Not Applicable">Not Applicable</option>
                  `;
      } else {
        return `
                      <option value="Select">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not Applicable">Not Applicable</option>
                  `;
      }
    })()}
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20" oninput="markDataAsUnsaved();"></textarea>
      </td>
      <td>
        <button class="add-image" onclick="showUploadOptions('${s_no}')">Add Image</button>
        <div class="upload-options" id="upload-options-${s_no}" style="display: none;">
          <button class="add-image" onclick="startCamera('${s_no}')">Camera</button>
          <label for="file-input-${s_no}" class="upload-label">Upload from Device</label>
          <input type="file" id="file-input-${s_no}" accept="image/*" multiple onchange="displayImages(this, '${s_no}')">
        </div>
        <div id="image-container-${s_no}"></div>
        <div id="camera-container-${s_no}" style="display: none;">
          <video id="camera-${s_no}" width="100%" height="auto" autoplay></video>
          <button class="add-image" onclick="captureImage('${s_no}')">Capture Image</button>
          <button class="add-image" onclick="stopCamera('${s_no}')">Stop Camera</button>
          <button class="reverse-camera" onclick="switchCamera('${s_no}')">🔄 Switch Camera</button>
          <canvas id="canvas-${s_no}" style="display: none;"></canvas>
        </div>
      </td>
    `;
  tbody.appendChild(tr);
}

// Add new row for section 2.0 with password protection and PERSISTENCE
async function addRowWithPassword(sectionId) {
  const password = prompt("Please enter password to add a new PERMANENT row:");
  if (password !== "hbl@123") {
    alert("Incorrect password!");
    return;
  }

  const unitName = prompt("Enter Unit Name / Aspect:");
  if (!unitName) return;

  const tbodyId = `observations-tbody-${sectionId.replace('.', '_')}`;
  const tbody = document.getElementById(tbodyId);

  // Calculate next S_No
  let nextSno = "1.26";
  if (tbody) {
    const rows = Array.from(tbody.querySelectorAll("tr"));
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      const lastSnoStr = lastRow.cells[0].innerText.trim().replace("🗑️", ""); // Remove icon if present
      const lastSnoParts = lastSnoStr.split(".");
      if (lastSnoParts.length === 2) {
        const lastNum = parseInt(lastSnoParts[1]);
        if (!isNaN(lastNum)) {
          nextSno = `${lastSnoParts[0]}.${lastNum + 1}`;
        }
      }
    }
  }

  // Save to backend
  const formData = new FormData();
  formData.append("action", "add");
  formData.append("section_id", sectionId);
  formData.append("s_no", nextSno);
  formData.append("description", unitName);

  try {
    const resp = await fetch("manage_row_templates", { method: "POST", body: formData });
    const res = await resp.json();
    if (res.success) {
      renderCustomRow(sectionId, nextSno, unitName, res.id);
      alert("Row added permanently.");
    } else {
      alert("Failed to save row: " + res.message);
    }
  } catch (e) {
    console.error(e);
    alert("Error saving row");
  }
}

async function checkVoltage(input, rowId) {

  let value = parseFloat(input.value);
  let dropdown = document.getElementById("status-" + rowId);
  let remarks = document.getElementById("remarks-" + rowId);

  if (!isNaN(value)) {
    // Hide Not Applicable, show Ok and Not Ok
    dropdown.querySelector('option[value="Not Applicable"]').style.display = 'none';
    dropdown.querySelector('option[value="Ok"]').style.display = '';
    dropdown.querySelector('option[value="Not Ok"]').style.display = '';

    if (value >= 22.8 && value <= 25.2) {
      dropdown.value = "Ok";
    } else {
      dropdown.value = "Not Ok";
    }
    remarks.value = value + " VDC"
    remarks.readOnly = true;
    dropdown.disabled = true;
  } else {
    // Show Not Applicable, hide Ok and Not Ok
    dropdown.querySelector('option[value="Not Applicable"]').style.display = '';
    dropdown.querySelector('option[value="Ok"]').style.display = 'none';
    dropdown.querySelector('option[value="Not Ok"]').style.display = 'none';

    dropdown.value = "Select";
    remarks.value = ""
    remarks.readOnly = false
    dropdown.disabled = false;
  }
  highlightSelect(dropdown);
  markDataAsUnsaved();

}

async function checkEarthResistance(input, rowId) {
  let value = parseFloat(input.value);
  let dropdown = document.getElementById("status-" + rowId);
  let remarks = document.getElementById("remarks-" + rowId);

  if (!isNaN(value)) {
    // Hide Not Applicable, show Ok and Not Ok
    dropdown.querySelector('option[value="Not Applicable"]').style.display = 'none';
    dropdown.querySelector('option[value="Ok"]').style.display = '';
    dropdown.querySelector('option[value="Not Ok"]').style.display = '';

    const limit = (rowId === 10120) ? 2 : 1;
    if (value <= limit) {
      dropdown.value = "Ok";
    } else {
      dropdown.value = "Not Ok";
    }

    remarks.value = value + " Ohm";

    remarks.readOnly = true;
    dropdown.disabled = true;
  } else {
    // Show Not Applicable, hide Ok and Not Ok
    dropdown.querySelector('option[value="Not Applicable"]').style.display = '';
    dropdown.querySelector('option[value="Ok"]').style.display = 'none';
    dropdown.querySelector('option[value="Not Ok"]').style.display = 'none';
    dropdown.value = "Select";
    remarks.value = "";
    remarks.readOnly = false;
    dropdown.disabled = false;
  }

  // Keep existing behavior
  highlightSelect(dropdown);
  markDataAsUnsaved();
}

async function deleteRowTemplate(span, s_no, sectionId) {
  const password = prompt("Enter password to DELETE this permanent row:");
  if (password !== "hbl@123") return;

  if (!confirm("Are you sure? This will remove the row for all future reports.")) return;

  const formData = new FormData();
  formData.append("action", "delete");
  formData.append("section_id", sectionId);
  formData.append("s_no", s_no);

  try {
    const resp = await fetch("manage_row_templates", { method: "POST", body: formData });
    const res = await resp.json();
    if (res.success) {
      span.closest("tr").remove();
      alert("Row deleted permanently.");
    } else {
      alert("Failed to delete: " + res.message);
    }
  } catch (e) {
    alert("Error deleting");
  }
}

// Load custom rows for a section
async function loadCustomRows(sectionId) {
  const formData = new FormData();
  formData.append("action", "fetch");
  formData.append("section_id", sectionId);

  try {
    const resp = await fetch("manage_row_templates", { method: "POST", body: formData });
    const res = await resp.json();
    if (res.success && res.data) {
      res.data.forEach(row => {
        // Check if row already exists to avoid duplication
        const existingRowId = `row-${row.s_no}`;
        if (!document.getElementById(existingRowId)) {
          renderCustomRow(sectionId, row.s_no, row.description, row.id);
        }
      });

      // Re-run updateSections to populate the newly added custom rows with any saved data
      if (window.allObservations && window.allObservations.length > 0) {
        let renderSectionId = sectionId.replace('.', '_');
        if (window.sectionWiseSno && window.sectionWiseSno[renderSectionId]) {
          updateSections(window.allObservations, renderSectionId, window.sectionWiseSno[renderSectionId]);
        }
      }
    }
  } catch (e) {
    console.error("Error loading custom rows", e);
  }
}

/* Old delete function removed */

function markDataAsUnsaved() {
  unsavedChanges = true;
}







// Function to set entire section as Not Applicable
function setSectionNA(tbodyId) {
  // Add confirmation dialog
  if (!confirm("Are you sure you want to mark the entire section as 'Not Applicable'?")) {
    return;
  }

  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const selects = tbody.querySelectorAll('.status-dropdown');
  let count = 0;
  selects.forEach(select => {
    // Check if 'Not Applicable' is a valid option in this select
    let hasNA = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === "Not Applicable") {
        hasNA = true;
        break;
      }
    }

    if (hasNA) {
      select.value = "Not Applicable";
      highlightSelect(select);
      count++;
    }
  });

  if (count > 0) {
    markDataAsUnsaved();
    alert("All " + count + " observations in this section have been marked as 'Not Applicable'.");
  } else {
    alert("No applicable fields found to update.");
  }
}

function showLoader(show) {
  let loader = document.getElementById("loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";

    loader.innerHTML = `
      <div class="loader-box">
        <div class="spinner"></div>
        <p>Checking for updates...</p>
      </div>
    `;

    document.body.appendChild(loader);
  }

  loader.style.display = show ? "flex" : "none";
}
function showMessage(msg) {
  let msgBox = document.getElementById("messageBox");

  if (!msgBox) {
    msgBox = document.createElement("div");
    msgBox.id = "messageBox";

    document.body.appendChild(msgBox);
  }

  msgBox.innerHTML = `<div class="message-content">${msg}</div>`;
  msgBox.style.display = "flex";

  setTimeout(() => {
    msgBox.style.display = "none";
  }, 2000);
}
async function checkForUpdates() {

  if (!navigator.onLine) {
    showMessage("No internet Connection.");
    return;
  }

  showLoader(true);
  try {
    const res = await fetch("update_version");
    const data = await res.json();

    showLoader(false);
    if (data.status === "updated") {

      showMessage("Software updated successfully");
      setTimeout(() => location.reload(), 1500);
    }
    else if (data.status === "uptodate") {
      showMessage("Already upto Date");
    }
    else {
      console.log(data); // 👈 IMPORTANT
      showMessage("Update Failed: " + (data.step || ""));
    }
  }
  catch (err) {
    showLoader(false);
    showMessage("Error connecting to server")
  }


}

// Automatically check for updates when internet connection is restored
window.addEventListener('online', checkForUpdates);

// Also check immediately when the page loads if already online
if (navigator.onLine) {
  checkForUpdates();
 }


window.addEventListener('load', function () { fetch('sync_structure').then(res => res.text()).then(data => console.log('Structure Sync:', data)); });
