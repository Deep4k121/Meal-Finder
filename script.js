const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    single_mealEl = document.getElementById('single-meal'),
    resultHeading = document.getElementById('result-heading');

function getRandomMeal() {

    meals.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });

}

function searchMeal(e) {
    e.preventDefault();

    single_mealEl.innerHTML = '';

    const term = search.value;

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                resultHeading.innerHTML = `<h2>Search results for '${term}' :</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>No result, try again !</h2>`;
                }
                else {
                    mealsEl.innerHTML = data.meals.map(meal =>

                        `<div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div> 
                        </div>

                        `
                        // data-mealID : format for custom attribute in html5
                        // data-"whatever-we-want"= ""
                    )
                        .join('')
                }
            });
        search.value = '';
    }
    else
        alert("Meal can't be blank");
}

function getMealByID(mealID) {

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {

            const meal = data.meals[0];
            addMealToDOM(meal);

        })

}

function addMealToDOM(meal) {

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }

        else
            break;
    }

    single_mealEl.innerHTML =
        `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? ` <p>Category: ${meal.strCategory}</p> ` : ''}
                ${meal.strArea ? ` <p>Dish type: ${meal.strArea}</p> ` : ''}
            </div>
        

        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        </div>
    `

}

// Event listeners

submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {

    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        }
        else {
            return false;

        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealByID(mealID);
    }
});
random.addEventListener('click', getRandomMeal);

