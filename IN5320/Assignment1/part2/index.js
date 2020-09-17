async function getPopulation(country) {
    let response = await fetch (`https://d6wn6bmjj722w.population.io/1.0/population/${country}/today-and-tomorrow/`);
    let data = await response.json();
    return data;
}

let allCountries = [];


async function getAllCountries() {
    let response = await fetch ('https://d6wn6bmjj722w.population.io/1.0/countries/');
    let test = await response.json();
    return test;
}
getAllCountries().then(test => {
    allCountries = test.countries;
});


var names = [];
if(localStorage.getItem("names")){
    names = JSON.parse(localStorage.getItem("names"));
};

if(names.length > 0){
    names.forEach(element => {
        createListElement(element);
    });
}

function addListElement(){
    let input = document.getElementById("input").value;
    
    if(allCountries.includes(input)){
        if(input != '' && !names.includes(input)){
            createListElement(input);
            names.push(input);
            localStorage.setItem("names", JSON.stringify(names));
        }else{
            alert(input + " already exist");
        }
    }else{
        alert(input + " is not a country");
    }
    document.getElementById("input").value = '';
}

function removeListElement(name){
    document.getElementById(name).remove();
    names = names.filter(e => e !== name);
    localStorage.setItem("names", JSON.stringify(names));
    countryInterval.delete(name)
}

function doesElementStartWith(element, searchWord){
    if(element.startsWith(searchWord)) return true;
    return false;
}

function search(){
    let searchWord = document.getElementById('search').value;
    let filtered = names.filter(country => doesElementStartWith(country, searchWord))
    ul = document.getElementById("list");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        if(filtered.includes(li[i].id)){
            li[i].style.display = "";
        }else{
            li[i].style.display = "none";
        }
    }
}


function createListElement(countryName){
    let li = document.createElement('li');
    li.className="country"
    let liste = document.getElementById("list");
    let button = document.createElement("button");
    let p = document.createElement("p");
    let populationNumber = document.createElement("p");
    populationNumber.id = "population" + countryName;
    populationNumber.innerHTML = "NaN"
    li.id = countryName;
    p.innerHTML = countryName;
    button.innerHTML = "X";
    button.setAttribute("onclick","removeListElement(this.id)");
    button.id = countryName;
    li.appendChild(p);
    li.appendChild(populationNumber);
    li.appendChild(button);
    liste.appendChild(li);
}

countryInterval = new Map();


function findPopulation(){
    names.forEach(country => {
        console.log(country);
        let populationCount = document.getElementById("population" + country);
        if(!countryInterval.has(country)){
            let populationInterval;
            getPopulation(country).then(data => {
                populationCount = document.getElementById("population" + country);
                populationCount.innerHTML = data.total_population[1].population;
                populationInterval = data.total_population[1].population - data.total_population[0].population; 
                populationInterval = populationInterval/86400;
                countryInterval.set(country, populationInterval);
            })
        }
        populationCount.innerHTML = Math.ceil(Number(populationCount.innerHTML) + Number(countryInterval.get(country)));
    })
}

setInterval(findPopulation, 1000);