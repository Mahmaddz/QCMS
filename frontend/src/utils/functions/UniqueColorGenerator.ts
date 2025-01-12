import { ArabicServices } from "arabic-services";
import { CurrentSearch } from "../../interfaces/SearchForm";

export class UniqueColorGenerator {
    private generatedColors: Set<string> = new Set();
    private baseColors: string[] = [
        '#FF69B4', // Pink
        '#FFA500', // Orange
        '#FF0000', // Red
        '#008000', // Green
        '#A52A2A', // Brown
        '#00FFFF', // Cyan
        '#808080', // Gray
        '#CCCC00', // Yellow
    ];
    private variantsGenerated: number = 0;

    getSearchTypeColor(searchType: CurrentSearch, word: string) : string {
        if (searchType.method.split(' ').includes('isDefault')) {
            return '#FF0000'
        }
        else if (searchType.method.split(' ').includes('isReference') && searchType.search.split(' ').map(val => ArabicServices.removeTashkeel(val)).includes(ArabicServices.removeTashkeel(word))) {
            return '#CCCC00'
        }
        return '#FF69B4'
    }

    generateUniqueColor(): string {
        let color: string;

        do {
            color = this.generateSpecificColor();
        } while (this.generatedColors.has(color));

        this.generatedColors.add(color);
        return color;
    }

    private generateSpecificColor(): string {
        if (this.generatedColors.size < this.baseColors.length) {
            return this.baseColors[this.generatedColors.size];
        } else {
            return this.generateVariantColor();
        }
    }

    private generateVariantColor(): string {
        const baseColor = this.baseColors[this.variantsGenerated % this.baseColors.length];
        this.variantsGenerated++;
        return this.adjustBrightness(baseColor, (this.variantsGenerated % 2 === 0 ? 20 : -20));
    }

    private adjustBrightness(hex: string, amount: number): string {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const adjust = (value: number) => Math.min(255, Math.max(0, value + amount));
        const r = adjust(rgb.r);
        const g = adjust(rgb.g);
        const b = adjust(rgb.b);

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!match) return null;

        return {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16),
        };
    }

    reset(): void {
        this.generatedColors.clear();
        this.variantsGenerated = 0;
    }
}
