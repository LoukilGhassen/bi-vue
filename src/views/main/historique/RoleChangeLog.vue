<template>
  <div class="w-100">
    <div class="mb-5">
      <div v-if="changeLog.includes('roleName') ||  changeLog.includes('description')">
        <div class="fst-italic noir w-100 my-2">Information du rôle</div>
        <div v-if="changeLog.includes('roleName')">
          <span class="poppins noir fw-boldest w-100"> Nom :</span>
          <span class="poppins noir ms-2">
            {{ lodash.get(contact, "roleName") }}
          </span>
        </div>
        <div v-if="changeLog.includes('description')">
          <span class="poppins noir fw-boldest w-100"> Description : </span>
          <span class="poppins noir ms-2">
            {{ lodash.get(contact, "description") }}
          </span>
        </div>
      </div>

      <div
        class="ms-1"
        v-for="prop in [ ...new Set(changeLog.filter((e) => e.startsWith('roleJPages')).map((e)=>e.substring(0, e.indexOf('.', e.indexOf('.') + 1))))]"
        :key="prop"
      >
        <div class="fst-italic noir w-100 my-2">
          {{
            displayName(
              prop
            )
          }}
        </div>
        <div>
          <span class="poppins noir fw-boldest w-100">Accès</span>
          <span class="poppins noir ms-2">
            {{
              lodash.get(
                contact,
                prop
              )?.hasAccess
                ? "Oui "
                : "Non "
            }}
          </span>
        </div>
        <div>
          <span class="poppins noir fw-boldest w-100"> Permission </span>
          <span class="poppins noir ms-2">
            {{
              lodash.get(
                contact,
                prop
              )?.listIdPermissionTypeObject?.captionFr
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import lodash from "lodash";
import { useLogStore } from "@/store/useLogModule";
import { onMounted, ref } from "vue";
import service from "@/service";
const getModifiedColumns = (originalData: any, newData: any, path = []) : any  => {
      return lodash.reduce(originalData, (result: any, value: any, key: any) => {
          const currentPath = path.concat(key);
          if (lodash.isObject(value) && lodash.isObject(newData[key]) && !lodash.isDate(value)) {
              // If both values are objects, recursively call the function
              const nestedDifferences =  getModifiedColumns(value, newData[key], currentPath);

              // If there are nested differences, concatenate them to the result
              return nestedDifferences.length ? result.concat(nestedDifferences) : result;
          } else if (!lodash.isEqual(value, newData[key])) {
              // If values are not equal, add the path to the result
              return result.concat(currentPath.join('.'));
          } else {
              return result;
          }
      }, []);
  }
  const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
  isOld: {
    type: Boolean,
    required: false,
    default: false,
  },
});
let contact: any = null;
let oldValue = {};
let newValue = {};
let changeLog: string[] = [];
if (props.type === "update") {
  oldValue = lodash.cloneDeep(props.payload?.oldValue);
  newValue = lodash.cloneDeep(props.payload?.newValue);
  changeLog = getModifiedColumns(oldValue, newValue);
  contact = props.isOld ? oldValue : newValue;
} else {
  contact = props.payload;
}
const showProperty = (changeLogObject: any): boolean => {
  if (props.type === "update") {
    if (changeLogObject.type === "array") {
      return changeLog.some((e) => e.startsWith(changeLogObject.showProp));
    }

    return changeLog.includes(changeLogObject.showProp);
  } else {
    return (
      lodash.get(contact, changeLogObject.showProp) !== null &&
      lodash.get(contact, changeLogObject.showProp) !== undefined &&
      lodash.get(contact, changeLogObject.showProp) !== "" &&
      (!lodash.isArray(lodash.get(contact, changeLogObject.showProp)) ||
        (lodash.isArray(lodash.get(contact, changeLogObject.showProp)) &&
          lodash.get(contact, changeLogObject.showProp).length > 0))
    );
  }
};

const displayName = (page) => {
  const pageName = lodash.get(contact, page + ".page.address");
  for (let key in data.value) {
    let foundElement = data.value[key].find((e) => e.tag === pageName);
    if (foundElement) {
      return foundElement?.captionFr;
    }
  }
  return "";
};

const data = ref<any>({});
onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "UpdateRolesList"
    );
  data.value = resp.data;
});

console.log(changeLog);
</script>
