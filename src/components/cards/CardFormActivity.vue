<template>
    <div class="card-activity__container p-10">
      <div class="fs-2 mb-5 fw-boldest color-gris">  
        <span  >Mon périmètre d’activité</span></div>

      <div  >
        <el-form
        ref="ruleFormRef"
        :model="user"
        status-icon
        label-width="300px"
        label-position="top"
      >
      
         <el-form-item label="Rôle" prop="Rôle" >
          <el-input :value="displayRoles"  :disabled="true" size="large" />
        </el-form-item>

        <el-form-item label="Départements" prop="Départements">
          <el-tooltip content="Départements" placement="bottom-end" effect="light">
            <template #content v-if="codeDep.length > 0">
              <div class="color-gris poppins mb-1"  >
                Départements
              </div>
              <span v-html="formatCodes(codeDep.map(item => item),5)"></span>
             
            </template>
            <el-input
             
              :value="displayValueDep"
              :disabled="true"
              size="large"
            />
          </el-tooltip>
        </el-form-item>
      
        <el-form-item label="UGA" prop="UGA">
          <el-tooltip content="UGA" placement="bottom-end" effect="light" >
            <template #content v-if="codeUGA.length > 0" >
              <div class="color-gris poppins mb-1"  >
                UGA
              </div>
              <span v-html="formatCodes(codeUGA.map(item => item),3)"></span>
            
            </template>
            <el-input
              
              :value="displayValueUGA"
              :disabled="true"
              size="large"
            />
          </el-tooltip>
        </el-form-item>

    
         <el-form-item label="Types de contacts" prop="contacts">
          <el-tooltip content="contacts" placement="bottom-end" effect="light" >
            <template #content v-if="typeContact.length > 0">
              <div class="color-gris poppins mb-1"  >
                Types de contacts
              </div>
              <span v-html="formatCodes(typeContact.map(item => item),1)"></span>
            
            </template>
            <el-input
              
              :value="displayValueContact"
              :disabled="true"
              size="large"
            />
          </el-tooltip>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </template>
  <script setup lang="ts">
import { ref ,onMounted,computed} from 'vue'
import type { FormInstance } from 'element-plus'
import { useUserStore } from "@/store/useUserModule";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(useUserStore());
const ruleFormRef = ref<FormInstance>()
const codeUGA = ref([]);
const codeDep = ref([]);
const typeContact = ref([]);
onMounted(async () => {
 codeUGA.value = user?.value?.ugaList?.map(item => item.code);
 codeDep.value = user?.value?.departments?.map(item => item.code);
 typeContact.value = user.value?.contacts?.map(item => item.captionFr);

});
const displayRoles = computed(()=>user?.value?.userTypes?.map((e)=>e.roleName).join(','))
const displayValue = (codes: string[],maxDisplayCount:number) => {
  if( codes.length > 0){
    if (codes.length <= maxDisplayCount) {
      return codes.join(', ');
    } else {
      return `${codes.slice(0, maxDisplayCount).join(', ')} (+${codes.length - maxDisplayCount})`;
    }
  } else {
    return "";
  }
 
};

const displayValueUGA = computed(() => displayValue(codeUGA.value,5));
const displayValueDep = computed(() => displayValue(codeDep.value,5));
const displayValueContact = computed(() => displayValue(typeContact.value,2));


const formatCodes = (codes: any,digitsPerLine:number) => {
  let formattedString = '';

  for (let i = 0; i < codes.length; i++) {
    if (i % digitsPerLine === 0 && i !== 0) {
      formattedString += '<br>';
    }

    formattedString += codes[i];

    if (i < codes.length - 1) {
      const currentCodeLength = codes[i].length;
      const nextCodeLength = codes[i + 1].length;
      if (currentCodeLength + nextCodeLength > 50) {
        formattedString += '<br>';
      } else {
        formattedString += ', ';
      }
    }
  }

  return formattedString;
};
  </script>
  <style lang="scss" scoped>
  .card-activity__ {
    &container {
      border-radius: 10px;
      box-shadow: 1px 1px 7px 0px rgba(193, 182, 178, 0.94);
    }
  }
.color-gris{
  color:$gris-fonce
}

  </style>