<template>
  <div>
    <span class="svg-icon-1 delete p-3 ps-0">
      <inline-svg v-if="complete === 100" src="/svg/icons/completed.svg" />
      <el-tooltip
        content="Fiche à compléter"
        placement="top"
        effect="light"
        v-if="complete !== 100"
      >
        <inline-svg
          v-if="complete !== 100"
          src="/svg/icons/uncompleted.svg"
          style="cursor: default"
        />
      </el-tooltip>
    </span>
    <span>{{ params.data?.actorObject?.actorName }}</span>
  </div>
</template>

<script>

export default {
  props: ["params"],

  setup(props) {
    const actor = ref(props.params?.data)
    const actorType = ref(actor.value?.actorObject?.actorPerson ? 'pds' : actor.value?.actorObject?.actorCompany?.listIdActorCompanyTypeObject?.tag.toLowerCase())

    // const complete = computed(() => {
    //   if(actorType.value == 'Pds'){
    //     let optionalFields = ['phone','email','ursaaf']
    //     let addressOptionalAddress = ['notes','row1Value','row2Value','telephone','fax']
    //     let optionalFieldComplete = true
    //     let optionalAddressComplete = true
    //     optionalFields.map((f)=>{
    //       if(!actor.value?.actorObject[f]){
    //         optionalFieldComplete = false
    //       }
    //     })
    //     let rdvDaysComplete = true
    //     if(actor.value.actorObject?.rdvVisit){
    //       let checkedDays= false
    //       Object.keys(actor.value.actorObject?.rdvDays).map((key)=>{
    //         if(actor.value.actorObject?.rdvDays[key]?.checked){
    //           checkedDays = true
    //         }
    //       })
    //       if(!checkedDays){
    //         rdvDaysComplete = false
    //       }
    //     }
    //     actor.value?.actorObject.addressOfActor.map((address)=>{
    //       addressOptionalAddress.map((f)=>{
    //         if(!address[f]){
    //           optionalAddressComplete = false
    //         }
    //       })
    //     })

    //     return optionalAddressComplete  && rdvDaysComplete && optionalFieldComplete && actor.value?.productCount

    //   }else if (actorType.value == 'Pharmacy') {
    //     return actor.value?.delegateCount && actor.value?.vmCount && actor.value?.storyCount &&
    //      actor.value?.productCount
    //   }else if (actorType.value == 'Entity') {
    //     return actor.value?.storyCount 
    //   }
    //   else if (actorType.value == 'HealthCenter') {
    //     return actor.value?.servicesCount && actor.value?.healthCenterTeamCount && actor.value?.vmCount 
    //   }
    // })
    const complete = computed(() => {
      // list of optional properties
      let s = 0;
      switch (actorType.value) {
        case "pharmacy":
          s = 60;
          if (actor.value?.actorObject ) {
            let optionalFields = ["email", "phone", "ursaaf"];
            let optionalAddressFields = [
              "row1Value",
              "notes",
              "fax",
              "telephone",
            ];
            let depotAddressFields = [
              "row1Value",
              "row2Value",
              "row3Value",
              "row4Value",
              "town",
              "zipCode",
              "notes",
              "fax",
              "street",
              "telephone",
              "departement",
            ];
            const unCompletedActor = optionalFields.some(
              (f) => !actor.value?.actorObject[f]
            );
            const unCompletedAddress = optionalAddressFields.some(
              (f) => !actor.value?.actorObject.addressOfActor[0][f]
            );
            let unCompleteDepotAddress = false;
            actor.value?.actorObject?.addressOfActor
              ?.slice(1)
              .map((address) => {
                depotAddressFields.map((f) => {
                  if (!address[f]) {
                    unCompleteDepotAddress = true;
                  }
                });
              });

            s =
              unCompletedActor || unCompletedAddress || unCompleteDepotAddress
                ? s
                : s + 20;
          }
          if (actor.value["wholeSalerCount"] !== 0) {
            s += 20;
          }
          return s;
        case "pds":
          if (actor.value.actorObject ) {
            let optionalFields = ["phone", "email", "ursaaf"];
            let addressOptionalAddress = [
              "notes",
              "row1Value",
              "row2Value",
              "telephone",
              "fax",
            ];
            let optionalFieldComplete = true;
            let optionalAddressComplete = true;
            let rdvDaysComplete = true;
            if (actor.value.actorObject?.rdvVisit) {
              let checkedDays = false;
              Object.keys(actor.value.actorObject?.rdvDays).map((key) => {
                if (actor.value.actorObject?.rdvDays[key]?.checked) {
                  checkedDays = true;
                }
              });
              if (!checkedDays) {
                rdvDaysComplete = false;
              }
            }
            optionalFields.map((f) => {
              if (!actor.value?.actorObject[f]) {
                optionalFieldComplete = false;
              }
            });
            actor.value?.actorObject?.addressOfActor?.map((address) => {
              addressOptionalAddress.map((f) => {
                if (!address[f]) {
                  optionalAddressComplete = false;
                }
              });
            });
            s = 60;
            if (actor.value["productCount"] !== 0) {
              s += 20;
            }
            if (
              optionalAddressComplete &&
              optionalFieldComplete &&
              rdvDaysComplete
            ) {
              s += 20;
            }

            return s;
          }
          return 60;
        case "entity":
          s = 80;
          if (actor.value?.actorObject ) {
            let optionalFields = ["ursaaf", "email", "phone"];
            let addressOptionalFiealds = [
              "notes",
              "row1Value",
              "row2Value",
              "telephone",
              "fax",
            ];
            let actorCompanyOPTionelFiealds = [
              "presidentName",
              "treasurerName",
            ];
            const unCompletedOptionelFields = optionalFields.some(
              (f) => !actor.value?.actorObject[f]
            );
            const unCompletedAddress = addressOptionalFiealds.some(
              (f) => !actor.value?.actorObject?.addressOfActor[0][f]
            );
            const unCompletedActorCompany = actorCompanyOPTionelFiealds.some(
              (f) => !actor.value?.actorObject?.actorCompany[f]
            );
            return unCompletedOptionelFields ||
              unCompletedAddress ||
              unCompletedActorCompany
              ? s
              : s + 20;
          }
          break;
        case "healthcenter":
          s = 60;
          if (actor.value && actor.value?.actorObject) {
            const optionelAddressFields = [
              "telephone",
              "notes",
              "fax",
              "row1Value",
            ];

            const completedEmailField = !!actor.value.actorObject.email;
            const completedAddressFields = optionelAddressFields.every(
              (f) => actor.value?.actorObject?.addressOfActor[0][f]
            );
            if (completedEmailField && completedAddressFields) s += 20;
            if (actor.value?.servicesCount >= 1) s += 20;
          }
          return s;
      }
    });
    return {complete};
  },
};
</script>
