# DESIGN.md: Mannat Sidhu, v2 (the jaali wall)

## Brief
- Mannat Sidhu: MSc Management at UCD Smurfit, founder of Pehchaan Creative, operations and marketing at Pritaara, ex-BCG.
- Audience: hiring managers for consulting, commercial strategy and business operations roles. Mostly non-Indian readers.
- Job of the site: stand out, prove business literacy, and get an email.
- Sources: Mannat's CV (Nov 2026), the Team 10 Sculpted deck (I&E × Deloitte Case Competition final), LinkedIn, Substack, Behance links.
- Every number on the site comes from those sources. Lines marked DRAFT in `src/data/site.ts` are wording to check.

## Concept card
```
Idea:        Mannat means a vow. At shrines people tie a thread to a carved stone screen, a jaali, and untie it when the
             promise is kept. The site's grid is the jaali; each red thread is a promise that leads to its proof.
Metaphor:    the jaali (stone lattice) and the mannat thread.
Signature:   threads hang from the lattice and lead somewhere real: hero tags, work cards tied to a rail, skill pairs
             bridged across a strip, the resume timeline. One pink thread at the end is left for the visitor.
             (motion/threads.ts; the case-page story thread with its tangle is motion/thread.ts)
Emotion:     calm, warm, precise. A manager's site with a designer's hand.
Motion verb: drop, swing, settle. Threads drop in, sway slightly, lean away from the pointer, pull taut when used.
Screenshot:  the hero: name and headline on cream, the lattice wall with labelled threads hanging to the right.
```
Why it explains itself to a non-Indian reader: a two-sentence "What the thread means" section sits directly under the
hero, and the hero caption gives the word, its meaning and a link to it.

## Hierarchy (home)
1. Hero: name, "Manager with a designer's eye.", role line, Email me (pink) and Download resume; four real numbers.
2. What the thread means (the explainer).
3. Selected work (the one dark section): four cards, each leading with the business outcome.
4. How design skills transfer to management: six pairs, one open at a time, each with an example from real work.
5. What I studied this year: five MSc modules, each tied to where it was used in the Sculpted case; frameworks strip.
6. Why hire me: three promises.
7. Writing and design work: LinkedIn, Substack, Behance.
8. Contact: the wall again, all threads tied, one pink thread "Yours".

## Visual language
- Cream #FFF8EC ground, stone #F6EAD3 cards, ink #1A0F2E type; one ink section (Selected work).
- Accents, one job each: red #E5260D = thread and knots only; turmeric #FFC21A = one highlight per section;
  pink #FF3E8E = the visitor's thread and the Email me action only.
- Type: Cabinet Grotesk 800 (display), Switzer 400 to 600 (text), Mukta 700 subset for मन्नत only.
- Headings are literal so people and AI summaries read the page correctly; Person JSON-LD carries alumniOf, knowsAbout, seeks.

## Decisions
- No WebGL; threads are SVG paths updated on the GSAP ticker only while their section is on screen.
- Threads are decorative (aria-hidden); every destination is also a normal link.
- Phones: no loader, four hero threads instead of seven, card and module threads off, skill pairs stack.
- Idle motion: threads sway on home and case pages. The resume and 404 first screens are still by choice; the
  resume's threads sway once the timeline is in view.
- The PDF resume is printed from /resume/ (print stylesheet), so it always matches the site. Swap in a designed PDF
  at public/mannat-sidhu-resume.pdf if preferred.
