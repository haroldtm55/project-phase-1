const countryTargets = [
  "Germany",
  "Italy",
  "England",
  "Spain"
];
const apiCongigObj = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": "8bc0ad048d98ed6fa090704ed786ca23",
  },
};
//Render list of countries and their flags
fetch(`https://v3.football.api-sports.io/countries`, apiCongigObj)
  .then((response) => response.json())
  .then((country) => {
    country.response.forEach((country) => {
      for (let i = 0; i < countryTargets.length; i++) {
        if (countryTargets[i] === country.name) {
          document
            .getElementById("list-countries")
            .appendChild(document.createElement("li")).className = "country";
          document
            .getElementsByClassName("country")
            [document.getElementsByClassName("country").length - 1].appendChild(
              document.createElement("span")
            ).className = "country-flag";
          document
            .getElementsByClassName("country-flag")
            [
              document.getElementsByClassName("country-flag").length - 1
            ].appendChild(document.createElement("img"))
            .setAttribute("src", country.flag);
          document
            .getElementsByClassName("country")
            [document.getElementsByClassName("country").length - 1].appendChild(
              document.createElement("span")
            ).className = "country-name";
          document.getElementsByClassName("country-name")[
            document.getElementsByClassName("country-name").length - 1
          ].textContent = countryTargets[i];
        }
      }
    });
    const countries = document.getElementsByClassName("country");
    for (const country of countries) {
      country.addEventListener("click", function (e) {
        //Make sure it deletes all elements from content div except the dropdown
        let i = document.querySelector(".content").children.length - 1;
        while (i > 1) {
          document.querySelector(".content").children[i].remove();
          i--;
        }
        //Show season dropdown
        document.querySelector("label").style.display = "inline";
        document.querySelector("select").style.display = "inline";
        fetch(
          `https://v3.football.api-sports.io/leagues?country=${country.innerText}`,
          apiCongigObj
        )
          .then((resp) => resp.json())
          .then((leagues) => {
            //Season dropdown options (if later on I can't upload the table, check values!!)
            document.getElementById("season").innerHTML = "";
            leagues.response[0].seasons
              .reverse()
              .forEach(
                (season) =>
                  (document
                    .getElementById("season")
                    .appendChild(document.createElement("option")).textContent =
                    season.year)
              );

            //Render name and logo of first division league
            if (!!document.querySelector("#league-champion")) {
              querySelector("#league-champion").remove();
            }
            document
              .querySelector(".content")
              .appendChild(document.createElement("div"))
              .setAttribute("id", "league-champion");
            document.querySelector(
              "#league-champion"
            ).innerHTML = `
              <div id="league">
                <h3 id=${leagues.response[0].league.id}>${leagues.response[0].league.name}</h3>
                <img src=${leagues.response[0].league.logo}>
                </div>
                <div id="champion">
              </div>`;

            //Render the last champion team logo
            let leagueId = leagues.response[0].league.id;
            let season = document.querySelector("select");
            fetch(
              `https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season.value}`,
              apiCongigObj
            )
              .then((resp) => resp.json())
              .then((standings) => {
                document.querySelector(
                  "#champion"
                ).innerHTML = `
                <h3>1st Place</h3>
                <img src=${standings.response[0].league.standings[0][0].team.logo}>`;
                //Render Table & Standings last season
                renderStandingsTable();
              });
          });
      });
    }
    //Render champion team logo
    let season = document.querySelector("select");
    season.addEventListener("change", function () {
      if (!!document.querySelectorAll("#league-champion img")[1]) {
        document.querySelectorAll("#league-champion img")[1].remove();
      }
      let leagueId = document.querySelector(
        "#league-champion h3:first-of-type"
      ).id;
      fetch(
        `https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season.value}`,
        apiCongigObj
      )
        .then((resp) => resp.json())
        .then((standings) => {
          document.querySelector("#champion").innerHTML = `
          <h3>1st Place</h3>
          <img src=${standings.response[0].league.standings[0][0].team.logo}>`;

          //Render Table & Standings
          renderStandingsTable();
        });
    });
  });

function renderStandingsTable() {
  //Verify there is no table prior appending it
  if (!!document.querySelector("#standings")) {
    document.querySelector("#standings").remove();
  }
  //Creation of the table headers
  document
    .querySelector(".content")
    .appendChild(document.createElement("table"))
    .setAttribute("id", "standings");
  document
    .querySelector("#standings").appendChild(document.createElement('thead')).className = 'table-head'
  document
    .querySelector("#standings thead")
    .innerHTML =
      `<tr>
        <th>Pos</th>
        <td id = "logos-header"> </td>
        <th>Team</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GF</th>
        <th>GA</th>
        <th>+/-</th>
        <th>PTS</th>
      </tr>`
  
  //Creation of the table body
  document
    .querySelector("#standings").appendChild(document.createElement('tbody'))
  
  let leagueId = document.querySelector(
    "#league-champion h3:first-of-type"
  ).id;  
  let standingsData =  document
    .querySelector("#standings tbody")
  let season = document.querySelector("select");
  //Fetching to get the standings
  fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season.value}`, apiCongigObj)
    .then(resp => resp.json())
    .then(standings => {
      let standingsDataBody = ""
      console.log(standings.response[0].league.standings[0].length)
      for (let i=0; i<standings.response[0].league.standings[0].length; i++) {
        standingsDataBody += 
        `<tr>
          <td>${standings.response[0].league.standings[0][i].rank}</td>
          <td><img src = ${standings.response[0].league.standings[0][i].team.logo}></td>
          <td>${standings.response[0].league.standings[0][i].team.name}</td>
          <td>${standings.response[0].league.standings[0][i].all.played}</td>
          <td>${standings.response[0].league.standings[0][i].all.win}</td>
          <td>${standings.response[0].league.standings[0][i].all.draw}</td>
          <td>${standings.response[0].league.standings[0][i].all.lose}</td>
          <td>${standings.response[0].league.standings[0][i].all.goals.for}</td>
          <td>${standings.response[0].league.standings[0][i].all.goals.against}</td>
          <td>${standings.response[0].league.standings[0][i].goalsDiff}</td>
          <td>${standings.response[0].league.standings[0][i].points}</td>
        </tr>`
      }
      standingsData.innerHTML = standingsDataBody
    })
}
