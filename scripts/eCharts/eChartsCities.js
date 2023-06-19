$(document).ready(_ => {
    console.log("eCharts Verileri Yüklendi");
    
    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });
    
    
    
    
    // **Dinleyiciler**
    // Socket.io üzerinden gelen semt bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('citiesChartData', (data) => {
        data = JSON.parse(data);
        
        // Chart Selectors
        let mainChart = echarts.init(document.getElementById('eChart-main'));
        let secondChart = echarts.init(document.getElementById('eChart-second'));
        let thirdChart = echarts.init(document.getElementById('eChart-third'));
        let fourthChart = echarts.init(document.getElementById('eChart-fourth'));
        
        // Data Spesifications
        let numberOfEmployees = data['Çalışan Sayısı'];
        let avgAgeByCity = data['Yaş Ortalaması'];
        let avgSalaryByCity = data['Maaş Ortalaması'];
        let totalSalaryExpandByCity = data['Toplam Maaş Harcaması'];
        let allAgesByCities = data['Semtlere Göre Tüm Yaşlar'];
        
        
        // Main Chart Option
        let mainOption = {
            title: {
                text: 'Semt Bazında Çalışan Verileri'
            },
            tooltip: {},
            legend: {
                data: ['Çalışan Sayısı', 'Ortalama Yaş']
            },
            xAxis: {
                data: Object.keys(numberOfEmployees)
            },
            yAxis: {  },
            series: [
                {
                name: 'Çalışan Sayısı',
                type: 'bar',
                data: Object.values(numberOfEmployees),
                color: 'purple'
                },
                {
                name: 'Ortalama Yaş',
                type: 'bar',
                data: Object.values(avgAgeByCity),
                color: 'orange'
                }
            ]
        };
        
        // Second Chart Options
        let secondOption = {
            title: {
                text: 'Semt Bazında Maaş Verileri',
                left: 'center'
            },
            tooltip: {},
            legend: {
                left: 'left',
                orient: 'vertical',
                data: ['Ortalama Maaş', 'Toplam Maaş Harcaması']
            },
            xAxis: {
                data: Object.keys(numberOfEmployees)
            },
            yAxis: {  },
            series: [
                {
                name: 'Ortalama Maaş',
                type: 'bar',
                data: Object.values(avgSalaryByCity),
                color: 'blue'
                },
                {
                name: 'Toplam Maaş Harcaması',
                type: 'bar',
                data: Object.values(totalSalaryExpandByCity),
                color: 'gray'
                }
            ]
        };

        // Third Chart Options
        let thirdOption = {
            title: {
                text: 'Semtlere Göre Ayrılan Maaş Dağılımı',
                subtext: 'Semtler bazında harcadığınız maaş bütçesi',
                left: 'center'
            },
            tooltip: {trigger: 'item', formatter: '{b}: {d}%'},
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [{
                name: "Maaş",
                type: 'pie',
                radius: '50%',
                data: Object.keys(totalSalaryExpandByCity).map(key => {
                    return {name: key, value: totalSalaryExpandByCity [key]}
                })
            }],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0,0,0, 0.5)'
                }
            }
        };

        

        // Fourtg Chart Options
        let fourthOption = {
            title: {
                text: 'Semtlerdeki Yaş Dağılımı',
                subtext: 'Her çizgi bir semti temsil eder. Tablo semtlerdeki yaş dağılımını gösterir.',
                left: 'center'
            },
            tooltip: {},
            xAxis: {
              type: 'category',
              data: Object.keys(allAgesByCities),
            },
            yAxis: {
              type: 'value',
              name: 'Yaş',
            },
            series:Object.values(allAgesByCities).map(function(item) {
                return {
                  name: Object.keys(allAgesByCities),
                  type: 'line',
                  data: item
                };
            }),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0,0,0, 0.5)'
                }
            }
          };
          
           
        
        mainChart.setOption(mainOption);
        secondChart.setOption(secondOption);
        thirdChart.setOption(thirdOption);
        fourthChart.setOption(fourthOption);

    });



    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadEChart' mesajının gönderilmesi
    socket.emit('loadCitiesChart');


})
    