var urlParams = new URLSearchParams(window.location.search);
var urlCountryArray = [];
if (urlParams.has('country')) {
    urlCountryArray = urlParams.get('country').split(',').map(function(country) {return country.toLocaleLowerCase();})
}

document.addEventListener('DOMContentLoaded', function () {
    var s = [];
    $.getJSON(dataFile1, function(data) {  
        for (i in data) {
            c = data[i];
            var x = {
                name: c.name,
                type: 'spline',
                tooltip: {
                    valueDecimals: 4
                },
                marker: {
                    enabled: false
                },
                data: c.data.map(d => d.value)
            }
            if (urlCountryArray.length == 0 || urlCountryArray.indexOf(c.name.toLocaleLowerCase()) > -1) {
                s.push(x);
            }
        }
        var myChart = Highcharts.chart('containerDeadPerCapita', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Cumulative deaths per one million population'
            },
            xAxis: {
                title: {
                    text: 'days since one death per one million population reached'
                }
                
            },
            yAxis: {
                title: {
                    text: 'Cumulative death per one million population'
                }
            },
            series: s
        });
    });

    var s2=[]
    $.getJSON(dataFile2, function(data) {
        for (i in data) {
            c = data[i];
            var x = {
                name: c.name,
                type: 'spline',
                tooltip: {
                    valueDecimals:0
                },
                marker: {
                    enabled: false
                },
                data: c.data.map(d => d.value)
            }
            if (urlCountryArray.length == 0 || urlCountryArray.indexOf(c.name.toLocaleLowerCase()) > -1) {
                s2.push(x);
            }
        }
        var myChartCumulDeath = Highcharts.chart('containerCumulativeDeaths', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Cumulative deaths'
            },
            xAxis: {
                title: {
                    text: 'Days since first reported death'
                }
            },
            yAxis: {
                title: {
                    text: 'Cumulative deaths'
                }
            },
            series: s2
        })
    });

    var s3 = [];
    $.getJSON(dataFile3, function(data) {
        for (i in data) {
            c = data[i];
            var x = {
                name: c.name,
                type: 'spline',
                tooltip: {
                    valueDecimals: 0
                },
                marker: {
                    enabled: false
                },
                data: c.data.map(d => d.value)
            }
            if (urlCountryArray.length == 0 || urlCountryArray.indexOf(c.name.toLocaleLowerCase()) > -1) {
                s3.push(x);
            }
        }
        var myChartDailyDeath = Highcharts.chart('containerDailyDeaths', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Daily deaths'
            },
            xAxis: {
                title: {
                    text: 'Days since first reported death'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of deaths per day'
                }
            },
            series: s3

        })
    });
});
