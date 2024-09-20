import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const addTaxPayerForm = document.getElementById('addTaxPayerForm');
  const searchButton = document.getElementById('searchButton');
  const taxPayerList = document.getElementById('taxPayerList');
  const searchResult = document.getElementById('searchResult');
  const addMessage = document.getElementById('addMessage');
  const nameSearch = document.getElementById('nameSearch');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');

  let currentPage = 1;
  const itemsPerPage = 10;
  let totalItems = 0;

  // Function to display all tax payers
  async function displayAllTaxPayers(page = 1) {
    const start = (page - 1) * itemsPerPage;
    const { items: taxPayers, total } = await backend.getAllTaxPayers(start, itemsPerPage);
    totalItems = total;
    
    taxPayerList.innerHTML = taxPayers.map(tp => `
      <div class="tax-payer">
        <p><i class="fas fa-id-card"></i> <strong>TID:</strong> ${tp.tid}</p>
        <p><i class="fas fa-user"></i> <strong>Name:</strong> ${tp.firstName} ${tp.lastName}</p>
        <p><i class="fas fa-home"></i> <strong>Address:</strong> ${tp.address}</p>
      </div>
    `).join('');

    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayAllTaxPayers(currentPage);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayAllTaxPayers(currentPage);
    }
  });

  // Add new tax payer
  addTaxPayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = document.getElementById('tid').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    try {
      const result = await backend.addTaxPayer(tid, firstName, lastName, address);
      if ('ok' in result) {
        addMessage.textContent = 'TaxPayer added successfully!';
        addMessage.className = 'message success';
        addTaxPayerForm.reset();
        displayAllTaxPayers();
      } else {
        addMessage.textContent = result.err;
        addMessage.className = 'message error';
      }
    } catch (error) {
      addMessage.textContent = 'An error occurred. Please try again.';
      addMessage.className = 'message error';
    }

    setTimeout(() => {
      addMessage.textContent = '';
      addMessage.className = 'message';
    }, 3000);
  });

  // Search for a tax payer
  searchButton.addEventListener('click', async () => {
    const searchTid = document.getElementById('searchTid').value;
    try {
      const result = await backend.searchTaxPayer(searchTid);
      if ('ok' in result) {
        const tp = result.ok;
        searchResult.innerHTML = `
          <div class="tax-payer">
            <p><i class="fas fa-id-card"></i> <strong>TID:</strong> ${tp.tid}</p>
            <p><i class="fas fa-user"></i> <strong>Name:</strong> ${tp.firstName} ${tp.lastName}</p>
            <p><i class="fas fa-home"></i> <strong>Address:</strong> ${tp.address}</p>
          </div>
        `;
      } else {
        searchResult.innerHTML = `<p class="error"><i class="fas fa-exclamation-circle"></i> ${result.err}</p>`;
      }
    } catch (error) {
      searchResult.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> An error occurred. Please try again.</p>';
    }
  });

  // Search by name
  nameSearch.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length >= 2) {
      const results = await backend.searchTaxPayersByName(query);
      taxPayerList.innerHTML = results.map(tp => `
        <div class="tax-payer">
          <p><i class="fas fa-id-card"></i> <strong>TID:</strong> ${tp.tid}</p>
          <p><i class="fas fa-user"></i> <strong>Name:</strong> ${tp.firstName} ${tp.lastName}</p>
          <p><i class="fas fa-home"></i> <strong>Address:</strong> ${tp.address}</p>
        </div>
      `).join('');
    } else if (query.length === 0) {
      displayAllTaxPayers();
    }
  });

  // Initial display of all tax payers
  displayAllTaxPayers();
});
