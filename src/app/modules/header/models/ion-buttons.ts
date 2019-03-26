export class ConfigButton {
    slot: string;
    button: Array<Button>;
}

export class Button {
    ionIcon?: IonIcon;
    ionBack?: IonBack;
}

export class IonIcon {
    name: string;
    size: string;
    route: string;
}

export class IonBack {
    text: string;
}
