
/// Reports class. 
// Main implementation- helps calculate the # of days available for a vacant reservation 
// 7-1-24 7-4-24 _____  7-13-24 7-20-24 = 10 days available? 

class Reports{

    //variables
    res = [];   //holds an array of reservations
    notres=[];  //holds sites that have no reservations

    //constructor - fills class res array
    constructor(...records){
        for(let rec of records){
            this.res.push(rec);
        }
        
    }

    //other functions

    // fills notres array (array of sites that have not been reserved.)
    getNoRes(...records){
        console.log("\n\nNotRes reports: ")
        for(let rec of records){
            this.notres.push(rec);
        }
        for(let rec of this.notres){
            let today = new Date();
                                        // 7 months of time
            let limit = new Date(today.getTime()+18408222000)
            rec.days=limit;
            rec.consoleReport;
        }
    }

    //separates all records into different arrays with the same site_id
    separateRecords(...records){
        let sites=[]
        for(let rec of records){
            switch(rec.siteID){
                case '1':
                    sites.one.push(rec);
                    break;

                case '2':
                    sites.two.push(rec);
                    break;
                    
                case '3':
                    sites.three.push(rec);
                    break;
                
                case '4':
                    sites.four.push(rec);
                    break;
                
                case '5':
                    sites.five.push(rec);
                    break;
                
                case '6':
                    sites.six.push(rec);
                    break;
                
                case '7':
                    sites.seven.push(rec);
                    break;
                
                case '8':
                    sites.eight.push(rec);
                    break;
                
                case '9':
                    sites.nine.push(rec);
                    break;
                
                case '10':
                    sites.ten.push(rec);
                    break;
                
                case '11':
                    sites.s11.push(rec);
                    break;
                
                case '11B':
                    sites.s11B.push(rec);
                    break;
                
                case '12':
                    sites.s12.push(rec);
                    break;
                
                case '12B':
                    sites.s12B.push(rec);
                    break;
                
                case '13':
                    sites.s13.push(rec);
                    break;
                
                case '14':
                    sites.s14.push(rec);
                    break;
                
                case '16':
                    sites.s16.push(rec);
                    break;
                
                case '17':
                    sites.s17.push(rec);
                    break;
                
                case '18':
                    sites.s18.push(rec);
                    break;
                
                case '19':
                    sites.s19.push(rec);
                    break;
                
                case '20':
                    sites.s20.push(rec);
                    break;
                    
                case '21':
                    sites.s21.push(rec);
                    break;
                
                case '22':
                    sites.s22.push(rec);
                    break;
                
                case '23':
                    sites.s23.push(rec);
                    break;
                
                case '24':
                    sites.s24.push(rec);
                    break;
                
                case '25':
                    sites.s25.push(rec);
                    break;
                
                case '26':
                    sites.s26.push(rec);
                    break;
                
                case '27':
                    sites.s27.push(rec);
                    break;
                
                case '28':
                    sites.s28.push(rec);
                    break;
                
                case '29':
                    sites.s29.push(rec);
                    break;
                
                case '30':
                    sites.s30.push(rec);
                    break;
                
                case '31':
                    sites.s31.push(rec);
                    break;

                case '32':
                    sites.s32.push(rec);
                    break;
                
                case '33':
                    sites.s33.push(rec);
                    break;
                
                case '34':
                    sites.s34.push(rec);
                    break;
                
                case '35':
                    sites.s35.push(rec);
                    break;
                
                case '36':
                    sites.s36.push(rec);
                    break;
                
                case '37':
                    sites.s37.push(rec);
                    break;
                
                case '38':
                    sites.s38.push(rec);
                    break;
                
                case '39':
                    sites.s39.push(rec);
                    break;
                
                case '40':
                    sites.s40.push(rec);
                    break;
                
                case '41':
                    sites.s41.push(rec);
                    break;
                
                case '42':
                    sites.s42.push(rec);
                    break;
                
                case '43':
                    sites.s43.push(rec);
                    break;
                
                case '44':
                    sites.s44.push(rec);
                    break;
                
                case '45':
                    sites.s45.push(rec);
                    break;
                
                case '46':
                    sites.tent.push(rec);
                    break;
                
                case '47':
                    sites.DA.push(rec);
                    break;
                
                case '48':
                    sites.DB.push(rec);
                    break;
                
                case '49':
                    sites.DC.push(rec);
                    break;
            
                case '50':
                    sites.DD.push(rec);
                    break;
                
                case '0':
                    console.log("reports.js: SOMETHINGS BROKEN AHHHHHHHH (case 0)")
                    break;
                
            }//end switch statement
        }// end for each record
        sites.one.setAvailableDays;
        sites.two.setAvailableDays;
        sites.three.setAvailableDays;
        sites.four.setAvailableDays;
        sites.five.setAvailableDays;
        sites.six.setAvailableDays;
        sites.seven.setAvailableDays;
        sites.eight.setAvailableDays;
        sites.nine.setAvailableDays;
        sites.ten.setAvailableDays;
        sites.s11.setAvailableDays;
        sites.s11B.setAvailableDays;
        sites.s12.setAvailableDays;
        sites.s12b.setAvailableDays;
        sites.s13.setAvailableDays;
        sites.s14.setAvailableDays;
        sites.s16.setAvailableDays;
        sites.s17.setAvailableDays;
        sites.s18.setAvailableDays;
        sites.s19.setAvailableDays;
        sites.s20.setAvailableDays;
        sites.s21.setAvailableDays;
        sites.s22.setAvailableDays;
        sites.s23.setAvailableDays;
        sites.s24.setAvailableDays;
        sites.s25.setAvailableDays;
        sites.s26.setAvailableDays;
        sites.s27.setAvailableDays;
        sites.s28.setAvailableDays;
        sites.s29.setAvailableDays;
        sites.s30.setAvailableDays;
        sites.s31.setAvailableDays;
        sites.s32.setAvailableDays;
        sites.s33.setAvailableDays;
        sites.s34.setAvailableDays;
        sites.s35.setAvailableDays;
        sites.s36.setAvailableDays;
        sites.s37.setAvailableDays;
        sites.s38.setAvailableDays;
        sites.s39.setAvailableDays;
        sites.s40.setAvailableDays;
        sites.s41.setAvailableDays;
        sites.s42.setAvailableDays;
        sites.s43.setAvailableDays;
        sites.s44.setAvailableDays;
        sites.s45.setAvailableDays;
        sites.tent.setAvailableDays;
        sites.DA.setAvailableDays;
        sites.DB.setAvailableDays;
        sites.DC.setAvailableDays;
        sites.DD.setAvailableDays;

        console.log("\n\nReservation Reports: ")
        sites.one.consoleReport;
        sites.two.consoleReport;
        sites.three.consoleReport;
        sites.four.consoleReport;
        sites.five.consoleReport;
        sites.six.consoleReport;
        sites.seven.consoleReport;
        sites.eight.consoleReport;
        sites.nine.consoleReport;
        sites.ten.consoleReport;
        sites.s11.consoleReport;
        sites.s11B.consoleReport;
        sites.s12.consoleReport;
        sites.s12b.consoleReport;
        sites.s13.consoleReport;
        sites.s14.consoleReport;
        sites.s16.consoleReport;
        sites.s17.consoleReport;
        sites.s18.consoleReport;
        sites.s19.consoleReport;
        sites.s20.consoleReport;
        sites.s21.consoleReport;
        sites.s22.consoleReport;
        sites.s23.consoleReport;
        sites.s24.consoleReport;
        sites.s25.consoleReport;
        sites.s26.consoleReport;
        sites.s27.consoleReport;
        sites.s28.consoleReport;
        sites.s29.consoleReport;
        sites.s30.consoleReport;
        sites.s31.consoleReport;
        sites.s32.consoleReport;
        sites.s33.consoleReport;
        sites.s34.consoleReport;
        sites.s35.consoleReport;
        sites.s36.consoleReport;
        sites.s37.consoleReport;
        sites.s38.consoleReport;
        sites.s39.consoleReport;
        sites.s40.consoleReport;
        sites.s41.consoleReport;
        sites.s42.consoleReport;
        sites.s43.consoleReport;
        sites.s44.consoleReport;
        sites.s45.consoleReport;
        sites.tent.consoleReport;
        sites.DA.consoleReport;
        sites.DB.consoleReport;
        sites.DC.consoleReport;
        sites.DD.consoleReport;
    }
    
    setAvailableDays(...records){
        //sites.site.days = x;
        if(records.length>1){
            for(var i=0; i< records.length; i++){
                if(i==0){
                    let today=new Date();
                    let days=this.getAvailableDays(today, records[i].start);
                    records[i].days=days;
                }
                else if(i>0){
                    let days=this.getAvailableDays(records[i-1].end, records[i].start);
                    records[i].days=days;
                }
            }
        }
        else if(records.length==1){
            let today=new Date();
            let days=this.getAvailableDays(today, records[0].start);
            records[0].days=days;
        }
        
        
    }

    //returns the number of days between two dates
    //ex date1-date2
    getAvailableDays(date1, date2){
        //get number of days between two dates returns days available for current 
        //date1 = prev rec end
        //date2 = cur rec start
        return (    (date2.getTime() - date1.getTime())/86400000    )
    }

    //prints siteID, start, End, days available to the console for easy viewing. 
    consoleReport(){
        for(let rec of records){
            console.log(rec.siteID);
            console.log(rec.start);
            console.log(rec.end);
            console.log(rec.days);
            console.log("\n\n");
        }
    }
};