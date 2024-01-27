<template>
<div  class="card-doc__container mx-1 h-100 d-flex flex-column">
  <p v-if="$route.name === 'user-profil'" class="px-18 fw-boldest gris-fonce fs-1 mb-3 pt-10 montserrat">Mes documents</p> 
  <div class="d-flex justify-content-between flex-column h-100 " :class="$route.name === 'user-profil' ? 'py-3' : 'py-15'">  
    <div class="d-flex flex-wrap gap-15 w-100 px-20 ">
      <div class="section " :class="$route.name === 'user-profil' ? 'pe-20' : ''" v-for="doc in docsSections">
      
        <p class="fw-boldest gris-fonce">{{ doc.sectionTitle }}</p>
        <div
          class="section-doc py-5 d-flex gap-10 align-items-center"
          v-if="doc.docTitle"
        >
          <span class="svg-icon svg-icon-muted svg-icon-1">
            <inline-svg src="/svg/files/document.svg" />
          </span>
          <div>
            <p class="poppins mb-1">{{ doc.docTitle }}</p>
            <p class="mb-1" style="color:rgba(153, 153, 161, 1)">{{ doc.docSize }}</p>
          </div>
          <span v-if="$route.name==='user-profil'"
           class="svg-icon svg-icon-muted svg-icon-1 ms-auto">
            <inline-svg src="/svg/icons/close.svg" />
          </span>
          <span v-else class="svg-icon svg-icon-muted svg-icon-1 ms-auto">
            <inline-svg src="/svg/icons/exporter.svg" />
          </span>
        </div>
       
        <div class="section-empty-doc px-10 poppins" v-else>
          <div v-if="$route.name === 'user-profil'" class="d-flex justify-content-between w-100 px-5 align-items-end"> 
          <inline-svg  src="/svg/icons/upload.svg" />
          <span>Cliquez pour sélectionner vos documents ou déposez-les</span>
        </div>
        <span v-else>Pas de document importé</span> 
        </div>
        
      </div>
  </div>
  <div v-if="$route.name === 'user-profil'" class="d-flex justify-content-between px-10 ps-20 align-items-center mb-8">  
    <span class="noir">
      Formats autorisés : jpg, jpeg, gif, pdf, doc, docx, png. |
      Taille max : 8 Mo</span
    >
    <el-button  size="large" type="primary" class="fw-boldest poppins px-12">
    Enregistrer
  </el-button>
  </div>
</div>

</div>
 
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const docsSections = [
  {
    sectionTitle: "Pièce d’identité",
    docTitle: "piece-jointe.jpg",
    docSize: "122 30 Kb",
  },
  {
    sectionTitle: "Carte professionnelle",
    docTitle: "piece-jointe.jpg",
    docSize: "122 30 Kb",
  },
  {
    sectionTitle: "Permis",
    docTitle: "piece-jointe.jpg",
    docSize: "122 30 Kb",
  },
  {
    sectionTitle: "RIB",
    docTitle: "",
    docSize: "",
  },
  {
    sectionTitle: "Carte vitale",
    docTitle: "",
    docSize: "",
  },
  {
    sectionTitle: "Contrat de travail",
    docTitle: "",
    docSize: "",
  },
];

onMounted(async () => {});
</script>
<style lang="scss" scoped>
.section {
  width: 48%;
}
.section-empty-doc {
  border: 1px solid #e6e9ed;
  background-color: rgba(244, 244, 246, 1);
  border-radius: 4px;
  min-height: 85px;
  display: flex;
  align-items: center;
}
.section-doc {
  border-top: 1px solid #e6e9ed;
  border-bottom: 1px solid #e6e9ed;
}
.card-doc__ {
  &container {
    border-radius: 10px;
    box-shadow: 0px 2px 4px 3px rgba(112, 112, 112, 0.28);
  }
}
.gris-fonce{
  color:gris-fonce
}
</style>
