$(document).ready(_ => {
    console.log("eCharts Verileri Yüklendi");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    // Socket.io üzerinden gelen departman bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('echartIndexData', (data) => {
        data = JSON.parse(data);
        
        // Chart Selectors
        let mainChart = echarts.init(document.getElementById('eChart-main'));
        
        // Data Spesifications
        let employeeNames = data['Çalışan'];
        let employeeAges = data['Yaş'];
        let employeeSalary = data['Maaş'];

        
        // Main Chart Option
        let mainOption = {
            title: {
                text: 'Çalışanların Yaş ve Maaş İlişkisi',
                subtext: 'Tüm çalışanlarınızın yaş ve maaş bilgileri tek tabloda',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: ['Yaş', 'Maaş'],
                left: 'left',
                orient: 'vertical'

            },
            xAxis: {
                data: Object.values(employeeNames)
            },
            yAxis: {  },
            series: [
                {
                name: 'Yaş',
                type: 'bar',
                data: Object.values(employeeAges),
                color: 'red'
                },
                {
                name: 'Maaş',
                type: 'bar',
                data: Object.values(employeeSalary),
                color: 'orange'
                }
            ]
        };


        mainChart.setOption(mainOption);
    });



    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadIndexChart ' mesajının gönderilmesi
    socket.emit('loadIndexChart');


});