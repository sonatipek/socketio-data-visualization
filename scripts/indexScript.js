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
        let tableLenght = tableData['Çalışan'].length;

        // Create Çalışanlar Row
        for (let i = 0; i < tableLenght; i++) {
        let employeeData = tableData['Çalışan'][i];
        let departmentData = tableData['Departman'][i];
        let ageData = tableData['Yaş'][i];
        let cityData = tableData['Semt'][i];
        let salaryData = tableData['Maaş'][i];
        
        let tr = document.createElement('tr');
        tr.innerHTML = `<td> ${employeeData} </td>`;
        tr.innerHTML += `<td> ${departmentData} </td>`;
        tr.innerHTML += `<td> ${ageData} </td>`;
        tr.innerHTML += `<td> ${cityData} </td>`;
        tr.innerHTML += `<td> ${salaryData} </td>`;
        
        tableBody.append(tr);            
        }

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