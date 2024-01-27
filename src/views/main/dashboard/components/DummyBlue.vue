<template>
  <div class="next-rdv__container w-100 h-100">
    <div class="p-5 mt-8 d-flex gap-3 acivity">
      <div style="height: 200px; width: 200px">
        <Pie :data="allStoriesStats" :options="options" :plugins="plugins" />
      </div>


    </div>
  </div>
</template>
<script setup >
import { ref, onMounted ,computed} from "vue";
import { Pie } from "vue-chartjs";
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

const plugins = [ChartDataLabels]

const options = computed(()=>{
  return {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      color: "blue",
      formatter: (value, context) => {
         return  '60';
      },
    },
  },
}
});

const allStoriesStats = computed(()=> {
  return {labels: ["Visites", "Activités hors terrain"],
  datasets: [
    {
      backgroundColor: ["#10E5E5", "#FF1EBE"],
       data:[52,20],

    }
  ]}
});


</script>

<style lang="scss" scoped>
.next-rdv__ {
  &container {
    //overflow-y: scroll;
    border-radius: 10px;
    box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
  }
  &percent {
    background: rgba(16, 229, 229, 0.2);
  }
  &other {
    background-color: rgba(230, 233, 237, 1);
  }
}

.legend {
  ul {
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    overflow-y: scroll;
    max-height: 300px;
  }

  li {
    display: flex;
    align-items: center;
    margin-right: 30px;
    width: 35%;
  }

  span {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
  }
}
.ellipsis {
  white-space: nowrap;
  //overflow: hidden;
  //text-overflow: ellipsis;
  width: 65px;
}
.divider {
}
.acivity {
  // overflow-y: scroll;
  max-height: 400px;
}
</style>
