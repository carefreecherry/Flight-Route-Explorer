  // Load CSV file
  function loadCSV(filename, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback(xhr.responseText);
        } else {
          console.error('Failed to load CSV file: ' + filename);
        }
      }
    };
    xhr.open('GET', filename, true);
    xhr.send(null);
  }

  // Function to filter dropdown options based on search input
  function filterDropdown() {
    var input, filter, dropdown, items, item, i, txtValue;
    input = document.querySelector(".search-input");
    filter = input.value.toUpperCase();
    dropdown = document.querySelector("#dropdown-list");
    items = dropdown.querySelectorAll(".dropdown-list-item");
    for (i = 0; i < items.length; i++) {
      item = items[i];
      txtValue = item.textContent || item.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    }
    dropdown.style.display = "block";
  }

  // Function to handle option selection
  function selectOption(option) {
    var input = document.querySelector(".search-input");
    input.value = option.textContent;
    closeDropdown();
  }

  // Function to close the dropdown
  function closeDropdown() {
    var dropdown = document.querySelector("#dropdown-list");
    dropdown.style.display = "none";
  }

  // Callback function to process CSV data
  function processCSV(csvData) {
    var lines = csvData.split('\n');
    var dropdownList = document.querySelector("#dropdown-list");
    dropdownList.innerHTML = ''; // Clear existing content
    for (var i = 1; i < lines.length; i++) { // Skip header row
      var line = lines[i].trim();
      if (line) {
        var columns = line.split(',');
        var option = document.createElement('div');
        option.className = 'dropdown-list-item';
        option.textContent = columns[1].trim(); // "name" column
        option.onclick = function() {
          selectOption(this);
        };
        dropdownList.appendChild(option);
      }
    }
  }

  // Load CSV file and process it
  loadCSV('/static/airports.csv', processCSV);