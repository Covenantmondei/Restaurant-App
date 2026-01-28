document
  .getElementById("foodForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect form data
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(
        "https://restaurant-ma9e.onrender.com/pyrestaurant/food/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        // Hide the form and show success message
        form.style.display = "none";
        document.getElementById("successMessage").style.display = "block";
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.Error || "Failed to add food."));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  });

function resetForm() {
  // Show the form and hide success message
  document.getElementById("foodForm").style.display = "block";
  document.getElementById("successMessage").style.display = "none";

  // Reset the form
  document.getElementById("foodForm").reset();
}

async function populateRestaurants() {
  const select = document.getElementById("restaurant");
  try {
    const response = await fetch(
      "https://restaurant-ma9e.onrender.com/pyrestaurant/getall"
    );
    if (response.ok) {
      const data = await response.json();
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.restaurant.id;
        option.textContent = item.restaurant.name;
        select.appendChild(option);
      });
      if (data.length === 0) {
        select.innerHTML = '<option value="">No restaurants found</option>';
      }
    } else {
      select.innerHTML = '<option value="">Failed to load restaurants</option>';
    }
  } catch (error) {
    select.innerHTML = '<option value="">Error loading restaurants</option>';
  }
}

// Call on page load
window.addEventListener("DOMContentLoaded", populateRestaurants);
