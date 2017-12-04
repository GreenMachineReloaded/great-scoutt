```
{
  "0": [                              // string id of team
    {
      "tournamentId": 0,              // Links this match to tournament it's in
      "matchNumber": 5,
      "id": "0-5",                    // id of match (<tournamentId>-<matchNumber>), used to link matches together
      "win": true,
      "ally": 1,                      // ally team id
      "opponents": [6, 7],            // opponent team ids
      "data": {                       // Stores all data about this teams performance in the match, format is dynamically generated from game-config.js
        "categories": [
          {
            "name": "Autonomous",
            "rules": [
              {
                "name": "Alliance-specific Jewel remaining on platform",
                "value": 30
              },
              {
                "name": "Glyph scored in Cryptobox",
                "value": 15
              },
              {
                "name": "Glyph bonus for Cryptobox Key column",
                "value": 30
              },
              {
                "name": "Robot parked in Safe Zone",
                "value": 10
              }
            ]
          },
          {
            "name": "TeleOp",
            "rules": [
              {
                "name": "Glyph scored in Cryptobox",
                "value": 2
              },
              {
                "name": "Completed row of 3 in Cryptobox",
                "value": 10
              },
              {
                "name": "Completed column of 4 in Cryptobox",
                "value": 20
              },
              {
                "name": "Completed Cipher",
                "value": 30
              }
            ]
          },
          {
            "name": "End Game",
            "rules": [
              {
                "name": "Relic in Recovery Zone #1",
                "value": 10
              },
              {
                "name": "Relic in Recovery Zone #2",
                "value": 20
              },
              {
                "name": "Relic in Recovery Zone #3",
                "value": 40
              },
              {
                "name": "Bonus for keeping Relic upright",
                "value": 15
              },
              {
                "name": "Robot balanced on Balancing Stone",
                "value": 20
              }
            ]
          }
        ]
      }
    }
  ]
}
```

Notes: I'm using team ids to reference teams because it's a more permanent
method of tracking teams across multiple seasons when their names or numbers could change.
