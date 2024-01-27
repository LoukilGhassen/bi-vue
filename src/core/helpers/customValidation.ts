export const checkPhone = (rule: any, value: any, callback: any) => {
    if(!value){
      callback()
    }
    if (isNaN(value) || value.includes('.') || value.length !== 10) {
      callback(new Error('Veuillez saisir un numéro de téléphone valide'));
    } else {
        callback()
    }
};
export const checkRpps = (rule: any, value: any, callback: any) => {
    if(!value){
      callback()
    }
    if (isNaN(value) || value.includes('.') || value.length !== 11) {
      callback(new Error('RPPS invalide'));
    } else {
        callback()
    }
}
export const checkIsNum = (rule: any, value: any, callback: any) => {
    if(!value){
      callback()
    }
    if (isNaN(value) || value.includes('.')) {
      callback(new Error("ce champs n'est pas valide"));
    } else {
        callback()
    }
}
export const checkFax = (rule: any, value: any, callback: any) => {
    if(!value){
      callback()
    }
    if ( value.length > 15) {
      callback(new Error('Veuillez saisir un numéro de fax valide'));
    } else {
        callback()
    }
}
export const checkZipCode = (rule: any, value: any, callback: any) => {
    if(!value){
      callback()
    }
    if ( value.length > 5 || isNaN(value) || value.includes('.') ) {
      callback(new Error('Veuillez saisir un code Postal valide'));
    } else {
        callback()
    }
}

export const validateDates = (startDate:any,startTime:any,endDate:any,endTime:any) =>  {
  const startDateObj = startDate.indexOf('T') === -1 ? new Date(startDate) : new Date(startDate.substring(0,startDate.indexOf('T')))
  const endDateObj = new Date(endDate)
  const startTimeObj = new Date(new Date(startTime).setFullYear(endDateObj.getFullYear(),endDateObj.getMonth(),endDateObj.getDate()))
  const endTimeObj = new Date(new Date(endTime).setFullYear(startDateObj.getFullYear(),startDateObj.getMonth(),startDateObj.getDate()))
  if (endDate !== "" && startDate !=="" && startDateObj > endDateObj) {
    return false;
  }else if(startDate === "" || endDate === "" || startTime === "" || endTime === ""){
    return true
  } else if (startDateObj.getTime() === endDateObj.getTime() && startTimeObj >= endTimeObj) {
      return false
   }else{
    return true
  }
}

