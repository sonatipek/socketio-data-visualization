$(document).ready( _ =>{
    console.log("İndex Sayfası Hazır!");
    let tableBody = document.querySelector('#table-body')

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    // **Dinleyiciler**

    // Table Data Gelen Veri ve Verinin Kullanılması
    socket.on('tableDatas', (tableData) => {
        createTable(tableData, '#table-body')

        appendAlert('Tablo başarıyla yüklendi!', 'success'); //notify the user of successful feedback
        
    })


    // **Göndericiler**

    // Table Load Butonu Dinlendi, tableload dinleyicisine mesaj gönderildi
    $('#table-load').on('click', () => {
        socket.emit('tableLoad');

        $('#table-load').attr('disabled', '');
    });

})


// Show Alert Function with BS
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
function appendAlert(message, type){

    const wrapper = document.createElement('div')
    wrapper.style.transition = "all .5s";
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)

    setTimeout(() => {
        wrapper.remove();
    }, 5000);
}

function createTable(data, selector) {
    let employeeDeatilsOfAcc = data;        
    let rowKeys = Object.keys(employeeDeatilsOfAcc['Çalışan']); 
    let allKeys = Object.keys(employeeDeatilsOfAcc);

    // filtrelenen satırların uzunluğu kadar 'tr' oluşturan, içerideki döngü ile bu oluşturulan tr'nin içerisine satırların verilerini ekleyip, içerideki döngünün çıkışında bu oluşturulan tr'yi dropdown içerisine ekleyen döngü
    for(let i = 0; i < rowKeys.length; i++) {
        var tr = document.createElement('tr');
        
        for (let j = 0; j < allKeys.length; j++) {
            let firsData = employeeDeatilsOfAcc[allKeys[j]];
            
            tr.innerHTML += `<td> ${firsData[rowKeys[i]]} </td>`;
        }
        
        $(selector).append(tr);
    }
}