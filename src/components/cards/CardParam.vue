<template>
    <div class="card-form__container p-10" >
        
      <div class="fs-2 mb-5 fw-boldest color-gris">  
        <span  >Paramètres</span></div>
        <el-divider />

      <div class="d-flex flex-column " >
        <span class="mb-3 color fw-boldest">Données personnelles</span>
        <span class="mb-3 text-decoration-underline poppins">Mentions légales</span>
        <span class="text-decoration-underline poppins">Cookies</span>
      </div>
    </div>
  </template>
  <script setup lang="ts">

  </script>
  <style lang="scss" scoped>
  .card-form__ {
    &container {
      border-radius: 10px;
      box-shadow: 1px 1px 7px 0px rgba(193, 182, 178, 0.94);
    
    }

  }
.color-gris{
  color:$gris-fonce
}
.text-color{
    color:$gris-fonce
}
  </style>