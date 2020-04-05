var selectedItemArray = [{ Field: 'species', Values: [] }, { Field: 'gender', Values: [] }];
//const abc = require('./search');

var characters = [];
//Function to display characters
function showCharacters(characters) {
    $("#characters").html("");
    characters.map(function (character) { // Map through the results and for each run the code below
        let li = document.createElement('li'), //  Create the elements we need
            img = document.createElement('img'),
            id = document.createElement('p'),
            status = document.createElement('p'),
            species = document.createElement('p'),
            gender = document.createElement('p'),
            origin = document.createElement('p'),
            name = document.createElement('p'),
            lastlocation = document.createElement('p'),
            id_key = document.createElement('p'),
            status_key = document.createElement('p'),
            species_key = document.createElement('p'),
            gender_key = document.createElement('p'),
            origin_key = document.createElement('p'),
            lastlocation_key = document.createElement('p');
        img.src = character.image; $(img).addClass('img'); // Add the source of the image to be the src of the img element
        name.innerHTML = character.name; $(name).addClass('name');
        id.innerHTML = character.id; $(id).addClass('id');
        status.innerHTML = character.status; $(status).addClass('status');
        species.innerHTML = character.species; $(species).addClass('species');
        gender.innerHTML = character.gender; $(gender).addClass('gender');
        origin.innerHTML = character.origin.name; $(origin).addClass('origin');
        lastlocation.innerHTML = character.location.name; $(lastlocation).addClass('lastlocation');
        id_key.innerHTML = "id"; $(id_key).addClass('id_key')
        status_key.innerHTML = "status"; $(status_key).addClass('status_key')
        species_key.innerHTML = "species"; $(species_key).addClass('species_key')
        gender_key.innerHTML = "gender"; $(gender_key).addClass('gender_key')
        origin_key.innerHTML = "origin"; $(origin_key).addClass('origin_key')
        lastlocation_key.innerHTML = "last location"; $(lastlocation_key).addClass('lastlocation_key')

        $(li).append($(li).append(img, name, id_key, id, status_key, status, '<hr>', species_key, species, '<hr>', gender_key, gender, '<hr>', origin_key, origin_key, '<hr>', lastlocation_key, lastlocation)); // Append all our elements).addClass('col-lg-3'); // Append all our elements
        $('#characters').append(li);

    });
    var maxHeight = 0;

    $('#characters li').each(function () {
        if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
    });

    $("#characters li").height(maxHeight);

}

//Function to show all characters on Page Load
function getInformation() {
    fetch('https://rickandmortyapi.com/api/character/')
        .then(res => res.json())
        .then(json => {
            let characters = json.results;
            if (characters) {
                showCharacters(characters);
            }
            else {
                return false
            }
        });
}


//Function to show characters on search by Name
function searchByName() {
    let searchKey = $('.searchForm').val().toLowerCase().replace(/\s+/g, '');
    fetch('https://rickandmortyapi.com/api/character/')
        .then(res => res.json())
        .then(json => {
            let characters = (!searchKey || searchKey == undefined) ? json.results : json.results.filter(x => x.name.toLowerCase().replace(/\s+/g, '') === searchKey); // Get the results
            if (characters) {
                showCharacters(characters);
            }
        });
}

//Custom filter implementation
window.customFilter = function (selectedItemArray) {
    fetch('https://rickandmortyapi.com/api/character/')
        .then(res => res.json())
        .then(json => {
            Array.prototype.flexFilter = function (info) {

                // Set our variables
                var matchesFilter, matches = [], count;

                // Helper function to loop through the filter criteria to find matching values
                // Each filter criteria is treated as "AND". So each item must match all the filter criteria to be considered a match.
                // Multiple filter values in a filter field are treated as "OR" i.e. ["Blue", "Green"] will yield items matching a value of Blue OR Green.
                matchesFilter = function (item) {
                    count = 0
                    for (var n = 0; n < info.length; n++) {
                        if (info[n]["Values"].indexOf(item[info[n]["Field"]]) > -1) {
                            count++;
                        }
                    }
                    // If TRUE, then the current item in the array meets all the filter criteria
                    return count == info.length;
                }

                // Loop through each item in the array
                for (var i = 0; i < this.length; i++) {
                    // Determine if the current item matches the filter criteria
                    if (matchesFilter(this[i])) {
                        matches.push(this[i]);
                    }
                }

                // Give us a new array containing the objects matching the filter criteria
                return matches;
            }
            var filtered = json.results.flexFilter(selectedItemArray);
            showCharacters(filtered);
            console.log(filtered);
            console.log(selectedItemArray);
        });

}

