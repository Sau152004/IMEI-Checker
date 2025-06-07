  const imeiForm = document.getElementById('imeiForm');
  const imeiInput = document.getElementById('imei');
  const imeiError = document.getElementById('imeiError');
  const resultsDiv = document.getElementById('results');
  const imeiResults = document.getElementById('imeiResults');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  const historyList = document.getElementById('historyList');
  let data = {};

  // Real-time validation
  imeiInput.addEventListener('input', () => {
    if (imeiInput.value.length === 15) {
      validateIMEIFormat(imeiInput.value);
    } else {
      hideError();
    }
  });

  // Form submission
  imeiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultsDiv.classList.add('hidden');
    const imei = imeiInput.value.trim();
    
    if (!validateIMEIFormat(imei)) {
      return;
    }
    
    showLoading(true);
    
    try {
      hideError();
      fetch('/data.json')
     .then((res) => res.json())
     .then((json) => {
      data = json;
      console.log(data[imei]);
      displayResults(data[imei]);

      
      saveToHistory(imei, data[imei]);
      renderHistory();

     })
  .catch((err) => {
    console.error('Failed to load data.json:', err);
  });

    } catch (error) {
      showError('An error occurred. Please try again.');
    } finally {
      showLoading(false);
    }
  });

  // Helper functions
  function validateIMEIFormat(imei) {
    if (imei.length !== 15 || !/^\d+$/.test(imei)) {
      showError('IMEI must be exactly 15 digits');
      return false;
    }
    return true;
  }

  function showError(message) {
    imeiError.textContent = message;
    imeiError.classList.remove('hidden');
    imeiInput.classList.add('border-red-500');
    imeiInput.classList.remove('border-gray-600');
  }

  function hideError() {
    imeiError.classList.add('hidden');
    imeiInput.classList.remove('border-red-500');
    imeiInput.classList.add('border-gray-600');
  }

  function showLoading(show) {
    if (show) {
      btnText.textContent = 'Checking...';
      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
    } else {
      btnText.textContent = 'Check IMEI';
      spinner.classList.add('hidden');
      submitBtn.disabled = false;
    }
  }

  function displayResults(info) {
    resultsDiv.classList.remove('hidden');
    imeiResults.innerHTML = `
      <div class="space-y-4">
        <div>
          <p class="text-gray-400">Manufacturer</p>
          <p class="text-lg font-medium">${info?.manufacturer || "N/A"}</p>
        </div>
        <div>
          <p class="text-gray-400">Model</p>
          <p class="text-lg font-medium">${info?.model || "N/A"}</p>
        </div>
        <div>
           <p class="text-gray-400">TAC</p>
           <p class="font-mono">${info?.tac || "N/A"}</p>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <p class="text-gray-400">Serial Number</p>
          <p class="font-mono">${info?.serialNumber || "N/A"}</p>
        </div>
        <div>
          <p class="text-gray-400">Check Digit</p>
          <p class="font-mono">${info?.checkDigit || "N/A"}</p>
        </div>
        <div>
          <p class="text-gray-400">Status</p>
           <p class="font-mono">${info? "Valid IMEI" : "Invalid IMEI"}</p>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', renderHistory);


  function saveToHistory(imei, info) {
    console.log("info--> ",info)
  const existingHistory = JSON.parse(localStorage.getItem('imeiHistory')) || [];
  const newEntry = {
    imei,
    deviceInfo: info,
    timestamp: new Date().toISOString()
  };
  const updatedHistory = [newEntry, ...existingHistory].slice(0, 10);
  localStorage.setItem('imeiHistory', JSON.stringify(updatedHistory));
}

function renderHistory() {
  const historyList = document.getElementById('historyList'); 
  const historyData = JSON.parse(localStorage.getItem('imeiHistory')) || [];

  if (!historyData.length) {
    historyList.innerHTML = '<p class="text-gray-400">No recent checks found.</p>';
    return;
  }

  historyList.innerHTML = 
  `<h2 class="mb-2 text-lg font-bold">Recent History:</h2>
  <div class="flex flex-col space-y-4">
  ${historyData.map(check => `
    <div class="p-6 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-lg">
      <div class="flex justify-between items-center gap-4 space-x-4">
        <span class="font-mono">${check?.imei}</span>
        <span class="text-sm text-gray-400">${new Date(check.timestamp).toLocaleString()}</span>
      </div>
      <div class="mt-2 text-sm">
        ${check?.deviceInfo?.manufacturer || "N/A"} ${check?.deviceInfo?.model || "N/A"}
      </div>
    </div>
  `).join('')}
  </div>`
}

