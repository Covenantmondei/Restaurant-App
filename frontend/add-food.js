document.getElementById('foodForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect form data
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('http://127.0.0.1:8000/pyrestaurant/food/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Hide the form and show success message
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.Error || 'Failed to add food.'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});

function resetForm() {
    // Show the form and hide success message
    document.getElementById('foodForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';

    // Reset the form
    document.getElementById('foodForm').reset();
}

// function goToRestaurant() {
//     window.location.href = 'index.html';
// }