//Custom Filter List for Species and Gender
function createCustomFilterList() {
    fetch('https://rickandmortyapi.com/api/character/')
        .then(res => res.json())
        .then(json => {
            var characters = json.results;
            var listOfUniqueSpecies = [...new Set(characters.map(item => item.species))];
            var listOfUniqueGender = [...new Set(characters.map(item => item.gender))];
            listOfUniqueSpecies.map(function (species) {
                $('<input />', { type: 'checkbox', id: 'cb' + species, value: species, 'data-parent': 'species', 'onClick': 'filterArray(event);' }).appendTo($('.speciesFilterListDiv'));
                $('<label />', { 'for': 'cb' + species, text: species }).appendTo($('.speciesFilterListDiv'));
            })
            listOfUniqueGender.map(function (gender) {
                $('<input />', { type: 'checkbox', id: 'cb' + gender, value: gender, 'data-parent': 'gender', 'onClick': 'filterArray(event);' }).appendTo($('.genderFilterListDiv'));
                $('<label />', { 'for': 'cb' + gender, text: gender }).appendTo($('.genderFilterListDiv'));
            })
        });
}

function filterArray(event) {
    var a;
    var selectedFilterValue = event.target.value;
    var selectedFilterParent = $(event.target).attr('data-parent');
    if ($(event.target).prop('checked') == true) {
        if (selectedFilterParent == "species") {
            selectedItemArray[0].Values.push(selectedFilterValue)
        }
        else if (selectedFilterParent == "gender") {
            selectedItemArray[1].Values.push(selectedFilterValue)
        }
    }

    if ($(event.target).prop('checked') == false) {
        if (selectedFilterParent == "species") {
            if (selectedItemArray[0].Values.indexOf(selectedFilterValue) > -1) {
                selectedItemArray[0].Values.splice(selectedItemArray[0].Values.indexOf(selectedFilterValue), 1);
            }

        }
        else if (selectedFilterParent == "gender") {
            if (selectedItemArray[1].Values.indexOf(selectedFilterValue) > -1) {
                selectedItemArray[1].Values.splice(selectedItemArray[1].Values.indexOf(selectedFilterValue), 1);
            }

        }

    }
    if (selectedItemArray[0].Values.length == 0 && selectedItemArray[1].Values.length > 0)
        return customFilter([selectedItemArray[1]]);
    else if (selectedItemArray[0].Values.length > 0 && selectedItemArray[1].Values.length == 0)
        return customFilter([selectedItemArray[0]]);
    else if (selectedItemArray[0].Values.length > 0 && selectedItemArray[1].Values.length > 0)
        return customFilter(selectedItemArray);
    else
        return getInformation
}

function sorting(event) {
    if (event.target.text == "Ascending") {
        fetch('https://rickandmortyapi.com/api/character/')
            .then(res => res.json())
            .then(json => {
                json.results.sort((a, b) => (a.id > b.id) ? 1 : -1);
                return (showCharacters(json.results))
            })
    }
    else if (event.target.text == "Descending") {
        fetch('https://rickandmortyapi.com/api/character/')
            .then(res => res.json())
            .then(json => {
                json.results.sort((a, b) => (a.id < b.id) ? 1 : -1);
                return (showCharacters(json.results))
            })
    }

}
$(window).load(getInformation(), createCustomFilterList());

