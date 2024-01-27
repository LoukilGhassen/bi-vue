<template>
  <div class="w-100">
    <div class="mb-5" v-if="contactType === 'PDS' && pdsContact.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Contact</div>
      <div class="ms-1" v-for="prop in pdsContact" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>
    <div class="mb-5" v-if="contactType === 'PDS' && pdsDetails.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Détails PDS</div>
      <div class="ms-1" v-for="prop in pdsDetails" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>

    <div class="mb-5" v-if="contactType === 'Pharmacy' && pharmacyContact.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Coordonnées de la pharmacie</div>
      <div class="ms-1" v-for="prop in pharmacyContact" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>
    <div class="mb-5" v-if="contactType === 'Pharmacy'  && pharmacySales.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Identité du responsable d'achat</div>
      <div class="ms-1" v-for="prop in pharmacySales" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>

    <div class="mb-5" v-if="contactType === 'Pharmacy'  && pharmacyManager.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Identité du responsable de la pharmacie</div>
      <div class="ms-1" v-for="prop in pharmacyManager" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>

    <div class="mb-5" v-if="contactType === 'HealthCenter'  && healthCenterFields.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Coordonnées de l'établissement de santé</div>
      <div class="ms-1" v-for="prop in healthCenterFields" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>

    <div class="mb-5" v-if="contactType === 'Entity' && entityFields.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Identité</div>
      <div class="ms-1" v-for="prop in entityFields" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>
    <div class="mb-5" v-if="contactType === 'Entity' && entityInfo.some((e)=>showProperty(e))">
      <div class="fst-italic noir w-100 mb-2">Complément d'informations</div>
      <div class="ms-1" v-for="prop in entityInfo" :key="prop.showProp">
        <div v-if="showProperty(prop)">
          <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
          <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
        </div>
      </div>
    </div>
    
    <div class="mb-5" v-if="showProperty('actorCompany.services')">
      <div class="fst-italic noir w-100"></div>
      <span class="poppins noir">
        <div v-for="(service, index) in contact.actorCompany?.services" :key="index">
          <div class="fst-italic noir w-100 mt-5 mb-2">Service {{ index + 1 }} :</div>
          <div><span class="poppins noir fw-boldest">Nom  : </span> {{ service.name  ?? '-'  }}</div>
          <div><span class="poppins noir fw-boldest"> email :</span>  {{ service.email ?? '-' }}</div>
          <div><span class="poppins noir fw-boldest">fax : </span>{{ service.fax ?? '-' }}</div>
          <div><span class="poppins noir fw-boldest">chef de service :</span>  {{ service.headOfDepartment ?? '-' }}</div>
          <div><span class="poppins noir fw-boldest"> Téléphone :  </span>{{ service.telephone ?? '-' }}</div>
          <div><span class="poppins noir fw-boldest">Equipe médicale :</span>  {{ service.team?.map((e)=>e.actorPerson?.actor?.actorName).join(' , ')  ?? '-'  }}</div>

        </div>
      </span>
    </div>

        <div v-for="(address, index) in contact.addressOfActor" :key="index">
          <div class="fst-italic noir w-100 mt-5 mb-2" v-if="addressField.some((e)=>showProperty({...e,showProp:e.showProp.replace('INDEX',index.toString())}))">Adresse {{ (address.addressIndex + 1) || index + 1  }} :</div>
          <div class="mb-5" v-if="addressField.some((e)=>showProperty({...e,showProp:e.showProp.replace('INDEX',index.toString())}))">
            <div class="ms-1" v-for="prop in addressField" :key="prop.showProp">
              <div v-if="showProperty({...prop,showProp:prop.showProp.replace('INDEX',index.toString())})">
                <span class="poppins noir fw-boldest w-100">{{ lodash.get(contact,prop.label.replace("INDEX",index.toString())) || prop.label }}:</span>
                <span class="poppins noir ms-2"> {{ !!lodash.get(contact,prop.value.replace("INDEX",index.toString())) && lodash.get(contact,prop.value.replace("INDEX",index.toString())) !== null && lodash.get(contact,prop.value.replace("INDEX",index.toString())) !== ''  ? lodash.get(contact,prop.value.replace("INDEX",index.toString())) : ' - ' }} </span>
              </div>
            </div>
          </div>
        </div>

    <div class="mb-5" v-if="showProperty({showProp:'rdvDays'})">
      <div class="fst-italic noir w-100 mb-2">
        Jours et heures de préférences
      </div>

      <div class="poppins noir">
        <div v-if="showProperty({showProp:'rdvDays.Monday'})">
          <span class="poppins noir fw-boldest w-100">Lundi :</span>
          <span class="poppins noir ms-2">
            {{ contact?.rdvDays?.Monday?.checked ? "Oui " : "Non " }}
            {{
              contact?.rdvDays?.Monday?.times
                ?.map((e) =>
                  new Date(e).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
                .join(" - ")
            }}
          </span>
        </div>
        <div v-if="showProperty({showProp:'rdvDays.Tuesday'})">
          <span class="poppins noir fw-boldest w-100">Mardi :</span>
          <span class="poppins noir ms-2">
            {{ contact?.rdvDays?.Tuesday?.checked ? "Oui" : "Non" }}
            {{
              contact?.rdvDays?.Tuesday?.times
                ?.map((e) =>
                  new Date(e).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
                .join(" - ")
            }}
          </span>
        </div>
        <div v-if="showProperty({showProp:'rdvDays.Wednesday'})">
          <span class="poppins noir fw-boldest w-100">Mercredi :</span>
          <span class="poppins noir ms-2">
            {{ contact?.rdvDays?.Wednesday?.checked ? "Oui" : "Non" }}
            {{
              contact?.rdvDays?.Wednesday?.times
                ?.map((e) =>
                  new Date(e).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
                .join(" - ")
            }}
          </span>
        </div>
        <div v-if="showProperty({showProp:'rdvDays.Thursday'})">
          <span class="poppins noir fw-boldest w-100">Jeudi :</span>
          <span class="poppins noir ms-2">
            {{ contact?.rdvDays?.Wednesday?.checked ? "Oui" : "Non" }}
            {{
              contact?.rdvDays?.Wednesday?.times
                ?.map((e) =>
                  new Date(e).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
                .join(" - ")
            }}
          </span>
        </div>
        <div v-if="showProperty({showProp:'rdvDays.Friday'})">
          <span class="poppins noir fw-boldest w-100">Vendredi :</span>
          <span class="poppins noir ms-2">
            {{ contact?.rdvDays?.Friday?.checked ? "Oui" : "Non" }}
            {{
              contact?.rdvDays?.Friday?.times
                ?.map((e) =>
                  new Date(e).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
                .join(" - ")
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="mb-5" v-if="changeLog.includes('actorActorProducts')">
      <div class="fst-italic noir w-100 mb-2">
        Produits
      </div>
      <div class="poppins noir ms-2">
        {{ contact.actorActorProducts?.length > 0 ? contact.actorActorProducts?.map((e) => e.actorProductObject?.name).join(' , ') : ' - ' }}
      </div>
    </div>
    <div class="mb-5" v-if="changeLog.includes('substituteds') || changeLog.some((c)=> c.startsWith('substituteds'))">
      <div class="fst-italic noir w-100 mb-2">
        Remplaçants
      </div>
      <div class="poppins noir ms-2" v-if="contact.substituteds?.length > 0">
        <div v-for="e in contact.substituteds">
          {{  e.firstName + " "  +  e.lastName + " , " +e.rpps }}
        </div>
      </div>
      <div v-else>
        -
      </div>

    </div>
    <div class="mb-5" v-if="changeLog.includes('actor1')">
      <div class="fst-italic noir w-100 mb-2">
        Médecins rattachés
      </div>
      <div class="poppins noir ms-2" v-if="contact.actor1?.filter((i)=>i?.listIdActorRelationshipTypeObject?.tag === 'AttachedDoctor')?.length > 0">
        <div v-for="e in contact.actor1?.filter((i)=>i?.listIdActorRelationshipTypeObject?.tag === 'AttachedDoctor')" :key="e">
          {{  e.actor2Object?.actorName }}
        </div>
      </div>
      <div v-else>
        -
      </div>

    </div>
    <div class="mb-5" v-if="changeLog.includes('actorCompany.distributors')">
      <div class="fst-italic noir w-100 mb-2">
        Grossiste répartiteur
      </div>
      <div class="poppins noir ms-2" v-if="contact.actorCompany?.distributors?.length > 0">
        <div v-for="e in contact.actorCompany?.distributors">
          {{  e.distributor?.name }}
        </div>
      </div>
      <div v-else>
        -
      </div>

    </div>
    <div class="mb-5" v-if="changeLog.includes('actorCompany.services')">
      <div class="fst-italic noir w-100 mb-2">
        Services
      </div>
      <div class="poppins noir ms-2" v-if="contact.actorCompany?.services?.length > 0">
        <div v-for="e in contact.actorCompany?.services">
          <span class="poppins noir fw-boldest">{{e.name}} : </span>
          <div>Fax : {{  e.fax || '-' }}</div>
          <div>E-mail : {{   e.email  || '-' }}</div>
          <div>Chef : {{   e.headOfDepartment  || '-' }}</div>
          <div>Equipe : {{ e.team?.length === 0 ? ' - ' : e.team?.map((t)=>t.actorPerson?.actor?.actorName).join(' , ') }}</div>
          <div>Telephone : {{   e.telephone  || '-' }}</div>

          
        </div>
      </div>
      <div v-else>
        -
      </div>

    </div>
    <div class="mb-5" v-if="changeLog.includes('actif')">
      <div class="fst-italic noir w-100 mb-2">
        Etat
      </div>
      <div class="poppins noir ">
        {{ contact.actif === true ? "Actif" : "Inactif" }}
      </div>

    </div>

  </div>
</template>
<script lang="ts" setup>
import lodash from "lodash";
import { useLogStore } from "@/store/useLogModule";
import { computed } from "vue";
const { getModifiedColumns } = useLogStore();
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
  contactType:{
    type:String,
    required:true
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
const showProperty = (changeLogObject:any): boolean => {
  if (props.type === "update") {
    if(changeLogObject.type === 'array'){
        return changeLog.some((e)=>e.startsWith(changeLogObject.showProp))
      }

    if (changeLogObject.type === "address" && changeLog.includes('addressOfActor') ) {
      return lodash.get(contact, changeLogObject.showProp) !== null &&
      lodash.get(contact, changeLogObject.showProp) !== undefined &&
      lodash.get(contact, changeLogObject.showProp) !== ""      ;
    }
    if (changeLogObject.showProp?.includes("rdvDays")) {
      return changeLog.some((e) => e.includes(changeLogObject.showProp));
    }
    return changeLog.includes(changeLogObject.showProp);
  } else {
    if (changeLogObject.showProp === "rdvDays") {
      return contact.rdvVisit;
    }
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
const pdsContact = [
  {
    label: "Civilité",
    showProp: "actorPerson.listIdGenreObject.id",
    value: lodash.get(contact, "actorPerson.listIdGenreObject.captionFr"),
  },
  {
    label: "Nom",
    showProp: "actorName",
    value: lodash.get(contact, "actorName"),
  },
  {
    label: "Prénom",
    showProp: "actorPerson.firstName",
    value: lodash.get(contact, "actorPerson.firstName"),
  },
  {
    label: "Portable",
    showProp: "phone",
    value: lodash.get(contact, "phone"),
  },
  {
    label: "E-mail",
    showProp: "email",
    value: lodash.get(contact, "email"),
  },
  {
    label: "RPPS",
    showProp: "actorPerson.rpps",
    value: lodash.get(contact, "actorPerson.rpps"),
  },
];
const pdsDetails = [
  {
    label: "Titre",
    showProp: "actorPerson.listIdActorPersonTitleObject.id",
    value: lodash.get(contact, "actorPerson.listIdActorPersonTitleObject.captionFr"),
  },
  {
    label: "Qualité",
    showProp: "actorPerson.listIdActorPersonQualityObject.id",
    value: lodash.get(contact, "actorPerson.listIdActorPersonQualityObject.captionFr"),
  },
  {
    label: "Spécialité",
    showProp: "listIdActorPersonSpecializationObject.id",
    value: lodash.get(contact, "listIdActorPersonSpecializationObject.captionFr"),
  },
  {
    label: "Importance",
    showProp: "importance",
    value: lodash.get(contact, "importance"),
  },
  {
    label: "Orientation",
    showProp: "actorActorOrientations",
    value: lodash.get(contact, "actorActorOrientations")
      .map((e) => e.ActorOrientationObject.captionFr)
      .join(" , "),
    type:'array'
  },
  {
    label: "URSAAF",
    showProp: "ursaaf",
    value: lodash.get(contact, "ursaaf"),
  },
  {
    label: "Accepte les visites accompagnées",
    showProp: "actorPerson.acceptAccompagnedVisit",
    value: lodash.get(contact, "actorPerson.acceptAccompagnedVisit") ? "Oui" : "Non",
  },
  {
    label: "Souhaite être invité aux RP",
    showProp: "actorPerson.invitedToPC",
    value: lodash.get(contact, "actorPerson.invitedToPC") ? "Oui" : "Non",
  },
  {
    label: "Se visite uniquement sur RDV",
    showProp: "rdvVisit",
    value: lodash.get(contact, "rdvVisit") ? "Oui" : "Non",
  },
];

const pharmacyContact = [
  {
    label: "Nom",
    showProp: "actorName",
    value: lodash.get(contact, "actorName"),
  },
  {
    label: "Portable",
    showProp: "phone",
    value: lodash.get(contact, "phone"),
  },
  {
    label: "URSAAF",
    showProp: "ursaaf",
    value: lodash.get(contact, "ursaaf"),
  },
  {
    label: "Importance",
    showProp: "importance",
    value: lodash.get(contact, "importance"),
  },
  {
    label: "E-mail",
    showProp: "email",
    value: lodash.get(contact, "email"),
  },
  {
    label: "Se visite uniquement sur RDV",
    showProp: "rdvVisit",
    value: lodash.get(contact, "rdvVisit") ? "Oui" : "Non",
  },
];
const pharmacySales = [
  {
    label: "Civilité",
    showProp: "actor1.1.actor2Object.actorPerson.listIdGenreObject.id",
    value: lodash.get(
      contact,
      "actor1.1.actor2Object.actorPerson.listIdGenreObject.captionFr"
    ),
  },
  {
    label: "Nom",
    showProp: "actor1.1.actor2Object.actorName",
    value: lodash.get(contact, "actor1.1.actor2Object.actorName"),
  },
  {
    label: "Prénom",
    showProp: "actor1.1.actor2Object.actorPerson.firstName",
    value: lodash.get(contact, "actor1.1.actor2Object.actorPerson.firstName"),
  },
  {
    label: "Portable",
    showProp: "actor1.1.actor2Object.phone",
    value: lodash.get(contact, "actor1.1.actor2Object.phone"),
  },
  {
    label: "E-mail",
    showProp: "actor1.1.actor2Object.email",
    value: lodash.get(contact, "actor1.1.actor2Object.email"),
  },
  {
    label: "Telephone",
    showProp: "actor1.1.actor2Object.addressOfActor.0.telephone",
    value: lodash.get(
      contact,
      "actor1.1.actor2Object.addressOfActor.0.telephone"
    ),
  },
  {
    label: "RPPS",
    showProp: "actor1.1.actor2Object.actorPerson.rpps",
    value: lodash.get(contact, "actor1.1.actor2Object.actorPerson.rpps"),
  },

]
const pharmacyManager = [
  {
    label: "Civilité",
    showProp: "actor1.0.actor2Object.actorPerson.listIdGenreObject.id",
    value: lodash.get(
      contact,
      "actor1.0.actor2Object.actorPerson.listIdGenreObject.captionFr"
    ),
  },
  {
    label: "Nom",
    showProp: "actor1.0.actor2Object.actorName",
    value: lodash.get(contact, "actor1.0.actor2Object.actorName"),
  },
  {
    label: "Prénom",
    showProp: "actor1.0.actor2Object.actorPerson.firstName",
    value: lodash.get(contact, "actor1.0.actor2Object.actorPerson.firstName"),
  },
  {
    label: "Portable",
    showProp: "actor1.0.actor2Object.phone",
    value: lodash.get(contact, "actor1.0.actor2Object.phone"),
  },
  {
    label: "E-mail",
    showProp: "actor1.0.actor2Object.email",
    value: lodash.get(contact, "actor1.0.actor2Object.email"),
  },
  {
    label: "Telephone",
    showProp: "actor1.0.actor2Object.addressOfActor.0.telephone",
    value: lodash.get(
      contact,
      "actor1.0.actor2Object.addressOfActor.0.telephone"
    ),
  },
  {
    label: "RPPS",
    showProp: "actor1.0.actor2Object.actorPerson.rpps",
    value: lodash.get(contact, "actor1.0.actor2Object.actorPerson.rpps"),
  },
]
const healthCenterFields = [
  {
    label: "Nom",
    showProp: "actorName",
    value: contact.actorName,
  },
  {
    label: "E-mail",
    showProp: "email",
    value: lodash.get(contact, "email"),
  },
  {
    label: "Importance",
    showProp: "importance",
    value: lodash.get(contact, "importance"),
  },
  {
    label: "Portable",
    showProp: "phone",
    value: lodash.get(contact, "phone"),
  },

];

const entityFields = [
  {
    label: "Nom",
    showProp: "actorName",
    value: contact.actorName,
  },
  {
    label: "Objet social",
    showProp: "actorCompany.listIdActorCompanyFormObject.id",
    value: lodash.get(
      contact,
      "actorCompany.listIdActorCompanyFormObject.captionFr"
    ),
  },
  {
    label: "URSAAF",
    showProp: "ursaaf",
    value: lodash.get(contact, "ursaaf"),
  },

];
const entityInfo = [
  {
    label: "Nom président",
    showProp: "actorCompany.presidentName",
    value: lodash.get(contact, "actorCompany.presidentName"),
  },
  {
    label: "Nom du trésorier",
    showProp: "actorCompany.treasurerName",
    value: lodash.get(contact, "actorCompany.treasurerName"),
  },
  {
    label: "Portable",
    showProp: "phone",
    value: lodash.get(contact, "phone"),
  },
  {
    label: "E-mail",
    showProp: "email",
    value: lodash.get(contact, "email"),
  },

]
console.log(changeLog)

 const addressField = [
  {
    label: "addressOfActor.INDEX.addressType.row1CaptionFr",
    showProp: "addressOfActor.INDEX.row1Value",
    value:  "addressOfActor.INDEX.row1Value",
    type:'address'
  },
  {
    label: "addressOfActor.INDEX.addressType.row2CaptionFr",
    showProp: "addressOfActor.INDEX.row2Value",
    value:  "addressOfActor.INDEX.row2Value",
    type:'address'
  },
  {
    label: "addressOfActor.INDEX.addressType.row3CaptionFr",
    showProp: "addressOfActor.INDEX.row3Value",
    value:  "addressOfActor.INDEX.row3Value",
    type:'address'
  },
  {
    label: "addressOfActor.INDEX.addressType.row4CaptionFr",
    showProp: "addressOfActor.INDEX.row4Value",
    value:  "addressOfActor.INDEX.row4Value",
    type:'address'
  },
  {
    label: "N° rue",
    showProp: "addressOfActor.INDEX.streetNb",
    value:  "addressOfActor.INDEX.streetNb",
    type:'address'
  },
  {
    label: "Rue",
    showProp: "addressOfActor.INDEX.street",
    value:  "addressOfActor.INDEX.street",
    type:'address'
  },
  {
    label: "Complément d’adresse",
    showProp: "addressOfActor.INDEX.notes",
    value:  "addressOfActor.INDEX.notes",
    type:'address'
  },
  {
    label: "Département",
    showProp: "addressOfActor.INDEX.departement",
    value:  "addressOfActor.INDEX.departement",
    type:'address'
  },
  {
    label: "UGA",
    showProp: "addressOfActor.INDEX.listIdUgaObject.code",
    value:  "addressOfActor.INDEX.listIdUgaObject.code",
    type:'address'
  },
  {
    label: "Code postal",
    showProp: "addressOfActor.INDEX.zipCode",
    value:  "addressOfActor.INDEX.zipCode",
    type:'address'
  },
  {
    label: "Ville",
    showProp: "addressOfActor.INDEX.town",
    value:  "addressOfActor.INDEX.town",
    type:'address'
  },
  {
    label: "Pays",
    showProp: "addressOfActor.INDEX.listIdCountryObject.captionFr",
    value:  "addressOfActor.INDEX.listIdCountryObject.captionFr",
    type:'address'
  },
  {
    label: "Téléphone",
    showProp: "addressOfActor.INDEX.telephone",
    value:  "addressOfActor.INDEX.telephone",
    type:'address'
  },
  {
    label: "Fax",
    showProp: "addressOfActor.INDEX.fax",
    value:  "addressOfActor.INDEX.fax",
    type:'address'
  },
] 


</script>
