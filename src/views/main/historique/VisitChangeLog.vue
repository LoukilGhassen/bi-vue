<template>
<div class="w-100">
    <div  v-if="showProperty('startDate')">
        <p class='fst-italic noir w-100'>Date de début</p>
        <p class="poppins noir bold w-100">
            {{ 
                new Date(story.startDate).toLocaleDateString("FR-fr", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
            }}
        </p>
    </div>
    <div  v-if="showProperty('startTime')">
        <p class='fst-italic noir w-100'>Heure de début</p>
        <p class="poppins noir bold w-100">
            {{ 
                new Date(story.startTime).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
            })        
            }}
        </p>
    </div>
    <div  v-if="showProperty('endDate')">
        <p class='fst-italic noir w-100'>Date de fin</p>
        <p class="poppins noir bold w-100">
            {{ 
                new Date(story.endDate).toLocaleDateString("FR-fr", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
            }}
        </p>
    </div>
    <div  v-if="showProperty('endTime')">
        <p class='fst-italic noir w-100'>Heure de fin</p>
        <p class="poppins noir bold w-100">
            {{ 
                new Date(story.endTime).toLocaleTimeString("FR-fr", {
                    hour: "2-digit",
                    minute: "2-digit",
            })        
            }}
        </p>
    </div>
    <div  v-if="showProperty('description')">
        <p class='fst-italic noir w-100'>description</p>
        <p class="poppins noir bold w-100">
            {{ 
                story.description
            }}
        </p>
    </div>
    <div  v-if="showProperty('captionFr')">
        <p class='fst-italic noir w-100'>Nom de l’évènement</p>
        <p class="poppins noir bold w-100">
            {{ 
                story.captionFr
            }}
        </p>
    </div>
    <div  v-if="showProperty('actorIdByObject.actorName')">
        <p class='fst-italic noir w-100'>contact</p>
        <p class="poppins noir bold w-100">
            {{ 
                story.actorIdByObject?.actorName
            }}
        </p>
    </div>
    <div class="w-100" v-if="story && story.aboutAny === 'visit' ">
        <div v-if="showProperty('storyEvents.Visit.listIdEventTypeValueObject.captionFr')">
            <p class='fst-italic noir w-100'>Motif de visite</p>
            <p class="poppins noir bold w-100">
                    {{ story.storyEvents?.Visit?.listIdEventTypeValueObject?.captionFr }}
            </p>
        </div>
        <div v-if="showProperty('storyEvents.VisitType.listIdEventTypeValueObject.captionFr')">
            <p class='fst-italic noir w-100'>Type de visite</p>
            <p class="poppins noir bold w-100">
                    {{ story.storyEvents?.VisitType?.listIdEventTypeValueObject?.captionFr }}
            </p>
        </div>
        <div v-if="showProperty('storyEvents.Visit.address')">
            <p class='fst-italic noir w-100'>Adresse</p>
            <p class="poppins noir bold w-100">
                    {{ (
                        (story?.storyEvents?.Visit?.address?.streetNb ? story?.storyEvents?.Visit?.address?.streetNb + ' ' : '')
                        +
                        (story.storyEvents?.Visit?.address?.street ? story?.storyEvents?.Visit?.address?.street + " " : '')
                        +
                        ( story.storyEvents?.Visit?.address?.zipCode ? story?.storyEvents?.Visit?.address?.zipCode + " " : "")
                        +
                        ( story.storyEvents?.Visit?.address?.town ? story?.storyEvents?.Visit?.address?.town + ' ' : '')
                        ) 
                            ?? 
                            ' - ' 
                    }}
            </p>
        </div>
        <div v-if="showProperty('storyEvents.NextVisit')">
            <p class='fst-italic noir w-100'>Prochaine visite</p>
            <p class="poppins noir bold w-100">
                <div v-if="showProperty('storyEvents.NextVisit.storyEventInvolves.0.anyId.story.storyEvents.0.description')">
                    Description : {{story?.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.storyEvents[0]?.description ? story?.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.storyEvents[0]?.description : ' -'}}
                </div>
                <div  v-if="showProperty('storyEvents.NextVisit.storyEventInvolves.0.anyId.story.startDate')">
                    Date de début : {{
                        story.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.startDate ?
                        new Date(story?.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.startDate).toLocaleDateString("FR-fr", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }) :
                        '   - '
                    }}
                </div>
                <div v-if="showProperty('storyEvents.NextVisit.storyEventInvolves.0.anyId.story.startTime')">
                    Heure de début : {{
                        story?.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.startTime ?
                        new Date(story.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startTime).toLocaleTimeString("FR-fr", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }) : '   - '
                    }}
                </div>
                <div  v-if="showProperty('storyEvents.NextVisit.storyEventInvolves.0.anyId.story.endTime')">
                    Heure de fin : {{
                        story?.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.endTime ? 
                        new Date(story.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.endTime).toLocaleTimeString("FR-fr", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        :
                        '  - '
                    }}
                </div>
            </p>
        </div>
        <div  v-if="showProperty('listIdDurationObject.captionFr')">
            <p class='fst-italic noir w-100'>Temps de visite</p>
            <p class="poppins noir bold w-100">
                    {{ story.listIdDurationObject?.captionFr }}
            </p>
        </div>
        <div  v-if="showProperty('storyEvents.ContactAttendant.storyEventInvolves')">
            <p class='fst-italic noir w-100'>Acompagnants</p>
            <p  v-if="!story?.storyEvents?.ContactAttendant?.storyEventInvolves?.length" class="poppins noir bold w-100">-</p>
            <p v-else class="poppins noir bold w-100">
                {{ story?.storyEvents?.ContactAttendant?.storyEventInvolves?.map((e)=>{
                    return e.anyId?.user?.firstName +' ' + e.anyId?.user?.lastName  
                }).join(' , ') }}
            </p>
        </div>
        <div  v-if="showProperty('storyEvents.ContactReplacement.storyEventInvolves.0.anyId')">
            <p class='fst-italic noir w-100'>Remplaçant</p>
            <p  v-if="!story?.storyEvents?.ContactReplacement?.storyEventInvolves?.length" class="poppins noir bold w-100">-</p>
            <p class="poppins noir bold w-100">
                <span v-if="!story?.storyEvents?.ContactReplacement?.storyEventInvolves[0]?.anyId">
                    -
                </span>            
                <span v-else>
                {{ story?.storyEvents?.ContactReplacement?.storyEventInvolves[0].anyId?.substitute?.firstName + ' ' +
                    story?.storyEvents?.ContactReplacement?.storyEventInvolves[0].anyId?.substitute?.lastName + ' '+
                    story?.storyEvents?.ContactReplacement?.storyEventInvolves[0].anyId?.substitute?.rpps}}
                </span>
            </p>
        </div>
        <div  v-if="showProperty('storyEvents.Product.storyEventInvolves')">
            <p class='fst-italic noir w-100'>Produits  rattachés</p>
            <span v-if="story?.storyEvents?.Product?.storyEventInvolves?.length===0">-</span>
            <div v-else  class="poppins noir bold w-100" >
                <div v-for="e in story?.storyEvents?.Product?.storyEventInvolves" :key="e">
                    {{e.anyId?.actorProduct?.name}} , Action : {{e.listIdProductActionObject?.captionFr}} , Résultat : {{ e.listIdProductResultObject?.captionFr }}
                </div>
            </div>
        </div>   
        <div  v-if="showProperty('storyEvents.InPlaceSample.storyEventInvolves')">
            <p class='fst-italic noir w-100'>Echantillons remis sur place</p>
            <span v-if="story?.storyEvents?.InPlaceSample?.storyEventInvolves?.length===0">-</span>
            <div v-else  class="poppins noir bold w-100" >
                <div v-for="e in story?.storyEvents?.InPlaceSample?.storyEventInvolves" :key="e">
                    {{e.anyId?.packaging?.sample?.name}} , Quantité : {{e.anyId?.packaging?.qty}}
                </div>
            </div>
        </div>           
        <div  v-if="showProperty('storyEvents.ToSendSample.storyEventInvolves')">
            <p class='fst-italic noir w-100'>Echantillons à expédier</p>
            <span v-if="story?.storyEvents?.ToSendSample?.storyEventInvolves?.length===0">-</span>
            <div v-else  class="poppins noir bold w-100">
                <div v-for="e in story?.storyEvents?.ToSendSample?.storyEventInvolves" :key="e">
                    {{e.anyId?.packaging?.sample?.name}} , Quantité : {{e.anyId?.packaging?.qty}} , Ardesse :
                        {{ (
                        (e.anyId?.packaging?.address?.streetNb ? e.anyId?.packaging?.address?.streetNb + ' ' : '')
                        +
                        (e.anyId?.packaging?.address?.street ? e.anyId?.packaging?.address?.street + " " : '')
                        +
                        ( e.anyId?.packaging?.address?.zipCode ? e.anyId?.packaging?.address?.zipCode + " " : "")
                        +
                        ( e.anyId?.packaging?.address?.town ? e.anyId?.packaging?.address?.town + ' ' : '')
                        ) 
                            ?? 
                            ' - ' 
                    }}
                    {{ ((e.anyId?.packaging?.address?.town  || '') + (e.anyId.packaging?.address?.street || '') +( e.anyId?.packaging?.address?.row1Value || '')) ? ((e.anyId?.packaging?.address?.town || '') + (e.anyId.packaging?.address?.street || '') +( e.anyId?.packaging?.address?.row1Value || '')) : ' - ' }}
                </div>
            </div>
        </div>          
    </div>
    <div class="w-100" v-if="story && story.aboutAny === 'Appointment' ">
        <div v-if="showProperty('storyEvents.AppointmentReason.description')">
            <p class='fst-italic noir w-100'>Objectif du rendez-vous</p>
            <p class="poppins noir bold w-100">
                    {{ story?.storyEvents?.AppointmentReason?.description }}
            </p>
        </div>
        <div v-if="showProperty('storyEvents.AppointmentType.listIdEventTypeValueObject.captionFr')">
            <p class='fst-italic noir w-100'>Type</p>
            <p class="poppins noir bold w-100">
                    {{ story.storyEvents?.AppointmentType?.listIdEventTypeValueObject?.captionFr }}
            </p>
        </div>
        <div v-if="showProperty('storyEvents.AppointmentEvent.description')">
            <p class='fst-italic noir w-100'>Adresse</p>
            <p class="poppins noir bold w-100">
                    {{ story?.storyEvents?.AppointmentEvent?.description
                    }}
            </p>
        </div>
    </div>
    <div class="w-100" v-if="story && story.aboutAny === 'OffFieldActivity' ">
        <div v-if="showProperty('storyEvents.OffFieldType.listIdEventTypeValueObject.captionFr')">
            <p class='fst-italic noir w-100'>Nature de l’évenement</p>
            <p class="poppins noir bold w-100">
                    {{ story.storyEvents?.OffFieldType?.listIdEventTypeValueObject?.captionFr }}
            </p>
        </div>
        <div v-if="showProperty('storyEvents.OffFieldActivityContact.storyEventInvolves')">
            <p class='fst-italic noir w-100'>contact(s)</p>

            <p class="poppins noir bold w-100">
                <p  v-if="!story.storyEvents?.OffFieldActivityContact?.storyEventInvolves?.length" class="poppins noir bold w-100">-</p>
                <p v-else class="poppins noir bold w-100">
                    {{ story.storyEvents.OffFieldActivityContact?.storyEventInvolves?.map((e)=>{
                        return e.anyId?.actor?.actorName  
                    }).join(' , ') }}
                </p>
    
                
                    
            </p>
        </div>
        <div v-if="showProperty('storyEvents.OffField.description')">
            <p class='fst-italic noir w-100'>Adresse</p>
            <p class="poppins noir bold w-100">
                    {{ story.storyEvents?.OffField?.description
                    }}
            </p>
        </div>
    </div>

</div>

</template>
<script lang="ts" setup>

import lodash from "lodash";
import {useLogStore} from '@/store/useLogModule'
import { computed } from "vue";
const {getModifiedColumns} = useLogStore()
const props = defineProps({
 type: {
    type:   String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
  isOld:{
    type:Boolean,
    required:false,
    default:false
  }
});
let story = null
let oldValue = {}
let newValue = {}
let changeLog:string[] = [] 
if(props.type === 'update'){
    oldValue = lodash.cloneDeep(props.payload?.oldValue);
    newValue = lodash.cloneDeep(props.payload?.newValue);
    const oldStoryEvent = oldValue?.storyEvents?.reduce((obj, item) => {
            const key = item?.listIdEventTypeObject?.tag;
            obj[key] = item;
            return obj;
            }, {});
    oldValue = {...oldValue,storyEvents:oldStoryEvent};
    const newStoryEvent = newValue?.storyEvents?.reduce((obj, item) => {
            const key = item?.listIdEventTypeObject?.tag;
            obj[key] = item;
            return obj;
            }, {});
    newValue = {...newValue,storyEvents: newStoryEvent};
    changeLog = getModifiedColumns(oldValue,newValue)
    story = props.isOld ? oldValue : newValue
}else{
    const newStoryEvent = props.payload?.storyEvents.reduce((obj, item) => {
            const key = item?.listIdEventTypeObject?.tag;
            obj[key] = item;
            return obj;
            }, {});
    story = {...props.payload,storyEvents: newStoryEvent};
}
const showProperty = (changeLogProp:string): boolean => {
    
    if(props.type === 'update' ){
        if(changeLogProp === ('storyEvents.NextVisit') && changeLog.some((e)=>e.includes(changeLogProp))){
            return true
        }
        return changeLog.includes(changeLogProp)
    }else{
        if(changeLogProp === ('storyEvents.NextVisit')){
            return( story?.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.storyEvents[0]?.description  ||
                    story.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.startDate ||
                    story.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.startTime ||
                    story.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story?.endTime  
                    )
        }
        return (
            lodash.get(story,changeLogProp) !== null
             && lodash.get(story,changeLogProp) !== undefined
             && lodash.get(story,changeLogProp) !== ""
              && (!lodash.isArray(lodash.get(story,changeLogProp))
             ||
            lodash.isArray(lodash.get(story,changeLogProp)) && 
            lodash.get(story,changeLogProp).length > 0)) 

        
        }
    }

</script>