function createRestaurantCard(restaurant, foods) {
    return `
    <div class="restaurant-card">
        <div class="restaurant-header">
            <h3 class="restaurant-name">${restaurant.name}</h3>
            <div class="rating">
                <span class="stars">${'★'.repeat(Math.round(restaurant.rating || 0))}${'☆'.repeat(5 - Math.round(restaurant.rating || 0))}</span>
                <span class="rating-number">${restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
            </div>
        </div>
        <div class="restaurant-details">
            <div class="detail-item">
                <div class="detail-icon">🌍</div>
                <span class="detail-text">${restaurant.country}</span>
            </div>
            <div class="detail-item">
                <div class="detail-icon">📍</div>
                <span class="detail-text">${restaurant.state}</span>
            </div>
            <div class="detail-item">
                <div class="detail-icon">🍽️</div>
                <span class="detail-text">${restaurant.type}</span>
            </div>
        </div>
        <div class="food-list">
            <h4>Menu</h4>
            <ul>
                ${foods.map(food => `<li>${food.name} - $${food.price}</li>`).join('')}
            </ul>
        </div>
        <button class="buy-food-btn" onclick="openBuyFoodForm('${restaurant.name.replace(/'/g, "\\'")}', ${encodeURIComponent(JSON.stringify(foods))})">Buy Food</button>
    </div>
    `;
}

async function searchRestaurants() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('restaurantResults');
    resultsDiv.innerHTML = '';

    if (!searchTerm) {
        resultsDiv.innerHTML = '<div class="no-results"><h3>Please enter a restaurant name to search.</h3></div>';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/pyrestaurant/search/?restaurant=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            const data = await response.json();
            const cardsHtml = createRestaurantCard(data.restaurant, data.foods);
            resultsDiv.innerHTML = cardsHtml;
        } else {
            resultsDiv.innerHTML = '<div class="no-results"><h3>No restaurants found</h3><p>Try searching with different keywords</p></div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<div class="no-results"><h3>Error searching restaurants</h3><p>Please try again later.</p></div>';
    }
}

async function loadAllRestaurants() {
    const resultsDiv = document.getElementById('restaurantResults');
    resultsDiv.innerHTML = '<div class="no-results"><h3>Loading restaurants...</h3></div>';
    try {
        const response = await fetch('http://127.0.0.1:8000/pyrestaurant/all');
        if (response.ok) {
            const restaurants = await response.json();
            if (restaurants.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results"><h3>No restaurants found.</h3></div>';
            } else {
                resultsDiv.innerHTML = restaurants
                    .map(item => createRestaurantCard(item.restaurant, item.foods))
                    .join('');
            }
        } else {
            resultsDiv.innerHTML = '<div class="no-results"><h3>Error loading restaurants.</h3></div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<div class="no-results"><h3>Error loading restaurants.</h3></div>';
    }
}

// Call this on page load
window.addEventListener('DOMContentLoaded', loadAllRestaurants);

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchRestaurants();
    }
});

document.querySelector('.search-btn').addEventListener('click', function() {
    searchRestaurants();
});