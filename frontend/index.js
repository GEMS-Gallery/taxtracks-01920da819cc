import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const addTaxPayerForm = document.getElementById('addTaxPayerForm');
  const searchButton = document.getElementById('searchButton');
  const taxPayerList = document.getElementById('taxPayerList');
  const searchResult = document.getElementById('searchResult');

  // Function to display all tax payers
  async function displayAllTaxPayers() {
    const taxPayers = await backend.getAllTaxPayers();
    taxPayerList.innerHTML = taxPayers.map(tp => `
      <div class="tax-payer">
        <p><i class="fas fa-id-card"></i> <strong>TID:</strong> ${tp.tid}</p>
        <p><i class="fas fa-user"></i> <strong>Name:</strong> ${tp.firstName} ${tp.lastName}</p>
        <p><i class="fas fa-home"></i> <strong>Address:</strong> ${tp.address}</p>
      </div>
    `).join('');
  }

  // Add new tax payer
  addTaxPayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = document.getElementById('tid').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    await backend.addTaxPayer(tid, firstName, lastName, address);
    addTaxPayerForm.reset();
    displayAllTaxPayers();
  });

  // Search for a tax payer
  searchButton.addEventListener('click', async () => {
    const searchTid = document.getElementById('searchTid').value;
    const result = await backend.searchTaxPayer(searchTid);
    
    if (result.length > 0) {
      const tp = result[0];
      searchResult.innerHTML = `
        <div class="tax-payer">
          <p><i class="fas fa-id-card"></i> <strong>TID:</strong> ${tp.tid}</p>
          <p><i class="fas fa-user"></i> <strong>Name:</strong> ${tp.firstName} ${tp.lastName}</p>
          <p><i class="fas fa-home"></i> <strong>Address:</strong> ${tp.address}</p>
        </div>
      `;
    } else {
      searchResult.innerHTML = '<p><i class="fas fa-exclamation-circle"></i> No TaxPayer found with the given TID.</p>';
    }
  });

  // Initial display of all tax payers
  displayAllTaxPayers();
});
