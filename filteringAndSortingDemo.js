import { LightningElement, wire } from 'lwc';
import getContact from '@salesforce/apex/fiteringAndSortingController.getContact';

export default class FilteringAndSortingDemo extends LightningElement {
    headings=["Id","Name","Email","Title","DoNotCall"]
    fullTableData = []
    filteredData = []
    timer
    filterBy = "Name"
    sortedBy="Name"
    sortedDirection = 'asc'

    @wire(getContact)
    contactHandler({data,error}){
        if(data){
            console.log(data)
            this.filteredData = data
            this.fullTableData = data
            this.filteredData= [...this.sortBy(data)]

        }if(error){
            console.log(error)
        }
    }

    get FilterByValue(){
        return [
            {label:"All",value:"All"},
            {label:"Id",value:"Id"},
            {label:"Name",value:"Name"},
            {label:"Email",value:"Email"},
            {label:"Title",value:"Title"},
            {label:"DoNotCall",value:"DoNotCall"}
        ]
    }

    get sortedByValue(){
        return [
            {label:"Id",value:"Id"},
            {label:"Name",value:"Name"},
            {label:"Email",value:"Email"},
            {label:"Title",value:"Title"}
        ]
    }

    filterByHandler(event){
        this.filterBy = event.target.value
    }

    filterHandler(event){
        const {value} = event.target
        window.clearTimeout(this.timer)
        if(value){
            this.timer = window.setTimeout(()=>{
                console.log('VALUE',value)
                this.filteredData = this.fullTableData.filter(eachObj=>{

                    if(this.filterBy === 'All'){
                        //Object.keys(eachObj) = ["Id","Name","Email","Title"]
                        // below logic will work for each and every field 
                        return Object.keys(eachObj).some(key=>{
                            console.log('true or false >>' ,eachObj[key].toString().toLowerCase().includes(value.toString()))
                            return eachObj[key].toString().toLowerCase().includes(value)
                        })
                    }else{
                        const val = eachObj[this.filterBy] ? eachObj[this.filterBy] :''
                        return val.toLowerCase().includes(value)
                    }
                  })
            },500)
            
        }else{
            this.filteredData = [...this.fullTableData];
        }
    }

    sortHandler(event){
        this.sortedBy = event.target.value
        this.filteredData = [...this.sortBy(this.filteredData)]
    }

    sortBy(data){
        const cloneData = [...data]
        cloneData.sort((a,b)=>{
            if(a[this.sortedBy] === b[this.sortedBy]){
                return 0
            }
            return this.sortedDirection === 'desc'?
            a[this.sortedBy] > b[this.sortedBy] ? -1:1 :
            a[this.sortedBy] < b[this.sortedBy] ? -1:1
        })

        return cloneData
    }
}