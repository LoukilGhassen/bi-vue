export const replaceKeys = (inputObject:any, oldKey:any, newKey:any) => {
  const updatedObject:any = {};

  for (const key in inputObject) {
    const updatedKey = key.replace(oldKey, newKey);
    updatedObject[updatedKey] = inputObject[key];
  }
  return updatedObject
    }
 export const transformObject = (inputObject:any,orIndex:number) => {
    const outputObject:any = {};

    // Loop through the input object and restructure it
    for (const key in inputObject) {
      const newKey = key.slice(0, 5) + "[OR]["+orIndex+"]" + key.slice(5)
      outputObject[newKey] = inputObject[key];
    }
    return outputObject
}
export const dateSort = (startDateA: any, startDateB: any) => {
  if (startDateA === null && startDateB === null) {
    return 0;
  }
  if (startDateA === null) {
    return -1;
  }
  if (startDateB === null) {
    return 1;
  }
  return startDateA - startDateB;
};

export const intSort = (intA: any, intB: any) => {
  if (intA === null && intB === null) {
    return 0;
  }
  if (intA === null) {
    return -1;
  }
  if (intB === null) {
    return 1;
  }
  return intA - intB;
};
        
  
