$(document).ready(_ => {
    console.log("Enler Sayfası Hazır");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    let clickCount = 0;
    socket.on('calculateData1', (data) => {
        clickCount++;
        salaryThatCanBeGiven = data

        if(clickCount <= 1){
            $('#calculate_1-text').append(`<li class="calculate-result1 list-group-item list-group-item-secondary"><b>Her Çalışana Verebileceğiniz Maksimum Maaş:</b> ${salaryThatCanBeGiven} ₺</li>`)
            
        }else{
            $('.calculate-result1').remove()
            $('#calculate_1-text').append(`<li class="calculate-result1 list-group-item list-group-item-secondary"><b>Her Çalışana Verebileceğiniz Maksimum Maaş:</b> ${salaryThatCanBeGiven} ₺</li>`)

        }
    });

    clickCount = 0;
    socket.on('calculateData2', (data) => {
        clickCount++;
        numberOfEmployee = data

        if(clickCount <= 1){
            $('#calculate_2-text').append(`<li class="calculate-result2 list-group-item list-group-item-secondary"><b>Bütçenize Göre İşe Alabileceğiniz İşçi Sayısı:</b> ${numberOfEmployee}</li>`)
            
        }else{
            $('.calculate-result2').remove()
            $('#calculate_2-text').append(`<li class="calculate-result2 list-group-item list-group-item-secondary"><b>Bütçenize Göre İşe Alabileceğiniz İşçi Sayısı:</b> ${numberOfEmployee}</li>`)

        }
    });



    // **Göndericiler**

    $('#btn__calculate1').on('click', (e) => {
        e.preventDefault();
        let person_1 = $('#person_1').val();
        let budget_1 = $('#budget_1').val();

        
        socket.emit('calculate1', [person_1, budget_1] )
    })


    $('#btn__calculate2').on('click', (e) => {
        e.preventDefault();

        let budget_2 = $('#budget_2').val();
        let minSalary = $('#minSalary_2').val();

        socket.emit('calculate2', [budget_2, minSalary]);
    })
})