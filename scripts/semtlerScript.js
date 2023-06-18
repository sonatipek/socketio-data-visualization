$(document).ready(_ => {
    console.log("eCharts Verileri Yüklendi");

    // Socket.io Tanımlaması
    const socket = io("http://localhost:8081", {
        transports: ["websocket", "polling", "flashsocket"],
        path: "/ws/socket.io",
    });


    
    
    // **Dinleyiciler**
    // Socket.io üzerinden gelen departman bazında çalışanların sayısı verilerinin alınması ve bu numaraların DOM üzerinde yerleştirilmesi
    socket.on('', (data) => {
        data = JSON.parse(data);
    });

        

        
        
        


    // **Göndericiler**
    // Sayfa yüklendiğinde 'loadPageData' mesajının gönderilmesi
    socket.emit('');


})
    