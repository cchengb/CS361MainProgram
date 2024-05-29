document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    generateRecipes();
});

async function generateRecipes() {
    const apiKey = '94e713967d564f489aba5f6c09bab704'; // Replace with your actual API key
    const mealType = document.getElementById('mealType').value;
    const numberRecipes = 6; // Number of recipes you want to fetch
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
        const description = buildDescription(recipe);
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <a href="#" onclick="fetchRecipeDetails(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}">
            </a>
            <h2>${recipe.title}</h2>
            <p>${description}</p>
            <button class='button' onclick="addToFavorites('${recipe.title}', '${recipe.image}', '${description.replace(/'/g, "\\'")}')">Add to Favorites</button>
            <button class='button' onclick="speakText('${recipe.title + ' ' + description.replace(/'/g, "\\'")}')">Speak Recipe</button>
        `;
        recipeList.appendChild(recipeElement);
    });
}

function buildDescription(recipe) {
    // Check if nutrition data is available and construct the nutrition string accordingly
    let nutrition = 'No nutritional info available.';
    if (recipe.nutrition && recipe.nutrition.nutrients) {
        const calories = recipe.nutrition.nutrients.find(n => n.name === 'Calories');
        const carbs = recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates');
        const fat = recipe.nutrition.nutrients.find(n => n.name === 'Fat');
        nutrition = `Calories: ${calories ? calories.amount + ' kcal' : 'N/A'}, Carbs: ${carbs ? carbs.amount + ' g' : 'N/A'}, Fat: ${fat ? fat.amount + ' g' : 'N/A'}`;
    }

    // Check if preparation time is available
    const prepTime = recipe.readyInMinutes ? `Prep time: ${recipe.readyInMinutes} minutes` : 'Prep time not provided.';
    
    return `${nutrition}. ${prepTime}`;
}


