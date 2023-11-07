import { errorIcon } from "@/assets/js/utils.js";

export default {
    handleHeroError: (el) => {
        el.target.src = errorIcon.hero;
    },
    handleEquipError: (el) => {
        el.target.src = errorIcon.equip;
    }
}