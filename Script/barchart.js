setTimeout(function () { //Delay to avoid undefined variable
    for(var i = 0; i < chartData[i].length; i++) {
        for(var z = 0; z < chartData.length; z++) {
          console.log(chartData[z][i]);
        }
      }

    picasso.chart({
        element: document.getElementById('charting').querySelector('#barchart'),
        data: [
            {
                type: 'bar',
                data: chartData,
            },
        ],
        settings: {
            scales: {
                y: {
                    data: { field: 'Sales' },
                    invert: true,
                    include: [0]
                },
                c: {
                    data: { field: 'Sales' },
                    type: 'color'
                },
                t: { data: { extract: { field: 'IFA' } }, padding: 0.3 },
            },
            components: [
                {
                    type: 'axis',
                    scale: 'y',
                    dock: 'left'
                },
                {
                    type: 'axis',
                    scale: 't',
                    dock: 'bottom'
                },
                {
                    key: 'bars',
                    type: 'box',
                    data: {
                        extract: {
                            field: 'IFA',
                            props: {
                                start: 0,
                                end: { field: 'Sales' }
                            }
                        }
                    },
                    settings: {
                        major: { scale: 't' },
                        minor: { scale: 'y' },
                        box: {
                            fill: { scale: 'c', ref: 'end' }
                        }
                    }
                }]
        }
    });
}, 2000);