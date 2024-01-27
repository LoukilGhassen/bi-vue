import { defineStore } from "pinia";


const initialConfig = {
  layout: {
    cols: 12,
    rows: 40,
  },
  editMode: false,
  chachelis: [
    {
      x: 0,
      y: 0,
      w: 3,
      h: 12,
      available: false,
      comp: "DummyBlue",
      reduced: false,
      title: "Rendez-vous en cours",
      icon: "rdv.svg",
      description: "Votre carnet de bord pout optimiser votre prochaine visite",
    },
  ],
};
export const useDashboardStore = defineStore("dashboard-store", {
  state: () => {
    return {
      config: ({...initialConfig}),
    };
  },

  getters: {},

  actions: {
    reduceView(payload: string) {

      this.config.chachelis = this.config.chachelis.map((item) =>
        item.comp === payload ? { ...item, reduced: true } : item
      )
    },
    extendView(payload: string) {
      this.config.chachelis = this.config.chachelis.map((item) =>
        item.comp === payload ? { ...item, reduced: false } : item
      )
    },
    deleteWidget(payload: string) {
      this.config.chachelis = this.config.chachelis.map((item) => item.comp === payload ? { ...item, available: true } : item)
    },
    addWidget(comp:string) {
      this.config.chachelis =this.config.chachelis.map((chacheli) => chacheli.comp === comp ? {...chacheli,x:0,y:this.minRows() + 1,available:false,reduced:false} : chacheli) 

    },
    minRows() {
      let min = 1;
      for (let i = 0; i < this.config.chachelis.length; i++) {
        let c = this.config.chachelis[i];
        if (!c.available) min = Math.max(min, c.y + c.h);
      }
      return min;
    },
    minColmuns() {
      let min = 1;
      for (let i = 0; i < this.config.chachelis.length; i++) {
        let c = this.config.chachelis[i];
        if (!c.available) min = Math.max(min, c.x + c.w);
      }
      return min;
    },
    setCols(v: number) {
      if (v <= 15 && v >= 12) this.config.layout.cols = v;
    },
    setRows(v: number) {
      if (v >= 20 && v <= 40) this.config.layout.rows = v;
    }
  },
});
