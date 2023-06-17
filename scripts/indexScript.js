$(document).ready( _ =>{
    console.log("İndex Sayfası Hazır!");
    let tableBody = document.querySelector('#table-body')

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    // **Dinleyiciler**

    // Table Data Gelen Veri
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
    })


    // **Göndericiler**

    // Table Load Butonu Dinlendi, tableload dinleyicisine mesaj gönderildi
    $('#table-load').on('click', () => {
        socket.emit('tableLoad');
    });

})