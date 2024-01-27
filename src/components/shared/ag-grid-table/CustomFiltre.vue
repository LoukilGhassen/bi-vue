<template>
  <div>
    <p>Filtrer par</p>
    <el-form :model="formData" ref="ruleFormRef">
      <div
        v-for="(filtre, index) in filters"
        :key="index"
        class="filtre_category d-flex gap-3 mb-1"
      >
      <el-form-item :prop="'data.' + index + '.type'" :rules="rules.type">
        <el-select
           :teleported="false"
          v-model="filtre.type"
          placeholder="Type"
          :style="
            filtre.colType !== 'boolean'
              ? 'max-width: 200px'
              : 'max-width: 258px'
          "
          @change="handleChange($event, index)"
          value-key="field"
        >
          <el-option
            v-for="type in filtreTypes"
            :key="type.field"
            :label="type.headerName"
            :value="type.filter.filterKey ? type.filter.filterKey : type.filter.field" 
          >
          </el-option>
        </el-select>
      </el-form-item> 
      <el-form-item :prop="'data.' + index + '.condition'"
                    v-if="filtre.colType !== 'boolean' && !calendarFilter"
                    :rules="rules.condition"
                              style="max-width: 130px"

      >
        <el-select
        :teleported="false"
          v-model="filtre.condition"
          placeholder="Condition"
        >
          <el-option
            v-for="condition in filtre.conditions"
            :key="condition.label"
            :label="condition.label"
            :value="condition.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :prop="'data.' + index + '.value'" :rules="filtre.colType === 'date' ? [...rules.value,...rules.date] : rules.value" v-if="!calendarFilter">
        <el-input
          v-model="filtre.value"
          placeholder="Valeur"
          v-if="filtre.colType !== 'boolean'"
            style="max-width: 200px"
        />
        <el-checkbox
          true-label="true"
          false-label="false"
          v-model="filtre.value"
          label="Oui"
          size="large"
          v-if="filtre.colType === 'boolean'"
        />
      </el-form-item>  
      </div>
    </el-form>
    <div class="filtre_option d-flex justify-content-between py-7">
      <el-button icon="Plus" @click="addFilter" />
      <div class="d-flex">
        <el-button class="table_option_button" @click="initFilters(ruleFormRef)"
          >Réinitialiser</el-button
        >
        <el-button
          class="table_option_button"
          type="primary"
          @click="validFiltre(ruleFormRef)"
          >Valider</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const ruleFormRef = ref();

const handleChange = (val, index) => {
  const field = filtreTypes.value.find((type) =>{
    return (type.filter.filterKey ? type.filter.filterKey === val :  type.filter.field === val)
    });
  if(field.filter.type === "date") {
    filters.value[index] = {
      ...filters.value[index],
      value: "",
      condition: "",
      colType: "date",
      conditions:field.filter.conditions
    };
  } else
  if (field.filter.type === "boolean") {
    filters.value[index] = {
      ...filters.value[index],
      value: false,
      condition: "[equals]",
      colType: "boolean",
    };
  } else
  if(field.filter.type === "number") {
    filters.value[index] = {
      ...filters.value[index],
      value: "",
      condition: "",
      colType: "number",
      conditions:field.filter.conditions
    };
  } 
  else
    {
      filters.value[index] = {
      ...filters.value[index],
      condition: "",
      value: "",
      colType: "",
      conditions:field.filter.conditions
    };
   } 
   ruleFormRef.value.clearValidate()
};
const props = defineProps({
  types: Object,
  calendarFilter:{
    type:Boolean,
    required:false,
    default:false
  }
});
const emit = defineEmits(["validateFiltre"]);
const filters = ref([{ type: "", condition: "", value: "" }]);
const filtreTypes = computed(() => props.types.filter((type) => type.filter));

const addFilter = () => {
  filters.value.push({
    type: "",
    condition: "",
    value: "",
  });
};
const initFilters = (formRef) => {
  filters.value = [{ type: "", condition: "", value: "" }];
  emit("validateFiltre", []);
  formRef.clearValidate()

};
const formData = computed(()=>{
      return({
        data:filters.value,
      })
    })

const validFiltre = (ruleFormRef) => {
  if (!ruleFormRef) return;
  ruleFormRef.validate(async (valid) => {
    if (valid) {
      await handleSubmitForm();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const handleSubmitForm = () => {
  const validatedFilters = filters.value.map((filter) => {
    const col = filtreTypes.value.find(
      (type) => {
        return (type.filter.filterKey ? type.filter.filterKey === filter.type : type.filter.field === filter.type)

        }
    );
    return col
      ? col.filter.type
        ? { ...filter, type: col.filter.field ,colType: col.filter.type , colDef:col}
        : {...filter,type: col.filter.field,colDef:col}
      : {};
  });
  emit("validateFiltre", validatedFilters);
}

const validateDate = (rule, value,callback) => {
  let datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!datePattern.test(value)) {
    callback(new Error('format invalide'));
  }
  let parts = value.split('/');
  let year = parseInt(parts[2].padStart(4,'0'), 10);
  let month = parseInt(parts[1].padStart(2,'0'), 10) - 1; 
  let day = parseInt(parts[0].padStart(2,'0'), 10);

  let parsedDate = new Date(year, month, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month ||
    parsedDate.getDate() !== day
  ) {
    callback(new Error('format invalide'));

  }
  callback()

};

const rules = {
  type: [
    {
      required: true,
      message: "champ requis",
      trigger:[""]
    },
  ],
  condition: [
    {
      required: true,
      message: "champ requis",
      trigger:[""]
    }],
  value:[
    {
      required: true,
      message: "champ requis",
      trigger:[""]
    },
  ],
  date:[{
      validator: validateDate,
    }]
}
</script>

<style></style>
