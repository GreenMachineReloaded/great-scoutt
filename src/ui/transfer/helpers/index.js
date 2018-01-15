export function genQRCode (csvMatchString, QRCode) {
  return new Promise((resolve, reject) => {
    QRCode.toString(csvMatchString, { type: 'svg' }, (err, url) => {
      !err ? resolve(url) : reject(err);
    });
  });
}

export function createTeam (fields) {
  return {
    id: Number(fields[0]),
    name: fields[1],
    number: fields[2]
  };
}

export function createMatch (fields) {
  return {
    team: fields[0],
    tournament: Number(fields[1]),
    number: Number(fields[2]),
    matchId: fields[3],
    alliance: fields[4],
    comments: fields[5],
    data: {
      categories: [
        {
          name: 'Autonomous',
          rules: [
            {
              name: 'Alliance-specific Jewel remaining on platform',
              points: Number(fields[6])
            },
            {
              name: 'Glyph scored in Cryptobox',
              points: Number(fields[7])
            },
            {
              name: 'Glyph bonus for Cryptobox Key column',
              points: Number(fields[8])
            },
            {
              name: 'Robot parked in Safe Zone',
              points: Number(fields[9])
            }
          ]
        },
        {
          name: 'TeleOp',
          rules: [
            {
              name: 'Glyph scored in Cryptobox',
              points: Number(fields[10])
            },
            {
              name: 'Completed row of 3 in Cryptobox',
              points: Number(fields[11])
            },
            {
              name: 'Completed column of 4 in Cryptobox',
              points: Number(fields[12])
            },
            {
              name: 'Completed Cipher',
              points: Number(fields[13])
            }
          ]
        },
        {
          name: 'End Game',
          rules: [
            {
              name: 'Relic in Recovery Zone #1',
              points: Number(fields[14])
            },
            {
              name: 'Relic in Recovery Zone #2',
              points: Number(fields[15])
            },
            {
              name: 'Relic in Recovery Zone #3',
              points: Number(fields[16])
            },
            {
              name: 'Bonus for keeping Relic upright',
              points: Number(fields[17])
            },
            {
              name: 'Robot balanced on Balancing Stone',
              points: Number(fields[18])
            }
          ]
        }
      ]
    }
  };
}