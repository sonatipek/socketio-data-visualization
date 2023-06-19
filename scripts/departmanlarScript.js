$(document).ready( _ =>{
    console.log("Filtreler Sayfası Hazır!");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    // **Dinleyiciler**

    // Socket.io üzerinden gelen departman bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('numberofEmployees', (data) => {
        let numberOfEmployees = JSON.parse(data);
        
        $('#acc-number').text(numberOfEmployees['Muhasebe']);
        $('#it-number').text(numberOfEmployees['Bilgi İşlem']);
        $('#hr-number').text(numberOfEmployees['İnsan Kaynakları']);
        
    })

    // Socket.io üzerinden gelen verilerin alınması ve detayları gör dropdownu içinde tablolaştırılması | Muhasebe Departmanı
    socket.on('accDetailData', data => {
        createTableByDepartment(data, "#acc-dropdown");
    });

    // Socket.io üzerinden gelen verilerin alınması ve detayları gör dropdownu içinde tablolaştırılması | Bilgi İşlem Departmanı
    socket.on('itDetailData', data => {
        createTableByDepartment(data, "#it-dropdown"); 
    });

    // Socket.io üzerinden gelen verilerin alınması ve detayları gör dropdownu içinde tablolaştırılması | İnsan Kaynakları Departmanı
    socket.on('hrDetailData', (data) => {
        createTableByDepartment(data, "#hr-dropdown");
    });


    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadDepartmentPageData' mesajının gönderilmesi
    socket.emit('loadDepartmentPageData');
    
    // Muhasebe detay dropdown butonuna tıklandığında 'accDeatil' mesajının gönderilmesi
    // Beraberinde giden click counter ile verilerin tekrar tekrar yüklenmesini engelliyoruz
    let accClickCounter = 0;
    $('#acc-detail').on('click', _ => socket.emit('accDetail', accClickCounter += 1));
    
    
    // İnsan Kaynakları detay dropdown butonuna tıklandığında 'accDeatil' mesajının gönderilmesi
    // Beraberinde giden click counter ile verilerin tekrar tekrar yüklenmesini engelliyoruz
    let hrClickCounter = 0;
    $('#hr-detail').on('click', _ => socket.emit('hrDetail', hrClickCounter += 1));

    // Bilgi İşlem detay dropdown butonuna tıklandığında 'accDeatil' mesajının gönderilmesi
    // Beraberinde giden click counter ile verilerin tekrar tekrar yüklenmesini engelliyoruz
    let itClickCounter = 0;
    $('#it-detail').on('click', _ => socket.emit('itDetail', itClickCounter += 1));
    
    

})


// Dropdown Verilerini Oluşturan Fonksiyon
function createTableByDepartment(data, selector) {
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