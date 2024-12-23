export class UniqueColorGenerator {
    private generatedColors: Set<string> = new Set();

    generateUniqueColor(): string {
        let color: string;
    
        do {
            color = this.generateSpecificColor();
        } while (this.generatedColors.has(color));
    
        this.generatedColors.add(color);
        return color;
    }

    private generateSpecificColor(): string {
        let color: string;
        do {
            color = this.generateHexColor();
        } while (!this.isAllowedColor(color));
    
        return color;
    }

    private generateHexColor(): string {
      return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
    }

    private isAllowedColor(color: string): boolean {
        const rgb = this.hexToRgb(color);
        if (!rgb) return false;
    
        const { r, g, b } = rgb;
    
        if (b > r && b > g) return false;
        if (r > b && b > g) return false;
    
        const isGray = Math.abs(r - g) < 10 && Math.abs(g - b) < 10;
        const isYellow = r > 200 && g > 200 && b < 100;
        const isGreen = g > r && g > b;
    
        return isGray || isYellow || isGreen;
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
    }
}