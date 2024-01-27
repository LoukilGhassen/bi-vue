<template>
  <div class="d-flex flex-column">
    <!-- start info card -->
    <div class="contact-info-card d-flex align-items-center gap-10 p-7">
      <avatar
        shape="circle"
        :first-name="actor.actorObject?.actorPerson?.firstName"
        :last-name="actor.actorObject?.actorName"
        :size="100"
        background-color="#FFC200"
        text-color="#363636"
        src=""
        class="fw-boldest"
      />
      <div class="info d-flex flex-column gris-fonce fw-normal">
        <p class="noir poppins">
          {{ id.substring(0, 5) }} - {{ actorTypeFr }} - Profil
          complété à
          <span
            :style="complete === 100 ? 'color : #0EC100' : 'color: #ff7200'"
            class="fw-boldest"
            >{{ complete }}%</span
          >
        </p>
        <div
          class="d-flex gap-5 fs-7 poppins"
          v-if="actorType !== 'entity' && actorType !== 'healthCenter'"
        >
          <div>
            <p class="violet-fonce">
              Dernière visite le
              {{
                actor.lastVisitDate
                  ? new Date(actor.lastVisitDate).toLocaleDateString("fr-FR", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "-"
              }}
            </p>
            <p>
              <span class="violet-fonce"> {{ actor.monthlyVisit }} </span>
              Visite(s) ce mois-ci
            </p>
            <p>
              <span class="violet-fonce"> {{ actor.yearlyVisit }} </span>
              Visite(s) cette année
            </p>
          </div>
          <div>
            <p>
              Objectif de visite annuel :
              {{ actor.actorObject?.yearVisitObjective || "-" }}
            </p>
            <p v-if="actorType === 'pds'">
              Spécialité :
              {{
                actor.actorObject?.listIdActorPersonSpecializationObject
                  ?.captionFr || "-"
              }}
            </p>
            <p v-if="actorType === 'pds'">
              RPPS : {{ actor.actorObject?.actorPerson?.rpps }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <ProductsList
      /> -->
    <!-- end  info card -->
    <!-- start tabs -->
    <el-tabs
      v-model="activeActorDetailTabName"
      class="demo-tabs"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane label="Informations" name="Informations">
        <ActorPersonForm
          v-if="inputs && actorType === 'pds' && mounted"
          :inputs="inputs"
          isEdit
        />
        <ActorPharmacyForm
          v-if="depositAddress && pharmacyAddress && actorType === 'pharmacy'"
          :depositAddress="depositAddress"
          :pharmacyAddress="pharmacyAddress"
          isEdit
        />
        <ActorEntityForm
          v-if="inputs && actorType === 'entity'"
          :inputs="inputs"
          isEdit
        />
        <ActorHealthCenterForm
          v-if="inputs && actorType === 'healthCenter'"
          :inputs="inputs"
          isEdit
        />
      </el-tab-pane>
      <el-tab-pane
        label="Produits"
        name="Produits"
        v-if="['pds', 'pharmacy'].includes(actorType)"
        ><ProductsList
          v-if="activeActorDetailTabName === 'Produits'"
          :webElementAddress="
            actorType.includes('pds')
              ? 'pdsProductsList'
              : 'pharmacyProductsList'
          "
      /></el-tab-pane>
      <el-tab-pane
        label="Remplaçants"
        name="Remplaçants"
        v-if="['pds'].includes(actorType)"
        ><ReplacementsList v-if="activeActorDetailTabName === 'Remplaçants'"
      /></el-tab-pane>
      <el-tab-pane
        label="Grossiste"
        name="Grossiste"
        v-if="['pharmacy'].includes(actorType)"
        ><p>
          <WholesalerList v-if="activeActorDetailTabName === 'Grossiste'" /></p
      ></el-tab-pane>
      <el-tab-pane
        label="Visites"
        name="Visites"
        v-if="!['healthCenter','entity'].includes(actorType)"
        ><VisitsList
          v-if="activeActorDetailTabName === 'Visites'"
          :webElementAddress="
            actorType.includes('pds')
              ? 'pdsVisitList'
              : actorType.includes('pharmacy')
              ? 'pharmacyVisitList'
              : 'entityVisitList'
          "
      /></el-tab-pane>
      <el-tab-pane
        label="Echantillons"
        name="Echantillons"
        v-if="['pds'].includes(actorType)"
        ><SamplesList v-if="activeActorDetailTabName === 'Echantillons'"
      /></el-tab-pane>
      <el-tab-pane
        label="Services"
        name="services"
        v-if="['healthCenter'].includes(actorType)"
        ><HealthCenterServiceList
          v-if="activeActorDetailTabName === 'services'"
        />
      </el-tab-pane>
      <el-tab-pane
        label="Médecins rattachés"
        name="attachedDoctors"
        v-if="['pds', 'pharmacy'].includes(actorType)"
        ><AttachedDoctorsList
          v-if="activeActorDetailTabName === 'attachedDoctors'"
          :webElementAddress="
            actorType.includes('pds')
              ? 'pdsAttachedDoctorsList'
              : 'pharmacyAttachedDoctorsList'
          "
        /> </el-tab-pane
      ><el-tab-pane
        label="Médecins rattachés"
        name="healthCenterserviceDoctors"
        v-if="['healthCenter'].includes(actorType)"
        ><HealthCenterserviceDoctors
          v-if="activeActorDetailTabName === 'healthCenterserviceDoctors'"
        />
      </el-tab-pane>
      <el-tab-pane
        label="VM Affectés"
        name="VM Affectés"
        v-if="['pds', 'pharmacy', 'healthCenter'].includes(actorType)"
      >
        <AffectedVMList
          relationType="VM"
          entityName="VM"
          :webElementAddress="
            actorType.includes('pds')
              ? 'pdsVmList'
              : actorType.includes('pharmacy')
              ? 'pharmacyVmList'
              : 'healthCenterVmList'
          "
          v-if="activeActorDetailTabName === 'VM Affectés'"
      /></el-tab-pane>
      <el-tab-pane
        label="DP affectée"
        name="DP affectée"
        v-if="['pharmacy'].includes(actorType)"
        ><AffectedVMList
          relationType="pharmaceuticalDelegate"
          webElementAddress="pharmacyDelegateList"
          entityName="DP"
          v-if="activeActorDetailTabName === 'DP affectée'"
      /></el-tab-pane>
      <el-tab-pane label="Documents" name="Documents"
        ><DocumentsList
          v-if="activeActorDetailTabName === 'Documents'"
          :webElementAddress="
            actorType.includes('pds')
              ? 'pdsDocList'
              : actorType.includes('pharmacy')
              ? 'pharmacyDocList'
              : actorType.includes('healthCenter')
              ? 'healthCenterDocList'
              : 'entityDocList'
          "
      /></el-tab-pane>
      <el-tab-pane
        label="Congrès"
        name="Congres"
        v-if="['pds'].includes(actorType)"
        >congress - manque design</el-tab-pane
      ><el-tab-pane
        label="RP/STAFF"
        name="RP/STAFF"
        v-if="['pds'].includes(actorType)"
        >RP/STAFF - manque design</el-tab-pane
      >
      <el-tab-pane
        label="Etablissements"
        name="Etablissements"
        v-if="['pds'].includes(actorType)"
        ><HealthCenterList v-if="activeActorDetailTabName === 'Etablissements'"
    /></el-tab-pane
      >
    </el-tabs>
    <!-- end tabs -->
  </div>
</template>

<script>
import { useConfigStore } from "@/store/useConfig";
import { DfAvatar as Avatar } from "@tekab-dev-team/storybook-devfactory";
import service from "@/service";
import HealthCenterList from "@/components/dataTableLists/HealthCenterList.vue";
import ActorPersonForm from "@/components/forms/ActorPersonForm.vue";
import ProductsList from "@/components/dataTableLists/contactDetailsLists/ProductsList.vue";
import ReplacementsList from "@/components/dataTableLists/contactDetailsLists/ReplacementsList.vue";
import HealthCenterServiceList from "@/components/dataTableLists/contactDetailsLists/HealthCenterServiceList.vue";
import HealthCenterserviceDoctors from "@/components/dataTableLists/contactDetailsLists/HealthCenterserviceDoctors.vue";
import VisitsList from "@/components/dataTableLists/contactDetailsLists/VisitsList.vue";
import SamplesList from "@/components/dataTableLists/contactDetailsLists/SamplesList.vue";
import AttachedDoctorsList from "@/components/dataTableLists/contactDetailsLists/AttachedDoctorsList.vue";
import AffectedVMList from "@/components/dataTableLists/contactDetailsLists/AffectedVMList.vue";
import DocumentsList from "@/components/dataTableLists/contactDetailsLists/DocumentsList.vue";
import WholesalerList from "@/components/dataTableLists/contactDetailsLists/WholesalerList.vue";
import { useRoute } from "vue-router";
import ActorPharmacyForm from "@/components/forms/ActorPharmacyForm.vue";
import ActorHealthCenterForm from "@/components/forms/ActorHealthCenterForm.vue";
import ActorEntityForm from "@/components/forms/ActorEntityForm.vue";
import { useActorStore } from "@/store/useActorModule";
import { useServiceStore } from "@/store/useServiceModule";
import { useActorPersonStore } from "@/store/useActorPersonModule";
import { storeToRefs } from "pinia";

export default {
  components: {
    Avatar,
    ActorPersonForm,
    ProductsList,
    ReplacementsList,
    VisitsList,
    SamplesList,
    AttachedDoctorsList,
    AffectedVMList,
    DocumentsList,
    WholesalerList,
    ActorPharmacyForm,
    ActorEntityForm,
    ActorHealthCenterForm,
    HealthCenterServiceList,
    HealthCenterserviceDoctors,
    HealthCenterList
  },
  setup() {
    const route = useRoute();
    const visitInput = ref("5");
    const { setHeader } = useConfigStore();
    const { actor, activeActorDetailTabName } = storeToRefs(useActorStore());
    const { fetchServices } = useServiceStore();

    const { actorperson } = storeToRefs(useActorPersonStore());
    const actorType = ref(route.params.type);
    let id = route.params.id;
    const { getActorViewById, setActiveActorDetailTabName } = useActorStore();
    setHeader("ContactDetailHeader", { type: actorType.value });
    const mounted = ref(false);
    const handleTabsClick = async (tab) => {};
    const inputs = ref(null);
    const actorTypeFr = computed(() => {
      switch (actorType.value) {
        case "pds":
          return "PDS";
        case "pharmacy":
          return "Pharmacie";
        case "entity":
          return "Entité";
        case "healthCenter":
          return "Etablissement";
        default:
          return '';
      }
    });

    const depositAddress = ref(null);
    const pharmacyAddress = ref(null);
    onMounted(async () => {
      if (actorType.value === "pharmacy") {
        const [resp, _] = await Promise.all([
          service.api.addressTypeControllerFindMany({
            "where[type][in]": ["depositAddress", "pharmacy"],
          }),
          getActorViewById(id),
        ]);
        depositAddress.value = resp.data?.paginatedResult?.find(
          (input) => input.type === "depositAddress"
        );

        pharmacyAddress.value = resp.data?.paginatedResult?.find(
          (input) => input.type === "pharmacy"
        );
      } else if (actorType.value === "pds") {
        const [resp, _] = await Promise.all([
          service.api.addressTypeControllerFindOneByType("pds"),
          getActorViewById(id),
        ]);
        inputs.value = resp.data;
      } else if (actorType.value === "entity") {
        const [resp, _] = await Promise.all([
          service.api.addressTypeControllerFindOneByType("entity"),
          getActorViewById(id),
        ]);
        inputs.value = resp.data;
      } else if (actorType.value === "healthCenter") {
        const [resp, _] = await Promise.all([
          service.api.addressTypeControllerFindOneByType("healthCenter"),
          getActorViewById(id),
        ]);
        inputs.value = resp.data;
      }
      mounted.value = true;
    });

    watch(
      () => route.params.id,
      async () => {
        mounted.value = false;
        id = route.params.id;
        actorType.value = route.params.type;
        if (id) {
          const [resp, _] = await Promise.all([
            service.api.addressTypeControllerFindOneByType(actorType.value),
            getActorViewById(id),
          ]);
          inputs.value = resp.data;
          mounted.value = true;
          setActiveActorDetailTabName("Informations");

        }
      }
    );
    const profil = ref({});
    watch(actor, () => {
      profil.value = actor.value;
    });
    watch(actorperson, () => {
      profil.value = actorperson.value.actor;
    });
    const complete = computed(() => {
      // list of optional properties
      let s = 0;
      switch (actorType.value) {
        case "pharmacy":
          s = 60;
          if (actor.value?.actorObject && mounted.value) {
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

          // TODO validate the number of grossiste  + 20
          return s;
        case "pds":
          if (actor.value.actorObject && mounted.value) {
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
              optionalFieldComplete
            ) {
              s += 20;
            }

            return s;
          }
          return 60;
        case "entity":
          s = 80;
          if (actor.value?.actorObject && mounted.value) {
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
        case "healthCenter":
          s = 60;
          if (actor.value && actor.value?.actorObject && mounted.value) {
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
    onUnmounted(() => {
      setActiveActorDetailTabName("Informations");
    });
    return {
      handleTabsClick,
      visitInput,
      inputs,
      actorType,
      profil,
      id,
      depositAddress,
      pharmacyAddress,
      actor,
      complete,
      activeActorDetailTabName,
      mounted,
      actorTypeFr
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  overflow: initial;
  position: static;
}
p {
  margin-bottom: 0.5rem;
}
:deep(.el-input) {
  --el-input-text-color: $noir;
}
:deep(.el-input__inner) {
  //color: $violet-fonce;
}
.dataTable_container {
  height: calc(100vh - 410px);
}
.contact-info-card {
  :deep(.el-avatar) {
    font-size: 20px !important;
    font-weight: 700 !important;
  }
}
</style>
