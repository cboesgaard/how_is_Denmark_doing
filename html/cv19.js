var urlParams = new URLSearchParams(window.location.search);
var urlCountryArray = [];
if (urlParams.has('country')) {
    urlCountryArray = urlParams.get('country').split(',').map(function(country) {return country.toLocaleLowerCase();})
}
var docTitle = document.title;
var logScales = false;
var chart1, chart2, chart3;
var optionsLinearScales = {
    yAxis: {
        type: "linear"
    }
};
var optionsLogScales = {
    yAxis: {
        type: "logarithmic"
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var s = [];
    var titleCountries = [];
    $.getJSON(dataFile1, function(data) {  
        for (i in data) {
            c = data[i];
            if (urlCountryArray.length == 0 || urlCountryArray.indexOf(c.name.toLocaleLowerCase()) > -1) {
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
                s.push(x);
                titleCountries.push(c.name);
            }
        }
        chart1 = Highcharts.chart('containerDeadPerCapita', {
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
        if (urlParams.has('country')) {
            document.title = titleCountries.join(",") + ": " + docTitle;
        }
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
        chart2 = Highcharts.chart('containerCumulativeDeaths', {
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
        chart3 = Highcharts.chart('containerDailyDeaths', {
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

$("#logButton").click(function() {
    if (logScales) {
        logScales = false;
        chart1.update(optionsLinearScales);
        chart2.update(optionsLinearScales);
        chart3.update(optionsLinearScales);
    }
    else {
        logScales = true;
        chart1.update(optionsLogScales);
        chart2.update(optionsLogScales);
        chart3.update(optionsLogScales);
    }
});