$(document).ready( _ =>{
    console.log("Filtreler Sayfası Hazır!");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    // **Dinleyiciler**

    // .....
    socket.on('filterData', (data) => {
        let numberOfEmployees = JSON.parse(data);
        
        $('#acc-number').text(numberOfEmployees.Muhasebe);
        $('#it-number').text(numberOfEmployees.Bilgiİşlem);
        $('#hr-number').text(numberOfEmployees.İnsanKaynakları);
        
    })

    socket.on('accDetilData', data => {
        let employeeDeatilsOfAcc = JSON.parse(data);


        for (const key in employeeDeatilsOfAcc) {
            // if (Object.hasOwnProperty.call(object, key)) {
            //     const element = object[key];
                
            // }
            for (var key2 in employeeDeatilsOfAcc[key]) {
                let data = employeeDeatilsOfAcc[key];
                var test = document.createElement('li');
                test.className = "dropdown-item";

                test.innerHTML += data[key2];
                
            }
            $('#acc-dropdown').html(test)
        }
    })


    // **Göndericiler**
    // ....
    socket.emit('loadPageData');

    $('#acc-deatil').on('click', _ => socket.emit('accDeatil'))
    
    

})