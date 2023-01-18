document.addEventListener("DOMContentLoaded", function () {
  let firstRow = document.querySelector("#firstRow");
  let timelineDiv = document.querySelector("#timeline");
  let team1,
    team2,
    score1,
    score2,
    html,
    matchDate,
    stadiumName,
    element1,
    element2,
    eventID;

  // season id does work just for season 20/21 - wrong value of other ids
  let season = document.querySelector(`#seasons`);

  season.onchange = function () {
    document.location.reload();
  };

  let request = new Request(
    `https://api.sportradar.us/soccer/trial/v4/en/seasons/${season.value}/schedules.json?api_key=eby7tmh33kprfk87zwh95zkx`
  );

  fetch(request)
    .then((response) => response.json())
    .then((data) => {
      let match = data.schedules;

      match.forEach((v, i) => {
        // data from json
        team1 = v.sport_event.competitors[0].name;
        team2 = v.sport_event.competitors[1].name;
        score1 = v.sport_event_status.home_score;
        score2 = v.sport_event_status.away_score;
        matchDate = v.sport_event.start_time;
        stadiumName = v.sport_event.venue.city_name;
        eventID = v.sport_event.id;

        if (score1 == undefined) {
          html = `
      <tr id="${eventID}" class = "rows">
        <td>${team1}</td>
        <td>${team2}</td>
        <td>${v.sport_event_status.status.toUpperCase()}</td>
        <td>${matchDate.slice(0, 10)}</td>
        <td> - </td>
        <td>${stadiumName}</td>
      </tr>`;
        } else {
          html = `    
      <tr id="${eventID}" class="rows">
        <td id = "team1-${i}">${team1}</td>
        <td id = "team2-${i}">${team2}</td>
        <td>${score1} - ${score2}</td>
        <td>${matchDate.slice(0, 10)}</td>
        <td>${v.sport_event_status.period_scores[1].home_score} - ${
            v.sport_event_status.period_scores[0].away_score
          }</td>
        <td>${stadiumName}</td>
      </tr>`;
        }

        firstRow.insertAdjacentHTML("afterend", html);

        // CHANGING BACKGROUND COLOR
        if (score1 > score2) {
          element1 = document.getElementById(`team1-${i}`);
          element1.classList.add(`winner`);
          element2 = document.getElementById(`team2-${i}`);
          element2.classList.add(`loser`);
        } else if (score1 < score2) {
          element1 = document.getElementById(`team1-${i}`);
          element1.classList.add(`loser`);
          element2 = document.getElementById(`team2-${i}`);
          element2.classList.add(`winner`);
        } else if (score1 == score2 && score1 !== undefined) {
          element1 = document.getElementById(`team1-${i}`);
          element1.classList.add(`draw`);
          element2 = document.getElementById(`team2-${i}`);
          element2.classList.add(`draw`);
        }
      });

      let rows = document.querySelectorAll(`.rows`);

      rows.forEach((v) => {
        v.addEventListener(`click`, function () {
          timelineDiv.innerHTML = "";

          let request2 = new Request(
            `https://api.sportradar.us/soccer/trial/v4/en/sport_events/${v.id}/timeline.json?api_key=eby7tmh33kprfk87zwh95zkx`
          );

          fetch(request2)
            .then((response) => response.json())
            .then((data) => {
              data.timeline.forEach((v) => {
                timelineDiv.insertAdjacentHTML(
                  "afterbegin",
                  `<tr>
                  <td class="timeline">${v.type.replaceAll("_", " ")}</td>
                  <td class="timeline">${v.time.slice(11, 19)}</td>
                  </tr>`
                );
                scrollTo(0, 0);
              });
            });
        });
      });
    });
});
