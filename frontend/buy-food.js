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
                <div class="detail-icon">🍽</div>
                <span class="detail-text">${restaurant.type}</span>
            </div>
        </div>
        <div class="food-list">
            <h4>Menu</h4>
            <ul>
                ${foods.map(food => `<li>${food.name} - $${food.price}</li>`).join('')}
            </ul>
        </div>
        <button class="buy-food-btn" onclick="openBuyFoodForm('${restaurant.name.replace(/'/g, "\\'")}', '${encodeURIComponent(JSON.stringify(foods))}')">Buy Food</button>
    </div>
    `;
}

async function searchRestaurants() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('restaurantResults');
    const customerContainer = document.getElementById('topCustomers');
    const reviewContainer = document.getElementById('customerReviews');

    resultsDiv.innerHTML = '';
    customerContainer.innerHTML = '';
    reviewContainer.innerHTML = '';

    if (!searchTerm) {
        resultsDiv.innerHTML = '<div class="no-results"><h3>Please enter a restaurant name to search.</h3></div>';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/pyrestaurant/search/?restaurant=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            const data = await response.json();

            // Show restaurant card
            const cardsHtml = createRestaurantCard(data.restaurant, data.foods);
            resultsDiv.innerHTML = cardsHtml;

            // Show customers
            if (data.customers && data.customers.length > 0) {
                data.customers.forEach(customer => {
                    const item = document.createElement('div');
                    item.classList.add('customer-card');
                    item.innerHTML = `
                        <div class="customer-item">
                            <div class="customer-avatar">${customer.name.slice(0, 2).toUpperCase()}</div>
                            <div class="customer-info">
                                <h4>${customer.name}</h4>
                                <p>${customer.order_no} orders • ${customer.restaurant_name}</p>
                            </div>
                        </div>
                    `;
                    customerContainer.appendChild(item);
                });
            } else {
                customerContainer.innerHTML = '<p>No top customers found.</p>';
            }

            // Show reviews
            if (data.reviews && data.reviews.length > 0) {
                data.reviews.forEach(review => {
                    const item = document.createElement('div');
                    item.classList.add('customer-card');
                    item.innerHTML = `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">${review.customer} • ${review.restaurant_name}</span>
                            </div>
                            <p class="review-text">"${review.comment}"</p>
                        </div>
                    `;
                    reviewContainer.appendChild(item);
                });
            } else {
                reviewContainer.innerHTML = '<p>No reviews found.</p>';
            }

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

// Buy Food Form Functions
let selectedRating = 0;

function openBuyFoodForm(restaurantName, encodedFoods) {
    const overlay = document.getElementById('formOverlay');
    const restaurantNameInput = document.getElementById('restaurantName');
    const foodSelect = document.getElementById('foodName');
    
    // Set restaurant name
    restaurantNameInput.value = restaurantName;
    
    // Parse and populate food options
    try {
        const foods = JSON.parse(decodeURIComponent(encodedFoods));
        foodSelect.innerHTML = '<option value="">Select your favorite dish</option>';
        foods.forEach(food => {
            const option = document.createElement('option');
            option.value = food.name;
            option.textContent = `${food.name} - $${food.price}`;
            foodSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error parsing foods:', error);
        foodSelect.innerHTML = '<option value="">No menu items available</option>';
    }
    
    // Reset form
    document.getElementById('buyFoodForm').reset();
    restaurantNameInput.value = restaurantName; // Keep restaurant name after reset
    resetStarRating();
    
    // Show overlay
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeBuyFoodForm() {
    const overlay = document.getElementById('formOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Star rating functionality
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStarDisplay() {
    highlightStars(selectedRating);
}

function updateRatingText() {
    const ratingText = document.getElementById('ratingText');
    const ratingLabels = {
        1: 'Poor',
        2: 'Fair', 
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    ratingText.textContent = selectedRating > 0 ? ratingLabels[selectedRating] : 'Select rating';
}

function resetStarRating() {
    selectedRating = 0;
    updateStarDisplay();
    updateRatingText();
    document.getElementById('rating').value = '';
}

// Event Listeners
window.addEventListener('DOMContentLoaded', function() {
    loadAllRestaurants();
    
    // Star rating event listeners
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('ratingText');
    const ratingInput = document.getElementById('rating');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            ratingInput.value = selectedRating;
            updateStarDisplay();
            updateRatingText();
        });

        star.addEventListener('mouseover', function() {
            const hoverRating = parseInt(this.dataset.rating);
            highlightStars(hoverRating);
        });
    });

    document.getElementById('starRating').addEventListener('mouseleave', function() {
        updateStarDisplay();
    });


    // Close form when clicking outside
    document.getElementById('formOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBuyFoodForm();
        }
    });
});

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchRestaurants();
    }
});

document.querySelector('.search-btn').addEventListener('click', function() {
    searchRestaurants();
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8000/pyrestaurant/customers/')
        .then(response => response.json())
        .then(data => {
            const customerContainer = document.getElementById('topCustomers');
            customerContainer.innerHTML = ''; // Clear if previously filled

            if (data.length === 0) {
                customerContainer.innerHTML = '<p>No top customers found.</p>';
                return;
            }

            data.forEach(customer => {
                const item = document.createElement('div');
                item.classList.add('customer-card'); // for styling if needed
                item.innerHTML = `
                    <div class="customer-item">
                        <div class="customer-avatar">${customer.name.slice(0, 2).toUpperCase()}</div>
                        <div class="customer-info">
                            <h4>${customer.name}</h4>
                            <p>${customer.order_no} orders • ${customer.restaurant_name}</p>
                        </div>
                    </div>
                `;
                customerContainer.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error fetching top customers:', error);
        });
});


document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8000/pyrestaurant/reviews/')
        .then(response => response.json())
        .then(data => {
            const customerContainer = document.getElementById('customerReviews');
            customerContainer.innerHTML = ''; // Clear if previously filled

            if (data.length === 0) {
                customerContainer.innerHTML = '<p>No top reviews found.</p>';
                return;
            }

            data.forEach(reviews => {
                const item = document.createElement('div');
                item.classList.add('customer-card'); // for styling if needed
                item.innerHTML = `
                    <div class="review-item">
                        <div class="review-header">
                            <span class="reviewer-name">${reviews.customer} • ${reviews.restaurant_name}</span>
                        </div>
                        <p class="review-text">"${reviews.comment}"</p>
                    </div>
                `;
                customerContainer.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error fetching top customers:', error);
        });
});

 document.addEventListener('DOMContentLoaded', function () {
    const buyFoodForm = document.getElementById('buyFoodForm');

    buyFoodForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(buyFoodForm);

        try {
            const response = await fetch('http://127.0.0.1:8000/pyrestaurant/food/buy', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("🎉 Food order placed successfully!");
                closeBuyFoodForm();
                buyFoodForm.reset();
                resetStarRating();
            } else {
                const errorData = await response.json();
                alert("❌ Failed to place order. " + (errorData.detail || 'Please try again.'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("❌ An error occurred. Please try again later.");
        }
    });
});

