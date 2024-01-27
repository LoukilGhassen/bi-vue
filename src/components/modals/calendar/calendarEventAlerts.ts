import VueSweetAlert from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { hideModal } from "@/core/helpers/calendarUtils";

export const successSweetAlert = (newTargetModalRef: any) => {
    VueSweetAlert.fire({
        text: "L'événement a été soumis avec succès!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "D'accord, j'ai compris!",
        customClass: {
            confirmButton: "btn btn-primary",
        },
    }).then(() => {
        hideModal(newTargetModalRef); 
    });
}

export const errorSweetAlert = () => {
    VueSweetAlert.fire({
        text: "Désolé, il semble qu'il y ait des erreurs détectées, veuillez réessayer.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "D'accord, j'ai compris!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
}