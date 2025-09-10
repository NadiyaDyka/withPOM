// utils/textParser.ts
import texts from "../test-data/pages-texts.json";
import { PageTexts } from "../types/pageTexts";

// Export strictly typed JSON object
export const pageTexts: PageTexts = texts as PageTexts;
