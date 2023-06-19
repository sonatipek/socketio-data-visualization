$(document).ready(_ => {
    console.log("Enler Sayfası Hazır");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    // 
    socket.on('tableDatas', (data) => {
        createTheMostEmployees(data, '#tbody')
        
    });

    socket.on('olderEmployeeData', (data) => {
        data = JSON.parse(data);
        createTheMostEmployees(data, '#tbody', 'olderEmployee')

        $('.default').addClass('d-none');
        $('.lowestEmployee').remove();
        $('.highestEmployee').remove();
        $('.youngestEmployee').remove();
    });

    socket.on('youngestEmployeeData', (data) => {
        data = JSON.parse(data);
        createTheMostEmployees(data, '#tbody', 'youngestEmployee')
        
        $('.default').addClass('d-none');
        $('.lowestEmployee').remove();
        $('.highestEmployee').remove();
        $('.olderEmployee').remove();
    });

    socket.on('highestEmployeeData', (data) => {
        data = JSON.parse(data);
        createTheMostEmployees(data, '#tbody', 'highestEmployee')
        
        $('.default').addClass('d-none');
        $('.lowestEmployee').remove();
        $('.youngestEmployee').remove();
        $('.olderEmployee').remove();
    });

    socket.on('lowestEmployeeData', (data) => {
        data = JSON.parse(data);
        createTheMostEmployees(data, '#tbody', 'lowestEmployee')

        $('.default').addClass('d-none');
        $('.highestEmployee').remove();
        $('.youngestEmployee').remove();
        $('.olderEmployee').remove();
        
    });

    socket.on('highestDepartData', (data) => {
        $('#highest-department-text').html(data)
    
        
    });

    socket.on('popularCityData', (data) => {
        console.log(data);
        $('#popular-city-text').html(data)
        
        
    });


    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadNumberOfEmployeesByCities' mesajının gönderilmesi
    socket.emit('tableLoad');

    // En yaşlı çalışan butonu
    $('#btn__older').on('click', () => {
        socket.emit('tableLoadOlderEmployee');
    })

    // En genç çalışan butonu
    $('#btn__youngest').on('click', () => {
        socket.emit('tableLoadYoungestEmployee');
    })

    // En yüksek maaşlı butonu
    $('#btn__highest').on('click', () => {
        socket.emit('tableLoadHighestEmployee');
    })

    // En düşük maaşlı butonu
    $('#btn__lowest').on('click', () => {
        socket.emit('tableLoadLowestEmployee');
    })
    
    // Reset butonu
    $('#btn__reset').on('click', () => {
        $('.default').removeClass('d-none');
        $('.highestEmployee').remove();
        $('.youngestEmployee').remove();
        $('.olderEmployee').remove();
        $('.lowestEmployee').remove();
    })
    
    socket.emit('tableLoadHighestDepart');
    socket.emit('tableLoadPopularCity');
   


})


// Table Verilerini Oluşturan Fonksiyon
function createTheMostEmployees(data, selector, classNameEnter = "default") {
    let employeeDeatilsOfAcc = data;        
    let rowKeys = Object.keys(employeeDeatilsOfAcc['Çalışan']); 
    let allKeys = Object.keys(employeeDeatilsOfAcc);

    // filtrelenen satırların uzunluğu kadar 'tr' oluşturan, içerideki döngü ile bu oluşturulan tr'nin içerisine satırların verilerini ekleyip, içerideki döngünün çıkışında bu oluşturulan tr'yi dropdown içerisine ekleyen döngü
    for(let i = 0; i < rowKeys.length; i++) {
        var tr = document.createElement('tr');
        tr.className=classNameEnter;
        
        for (let j = 0; j < allKeys.length; j++) {
            let firsData = employeeDeatilsOfAcc[allKeys[j]];
            
            tr.innerHTML += `<td> ${firsData[rowKeys[i]]} </td>`;
        }
        
        $(selector).append(tr);
    }
}