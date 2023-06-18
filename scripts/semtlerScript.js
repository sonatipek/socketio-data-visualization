$(document).ready(_ => {
    console.log("Semtler Sayfası Hazır");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    // Socket.io üzerinden gelen semt bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('numberofEmployeesByCities', (data) => {
        let numberOfEmployees = JSON.parse(data);
        
        $('#kadikoy-number').text(numberOfEmployees['Kadıköy']);
        $('#maltepe-number').text(numberOfEmployees['Maltepe']);
        $('#tuzla-number').text(numberOfEmployees['Tuzla']);
        
    });



    // Socket.io üzerinden gelen verilerin alınması ve detayları gör dropdownu içinde tablolaştırılması | Kadıköy
    socket.on('kadikoyData', (data) => {
        createTableByCity(data, '#kadikoy-dropdown');
    });
    
    // Socket.io üzerinden gelen verilerin alınması ve detayları gör dropdownu içinde tablolaştırılması | Maltepe
    socket.on('maltepeData', (data) => {
        createTableByCity(data, '#maltepe-dropdown');
    });
    
    // Socket.io üzerinden gelen verilerin alınması ve detayları gör dropdownu içinde tablolaştırılması | Tuzla
    socket.on('tuzlaData', (data) => {
        createTableByCity(data, '#tuzla-dropdown');
    });

    


    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadNumberOfEmployeesByCities' mesajının gönderilmesi
    socket.emit('loadPageForEmployeCount');

    // Kadıköy Detay butonuna tıklandıgında 'kadıkoyDetail' mesajının gönderilmesi
    // Beraberinde tanımlanan click counter ile verilerin tekrar tekrar gönderilmesi engelleniyor
    let kadikoyClickCounter = 0;
    $('#kadikoy-detail').on('click', _ => {
        socket.emit('kadikoyDetail', kadikoyClickCounter += 1);
    })

    // Maltepe Detay butonuna tıklandıgında 'kadıkoyDetail' mesajının gönderilmesi
    // Beraberinde tanımlanan click counter ile verilerin tekrar tekrar gönderilmesi engelleniyor
    let maltepeClickCounter = 0;
    $('#maltepe-detail').on('click', _ => {
        socket.emit('maltepeDetail', maltepeClickCounter += 1);
    })

    // Tuzla Detay butonuna tıklandıgında 'kadıkoyDetail' mesajının gönderilmesi
    // Beraberinde tanımlanan click counter ile verilerin tekrar tekrar gönderilmesi engelleniyor
    let tuzlaClickCounter = 0;
    $('#tuzla-detail').on('click', _ => {
        socket.emit('tuzlaDetail', tuzlaClickCounter += 1);
    })


})


// Dropdown Verilerini Oluşturan Fonksiyon
function createTableByCity(data, selector) {
    let employeeDeatilsOfAcc = JSON.parse(data);        
    let rowKeys = Object.keys(employeeDeatilsOfAcc['Çalışan']); 
    let allKeys = Object.keys(employeeDeatilsOfAcc); 

    // filtrelenen satırların uzunluğu kadar 'tr' oluşturan, içerideki döngü ile bu oluşturulan tr'nin içerisine satırların verilerini ekleyip, içerideki döngünün çıkışında bu oluşturulan tr'yi dropdown içerisine ekleyen döngü
    for(let i = 0; i < rowKeys.length; i++) {
        let tr = document.createElement('tr');
        
        for (let j = 0; j < allKeys.length; j++) {
            let firsData = employeeDeatilsOfAcc[allKeys[j]];
            
            tr.innerHTML += `<td> ${firsData[rowKeys[i]]} </td>`;
        }
        
        $(selector).append(tr);
    }   
}