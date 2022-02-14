const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    if (page === 'favorites') {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    } else {
        favoritesNav.classList.add('hidden');
        resultsNav.classList.remove('hidden');
    }
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach(result => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-image-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Card Subtitle
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        cardText.classList.add('card-text');
        // Small Element
        const smallEl = document.createElement('small');
        smallEl.classList.add('text-muted');
        // Strong Element
        const strongEl = document.createElement('strong');
        strongEl.textContent = result.date;
        // Copyright El
        const copyrightEl = document.createElement('span');
        if (result.copyright) {
            copyrightEl.textContent = ` ${result.copyright}`;
        } else {
            copyrightEl.textContent = '';
        }
        link.append(image);
        smallEl.append(strongEl, copyrightEl);
        cardBody.append(cardTitle, saveText, cardText, smallEl);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        // Catch error here
    }
}

// Add Result To Favorites
function saveFavorite(itemUrl) {
    // Loop through results array to select favorite
    resultsArray.forEach(item => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // Show Save Confirmation for 2 Seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// On Load
getNasaPictures();