document.addEventListener("DOMContentLoaded", function () {
  let firstRow = document.querySelector("#firstRow");
  let team1, team2, score1, score2, html;

  let request = new Request(
    "https://api.sportradar.us/soccer/trial/v4/en/seasons/sr:season:77453/schedules.json?api_key=eby7tmh33kprfk87zwh95zkx"
  );

  fetch(request)
    .then((response) => response.json())
    .then((data) => {
      let match = data.schedules;

      match.forEach((v, i) => {
        team1 = v.sport_event.competitors[0].name;
        team2 = v.sport_event.competitors[1].name;
        score1 = v.sport_event_status.home_score;
        score2 = v.sport_event_status.away_score;

        if (score1 == undefined) {
          html = `
      <tr>
        <td>${team1} - ${team2}</td>
        <td>${v.sport_event_status.status.toUpperCase()}</td>
      </tr>`;
        } else {
          html = `    
      <tr>
        <td>${team1} - ${team2}</td>
        <td>${score1} - ${score2}</td>
      </tr>`;
        }

        firstRow.insertAdjacentHTML("afterend", html);
      });
    });
});
