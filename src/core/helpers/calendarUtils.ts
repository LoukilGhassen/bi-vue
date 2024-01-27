import { CalendarEvent } from "@prisma/client";
import { Modal } from "bootstrap";

const hideModal = (modalEl: HTMLElement | null): void => {
  if (!modalEl) {
    return;
  }

  const myModal = Modal.getInstance(modalEl);
  myModal.hide();
};

const removeModalBackdrop = (): void => {
  if (document.querySelectorAll(".modal-backdrop.fade.show").length) {
    document.querySelectorAll(".modal-backdrop.fade.show").forEach((item) => {
      item.remove();
    });
  }
};

function hexToRgb(hex: any) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function generateTextColorBasedOnBackground(color?: string) {
  if (color) {
    let rgbColor = hexToRgb(color);
    return rgbColor!.r * 0.299 + rgbColor!.g * 0.587 + rgbColor!.b * 0.114 > 186
      ? "#303133"
      : "#ffffff";
  } else {
    return "#ffffff";
  }
}

function generateEventColorBasedOnType(event?: any) {
  const endDate =
    event.aboutAny === "visit"
      ? new Date(
          new Date(
            `${event.startDate.split("T")[0]}T${event.startTime.split("T")[1]}`
          ).getTime() +
            event.listIdDurationObject.code * 60000
        )
      : new Date(
          `${event?.endDate?.split("T")[0]}T${event?.endTime.split("T")[1]}`
        );
  switch (event.aboutAny) {
    case "visit":
      return {
        bgColor: `rgba(191, 235, 235)`,
        textColor: "#363636",
      };
    case "OffFieldActivity":
      return event.storyEvents?.OffFieldType?.listIdEventTypeValueObject
        ?.tag === "RP/STAFF"
        ? { bgColor: `rgba(127, 17, 224)`, textColor: "#ffffff" }
        : event.storyEvents?.OffFieldType?.listIdEventTypeValueObject?.tag ===
          "Leave"
        ? { bgColor: `rgba(255, 114, 0)`, textColor: "#ffffff" }
        : { bgColor: `rgba(255, 194, 0)`, textColor: "#363636" };

    case "Appointment":
      return { bgColor: `rgba(255, 30, 190)`, textColor: "#ffffff" };

    default:
      return {
        bgColor: `rgba(191, 235, 235)`,
        textColor: "#20202080",
      };
  }
}

function formatDateToISOString(inputDate: any) {
  const localDate = new Date(inputDate);
  const utcDate = new Date(
    localDate.getTime() + localDate.getTimezoneOffset() * 60000
  ).toISOString();
  return utcDate;
}
function getDateInfo(dateString: string) {
  const inputDate = new Date(dateString);
  // Get the month and add 1 to make it 1-based (0-based by default)
  const dayGridMonth = inputDate.getMonth() + 1;

  // // Get the year week number 
   const yearStart = new Date(inputDate.getFullYear(), 0, 1);
   const timeGridWeek = Math.ceil(((inputDate - yearStart) / 86400000 + 1) / 7);
   
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const timeGridDay = inputDate.getDate();
  return {
    dayGridMonth,
    timeGridWeek,
    timeGridDay,
  };
}

export {
  removeModalBackdrop,
  hideModal,
  hexToRgb,
  generateTextColorBasedOnBackground,
  generateEventColorBasedOnType,
  formatDateToISOString,
  getDateInfo,
};
