const storageKey = 'phonesDB';

function getPhones() {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
}

function savePhones(phones) {
  localStorage.setItem(storageKey, JSON.stringify(phones));
}

function groupPhonesByBrand(phones) {
  const grouped = {};
  phones.forEach(phone => {
    const brand = phone.brand;
    if (!grouped[brand]) grouped[brand] = [];
    grouped[brand].push(phone);
  });
  return grouped;
}

function sortPhonesByDateDesc(phones) {
  return phones.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
}

document.addEventListener('DOMContentLoaded', () => {
  const isIndexPage = location.pathname.endsWith('index.html') || location.pathname === '/';

  if (isIndexPage) {
    const form = document.getElementById('phoneForm');
    const brandList = document.getElementById('brandList');

    form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const phone = {
    brand: data.get('brand').trim(),
    model: data.get('model').trim(),
    score: parseInt(data.get('score'), 10),
    releaseDate: data.get('releaseDate')
  };

      const phones = getPhones();
      phones.push(phone);
      savePhones(phones);
      location.reload();
    });

    const phones = getPhones();
    const grouped = groupPhonesByBrand(phones);
    const brands = Object.keys(grouped).sort();

    brandList.innerHTML = brands.map(brand => `
      <li><a href="brand.html?brand=${encodeURIComponent(brand)}">${brand}</a></li>
    `).join('');
  } else {
    const params = new URLSearchParams(location.search);
    const brand = params.get('brand');
    const brandHeader = document.getElementById('brandHeader');
    const phoneList = document.getElementById('phoneList');

    if (brand) {
      brandHeader.textContent = `${brand} Phones`;
      const phones = getPhones().filter(p => p.brand === brand);
      const sorted = sortPhonesByDateDesc(phones);

      phoneList.innerHTML = sorted.map(phone => `
  <li>
    <strong>Model:</strong> ${phone.model} |
    <strong>Score:</strong> ${phone.score} |
    <strong>Release Date:</strong> ${new Date(phone.releaseDate).toLocaleDateString()}
  </li>

      `).join('');
    } else {
      brandHeader.textContent = "Brand not found.";
    }
  }
});