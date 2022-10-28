const $gifBody = $('.gifBody');
const $search = $('#search');

function addGif(res){
    let numResults = res.data.length
    if(numResults){
        let randomIndex = Math.floor(Math.random() * numResults);
        let $newCol = $('<div>').addClass('col-md-4 col-12 mb-4')
        let $newGIF = $('<img>', {src: res.data[randomIndex].images.original.url, class: 'w-100'})
        $newCol.append($newGIF);
        $gifBody.append($newCol);
    }
}

$('form').on('submit', async function(evt){
    evt.preventDefault();

    let $searchValue = $search.val();
    $search.val('')

    const res = await axios.get('http://api.giphy.com/v1/gifs/search', {
        params: {
            q: $searchValue,
            api_key: '8gAFIRGg44KKTsIbpIcwFJjWw9ZjG7tE'
        }
    });
    addGif(res.data);
})

$('#removeBtn').on('click', function(){
    $gifBody.empty();
})