import { MAP } from "../../types/map";

export const mergeMaps = (map1: MAP, map2: MAP): MAP => {
    const merged: MAP = { ...map1 };
    Object.entries(map2).forEach(([key, values]) => {
        if (merged[key]) {
            merged[key] = Array.from(new Set([...merged[key], ...values]));
        } else {
            merged[key] = values;
        }
    });
    return merged;
};