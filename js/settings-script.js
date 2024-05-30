document.addEventListener('DOMContentLoaded', function() {
    loadSettings();  // Load settings when the page is ready
    applyTheme();    // Apply theme based on settings

    const generateButton = document.getElementById('generateImagesBtn');
    if (generateButton) {
        generateButton.addEventListener('click', generateAndDownloadImages);
    }
});

function generateAndDownloadImages() {
    const apiUrl = 'http://127.0.0.1:5000/generate_images_criteria';
    const data = {
        'start_x': 50,
        'start_y': 50,
        'frames': 10,
        'seed': 3,
        'pixel_number': 100,
        'mode': "2",
        'wiggle': 3,
        'xml_files': ['carrot.xml', 'avo.xml', 'frog.xml','cabbage.xml'],
        'pixel_size': 2,
        'file_name': "asteroid"
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json();
        }
        throw new Error('Invalid MIME type returned');
    })
    .then(imageUrls => {
        const container = document.getElementById('imagesContainer');
        container.innerHTML = ''; // Clear previous content
        Object.keys(imageUrls).forEach(key => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrls[key];
            imgElement.style = "margin: 10px; width: auto; height: 100px;";
            const downloadLink = document.createElement('a');
            downloadLink.href = imageUrls[key];
            downloadLink.download = key;
            downloadLink.textContent = 'Download ' + key;
            downloadLink.style = "display: block; text-align: center;";
            const imageDiv = document.createElement('div');
            imageDiv.style = "flex: 1 0 21%; margin: 5px;";
            imageDiv.appendChild(imgElement);
            imageDiv.appendChild(downloadLink);
            container.appendChild(imageDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching images:', error);
        alert('Failed to generate images: ' + error.message);
    });
}



function saveSettings() {
    // Get the current values from the form
    const selectedTheme = document.getElementById('theme').value;

    // Save these values to localStorage
    localStorage.setItem('theme', selectedTheme);

    // Alert the user that settings have been saved
    alert('Settings saved successfully!');
}

function loadSettings() {
    // Retrieve the settings from localStorage
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) { // Check if the theme was set previously
        document.getElementById('theme').value = storedTheme;
    }
}

// Add event listener to load settings when the document content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light'; // Default to 'light' theme
    document.body.className = theme; // Apply the class name to the body
}

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    applyTheme(); // Apply the theme when the page loads
});

