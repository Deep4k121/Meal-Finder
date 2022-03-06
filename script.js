const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('rand-btn'),
  mealsEle = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEle = document.getElementById('single-meal');

// Search meal and fetch from api
function searchMeal(element) {
  element.preventDefault();

  // Clear single meal
  single_mealEle.innerHTML = '';

  // Get search term (Search keyword)
  const content = search.value;
  console.log(content);

  // Check for empty
  if (content.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${content}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search Results For ${content}:</h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>No results found for ${content}, Try again :)</p>`;
        } else {
          mealsEle.innerHTML = data.meals
            .map(
              meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term!!');
  }
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  console.log(ingredients);
  single_mealEle.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Fetch meal by ID
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Fetch random meal from api
function getRandomMeal() {
  // Clears meals and heading
  mealsEle.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Event listners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEle.addEventListener('click', element => {
  const mealInfo = element.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
   
    console.log(mealID);
    getMealByID(mealID);
  }
});