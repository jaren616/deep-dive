/** Ocean Journal: real deep-sea creatures, unlocked by your best depth. */
export interface JournalEntry {
  depth: number;
  name: string;
  emoji: string;
  fact: string;
}

export const JOURNAL: JournalEntry[] = [
  { depth: 0, name: 'Sea otter', emoji: '🦦', fact: 'Sea otters have the densest fur of any animal — up to a million hairs per square inch.' },
  { depth: 100, name: 'Green sea turtle', emoji: '🐢', fact: 'Green turtles navigate thousands of kilometres back to the beach where they hatched.' },
  { depth: 200, name: 'Lanternfish', emoji: '🐟', fact: 'Lanternfish may be the most abundant vertebrates on Earth.' },
  { depth: 500, name: 'Swordfish', emoji: '🗡️', fact: 'Swordfish heat their eyes and brain to see better in cold, dark water.' },
  { depth: 800, name: 'Vampire squid', emoji: '🦑', fact: 'Despite the name, it eats “marine snow” — drifting bits of dead plankton.' },
  { depth: 1000, name: 'Sperm whale', emoji: '🐋', fact: 'Sperm whales dive beyond 2,000 m hunting giant squid, holding their breath for over an hour.' },
  { depth: 1500, name: 'Anglerfish', emoji: '🐡', fact: 'Female anglerfish lure prey with a glowing rod lit by symbiotic bacteria.' },
  { depth: 2000, name: 'Gulper eel', emoji: '🐍', fact: 'Its huge hinged mouth lets it swallow prey nearly as big as itself.' },
  { depth: 2500, name: 'Dumbo octopus', emoji: '🐙', fact: 'The deepest-living octopus, flapping ear-like fins to “fly” over the sea floor.' },
  { depth: 3000, name: 'Giant isopod', emoji: '🦐', fact: 'A woodlouse relative up to 50 cm long that can go years without eating.' },
  { depth: 4000, name: 'Tripod fish', emoji: '🦴', fact: 'It perches on three stiff fins, facing the current to catch drifting food.' },
  { depth: 5000, name: 'Sea pig', emoji: '🐖', fact: 'Sea pigs are sea cucumbers that walk across the abyss on tube feet.' },
  { depth: 6000, name: 'Hadal snailfish', emoji: '👻', fact: 'Snailfish have been filmed at 8,336 m — the deepest fish ever seen.' },
  { depth: 7000, name: 'The Krillion', emoji: '✨', fact: 'Legend says only perfect divers glimpse it. You are one of them.' },
];

export const unlockedEntries = (bestDepth: number) => JOURNAL.filter((e) => bestDepth >= e.depth);
