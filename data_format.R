setwd('~/Google Drive/roo_web/')

people<-read.csv('data/people_info.csv')


##### Area Chart Format

cities<-sort(unique(people$city))
cities<-as.character(cities)
cities<-c(cities[-c(1,4,5,7)],"Other")
years<-2015:2020

area_table<-array(0,dim=c(length(years),length(cities)))
colnames(area_table)<-cities
for(ii in 1:nrow(people)){
  city_ii<-as.character(people$city[ii])
  
  if(city_ii %in%c("Boston","Washington DC","New York","Philadelphia","San Fransisco","Chicago")){
    area_table[,city_ii]<-area_table[,city_ii]+as.numeric(people[ii,5:10])
  }else(
    area_table[,'Other']<- area_table[,'Other']+as.numeric(people[ii,5:10])
  )
}

area_table<-cbind(area_table,years)
write.csv(area_table,'data/area_table.csv',row.names = FALSE)



## Cartogram
states<-as.character(sort(unique(people$state)))

years<-2015:2020

area_table<-array(0,dim=c(length(years),length(states)))
colnames(area_table)<-states
for(ii in 1:nrow(people)){
  state_ii<-as.character(people$state[ii])
  area_table[,state_ii]<-area_table[,state_ii]+as.numeric(people[ii,5:10])

}
area_table<-cbind(area_table,years)


area_table<-rbind(area_table,
                  c(table(people$state
                  ),"All"))



write.csv(area_table,'data/cart_table',row.names = FALSE)

