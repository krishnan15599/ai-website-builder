import { WebsiteSection } from "@/types";

/**
 * Merges a newly received list of sections with the existing list.
 * If a section's contents remain unchanged, its original object reference is preserved.
 * This satisfies React rendering performance optimizations and handles JSON Diff requirements.
 */
export function mergeWebsiteSections(
  prevSections: WebsiteSection[],
  newSections: WebsiteSection[]
): WebsiteSection[] {
  return newSections.map((newSec) => {
    const prevSec = prevSections.find((ps) => ps.id === newSec.id);
    if (!prevSec) {
      // Fresh section generated
      return newSec;
    }

    // Compare content values to detect diffs
    const hasChanged = JSON.stringify(prevSec) !== JSON.stringify(newSec);
    
    // Return original reference if unchanged, or the new one if edited
    return hasChanged ? newSec : prevSec;
  });
}
