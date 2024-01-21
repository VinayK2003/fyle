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

button.addEventListener('click', () => {
    const value = input.value;
    const apiurl = `${API}${value}`;

    // Show loader for 3 seconds
    document.getElementById("loader").style.display = 'block';
    setTimeout(function () {
        document.getElementById("loader").style.display = 'none';

        fetch(apiurl)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const fetchedUsername = data.login;
                username.innerHTML = fetchedUsername;

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

                const repourl = `${API}${value}/repos?page=1&per_page=3`; // Adjust per_page as needed
                fetch(repourl)
                    .then((data) => data.json())
                    .then((data) => {
                        console.log(data);
                        let a = "";
                        data.map((value) => {
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
                                const totalPages = extractTotalPages(linkHeader);
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
});

// Function to extract total pages from the link header
function extractTotalPages(linkHeader) {
    if (!linkHeader) return 1;

    const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
    return matches ? parseInt(matches[1]) : 1;
}

// Function to generate pagination buttons
function generatePaginationButtons(totalPages, currentPage) {
    let buttonsHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        buttonsHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

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

// Function to update repos based on the selected page
function updateRepos(pageNumber) {
    const value = input.value;
    const repourl = `${API}${value}/repos?page=${pageNumber}&per_page=10`; // Adjust per_page as needed

    // Show loader for 3 seconds
    document.getElementById("loader").style.display = 'block';
    setTimeout(function () {
        document.getElementById("loader").style.display = 'none';

        fetch(repourl)
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
                let a = "";
                data.map((value) => {
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
            })
            .catch((error) => {
                console.error("Error fetching repo data:", error);
            });
    }, 3000);
}

