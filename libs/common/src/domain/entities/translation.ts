import { LocaleCode } from "../value-objects/locale-code.value-object";


export class Translation {
    constructor(
        private readonly id: number | null,
        private readonly locale_code: LocaleCode,
        private readonly created_at: Date | null,
        private readonly updated_at: Date | null,
    ) { }

    getId(): number | null {
        return this.id;
    }

    getLocaleCode(): string {
        return this.locale_code.value;
    }

    getCreatedAt(): Date | null {
        return this.created_at;
    }

    getUpdatedAt(): Date | null {
        return this.updated_at;
    }
    
}
