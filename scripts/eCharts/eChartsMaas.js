$(document).ready(_ => {
    console.log("eCharts Verileri Yüklendi");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    // Socket.io üzerinden gelen departman bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('echartSalaryData', (data) => {
        data = JSON.parse(data);
        
        // Chart Selectors
        let mainChart = echarts.init(document.getElementById('eChart-main'));
        let secondChart = echarts.init(document.getElementById('eChart-second'));
        let thirdChart = echarts.init(document.getElementById('eChart-third'));
        
        // Data Spesifications
        let employeeNames = data['Çalışan'];
        let employeeSalary = data['Maaş'];

        
        // Main Chart Option
        let mainOption = {
            title: {
                text: 'Rakam Bazında Çalışanlara Ödenen Maaş',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: ['Maaş'],
                left: 'left',
                orient: 'vertical'

            },
            xAxis: {
                type: 'value',
            },
            yAxis: {  },
            series: [
                {
                    name: 'Maaş',
                    type: 'bar',
                    data: Object.values(employeeSalary),
                    color: 'orange',
                    showBackground: true,
                }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0,0,0, 0.5)'
                }
            }
        };

        // Second Chart Option
        let secondOption = {
            title: {
                text: 'Çalışanlara Ödenen Maaş Yüzdesi',
                subtext: 'Tüm çalışanlarınıza ödediğiniz ücretin diğer çalışanlara oranı',
                left: 'center'
            },
            tooltip: {trigger: 'item', formatter: '{b}: {d}%'},
            legend: {
                left: 'left',
                orient: 'vertical'

            },
            series: [
                {
                    name: 'Maaş',
                    type: 'pie',
                    radius: '70%',
                    data: Object.keys(employeeSalary).map(key => {
                        return {name: employeeNames[key], value: employeeSalary[key]}
                    })
                }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0,0,0, 0.5)'
                }
            }
        };

        // Third Chart Option
        let thirdOption = {
            title: {
                text: 'Çalışan Bazında Maaş Bilgisi',
                subtext: 'Tüm çalışanlarınızın maaş bilgileri tek tabloda.',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: ['Maaş'],
                left: 'left',
                orient: 'vertical'

            },
            xAxis: {
                type: "category",
                data: Object.values(employeeNames)
            },
            yAxis: {  },
            series: [
                {
                    name: 'Maaş',
                    type: 'bar',
                    data: Object.values(employeeSalary),
                    color: 'green',
                    showBackground: true,
                }
            ],
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
    // Sayfa yüklendiğinde 'loadSalaryChart ' mesajının gönderilmesi
    socket.emit('loadSalaryChart');


});