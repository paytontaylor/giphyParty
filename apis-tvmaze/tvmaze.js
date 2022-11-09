"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
const missingImage = "https://tinyurl.com/tv-missing";

async function getShowsByTerm(term) {
    // ADD: Remove placeholder & make request to TVMaze search shows API.
    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
    console.log(res);
    let shows = res.data.map((result) => {
        let show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : missingImage,
        };
    });
    return shows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
    $showsList.empty();

    for (let show of shows) {
        const $show = $(
            `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-dark btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
        );

        $showsList.append($show);
    }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
    const term = $("#search-query").val();
    const shows = await getShowsByTerm(term);

    $episodesArea.hide();
    populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
    evt.preventDefault();
    await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    console.log(res);
    let episodes = res.data.map((episode) => {
        return {
            id: episode.id,
            name: episode.name,
            season: episode.season,
            number: episode.number,
        };
    });
    return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
    $episodesList.empty();
    for (let episode of episodes) {
        const $item = $(
            `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `
        );

        $episodesList.append($item);
    }
    $episodesArea.show();
}

async function getEpisodesAndDisplay(evt) {
    // here's one way to get the ID of the show: search "closest" ancestor
    // with the class of .Show (which is put onto the enclosing div, which
    // has the .data-show-id attribute).
    const showId = $(evt.target).closest(".Show").data("show-id");

    // here's another way to get the ID of the show: search "closest" ancestor
    // that has an attribute of 'data-show-id'. This is called an "attribute
    // selector", and it's part of CSS selectors worth learning.
    // const showId = $(evt.target).closest("[data-show-id]").data("show-id");

    const episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
