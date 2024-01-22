const API = "https://api.github.com/users/";
const button = document.querySelector(".submit");
const input = document.querySelector(".input");
const username = document.querySelector(".username");
const desc = document.querySelector(".desc");
const loc = document.querySelector(".location");
const twitter = document.querySelector(".twitter");
const image = document.querySelector(".image");
const githublink = document.querySelector(".githublink");
const reposContainer = document.querySelector(".repos");
const paginationContainer = document.querySelector(".pagination");
const select = document.querySelector(".select"); // Dropdown element
const searchInput = document.getElementById("search"); // Search bar input
const selectrepo=document.querySelector(".selectRepo");
const searchRepo=document.querySelector(".searchRepo");

// Event listener for dropdown changes
select.addEventListener('change', () => {
    updateRepos(1); // Fetch and update repositories when dropdown value changes
});

// Event listener for search input changes
searchInput.addEventListener('input', () => {
    updateRepos(1); // Fetch and update repositories when search input changes
});

button.addEventListener('click', () => {
    updateRepos(1); // Fetch and update repositories on button click
});

// Function to fetch and update repositories
function updateRepos(pageNumber) {
    const value = input.value;
    const perPage = select.value;
    const searchQuery = searchInput.value; // Get the search query
    const apiurl = `${API}${value}`;
    const repourl = `${API}${value}/repos?page=${pageNumber}&per_page=${perPage}`;
    
    // Show loader for 3 seconds
    document.getElementById("loader").style.display = 'block';
    setTimeout(function () {
        document.getElementById("loader").style.display = 'none';

        // Fetch user data
        fetch(apiurl)
            .then((res) => res.json())
            .then((data) => {
                // Update user information (username, bio, location, etc.)
                username.innerHTML = data.login;
                const bio = data.bio;
                if (bio != null) desc.innerHTML = bio;
                const loca = data.location;
                if (loca !== null) loc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${loca}`;
                const twit = data.twitter_username;
                if (twit !== null) twitter.innerHTML = twit;
                const img = data.avatar_url;
                image.src = img;
                const giturl = data.html_url;
                githublink.innerHTML = `<i class="fa-solid fa-link"></i> ${giturl}`;
                const totalPages=Math.ceil(data.public_repos/perPage);
                // Fetch and update repositories
                fetch(repourl)
                    .then((data) => data.json())
                    .then((data) => {
                        // Filter repositories based on the search query
                        const filteredData = data.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));

                        let a = "";
                        filteredData.forEach((value) => {
                            let topicsHTML = "";
                            if (value.topics && value.topics.length > 0) {
                                value.topics.forEach((topic) => {
                                    topicsHTML += `<span class="topic">${topic}  </span>`;
                                });
                            }
                            a += `<div class="a">
                                    <div class="name">${value.name}</div>
                                    <div class="repodesc">${value.description === null ? "<i>No Description</i>" : value.description}</div>
                                    <div class="lang">${topicsHTML}</div>
                                </div>`;
                        });
                        reposContainer.innerHTML = a;

                        // Fetch and display pagination buttons
                        fetch(`${API}${value}/repos`)
                            .then((response) => response.headers.get('link'))
                            .then((linkHeader) => {
                                const currentPage = 1; // Set the initial current page
                                paginationContainer.innerHTML = generatePaginationButtons(totalPages, currentPage);
                            })
                            .catch((error) => {
                                console.error("Error fetching pagination data:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error fetching repo data:", error);
                    });

            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, 3000);
}

// Function to generate pagination buttons
function generatePaginationButtons(totalPages, currentPage) {
    let buttonsHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        buttonsHTML += `<button style="height: 43px; width: 41px;" class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i} </button>`;
    }
    selectrepo.style.display='block';
    searchRepo.style.display='block';
    return buttonsHTML;
}

// Event listener for pagination buttons
paginationContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("pagination-btn")) {
        const selectedPage = parseInt(event.target.dataset.page);
        updateRepos(selectedPage);

        // Update active state for buttons
        const buttons = document.querySelectorAll(".pagination-btn");
        buttons.forEach((button) => button.classList.remove("active"));
        event.target.classList.add("active");
    }
});
