//Formats reservations to be used in the reports class

class Reserves{

    resID; 
    siteID; 
    type;
    start; 
    end; 
    stayLength; 
    pcs; 
    userID; 
    siteLength;
    hasHookups;
    costPerNight; 
    available;

    Reserves(){
        resID=resid;
        siteID= siteid;
        start=s;
        end= e; 
        stayLength=stay;
        this.pcs=pcs;
        userID=user;
        siteLength=length;
        hasHookups=hookups;
        costPerNight=cost;
        available = avail;
    }

}