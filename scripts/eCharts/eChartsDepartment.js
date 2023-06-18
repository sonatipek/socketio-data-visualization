$(document).ready(_ => {
    console.log("eCharts Verileri Yüklendi");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    // Socket.io üzerinden gelen departman bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('eChartData', (data) => {
        data = JSON.parse(data);

        // Chart Selectors
        let mainChart = echarts.init(document.getElementById('eChart-main'));
        let secondChart = echarts.init(document.getElementById('eChart-second'));
        let thirdChart = echarts.init(document.getElementById('eChart-third'));
        
        // Data Spesifications
        let numberOfEmployees = data['Çalışan Sayısı'];
        let avgAgeByDepartment = data['Yaş Ortalaması'];
        let avgSalaryByDepartment = data['Maaş Ortalaması'];
        let totalSalaryExpandByDepertment = data['Toplam Maaş Harcaması'];

        
        // Main Chart Option
        let mainOption = {
            title: {
                text: 'Departman Bazında Çalışan Verileri'
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
                color: 'red'
                },
                {
                name: 'Ortalama Yaş',
                type: 'bar',
                data: Object.values(avgAgeByDepartment),
                color: 'orange'
                }
            ]
        };

        // Second Chart Options
        let secondOption = {
            title: {
                text: 'Departman Bazında Maaş Verileri',
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
                data: Object.values(avgSalaryByDepartment),
                color: 'blue'
                },
                {
                name: 'Toplam Maaş Harcaması',
                type: 'bar',
                data: Object.values(totalSalaryExpandByDepertment),
                color: 'purple'
                }
            ]
        };
        

        // Third Chart Options
        let thirdOption = {
            title: {
                text: 'Departmanlara Ayrılan Maaş Dağılımı',
                subtext: 'Departmanlar bazında harcadığınız maaş bütçesi',
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
                data: Object.keys(totalSalaryExpandByDepertment).map(key => {
                    return {name: key, value: totalSalaryExpandByDepertment [key]}
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
        
        
        mainChart.setOption(mainOption);
        secondChart.setOption(secondOption);
        thirdChart.setOption(thirdOption);
    });



    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadEChart' mesajının gönderilmesi
    socket.emit('loadEChart');


})
    