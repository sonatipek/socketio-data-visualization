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
        salaryThatCanBeGiven = data[0]
        remainingBudget = data[1]
        if(clickCount <= 1){
            $('#calculate_1-text').append(`<li class="calculate-result1 list-group-item list-group-item-secondary"><b>Her Çalışana Verebileceğiniz Maksimum Maaş:</b> ${salaryThatCanBeGiven}</li>`)
            $('#calculate_1-text').append(`<li class="calculate-result1 list-group-item list-group-item-secondary"><b>Girilen Bütçeye Göre Şu Anki Maaşlar Çıkınca Kalan Bütçe:</b> ${remainingBudget}</li>`)
            
        }else{
            $('.calculate-result1').remove()
            $('#calculate_1-text').append(`<li class="calculate-result1 list-group-item list-group-item-secondary"><b>Her Çalışana Verebileceğiniz Maksimum Maaş:</b> ${salaryThatCanBeGiven}</li>`)
            $('#calculate_1-text').append(`<li class="calculate-result1 list-group-item list-group-item-secondary"><b>Girilen Bütçeye Göre Şu Anki Maaşlar Çıkınca Kalan Bütçe:</b> ${remainingBudget}</li>`)

        }
    });



    // **Göndericiler**

    $('#btn__calculate1').on('click', (e) => {
        e.preventDefault();
        let person_1 = $('#person_1').val();
        let budget_1 = $('#budget_1').val();

        
        socket.emit('calculate1', [person_1, budget_1] )
    })

})