from fastapi import FastAPI
from fastapi_socketio import SocketManager
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sio = SocketManager(app=app)


data = {
    'Çalışan': ['Ahmet Yılmaz','Can Ertürk','Hasan Korkmaz','Cenk Saymaz','Ali Turan','Rıza Ertürk','Mustafa Can'],
    'Departman': ['İnsanKaynakları','Bilgiİşlem','Muhasebe','İnsanKaynakları','Bilgiİşlem','Muhasebe','Bilgiİşlem'],
    'Yaş': [30,25,45,50,23,34,42],
    'Semt': ['Kadıköy','Tuzla','Maltepe','Tuzla','Kadıköy','Tuzla','Maltepe'],
    'Maaş': [5000,3000,4000,3500,2750,6500,4500]
}

dataSeries = pd.DataFrame(data)  # Pandas İşlemleri yapabilmek için veriyi Pandas Serisi'ne çevirdim.

@app.get("/")
async def main():
    return {"message": "Sunucu Açık"}

# Data Set'i görebileceğim, yerine göre kullanabileceğim bi route açtım
@app.get("/dataset")
async def main():
    return data


# Table Data giden veri
@app.sio.on('tableLoad')
async def tableLoad(sid, *args, **kwargs):
    await sio.emit('tableDatas', data)



result = dataSeries.groupby('Semt').get_group('Kadıköy')['Çalışan'] # Semtlerden Kadıköyde oturan çalışanların adları.
result1 = dataSeries.groupby('Departman').get_group('Bilgiİşlem') # Departmanlardan 'Bilgi İşlem' bilgilerini getirir.
# result2 = dataSeries.groupby('Departman').sum() # Departmandaki sayısal değerleri toplar.
result3 = dataSeries.groupby('Departman')['Yaş'].mean() # Departmana göre yaş şeysi
result4 = dataSeries.groupby('Departman').min()[['Maaş','Yaş']] # departmana göre en düşük maaş ve yaş bilgilerini al
result5 = dataSeries.groupby('Semt')['Yaş'].mean() # semt bazında yaş ortalaması
result6 = dataSeries.groupby('Semt')['Çalışan'].count() # Semtlere göre çalışan sayılarını gösterir.
result7 = dataSeries.groupby('Semt').get_group('Kadıköy')['Çalışan'].count() # Semtlerden, Kadıköy'de çalışan sayısını gösterir.

@app.sio.on('loadPageData')
async def pandas_read(sid, *args, **kwargs):
    numberOfEmployees = dataSeries.groupby('Departman')['Çalışan'].count() #Departmana göre çalışan sayısı

    await sio.emit('filterData', numberOfEmployees.to_json())


@app.sio.on('accDeatil')
async def pandas_read(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Departman').get_group('Muhasebe')

    await sio.emit('accDetilData', employeeDeatilsOfAcc.to_json())


if __name__ == '__main__':
    import logging
    import sys

    logging.basicConfig(level=logging.DEBUG,
                        stream=sys.stdout)
    
    import uvicorn

    uvicorn.run("socket_handlers:app", host='127.0.0.1', port=8081, reload=True)