"use strict";
class Compsognathus {
    constructor() {
        this.config = {
            endpoint: "https://static.usabilla.com/recruitment/apidemo.json"
        };

        this.source = [];
        this.filteredData = [];
        this.filters = {
            comments: "",
            ratings: []
        }
    };

    init(){
        const options = {
            mode :"cors"
        };

        fetch(this.config.endpoint, options)
            .then(resp => resp.json())
            .then(data => this.handleData(data))
            .then(() => this.addEventHandlers())
            .catch(error => console.error(error));
    };

    handleData(data) {
        if(data.items && data.items.length > 0) {
            this.source = data.items;
            this.filterAndRender();
        }
        else {
            throw new Error("Data not found");
        }
    };

    addEventHandlers() {
        const commentFilterInput = document.getElementById("comment-filter");
        commentFilterInput.addEventListener("input", event => this.onCommentFilterInput(event));

        const ratingFilterGroup = document.querySelectorAll("#rating-filter .rating-filter-button");
        ratingFilterGroup.forEach(input => {
            input.addEventListener("click", event => this.onRatingFilterGroupClick(event));
        })
    }

    onCommentFilterInput(event) {
        if (event.target.value !== this.filters.comments) {
            // Comment filter search is case insensitive
            this.filters.comments = event.target.value.toLowerCase();
            this.filterAndRender();
        }
    }

    onRatingFilterGroupClick(event) {
        const element = event.target;
        const rating = parseInt(element.dataset.rating);
        const index = this.filters.ratings.indexOf(rating);

        if(index === -1) {
            // Activate filter
            this.filters.ratings.push(rating);
            element.classList.add("active");
        }
        else {
            // Deactivate filter
            this.filters.ratings.splice(index, 1);
            element.classList.remove("active");
        }

        this.filterAndRender();
    }

    filterAndRender() {
        this.filter();
        this.render();
    }

    filter() {
        // If a filter is empty, all items pass
        this.filteredData = this.source.filter(item => {
                return (this.filters.ratings.length === 0 || this.filters.ratings.indexOf(item.rating) !== -1) &&
                (this.filters.comments.length === 0 || item.comment.toLowerCase().indexOf(this.filters.comments) !== -1)
            }
        );
    }

    render() {
        const loader = document.getElementById("loader-main");
        const content = document.getElementById("content");
        const results = document.getElementById("results");
        const noresults = document.getElementById("no-results");

        if(this.filteredData.length) {
            let template = `
                <div class="list-item-header">
                    Rating
                </div>
                <div class="list-item-header">
                    Comment
                </div>
                <div class="list-item-header">
                    Browser
                </div>
                <div class="list-item-header">
                    Device
                </div>
                <div class="list-item-header">
                    Platform
                </div>
            `;
            this.filteredData.forEach(item => {
                const platform = item.computed_browser.Platform;
                const isMobile = platform === "Android" ||
                                 platform === "iOS" ||
                                 platform === "BlackBerry" ||
                                 platform === "Windows Mobile";

                template += `
                    <div class="list-item">
                        <div class="rating-filter-button active">
                            ${item.rating}
                        </div>
                    </div>
                    <div class="list-item">
                        ${item.comment}
                    </div>
                    <div class="list-item">
                        ${item.computed_browser.FullBrowser}
                        <br/>
                        ${item.computed_browser.Version}
                    </div>
                    <div class="list-item">
                        ${isMobile ? "Mobile" : "Desktop"}
                    </div>
                    <div class="list-item">
                        ${platform}
                    </div>
                `;
            });
            results.innerHTML = template;

            results.classList.remove("hidden");
            noresults.classList.add("hidden");
        }
        else {
            results.classList.add("hidden");
            noresults.classList.remove("hidden");
        }

        loader.classList.add("hidden");
        content.classList.remove("hidden");
    };
}
