import { ref } from "vue";
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";

const { currentUser } = storeToRefs(useAuthStore());

export default function useDocMenuConfig() { 
  const DocMenuConfig = ref([
    {
      pages: [
        {
          heading: "Accueil",
          route: "/",
          svgIcon: "/svg/icons/home.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Agenda",
          route: `/admin/calendar`,
          svgIcon: "/svg/icons/agenda.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Visite",
          route: `/admin/Visites`,
          svgIcon: "/svg/icons/adress.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Contact",
          route: `/admin/contacts`,
          svgIcon: "/svg/icons/profil.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Activité Hors Terrain",
          route: `/admin/offFieldActivity`,
          svgIcon: "/svg/icons/clock.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Statistique",
          route: `/admin/Statistiques`,
          svgIcon: "/svg/icons/statistic.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Aides de visite",
          route: `/admin/visit-help`,
          svgIcon: "/svg/icons/notebook.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      pages: [
        {
          heading: "Congrès",
          route: `/admin/congres`,
          svgIcon: "/svg/icons/congres.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
  ]);
  return DocMenuConfig;
}
