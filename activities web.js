// Function to fetch JSON data from WordPress API for multiple pages and combine them
function fetchImageDataFromMultiplePages(pageNumbers) {
  var perPage = 100; // Number of items per page
  var promises = pageNumbers.map(pageNumber => {
    return fetch(`https://hadad.edu.kg/wp-json/wp/v2/media?per_page=${perPage}&page=${pageNumber}`)
      .then(response => response.json())
      .catch(error => {
        console.error("Error fetching images:", error);
      });
  });

  return Promise.all(promises)
    .then(results => {
      // Combine the results from all pages into one array
      return results.reduce((combinedData, pageData) => combinedData.concat(pageData), []);
    });
}

// Function to populate a carousel with lazy-loaded images using JSON data and a given image pattern
function populateCarouselWithImages(carouselID, jsonData, imagePattern) {
  var carousel = document.getElementById(carouselID);

  if (carousel) {
    var carouselInner = carousel.querySelector(".carousel-inner");

    var filteredImages = jsonData.filter(image => image.title.rendered.match(imagePattern));
console.log(filteredImages)
    filteredImages.forEach((image, index) => {
      var imageUrl = image.source_url;
      var carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");

      if (index === 0) {
        carouselItem.classList.add("active");
      }

      var imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = image.alt_text || "Slide";

      // Add lazy loading attribute to the image
      imgElement.loading = "lazy";

      var caption = document.createElement("div");
      caption.classList.add("carousel-caption");
      caption.innerText = image.title.rendered; // Set caption text (if needed)

      carouselItem.appendChild(imgElement);
      carouselItem.appendChild(caption); // Append caption to the item
      carouselInner.appendChild(carouselItem);
    });
  }
}

// Function to initialize the Bootstrap carousel
function initializeCarousel(carouselID) {
  $(`#${carouselID}`).carousel();
}



document.addEventListener("DOMContentLoaded", function() {
      // Example of how to use the functions for two carousels with different image patterns
      var pagesToFetch = [1, 2]; // Replace with the page numbers you want to fetch
      
      // Define the image patterns for each carousel
      var imagePattern1 = /^exp2_SF_/; // Replace with your desired pattern
      var imagePattern2 = /^exp2_birds_/; // Replace with your desired pattern
      
      // Fetch image data once
      fetchImageDataFromMultiplePages(pagesToFetch).then(function(jsonData) {
        // Populate and initialize the first carousel
        populateCarouselWithImages("habitatCarousel", jsonData, imagePattern1);
        initializeCarousel("habitatCarousel");
      
        // Populate and initialize the second carousel
        populateCarouselWithImages("birdsCarousel", jsonData, imagePattern2);
        initializeCarousel("birdsCarousel");
      });
      
      
    });
