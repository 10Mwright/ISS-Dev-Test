picasso.chart({
    element: document.getElementById('charting').querySelector('#barchart'),
    data: [
        {
            type: 'bar',
            data: [
                ['Month', 'Sales'],
                ['Jan', 1000],
                ['Feb', 2000],
                ['Mar', 4000],
            ],
        },
    ],
    settings: {
        scales: {
            y: {
                data: {field: 'Sales'},
                invert: true,
                include: [0]
            },
            c: {
                data: {field: 'Sales'},
                type: 'color'
            },
            t: {data: { extract: {field: 'Month'}}, padding: 0.3},
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
                        field: 'Month',
                        props: {
                            start: 0,
                            end: {field: 'Sales'}
                        }
                    }
                },
                settings: {
                    major: {scale: 't'},
                    minor: {scale: 'y'},
                    box: {
                        fill: {scale: 'c', ref:'end'}
                    }
                }
            }]
    }
});