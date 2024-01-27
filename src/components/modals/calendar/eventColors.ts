
import exportedVars from './colors.scss' ;
const importedColors =JSON.parse(exportedVars.split('*/')[0].split('/*! json-encode:')[1])

export const predefineColors = [
    ...Object.values(importedColors),
    '#FF597B' , 
    '#C147E9' , 
    '#009EFF' , 
    '#5BB318' , 
    '#FF6E31' ,
    '#FFEA11' ,
    '#FEA1BF' , 
    '#9EA1D4' , 
    '#5BC0F8' ,
    '#9ED5C5' , 
    '#FFCC99' ,
    '#FFF6BD' , 
]