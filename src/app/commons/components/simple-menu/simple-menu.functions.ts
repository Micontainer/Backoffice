import { OptionItem } from "./simple-menu.api";

export function CheckComponentSelectedEventHandler(options: OptionItem[], component: string) {
    options.forEach((opt) => {
        opt.selected = opt.component === component;
    });
}