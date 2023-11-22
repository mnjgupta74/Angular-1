
// For Track Of Transaction

export class TrackTransaction{
    fromDate!:string;
    todate!:string;
    tcode!:string
    usercode!:number;
    userType!:string
    fieldname!:string;
    value!:Number
    billType!:Number;
    
}    

// For Book Transfer 8782
export class BookTransfer{
    fromDate!:number;
    toDate!:number;
    treasuryCode!:string
}


// PDMaster Report----------------->>
export class IGetPDMasterRpt {  
    type!:number
    treasuryCode!: string
    budgetHead!: string
  }

   //PD BALANCE REPORT ------------------------>> 
   export class IGEtPDBALANCE {
    date!:string;
    pdAccNo!:number;
    treasuryCode!:string
  }


  //PD BALANCE REPORT ------------------------>> 
  export class pdPassbookDetail {
    pdAccNo!:number;
    treasuryCode!:string;
    fromdate!:string;
    toDate!:string;
    budgethead!:string
  
  }

    //PD Calculation REPORT ------------------------>> 
    export class pdCalculationDetail {
      pdacc!:number;
      treasuryCode!:string;
      fromDate!:string;
      toDate!:string;
      // budgethead!:string;
      interest!:number
    
    }


    // For PFMS
    export class PFMSLOG{
      fromDate!:string;
      toDate!:string;
      cde_refNo!:null;
    }

     // For PFMSDNFile
     export class PFMSDNFile{
      fromDate!:string;
      toDate!:string;
     // cde_refNo!:null;
    }


   
