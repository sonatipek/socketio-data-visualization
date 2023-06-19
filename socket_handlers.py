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
    'Departman': ['İnsan Kaynakları','Bilgi İşlem','Muhasebe','İnsan Kaynakları','Bilgi İşlem','Muhasebe','Bilgi İşlem'],
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



@app.sio.on('loadDepartmentPageData')
async def loadDepartmentPageData(sid, *args, **kwargs):
    numberOfEmployees = dataSeries.groupby('Departman')['Çalışan'].count() #Departmana göre çalışan sayısı
    await sio.emit('numberofEmployees', numberOfEmployees.to_json())


@app.sio.on('accDetail')
async def accDetail(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Departman').get_group('Muhasebe')[['Çalışan', 'Maaş', 'Yaş', 'Semt']] #Muhasebe departmanına göre calisan, maas, yas ve semt bilgileri
    clickCounter = args[0]
    
    if(clickCounter <= 1):
        await sio.emit('accDetailData', employeeDeatilsOfAcc.to_json())
    
@app.sio.on('hrDetail')
async def hrDetail(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Departman').get_group('İnsan Kaynakları')[['Çalışan', 'Maaş', 'Yaş', 'Semt']] #İnsan Kaynakları departmanına göre calisan, maas, yas ve semt bilgileri
    clickCounter = args[0]
    
    if(clickCounter <= 1):
        await sio.emit('hrDetailData', employeeDeatilsOfAcc.to_json())
    
@app.sio.on('itDetail')
async def itDetail(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Departman').get_group('Bilgi İşlem')[['Çalışan', 'Maaş', 'Yaş', 'Semt']] #Bilgi İşlem departmanına göre calisan, maas, yas ve semt bilgileri
    clickCounter = args[0]
    
    if(clickCounter <= 1):
        await sio.emit('itDetailData', employeeDeatilsOfAcc.to_json())
    


@app.sio.on('loadDepartmentChart')
async def loadDepartmentChart(sid, *args, **kwargs):
    numberOfEmployees = dataSeries.groupby('Departman')['Çalışan'].count() #Departmana göre çalışan sayısı
    avgAgeByDepartment = dataSeries.groupby('Departman')['Yaş'].mean() # departmana göre yaş ortalaması
    avgSalaryByDepartment = dataSeries.groupby('Departman')['Maaş'].mean() # departmana göre yaş ortalaması
    totalSalaryExpandByDepertment = dataSeries.groupby('Departman')['Maaş'].sum() # Departmandaki toplam maaş harcaması
    allDatas = pd.Series(data=[numberOfEmployees, avgAgeByDepartment, avgSalaryByDepartment, totalSalaryExpandByDepertment], index=['Çalışan Sayısı', 'Yaş Ortalaması', 'Maaş Ortalaması', 'Toplam Maaş Harcaması'])

    await sio.emit('echartDepartmentData', allDatas.to_json())


@app.sio.on('loadPageForEmployeCount')
async def loadPageForEmployeCount(sid, *args, **kwargs):
    numberOfEmployees = dataSeries.groupby('Semt')['Çalışan'].count() #Semte göre çalışan sayısı
    await sio.emit('numberofEmployeesByCities', numberOfEmployees.to_json())


@app.sio.on('kadikoyDetail')
async def kadıkoyDetail(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Semt').get_group('Kadıköy')[['Çalışan', 'Maaş', 'Yaş', 'Semt']] #Kadıköy semtine göre calisan, maas, yas ve semt bilgileri
    clickCounter = args[0]

    if(clickCounter <= 1):
        await sio.emit('kadikoyData', employeeDeatilsOfAcc.to_json())


@app.sio.on('maltepeDetail')
async def maltepeDetail(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Semt').get_group('Maltepe')[['Çalışan', 'Maaş', 'Yaş', 'Semt']] #Kadıköy semtine göre calisan, maas, yas ve semt bilgileri
    clickCounter = args[0]
        
    if(clickCounter <= 1):
        await sio.emit('maltepeData', employeeDeatilsOfAcc.to_json())


@app.sio.on('tuzlaDetail')
async def tuzlaDetail(sid, *args, **kwargs):
    employeeDeatilsOfAcc = dataSeries.groupby('Semt').get_group('Tuzla')[['Çalışan', 'Maaş', 'Yaş', 'Semt']] #Kadıköy semtine göre calisan, maas, yas ve semt bilgileri
    clickCounter = args[0]
    
    if(clickCounter <= 1):
        await sio.emit('tuzlaData', employeeDeatilsOfAcc.to_json())

@app.sio.on('loadCitiesChart')
async def loadCitiesChart(sid, *args, **kwargs):
    numberOfEmployees = dataSeries.groupby('Semt')['Çalışan'].count() #Semte göre çalışan sayısı
    avgAgeByCities = dataSeries.groupby('Semt')['Yaş'].mean() # Semte göre yaş ortalaması
    avgSalaryByCities = dataSeries.groupby('Semt')['Maaş'].mean() # Semte göre yaş ortalaması
    allAgesByCities = dataSeries.groupby('Semt')['Yaş'].apply(list) # Semtlere göre tüm yaşlar
    totalSalaryExpandByCities = dataSeries.groupby('Semt')['Maaş'].sum() # Semtlerdeki toplam maaş harcaması
    allDatas = pd.Series(data=[numberOfEmployees, avgAgeByCities, avgSalaryByCities, totalSalaryExpandByCities, allAgesByCities ], index=['Çalışan Sayısı', 'Yaş Ortalaması', 'Maaş Ortalaması', 'Toplam Maaş Harcaması', 'Semtlere Göre Tüm Yaşlar'])
    
    
    await sio.emit('citiesChartData', allDatas.to_json())


@app.sio.on('tableLoadOlderEmployee')
async def tableLoadOlderEmployee(sid, *args, **kwargs):
    olderEmployee = dataSeries[dataSeries['Yaş'] == dataSeries['Yaş'].max()]

    await sio.emit('olderEmployeeData', olderEmployee.to_json())


@app.sio.on('tableLoadYoungestEmployee')
async def tableLoadYoungestEmployee(sid, *args, **kwargs):
    youngestEmployee = dataSeries[dataSeries['Yaş'] == dataSeries['Yaş'].min()]
    
    await sio.emit('youngestEmployeeData', youngestEmployee.to_json())


@app.sio.on('tableLoadHighestEmployee')
async def tableLoadHighestEmployee(sid, *args, **kwargs):
    highestEmployee = dataSeries[dataSeries['Maaş'] == dataSeries['Maaş'].max()]

    await sio.emit('highestEmployeeData', highestEmployee.to_json())


@app.sio.on('tableLoadLowestEmployee')
async def tableLoadLowestEmployee(sid, *args, **kwargs):
    lowestEmployee = dataSeries[dataSeries['Maaş'] == dataSeries['Maaş'].min()]

    await sio.emit('lowestEmployeeData', lowestEmployee.to_json())



@app.sio.on('tableLoadHighestDepart')
async def tableLoadHighestDepart(sid, *args, **kwargs):
    lowestEmployee = dataSeries.groupby('Departman')['Maaş'].mean().idxmax()

    await sio.emit('highestDepartData', lowestEmployee)



@app.sio.on('tableLoadPopularCity')
async def tableLoadPopularCity(sid, *args, **kwargs):
    popularCity = dataSeries['Semt'].value_counts().idxmax()

    await sio.emit('popularCityData', popularCity)


@app.sio.on('maasaGoreArtan')
async def maasaGoreArtan(sid, *args, **kwargs):
    maasaGoreArtanVeriler = dataSeries.sort_values('Maaş').apply(list)
    

    await sio.emit('maasaGoreArtanData', maasaGoreArtanVeriler.to_json())


@app.sio.on('maasaGoreAzalan')
async def maasaGoreAzalan(sid, *args, **kwargs):
    maasaGoreAzalanVeriler = dataSeries.sort_values('Maaş',  ascending=False)
    
    await sio.emit('maasaGoreAzalanData', maasaGoreAzalanVeriler.to_json())


@app.sio.on('yasaGoreArtan')
async def yasaGoreArtan(sid, *args, **kwargs):
    yasaGoreArtanVeriler = dataSeries.sort_values('Yaş')

    await sio.emit('yasaGoreArtanData', yasaGoreArtanVeriler.to_json())


@app.sio.on('yasaGoreAzalan')
async def yasaGoreAzalan(sid, *args, **kwargs):
    yasaGoreAzalanVeriler = dataSeries.sort_values('Yaş',  ascending=False)

    await sio.emit('yasaGoreAzalanData', yasaGoreAzalanVeriler.to_json())



if __name__ == '__main__':
    import logging
    import sys

    logging.basicConfig(level=logging.DEBUG,
                        stream=sys.stdout)
    
    import uvicorn

    uvicorn.run("socket_handlers:app", host='127.0.0.1', port=8081, reload=True)