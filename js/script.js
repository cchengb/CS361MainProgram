const container = document.querySelector('.container');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const resetLink = document.querySelector('.resetlink');
const btnPopup = document.querySelector('.btnLogin-popup');
const closeIcon = document.querySelector('.close-icon');

if (registerLink){
    registerLink.addEventListener('click', () => {
    container.classList.add('active');
});
}
if (loginLink){
loginLink.addEventListener('click', () => {
    container.classList.remove('active');
});
}

if(resetLink){
resetLink.addEventListener('click', () => {
    container.classList.add('active');
});
}

if(btnPopup){
btnPopup.addEventListener('click', () => {
    container.classList.add('active-popup');
});
}

if(closeIcon){
closeIcon.addEventListener('click', () => {
    container.classList.remove('active-popup');
});
}

async function generateRecipes() {
    const apiKey = '190db4778a004068a2ddcfb2fef8e8f4'; // Replace with your actual API key
    const mealType = document.getElementById('mealType').value;
    const numberRecipes = 3; // Number of recipes you want to fetch
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&type=${mealType}&number=${numberRecipes}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error('Could not fetch recipes:', error);
        // Display an error message to the user
        document.getElementById('recipeList').innerHTML = '<p>Failed to load recipes. Please try again later.</p>';
    }
}
async function generateRecipes() {
    const apiKey = '94e713967d564f489aba5f6c09bab704'; // Replace with your actual API key
    const mealType = document.getElementById('mealType').value;
    const numberRecipes = 3; // Number of recipes you want to fetch
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&type=${mealType}&number=${numberRecipes}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error('Could not fetch recipes:', error);
        // Display an error message to the user
        document.getElementById('recipeList').innerHTML = '<p>Failed to load recipes. Please try again later.</p>';
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = ''; // Clear previous entries

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <a href="#" onclick="fetchRecipeDetails(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}">
            </a>
            <h2>${recipe.title}</h2>
            <p>${recipe.description}</p>
            <button onclick="addToFavorites('${encodeURIComponent(JSON.stringify(recipe))}')">Add to Favorites</button>
            <button class='button' onclick="speakText('${recipe.title + ' ' + recipe.description}')">Speak Recipe</button>
        `;
        console.log("Recipe data being passed:", recipe.title, recipe.image, recipe.description); // Log data here
        recipeList.appendChild(recipeElement);
    });
}

function addToFavorites(title, image, description) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Check for duplicates based on the image URL
    const isDuplicate = favorites.some(favorite => favorite.image === image);
    if (isDuplicate) {
        alert('This recipe is already in your favorites!');
        return; // Stop the function if a duplicate is found
    }

    // Check if the inputs are valid before adding to the array
    if (title && image && description) {
        favorites.push({ title, image, description });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Added to favorites!');
    } else {
        alert('Failed to add to favorites: Invalid data');
    }
}



function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteList = document.getElementById('favoriteList');
    favoriteList.innerHTML = '';

    if (favorites.length === 0) {
        favoriteList.innerHTML = '<p>No favorites added yet.</p>';
        return;
    }

    favorites.forEach((favorite, index) => {
        const recipeElement = document.createElement('div');
        recipeElement.innerHTML = `
            <h3>${decodeURI(favorite.title)}</h3>
            <img src="${favorite.image}" alt="Image of ${decodeURI(favorite.title)}">
            <p>${decodeURI(favorite.description)}</p>
            <button class = 'button' onclick="deleteFavorite(${index})">Delete</button>
        `;
        favoriteList.appendChild(recipeElement);
    });
}

window.deletedItems = [];  // Temporary storage for deleted items

function deleteFavorite(index) {
    // Add a confirmation dialog before deleting
    if (confirm('Are you sure you want to delete this recipe from your favorites?')) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const deletedItem = favorites.splice(index, 1)[0]; // Remove the item
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage
        displayFavorites();  // Refresh the display

        // Optionally, handle the temporary storage for undo functionality
        sessionStorage.setItem('lastDeleted', JSON.stringify({item: deletedItem, index: index}));
        showUndoButton();  // Show the undo button if needed
    } else {
        // If the user cancels the action, do nothing
        console.log('Deletion cancelled.');
    }
}


function showUndoButton() {
    const undoButton = document.getElementById('undoButton');
    undoButton.style.display = 'block'; // Assuming you have an undo button with this id
}

function undoDelete() {
    const lastDeleted = JSON.parse(sessionStorage.getItem('lastDeleted'));
    if (lastDeleted) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(lastDeleted.index, 0, lastDeleted.item); // Reinsert at the original index
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage
        displayFavorites(); // Refresh the display
        sessionStorage.removeItem('lastDeleted'); // Clear the lastDeleted item from sessionStorage
        hideUndoButton(); // Optionally hide the undo button
    } else {
        alert("Nothing to undo!");
    }
}



function showModal(message) {
    var modal = document.getElementById('modal');
    modal.style.display = "block";
    modal.querySelector('p').textContent = message;

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
async function fetchRecipeDetails(id) {
    const apiKey = '94e713967d564f489aba5f6c09bab704';
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const recipeDetails = await response.json();
        displayRecipeDetails(recipeDetails);
    } catch (error) {
        console.error('Failed to fetch recipe details:', error);
        // Optionally handle the error, e.g., show an error message to the user
    }
}

function displayRecipeDetails(details) {
    const modal = document.getElementById('modal');
    modal.querySelector('.modal-content').innerHTML = `
        <span class="close">&times;</span>
        <h1>${details.title}</h1>
        <img src="${details.image}" alt="${details.title}" style="width:100%;">
        <p>${details.summary}</p>
        <p>Preparation time: ${details.readyInMinutes} minutes</p>
        <p>Servings: ${details.servings}</p>
    `;
    modal.style.display = "block";

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1; // Set pitch level
    speech.rate = 1; // Set speed of speech
    window.speechSynthesis.speak(speech);
}

// function for meal/snack suggestions
function getMealSuggestions() {
    fetch('http://127.0.0.1:3000/meal_suggestions?city=paris')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const weatherContainer = document.getElementById('mealWeatherCondition'); // Updated ID
            const list = document.getElementById('mealList');
            list.innerHTML = ''; // Clear previous entries

            // Display the weather condition
            if (data.weather) {
                weatherContainer.innerHTML = `<h3>Weather Condition: ${data.weather}</h3>`;
            }

            // Display meal suggestions
            data.meals.forEach(meal => {
                const item = document.createElement('li');
                item.textContent = meal;
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Failed to fetch:', error);
            list.innerHTML = `<li>Error fetching meals: ${error.message}</li>`;
        });
}

function getSnackSuggestions() {
    fetch('http://127.0.0.1:3000/snack_suggestions?city=paris') // Ensure consistent case use in the city parameter
        .then(response => {
            if (!response.ok) { // Check if the response is okay
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('snackList');
            const weatherContainer = document.getElementById('snackWeatherCondition'); // Additional div for weather, if needed

            list.innerHTML = ''; // Clear previous entries

            // Optionally display the weather condition (if included in the API response)
            if (data.weather) {
                weatherContainer.innerHTML = `<h3>Weather Condition: ${data.weather}</h3>`;
            }

            // Display snack suggestions
            data.snacks.forEach(snack => { // Assuming the API returns an object with a snacks array
                const item = document.createElement('li');
                item.textContent = snack;
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Failed to fetch:', error);
            list.innerHTML = `<li>Error fetching snacks: ${error.message}</li>`;
        });
}

// function for fetchdaily tip
document.addEventListener('DOMContentLoaded', function() {
    fetchDailyTip(); // Automatically fetch the daily tip when the page loads
});

function fetchDailyTip() {
    fetch('http://127.0.0.1:2000/daily_tip') // Adjust the URL to your backend service
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch daily tip');
            return response.json();
        })
        .then(data => {
            document.getElementById('dailyTip').textContent = data.tip;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('dailyTip').textContent = 'Error loading tip';
        });
}

function fetchRandomTip() {
    fetch('http://127.0.0.1:2000/random_tip') // Adjust the URL to your backend service
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch random tip');
            return response.json();
        })
        .then(data => {
            document.getElementById('randomTip').textContent = data.tip;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('randomTip').textContent = 'Error loading tip';
        });
}

// Function to find alternatives for the given ingredient
function findIngredientAlternatives() {
    const ingredient = document.getElementById('ingredientInput').value.trim();
    if (!ingredient) {
        console.error('No ingredient provided');
        return;
    }
    fetch(`http://127.0.0.1:1500/find_alternatives?ingredient=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            const alternativesDisplay = document.getElementById('alternativesDisplay');
            alternativesDisplay.innerHTML = '<ul>'; // Start the list

            if (data.error) {
                console.error('Error:', data.error);
                alternativesDisplay.innerHTML += `<li>Error: ${data.error}</li>`;
            } else {
                data[ingredient].forEach(alt => {
                    alternativesDisplay.innerHTML += `<li>${alt} <button onclick="getSubstitutionReasons('${alt}')">Why this substitute?</button></li>`;
                });
            }

            alternativesDisplay.innerHTML += '</ul>'; // End the list
        })
        .catch(error => console.error('Error fetching alternatives:', error));
}

// Function to get reasons for the substitution
function getSubstitutionReasons(ingredient) {
    fetch(`http://127.0.0.1:1500/substitution_reasons?ingredient=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            const reasonsDisplay = document.getElementById('reasonsDisplay');
            const reasonText = document.getElementById('reasonText');
            
            if (data.error) {
                console.error('Error:', data.error);
                reasonText.innerText = `Error: ${data.error}`;
            } else {
                reasonsDisplay.style.display = 'block'; // Show the reasons div
                reasonText.innerText = data[ingredient]; // Display the reasons
            }
        })
        .catch(error => {
            console.error('Error fetching reasons:', error);
            reasonText.innerText = `Error fetching reasons: ${error.message}`;
        });
}

