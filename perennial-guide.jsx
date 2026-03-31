import { useState, useMemo, useCallback, useEffect } from "react";

// ─── PLANT DATABASE ──────────────────────────────────────────────────────────
const PLANTS = [
  {
    id: 1, name: "Echinacea (Coneflower)", botanical: "Echinacea purpurea",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Deadhead for extended bloom; 'PowWow' series reblooms reliably",
    attracts: ["Butterflies","Bees","Birds"], nativeOhio: true,
    gardenStyles: ["Cottage","Pollinator","Prairie","Border"],
    companions: ["Black-eyed Susan","Lavender","Catmint","Bee Balm","Karl Foerster"],
    yearRound: "Seed heads provide winter bird food and architectural interest",
    foliageInterest: "Dark green basal rosettes emerge early spring",
    cultivars: ["Magnus (classic purple)","PowWow Wild Berry (compact, reblooming)","Cheyenne Spirit (mixed colors)","White Swan","Green Jewel (green petals)","Sombrero series (compact)"],
    fertilizer: "Light; 10-10-10 in early spring", fertMonth: [3,4],
    care: {3:"Cut back old stems if not done in fall",4:"Divide crowded clumps every 3-4 years",5:"Mulch around base",6:"Deadhead spent blooms for rebloom",7:"Continue deadheading",8:"Watch for powdery mildew",9:"Allow some seed heads to remain for birds",10:"Leave seed heads for winter interest",11:"Optional: cut back to 4 inches"},
    video: "https://www.youtube.com/results?search_query=echinacea+coneflower+care+zone+6",
    description: "A staple native prairie flower, coneflower is one of the most reliable, long-blooming perennials for Cleveland gardens. Thrives in poor soil and attracts masses of pollinators."
,
    planted: [], clevelandCultivars: ["PowWow Wild Berry", "Magnus", "Sombrero Series", "Cheyenne Spirit"], whereToBuy: "Proven Winners; Vigoro", whenAvailable: "Jun-Sep", clevelandLightNote: "Full sun; accepts light afternoon shade."
  },
  {
    id: 2, name: "Black-Eyed Susan", botanical: "Rudbeckia fulgida",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [7,8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Long single bloom period Jul-Oct",
    attracts: ["Butterflies","Bees","Birds"], nativeOhio: true,
    gardenStyles: ["Cottage","Pollinator","Prairie","Border","Naturalized"],
    companions: ["Echinacea","Sedum","Aster","Joe Pye Weed","Switchgrass"],
    yearRound: "Seed heads persist through winter for birds",
    foliageInterest: "Dense green basal foliage",
    cultivars: ["Goldsturm (classic, most popular)","Little Goldstar (compact 14-16 in)","American Gold Rush (mildew resistant)","Viette's Little Suzy (dwarf)"],
    fertilizer: "Minimal; compost in spring", fertMonth: [4],
    care: {3:"Cut back dead growth",4:"Divide every 3-4 years; apply compost",5:"Mulch",7:"Blooms begin",9:"Allow seed heads for birds",10:"Enjoy fall color",11:"Leave standing or cut back"},
    video: "https://www.youtube.com/results?search_query=rudbeckia+black+eyed+susan+care",
    description: "The quintessential late-summer perennial, producing masses of golden-yellow daisy-like flowers. Goldsturm is the gold standard cultivar for reliable performance."
,
    planted: ["Viettes Little Suzy"], clevelandCultivars: ["Goldsturm", "Little Goldstar", "American Gold Rush"], whereToBuy: "Proven Winners; Vigoro", whenAvailable: "Jun-Sep", clevelandLightNote: "Half to full sun; in hot sites, give afternoon shade."
  },
  {
    id: 3, name: "Hosta - Sum and Substance", botanical: "Hosta 'Sum and Substance'",
    type: "Perennial Foliage", height: "30-36 in", width: "48-72 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Pale lavender flowers on tall scapes in mid-summer",
    attracts: ["Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Border","Woodland","Specimen"],
    companions: ["Astilbe","Japanese Painted Fern","Heuchera","Brunnera","Bleeding Heart"],
    yearRound: "Massive chartreuse-gold foliage spring through fall; dormant in winter",
    foliageInterest: "Giant chartreuse-gold heart-shaped leaves up to 20 inches long; thick substance resists slugs better than most hostas. Tolerates more sun than blue varieties — leaves turn golden with more light",
    cultivars: ["Sum and Substance (classic giant gold)","Empress Wu (largest hosta, green)","Earth Angel (blue-green, white edge)","Liberty (gold edge, blue center)"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4,5],
    care: {3:"Watch for emerging shoots — large crowns push through quickly",4:"Fertilize as shoots emerge; slug prevention (thick leaves resist well)",5:"Massive leaves unfurling; mulch heavily",6:"Water deeply during dry spells; tolerates some morning sun",7:"Pale lavender flowers on tall scapes",8:"Peak size reached; impressive specimen",9:"Gold foliage begins to decline",10:"Remove dead foliage after frost",11:"Mulch crown for winter protection"},
    video: "https://www.youtube.com/results?search_query=hosta+sum+and+substance+giant+shade",
    description: "The giant gold standard — literally. Sum and Substance is one of the largest and most popular hostas with massive chartreuse-gold leaves. Thick leaf substance provides better slug resistance. Hosta of the Year 2004.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 160, name: "Hosta - Halcyon", botanical: "Hosta 'Halcyon'",
    type: "Perennial Foliage", height: "14-18 in", width: "28-36 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Greyish-lavender bell flowers on short scapes",
    attracts: ["Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Border","Woodland","Container"],
    companions: ["Astilbe","Japanese Painted Fern","Heuchera","Brunnera","Bleeding Heart"],
    yearRound: "Powder-blue foliage spring through fall; dormant in winter",
    foliageInterest: "Intense powder-blue heart-shaped leaves with heavy substance and waxy coating. One of the bluest hostas available — the blue color holds best in full shade",
    cultivars: ["Halcyon (classic blue)","Blue Angel (large blue)","Blue Cadet (compact blue)","First Frost (blue with yellow edge)"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4,5],
    care: {3:"Watch for blue shoots emerging",4:"Fertilize; slug prevention — thick leaves resist well",5:"Blue foliage at its best; mulch to keep roots cool",6:"Keep in full shade to preserve blue color; water deeply",7:"Greyish-lavender flowers",8:"Blue color may fade in heat — keep watered and shaded",9:"Foliage begins to yellow",10:"Remove dead foliage after frost",11:"Mulch for winter protection"},
    video: "https://www.youtube.com/results?search_query=hosta+halcyon+blue+shade+garden",
    description: "The gold standard for blue hostas. Halcyon's intense powder-blue leaves with thick, slug-resistant substance make it the most popular blue hosta in cultivation. Stays compact and tidy — perfect for Cleveland shade gardens.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 161, name: "Hosta - Patriot", botanical: "Hosta 'Patriot'",
    type: "Perennial Foliage", height: "18-22 in", width: "36-48 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Lavender flowers on tall scapes — attractive to hummingbirds",
    attracts: ["Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Border","Woodland","Container","Foundation"],
    companions: ["Astilbe","Japanese Painted Fern","Heuchera","Brunnera","Bleeding Heart"],
    yearRound: "Bold green-and-white variegated foliage spring through fall; dormant in winter",
    foliageInterest: "Dark green heart-shaped leaves with wide, crisp white margins — one of the boldest variegation patterns. Brightens dark corners dramatically",
    cultivars: ["Patriot (green/white)","Minuteman (similar, wider white)","Francee (thinner white edge)","Fire and Ice (white center, green edge)"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4,5],
    care: {3:"Watch for emerging shoots",4:"Fertilize; slug prevention",5:"Striking variegation unfurling; mulch",6:"Water deeply; variegation brightens shade beautifully",7:"Lavender flowers on tall scapes",8:"Still looking fresh and bold",9:"Foliage begins to yellow",10:"Remove dead foliage after frost",11:"Mulch for winter protection"},
    video: "https://www.youtube.com/results?search_query=hosta+patriot+variegated+shade+garden",
    description: "The most popular variegated hosta — and for good reason. Patriot's bold white margins on dark green leaves create stunning contrast in shade gardens. Vigorous, reliable, and easy to grow. Hosta of the Year 1997.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 162, name: "Hosta - Blue Mouse Ears", botanical: "Hosta 'Blue Mouse Ears'",
    type: "Perennial Foliage", height: "6-8 in", width: "10-12 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Dense lavender bell-shaped flowers on short scapes",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Container","Rock Garden","Border","Fairy Garden"],
    companions: ["Heuchera","Japanese Painted Fern","Ajuga","Lamium","Brunnera"],
    yearRound: "Tiny blue rounded leaves spring through fall; dormant in winter — perfect for containers and troughs",
    foliageInterest: "Adorable miniature round blue leaves that look like mouse ears — very thick substance. One of the most slug-resistant hostas due to heavy leaf texture",
    cultivars: ["Blue Mouse Ears (classic)","Frosted Mouse Ears (white edge)","Holy Mouse Ears (white center)","Green Mouse Ears (green)","Mighty Mouse (yellow edge)"],
    fertilizer: "Light balanced fertilizer in spring", fertMonth: [4],
    care: {3:"Tiny shoots emerge",4:"Light fertilizer; rarely bothered by slugs",5:"Cute rounded leaves fill in; great in containers",6:"Water consistently — small root system",7:"Dense lavender flowers disproportionately large for plant size",8:"Maintain moisture",9:"Blue color holds well into fall",10:"Remove dead foliage after frost",11:"Protect container plants from freeze-thaw"},
    video: "https://www.youtube.com/results?search_query=hosta+blue+mouse+ears+miniature+container",
    description: "The most beloved miniature hosta. Tiny, perfectly round blue leaves with incredible substance — nearly immune to slugs. Perfect for containers, troughs, and front-of-border. Hosta of the Year 2008.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 163, name: "Hosta - Guacamole", botanical: "Hosta 'Guacamole'",
    type: "Perennial Foliage", height: "18-24 in", width: "36-48 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Large, VERY fragrant white flowers — one of the best fragrant hostas",
    attracts: ["Hummingbirds","Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Border","Woodland","Container","Fragrance Garden"],
    companions: ["Astilbe","Japanese Painted Fern","Heuchera","Brunnera","Bleeding Heart"],
    yearRound: "Apple-green and avocado foliage spring through fall; fragrant flowers mid-summer; dormant in winter",
    foliageInterest: "Wide apple-green leaves with darker avocado-green margins — center brightens to gold with more light. Leaves have a lush, tropical feel. Tolerates more sun than most hostas",
    cultivars: ["Guacamole (classic fragrant)","Fragrant Bouquet (yellow-green, fragrant)","Stained Glass (brighter gold center)","Avocado (sport of Guacamole)"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4,5],
    care: {3:"Watch for emerging shoots",4:"Fertilize; can handle more morning sun than most hostas",5:"Lush green foliage unfurling; mulch",6:"Water deeply; center lightens to gold with sun exposure",7:"FRAGRANT large white flowers — plant near seating!",8:"Flowers continue; deadhead for tidiness",9:"Foliage begins to yellow",10:"Remove dead foliage after frost",11:"Mulch for winter protection"},
    video: "https://www.youtube.com/results?search_query=hosta+guacamole+fragrant+shade+garden",
    description: "A fragrant shade garden superstar. Guacamole's large apple-green leaves and incredibly fragrant white flowers make it a must-have. More sun-tolerant than most hostas — morning sun intensifies the gold center. Hosta of the Year 2002.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 4, name: "Daylily", botanical: "Hemerocallis spp.",
    type: "Perennial Flower", height: "12-48 in", width: "18-36 in",
    bloomMonths: [6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Many rebloomers: 'Stella de Oro', 'Happy Returns', 'Rosy Returns', 'Going Bananas'",
    attracts: ["Butterflies","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Mass Planting","Slope"],
    companions: ["Salvia","Coreopsis","Shasta Daisy","Daylily (mix heights)","Fountain Grass"],
    yearRound: "Grassy foliage spring-fall; dormant types fully die back in winter",
    foliageInterest: "Arching strap-like leaves; some evergreen in mild winters",
    cultivars: ["Stella de Oro (gold, reblooming classic)","Happy Returns (yellow, reblooming)","Purple de Oro (purple)","Pardon Me (red, fragrant)","Chicago Apache (red)","Hyperion (yellow, fragrant)","Going Bananas (compact yellow)"],
    fertilizer: "5-10-10 in spring and after first bloom", fertMonth: [4,7],
    care: {3:"Remove dead foliage",4:"Fertilize; divide if crowded",5:"Mulch",6:"Deadhead spent scapes",7:"Fertilize rebloomers after first flush",8:"Continue deadheading",9:"Remove yellowing foliage",10:"Cut back after frost",11:"Mulch for winter"},
    video: "https://www.youtube.com/results?search_query=daylily+care+reblooming+varieties",
    description: "The ultimate easy-care perennial. Each flower lasts one day, but prolific bloomers produce weeks of color. Reblooming varieties extend the show from June through frost."
,
    planted: [], clevelandCultivars: ["Stella de Oro", "Happy Returns", "Pardon Me"], whereToBuy: "Monrovia; Home Depot Perennials", whenAvailable: "May-Aug", clevelandLightNote: "Sun to part sun; flowers best with morning sun."
  },
  {
    id: 5, name: "Bee Balm", botanical: "Monarda didyma",
    type: "Perennial Flower", height: "24-48 in", width: "24-36 in",
    bloomMonths: [6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Deadheading encourages rebloom; 'Balmy' series reblooms well",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Pollinator","Native","Border"],
    companions: ["Echinacea","Phlox","Joe Pye Weed","Black-eyed Susan","Karl Foerster"],
    yearRound: "Seed heads add winter texture; aromatic foliage",
    foliageInterest: "Aromatic mint-family foliage; can be used in teas",
    cultivars: ["Jacob Cline (red, mildew resistant)","Raspberry Wine (dark pink)","Balmy Purple (compact)","Pardon My Cerise (dwarf)","Leading Lady Plum (mildew resistant)","Petite Delight (compact pink)"],
    fertilizer: "Compost in spring; light 10-10-10", fertMonth: [4],
    care: {3:"Cut back old stems",4:"Thin stems for air circulation (mildew prevention)",5:"Mulch; ensure good air flow",6:"Deadhead for rebloom",7:"Watch for powdery mildew",8:"Continue deadheading",9:"Allow some seed heads",10:"Cut back after frost",11:"Divide every 2-3 years to control spread"},
    video: "https://www.youtube.com/results?search_query=bee+balm+monarda+care+hummingbirds",
    description: "A hummingbird magnet with showy tubular flowers. Native to Ohio, bee balm spreads to form attractive colonies. Choose mildew-resistant cultivars for best performance."
,
    planted: [], clevelandCultivars: ["Jacob Cline", "Raspberry Wine", "Pardon My Series"], whereToBuy: "Proven Winners", whenAvailable: "May-Jul", clevelandLightNote: "Half-day sun; tolerates light afternoon sun with airflow."
  },
  {
    id: 6, name: "Russian Sage", botanical: "Perovskia atriplicifolia",
    type: "Sub-Shrub", height: "36-60 in", width: "36-48 in",
    bloomMonths: [7,8,9,10], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-8.0", reblooming: false,
    rebloomNote: "Extended single bloom period through frost",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Mediterranean","Mass Planting"],
    companions: ["Echinacea","Black-eyed Susan","Sedum","Lavender","Karl Foerster"],
    yearRound: "Silver-white stems persist beautifully through winter",
    foliageInterest: "Silvery-gray aromatic foliage all season; stunning silver winter stems",
    cultivars: ["Blue Spire (upright)","Little Spire (compact 24 in)","Denim 'n Lace (sturdy, compact)","Lacey Blue (compact)","Peek-a-Blue (very compact)"],
    fertilizer: "None needed; too much fertilizer causes floppy growth", fertMonth: [],
    care: {3:"Cut back to 12-18 inches (critical — blooms on new wood)",4:"New growth appears",5:"No fertilizer needed",7:"Blooms begin; stake if floppy",8:"Enjoy peak bloom",9:"Continue blooming",10:"Last blooms",11:"Leave stems standing for winter interest",12:"Admire silver winter stems"},
    video: "https://www.youtube.com/results?search_query=russian+sage+perovskia+care+pruning",
    description: "A cloud of lavender-blue flowers on silvery stems from midsummer to frost. One of the most trouble-free, drought-tolerant perennials. Beautiful four-season interest."
,
    planted: [], clevelandCultivars: ["Blue Spire", "Denim 'n Lace", "Blue Steel"], whereToBuy: "Proven Winners", whenAvailable: "May-Aug", clevelandLightNote: "Full sun; tolerates hot afternoon sun."
  },
  {
    id: 7, name: "Catmint", botanical: "Nepeta faassenii",
    type: "Perennial Flower", height: "12-36 in", width: "18-36 in",
    bloomMonths: [5,6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Shear after first bloom for reliable rebloom; repeat through fall",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Edging","Mass Planting","Mediterranean"],
    companions: ["Roses","Salvia","Daylily","Echinacea","Peony"],
    yearRound: "Aromatic silver-green foliage; tidy mound habit",
    foliageInterest: "Gray-green aromatic foliage; attractive mounding form",
    cultivars: ["Walker's Low (24-30 in, Perennial of the Year 2007)","Cat's Pajamas (compact 14 in, long blooming)","Purrsian Blue (compact 14-18 in)","Six Hills Giant (tall 36 in)","Blue Wonder (compact)","Junior Walker (compact Walker's Low)"],
    fertilizer: "None to light; compost in spring", fertMonth: [4],
    care: {3:"Cut back old growth to ground",4:"New foliage emerges",5:"First bloom begins",6:"Shear by 1/3 after first flush for rebloom",7:"Second bloom wave",8:"Shear again if desired",9:"Light bloom continues",10:"Leave foliage for winter",11:"Optional cleanup"},
    video: "https://www.youtube.com/results?search_query=catmint+nepeta+walkers+low+care",
    description: "The perfect edging and companion plant. Catmint produces billowing mounds of lavender-blue flowers from late spring to fall with minimal care. Outstanding with roses."
,
    planted: [], clevelandCultivars: ["Walker's Low", "Junior Walker", "Cat's Pajamas"], whereToBuy: "Proven Winners", whenAvailable: "May-Aug", clevelandLightNote: "Full sun; tolerates afternoon sun and reflective heat."
  },
  {
    id: 8, name: "Sedum (Stonecrop)", botanical: "Hylotelephium / Sedum spp.",
    type: "Perennial Succulent", height: "6-24 in", width: "12-24 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Single long bloom period; flower heads age beautifully",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Rock Garden","Container","Green Roof"],
    companions: ["Echinacea","Russian Sage","Aster","Coreopsis","Karl Foerster"],
    yearRound: "Succulent foliage spring-fall; dried flower heads persist through winter",
    foliageInterest: "Thick succulent leaves in green, purple, blue-green, or variegated",
    cultivars: ["Autumn Joy (classic pink-to-rust)","Autumn Fire (improved Autumn Joy)","Matrona (pink stems, pink flowers)","Purple Emperor (dark foliage)","Neon (bright pink)","Angelina (ground cover, gold foliage)","Dragon's Blood (ground cover, red)"],
    fertilizer: "None needed; lean soil preferred", fertMonth: [],
    care: {3:"Pinch tall varieties to 6 in for bushier plants (optional)",4:"New growth; no fertilizer needed",5:"Established plants need little water",8:"Bloom begins",9:"Peak bloom; attracts late-season butterflies",10:"Flower heads turn rust/bronze",11:"Leave dried heads for winter interest",12:"Architectural winter seed heads"},
    video: "https://www.youtube.com/results?search_query=sedum+autumn+joy+stonecrop+care",
    description: "The ultimate low-maintenance perennial. Succulent foliage looks great all summer, then flat flower heads attract late-season butterflies and persist beautifully into winter."
,
    planted: ["John Creech", "October Daphne", "Autumn Joy"], clevelandCultivars: ["Autumn Joy", "Matrona", "Thundercloud", "Angelina"], whereToBuy: "Proven Winners", whenAvailable: "Jun-Sep", clevelandLightNote: "Full sun; handles hot afternoon exposures."
  },
  {
    id: 9, name: "Astilbe", botanical: "Astilbe spp.",
    type: "Perennial Flower", height: "12-48 in", width: "12-36 in",
    bloomMonths: [6,7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Plant early, mid, and late varieties for extended bloom",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Cottage","Border","Woodland","Rain Garden"],
    companions: ["Hosta Halcyon","Japanese Painted Fern","Heuchera","Brunnera","Bleeding Heart"],
    yearRound: "Dried plumes persist into winter; ferny foliage spring-fall",
    foliageInterest: "Finely divided fern-like foliage; some varieties have bronze-tinted leaves",
    cultivars: ["Fanal (deep red, early)","Bridal Veil (white)","Visions in Pink (compact pink)","Purple Candles (tall purple)","Delft Lace (peach-pink, dark foliage)","Chocolate Shogun (chocolate foliage)"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4,5],
    care: {3:"Cut back old plumes",4:"Fertilize; ensure consistent moisture",5:"Mulch heavily to retain moisture",6:"Early varieties bloom",7:"Midseason varieties bloom",8:"Late varieties bloom; keep watered",9:"Foliage remains attractive",10:"Leave dried plumes",11:"Mulch for winter"},
    video: "https://www.youtube.com/results?search_query=astilbe+shade+perennial+care+guide",
    description: "Feathery plume flowers light up the shade garden in colors from white to deep red. Fern-like foliage adds texture even when not in bloom. Must have consistent moisture."
,
    planted: ["Pink Revolution", "Little Vision in Pink"], clevelandCultivars: ["Visions in Red", "Deutschland", "Fanal", "Peach Blossom"], whereToBuy: "Monrovia; Vigoro", whenAvailable: "May-Jun", clevelandLightNote: "Morning sun with afternoon shade; avoid hot, direct western sun."
  },
  {
    id: 10, name: "Garden Phlox", botanical: "Phlox paniculata",
    type: "Perennial Flower", height: "24-48 in", width: "18-24 in",
    bloomMonths: [7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-8.0", reblooming: true,
    rebloomNote: "Deadhead for rebloom; 'Flame' series reblooms well",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Border","Cutting Garden"],
    companions: ["Bee Balm","Echinacea","Daylily","Russian Sage","Karl Foerster"],
    yearRound: "Tall structural element in summer garden",
    foliageInterest: "Dark green upright foliage; some varieties have variegated leaves",
    cultivars: ["David (white, mildew resistant)","Jeana (lavender, pollinator magnet)","Flame series (compact, many colors)","Blue Paradise (blue-purple)","Bright Eyes (pink with red eye)","Nicky (deep magenta)"],
    fertilizer: "Balanced fertilizer monthly during bloom", fertMonth: [5,6,7,8],
    care: {3:"Cut back old stems",4:"Thin stems to 4-5 per clump for air circulation",5:"Fertilize; mulch",6:"Continue to thin; stake tall varieties",7:"Blooming; deadhead spent clusters",8:"Watch for mildew; deadhead for rebloom",9:"Late bloom",10:"Cut back after frost",11:"Clean up debris to prevent mildew carryover"},
    video: "https://www.youtube.com/results?search_query=phlox+paniculata+garden+phlox+mildew+resistant",
    description: "Tall spires of fragrant flowers in every shade make garden phlox a cottage garden essential. Choose mildew-resistant varieties for best results in Cleveland's humid summers."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 11, name: "Lavender", botanical: "Lavandula angustifolia",
    type: "Sub-Shrub", height: "12-24 in", width: "12-24 in",
    bloomMonths: [6,7], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-8.0", reblooming: true,
    rebloomNote: "Light shearing after first bloom can trigger second flush",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Mediterranean","Border","Herb Garden","Container"],
    companions: ["Catmint","Roses","Echinacea","Salvia","Karl Foerster"],
    yearRound: "Evergreen-ish silvery foliage; aromatic year-round",
    foliageInterest: "Silver-gray aromatic evergreen foliage",
    cultivars: ["Hidcote (deep purple, compact)","Munstead (classic, reliable)","Phenomenal (very hardy, mildew resistant)","Grosso (lavandin, fragrant)","Big Time Blue (cold hardy)"],
    fertilizer: "None; lean soil preferred. Light lime if soil is acidic", fertMonth: [],
    care: {3:"Do NOT prune yet — wait for new growth",4:"Prune dead wood once green growth visible; never cut into old wood",5:"Ensure excellent drainage",6:"Harvest buds just before fully open",7:"Shear lightly after bloom for possible rebloom",8:"Minimal water",9:"No fall pruning",10:"Ensure good drainage for winter",11:"Mulch with gravel, not organic mulch"},
    video: "https://www.youtube.com/results?search_query=lavender+zone+6+winter+hardy+care",
    description: "Fragrant Mediterranean herb that thrives in Cleveland if given excellent drainage and full sun. 'Phenomenal' and 'Hidcote' are the most winter-hardy varieties for zone 6."
,
    planted: [], clevelandCultivars: ["Munstead", "Hidcote", "Phenomenal"], whereToBuy: "Proven Winners", whenAvailable: "May-Jul", clevelandLightNote: "Sun to part sun; in Cleveland, light afternoon shade can help."
  },
  {
    id: 12, name: "Coral Bells", botanical: "Heuchera spp.",
    type: "Perennial Foliage", height: "8-18 in", width: "12-18 in",
    bloomMonths: [5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Some varieties bloom intermittently through summer",
    attracts: ["Hummingbirds","Bees"], nativeOhio: true,
    gardenStyles: ["Shade Garden","Border","Container","Woodland","Edging"],
    companions: ["Hosta Halcyon","Astilbe","Japanese Painted Fern","Brunnera","Tiarella"],
    yearRound: "Semi-evergreen foliage in many colors; some hold leaves through mild winters",
    foliageInterest: "Spectacular leaf colors: purple, lime, amber, silver, peach, burgundy, caramel",
    cultivars: ["Palace Purple (classic)","Caramel (amber-gold)","Obsidian (near-black)","Lime Rickey (chartreuse)","Berry Smoothie (rose-pink)","Silver Scrolls (silver veined)","Dolce series (many colors)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Clean up winter-damaged foliage",4:"Fertilize lightly; check for heaving (push back in)",5:"Mulch; remove flower scapes if desired for foliage focus",6:"Enjoy foliage color",7:"Delicate flower spikes attract hummingbirds",8:"Consistent moisture in hot weather",9:"Foliage still attractive",10:"Semi-evergreen; leave foliage",11:"Light mulch for winter; don't bury crown"},
    video: "https://www.youtube.com/results?search_query=heuchera+coral+bells+care+varieties",
    description: "Grown primarily for their extraordinary rainbow of foliage colors. Coral bells thrive in part shade and add year-round color to borders and containers. Native species available."
,
    planted: ["Caramel", "Midnight Rose", "Sweet Tea", "Red Rover", "Peachberry Ice", "Magma", "Palace Purple"], clevelandCultivars: ["Palace Purple", "Caramel", "Obsidian", "Dolce Wildberry"], whereToBuy: "Proven Winners Dolce", whenAvailable: "Apr-Oct", clevelandLightNote: "Morning sun to light afternoon sun; avoid hot, exposed western sun."
  },
  {
    id: 13, name: "Peony", botanical: "Paeonia lactiflora",
    type: "Perennial Flower", height: "24-36 in", width: "24-36 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.5-7.0", reblooming: false,
    rebloomNote: "Single bloom period; plant early, mid, and late varieties for extended season",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Cutting Garden","Formal"],
    companions: ["Iris","Catmint","Allium","Baptisia","Salvia"],
    yearRound: "Attractive mounding foliage turns red/bronze in fall",
    foliageInterest: "Glossy dark green foliage; burgundy fall color in many varieties",
    cultivars: ["Sarah Bernhardt (double pink)","Karl Rosenfield (double red)","Festiva Maxima (double white)","Bowl of Beauty (semi-double pink)","Bartzella (Itoh, yellow)","Coral Charm (semi-double coral)","Duchesse de Nemours (fragrant white)"],
    fertilizer: "Bone meal or bulb fertilizer in fall; light 5-10-10 in spring", fertMonth: [4,10],
    care: {3:"Remove winter mulch; red shoots emerge",4:"Fertilize; install peony ring supports",5:"Blooming; disbud for larger flowers (optional)",6:"Deadhead spent blooms; leave foliage",7:"Foliage provides garden structure",8:"Healthy foliage; water during drought",9:"Foliage begins to color",10:"Cut back after hard frost; fertilize with bone meal",11:"Plant new peonies NOW (fall is ideal)"},
    video: "https://www.youtube.com/results?search_query=peony+care+guide+planting+dividing",
    description: "Long-lived perennials (50+ years!) with spectacular fragrant blooms. Peonies are deer-proof, cold-hardy, and thrive in Cleveland. They need cold winters to bloom — perfect for zone 6."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 14, name: "Ornamental Grasses - Karl Foerster", botanical: "Calamagrostis x acutiflora",
    type: "Ornamental Grass", height: "48-72 in", width: "24-30 in",
    bloomMonths: [6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "Plumes persist and change color through seasons",
    attracts: ["Birds"], nativeOhio: false,
    gardenStyles: ["Border","Screen","Mass Planting","Modern","Prairie"],
    companions: ["Echinacea","Sedum","Russian Sage","Black-eyed Susan","Aster"],
    yearRound: "Upright golden plumes persist all winter; cut back in late February",
    foliageInterest: "Strictly upright form; green summer foliage turns golden wheat in fall. Feathery plumes emerge pink, turn golden",
    cultivars: ["Karl Foerster (Perennial of Year 2001)","Overdam (variegated, shorter)","Avalanche (white-striped)"],
    fertilizer: "Light compost in spring; no heavy feeding", fertMonth: [4],
    care: {2:"Cut back to 4-6 inches BEFORE new growth (Feb-early March)",3:"Cut back if not done in February",4:"New growth emerges; light compost",5:"Rapid growth",6:"Feathery plumes emerge",7:"Plumes turn from pink to golden",8:"Full height reached",9:"Plumes golden; stunning backlit",10:"Golden fall color",11:"Leave standing for winter architecture",12:"Beautiful with snow on plumes"},
    video: "https://www.youtube.com/results?search_query=karl+foerster+grass+care+pruning",
    description: "The most popular ornamental grass — strictly upright and well-behaved (non-invasive). Provides vertical accent and four-season interest. A must-have structural plant.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 15, name: "Switchgrass", botanical: "Panicum virgatum",
    type: "Ornamental Grass", height: "36-72 in", width: "24-36 in",
    bloomMonths: [7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "Airy seed heads persist well into winter",
    attracts: ["Birds"], nativeOhio: true,
    gardenStyles: ["Prairie","Naturalized","Border","Screen","Rain Garden"],
    companions: ["Echinacea","Black-eyed Susan","Joe Pye Weed","Aster","Goldenrod"],
    yearRound: "Airy seed heads and warm-toned foliage through winter",
    foliageInterest: "Blue-green to red-tipped foliage; many varieties turn brilliant red/orange in fall",
    cultivars: ["Shenandoah (red foliage)","Heavy Metal (steel blue, upright)","Northwind (upright blue-green)","Cheyenne Sky (compact red)","Prairie Fire (red tips)","Cloud Nine (tall blue)"],
    fertilizer: "None needed for native grass", fertMonth: [],
    care: {2:"Cut back to 4-6 inches before new growth",3:"Cut back if not done",4:"Slow to emerge (warm-season grass)",5:"Growth accelerates",7:"Airy flower panicles",8:"Seed heads developing",9:"Fall color begins",10:"Peak fall color — reds, oranges, golds",11:"Leave standing for winter",12:"Seeds feed birds"},
    video: "https://www.youtube.com/results?search_query=panicum+switchgrass+ornamental+native",
    description: "A stunning native grass with blue or red-toned foliage and airy seed heads. Switchgrass is supremely adapted to Ohio conditions and provides incredible fall color.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 16, name: "Miscanthus (Maiden Grass)", botanical: "Miscanthus sinensis",
    type: "Ornamental Grass", height: "48-96 in", width: "36-60 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "Silver plumes persist beautifully through winter",
    attracts: ["Birds"], nativeOhio: false,
    gardenStyles: ["Screen","Border","Specimen","Mass Planting"],
    companions: ["Sedum","Aster","Goldenrod","Russian Sage","Joe Pye Weed"],
    yearRound: "Arching form with silver plumes dramatic in winter landscape; rustling sound",
    foliageInterest: "Fine-textured arching blades; variegated and banded varieties available. Golden-bronze fall/winter color",
    cultivars: ["Gracillimus (fine-textured classic)","Morning Light (silver-edged)","Adagio (compact 4-5 ft)","Little Zebra (banded, compact)","Gold Bar (banded gold)","Purpurascens (flame grass, red fall)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {2:"Cut back to 6 inches before new growth (use string trimmer for large clumps)",3:"Cut back if not done",4:"Slow to emerge",5:"Growth begins",6:"Rapid growth",8:"Plumes begin to emerge",9:"Full plume display",10:"Golden fall color with silver plumes",11:"Leave standing — best winter grass",12:"Dramatic with snow; rustles in wind"},
    video: "https://www.youtube.com/results?search_query=miscanthus+maiden+grass+care+varieties",
    description: "Large fountain-shaped grass with spectacular silver plumes in late summer. Creates dramatic screens and winter focal points. 'Morning Light' is one of the most elegant.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 17, name: "Baptisia (False Indigo)", botanical: "Baptisia australis",
    type: "Perennial Flower", height: "36-48 in", width: "36-48 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Single bloom; ornamental black seed pods follow",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Prairie","Border","Native"],
    companions: ["Peony","Iris","Catmint","Allium","Switchgrass"],
    yearRound: "Blue-green foliage all summer; black seed pods rattle in winter wind",
    foliageInterest: "Beautiful blue-green foliage resembling a shrub; charcoal-black seed pods",
    cultivars: ["Blue Wild Indigo (classic blue)","Decadence series (Blueberry Sundae, Lemon Meringue, Dutch Chocolate)","Prairieblues (Twilite, Starlite, Solar Flare)","Purple Smoke"],
    fertilizer: "None needed; fixes nitrogen. Do not fertilize", fertMonth: [],
    care: {3:"Do not disturb — deep taproot",4:"Blue-green shoots emerge; do not transplant",5:"Bloom period; enjoy lupine-like spikes",6:"Seed pods forming",7:"Enjoy shrub-like foliage",8:"Cut back if flopping (or stake)",9:"Seed pods turn black",10:"Pods rattle attractively",11:"Leave pods or cut back",12:"Architectural winter pods"},
    video: "https://www.youtube.com/results?search_query=baptisia+false+indigo+care+native",
    description: "A stunning native perennial that grows into a large shrub-like mound. Spikes of blue, purple, or yellow flowers in spring followed by ornamental black seed pods. Essentially indestructible once established."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 18, name: "Salvia (Perennial Sage)", botanical: "Salvia nemorosa",
    type: "Perennial Flower", height: "12-30 in", width: "12-24 in",
    bloomMonths: [5,6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Cut back by 1/3 after first bloom for reliable rebloom through fall",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Edging","Mass Planting","Container"],
    companions: ["Roses","Daylily","Echinacea","Catmint","Shasta Daisy"],
    yearRound: "Aromatic foliage; tidy mound habit",
    foliageInterest: "Gray-green aromatic foliage",
    cultivars: ["May Night (violet-blue, Perennial of the Year)","Caradonna (dark stems, purple)","Blue Hill (true blue)","East Friesland (deep purple)","Marcus (compact)","Bumble Blue (dwarf 10 in)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Cut back old growth",4:"New foliage; light compost",5:"First bloom spikes appear",6:"Peak first bloom; deadhead promptly",7:"Shear by 1/3 for rebloom",8:"Second bloom wave",9:"Third bloom possible with care",10:"Final cleanup or leave for winter",11:"Tidy as desired"},
    video: "https://www.youtube.com/results?search_query=salvia+nemorosa+may+night+perennial+care",
    description: "Spiky purple-blue flowers on a tidy, aromatic plant that blooms for months with deadheading. 'May Night' and 'Caradonna' are among the best perennials available for zone 6."
,
    planted: [], clevelandCultivars: ["May Night", "Caradonna", "Blue Marvel"], whereToBuy: "Proven Winners Rockin", whenAvailable: "Apr-Jun", clevelandLightNote: "Full sun; tolerates hot afternoon exposure."
  },
  {
    id: 19, name: "Shasta Daisy", botanical: "Leucanthemum x superbum",
    type: "Perennial Flower", height: "12-36 in", width: "12-24 in",
    bloomMonths: [6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-8.0", reblooming: true,
    rebloomNote: "Deadhead for rebloom; 'Becky' blooms Jun-Sep",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Cutting Garden"],
    companions: ["Salvia","Catmint","Daylily","Echinacea","Lavender"],
    yearRound: "Dark green basal foliage persists into early winter",
    foliageInterest: "Dark green, glossy lance-shaped leaves",
    cultivars: ["Becky (tall 36 in, Perennial of the Year)","Snow Lady (dwarf 10 in)","Banana Cream (pale yellow)","Crazy Daisy (double frilly)","Snowcap (compact 15 in)","Amazing Daisies series"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4,5],
    care: {3:"Remove winter-killed foliage",4:"Fertilize; divide clumps every 2-3 years",5:"Mulch",6:"Bloom begins; deadhead regularly",7:"Peak bloom; continue deadheading",8:"Late blooms with deadheading",9:"Final flowers; reduce watering",10:"Cut back to basal rosette",11:"Light winter mulch"},
    video: "https://www.youtube.com/results?search_query=shasta+daisy+becky+care+pruning",
    description: "The classic white daisy flower of cottage gardens. 'Becky' is the standard-bearer — tall, long-blooming, and reliable. Divide every 2-3 years for best performance."
,
    planted: [], clevelandCultivars: ["Becky", "Snowcap", "Banana Cream"], whereToBuy: "Proven Winners", whenAvailable: "May-Jul", clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 20, name: "Iris (Bearded)", botanical: "Iris germanica",
    type: "Perennial Flower / Rhizome", height: "24-40 in", width: "12-24 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-7.0", reblooming: true,
    rebloomNote: "Reblooming types: 'Immortality' (white), 'Beverly Sills' (pink), 'Champagne Elegance'",
    attracts: ["Hummingbirds","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Formal","Cutting Garden"],
    companions: ["Peony","Catmint","Salvia","Allium","Daylily"],
    yearRound: "Sword-like foliage adds architectural element; rhizomes visible at soil surface",
    foliageInterest: "Bold sword-shaped gray-green fans of foliage",
    cultivars: ["Immortality (white, reblooming)","Beverly Sills (pink, reblooming)","Batik (purple/white streaked)","Edith Wolford (yellow/purple bicolor)","Dusky Challenger (deep purple)","Harvest of Memories (yellow, reblooming)"],
    fertilizer: "Low nitrogen 6-10-10 after bloom; bone meal in fall", fertMonth: [6,10],
    care: {3:"Remove winter debris from rhizomes",4:"Inspect for iris borer damage",5:"Peak bloom; enjoy",6:"Deadhead; fertilize after bloom",7:"Divide overcrowded clumps (every 3-4 years); expose rhizome tops",8:"Best month to divide and replant",9:"Reblooming varieties may flower again",10:"Trim foliage to 6-inch fans",11:"Clean up debris to prevent borer issues"},
    video: "https://www.youtube.com/results?search_query=bearded+iris+care+dividing+borer+prevention",
    description: "Elegant, ruffled flowers in every color of the rainbow. Bearded iris are drought-tolerant, deer-proof, and thrive in Cleveland's climate. Rebloomers give a bonus fall show."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 21, name: "Japanese Anemone", botanical: "Anemone x hybrida",
    type: "Perennial Flower", height: "24-48 in", width: "24-36 in",
    bloomMonths: [8,9,10], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Extended single bloom period Aug-Oct",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Shade Garden","Border","Woodland"],
    companions: ["Aster","Toad Lily","Hosta Guacamole","Japanese Forest Grass","Turtlehead"],
    yearRound: "Maple-like foliage; late season bloom when little else flowers in shade",
    foliageInterest: "Attractive dark green maple-like basal foliage",
    cultivars: ["Honorine Jobert (white, classic)","September Charm (pink)","Whirlwind (semi-double white)","Queen Charlotte (double pink)","Pamina (deep pink, compact)","Robustissima (most cold-hardy)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {3:"Late to emerge — mark location",4:"Foliage appears; top-dress with compost",5:"Mulch to retain moisture",6:"Lush foliage growth",7:"Flower stems begin rising",8:"Blooms begin — elegant and long-lasting",9:"Peak bloom period",10:"Final flowers; enjoy with fall asters",11:"Cut back after frost; mulch well for first winters"},
    video: "https://www.youtube.com/results?search_query=japanese+anemone+fall+blooming+care",
    description: "Elegant windflower with dancing blooms on wiry stems from late summer through fall. One of the best late-season perennials for partial shade. Can spread once established."
,
    planted: ["September Charm"], clevelandCultivars: ["Honorine Jobert", "September Charm", "Robustissima"], whereToBuy: "Monrovia", whenAvailable: "Aug-Oct", clevelandLightNote: "Morning sun or dappled shade; avoid hot afternoon sun."
  },
  {
    id: 22, name: "Hydrangea (Panicle)", botanical: "Hydrangea paniculata",
    type: "Shrub", height: "36-96 in", width: "36-96 in",
    bloomMonths: [7,8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Blooms on new wood — always blooms in Cleveland (unlike bigleaf types)",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Foundation","Specimen","Hedge"],
    companions: ["Hosta Patriot","Astilbe","Boxwood","Heuchera","Karl Foerster"],
    yearRound: "Flowers age from white to pink to russet and persist dried through winter",
    foliageInterest: "Large dark green leaves; some varieties have burgundy fall color",
    cultivars: ["Limelight (lime-green to pink)","Little Lime (compact Limelight)","Quick Fire (earliest, red fall)","Pinky Winky (bicolor)","Bobo (dwarf 3 ft)","Strawberry Sundae (compact bicolor)","Fire Light (large, sturdy)"],
    fertilizer: "Balanced 10-10-10 in early spring", fertMonth: [4],
    care: {3:"Prune to desired shape/size — blooms on new wood, so prune now",4:"Fertilize; new growth begins rapidly",5:"Strong new growth",6:"Buds forming",7:"Bloom begins; water deeply during heat",8:"Peak bloom; flower heads large",9:"Flowers aging to pink/rose",10:"Flowers turning russet; stunning fall color",11:"Leave dried flower heads for winter interest",12:"Architectural dried flowers in snow"},
    video: "https://www.youtube.com/results?search_query=panicle+hydrangea+limelight+pruning+care",
    description: "The most reliable hydrangea for Cleveland — blooms on new wood, so it always flowers regardless of winter cold. Limelight is the most popular; Little Lime works in smaller spaces."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 23, name: "Hydrangea (Smooth)", botanical: "Hydrangea arborescens",
    type: "Shrub", height: "36-60 in", width: "36-60 in",
    bloomMonths: [6,7,8,9], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "5.0-7.0", reblooming: true,
    rebloomNote: "Incrediball and Invincibelle series rebloom on new growth through fall",
    attracts: ["Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Shade Garden","Border","Foundation","Woodland"],
    companions: ["Hosta Patriot","Japanese Painted Fern","Astilbe","Brunnera","Heuchera"],
    yearRound: "Large round flower heads dry on plant; native understory shrub",
    foliageInterest: "Large heart-shaped leaves; yellow fall color",
    cultivars: ["Annabelle (classic huge white)","Incrediball (stronger stems than Annabelle)","Invincibelle Spirit (pink)","Invincibelle Wee White (dwarf)","Lime Rickey (lime-green)"],
    fertilizer: "Balanced 10-10-10 in spring", fertMonth: [4],
    care: {3:"Cut back hard to 12-18 inches (blooms on new wood)",4:"Fertilize; new growth",5:"Rapid growth",6:"Bloom begins",7:"Peak bloom; water consistently",8:"Flowers aging beautifully",9:"Drying on plant",10:"Dried heads turning tan",11:"Leave for winter or cut back",12:"Dried flowers in winter garden"},
    video: "https://www.youtube.com/results?search_query=hydrangea+annabelle+incrediball+care",
    description: "Native Ohio hydrangea with massive snowball-like flowers. 'Annabelle' is classic; 'Incrediball' has stronger stems that don't flop. Thrives in part shade — perfect for Cleveland."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 24, name: "Aster (New England)", botanical: "Symphyotrichum novae-angliae",
    type: "Perennial Flower", height: "36-72 in", width: "24-36 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Prolific single bloom period Aug-Oct",
    attracts: ["Butterflies","Bees","Birds"], nativeOhio: true,
    gardenStyles: ["Cottage","Pollinator","Prairie","Border","Native"],
    companions: ["Goldenrod","Sedum","Joe Pye Weed","Mums","Switchgrass"],
    yearRound: "Critical fall nectar source for migrating butterflies",
    foliageInterest: "Fine-textured upright foliage; pinch in June for bushier plants",
    cultivars: ["Purple Dome (compact 18 in)","Alma Potschke (hot pink)","September Ruby (ruby red)","October Skies (aromatic aster, blue)","Wood's Purple","Wood's Pink"],
    fertilizer: "Light compost in spring; avoid heavy feeding", fertMonth: [4],
    care: {3:"Cut back old stems",4:"New growth; top-dress with compost",5:"Pinch stems by 1/3 for compact growth (Chelsea chop)",6:"Pinch again if needed by mid-June",7:"Stop pinching; buds forming",8:"Blooms begin — butterfly paradise",9:"Peak bloom; stunning with goldenrod",10:"Final flowers; critical monarch food",11:"Cut back or leave seed heads for birds"},
    video: "https://www.youtube.com/results?search_query=new+england+aster+fall+garden+pollinators",
    description: "Essential fall-blooming native that provides critical nectar for migrating monarch butterflies. Purple Dome is compact and doesn't need staking. Pairs beautifully with goldenrod."
,
    planted: [], clevelandCultivars: ["Purple Dome", "Wood's Purple", "October Skies"], whereToBuy: "Proven Winners", whenAvailable: "Aug-Oct", clevelandLightNote: "Sun to part sun; afternoon shade reduces stress late season."
  },
  {
    id: 25, name: "Joe Pye Weed", botanical: "Eutrochium purpureum",
    type: "Perennial Flower", height: "48-84 in", width: "36-48 in",
    bloomMonths: [7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single extended bloom period",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Pollinator","Native","Rain Garden","Border (back)","Naturalized"],
    companions: ["Black-eyed Susan","Aster","Goldenrod","Ironweed","Miscanthus"],
    yearRound: "Towering architectural form; dried seed heads in winter",
    foliageInterest: "Whorls of large lance-shaped leaves on wine-colored stems",
    cultivars: ["Gateway (compact 5 ft, dark stems)","Baby Joe (dwarf 3-4 ft)","Little Joe (compact)","Phantom (dark purple)","Chocolate (chocolate foliage)"],
    fertilizer: "Compost in spring; prefers rich soil", fertMonth: [4],
    care: {3:"Cut back old stems",4:"New growth; amend with compost",5:"Rapid growth in moist soil",6:"Pinch for compact growth if desired",7:"Massive flower domes begin",8:"Peak bloom — butterfly magnet",9:"Seed heads forming",10:"Leave seed heads for birds",11:"Cut back or leave standing"},
    video: "https://www.youtube.com/results?search_query=joe+pye+weed+native+garden+care",
    description: "A majestic native perennial that anchors the back of any border. Huge domes of mauve-pink flowers are butterfly magnets. 'Baby Joe' and 'Little Joe' fit smaller gardens."
,
    planted: [], clevelandCultivars: ["Little Joe", "Baby Joe", "Gateway"], whereToBuy: "Monrovia", whenAvailable: "Jul-Sep", clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 26, name: "Bleeding Heart", botanical: "Lamprocapnos spectabilis",
    type: "Perennial Flower", height: "24-36 in", width: "18-30 in",
    bloomMonths: [4,5,6], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Goes dormant mid-summer; pair with late-emerging plants",
    attracts: ["Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Cottage","Woodland","Border"],
    companions: ["Hosta Halcyon","Japanese Painted Fern","Astilbe","Brunnera","Heuchera"],
    yearRound: "Graceful arching stems with heart-shaped flowers in spring; dormant by August",
    foliageInterest: "Finely cut blue-green foliage; Gold Heart variety has chartreuse leaves",
    cultivars: ["Classic (pink hearts)","Alba (white hearts)","Gold Heart (chartreuse foliage, pink flowers)","Valentine (red hearts, dark stems)"],
    fertilizer: "Compost in early spring", fertMonth: [3,4],
    care: {3:"Top-dress with compost as shoots emerge",4:"Peak bloom — arching sprays of hearts",5:"Continue bloom; keep moist",6:"Foliage begins to yellow — this is normal",7:"Goes dormant; leave alone",8:"Dormant — overplant with annuals or let companions fill in",9:"Dormant",10:"Dormant",11:"Mulch area for winter protection"},
    video: "https://www.youtube.com/results?search_query=bleeding+heart+dicentra+shade+garden+care",
    description: "One of the most beloved shade perennials, with elegant arching sprays of heart-shaped flowers. Goes dormant in summer — plant with hostas or ferns to fill the gap."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 27, name: "Brunnera (Siberian Bugloss)", botanical: "Brunnera macrophylla",
    type: "Perennial Foliage", height: "12-18 in", width: "18-24 in",
    bloomMonths: [4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Single spring bloom; grown primarily for foliage",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Container"],
    companions: ["Hosta Halcyon","Heuchera","Bleeding Heart","Astilbe","Japanese Painted Fern"],
    yearRound: "Large silver-patterned foliage from spring through hard frost",
    foliageInterest: "Heart-shaped leaves with stunning silver patterns; tiny blue forget-me-not flowers",
    cultivars: ["Jack Frost (silver with green veins, most popular)","Looking Glass (entirely silver)","Alexander's Great (giant Jack Frost)","Sea Heart (thick leaves, slug resistant)","Silver Heart"],
    fertilizer: "Light compost in spring; avoid heavy feeding", fertMonth: [4],
    care: {3:"Clean up winter-damaged leaves",4:"Blue flowers appear; new silver foliage emerges",5:"Flowers fade; spectacular foliage display begins",6:"Maintain moisture; scorch possible in dry conditions",7:"Consistent moisture; foliage stunning in shade",8:"Continue watering",9:"Foliage still attractive",10:"Foliage declines with hard frost",11:"Light mulch for winter"},
    video: "https://www.youtube.com/results?search_query=brunnera+jack+frost+shade+perennial+care",
    description: "Spectacular silver-patterned heart-shaped leaves light up shade gardens from spring through fall. Tiny blue flowers in spring resemble forget-me-nots. 'Jack Frost' is iconic."
,
    planted: ["Jack Frost"], clevelandCultivars: ["Jack Frost", "Queen of Hearts", "Alexander's Great"], whereToBuy: "Proven Winners", whenAvailable: "Apr-May", clevelandLightNote: "Prefers dappled light or morning sun; avoid direct afternoon sun."
  },
  {
    id: 28, name: "Liatris (Blazing Star)", botanical: "Liatris spicata",
    type: "Perennial Flower", height: "24-48 in", width: "12-18 in",
    bloomMonths: [7,8], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Single bloom period; unique top-down blooming pattern",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Pollinator","Prairie","Cottage","Border","Cutting Garden"],
    companions: ["Echinacea","Black-eyed Susan","Catmint","Rudbeckia","Switchgrass"],
    yearRound: "Architectural spikes; grasslike foliage; seed heads for birds",
    foliageInterest: "Fine grasslike basal foliage",
    cultivars: ["Kobold (compact 24 in, most popular)","Floristan Violet","Floristan White","Alba (white)"],
    fertilizer: "None needed; lean soil preferred", fertMonth: [],
    care: {3:"New grass-like foliage appears",4:"Growth from corm",5:"Flower spikes developing",7:"Bloom from top down (unique!)",8:"Enjoy with summer butterflies",9:"Seed heads; leave for birds",10:"Cut back spent stems",11:"Mark location; corms dormant"},
    video: "https://www.youtube.com/results?search_query=liatris+blazing+star+native+prairie+plant",
    description: "Striking vertical spikes of purple flowers that bloom from top to bottom — unique among perennials. Native, drought-tolerant, and a monarch butterfly favorite."
,
    planted: [], clevelandCultivars: ["Kobold", "Floristan White"], whereToBuy: "Vigoro (bulb packs)", whenAvailable: "May-Jul", clevelandLightNote: "Sun to part sun; stands straighter with more sun."
  },
  {
    id: 29, name: "Clematis (Large-Flowered)", botanical: "Clematis hybrids",
    type: "Vine", height: "72-120 in", width: "24-48 in",
    bloomMonths: [5,6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.5-7.0", reblooming: true,
    rebloomNote: "Group 2 clematis bloom on old & new wood; Group 3 on new wood only",
    attracts: ["Bees","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Trellis","Fence","Arbor","Container"],
    companions: ["Roses (classic pairing)","Catmint","Salvia","Lavender","Low shrubs (to shade roots)"],
    yearRound: "Fluffy seed heads persist in winter; vine structure",
    foliageInterest: "Dark green divided leaves; some varieties have bronze new growth",
    cultivars: ["Jackmanii (purple, Group 3 classic)","Nelly Moser (pink striped, Group 2)","Comtesse de Bouchaud (pink, Group 3)","The President (purple, Group 2)","Sweet Autumn (white, fragrant, Group 3)","Roguchi (bell-shaped, non-clinging)"],
    fertilizer: "Rose fertilizer or tomato fertilizer in spring and mid-bloom", fertMonth: [4,6],
    care: {3:"Group 3: Cut to 12 inches. Group 2: Remove only dead/weak stems",4:"Fertilize; new growth; train shoots",5:"Early varieties bloom",6:"Main bloom; fertilize again",7:"Group 3 varieties peak",8:"Continue tying in new growth",9:"Sweet Autumn clematis in bloom",10:"Fluffy seed heads forming",11:"Mulch roots well; apply winter mulch around base"},
    video: "https://www.youtube.com/results?search_query=clematis+pruning+groups+care+guide",
    description: "The queen of climbing plants. Clematis offers huge flowers in every color from spring through fall depending on variety. Understanding pruning groups is key to success."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 30, name: "Coreopsis (Tickseed)", botanical: "Coreopsis spp.",
    type: "Perennial Flower", height: "12-36 in", width: "12-24 in",
    bloomMonths: [6,7,8,9], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Continuous bloom June-Sept with deadheading; Zagreb and Moonbeam are best",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Border","Edging","Mass Planting","Container"],
    companions: ["Salvia","Echinacea","Catmint","Lavender","Fountain Grass"],
    yearRound: "Fine-textured foliage; thread-leaf types add texture",
    foliageInterest: "Thread-leaf varieties (verticillata) have delicate, feathery foliage",
    cultivars: ["Moonbeam (pale yellow thread-leaf, Perennial of Year)","Zagreb (golden thread-leaf, compact)","Early Sunrise (double golden)","Nana (dwarf 6 in)","Jethro Tull (fluted petals)","Red Satin (ruby red)"],
    fertilizer: "Minimal; compost in spring", fertMonth: [4],
    care: {3:"Cut back old growth",4:"New growth; light compost",5:"Growth fills in",6:"Bloom begins; deadhead or shear for rebloom",7:"Shear back by 1/3 if bloom wanes",8:"Second wave of bloom",9:"Final flowers",10:"Cut back; some self-sow",11:"Thread-leaf types short-lived; divide every 2-3 years"},
    video: "https://www.youtube.com/results?search_query=coreopsis+tickseed+moonbeam+care",
    description: "Cheerful daisy-like flowers bloom for months with minimal care. Thread-leaf varieties (Moonbeam, Zagreb) are the most reliable and longest-blooming for Cleveland gardens."
,
    planted: [], clevelandCultivars: ["Zagreb", "Moonbeam", "Li'l Bang Series", "Sunkiss"], whereToBuy: "Proven Winners", whenAvailable: "May-Sep", clevelandLightNote: "Needs several hours of sun; benefits from afternoon shade in heat."
  },
  {
    id: 31, name: "Hellebore (Lenten Rose)", botanical: "Helleborus orientalis",
    type: "Perennial Flower", height: "12-24 in", width: "18-24 in",
    bloomMonths: [2,3,4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.5-7.5", reblooming: false,
    rebloomNote: "Very early bloomer; flowers last 6-8 weeks",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Winter Garden"],
    companions: ["Snowdrops","Daffodils","Hosta Halcyon","Japanese Painted Fern","Heuchera"],
    yearRound: "EVERGREEN foliage; blooms in late winter when nothing else flowers",
    foliageInterest: "Leathery, palmate evergreen leaves; architectural year-round",
    cultivars: ["Winter Jewels series","Wedding Party series (double flowers)","Ivory Prince (upward-facing)","Penny's Pink","Onyx Odyssey (double black)","Gold Collection (various)"],
    fertilizer: "Light compost in fall; balanced in spring", fertMonth: [4,10],
    care: {1:"Buds may be swelling under snow",2:"BLOOMING through snow — magical",3:"Peak bloom; cut back last year's tattered foliage to showcase flowers",4:"Flowers persist; new foliage emerging",5:"Fresh new foliage; remove spent flowers unless you want seedlings",6:"Evergreen foliage; shade appreciated",7:"Drought tolerant once established",8:"Low maintenance",9:"Evergreen interest continues",10:"Apply compost around base",11:"Evergreen foliage; no cutting back",12:"Green foliage in winter landscape"},
    video: "https://www.youtube.com/results?search_query=hellebore+lenten+rose+care+shade",
    description: "The earliest perennial to bloom — often flowering through snow in February. Evergreen foliage provides 12-month interest. Completely deer and rabbit proof. A must-have for shade."
,
    planted: ["HGC Ice N' Roses Macy Marble", "Bennottta", "Frosted Rose"], clevelandCultivars: ["Ivory Prince", "Pink Frost", "Wedding Party Series", "Frostkiss types"], whereToBuy: "Monrovia; Proven Winners", whenAvailable: "Feb-Apr", clevelandLightNote: "Best with morning sun or bright shade; avoid hot afternoon sun."
  },
  {
    id: 32, name: "Hardy Geranium (Cranesbill)", botanical: "Geranium spp.",
    type: "Perennial Flower / Groundcover", height: "6-24 in", width: "18-36 in",
    bloomMonths: [5,6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Rozanne blooms continuously May-Oct without deadheading",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Groundcover","Border","Edging","Woodland"],
    companions: ["Roses","Salvia","Catmint","Daylily","Fountain Grass"],
    yearRound: "Some varieties have excellent red/orange fall foliage",
    foliageInterest: "Deeply cut palmate leaves; many varieties have fall color in red/orange",
    cultivars: ["Rozanne (blue-purple, Perennial of Year 2008, 5-month bloom)","Biokovo (white/pink, groundcover)","Johnson's Blue (true blue)","Bloody Cranesbill (magenta, compact)","Wargrave Pink"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Clean up old foliage",4:"New growth; compost",5:"Bloom begins; Rozanne starts its marathon",6:"Full bloom",7:"Shear ratty foliage for fresh growth; Rozanne continues",8:"Bloom continues",9:"Still blooming (Rozanne)",10:"Fall foliage color on some varieties",11:"Cleanup after frost"},
    video: "https://www.youtube.com/results?search_query=rozanne+geranium+cranesbill+care",
    description: "Not the annual 'geranium' — true hardy geraniums are incredible perennial groundcovers. 'Rozanne' is legendary, blooming continuously for 5+ months without any deadheading."
,
    planted: [], clevelandCultivars: ["Rozanne", "Max Frei", "Biokovo"], whereToBuy: "Proven Winners", whenAvailable: "May-Jul", clevelandLightNote: "Half-day sun (morning or late-day); tolerates light afternoon sun."
  },
  {
    id: 33, name: "Goldenrod", botanical: "Solidago spp.",
    type: "Perennial Flower", height: "24-60 in", width: "18-24 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Extended fall bloom period",
    attracts: ["Butterflies","Bees","Birds"], nativeOhio: true,
    gardenStyles: ["Pollinator","Prairie","Native","Cottage","Border"],
    companions: ["Aster","Joe Pye Weed","Echinacea","Sedum","Switchgrass"],
    yearRound: "Seed heads for birds; essential fall nectar source",
    foliageInterest: "Upright green foliage",
    cultivars: ["Fireworks (arching sprays, 36 in)","Little Lemon (dwarf 12 in)","Golden Fleece (compact 18 in)","Solar Cascade (arching)"],
    fertilizer: "None needed", fertMonth: [],
    care: {3:"Cut back old growth",5:"Growth; can pinch for compact plants",8:"Bloom begins",9:"Peak bloom with asters — classic fall pairing",10:"Seed heads for birds",11:"Cut back or leave for winter interest"},
    video: "https://www.youtube.com/results?search_query=goldenrod+solidago+native+garden+not+ragweed",
    description: "Often unfairly blamed for allergies (that's ragweed!), goldenrod is a vital native pollinator plant. 'Fireworks' has elegant arching sprays. Pairs perfectly with fall asters."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 34, name: "Blanket Flower", botanical: "Gaillardia x grandiflora",
    type: "Perennial Flower", height: "12-30 in", width: "12-24 in",
    bloomMonths: [6,7,8,9,10], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Continuous bloom June-frost with deadheading",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Hot/Dry Garden","Container"],
    companions: ["Echinacea","Rudbeckia","Lavender","Salvia","Fountain Grass"],
    yearRound: "Warm-toned flowers from June through hard frost",
    foliageInterest: "Gray-green fuzzy foliage",
    cultivars: ["Arizona Sun (compact red/yellow)","Goblin (dwarf red/yellow)","Mesa series (compact, various)","Burgundy (solid red)","Fanfare series (tubular petals)"],
    fertilizer: "None; lean soil preferred; over-feeding shortens life", fertMonth: [],
    care: {4:"New growth; well-drained soil critical",5:"Growth; no fertilizer",6:"Bloom begins",7:"Deadhead regularly for continuous bloom",8:"Continue deadheading",9:"Still blooming strong",10:"Blooms until hard frost",11:"Good drainage critical for winter survival; short-lived (2-4 years), let it self-sow"},
    video: "https://www.youtube.com/results?search_query=gaillardia+blanket+flower+care+tips",
    description: "Hot-colored daisies in red, orange, and gold that bloom from June to frost. Thrives in heat, drought, and poor soil. Short-lived but freely self-sows."
,
    planted: [], clevelandCultivars: ["Arizona Sun", "Mesa Yellow", "Spintop Series"], whereToBuy: "Vigoro", whenAvailable: "May-Aug", clevelandLightNote: "Full day sun; tolerates strong afternoon sun."
  },
  {
    id: 35, name: "Ferns (Ostrich Fern)", botanical: "Matteuccia struthiopteris",
    type: "Fern", height: "36-60 in", width: "24-36 in",
    bloomMonths: [], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "High", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Non-flowering; reproduces via spores and runners",
    attracts: [], nativeOhio: true,
    gardenStyles: ["Shade Garden","Woodland","Naturalized","Rain Garden"],
    companions: ["Hosta Sum and Substance","Astilbe","Bleeding Heart","Brunnera","Ligularia"],
    yearRound: "Dramatic vase-shaped fronds spring-fall; brown fertile fronds persist in winter",
    foliageInterest: "Elegant vase-shaped bright green fronds unfurl in spring (edible fiddleheads). Brown fertile fronds add winter structure",
    cultivars: ["Species is the standard; no named cultivars widely available"],
    fertilizer: "Rich compost in spring; prefers moist, rich soil", fertMonth: [4],
    care: {3:"Watch for fiddleheads emerging (edible if harvested young!)",4:"Fronds unfurling; gorgeous vase shape forms",5:"Full frond display; ensure consistent moisture",6:"Lush green; may spread via runners",7:"Maintain moisture during heat",8:"Can look tired in drought; water deeply",9:"Fronds begin to brown",10:"Cut back browned fronds; leave fertile brown fronds",11:"Fertile fronds stand through winter",12:"Brown fertile fronds add winter interest"},
    video: "https://www.youtube.com/results?search_query=ostrich+fern+shade+garden+native+ohio",
    description: "The tallest and most dramatic native fern, creating an instant woodland feel. Spring fiddleheads are edible. Spreads to form colonies in moist shade."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 36, name: "Japanese Painted Fern", botanical: "Athyrium niponicum var. pictum",
    type: "Fern", height: "12-18 in", width: "18-24 in",
    bloomMonths: [], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-6.5", reblooming: false,
    rebloomNote: "Non-flowering; grown for metallic silver-purple foliage",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Container"],
    companions: ["Hosta Halcyon","Brunnera","Heuchera","Bleeding Heart","Astilbe"],
    yearRound: "Dormant in winter; metallic foliage spring through fall",
    foliageInterest: "STUNNING metallic silver and burgundy fronds — one of the most beautiful shade plants. Perennial Plant of the Year 2004",
    cultivars: ["Pictum (classic silver/purple)","Burgundy Lace (more burgundy)","Ursula's Red (red stems)","Regal Red (deep red)","Ghost (larger, silvery)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Clean up dead fronds",4:"New silver fronds emerge — magical",5:"Full display; ensure moisture",6:"Stunning with hostas and brunnera",7:"Maintain moisture",8:"May wilt in heat; water",9:"Foliage still beautiful",10:"Fronds die back with frost",11:"Apply mulch for winter protection"},
    video: "https://www.youtube.com/results?search_query=japanese+painted+fern+care+shade+garden",
    description: "One of the most beautiful shade plants in existence, with metallic silver and burgundy fronds. Perennial Plant of the Year. Pairs brilliantly with Brunnera 'Jack Frost'."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 37, name: "Toad Lily", botanical: "Tricyrtis spp.",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [9,10], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Blooms late Sept-Oct when few shade plants flower",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Collector"],
    companions: ["Japanese Anemone","Hosta Sum and Substance","Japanese Painted Fern","Aster","Hardy Mums"],
    yearRound: "Orchid-like flowers in fall; arching stems",
    foliageInterest: "Attractive arching stems with glossy foliage; some varieties are spotted",
    cultivars: ["Miyazaki (white/purple spotted)","Tojen (lavender)","Samurai (gold-edged foliage)","Blue Wonder (dark purple)","Empress (largest flowers)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {4:"New arching growth; compost",5:"Attractive foliage emerges",6:"Maintain consistent moisture",7:"Growth continues",8:"Buds forming along stems",9:"BLOOM — exotic orchid-like flowers!",10:"Continue blooming until hard frost",11:"Cut back after frost; mulch"},
    video: "https://www.youtube.com/results?search_query=toad+lily+tricyrtis+fall+shade+perennial",
    description: "A shade garden treasure with exotic, orchid-like spotted flowers in fall when little else blooms in the shade. A true collector's plant that's surprisingly easy to grow."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 38, name: "Black Cohosh (Bugbane)", botanical: "Actaea racemosa",
    type: "Perennial Flower", height: "48-72 in", width: "24-36 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.0-6.5", reblooming: false,
    rebloomNote: "Single bloom period; dramatic tall candelabras",
    attracts: ["Bees","Butterflies"], nativeOhio: true,
    gardenStyles: ["Shade Garden","Woodland","Native","Border (back)"],
    companions: ["Astilbe","Hosta Sum and Substance","Ostrich Fern","Joe Pye Weed","Japanese Anemone"],
    yearRound: "Tall white candelabra flowers in mid-summer shade; dark foliage varieties",
    foliageInterest: "Large compound leaves; 'Brunette' and 'Hillside Black Beauty' have dark purple-black foliage",
    cultivars: ["Brunette (dark purple foliage, pink-tinged flowers)","Hillside Black Beauty (darkest foliage)","Chocoholic (compact, chocolate foliage)","Atropurpurea (bronze foliage)"],
    fertilizer: "Rich compost in spring", fertMonth: [4],
    care: {3:"Late to emerge; mark location",4:"Dark foliage emerges; compost",5:"Lush foliage display",6:"Flower stalks developing",7:"Tall white candelabra flowers — dramatic in shade",8:"Bloom continues; fragrant",9:"Seed pods forming",10:"Cut back after frost",11:"Mulch for winter"},
    video: "https://www.youtube.com/results?search_query=actaea+cimicifuga+black+cohosh+shade+garden",
    description: "Tall, dramatic white flower spires light up the shade garden in mid-summer. Purple-leaved varieties like 'Brunette' add season-long dark foliage contrast. Native to Ohio."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 39, name: "Turtlehead", botanical: "Chelone lyonii",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [8,9,10], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Extended bloom Aug-Oct",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Shade Garden","Rain Garden","Native","Cottage","Woodland"],
    companions: ["Japanese Anemone","Astilbe","Joe Pye Weed","Lobelia","Cardinal Flower"],
    yearRound: "Glossy dark foliage; late-season bloom",
    foliageInterest: "Glossy dark green lance-shaped leaves; 'Hot Lips' has bronze new growth",
    cultivars: ["Hot Lips (pink, bronze foliage)","Tiny Tortuga (compact 16 in)","Alba (white)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {4:"New growth; compost",5:"Pinch for compact growth",6:"Glossy foliage",7:"Buds forming",8:"Turtle-shaped flowers open",9:"Peak bloom; great with fall asters",10:"Final flowers",11:"Cut back; divide if needed"},
    video: "https://www.youtube.com/results?search_query=chelone+turtlehead+native+shade+perennial",
    description: "Snapdragon-like flowers shaped like turtle heads. A native shade-loving, deer-resistant perennial that blooms late when most shade plants are finished. Loves moisture."
,
    planted: [], clevelandCultivars: ["Hot Lips", "Tiny Tortuga"], whereToBuy: "Regional grower (Petitti/Bremec)", whenAvailable: "Jul-Sep", clevelandLightNote: "Morning sun and high shade; protect from hot afternoon sun."
  },
  {
    id: 40, name: "Spirea (Bridal Wreath/Japanese)", botanical: "Spiraea spp.",
    type: "Shrub", height: "24-72 in", width: "24-72 in",
    bloomMonths: [4,5,6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Japanese types (japonica) rebloom if sheared; spring types bloom once",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Border","Foundation","Hedge","Cottage","Mass Planting"],
    companions: ["Daylily","Catmint","Hydrangea","Weigela","Karl Foerster"],
    yearRound: "Some varieties have colorful foliage (gold, chartreuse); good fall color",
    foliageInterest: "Gold Mound has brilliant chartreuse-gold foliage; many have orange-red fall color",
    cultivars: ["Little Princess (pink, compact)","Gold Mound (gold foliage)","Double Play Gold (gold foliage, pink flowers)","Bridal Wreath (white cascading)","Magic Carpet (red tips)","Neon Flash (hot pink)"],
    fertilizer: "Balanced 10-10-10 in early spring", fertMonth: [4],
    care: {3:"Prune spring-bloomers AFTER they bloom; prune summer-bloomers NOW",4:"Fertilize; new growth",5:"Spring varieties bloom",6:"Japanese types bloom; shear after first flush",7:"Rebloom on Japanese types",8:"Light pruning to shape",9:"Fall foliage developing",10:"Enjoy fall color",11:"Cleanup; mulch"},
    video: "https://www.youtube.com/results?search_query=spirea+pruning+japanese+spring+varieties",
    description: "Easy, reliable flowering shrub with varieties for every situation. Japanese types offer colorful foliage all season. 'Double Play Gold' is a standout with gold leaves and pink flowers."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 41, name: "Weigela", botanical: "Weigela florida",
    type: "Shrub", height: "36-72 in", width: "36-72 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.5", reblooming: true,
    rebloomNote: "Sonic Bloom series reblooms May through frost without deadheading",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Foundation","Specimen"],
    companions: ["Catmint","Salvia","Spirea","Hydrangea","Karl Foerster"],
    yearRound: "Colorful foliage varieties provide season-long interest",
    foliageInterest: "Wine & Roses: dark burgundy foliage; My Monet: variegated; Spilled Wine: dark purple",
    cultivars: ["Wine & Roses (dark foliage, pink flowers)","Sonic Bloom Pink (reblooming)","My Monet (dwarf, variegated)","Spilled Wine (dark foliage, weeping)","Fine Wine (compact, dark foliage)","Midnight Wine (dwarf dark)"],
    fertilizer: "Balanced 10-10-10 after spring bloom", fertMonth: [6],
    care: {3:"Wait for new growth to prune",4:"New foliage; gorgeous dark-leaved types",5:"BLOOM — tubular flowers attract hummingbirds",6:"Prune after spring bloom; fertilize. Rebloomers continue",7:"Reblooming types still flowering",8:"Rebloomers continue",9:"Late flowers on reblooming types",10:"Fall foliage on some varieties",11:"Light cleanup"},
    video: "https://www.youtube.com/results?search_query=weigela+wine+and+roses+sonic+bloom+care",
    description: "Tubular flowers are hummingbird magnets. Dark-foliaged varieties like 'Wine & Roses' provide season-long drama. 'Sonic Bloom' series reblooms without deadheading."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 42, name: "Ninebark", botanical: "Physocarpus opulifolius",
    type: "Shrub", height: "48-96 in", width: "48-96 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.0-7.0", reblooming: false,
    rebloomNote: "Single spring bloom; grown primarily for foliage",
    attracts: ["Bees","Butterflies"], nativeOhio: true,
    gardenStyles: ["Border","Hedge","Foundation","Native","Screen"],
    companions: ["Hydrangea","Spirea","Viburnum","Dogwood","Switchgrass"],
    yearRound: "Exfoliating bark provides excellent winter interest; colorful foliage all season",
    foliageInterest: "Dark burgundy to amber foliage depending on variety; peeling bark in winter",
    cultivars: ["Diablo (tall, dark purple)","Center Glow (amber center, red edge)","Tiny Wine (compact dark)","Little Devil (compact dark)","Amber Jubilee (amber/orange/gold)","Summer Wine (compact purple)"],
    fertilizer: "Light compost in spring; tough native needs little", fertMonth: [4],
    care: {3:"Prune to shape if needed; blooms on old wood",4:"Dramatic colored foliage emerges",5:"White/pink flower clusters",6:"Attractive red fruit clusters",7:"Foliage color deepens in summer",8:"Tough through heat/drought",9:"Foliage holding color",10:"Some fall color change",11:"Exfoliating bark visible as leaves drop",12:"Peeling cinnamon bark — wonderful winter interest"},
    video: "https://www.youtube.com/results?search_query=physocarpus+ninebark+diablo+pruning+care",
    description: "A tough native shrub with show-stopping dark foliage and winter bark interest. 'Diablo' is dramatic; 'Tiny Wine' and 'Little Devil' fit smaller spaces. Practically indestructible."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 43, name: "Viburnum (Arrowwood)", botanical: "Viburnum dentatum",
    type: "Shrub", height: "72-120 in", width: "72-96 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.0-7.5", reblooming: false,
    rebloomNote: "Single spring bloom; followed by blue berries and fall color",
    attracts: ["Butterflies","Bees","Birds"], nativeOhio: true,
    gardenStyles: ["Native","Hedge","Screen","Border","Wildlife Garden"],
    companions: ["Ninebark","Dogwood","Serviceberry","Joe Pye Weed","Switchgrass"],
    yearRound: "White spring flowers, blue berries in fall, red/purple fall foliage, winter form",
    foliageInterest: "Dark green textured foliage turns rich red-purple in fall",
    cultivars: ["Blue Muffin (compact, heavy fruiting)","Chicago Lustre (glossy foliage)","Autumn Jazz (outstanding fall color)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Prune to shape if needed",4:"New foliage",5:"White flower clusters",6:"Green berries developing",8:"Berries turning blue",9:"Blue berries attract birds; fall color starts",10:"Brilliant red-purple fall color",11:"Berries persist for birds",12:"Open branching structure"},
    video: "https://www.youtube.com/results?search_query=viburnum+dentatum+arrowwood+native+shrub",
    description: "Outstanding native shrub with white flowers, blue berries for birds, and stunning fall color. 'Blue Muffin' is a compact choice. True four-season interest."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 44, name: "Allium (Ornamental Onion)", botanical: "Allium spp.",
    type: "Bulb / Perennial", height: "12-48 in", width: "8-18 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Plant varieties with staggered bloom times; dried seed heads persist",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Formal","Modern","Mass Planting"],
    companions: ["Catmint","Salvia","Hardy Geranium","Peony","Karl Foerster"],
    yearRound: "Dried seed spheres persist through summer into winter — architectural",
    foliageInterest: "Strap-like foliage often yellows during bloom (plant among companions to hide)",
    cultivars: ["Globemaster (large purple 6-in globes)","Purple Sensation (classic)","Millenium (late blooming, compact)","Summer Drummer (tall, late)","Schubertii (fireworks-like heads)","Mount Everest (white)"],
    fertilizer: "Bulb fertilizer in fall when planting; bone meal in spring", fertMonth: [4,10],
    care: {3:"Shoots emerge early",4:"Foliage growing; bone meal",5:"BLOOM — spectacular purple globes",6:"Seed heads forming; leave foliage until yellow",7:"Dried seed heads — leave for architecture",8:"Millenium variety blooms now",9:"Seed heads still attractive",10:"Plant new bulbs NOW; bulb fertilizer",11:"Fall-planted bulbs settling in",12:"Dried heads visible in winter garden"},
    video: "https://www.youtube.com/results?search_query=ornamental+allium+varieties+planting+guide",
    description: "Spectacular purple globes that float above spring gardens. Completely pest-proof (onion family!). Dried seed heads persist for months. Plant in fall for spring bloom."
,
    planted: [], clevelandCultivars: ["Millenium", "Summer Beauty", "Globemaster"], whereToBuy: "Proven Winners", whenAvailable: "May-Jul", clevelandLightNote: "Full sun; needs strong light for sturdy scapes."
  },
  {
    id: 45, name: "Threadleaf Bluestar", botanical: "Amsonia hubrichtii",
    type: "Perennial Flower", height: "30-36 in", width: "36-48 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Single spring bloom; grow it for the incredible fall foliage",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Border","Prairie","Native","Modern","Mass Planting"],
    companions: ["Echinacea","Baptisia","Sedum","Aster"],
    yearRound: "Blue spring flowers, feathery green summer texture, BRILLIANT gold fall color, fine winter structure",
    foliageInterest: "Thread-thin leaves create a billowy texture; the most brilliant gold fall color of ANY perennial",
    cultivars: ["Hubrichtii (Perennial of Year 2011)","Blue Ice (larger flowers)","Storm Cloud (dark stems)"],
    fertilizer: "None needed", fertMonth: [],
    care: {3:"Late to emerge; do not disturb",4:"New growth; steel-blue flower buds",5:"Star-shaped blue flowers",6:"Feathery green foliage takes over",7:"Beautiful fine texture; minimal care",8:"Low maintenance",9:"Fall color begins — SPECTACULAR gold",10:"Peak gold — rival to any tree",11:"Fine stem structure persists",12:"Delicate winter silhouette"},
    video: "https://www.youtube.com/results?search_query=amsonia+hubrichtii+threadleaf+bluestar+fall+color",
    description: "Grown for its jaw-dropping golden fall color — arguably the best of any perennial. Fine threadlike foliage provides unique texture all season. Nearly zero maintenance."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 46, name: "Cardinal Flower", botanical: "Lobelia cardinalis",
    type: "Perennial Flower", height: "24-48 in", width: "12-18 in",
    bloomMonths: [7,8,9], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "High", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single bloom period; sow seed for continuation",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Rain Garden","Native","Woodland","Pollinator","Stream Bank"],
    companions: ["Turtlehead","Joe Pye Weed","Ostrich Fern","Astilbe","Blue Lobelia"],
    yearRound: "Brilliant red spikes in late summer; basal rosettes semi-evergreen",
    foliageInterest: "Dark green to bronze-green basal rosettes; some varieties have dark purple foliage",
    cultivars: ["Classic (red)","Queen Victoria (dark foliage, red flowers)","Black Truffle (very dark foliage)","Blue Lobelia/L. siphilitica (companion species, blue)"],
    fertilizer: "Rich compost in spring; prefers moist rich soil", fertMonth: [4],
    care: {3:"Check for winter heaving; push rosettes back in",4:"Compost; ensure moisture",5:"Rosettes growing",7:"Brilliant red flower spikes — hummingbird paradise",8:"Peak bloom",9:"Allow to self-sow for colony",10:"Don't cut back — basal rosettes overwinter",11:"Light mulch; do NOT bury rosettes"},
    video: "https://www.youtube.com/results?search_query=lobelia+cardinalis+cardinal+flower+hummingbirds",
    description: "The #1 hummingbird plant, period. Brilliant scarlet spikes in late summer are irresistible to hummingbirds. Native, deer-proof, and stunning by stream banks or rain gardens."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 47, name: "Autumn Crocus (Colchicum)", botanical: "Colchicum autumnale",
    type: "Bulb / Corm", height: "6-10 in", width: "6-8 in",
    bloomMonths: [9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Surprise fall bloom from bare ground; foliage appears in spring",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Under Trees","Naturalized"],
    companions: ["Groundcover plants","Low grasses","Sedum","Thyme"],
    yearRound: "Large crocus-like flowers from bare ground in fall; spring foliage",
    foliageInterest: "Large strap leaves appear in spring and die back by summer (plant among companions to hide)",
    cultivars: ["Waterlily (double pink)","The Giant (large violet)","Album (white)","Lilac Wonder"],
    fertilizer: "Bone meal when planting in late summer", fertMonth: [8],
    care: {3:"Large spring foliage appears — do NOT remove until yellow",4:"Foliage photosynthesizing for fall bloom",5:"Foliage yellowing; let die naturally",6:"Foliage gone; dormant",7:"Dormant",8:"Plant NEW corms now",9:"Surprise! Flowers emerge from bare ground",10:"Bloom continues",11:"Dormant again"},
    video: "https://www.youtube.com/results?search_query=colchicum+autumn+crocus+fall+blooming+bulb",
    description: "Magic! Large crocus-like flowers appear from bare ground in September without any leaves. Plant corms in August and they bloom within weeks. Totally deer-proof (toxic)."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 48, name: "Blue False Indigo", botanical: "Baptisia 'Blueberry Sundae'",
    type: "Perennial Flower", height: "30-36 in", width: "30-36 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Bicolor flower spikes: purple and yellow. Black seed pods after bloom",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Border","Cottage","Native","Prairie"],
    companions: ["Peony","Catmint","Allium","Iris","Switchgrass"],
    yearRound: "Blue-green shrub-like foliage; rattling black seed pods",
    foliageInterest: "Blue-green compound foliage; maintains shrub-like form all season",
    cultivars: ["Decadence Blueberry Sundae","Decadence Lemon Meringue (yellow)","Decadence Dutch Chocolate (brown)","Decadence Cherries Jubilee (red-yellow)"],
    fertilizer: "None; nitrogen fixer", fertMonth: [],
    care: {4:"New blue-green growth",5:"Bicolor flower spikes",6:"Seed pods developing",7:"Attractive foliage; shrub-like form",9:"Black pods rattling",10:"Ornamental pods",11:"Can leave or cut back"},
    video: "https://www.youtube.com/results?search_query=baptisia+decadence+series+perennial+garden",
    description: "The Decadence series offers baptisia in stunning bicolor and single colors beyond classic blue. Shrub-like stature, zero maintenance, and ornamental seed pods."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 49, name: "Dianthus (Pinks)", botanical: "Dianthus gratianopolitanus",
    type: "Perennial Flower", height: "6-12 in", width: "12-18 in",
    bloomMonths: [5,6,7], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-7.5", reblooming: true,
    rebloomNote: "Shear after first bloom for strong rebloom; some bloom all summer",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Rock Garden","Edging","Container","Border"],
    companions: ["Lavender","Catmint","Salvia","Sedum","Thyme"],
    yearRound: "Blue-gray evergreen/semi-evergreen foliage mat",
    foliageInterest: "Neat mat of blue-gray grassy foliage; semi-evergreen in Cleveland",
    cultivars: ["Firewitch (magenta, Perennial of Year)","Bath's Pink (pink, fragrant)","Paint the Town series","Kahori (long-blooming)","Eastern Star"],
    fertilizer: "Very light; lean soil preferred", fertMonth: [],
    care: {3:"Clean up winter damage; foliage may be semi-evergreen",4:"Fresh growth fills in",5:"Fragrant bloom begins — spicy clove scent",6:"Shear after first flush for rebloom",7:"Rebloom wave",8:"Good drainage essential in summer heat",9:"Light bloom possible",10:"Foliage remains",11:"Semi-evergreen; no heavy mulch on crown"},
    video: "https://www.youtube.com/results?search_query=dianthus+pinks+firewitch+perennial+care",
    description: "Compact mats of fragrant clove-scented flowers in pink, red, and white. Evergreen foliage and tidy habit make dianthus perfect for edging. 'Firewitch' is the gold standard."
,
    planted: ["Paint the Town Magenta", "Cheddar Pink", "Cherry Charm"], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 50, name: "Ornamental Grass - Little Bluestem", botanical: "Schizachyrium scoparium",
    type: "Ornamental Grass", height: "24-48 in", width: "18-24 in",
    bloomMonths: [8,9], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "Fluffy white seed heads catch light beautifully",
    attracts: ["Birds"], nativeOhio: true,
    gardenStyles: ["Prairie","Native","Border","Mass Planting","Meadow"],
    companions: ["Echinacea","Aster","Goldenrod","Black-eyed Susan","Liatris"],
    yearRound: "STUNNING mahogany-red fall color; copper winter stems with fluffy seeds",
    foliageInterest: "Blue-green in summer; incredible mahogany-red-orange fall color; coppery winter",
    cultivars: ["Standing Ovation (very upright)","The Blues (blue summer, red fall)","Carousel (compact)","Smoke Signal (dark fall color)","Prairie Blues"],
    fertilizer: "None; native prairie grass", fertMonth: [],
    care: {2:"Cut back to 4 inches before new growth",3:"Cut back if not done",4:"Blue-green growth begins (warm-season grass, slow to start)",5:"Growth accelerating",6:"Blue-green upright form",8:"Fluffy seed heads",9:"Fall color starting — blue to mahogany",10:"PEAK fall color — spectacular",11:"Copper-red winter form",12:"Beautiful with snow; seeds feed birds"},
    video: "https://www.youtube.com/results?search_query=little+bluestem+native+grass+fall+color",
    description: "Ohio's premier native grass. Blue-green summer foliage transforms to stunning mahogany-red in fall, then holds copper-toned through winter. 'Standing Ovation' stays perfectly upright.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 51, name: "Fountain Grass (Hardy)", botanical: "Pennisetum alopecuroides",
    type: "Ornamental Grass", height: "24-48 in", width: "24-36 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Fuzzy bottle-brush plumes catch light beautifully",
    attracts: ["Birds"], nativeOhio: false,
    gardenStyles: ["Border","Mass Planting","Container","Modern","Edging"],
    companions: ["Sedum","Rudbeckia","Aster","Russian Sage","Mums"],
    yearRound: "Fountain shape; fuzzy plumes in fall; golden winter form",
    foliageInterest: "Graceful arching fountain shape; golden fall color; fuzzy caterpillar-like plumes",
    cultivars: ["Hameln (compact, most popular)","Little Bunny (miniature 12 in)","Cassian (early-blooming)","Red Head (early, large plumes)","Burgundy Bunny (red tips)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {2:"Cut back to 4-6 inches before new growth",3:"Cut back if not done",5:"Growth begins (warm-season)",6:"Arching fountain form fills in",8:"Fuzzy plumes appear — magical backlit",9:"Peak plume display",10:"Golden fall color",11:"Leave standing for winter",12:"Architectural winter form"},
    video: "https://www.youtube.com/results?search_query=pennisetum+hameln+fountain+grass+care",
    description: "The quintessential fountain-shaped grass with adorable fuzzy bottle-brush plumes. 'Hameln' is the standard; 'Little Bunny' is a miniature version perfect for containers.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 52, name: "Japanese Forest Grass", botanical: "Hakonechloa macra",
    type: "Ornamental Grass", height: "12-18 in", width: "18-24 in",
    bloomMonths: [], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Grown for foliage; inconspicuous flowers",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Shade Garden","Japanese Garden","Container","Border","Woodland"],
    companions: ["Hosta Guacamole","Heuchera","Brunnera","Japanese Painted Fern","Astilbe"],
    yearRound: "Golden cascading foliage; pinkish fall tones; dormant in winter",
    foliageInterest: "Gracefully cascading mound of golden or variegated foliage — like a golden waterfall",
    cultivars: ["Aureola (gold-striped, most popular)","All Gold (entirely gold)","Beni-kaze (green, turns red in fall)","Stripe It Rich (gold/green)","Nicolas (green, red fall)"],
    fertilizer: "Compost in spring; consistent moisture", fertMonth: [4],
    care: {3:"Clean up dead foliage",4:"New cascading growth; compost",5:"Golden foliage display begins",6:"Maintaining moisture important",7:"Lush cascading form",8:"Mature beauty; water during drought",9:"Pinkish fall tones developing",10:"Rose-gold fall color",11:"Goes dormant; cut back after frost",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=hakonechloa+japanese+forest+grass+shade",
    description: "A living golden waterfall for shade. Cascading golden foliage is one of the most elegant shade garden plants. Slow to establish but worth the wait. Stunning in containers.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 53, name: "Blue Star Juniper (Groundcover)", botanical: "Juniperus squamata 'Blue Star'",
    type: "Evergreen Shrub", height: "12-24 in", width: "24-36 in",
    bloomMonths: [], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "Non-flowering; grown for steel-blue evergreen foliage",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Rock Garden","Foundation","Border","Container","Winter Garden"],
    companions: ["Sedum","Dianthus","Lavender","Thyme"],
    yearRound: "EVERGREEN steel-blue foliage year-round; indispensable winter interest",
    foliageInterest: "Dense, star-shaped clusters of intense steel-blue needles all year",
    cultivars: ["Blue Star (classic)","Blue Rug (prostrate groundcover)","Gold Coast (golden)","Icee Blue (flat, silver-blue)"],
    fertilizer: "Evergreen fertilizer in spring if needed", fertMonth: [4],
    care: {1:"Evergreen interest; shake off heavy snow",2:"Still blue and beautiful",3:"Light pruning to shape if needed",4:"New growth; light evergreen fertilizer",5:"Fresh blue growth tips",6:"Minimal care; drought tolerant once established",7:"No issues in heat",8:"Low maintenance",9:"Year-round blue",10:"Valuable as other plants fade",11:"Stands out as deciduous plants go dormant",12:"Anchor of the winter garden"},
    video: "https://www.youtube.com/results?search_query=blue+star+juniper+evergreen+groundcover+care",
    description: "Compact mound of intense steel-blue evergreen foliage. Invaluable for winter garden structure and year-round color. Virtually maintenance-free once established."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 54, name: "Creeping Phlox", botanical: "Phlox subulata",
    type: "Groundcover", height: "4-6 in", width: "18-24 in",
    bloomMonths: [4,5], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Single spectacular spring bloom; evergreen mat rest of year",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Rock Garden","Slope","Wall","Edging","Groundcover"],
    companions: ["Dianthus","Creeping Thyme","Sedum","Spring Bulbs","Allium"],
    yearRound: "Evergreen needle-like foliage mat; blanket of flowers in spring",
    foliageInterest: "Dense mat of needle-like evergreen foliage; carpet of color in spring",
    cultivars: ["Emerald Blue (lavender-blue)","Emerald Pink","Candy Stripe (pink/white)","Scarlet Flame (red)","Snowflake (white)","Purple Beauty"],
    fertilizer: "Light balanced fertilizer after bloom", fertMonth: [5],
    care: {3:"Green mat ready to bloom",4:"BLOOM — cascading sheets of color",5:"Shear lightly after bloom for compact growth; fertilize",6:"Evergreen mat remains",7:"Drought tolerant; minimal care",8:"Low maintenance",9:"Evergreen foliage",10:"Still green",11:"Evergreen through winter",12:"Green mat under snow"},
    video: "https://www.youtube.com/results?search_query=creeping+phlox+subulata+groundcover+care",
    description: "Creates breathtaking cascades of spring color over rocks, walls, and slopes. Evergreen mat stays attractive year-round. One of the showiest spring groundcovers."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 55, name: "Ajuga (Bugleweed)", botanical: "Ajuga reptans",
    type: "Groundcover", height: "4-8 in", width: "12-24 in",
    bloomMonths: [4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Single spring bloom; semi-evergreen foliage year-round",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Groundcover","Shade Garden","Edging","Under Trees"],
    companions: ["Hosta Blue Mouse Ears","Japanese Painted Fern","Heuchera","Spring Bulbs","Bleeding Heart"],
    yearRound: "Semi-evergreen colored foliage (bronze, purple, multicolor)",
    foliageInterest: "Rosettes of glossy colored foliage: bronze, purple, variegated, chocolate",
    cultivars: ["Chocolate Chip (tiny chocolate leaves)","Black Scallop (darkest foliage)","Burgundy Glow (tricolor)","Catlin's Giant (large)","Dixie Chip (multicolor)"],
    fertilizer: "None needed", fertMonth: [],
    care: {3:"Semi-evergreen foliage present",4:"Blue flower spikes — carpet of blue",5:"Flowers fade; trim if desired",6:"Spreads via runners; contain if needed",7:"Foliage remains colorful",8:"Low maintenance",9:"Foliage color",10:"Semi-evergreen as temps drop",11:"Mostly holds foliage",12:"Some foliage persists under snow"},
    video: "https://www.youtube.com/results?search_query=ajuga+bugleweed+groundcover+shade",
    description: "Fast-spreading groundcover with spikes of blue flowers in spring and colorful foliage year-round. 'Black Scallop' has dramatic near-black leaves. Can be aggressive — contain edges."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 56, name: "Lamb's Ear", botanical: "Stachys byzantina",
    type: "Perennial Foliage / Groundcover", height: "6-18 in", width: "18-24 in",
    bloomMonths: [6,7], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Grown for fuzzy silver foliage; many gardeners remove flower stalks",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Edging","Children's Garden","Sensory Garden"],
    companions: ["Roses","Lavender","Catmint","Salvia","Dianthus"],
    yearRound: "Silver fuzzy foliage spring through fall; semi-evergreen in mild winters",
    foliageInterest: "Incredibly soft, silvery-white fuzzy leaves — children love touching them",
    cultivars: ["Helen von Stein (Big Ears — no flowers, large leaves)","Silver Carpet (no flowers)","Primrose Heron (gold/silver)","Cotton Boll (fuzzy flower buds)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Clean up ratty winter foliage",4:"Fresh silver foliage emerges",5:"Stunning silver carpet",6:"Remove flower stalks if desired; some prefer non-flowering types",7:"Watch for rot in humid weather; good drainage essential",8:"Remove dead foliage in center if mushy",9:"Silver foliage still attractive",10:"May persist into winter",11:"Semi-evergreen; light cleanup"},
    video: "https://www.youtube.com/results?search_query=lambs+ear+stachys+byzantina+care+garden",
    description: "Impossibly soft, silver-white fuzzy leaves that children (and adults) can't resist touching. A wonderful textural contrast plant. 'Helen von Stein' has large leaves and no messy flowers."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 57, name: "Ligularia", botanical: "Ligularia spp.",
    type: "Perennial Flower", height: "36-60 in", width: "24-36 in",
    bloomMonths: [7,8,9], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: false, droughtTolerant: false,
    waterReq: "High", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single bloom period; dramatic bold foliage all season",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Rain Garden","Pond-side","Woodland","Bold Foliage"],
    companions: ["Hosta Sum and Substance","Ostrich Fern","Astilbe","Joe Pye Weed","Cardinal Flower"],
    yearRound: "Huge dramatic foliage; tall flower spikes or daisy-like blooms",
    foliageInterest: "HUGE round or toothed dark leaves; some varieties have dark chocolate-purple undersides",
    cultivars: ["The Rocket (tall yellow spikes)","Othello (dark leaves, orange daisies)","Britt-Marie Crawford (darkest foliage, orange daisies)","Bottle Rocket (compact)","Little Rocket (compact)"],
    fertilizer: "Rich compost in spring", fertMonth: [4],
    care: {4:"Big bold leaves emerge; compost",5:"Dramatic foliage display",6:"Moisture critical; will wilt dramatically in sun/drought",7:"Flower spikes or daisies appear",8:"Bloom continues; keep moist",9:"Late flowers; foliage still dramatic",10:"Cut back after frost",11:"Mulch well"},
    video: "https://www.youtube.com/results?search_query=ligularia+rocket+shade+garden+bold+foliage",
    description: "Dramatic bold-leaved shade perennial with huge round leaves and bright yellow flowers. Will wilt in afternoon sun — needs consistent moisture. A statement plant for moist shade."
,
    planted: [], clevelandCultivars: ["The Rocket", "Little Rocket", "Britt-Marie Crawford"], whereToBuy: "Monrovia", whenAvailable: "May-Jun", clevelandLightNote: "Morning sun, afternoon shade; keep out of hot western exposures."
  },
  {
    id: 58, name: "Veronica (Speedwell)", botanical: "Veronica spicata",
    type: "Perennial Flower", height: "12-30 in", width: "12-18 in",
    bloomMonths: [6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-8.0", reblooming: true,
    rebloomNote: "Deadhead spent spikes; Giles van Hees and Royal Candles rebloom well",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Edging","Rock Garden","Container"],
    companions: ["Salvia","Catmint","Echinacea","Daylily","Shasta Daisy"],
    yearRound: "Neat compact foliage mound",
    foliageInterest: "Compact mound of lance-shaped green foliage",
    cultivars: ["Royal Candles (violet-blue, compact)","Giles van Hees (pink, compact)","Red Fox (rose-pink)","White Icicle (white)","Sunny Border Blue (tall blue)","Magic Show series (compact, long-blooming)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Clean up old growth",4:"Compact new growth; compost",5:"Foliage fills in",6:"Flower spikes appear — vertical accent",7:"Peak bloom; deadhead for rebloom",8:"Second bloom wave possible",9:"Trim spent spikes",10:"Cut back",11:"Tidy up"},
    video: "https://www.youtube.com/results?search_query=veronica+speedwell+royal+candles+perennial+care",
    description: "Neat spikes of blue, pink, or white flowers on compact plants. Excellent companion for other perennials. 'Royal Candles' is outstanding — compact, long-blooming, and trouble-free."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 59, name: "Foxglove", botanical: "Digitalis purpurea / D. grandiflora",
    type: "Biennial / Perennial", height: "36-60 in", width: "18-24 in",
    bloomMonths: [5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-6.5", reblooming: false,
    rebloomNote: "D. purpurea is biennial (blooms year 2, then dies); D. grandiflora is truly perennial",
    attracts: ["Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Woodland","Border","Shade Garden"],
    companions: ["Hosta Patriot","Astilbe","Japanese Painted Fern","Roses","Brunnera"],
    yearRound: "Tall spires of bell-shaped flowers; cottage garden icon",
    foliageInterest: "Large fuzzy basal rosettes; flower spires are dramatic vertical elements",
    cultivars: ["Camelot series (perennial-ish, first year bloom)","Goldcrest (perennial, yellow)","D. grandiflora (true perennial, yellow)","Excelsior hybrids (tall, mixed colors)","Dalmatian series (compact, perennial tendency)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {3:"Rosettes growing",4:"Flower stalk developing; compost",5:"Tall bell-shaped flower spires — cottage garden magic",6:"Peak bloom; leave some to self-sow",7:"Allow seed pods if you want self-sowing",8:"New rosettes developing for next year",9:"Remove spent plants; transplant seedlings",10:"First-year rosettes settling in",11:"Rosettes semi-evergreen"},
    video: "https://www.youtube.com/results?search_query=foxglove+digitalis+cottage+garden+care",
    description: "The quintessential cottage garden flower with tall spires of spotted bell-shaped flowers. Most are biennial — let them self-sow. D. grandiflora is truly perennial but smaller."
,
    planted: [], clevelandCultivars: ["Dalmatian Series", "Camelot Series", "Polka Dot Pippa"], whereToBuy: "Proven Winners", whenAvailable: "Apr-Jun", clevelandLightNote: "Half-day sun; prefers morning sun with some afternoon shade."
  },
  {
    id: 60, name: "Black-Eyed Susan Vine (Goldstrum)", botanical: "Thunbergia alata",
    type: "Annual Vine (in zone 6)", height: "48-96 in", width: "spreading",
    bloomMonths: [6,7,8,9,10], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Continuous bloom June-frost",
    attracts: ["Butterflies","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Trellis","Container","Hanging Basket"],
    companions: ["Clematis","Morning Glory","Roses","Mandevilla"],
    yearRound: "Annual in Cleveland — provide tropical color June-frost",
    foliageInterest: "Heart-shaped leaves on twining vines",
    cultivars: ["Susie Mix (orange, yellow, white)","African Sunset (burgundy)","Sunny Susy series (many colors)","Blushing Susie (apricot)"],
    fertilizer: "Balanced liquid fertilizer every 2 weeks", fertMonth: [5,6,7,8,9],
    care: {4:"Start seeds indoors 6 weeks before last frost",5:"Plant out after last frost (mid-May Cleveland)",6:"Blooming; train on trellis/support",7:"Feed every 2 weeks; water consistently",8:"Peak bloom",9:"Still blooming strongly",10:"Blooms until frost kills it",11:"Pull out after frost — annual here"},
    video: "https://www.youtube.com/results?search_query=black+eyed+susan+vine+thunbergia+care",
    description: "Charming annual vine (not winter-hardy in Cleveland) with cheerful flowers in orange, yellow, and white with dark eyes. Fast-growing on trellises, mailboxes, and hanging baskets."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 61, name: "Virginia Sweetspire", botanical: "Itea virginica",
    type: "Shrub", height: "36-60 in", width: "36-60 in",
    bloomMonths: [6,7], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.0-7.0", reblooming: false,
    rebloomNote: "Single bloom; fragrant white bottle-brush flowers",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Native","Border","Foundation","Rain Garden","Woodland"],
    companions: ["Hydrangea","Ostrich Fern","Astilbe","Ninebark","Viburnum"],
    yearRound: "Fragrant white flowers, brilliant red-purple fall color, semi-evergreen",
    foliageInterest: "Glossy green summer foliage turns BRILLIANT red-orange-purple in fall; semi-evergreen",
    cultivars: ["Henry's Garnet (best fall color, 3-5 ft)","Little Henry (compact 3 ft)","Scentlandia (fragrant, compact)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {3:"Prune to shape; semi-evergreen foliage",4:"New growth; compost",6:"Fragrant white drooping flower racemes",7:"Flowers fade; attractive green foliage",8:"Low maintenance",9:"Fall color begins — spectacular reds and purples",10:"Peak fall color — one of the best native shrubs for fall",11:"Semi-evergreen; holds some foliage",12:"Some red foliage may persist"},
    video: "https://www.youtube.com/results?search_query=itea+virginia+sweetspire+henry+garnet+care",
    description: "Outstanding native shrub with fragrant white flowers and some of the best fall color of any shrub. 'Henry's Garnet' is the gold standard. Adapts to wet or average soils."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 62, name: "Butterfly Bush", botanical: "Buddleja davidii",
    type: "Shrub", height: "48-96 in", width: "48-72 in",
    bloomMonths: [7,8,9,10], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Continuous bloom with deadheading; Lo & Behold series are sterile/non-invasive",
    attracts: ["Butterflies","Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Pollinator","Cottage","Border","Container"],
    companions: ["Echinacea","Salvia","Sedum","Aster"],
    yearRound: "Late-starting in spring; dies to ground in Cleveland; arching silver-green stems",
    foliageInterest: "Silver-green willow-like foliage on arching stems",
    cultivars: ["Lo & Behold Blue Chip (dwarf, sterile — CHOOSE STERILE VARIETIES)","Lo & Behold Purple Haze","Miss Molly (red)","Pugster series (compact, cold-hardy)","Buzz series (compact)","Nanho Blue"],
    fertilizer: "Light balanced in spring as growth begins", fertMonth: [4,5],
    care: {3:"May look dead — DON'T remove yet",4:"Wait for new growth from base; cut back dead wood to live growth",5:"New growth accelerating; late starter in Cleveland",6:"Rapid growth",7:"Bloom begins — butterfly paradise",8:"Peak bloom; deadhead for continuous flowers",9:"Still blooming; monarch butterflies visiting",10:"Blooms until hard frost",11:"Can cut back to 12 inches; may die to ground naturally in zone 6"},
    video: "https://www.youtube.com/results?search_query=butterfly+bush+buddleja+zone+6+sterile+varieties",
    description: "The ultimate butterfly magnet with long cone-shaped fragrant flowers. IMPORTANT: Choose sterile/non-invasive varieties (Lo & Behold, Pugster series) to avoid invasiveness."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 63, name: "Coral Honeysuckle", botanical: "Lonicera sempervirens",
    type: "Vine", height: "96-180 in", width: "36-72 in",
    bloomMonths: [5,6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.5", reblooming: true,
    rebloomNote: "Main bloom spring; sporadic rebloom through fall",
    attracts: ["Hummingbirds","Butterflies","Birds"], nativeOhio: true,
    gardenStyles: ["Cottage","Trellis","Fence","Wildlife Garden","Native"],
    companions: ["Clematis","Trumpet Vine (with caution)","Native shrubs"],
    yearRound: "Semi-evergreen in mild winters; red berries for birds in fall",
    foliageInterest: "Blue-green semi-evergreen foliage; fused leaf pairs distinctive",
    cultivars: ["Major Wheeler (heaviest blooming, red)","John Clayton (yellow)","Alabama Crimson (crimson)","Cedar Lane (red)"],
    fertilizer: "Light compost in spring; don't over-feed", fertMonth: [4],
    care: {3:"Clean up dead wood; train new growth",4:"New growth; semi-evergreen may have kept some foliage",5:"BLOOM — tubular red-orange flowers, hummingbird heaven",6:"Continuous bloom; train on support",7:"Sporadic rebloom",8:"Red berries forming",9:"Berries for birds; light rebloom",10:"Semi-evergreen foliage",11:"May hold foliage in mild winter",12:"Semi-evergreen interest"},
    video: "https://www.youtube.com/results?search_query=lonicera+sempervirens+coral+honeysuckle+native+vine",
    description: "The NATIVE honeysuckle (not the invasive Japanese type!). Coral honeysuckle is a well-behaved vine with tubular flowers that hummingbirds love. 'Major Wheeler' is the heaviest bloomer."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 64, name: "Hardy Hibiscus", botanical: "Hibiscus moscheutos",
    type: "Perennial Flower", height: "36-60 in", width: "24-48 in",
    bloomMonths: [7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Continuous bloom Jul-Sep; dinner-plate sized flowers",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Rain Garden","Border","Tropical Look","Specimen"],
    companions: ["Joe Pye Weed","Black-eyed Susan","Cannas","Elephant Ears","Miscanthus"],
    yearRound: "Tropical look in summer; dies to ground in winter (late to emerge in spring!)",
    foliageInterest: "Large dark green to burgundy leaves; some varieties have maple-shaped dark foliage",
    cultivars: ["Luna series (compact 24-36 in)","Summerific series (dark foliage)","Lord Baltimore (red classic)","Summerific Cranberry Crush (dark foliage, red)","Starry Starry Night (dark foliage, huge pink)"],
    fertilizer: "Balanced fertilizer monthly during growth", fertMonth: [5,6,7,8],
    care: {3:"DO NOT remove — appears dead but is alive! Very late to emerge (May!)",4:"Still no sign of life — this is normal!",5:"Finally! New shoots appear. Now cut back old stems to ground",6:"Rapid growth; fertilize monthly",7:"Dinner-plate flowers begin — WOW",8:"Peak bloom; keep watered",9:"Continue blooming; reduce feeding",10:"Frost kills foliage; can cut back or leave stems",11:"Mark location — you will forget where it is!"},
    video: "https://www.youtube.com/results?search_query=hardy+hibiscus+moscheutos+zone+6+care",
    description: "Dinner-plate sized tropical flowers (up to 10 inches!) on a winter-hardy native plant. Emerges very late in spring — don't dig it up! 'Summerific' series has stunning dark foliage."
,
    planted: [], clevelandCultivars: ["Summerific Series", "Lord Baltimore", "Cherry Cheesecake"], whereToBuy: "Proven Winners", whenAvailable: "Jun-Aug", clevelandLightNote: "Full sun; tolerates hot afternoon sun."
  },
  {
    id: 65, name: "Japanese Barberry (Alternatives)", botanical: "Berberis thunbergii",
    type: "Shrub", height: "24-60 in", width: "24-60 in",
    bloomMonths: [4,5], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "NOTE: Invasive in Ohio. Consider native alternatives like Ninebark or Fothergilla",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Border","Foundation","Hedge"],
    companions: ["Boxwood","Spirea"],
    yearRound: "Colorful foliage spring-fall; thorny barrier; red berries (spread by birds — invasive)",
    foliageInterest: "Purple, gold, or variegated foliage; good fall color. WARNING: Invasive species in Ohio",
    cultivars: ["BETTER ALTERNATIVES: Ninebark 'Tiny Wine', Fothergilla, Itea, Weigela 'Wine & Roses'"],
    fertilizer: "N/A — consider removing and replacing with native alternatives", fertMonth: [],
    care: {4:"Consider replacing with non-invasive native alternatives",5:"Ninebark and Fothergilla provide similar colored foliage without invasiveness"},
    video: "https://www.youtube.com/results?search_query=barberry+invasive+alternatives+native+shrubs",
    description: "WARNING: Japanese barberry is invasive in Ohio and harbors tick populations. Replace with native alternatives: Ninebark (purple foliage), Fothergilla (fall color), or Virginia Sweetspire."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 66, name: "Fothergilla", botanical: "Fothergilla gardenii / F. major",
    type: "Shrub", height: "36-72 in", width: "36-60 in",
    bloomMonths: [4,5], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.0-6.5", reblooming: false,
    rebloomNote: "Single spring bloom; honey-scented bottle-brush flowers",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Border","Foundation","Woodland","Native Garden"],
    companions: ["Azalea","Hydrangea","Viburnum","Ostrich Fern"],
    yearRound: "Fragrant spring flowers, blue-green summer foliage, SPECTACULAR multicolor fall foliage",
    foliageInterest: "Blue-green summer foliage turns incredible mix of red, orange, gold — often ALL on one leaf",
    cultivars: ["Mount Airy (best fall color)","Blue Shadow (blue foliage, compact)","Legend of the Fall (intense fall color)"],
    fertilizer: "Acidic fertilizer if needed; prefers acidic soil", fertMonth: [4],
    care: {3:"Watch for fragrant flower buds",4:"BLOOM — white bottle-brush flowers, honey-scented, before leaves",5:"Blue-green foliage emerges",6:"Attractive mounded form",7:"Low maintenance",8:"Summer foliage pleasant",9:"Fall color starting — watch for the magic",10:"PEAK — red, orange, gold, often on same leaf. Best fall shrub!",11:"Leaves drop; clean form",12:"Interesting branching pattern"},
    video: "https://www.youtube.com/results?search_query=fothergilla+mount+airy+fall+color+shrub",
    description: "Perhaps the best fall color of any shrub — leaves turn red, orange, AND gold simultaneously, often on the same leaf. Fragrant spring flowers are a bonus. Native alternative to barberry."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 67, name: "Serviceberry", botanical: "Amelanchier spp.",
    type: "Small Tree / Shrub", height: "72-180 in", width: "72-120 in",
    bloomMonths: [3,4], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single early spring bloom; edible blue berries follow",
    attracts: ["Birds","Bees","Butterflies"], nativeOhio: true,
    gardenStyles: ["Native","Woodland","Wildlife Garden","Specimen","Border"],
    companions: ["Understory perennials","Ostrich Fern","Hostas","Wildflowers"],
    yearRound: "White spring flowers, edible berries, orange-red fall color, smooth gray bark in winter",
    foliageInterest: "Emerges bronze-copper, turns green, then brilliant orange-red in fall. Smooth gray bark year-round",
    cultivars: ["Autumn Brilliance (best fall color)","Spring Glory (heavy flowers)","Rainbow Pillar (columnar)","Regent (compact shrub form)"],
    fertilizer: "Compost in spring if desired; low maintenance once established", fertMonth: [4],
    care: {3:"White flower clouds before leaves — one of first spring bloomers!",4:"Bronze new foliage follows flowers",5:"Green berries developing",6:"Berries turning red to blue — EDIBLE (like blueberries!)",7:"Harvest berries before birds eat them all",8:"Green summer foliage; low maintenance",9:"Fall color beginning",10:"Brilliant orange-red fall color",11:"Smooth gray bark visible",12:"Beautiful silvery bark against snow"},
    video: "https://www.youtube.com/results?search_query=amelanchier+serviceberry+native+tree+edible+berries",
    description: "Outstanding native small tree with four-season interest: white spring flowers, edible blueberry-like fruits, brilliant fall color, and elegant gray bark. Birds love the berries."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 68, name: "Witchhazel", botanical: "Hamamelis spp.",
    type: "Shrub / Small Tree", height: "96-180 in", width: "96-180 in",
    bloomMonths: [2,3], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Medium", ph: "5.5-6.5", reblooming: false,
    rebloomNote: "Blooms in WINTER (Feb-March!) — earliest woody plant to bloom",
    attracts: ["Bees (early pollinators)"], nativeOhio: true,
    gardenStyles: ["Winter Garden","Woodland","Specimen","Native","Border"],
    companions: ["Hellebores","Snowdrops","Winter Aconite","Early bulbs"],
    yearRound: "WINTER-BLOOMING fragrant flowers, golden fall color, distinctive vase shape",
    foliageInterest: "Large rounded leaves turn clear golden-yellow in fall. Spider-like fragrant flowers in winter",
    cultivars: ["Arnold Promise (yellow, most popular)","Diane (red)","Jelena (copper-orange)","Vernalis (native, very early)","Aphrodite (red, large)"],
    fertilizer: "Acidic compost; prefers acidic soil", fertMonth: [4],
    care: {1:"Watch for buds swelling",2:"BLOOM — fragrant spider-like flowers in snow/cold!",3:"Bloom continues; some of the only flowers available to early bees",4:"Acidic compost; new foliage",5:"Large green foliage fills in",6:"Attractive vase-shaped form",7:"Summer shade",8:"Low maintenance",9:"Fall color beginning",10:"Clear golden-yellow fall color",11:"Leaves drop; interesting branching",12:"Dormant; handsome winter form"},
    video: "https://www.youtube.com/results?search_query=hamamelis+witchhazel+winter+blooming+shrub",
    description: "Blooms in WINTER — fragrant spider-like flowers open in February/March when everything else is dormant. Native species available. 'Arnold Promise' is the most popular yellow variety."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 69, name: "Dwarf Goat's Beard", botanical: "Aruncus aethusifolius",
    type: "Perennial Flower", height: "8-12 in", width: "12-18 in",
    bloomMonths: [5,6], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single spring bloom; fern-like foliage provides season-long texture",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Edging","Rock Garden","Border"],
    companions: ["Hosta Halcyon","Heuchera","Japanese Painted Fern","Astilbe","Brunnera"],
    yearRound: "Delicate fern-like foliage; creamy flower plumes; red fall color",
    foliageInterest: "Finely cut fern-like foliage; excellent red-orange fall color",
    cultivars: ["Species (compact standard)","Misty Lace (hybrid, larger)","Noble Spirit (compact)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Clean up old foliage",4:"Finely cut foliage emerges; compost",5:"Creamy-white plumes above delicate foliage",6:"Attractive seed heads; foliage remains",7:"Fine-textured foliage",8:"Keep moist",9:"Fall color develops — rich reds",10:"Peak fall color",11:"Cut back after frost"},
    video: "https://www.youtube.com/results?search_query=aruncus+goats+beard+shade+perennial",
    description: "A miniature shade gem with fern-like foliage and creamy plumes. Excellent in the front of shade borders where larger plants would overwhelm. Lovely red fall color."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 70, name: "Japanese Spurge", botanical: "Pachysandra terminalis",
    type: "Groundcover / Evergreen", height: "6-12 in", width: "spreading",
    bloomMonths: [4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Inconspicuous white flowers; grown for evergreen foliage",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Shade Garden","Groundcover","Under Trees","Foundation"],
    companions: ["Spring Bulbs (push through it)","Hostas","Japanese Painted Fern","Trees"],
    yearRound: "EVERGREEN groundcover — green through winter even in Cleveland",
    foliageInterest: "Whorled glossy dark green evergreen foliage year-round; variegated forms available",
    cultivars: ["Green Carpet (classic)","Silver Edge (variegated)","Green Sheen (glossiest)","Allegheny Spurge/Pachysandra procumbens (NATIVE alternative, semi-evergreen)"],
    fertilizer: "Light balanced in spring for established beds", fertMonth: [4],
    care: {1:"Evergreen — green under snow",2:"Green foliage persisting",3:"Clean up any winter damage",4:"Small white fragrant flowers; fertilize",5:"Fresh new growth flushes",6:"Dense green carpet; rarely needs watering once established",7:"Low maintenance",8:"May thin in heavy drought — water if needed",9:"Evergreen",10:"Still green as everything else fades",11:"Evergreen through winter",12:"Green carpet — valuable winter groundcover"},
    video: "https://www.youtube.com/results?search_query=pachysandra+groundcover+shade+care",
    description: "The classic evergreen shade groundcover — stays green year-round in Cleveland. Spreads to form a dense weed-suppressing carpet. Consider native Allegheny Spurge as an alternative."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 71, name: "Hakone Grass", botanical: "Hakonechloa macra 'All Gold'",
    type: "Ornamental Grass", height: "12-18 in", width: "18-24 in",
    bloomMonths: [], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Grown for entirely golden foliage — a shade garden highlight",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Japanese Garden","Shade Garden","Container","Border","Modern"],
    companions: ["Hosta Guacamole","Heuchera","Brunnera","Japanese Painted Fern","Japanese Maple"],
    yearRound: "Brilliant all-gold cascading foliage; dormant in winter",
    foliageInterest: "Entirely GOLD cascading blades — brightens even deep shade. One of the finest shade garden plants",
    cultivars: ["All Gold (entirely gold)","Aureola (gold-striped)","Beni-kaze (green, red fall)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {3:"Clean up dead foliage",4:"Gold growth begins — stunning",5:"Full golden cascade",6:"Keep moist; golden glow intensifies",7:"One of the best shade plants",8:"Water in drought",9:"Gold aging to amber",10:"Amber fall tones",11:"Cut back after frost",12:"Dormant; mark location"},
    video: "https://www.youtube.com/results?search_query=hakonechloa+all+gold+shade+grass+care",
    description: "A living golden waterfall that brightens any shade corner. 'All Gold' is the brightest — entirely chartreuse-gold cascading foliage. Slow to establish but worth every penny.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 72, name: "Sweetspire", botanical: "Clethra alnifolia",
    type: "Shrub", height: "48-72 in", width: "36-60 in",
    bloomMonths: [7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "4.5-6.5", reblooming: false,
    rebloomNote: "Fragrant bottlebrush spikes; attracts many butterflies",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Native","Rain Garden","Shade Garden","Border","Woodland"],
    companions: ["Hydrangea","Ostrich Fern","Viburnum","Virginia Sweetspire","Astilbe"],
    yearRound: "Fragrant summer flowers, golden fall color, attractive suckering colonies",
    foliageInterest: "Glossy dark green foliage turns clear golden-yellow in fall",
    cultivars: ["Hummingbird (compact 3-4 ft)","Ruby Spice (pink flowers)","Sixteen Candles (upright, compact)","Vanilla Spice (large flowers)"],
    fertilizer: "Acidic compost; prefers acidic moist soil", fertMonth: [4],
    care: {3:"Prune to shape if needed",4:"New foliage; acidic compost",5:"Growth; ensure moisture",7:"Fragrant white/pink bottlebrush flowers — heavenly scent!",8:"Bloom continues; butterflies everywhere",9:"Seed capsules; foliage starting to color",10:"Golden fall color",11:"Interesting seed capsules persist",12:"Suckering form; interesting winter silhouette"},
    video: "https://www.youtube.com/results?search_query=clethra+summersweet+native+shrub+fragrant",
    description: "Intensely fragrant white or pink bottlebrush flowers in mid-summer — you can smell it from across the garden. Native, shade-tolerant, and thrives in moist soil. 'Hummingbird' is compact."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 73, name: "Siberian Iris", botanical: "Iris sibirica",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single bloom; elegant grass-like foliage provides long season interest",
    attracts: ["Bees","Butterflies","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Rain Garden","Pond-side","Mass Planting"],
    companions: ["Daylily","Catmint","Peony","Salvia"],
    yearRound: "Elegant grass-like foliage all season; architectural seed pods; golden fall color",
    foliageInterest: "Narrow grass-like upright foliage; golden-tan fall color; ornamental seed pods",
    cultivars: ["Caesar's Brother (dark purple, classic)","Butter and Sugar (bicolor)","Ruffled Velvet (ruffled purple)","Silver Edge (blue, silver edge)","Pink Parfait (pink)"],
    fertilizer: "Light balanced in spring; acidic conditions preferred", fertMonth: [4],
    care: {3:"Grass-like foliage emerging",4:"Rapid growth; light fertilizer",5:"BLOOM — elegant butterfly-like flowers",6:"Flowers fade; attractive seed pods forming",7:"Graceful grass-like foliage",8:"Low maintenance; drought tolerant",9:"Seed pods ornamental; fall color starting",10:"Golden fall foliage",11:"Cut back or leave for winter",12:"Standing foliage can add winter interest"},
    video: "https://www.youtube.com/results?search_query=siberian+iris+care+dividing+varieties",
    description: "More elegant and easier than bearded iris. Graceful butterfly-like flowers above grass-like foliage. Virtually pest and disease free. Adapts from wet to dry conditions."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 74, name: "Winterberry Holly", botanical: "Ilex verticillata",
    type: "Shrub", height: "72-120 in", width: "72-120 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "4.5-6.0", reblooming: false,
    rebloomNote: "Inconspicuous flowers; grown for spectacular winter berries",
    attracts: ["Birds"], nativeOhio: true,
    gardenStyles: ["Native","Winter Garden","Wildlife Garden","Border","Specimen"],
    companions: ["Viburnum","Ninebark","Dogwood","Ostrich Fern"],
    yearRound: "BRILLIANT red berries on bare branches all winter — the best winter-interest plant",
    foliageInterest: "Dark green deciduous foliage; the real show is AFTER leaf drop — covered in bright red berries",
    cultivars: ["Winter Red (heavy fruiting)","Sparkleberry (heavy fruiting)","Berry Poppins (compact 3-4 ft)","Berry Heavy (aptly named)","MUST have male pollinator: 'Southern Gentleman' or 'Jim Dandy'"],
    fertilizer: "Acidic fertilizer in spring; needs acidic soil", fertMonth: [4],
    care: {1:"Red berries stunning in snow — best winter display",2:"Berries persisting; birds start eating",3:"Prune to shape before growth",4:"Acidic fertilizer; new foliage emerging",5:"Inconspicuous flowers (need male plant nearby!)",6:"Green berries developing",7:"Green berries growing",8:"Berries starting to color",9:"Berries turning red",10:"Leaves drop, revealing BRILLIANT red berry display",11:"Berries at peak against bare branches — WOW",12:"Red berries in snow — holiday perfection"},
    video: "https://www.youtube.com/results?search_query=ilex+verticillata+winterberry+holly+native",
    description: "THE must-have plant for winter interest. After leaves drop, branches are covered in brilliant red berries lasting all winter. MUST plant one male variety nearby for berries. Native."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 75, name: "Sedge (Carex)", botanical: "Carex spp.",
    type: "Ornamental Grass-like", height: "6-24 in", width: "12-24 in",
    bloomMonths: [], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Non-flowering ornamental; grown for grass-like foliage",
    attracts: [], nativeOhio: true,
    gardenStyles: ["Shade Garden","Groundcover","Border","Modern","Container","Woodland"],
    companions: ["Hosta Guacamole","Heuchera","Japanese Painted Fern","Brunnera","Astilbe"],
    yearRound: "Many are EVERGREEN or semi-evergreen; fine texture year-round",
    foliageInterest: "Fine arching grass-like foliage in gold, green, bronze, or variegated. Many evergreen/semi-evergreen",
    cultivars: ["EverColor Everest (white-edged, evergreen)","Evergold (gold/green striped)","Ice Dance (white-edged, spreading)","Blue Zinger (blue-green)","Toffee Twist (bronze)","Pennsylvania Sedge/C. pensylvanica (native, lawn alternative)"],
    fertilizer: "Light compost; low maintenance", fertMonth: [4],
    care: {2:"Evergreen types looking good; comb out dead blades",3:"Tidy up; new growth on deciduous types",4:"Compost; growth accelerating",5:"Full arching display",6:"Minimal care; shade tolerant",7:"Low maintenance",8:"Tough through summer",9:"Still attractive",10:"Evergreen types valuable as other plants fade",11:"Evergreen foliage persists",12:"Green through winter — invaluable"},
    video: "https://www.youtube.com/results?search_query=carex+sedge+shade+groundcover+evergreen",
    description: "Grasslike plants for shade with incredible versatility. Many are evergreen in Cleveland. Pennsylvania Sedge is a native lawn alternative for shade. Invaluable texture plants."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 76, name: "Helenium (Sneezeweed)", botanical: "Helenium autumnale",
    type: "Perennial Flower", height: "24-48 in", width: "18-24 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: true,
    rebloomNote: "Deadhead for extended bloom through fall",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Pollinator","Prairie","Border","Cutting Garden"],
    companions: ["Aster","Goldenrod","Joe Pye Weed","Sedum","Switchgrass"],
    yearRound: "Warm-toned fall flowers when garden needs color most",
    foliageInterest: "Upright stems with lance-shaped foliage",
    cultivars: ["Mardi Gras (multicolor)","Salsa (red/orange)","Sahins Early Flowerer (earliest, orange)","Moerheim Beauty (red)","Butterpat (yellow)"],
    fertilizer: "Compost in spring; prefers moist rich soil", fertMonth: [4],
    care: {3:"Cut back old growth",4:"Compost; ensure moisture",5:"Pinch by 1/3 for bushier plants",6:"Stop pinching by late June",8:"BLOOM — warm fall tones",9:"Peak bloom; deadhead for extended show",10:"Final fall flowers",11:"Cut back; divide every 3 years"},
    video: "https://www.youtube.com/results?search_query=helenium+sneezeweed+fall+perennial+garden",
    description: "Native fall-bloomer with warm-toned daisies in red, orange, and gold. Despite the name, it doesn't cause sneezing! Essential for fall color in the perennial border."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 77, name: "Deutzia", botanical: "Deutzia gracilis",
    type: "Shrub", height: "24-48 in", width: "24-48 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Single spring bloom; graceful arching form",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Foundation","Hedge"],
    companions: ["Spirea","Weigela","Catmint","Peony"],
    yearRound: "Graceful arching form; covered in white flowers in spring",
    foliageInterest: "Small lance-shaped foliage on arching branches",
    cultivars: ["Nikko (dwarf, groundcover-like)","Chardonnay Pearls (chartreuse foliage)","Yuki Cherry Blossom (pink)","Yuki Snowflake (white, compact)"],
    fertilizer: "Light balanced after bloom", fertMonth: [6],
    care: {3:"Wait for new growth before pruning",5:"Covered in white flowers — beautiful",6:"Prune after bloom (blooms on old wood); fertilize",7:"Green foliage",8:"Low maintenance",10:"Some fall color",11:"Cleanup"},
    video: "https://www.youtube.com/results?search_query=deutzia+gracilis+compact+shrub+pruning",
    description: "A graceful arching shrub smothered in white or pink flowers in late spring. 'Chardonnay Pearls' offers chartreuse foliage all season. 'Nikko' is a wonderful dwarf groundcover form."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 78, name: "Perennial Sunflower", botanical: "Helianthus 'Lemon Queen'",
    type: "Perennial Flower", height: "48-72 in", width: "36-48 in",
    bloomMonths: [8,9,10], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Extended bloom Aug-Oct; massive pollinator magnet",
    attracts: ["Bees","Butterflies","Birds"], nativeOhio: true,
    gardenStyles: ["Pollinator","Prairie","Cottage","Border (back)","Naturalized"],
    companions: ["Joe Pye Weed","Aster","Goldenrod","Ironweed","Miscanthus"],
    yearRound: "Tall, sunny fall display; seeds for birds in winter",
    foliageInterest: "Large rough-textured leaves on tall stems",
    cultivars: ["Lemon Queen (most popular, pale yellow)","First Light (compact 4 ft)","Maximilian Sunflower (late, tall)","Low Down (dwarf 2 ft)"],
    fertilizer: "None needed; too much causes flopping", fertMonth: [],
    care: {3:"Cut back old stems",5:"Pinch for compact growth",6:"Growth filling in",8:"BLOOM — covered in pale yellow daisies",9:"Peak bloom — bees everywhere",10:"Seeds for birds",11:"Cut back or leave for birds"},
    video: "https://www.youtube.com/results?search_query=helianthus+lemon+queen+perennial+sunflower",
    description: "Perennial sunflower 'Lemon Queen' was called the #1 pollinator plant by Penn State research. Masses of soft yellow flowers Aug-Oct. Incredibly easy and tough. Native."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 79, name: "Creeping Thyme", botanical: "Thymus serpyllum",
    type: "Groundcover / Herb", height: "1-4 in", width: "12-18 in",
    bloomMonths: [6,7], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Single bloom period; fragrant when walked upon",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Stepping Stones","Rock Garden","Edging","Herb Garden","Groundcover"],
    companions: ["Sedum","Dianthus","Creeping Phlox","Spring Bulbs"],
    yearRound: "Semi-evergreen aromatic mat; fragrant when stepped on",
    foliageInterest: "Tiny aromatic leaves form a dense mat; semi-evergreen in Cleveland",
    cultivars: ["Red Creeping Thyme/coccineus (magenta)","Elfin (tiny, very slow)","Pink Chintz (pink)","White Moss (white)","Woolly Thyme (fuzzy silver)"],
    fertilizer: "None needed", fertMonth: [],
    care: {3:"Semi-evergreen mat greening up",4:"Fresh growth spreading",5:"Filling in between pavers/stones",6:"BLOOM — carpet of tiny flowers; bees love it",7:"Flowers fade; aromatic mat",8:"Drought tolerant; no water needed",9:"Still fragrant when stepped on",10:"Foliage persists",11:"Semi-evergreen through winter",12:"May hold some foliage"},
    video: "https://www.youtube.com/results?search_query=creeping+thyme+groundcover+between+pavers",
    description: "A tiny fragrant mat that grows between stepping stones, releasing a wonderful scent when walked upon. Covered in tiny flowers in early summer. Perfect alternative to lawn in sunny areas."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 80, name: "Ironweed", botanical: "Vernonia noveboracensis",
    type: "Perennial Flower", height: "48-84 in", width: "24-36 in",
    bloomMonths: [8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Single intense bloom period; vivid purple",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Native","Prairie","Pollinator","Naturalized","Rain Garden"],
    companions: ["Joe Pye Weed","Goldenrod","Aster","Perennial Sunflower","Switchgrass"],
    yearRound: "Tall structural presence; rusty seed heads in fall/winter",
    foliageInterest: "Dark green lance-shaped leaves on tall, iron-strong stems (hence the name)",
    cultivars: ["Iron Butterfly (compact 3-4 ft)","Summer's Surrender (compact)","Southern Cross (compact hybrid)"],
    fertilizer: "None needed; native tough", fertMonth: [],
    care: {3:"Cut back old stems",5:"Pinch for compact growth",6:"Growth filling in",8:"Vivid purple-violet flowers — nothing else this color!",9:"Peak bloom with goldenrod — stunning combination",10:"Rusty seed heads",11:"Cut back or leave for winter"},
    video: "https://www.youtube.com/results?search_query=vernonia+ironweed+native+garden+purple",
    description: "The most intensely purple native flower — nothing matches its vivid violet color in late summer. Pairs spectacularly with goldenrod's gold. 'Iron Butterfly' fits smaller gardens."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 81, name: "Ornamental Onion - Millenium", botanical: "Allium 'Millenium'",
    type: "Perennial Flower / Bulb", height: "15-20 in", width: "10-15 in",
    bloomMonths: [7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "2018 Perennial Plant of the Year; blooms later than spring alliums",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Border","Edging","Pollinator","Container","Rock Garden"],
    companions: ["Catmint","Salvia","Echinacea","Sedum"],
    yearRound: "Neat clumping grass-like foliage; doesn't die back after bloom like spring alliums",
    foliageInterest: "Glossy green grass-like foliage stays attractive all season — no dieback like other alliums",
    cultivars: ["Millenium (Perennial of Year 2018)","Summer Beauty (similar, lavender)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Clean up; grass-like foliage appears early",4:"Neat clumps fill in",5:"Attractive foliage mounds",6:"Buds developing",7:"BLOOM — rosy-purple globes, butterflies everywhere",8:"Continue blooming; leave seed heads",9:"Attractive seed heads",10:"Foliage yellowing; cut back",11:"Dormant; mark if needed"},
    video: "https://www.youtube.com/results?search_query=allium+millenium+perennial+of+the+year+care",
    description: "Perennial Plant of the Year 2018. Unlike spring alliums, Millenium blooms in mid-summer and keeps its tidy foliage all season. One of the best bee and butterfly plants available."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 82, name: "Itoh Peony", botanical: "Paeonia Itoh hybrids",
    type: "Perennial Flower", height: "24-30 in", width: "30-36 in",
    bloomMonths: [5,6], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.5-7.0", reblooming: false,
    rebloomNote: "Extended bloom with up to 50+ flowers per plant; no staking needed",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Specimen","Cutting Garden","Formal"],
    companions: ["Iris","Catmint","Allium","Baptisia","Salvia"],
    yearRound: "Outstanding foliage mound persists attractively all season; no peony ring needed",
    foliageInterest: "Dark green deeply-cut foliage maintains a beautiful shrub-like mound all season — better than herbaceous peonies",
    cultivars: ["Bartzella (double yellow, most popular)","Cora Louise (white/purple)","Garden Treasure (semi-double yellow)","Scarlet Heaven (red)","Julia Rose (color-shifting)","Singing in the Rain (peach/gold)"],
    fertilizer: "Bone meal/bulb fertilizer in fall; light 5-10-10 spring", fertMonth: [4,10],
    care: {3:"Dark red shoots emerging",4:"Fertilize; no support ring needed",5:"First enormous blooms — 50+ per plant possible",6:"Extended bloom period; deadhead",7:"Outstanding foliage mound",8:"Still attractive as a foliage plant",9:"Foliage remains green",10:"Cut back to ground after frost; fall fertilize with bone meal",11:"Mulch lightly"},
    video: "https://www.youtube.com/results?search_query=itoh+peony+bartzella+care+growing+guide",
    description: "The best of both worlds — tree peony flowers on herbaceous peony plants. Massive blooms (up to 50+ per plant!), strong stems that never need staking, and beautiful foliage all season."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 83, name: "Boxwood", botanical: "Buxus spp.",
    type: "Evergreen Shrub", height: "24-72 in", width: "24-72 in",
    bloomMonths: [], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: false, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.5-7.5", reblooming: false,
    rebloomNote: "Non-flowering; grown for evergreen structure",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Formal","Foundation","Hedge","Border","Container","Topiary"],
    companions: ["Any perennials — boxwood provides structure and backdrop"],
    yearRound: "EVERGREEN structure year-round; backbone of formal and cottage gardens",
    foliageInterest: "Dense small glossy evergreen leaves; can be shaped into hedges, globes, or formal shapes",
    cultivars: ["Green Velvet (very hardy for Cleveland)","Green Mountain (upright)","Sprinter (fast-growing, blight resistant)","Baby Gem (dwarf)","North Star (columnar)","NewGen series (boxwood blight resistant)"],
    fertilizer: "Slow-release evergreen/holly fertilizer in spring", fertMonth: [4],
    care: {1:"Evergreen; protect from drying winter winds with burlap if exposed",2:"Still green; brush off heavy snow",3:"Assess winter damage; don't prune yet",4:"Fertilize with evergreen food; new growth",5:"First trim of year if shaping",6:"Main pruning time; shape as desired",7:"Light touch-up pruning",8:"Water during drought",9:"Stop pruning — new growth won't harden before winter",10:"Evergreen backbone visible as perennials fade",11:"Wind protection if needed; water before ground freezes",12:"Anchor of winter garden"},
    video: "https://www.youtube.com/results?search_query=boxwood+winter+hardy+cleveland+ohio+blight+resistant",
    description: "The evergreen backbone of the garden. Choose blight-resistant and winter-hardy varieties for Cleveland. 'Green Velvet' and 'Sprinter' are excellent choices for zone 6."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 84, name: "Autumn Fern", botanical: "Dryopteris erythrosora",
    type: "Fern", height: "18-24 in", width: "18-24 in",
    bloomMonths: [], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Medium", ph: "5.5-6.5", reblooming: false,
    rebloomNote: "Non-flowering; new fronds emerge coppery-red",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Container"],
    companions: ["Hosta Halcyon","Heuchera","Brunnera","Japanese Painted Fern","Astilbe"],
    yearRound: "Semi-evergreen; new growth emerges striking copper-red",
    foliageInterest: "New fronds are stunning COPPER-RED, maturing to glossy green. Semi-evergreen through Cleveland winters",
    cultivars: ["Brilliance (most common, improved copper color)"],
    fertilizer: "Light compost in spring", fertMonth: [4],
    care: {3:"Semi-evergreen fronds may still be present; cut back tatty ones",4:"NEW fronds emerge COPPER-RED — spectacular",5:"Fronds maturing to glossy green",6:"Rich green display",7:"Occasional new coppery fronds through summer",8:"Drought tolerant for a fern",9:"Still attractive",10:"Semi-evergreen; may hold fronds",11:"Fronds persisting",12:"Semi-evergreen in mild winters"},
    video: "https://www.youtube.com/results?search_query=autumn+fern+dryopteris+erythrosora+shade+garden",
    description: "Unlike most ferns, autumn fern has colorful copper-red new growth and is semi-evergreen. More drought-tolerant than most ferns. The copper-red spring fronds are showstopping."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 85, name: "Perennial Hibiscus - Summerific", botanical: "Hibiscus 'Cranberry Crush'",
    type: "Perennial Flower", height: "36-48 in", width: "48-54 in",
    bloomMonths: [7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Continuous bloom Jul-Sep; dark near-black foliage",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Border","Tropical Look","Specimen","Rain Garden","Cottage"],
    companions: ["Cannas","Joe Pye Weed","Perennial Sunflower"],
    yearRound: "Near-black foliage is stunning even before bloom; dies to ground in winter",
    foliageInterest: "NEAR-BLACK maple-shaped foliage — among the darkest perennial foliage available",
    cultivars: ["Cranberry Crush (dark foliage, red)","Holy Grail (darkest foliage, deep red)","Berry Awesome (dark foliage, huge pink)","Cherry Choco Latte (bicolor!)"],
    fertilizer: "Balanced monthly during active growth", fertMonth: [5,6,7,8],
    care: {3:"Appears dead — DO NOT remove! Very late to emerge",4:"Still dormant — patience!",5:"New dark shoots finally emerge; cut back old stems; fertilize",6:"Rapid growth; dark foliage stunning",7:"Huge flowers begin; fertilize monthly",8:"Peak bloom and foliage",9:"Continue blooming",10:"Frost kills; cut back to ground",11:"Mark location!"},
    video: "https://www.youtube.com/results?search_query=hibiscus+summerific+cranberry+crush+dark+foliage",
    description: "The Summerific series combines near-black foliage with dinner-plate flowers — an absolute showstopper. 'Cranberry Crush' and 'Holy Grail' have the darkest foliage."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 86, name: "St. John's Wort", botanical: "Hypericum spp.",
    type: "Sub-Shrub", height: "12-36 in", width: "18-36 in",
    bloomMonths: [6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false,
    rebloomNote: "Extended bloom June-Aug; ornamental berries follow in red, pink, or white",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Foundation","Mass Planting","Cutting Garden"],
    companions: ["Catmint","Salvia","Sedum","Lavender"],
    yearRound: "Bright yellow summer flowers followed by showy berries in red, pink, peach, or white through fall",
    foliageInterest: "Blue-green to dark green foliage; semi-evergreen in mild winters. Berry display is outstanding",
    cultivars: ["Tricolor (variegated green/pink/cream foliage, red stems — zone 6 with winter protection, sheltered spot)","Sunburst / H. frondosum (native, golden flowers, blue-green foliage, very hardy zone 5-8)","Gemo / H. kalmianum (compact, dense yellow blooms Jun-Sep, native species, very hardy zone 4-7)","Hidcote (semi-evergreen, large golden flowers, zone 5-8, may die back in Cleveland but returns)","H. calycinum (groundcover, largest flowers of any hypericum, zone 6-9, sheltered spot)","Brigadoon (chartreuse-gold foliage, zone 5-9, very hardy)","Magical series (showy berries — zone 6b/7+, may need winter protection in Cleveland 6a areas)"],
    fertilizer: "Light balanced in spring; not heavy feeders", fertMonth: [4],
    care: {3:"Prune to 6-12 inches — blooms on new wood",4:"New growth; light fertilizer",5:"Blue-green foliage filling in",6:"Bright yellow cup-shaped flowers begin",7:"Peak bloom — cheerful yellow",8:"Flowers transitioning to colorful berries",9:"Berry display at peak — stunning cut branches",10:"Berries persist; semi-evergreen foliage",11:"Light cleanup; berries may persist",12:"Semi-evergreen in mild winters"},
    video: "https://www.youtube.com/results?search_query=hypericum+st+johns+wort+shrub+colorful+berries",
    description: "Cheerful yellow flowers in summer followed by ornamental berries. Deer-proof, drought-tolerant, and easy. For Cleveland: 'Sunburst' and 'Gemo' (native species) are the hardiest. 'Tricolor' (variegated) and 'Hidcote' are zone 6 but benefit from a sheltered spot and winter mulch. Magical berry series is marginal in zone 6a — try in protected microclimate."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 87, name: "Agastache (Hyssop)", botanical: "Agastache spp.",
    type: "Perennial Flower", height: "18-48 in", width: "12-24 in",
    bloomMonths: [6,7,8,9,10], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Continuous bloom June-frost without deadheading; one of the longest-blooming perennials",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Pollinator","Border","Container","Herb Garden"],
    companions: ["Echinacea","Salvia","Catmint","Russian Sage","Karl Foerster"],
    yearRound: "Aromatic foliage; long bloom season; tubular flowers loved by hummingbirds",
    foliageInterest: "Aromatic mint-family foliage with anise/licorice scent; gray-green",
    cultivars: ["Blue Fortune (most reliable, lavender-blue, zone 6 hardy)","Kudos series (compact, multiple colors)","Morello (dark pink)","Black Adder (deep blue-violet)","Sunrise series (compact)","Coronado Red (hummingbird magnet)"],
    fertilizer: "None needed; lean soil preferred", fertMonth: [],
    care: {3:"Cut back old stems to ground",4:"New aromatic foliage appears",5:"Growth filling in",6:"Bloom begins — tubular flower spikes",7:"Full bloom; hummingbirds visiting",8:"Continuous bloom without deadheading",9:"Still blooming strong — one of the last to stop",10:"Blooms until hard frost",11:"Cut back; ensure good drainage for winter survival"},
    video: "https://www.youtube.com/results?search_query=agastache+hyssop+blue+fortune+hummingbird+plant",
    description: "One of the longest-blooming, most trouble-free perennials available. Tubular flowers bloom June through frost, attracting hummingbirds and butterflies nonstop. 'Blue Fortune' is the hardiest for zone 6."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 88, name: "Penstemon (Beardtongue)", botanical: "Penstemon digitalis",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [5,6,7], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "5.5-7.5", reblooming: false,
    rebloomNote: "Single bloom period; native; attractive seed heads",
    attracts: ["Hummingbirds","Bees","Butterflies"], nativeOhio: true,
    gardenStyles: ["Pollinator","Native","Cottage","Prairie","Border"],
    companions: ["Echinacea","Baptisia","Catmint","Black-eyed Susan","Fountain Grass"],
    yearRound: "Attractive seed heads; some varieties have dark foliage all season",
    foliageInterest: "'Husker Red' has stunning dark burgundy foliage from spring through fall",
    cultivars: ["Husker Red (dark foliage, white flowers — Perennial of Year 1996)","Dark Towers (dark foliage, pink flowers)","Pocahontas (dark foliage, pink)","Digitalis (native white species)"],
    fertilizer: "None; native, lean soil preferred", fertMonth: [],
    care: {3:"Evergreen/semi-evergreen basal foliage",4:"Dark foliage varieties striking early",5:"Tubular flowers on tall stems — hummingbird favorite",6:"Peak bloom; leave spent stems for seed heads",7:"Attractive seed heads",8:"Low maintenance; drought tolerant",9:"Foliage still colored",10:"Semi-evergreen foliage",11:"May hold some foliage through winter"},
    video: "https://www.youtube.com/results?search_query=penstemon+husker+red+beardtongue+native+perennial",
    description: "Native beardtongue with tubular flowers hummingbirds adore. 'Husker Red' has dramatic dark burgundy foliage all season plus white flowers — Perennial Plant of the Year. Incredibly tough."
,
    planted: [], clevelandCultivars: ["Husker Red", "Dark Towers"], whereToBuy: "Proven Winners", whenAvailable: "May-Jun", clevelandLightNote: "Morning sun with light afternoon sun; avoid deep shade."
  },
  {
    id: 89, name: "Yarrow", botanical: "Achillea millefolium",
    type: "Perennial Flower", height: "18-36 in", width: "18-24 in",
    bloomMonths: [6,7,8,9], sun: "Full Sun", partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: true,
    rebloomNote: "Deadhead for rebloom; flat flower heads age beautifully",
    attracts: ["Butterflies","Bees"], nativeOhio: true,
    gardenStyles: ["Cottage","Prairie","Border","Cutting Garden","Meadow"],
    companions: ["Salvia","Echinacea","Lavender","Catmint","Karl Foerster"],
    yearRound: "Ferny foliage; flat flower heads dry well for arrangements",
    foliageInterest: "Finely divided fern-like aromatic foliage; semi-evergreen",
    cultivars: ["Moonshine (pale yellow, silver foliage — best cultivar)","Paprika (red fading to gold)","Coronation Gold (deep gold, tall)","New Vintage series (compact)","Tutti Frutti series (various colors)","Pomegranate (deep red)"],
    fertilizer: "None; lean soil preferred — rich soil causes flopping", fertMonth: [],
    care: {3:"Semi-evergreen ferny foliage greening up",4:"Growth filling in; divide if spreading too much",5:"Foliage attractive; buds forming",6:"Flat-topped flower clusters appear",7:"Peak bloom; deadhead for rebloom",8:"Rebloom; flowers age attractively",9:"Late flowers; harvest for dried arrangements",10:"Cut back spent stems",11:"Semi-evergreen foliage may persist"},
    video: "https://www.youtube.com/results?search_query=achillea+yarrow+moonshine+perennial+care",
    description: "Flat-topped flower clusters in warm colors above ferny aromatic foliage. Thrives in poor, dry soil — perfect for tough spots. 'Moonshine' with silver foliage and pale yellow flowers is the finest cultivar."
,
    planted: [], clevelandCultivars: ["Moonshine", "Little Moonshine", "Paprika", "Terra Cotta"], whereToBuy: "Proven Winners", whenAvailable: "May-Aug", clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 90, name: "Tall Garden Phlox - Jeana", botanical: "Phlox paniculata 'Jeana'",
    type: "Perennial Flower", height: "36-48 in", width: "24-30 in",
    bloomMonths: [7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Extended single bloom; Mt. Cuba pollinator trial WINNER — #1 most visited by butterflies of any plant tested",
    attracts: ["Butterflies","Hummingbirds","Bees"], nativeOhio: true,
    gardenStyles: ["Pollinator","Cottage","Border","Naturalized"],
    companions: ["Bee Balm","Echinacea","Joe Pye Weed","Aster"],
    yearRound: "Fragrant summer flowers; the single best butterfly plant per research trials",
    foliageInterest: "Dark green upright foliage; excellent mildew resistance",
    cultivars: ["Jeana (THE pollinator phlox — lavender-pink, tiny flowers in huge clusters, outstanding mildew resistance)"],
    fertilizer: "Balanced fertilizer in spring and mid-summer", fertMonth: [5,7],
    care: {3:"Cut back old stems",4:"New growth; thin to 5-6 stems for air flow",5:"Fertilize; mulch",6:"Rapid growth; stake if needed",7:"BLOOM — clouds of tiny lavender flowers; butterflies everywhere. Fertilize",8:"Peak bloom; the most butterfly-visited plant in research trials",9:"Late flowers; allow seed heads",10:"Cut back",11:"Clean up"},
    video: "https://www.youtube.com/results?search_query=phlox+jeana+pollinator+mt+cuba+trial",
    description: "In Mt. Cuba Center's extensive pollinator trials, 'Jeana' phlox was THE most visited plant by butterflies — more than any other species tested. Tiny flowers in huge clusters with excellent mildew resistance. A must for pollinator gardens."
,
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },  {
    id: 91, name: "Eranthis (Winter Aconite)", botanical: "Eranthis hyemalis",
    type: "Bulb", height: "0-6 in", width: "6-12 in",
    bloomMonths: [2,3], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-7.5", reblooming: false,
    rebloomNote: "Early spring ephemeral bulb; foliage disappears by summer",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Rock Garden","Winter Garden"],
    companions: ["Snowdrops","Hellebore","Crocus","Early Daffodils"],
    yearRound: "Early ephemeral blooms in late winter; foliage disappears by mid-summer",
    foliageInterest: "Delicate fern-like foliage briefly before disappearing",
    cultivars: ["Species form (bright yellow cups)"],
    fertilizer: "Compost in fall", fertMonth: [10,11],
    care: {1:"Buds forming under snow",2:"Early golden blooms pierce the snow",3:"Foliage fading as weather warms",4:"Foliage disappearing",5:"Dormant",6:"Dormant underground",7:"Dormant",8:"Dormant",9:"Plant new bulbs if desired",10:"Apply compost around planting area",11:"Winter dormancy",12:"Resting bulbs under ground"},
    video: "https://www.youtube.com/results?search_query=eranthis+winter+aconite+bulb+care",
    description: "The earliest sign of spring with bright yellow buttercup-like flowers that bloom through snow. Plant in groups for best effect. Naturalizes well in undisturbed areas.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 92, name: "Doronicum (Leopard's Bane)", botanical: "Doronicum orientale",
    type: "Perennial Flower", height: "12-18 in", width: "12-18 in",
    bloomMonths: [3,4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Single spring bloom; foliage may scorch in hot summers",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Woodland","Border","Shade Garden","Spring Garden"],
    companions: ["Bleeding Heart","Hellebore","Astilbe","Hostas"],
    yearRound: "Spring blooms; foliage can be undistinguished; may go dormant in heat",
    foliageInterest: "Heart-shaped leaves; may scorch in hot summers",
    cultivars: ["Leopard's Bane (bright yellow daisy-like flowers)","Spring Beauty (semi-double yellow)"],
    fertilizer: "Balanced compost in spring", fertMonth: [4],
    care: {3:"Growth emerging",4:"Blooming yellow daisies",5:"Blooms fading",6:"Post-bloom foliage may decline in heat",7:"Dormant in heat",8:"May remain dormant in hot summers",9:"May return in cool fall",10:"Water if present",11:"Prepare for dormancy",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=doronicum+leopard's+bane+spring+bulb+care",
    description: "Early spring daisy-like golden blooms. Bright and cheerful in woodland settings. Prefers cool, moist conditions and may go dormant in heat.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 93, name: "Viola", botanical: "Viola spp.",
    type: "Perennial Flower", height: "12-24 in", width: "12-24 in",
    bloomMonths: [3,4,5,6,7,8,9], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Reblooms with deadheading and cool weather; may slow in peak summer heat",
    attracts: ["Bees","Butterflies"], nativeOhio: true,
    gardenStyles: ["Shade Garden","Cottage","Border","Wildflower"],
    companions: ["Hellebore","Brunnera","Japanese Painted Fern","Hostas"],
    yearRound: "Flowers spring through fall with cool season preference",
    foliageInterest: "Heart-shaped green foliage; some bronze foliage varieties",
    cultivars: ["Viola labradorica (purple-veined leaves)","Sweet Violet (fragrant)","Viola cornuta hybrids"],
    fertilizer: "Light balanced fertilizer", fertMonth: [4,8],
    care: {3:"Blooming begins",4:"Peak spring bloom",5:"Blooming continues",6:"Slow in peak heat",7:"Dormant in heat; water regularly",8:"Resume blooming with cooler nights",9:"Rebloom peaks",10:"Continues blooming",11:"Blooms may persist",12:"Winter dormancy"},
    video: "https://www.youtube.com/results?search_query=viola+perennial+shade+garden+care",
    description: "Delicate purple and blue flowers blooming in spring and fall. Native violets naturalize well in woodlands and shade gardens.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 94, name: "Bergenia (Heartleaf Bergenia)", botanical: "Bergenia cordifolia",
    type: "Perennial Foliage", height: "12-18 in", width: "18-24 in",
    bloomMonths: [3,4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Single spring bloom; leaves have excellent winter color",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Groundcover","Border","Woodland"],
    companions: ["Hellebore","Hostas","Brunnera","Bleeding Heart"],
    yearRound: "Evergreen glossy foliage; leaves turn mahogany-red in winter; early spring pink flowers",
    foliageInterest: "Large, cabbage-like glossy green leaves turning burgundy-red in cold weather",
    cultivars: ["Bergenia cordifolia (pink flowers, purple winter leaves)","Bressingham Ruby (deep red winter color)"],
    fertilizer: "Compost in spring", fertMonth: [4],
    care: {3:"Pink flower spikes emerging through red foliage",4:"Peak bloom and new growth",5:"Blooms fading; new bright green foliage",6:"Establishment and watering important",7:"Low maintenance; water in drought",8:"Summer dormancy",9:"Foliage beginning color change",10:"Fall color intensifying",11:"Winter red color peaks",12:"Winter architectural interest"},
    video: "https://www.youtube.com/results?search_query=bergenia+heartleaf+shade+garden+winter+color",
    description: "Bold, architectural evergreen foliage with dramatic winter color — turning deep mahogany-red. Pink spring flowers on sturdy stems. Excellent for structure and year-round interest.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 95, name: "Arabis (Rock Cress)", botanical: "Arabis spp.",
    type: "Perennial Flower", height: "6-12 in", width: "12-18 in",
    bloomMonths: [3,4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-8.0", reblooming: false,
    rebloomNote: "Spring-only blooming; quick, vibrant display",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Rock Garden","Border","Groundcover","Edging"],
    companions: ["Creeping Phlox","Sedum","Dianthus","Rock Garden Plants"],
    yearRound: "Early spring bloom; gray-green evergreen foliage year-round",
    foliageInterest: "Fine-textured gray-green evergreen foliage forms neat mats",
    cultivars: ["Snowcap (pure white, double flowers)","Spring Charm (pink double flowers)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Bloom beginning",4:"Peak bloom with white flower clouds",5:"Blooms fading",6:"Neat foliage mats",7:"Low maintenance; drought tolerant",8:"Heat tolerant once established",9:"Low maintenance",10:"Trim lightly if overgrown",11:"Evergreen foliage interest",12:"Winter protection in wet areas"},
    video: "https://www.youtube.com/results?search_query=arabis+rock+cress+spring+perennial+care",
    description: "Cascading clouds of white or pink flowers in spring. Perfect for edging and rock gardens. Evergreen foliage and drought tolerance make it low-maintenance.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 96, name: "Primula (Primrose)", botanical: "Primula spp.",
    type: "Perennial Flower", height: "6-12 in", width: "12-18 in",
    bloomMonths: [3,4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-6.5", reblooming: false,
    rebloomNote: "Early spring bloomer; most reliable with consistent moisture",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Cottage","Border"],
    companions: ["Bleeding Heart","Brunnera","Hellebore","Japanese Painted Fern"],
    yearRound: "Spring flowers; foliage can remain through summer with moisture and shade",
    foliageInterest: "Rosettes of crinkled green leaves",
    cultivars: ["Primula vulgaris (Common Primrose in various colors)","Primula veris (Cowslip)","Primula x polyantha (hybrid colors)"],
    fertilizer: "Balanced fertilizer in spring; compost for moisture", fertMonth: [4],
    care: {3:"Buds forming",4:"Peak bloom with bright colors",5:"Flowers persisting",6:"Consistent moisture important; foliage can yellow in heat",7:"May go semi-dormant in heat",8:"Keep moist in shade",9:"Can rebloom with cool weather and moisture",10:"Decline as frost approaches",11:"Winter dormancy",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=primrose+primula+spring+perennial+shade+care",
    description: "Cheerful early spring flowers in vibrant colors. Thrives in cool, moist shade. Best in woodland gardens where moisture is reliable.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 97, name: "Pulmonaria (Lungwort)", botanical: "Pulmonaria spp.",
    type: "Perennial Flower", height: "12-18 in", width: "18-24 in",
    bloomMonths: [3,4,5], sun: "Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Early spring bloomer; flowers change color as they age",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Groundcover"],
    companions: ["Hellebore","Brunnera","Hostas","Bleeding Heart"],
    yearRound: "Early spring bloom; foliage provides 12-month interest with excellent disease resistance",
    foliageInterest: "Silver-spotted or solid green leaves; some varieties have excellent red fall color",
    cultivars: ["Pulmonaria 'Opal' (blue-pink flowers, green leaves)","Pulmonaria 'Saccharata' (pink flowers, heavily spotted leaves)","Pulmonaria 'Bowles Red' (red flowers, red-tinted leaves)"],
    fertilizer: "Compost in spring; avoid high nitrogen", fertMonth: [4],
    care: {3:"Bloom emerging through spotty foliage",4:"Peak bloom with pink-to-blue transition",5:"Blooms fading; foliage emerging",6:"Mildew prevention with good air flow",7:"Low maintenance; water consistently",8:"Watch for mildew in humid areas",9:"Foliage remains attractive",10:"Foliage can show red color",11:"Foliage persists",12:"Evergreen interest"},
    video: "https://www.youtube.com/results?search_query=pulmonaria+lungwort+shade+perennial+care",
    description: "Early spring flowers that age from pink to blue. Spotted or solid foliage provides long-season interest. One of the best shade perennials for disease-free beauty.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 98, name: "Iberis (Candytuft)", botanical: "Iberis spp.",
    type: "Perennial Flower", height: "6-12 in", width: "12-18 in",
    bloomMonths: [3,4,5], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Spring-only bloomer; some may rebloom in fall if deadheaded",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Rock Garden","Border","Edging","Groundcover"],
    companions: ["Creeping Phlox","Rock Garden Plants","Sedum","Dianthus"],
    yearRound: "Spring flowers; evergreen foliage provides winter structure",
    foliageInterest: "Evergreen narrow foliage forms neat compact mounds",
    cultivars: ["Iberis sempervirens (white domed flowers)","Snowflake (pure white, large flowers)","Autumn Snow (potential fall rebloom)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Bloom emerging",4:"Peak bloom with pure white flower clusters",5:"Blooms fading",6:"Trim lightly after bloom",7:"Low maintenance",8:"Heat and drought tolerant",9:"Appears evergreen",10:"Trim if needed to maintain shape",11:"Evergreen structure",12:"Winter interest"},
    video: "https://www.youtube.com/results?search_query=iberis+candytuft+spring+perennial+evergreen+care",
    description: "Brilliant white domed flower clusters in spring. Evergreen fine-textured foliage. Perfect edging plant and rock garden specimen. Very low maintenance.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 99, name: "Aquilegia (Columbine)", botanical: "Aquilegia spp.",
    type: "Perennial Flower", height: "18-24 in", width: "12-18 in",
    bloomMonths: [4,5,6], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Spring bloomer; deadheading prevents prolific self-seeding",
    attracts: ["Hummingbirds","Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Woodland","Border","Shade Garden"],
    companions: ["Bleeding Heart","Hostas","Brunnera","Coral Bells"],
    yearRound: "Delicate spring flowers; attractive foliage much of season; readily self-seeds",
    foliageInterest: "Attractive finely divided blue-green foliage",
    cultivars: ["Songbird Series (mix of colors, long spurs)","McKana Giants (large flowers, long spurs)","Earlybird (early blooming, red/yellow)","Nora Barlow (double flowers, various colors)"],
    fertilizer: "Balanced fertilizer in spring", fertMonth: [4,5],
    care: {3:"Growth emerging",4:"Buds swelling",5:"Peak bloom with spurred flowers",6:"Blooms persisting; deadhead or allow seed",7:"Allow seeds to drop for self-seeding",8:"Self-seeded seedlings appear",9:"Foliage may decline in heat",10:"Foliage fading",11:"Cut back or leave for structure",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=columbine+aquilegia+hummingbird+shade+care",
    description: "Graceful spurred flowers in jewel tones attract hummingbirds and pollinators. Self-seeds readily to naturalize. Elegant foliage adds garden interest.",
    planted: [], clevelandCultivars: ["Songbird Series", "McKana Giants", "Earlybird Red/Yellow"], whereToBuy: "Vigoro", whenAvailable: "Apr-May", clevelandLightNote: ""
  },
  {
    id: 100, name: "Campanula (Bellflower)", botanical: "Campanula spp.",
    type: "Perennial Flower", height: "12-18 in", width: "12-18 in",
    bloomMonths: [5,6,7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Deadheading encourages extended bloom and some rebloom",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Border","Rock Garden","Cottage","Woodland"],
    companions: ["Dianthus","Coreopsis","Hardy Geranium","Sedums"],
    yearRound: "Summer flowers with good rebloom; attractive foliage",
    foliageInterest: "Neat green foliage clumps; some varieties evergreen",
    cultivars: ["Blue Clips (bright blue, compact)","Takion Blue (lavender-blue, dwarf)","White Clips (white form)"],
    fertilizer: "Light balanced fertilizer", fertMonth: [5,7],
    care: {3:"Growth emerging",4:"Growth filling in; prepare supports",5:"Bloom beginning",6:"Peak bloom with delicate bell flowers; deadhead",7:"Rebloom with deadheading",8:"Late summer rebloom; moderate water",9:"Blooms decline",10:"Cut back after frost",11:"Prepare for dormancy",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=campanula+bellflower+perennial+shade+care",
    description: "Delicate bell-shaped flowers in blue and white. Compact and tidy plants. Long bloom season with deadheading.",
    planted: [], clevelandCultivars: ["Blue Clips", "Takion Blue"], whereToBuy: "Vigoro; Proven Winners", whenAvailable: "May-Jul", clevelandLightNote: ""
  },
  {
    id: 101, name: "Dicentra eximia (Fern-leaf Bleeding Heart)", botanical: "Dicentra eximia",
    type: "Perennial Flower", height: "12-18 in", width: "18-24 in",
    bloomMonths: [5,6,7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Reblooms continuously in cool weather; may slow in peak heat",
    attracts: ["Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Cottage"],
    companions: ["Hostas","Brunnera","Hellebore","Japanese Painted Fern"],
    yearRound: "Fern-like foliage provides texture spring through fall; heart-shaped flowers much of season",
    foliageInterest: "Delicate fern-like blue-green foliage; semi-evergreen in mild winters",
    cultivars: ["Luxuriant (pink flowers, long bloom)","King of Hearts (pink flowers, gray foliage)"],
    fertilizer: "Compost in spring and summer", fertMonth: [4,6],
    care: {3:"Delicate fern-like foliage emerging",4:"Growth filling in",5:"Bloom beginning",6:"Peak bloom with pink heart flowers; rebloom with deadheading",7:"Continuous bloom if deadheaded; keep moist",8:"Rebloom in cool shade; water consistently",9:"Blooms may continue into fall",10:"Foliage declining",11:"Cut back or leave structure",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=dicentra+fern+leaf+bleeding+heart+shade+care",
    description: "Ferny foliage with delicate pink heart-shaped flowers all season. Longest blooming bleeding heart. Thrives in cool shade.",
    planted: [], clevelandCultivars: ["Luxuriant", "King of Hearts"], whereToBuy: "Regional grower", whenAvailable: "Apr-Jun", clevelandLightNote: ""
  },
  {
    id: 102, name: "Centranthus (Red Valerian)", botanical: "Centranthus ruber",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "7.0-8.5", reblooming: false,
    rebloomNote: "Long single bloom period; may reseed for continuous flowers",
    attracts: ["Butterflies","Bees","Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Naturalized","Pollinator"],
    companions: ["Catmint","Russian Sage","Sedum"],
    yearRound: "Summer blooms with peppery-scented pink or red flowers",
    foliageInterest: "Gray-green foliage with slight blue cast",
    cultivars: ["Centranthus ruber (red flowers)","Albus (white flowers)","Coccineus (deep red flowers)"],
    fertilizer: "None; poor soil preferred", fertMonth: [],
    care: {3:"New growth emerging from base",4:"Growth filling in",5:"Bloom beginning",6:"Peak bloom with fragrant rose-red flower clusters",7:"Blooms persist; reseed for continuous flowers",8:"Deadhead or allow reseeding",9:"Late flowers; allow seeds for next year",10:"Cut back if overgrown",11:"Prepare for dormancy",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=centranthus+red+valerian+cottage+garden+care",
    description: "Fragrant rose-red flower clusters attracting butterflies and hummingbirds. Thrives in poor, dry soil. Highly ornamental and easy.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 103, name: "Physostegia (Obedient Plant)", botanical: "Physostegia virginiana",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [5,6,7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Single summer bloom; long flower spires",
    attracts: ["Bees","Butterflies","Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Cottage","Border","Pollinator","Naturalized"],
    companions: ["Bee Balm","Coneflower","Daylily"],
    yearRound: "Tall vertical pink flowers mid to late summer",
    foliageInterest: "Narrow lance-shaped green foliage on upright stems",
    cultivars: ["Miss Manners (shorter, less aggressive, pink)","Vivid (bright pink flowers)","Summer Snow (white flowers)"],
    fertilizer: "Balanced fertilizer in spring", fertMonth: [5],
    care: {3:"Dormant or emerging",4:"Growth beginning",5:"Stems filling in; stake tall varieties",6:"Growth and early buds",7:"Peak bloom with pink flower spires",8:"Bloom continues; deadhead for tidiness",9:"Late flowers declining",10:"Cut back after frost",11:"Clean up or leave structure",12:"Dormant; spreads underground"},
    video: "https://www.youtube.com/results?search_query=physostegia+obedient+plant+native+perennial+care",
    description: "Native pink flower spikes attract hummingbirds and butterflies. Flowers move when gently bent (hence 'obedient'). Can be aggressive; containment advised.",
    planted: [], clevelandCultivars: ["Miss Manners", "Vivid"], whereToBuy: "Regional grower (Petitti/Bremec)", whenAvailable: "Jun-Aug", clevelandLightNote: ""
  },
  {
    id: 104, name: "Tradescantia (Spiderwort)", botanical: "Tradescantia virginiana",
    type: "Perennial Flower", height: "18-24 in", width: "18-24 in",
    bloomMonths: [5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Single bloom period; deadheading may encourage sparse secondary bloom",
    attracts: ["Bees","Butterflies"], nativeOhio: true,
    gardenStyles: ["Woodland","Border","Native Garden","Cottage"],
    companions: ["Brunnera","Hostas","Coral Bells","Autumn Fern"],
    yearRound: "Delicate three-petaled flowers in blue, pink, or red; native perennial",
    foliageInterest: "Long arching strap-like foliage; some cultivars with variegation",
    cultivars: ["Sweet Kate (pink flowers, golden foliage)","Concord Grape (deep purple flowers)","Blue Stone (deep blue)"],
    fertilizer: "Light balanced fertilizer", fertMonth: [5],
    care: {3:"Long foliage emerging",4:"Growth filling in",5:"Bloom beginning",6:"Peak bloom with delicate three-petaled flowers; deadhead to tidy",7:"Blooms persist; foliage remains attractive",8:"Summer dormancy common; foliage yellowing",9:"Can resprout with moisture and cool weather",10:"Foliage declining",11:"Cut back or leave",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=tradescantia+spiderwort+native+perennial+shade+care",
    description: "Native spiderwort with delicate three-petaled flowers opening in morning. Unusual variegated and golden foliage cultivars add season-long color.",
    planted: [], clevelandCultivars: ["Sweet Kate", "Concord Grape"], whereToBuy: "Regional grower", whenAvailable: "May-Jul", clevelandLightNote: ""
  },
  {
    id: 105, name: "Armeria (Sea Thrift)", botanical: "Armeria maritima",
    type: "Perennial Flower", height: "6-12 in", width: "12-18 in",
    bloomMonths: [5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: true,
    rebloomNote: "Deadheading encourages extended bloom",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Rock Garden","Border","Edging","Alpine"],
    companions: ["Dianthus","Creeping Phlox","Sedum","Rock Garden Plants"],
    yearRound: "Compact ball-shaped flower clusters on stiff stems",
    foliageInterest: "Fine evergreen grass-like foliage forming tight mounds",
    cultivars: ["Rubrifolia (deep red flowers)","Splendens (bright pink)","Ballerina Series (pink, white, red forms)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Evergreen foliage visible",4:"Bloom beginning",5:"Peak bloom with pompom flower balls on wiry stems",6:"Continued bloom with deadheading",7:"Deadhead to extend season",8:"Low maintenance; drought tolerant",9:"Trim if needed",10:"Evergreen interest",11:"Evergreen structure",12:"Winter dormancy or growth"},
    video: "https://www.youtube.com/results?search_query=armeria+sea+thrift+rock+garden+perennial+care",
    description: "Ball-shaped flowers on stiff stems above evergreen grass-like foliage. Perfect for edging and rock gardens. Very tough and drought tolerant.",
    planted: [], clevelandCultivars: ["Rubrifolia", "Splendens", "Ballerina Series"], whereToBuy: "Monrovia", whenAvailable: "Apr-Jun", clevelandLightNote: ""
  },
  {
    id: 106, name: "Oenothera (Evening Primrose)", botanical: "Oenothera spp.",
    type: "Perennial Flower", height: "6-12 in", width: "12-18 in",
    bloomMonths: [5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Long single bloom period; bright flowers",
    attracts: ["Bees","Butterflies","Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Rock Garden","Border","Naturalized","Pollinator"],
    companions: ["Catmint","Sedums","Dianthus","Coreopsis"],
    yearRound: "Bright yellow or pink flowers on low spreading plants",
    foliageInterest: "Fine textured foliage; some varieties with reddish tones",
    cultivars: ["Lemon Drop (bright yellow flowers)","Siskiyou (pink flowers, more compact)"],
    fertilizer: "None; poor soil preferred", fertMonth: [],
    care: {3:"Low growth visible",4:"Growth emerging; starts to bloom",5:"Bloom building",6:"Peak bloom with bright yellow evening primrose flowers",7:"Continuous bloom; drought tolerant",8:"Heat and drought tolerant",9:"Blooms may continue",10:"Trim back if overgrown",11:"Prepare for dormancy",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=oenothera+evening+primrose+native+perennial+care",
    description: "Bright yellow or pink flowers on low, spreading plants. Native species available. Extremely drought and heat tolerant. Attracts pollinators.",
    planted: [], clevelandCultivars: ["Lemon Drop", "Siskiyou"], whereToBuy: "Monrovia", whenAvailable: "May-Jun", clevelandLightNote: ""
  },
  {
    id: 107, name: "Astrantia (Masterwort)", botanical: "Astrantia major",
    type: "Perennial Flower", height: "18-24 in", width: "18-24 in",
    bloomMonths: [6,7,8,9], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Deadheading encourages extended bloom into fall",
    attracts: ["Bees","Butterflies","Beneficial Insects"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Cut Flowers","Pollinator"],
    companions: ["Catmint","Salvia","Daylily"],
    yearRound: "Intricate star-shaped flower clusters; excellent for cutting",
    foliageInterest: "Palmate deeply lobed green foliage",
    cultivars: ["Roma (pink flowers)","Star of Billion (pink with white bracts)","Masterpiece (deep burgundy)"],
    fertilizer: "Balanced fertilizer in spring", fertMonth: [5],
    care: {3:"Growth emerging",4:"Growth filling in; stake if needed",5:"Buds forming",6:"Bloom beginning with star-shaped clusters",7:"Peak bloom; excellent for cut flowers; deadhead",8:"Continued bloom with deadheading",9:"Rebloom with cool weather",10:"Late flowers; allow some seed",11:"Cut back after frost",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=astrantia+masterwort+cottage+garden+perennial+care",
    description: "Intricate star-shaped flower clusters in pink, white, and burgundy. Excellent for cutting. Long bloom season with deadheading. Sophisticated garden presence.",
    planted: [], clevelandCultivars: ["Roma", "Star of Billion", "Masterpiece"], whereToBuy: "Monrovia (limited)", whenAvailable: "May-Jul", clevelandLightNote: ""
  },
  {
    id: 108, name: "Heliopsis (Perennial Sunflower)", botanical: "Heliopsis helianthoides",
    type: "Perennial Flower", height: "36-48 in", width: "18-24 in",
    bloomMonths: [6,7,8], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Long single summer bloom; heavy flowering",
    attracts: ["Butterflies","Bees","Birds"], nativeOhio: true,
    gardenStyles: ["Cottage","Pollinator","Border","Naturalized"],
    companions: ["Black-eyed Susan","Echinacea","Sedum"],
    yearRound: "Golden sunflower-like flowers on tall stems; seeds for birds",
    foliageInterest: "Dense green foliage on sturdy upright stems",
    cultivars: ["Heliopsis helianthoides (species with single flowers)","Double blooms available"],
    fertilizer: "Light fertilizer in spring", fertMonth: [5],
    care: {3:"New growth from base",4:"Stems filling in",5:"Growth continues; stake if needed",6:"Buds forming",7:"Peak bloom with golden sunflower-like flowers",8:"Continued heavy bloom",9:"Late flowers",10:"Cut back after frost",11:"Clean up or leave for birds",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=heliopsis+perennial+sunflower+native+care",
    description: "Native perennial sunflower-like blooms on tall stems. Prolific and easy to grow. Seeds feed birds into winter. Thrives in hot, sunny sites.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 109, name: "Sidalcea (Prairie Mallow)", botanical: "Sidalcea malviflora",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [6,7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Long summer bloom; deadheading may extend season slightly",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Pollinator","Prairie"],
    companions: ["Catmint","Salvia","Coreopsis"],
    yearRound: "Tall spikes of pink hollyhock-like flowers",
    foliageInterest: "Palmate lobed foliage; mallow-like leaves",
    cultivars: ["Party Girl (pink flowers, compact)","Elsie Heugh (pink flowers, tall)"],
    fertilizer: "Balanced fertilizer in spring", fertMonth: [5],
    care: {3:"Dormant or emerging",4:"Growth filling in; stake tall varieties",5:"Growth continues",6:"Bloom beginning",7:"Peak bloom with tall pink flower spikes",8:"Continued bloom; deadhead for tidiness",9:"Blooms fade in heat",10:"Cut back after frost",11:"Clean up",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=sidalcea+prairie+mallow+perennial+care",
    description: "Tall spikes of pink hollyhock-like flowers. Long bloom period in summer. Attracts pollinators. Prefers consistent moisture.",
    planted: [], clevelandCultivars: ["Party Girl", "Elsie Heugh"], whereToBuy: "Regional grower", whenAvailable: "May-Jul", clevelandLightNote: ""
  },
  {
    id: 110, name: "Verbascum (Mullein)", botanical: "Verbascum spp.",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [6,7,8,9,10], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-8.0", reblooming: false,
    rebloomNote: "Long extended bloom from early summer to frost",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Biennial","Pollinator"],
    companions: ["Catmint","Salvia","Sedum"],
    yearRound: "Tall spikes of flowers opening from bottom up",
    foliageInterest: "Felty gray-green rosette foliage; architectural presence",
    cultivars: ["Southern Charm (apricot-yellow flowers)","Jackie in Yellow (bright yellow)","White Mullein (pure white)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Rosette foliage visible",4:"Growth beginning",5:"Stems filling in; stake if needed",6:"Bloom beginning",7:"Peak bloom with tall flower spikes opening upward",8:"Continued bloom with flowers opening gradually",9:"Extended bloom into fall",10:"Late flowers continue",11:"Allow seed for next year or remove",12:"Dormant or biennial seedlings"},
    video: "https://www.youtube.com/results?search_query=verbascum+mullein+tall+perennial+garden+care",
    description: "Towering spikes with flowers opening progressively up the stem. Long bloom season from summer through frost. Dramatic garden presence. Drought and heat tolerant.",
    planted: [], clevelandCultivars: ["Southern Charm", "Jackie in Yellow"], whereToBuy: "Monrovia", whenAvailable: "May-Jul", clevelandLightNote: ""
  },
  {
    id: 111, name: "Tanacetum (Feverfew)", botanical: "Tanacetum spp.",
    type: "Perennial Flower", height: "18-24 in", width: "12-18 in",
    bloomMonths: [6,7,8,9,10], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Prolific self-seeder; deadheading prevents excessive volunteers",
    attracts: ["Butterflies","Bees","Beneficial Insects"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Cut Flowers","Herb"],
    companions: ["Catmint","Salvia","Coreopsis"],
    yearRound: "Profuse white or yellow daisy-like flowers late season; medicinal herb",
    foliageInterest: "Finely divided ferny aromatic foliage",
    cultivars: ["Tetra White (double white flowers)","Golden Ball (yellow button flowers)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Growth emerging",4:"Foliage filling in",5:"Growth continues",6:"Bloom beginning",7:"Bloom building",8:"Peak bloom with masses of daisy flowers",9:"Continued prolific bloom",10:"Blooms continue into frost",11:"Allow seed or deadhead",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=tanacetum+feverfew+perennial+care",
    description: "Masses of daisy-like flowers from summer through frost. Aromatic foliage used medicinally. Excellent for cutting. Prolific self-seeder.",
    planted: [], clevelandCultivars: ["Tetra White", "Golden Ball"], whereToBuy: "Vigoro", whenAvailable: "May-Aug", clevelandLightNote: ""
  },
  {
    id: 112, name: "Scabiosa (Pincushion Flower)", botanical: "Scabiosa spp.",
    type: "Perennial Flower", height: "12-18 in", width: "12-18 in",
    bloomMonths: [6,7,8,9], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.5-8.0", reblooming: true,
    rebloomNote: "Deadheading encourages continuous bloom through frost",
    attracts: ["Butterflies","Bees","Beneficial Insects"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Cut Flowers","Pollinator"],
    companions: ["Coreopsis","Dianthus","Catmint"],
    yearRound: "Delicate pincushion flower heads on wiry stems; excellent for cutting",
    foliageInterest: "Fine-textured foliage on wiry stems",
    cultivars: ["Butterfly Blue (lavender-blue, reblooming)","Pink Mist (pink flowers)","Giga Blue (large deep blue)"],
    fertilizer: "Light balanced fertilizer", fertMonth: [5],
    care: {3:"New growth",4:"Growth filling in",5:"Buds appearing",6:"Bloom beginning",7:"Peak bloom with delicate pincushion flowers; deadhead for rebloom",8:"Continued bloom with deadheading",9:"Rebloom continues into fall",10:"Late flowers persist",11:"Cut back after frost",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=scabiosa+pincushion+flower+butterfly+garden+care",
    description: "Delicate pincushion-shaped flowers on wiry stems attract butterflies and bees. Excellent for cutting. Long bloom season with deadheading.",
    planted: [], clevelandCultivars: ["Butterfly Blue", "Pink Mist", "Giga Blue"], whereToBuy: "Vigoro", whenAvailable: "May-Aug", clevelandLightNote: ""
  },
  {
    id: 113, name: "Stokesia (Stokes Aster)", botanical: "Stokesia laevis",
    type: "Perennial Flower", height: "12-18 in", width: "12-18 in",
    bloomMonths: [6,7,8], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Long single bloom period; cornflower-like flowers",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Border","Cut Flowers","Cottage","Pollinator"],
    companions: ["Coreopsis","Dianthus","Catmint","Sedum"],
    yearRound: "Large cornflower-like blue or pink flowers on sturdy stems",
    foliageInterest: "Semi-evergreen rosette foliage",
    cultivars: ["Blue Danube (deep blue flowers)","Peachie's Pick (peach-pink flowers)","Purple Petticoat (purple)"],
    fertilizer: "Light balanced fertilizer", fertMonth: [5],
    care: {3:"Semi-evergreen foliage visible",4:"Growth emerging",5:"Growth building",6:"Buds forming",7:"Peak bloom with large cornflower-like blooms; deadhead for tidiness",8:"Blooms continue; low water needed once established",9:"Blooms declining in heat",10:"Trim back; reduce watering",11:"Prepare for dormancy",12:"Dormant with semi-evergreen foliage"},
    video: "https://www.youtube.com/results?search_query=stokesia+stokes+aster+perennial+care",
    description: "Large cornflower-like blooms on sturdy stems. Native to Southeast; heat and drought tolerant. Long summer bloom. Semi-evergreen.",
    planted: [], clevelandCultivars: ["Blue Danube", "Peachie's Pick"], whereToBuy: "Regional grower", whenAvailable: "Jun-Aug", clevelandLightNote: ""
  },
  {
    id: 114, name: "Gaura (Whirling Butterflies)", botanical: "Gaura lindheimeri",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Long extended bloom from summer to frost",
    attracts: ["Butterflies","Hummingbirds","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Naturalized","Pollinator"],
    companions: ["Salvia","Russian Sage","Sedum"],
    yearRound: "Airy spikes with small pink and white flowers; butterfly magnet",
    foliageInterest: "Fine-textured foliage on spreading mounding form",
    cultivars: ["Whiskers Deep Rose (deep pink flowers)","Siskiyou Pink (pink flowers, compact)","Karalee White (white flowers)"],
    fertilizer: "None; lean soil preferred", fertMonth: [],
    care: {3:"Emerging from base",4:"Growth visible",5:"Growth filling in; stake if needed",6:"Bloom beginning",7:"Peak bloom with delicate pink flower spikes on airy stems",8:"Continued bloom; very drought tolerant",9:"Extended bloom into fall",10:"Late flowers persist",11:"Cut back after frost",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=gaura+whirling+butterflies+perennial+care",
    description: "Delicate pink and white flowers on airy stems dance in the slightest breeze ('whirling butterflies'). Extreme heat and drought tolerance. Butterfly magnet.",
    planted: [], clevelandCultivars: ["Whiskers Deep Rose", "Siskiyou Pink"], whereToBuy: "Monrovia", whenAvailable: "May-Aug", clevelandLightNote: ""
  },
  {
    id: 115, name: "Kniphofia (Red Hot Poker)", botanical: "Kniphofia spp.",
    type: "Perennial Flower", height: "24-36 in", width: "18-24 in",
    bloomMonths: [6,7,8,9], sun: "Full Sun", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Long single bloom period; dramatic flower spikes",
    attracts: ["Hummingbirds","Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Tropical","Pollinator"],
    companions: ["Salvia","Russian Sage","Black-eyed Susan","Karl Foerster"],
    yearRound: "Dramatic tubular flower spikes in warm colors; tropical presence",
    foliageInterest: "Tall upright grass-like foliage; evergreen in mild winters",
    cultivars: ["Papaya Popsicle (coral-orange blend)","Flamenco (red and orange blend)","Mango Popsicle (orange-yellow)","Torchbearer (red flowers)"],
    fertilizer: "Balanced fertilizer in spring", fertMonth: [5],
    care: {3:"Semi-evergreen foliage visible",4:"Growth emerging; divide crowns if large",5:"Growth filling in",6:"Buds forming",7:"Peak bloom with dramatic tubular flower spikes; hummingbirds visit",8:"Continued bloom; deadhead spent spikes",9:"Extended bloom into fall; deadhead",10:"Reduce watering for winter hardiness",11:"Prepare for winter; mulch in northern areas",12:"Winter dormancy; semi-evergreen foliage"},
    video: "https://www.youtube.com/results?search_query=kniphofia+red+hot+poker+hummingbird+perennial+care",
    description: "Dramatic tubular flowers in hot colors attract hummingbirds. Tropical presence in the garden. Long bloom season from summer to fall.",
    planted: [], clevelandCultivars: ["Papaya Popsicle", "Flamenco", "Mango Popsicle"], whereToBuy: "Monrovia", whenAvailable: "May-Jul", clevelandLightNote: ""
  },
  {
    id: 116, name: "Ceratostigma (Plumbago)", botanical: "Ceratostigma plumbaginoides",
    type: "Perennial Flower / Groundcover", height: "6-12 in", width: "18-24 in",
    bloomMonths: [8,9,10], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false,
    rebloomNote: "Late season bloomer; foliage color extends interest",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Groundcover","Border","Edging","Cottage"],
    companions: ["Asters","Joe Pye Weed","Sedum"],
    yearRound: "Late-season blue flowers; foliage turns burgundy-red in fall",
    foliageInterest: "Green foliage turns deep burgundy-red in cool fall weather",
    cultivars: ["Ceratostigma plumbaginoides (species form)"],
    fertilizer: "Light balanced fertilizer", fertMonth: [5],
    care: {3:"Slow to emerge (late spring)",4:"Growth beginning; late greening",5:"Growth filling in",6:"Low profile; groundcover function",7:"Growth spreads",8:"Buds forming on low foliage",9:"Peak bloom with cobalt-blue flowers on spreading mats",10:"Peak bloom and color change to burgundy foliage",11:"Beautiful burgundy foliage; cut back or leave",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=ceratostigma+plumbago+groundcover+fall+color+care",
    description: "Late-season cobalt-blue flowers and burgundy fall foliage. Low-growing groundcover. Extremely tough and drought tolerant. Unexpected late season interest.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 117, name: "Chrysanthemum (Hardy Mum)", botanical: "Chrysanthemum spp.",
    type: "Perennial Flower", height: "18-24 in", width: "24-36 in",
    bloomMonths: [8,9,10,11], sun: "Full Sun", partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: false,
    rebloomNote: "Late-season fall bloomer; flowers persist through frost",
    attracts: ["Butterflies","Bees"], nativeOhio: false,
    gardenStyles: ["Cottage","Border","Fall Color","Cut Flowers"],
    companions: ["Asters","Sedum","Joe Pye Weed","Switchgrass"],
    yearRound: "Dense mounds of flowers in jewel tones; fall blooming star",
    foliageInterest: "Dense green foliage hidden by prolific flowers",
    cultivars: ["Too many to list — full range of colors in burgundy, bronze, purple, pink, white, yellow, orange"],
    fertilizer: "Balanced fertilizer in spring and summer", fertMonth: [5,7],
    care: {3:"Emerging growth; pinch in spring for bushier form",4:"Pinch tips through June for bushier plants",5:"Continue pinching through June; fertilize",6:"Bushy growth visible; pinching can continue until mid-June",7:"Summer growth; maintain moisture",8:"Buds forming",9:"Buds developing; increase moisture",10:"Peak bloom with mounds of fall-colored flowers; fertilize",11:"Peak bloom and frost hardiness; cut for arrangements",12:"Cut back after hard freeze"},
    video: "https://www.youtube.com/results?search_query=hardy+mums+chrysanthemum+fall+perennial+care",
    description: "Dense mounds of flowers in jewel tones provide unbeatable fall color. Long-lasting blooms. Plant early season for best cold hardiness.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 118, name: "Corydalis", botanical: "Corydalis spp.",
    type: "Perennial Flower", height: "12-18 in", width: "12-18 in",
    bloomMonths: [4,5,6,7], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: true,
    rebloomNote: "Reblooms throughout season in cool, moist shade",
    attracts: ["Bees","Butterflies"], nativeOhio: false,
    gardenStyles: ["Shade Garden","Woodland","Border","Cottage"],
    companions: ["Hellebore","Bleeding Heart","Hostas","Brunnera"],
    yearRound: "Delicate spurred flowers; ferny foliage; reblooms with moisture",
    foliageInterest: "Finely divided ferny foliage; some varieties semi-evergreen",
    cultivars: ["Corydalis flexuosa (blue flowers, ferny foliage)","Corydalis lutea (yellow flowers, more heat tolerant)","Corydalis elata (tall yellow)"],
    fertilizer: "Compost for moisture and nutrients", fertMonth: [4,6],
    care: {3:"Growth emerging",4:"Bloom beginning with ferny foliage",5:"Peak bloom; deadhead to encourage rebloom",6:"Rebloom with deadheading and cool moisture",7:"Dormancy in heat; keep moist and shaded",8:"Can resume with cool weather and moisture",9:"Rebloom in cool fall",10:"Decline in frost",11:"Cut back or leave structure",12:"Dormant"},
    video: "https://www.youtube.com/results?search_query=corydalis+shade+perennial+fern+like+flowers+care",
    description: "Delicate spurred flowers above ferny foliage. Reblooms with deadheading in cool shade. Excellent for woodland gardens. Prefers consistent moisture.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 119, name: "Narcissus (Daffodils)", botanical: "Narcissus spp.",
    type: "Bulb", height: "12-18 in", width: "6-12 in",
    bloomMonths: [3,4], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Early spring ephemeral bulb; foliage persists 4-6 weeks after bloom",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Spring Garden","Woodland","Border","Naturalized"],
    companions: ["Hellebore","Snowdrops","Crocuses","Primrose"],
    yearRound: "Early spring flowers; foliage feeds bulb for next year; naturalizes well",
    foliageInterest: "Strap-like foliage must remain 4-6 weeks after bloom for bulb strength",
    cultivars: ["King Alfred (large yellow trumpet)","Tête-à-Tête (miniature daffodil)","Ice Follies (white with orange cup)","Thalia (white fragrant)","February Gold (early yellow)","Geranium (white with orange cup, fragrant)"],
    fertilizer: "Bulb fertilizer in fall at planting; spring fertilizer after bloom", fertMonth: [3,10],
    care: {1:"Buds swelling beneath soil",2:"Blooming begins; early varieties show flowers",3:"Peak bloom with cheerful daffodil flowers; allow foliage to remain",4:"Foliage persisting; feed bulbs for next year",5:"Foliage yellowing and fading",6:"Foliage mostly gone; stop watering",7:"Dormant bulbs underground",8:"Dormant",9:"Dormant",10:"Plant new bulbs; fertilize existing plantings",11:"Bulbs settling in",12:"Winter dormancy; cold chilling bulbs"},
    video: "https://www.youtube.com/results?search_query=daffodil+narcissus+spring+bulb+care+naturalize",
    description: "Cheerful early spring flowers that naturalize well and multiply over years. Deer and rodent proof. Plant in fall for spring blooms. Long-lasting flowers.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  },
  {
    id: 120, name: "Muscari (Grape Hyacinth)", botanical: "Muscari armeniacum",
    type: "Bulb", height: "6-12 in", width: "6-12 in",
    bloomMonths: [3,4], sun: "Partial Shade", partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false,
    rebloomNote: "Early spring bulb; naturalizes readily",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Spring Garden","Edging","Border","Naturalized","Rock Garden"],
    companions: ["Daffodils","Tulips","Primrose","Hellebore"],
    yearRound: "Tiny grape-like flowers in blue or white; naturalizes and multiplies",
    foliageInterest: "Fine strap-like foliage; can yellow in late spring if left",
    cultivars: ["Grape Hyacinth 'Armeniacum' (cobalt blue, fragrant)","White variety (pure white)","Fantasy Creation (double blue flowers)"],
    fertilizer: "Bulb fertilizer at planting in fall; spring fertilizer after bloom", fertMonth: [3,10],
    care: {1:"Dormant bulbs underground",2:"Buds swelling",3:"Peak bloom with tiny grape-like blue flowers",4:"Flowers persisting; foliage growing",5:"Foliage yellowing and can be removed or deadheaded",6:"Foliage fading; stop deadheading if you want naturalization",7:"Dormant",8:"Dormant",9:"Dormant",10:"Plant new bulbs in fall; fertilize",11:"Dormancy as bulbs chill",12:"Winter chilling period"},
    video: "https://www.youtube.com/results?search_query=muscari+grape+hyacinth+spring+bulb+naturalize+care",
    description: "Tiny grape-like flowers in cobalt blue or white. Fragrant. Naturalizes easily and multiplies to create drifts. Perfect for edging. Very low maintenance.",
    planted: [], clevelandCultivars: [], whereToBuy: "", whenAvailable: "", clevelandLightNote: ""
  }
,
  {
    id: 121, name: "Alchemilla (Lady's Mantle)", botanical: "Alchemilla mollis",
    type: "Perennial", height: "12-18 in", width: "18-24 in",
    bloomMonths: [5, 6, 7], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Woodland", "Border"],
    companions: ["Hosta Patriot", "Astilbe", "Geranium", "Roses", "Heuchera"],
    yearRound: "Scalloped leaves hold dewdrops beautifully; chartreuse foliage spring-fall",
    foliageInterest: "Soft, scalloped gray-green leaves with silvery edges that catch water droplets",
    cultivars: ["Thriller (compact)", "Auslese (vigorous)", "Irish Silk"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4, 6],
    care: {Mar:"Remove old foliage",Apr:"Fertilize, divide if needed",May:"Deadhead spent blooms",Jun:"Cut back hard after bloom for fresh foliage",Jul:"Water in drought",Aug:"Monitor for slugs",Sep:"Enjoy fall foliage",Oct:"Leave foliage for winter interest",Nov:"Mulch crowns"},
    video: "alchemilla mollis lady's mantle care", description: "Elegant groundcover with chartreuse sprays of tiny flowers and velvety scalloped leaves. Exceptional as edging plant and in cottage gardens. Great cut flower for arrangements.",
    planted: [], clevelandCultivars: ["Thriller", "Auslese"],
    whereToBuy: "Proven Winners; Monrovia", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Morning sun or dappled shade; avoid hot afternoon sun."
  },
  {
    id: 122, name: "Aconitum (Monkshood)", botanical: "Aconitum napellus",
    type: "Perennial", height: "36-48 in", width: "12-18 in",
    bloomMonths: [7, 8, 9], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Woodland", "Border"],
    companions: ["Astilbe", "Hosta Sum and Substance", "Ligularia", "Japanese Anemone", "Japanese Painted Fern"],
    yearRound: "Tall spikes of hooded flowers provide vertical drama mid-late summer",
    foliageInterest: "Deeply cut, dark green glossy leaves",
    cultivars: ["Arendsii (deep blue)", "Bicolor (blue-white)", "Stainless Steel (silvery blue)"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4, 6],
    care: {Mar:"New growth emerges",Apr:"Fertilize",May:"Stake tall varieties",Jun:"Water consistently",Jul:"Blooms begin",Aug:"Peak bloom",Sep:"Late bloom",Oct:"Cut back after frost",Nov:"Mulch crowns"},
    video: "aconitum monkshood perennial care", description: "Tall, stately shade perennial with helmet-shaped flowers in deep blue, purple, or bicolor. Excellent late-season color for shade gardens. Note: all parts are toxic if ingested.",
    planted: [], clevelandCultivars: ["Arendsii", "Bicolor"],
    whereToBuy: "Regional grower", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Morning sun or dappled shade; avoid hot afternoon sun."
  },
  {
    id: 123, name: "Tiarella (Foam Flower)", botanical: "Tiarella cordifolia",
    type: "Perennial", height: "6-12 in", width: "12-18 in",
    bloomMonths: [4, 5, 6], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: true,
    gardenStyles: ["Woodland", "Shade Garden", "Groundcover"],
    companions: ["Heuchera", "Brunnera", "Hosta Halcyon", "Astilbe", "Japanese Painted Fern"],
    yearRound: "Evergreen to semi-evergreen foliage; fall color in burgundy tones",
    foliageInterest: "Maple-shaped leaves, often with dark center markings; burgundy fall color",
    cultivars: ["Sugar and Spice", "Spring Symphony", "Brandywine", "Running Tapestry"],
    fertilizer: "Balanced slow-release", fertMonth: [4],
    care: {Mar:"Clean old foliage",Apr:"Fertilize, divide runners",May:"Enjoy bloom",Jun:"Keep moist",Jul:"Water in heat",Aug:"Monitor moisture",Sep:"Fall color develops",Oct:"Semi-evergreen remains",Nov:"Light mulch"},
    video: "tiarella foam flower shade garden", description: "Delicate native woodland perennial with bottle-brush flower spikes above maple-shaped foliage. Spreads by runners to form attractive groundcover. Excellent companion to heuchera.",
    planted: [], clevelandCultivars: ["Sugar and Spice", "Spring Symphony"],
    whereToBuy: "Proven Winners", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Morning sun or dappled shade; avoid hot afternoon sun."
  },
  {
    id: 124, name: "Trollius (Globe Flower)", botanical: "Trollius spp.",
    type: "Perennial", height: "24-36 in", width: "12-18 in",
    bloomMonths: [5, 6], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "High", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Woodland", "Rain Garden"],
    companions: ["Astilbe", "Ligularia", "Lobelia", "Chelone", "Iris sibirica"],
    yearRound: "Globe-shaped buttercup-like flowers in spring; attractive mounding foliage",
    foliageInterest: "Deeply cut, dark green basal leaves",
    cultivars: ["Lemon Queen", "Orange Princess", "New Moon", "Cheddar"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4],
    care: {Mar:"New growth emerges",Apr:"Fertilize",May:"Peak bloom",Jun:"Keep moist after bloom",Jul:"Water heavily",Aug:"Keep soil consistently moist",Sep:"Foliage may decline in heat",Oct:"Cut back",Nov:"Mulch"},
    video: "trollius globe flower perennial care", description: "Cheerful globe-shaped flowers in shades of yellow and orange, perfect for moist shade gardens and stream edges. Thrives in consistently moist soil.",
    planted: [], clevelandCultivars: ["Lemon Queen", "Orange Princess"],
    whereToBuy: "Regional grower", whenAvailable: "Apr-May",
    clevelandLightNote: "Morning sun or dappled shade; needs consistent moisture."
  },
  {
    id: 125, name: "Polemonium (Jacob's Ladder)", botanical: "Polemonium caeruleum",
    type: "Perennial", height: "18-24 in", width: "12-18 in",
    bloomMonths: [5, 6], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Woodland", "Border"],
    companions: ["Brunnera", "Heuchera", "Hosta Halcyon", "Astilbe", "Bleeding Heart"],
    yearRound: "Elegant ladder-like foliage arrangement; blue bell-shaped flowers in spring",
    foliageInterest: "Pinnate leaves arranged like rungs of a ladder; some varieties have variegated foliage",
    cultivars: ["Brise d'Anjou (variegated)", "Stairway to Heaven", "Touch of Class"],
    fertilizer: "Balanced slow-release", fertMonth: [4],
    care: {Mar:"New growth emerges",Apr:"Fertilize",May:"Peak bloom",Jun:"Cut back after bloom",Jul:"Water in drought",Aug:"May go dormant in heat",Sep:"Fresh foliage if cut back",Oct:"Fall cleanup",Nov:"Mulch lightly"},
    video: "polemonium jacob's ladder care", description: "Elegant shade perennial with ladder-like leaf arrangement and clusters of blue bell-shaped flowers. Some varieties offer stunning variegated foliage for year-round interest.",
    planted: [], clevelandCultivars: ["Brise d'Anjou", "Stairway to Heaven"],
    whereToBuy: "Regional grower", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Morning sun or dappled shade; avoid hot afternoon sun."
  },
  {
    id: 126, name: "Epimedium (Barrenwort)", botanical: "Epimedium spp.",
    type: "Perennial", height: "8-12 in", width: "12-18 in",
    bloomMonths: [4, 5], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Woodland", "Shade Garden", "Groundcover"],
    companions: ["Hosta Halcyon", "Brunnera", "Helleborus", "Japanese Painted Fern", "Pulmonaria"],
    yearRound: "Semi-evergreen heart-shaped foliage with bronze spring tints and fall color",
    foliageInterest: "Heart-shaped leaves emerge bronze-red, mature green, turn bronze-red in fall",
    cultivars: ["Sulphureum (yellow)", "Rubrum (red)", "Pink Champagne", "Amber Queen"],
    fertilizer: "Compost topdress", fertMonth: [3],
    care: {Mar:"Cut back old foliage before new growth",Apr:"New foliage and flowers emerge",May:"Enjoy delicate flowers",Jun:"Established plants tolerate dry shade",Jul:"Drought tolerant once established",Aug:"Low maintenance",Sep:"Fall color developing",Oct:"Semi-evergreen foliage persists",Nov:"Leave foliage for winter"},
    video: "epimedium barrenwort shade groundcover", description: "Tough, elegant groundcover for dry shade with delicate spider-like flowers in spring. Heart-shaped leaves provide multi-season color. One of the best perennials for difficult dry shade under trees.",
    planted: [], clevelandCultivars: ["Sulphureum", "Rubrum"],
    whereToBuy: "Monrovia; Regional grower", whenAvailable: "Apr-May",
    clevelandLightNote: "Dappled shade to full shade; thrives under trees."
  },
  {
    id: 127, name: "Liriope (Lilyturf)", botanical: "Liriope muscari",
    type: "Perennial Groundcover", height: "12-18 in", width: "12-18 in",
    bloomMonths: [8, 9], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Border", "Groundcover", "Asian"],
    companions: ["Hosta Guacamole", "Heuchera", "Japanese Painted Fern", "Ajuga"],
    yearRound: "Evergreen grass-like foliage; purple flower spikes late summer; blue berries fall",
    foliageInterest: "Grass-like evergreen leaves; variegated forms available",
    cultivars: ["Big Blue", "Variegata", "Royal Purple", "Silver Dragon"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4],
    care: {Mar:"Cut back old foliage before new growth",Apr:"Fertilize, divide if needed",May:"Fresh foliage fills in",Jun:"Low maintenance",Jul:"Low maintenance",Aug:"Flower spikes appear",Sep:"Peak bloom",Oct:"Blue berries develop",Nov:"Evergreen foliage persists"},
    video: "liriope lilyturf groundcover care", description: "Versatile, nearly indestructible evergreen groundcover with grass-like foliage and purple flower spikes in late summer. Tolerates sun, shade, drought, and poor soil.",
    planted: [], clevelandCultivars: ["Big Blue", "Variegata"],
    whereToBuy: "Monrovia; Home Depot", whenAvailable: "Apr-Sep",
    clevelandLightNote: "Sun to full shade; extremely adaptable."
  },
  {
    id: 128, name: "Delphinium", botanical: "Delphinium elatum",
    type: "Perennial", height: "36-60 in", width: "18-24 in",
    bloomMonths: [6, 7], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium-High", ph: "6.5-7.5", reblooming: true, rebloomNote: "Cut spent stalks for second flush in fall",
    attracts: ["Hummingbirds", "Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "English Garden", "Border", "Cut Flower"],
    companions: ["Roses", "Peonies", "Lavender", "Phlox", "Shasta Daisy"],
    yearRound: "Spectacular tall flower spikes are the hallmark of cottage gardens",
    foliageInterest: "Deeply lobed, palm-shaped leaves",
    cultivars: ["Magic Fountains (dwarf)", "Pacific Giants", "Guardian Blue", "Summer Skies"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4, 6],
    care: {Mar:"New growth emerges",Apr:"Fertilize, stake early",May:"Thin shoots to 5-7 strongest",Jun:"Peak bloom; stake tall varieties",Jul:"Cut spent stalks to base for rebloom",Aug:"Second flush possible",Sep:"Late rebloom",Oct:"Cut back after frost",Nov:"Mulch crowns heavily"},
    video: "delphinium perennial care cleveland", description: "The quintessential cottage garden perennial with towering spikes of blue, purple, pink, or white flowers. Requires staking and rich soil but rewards with spectacular vertical drama.",
    planted: [], clevelandCultivars: ["Magic Fountains", "Guardian Blue"],
    whereToBuy: "Proven Winners; Vigoro", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun with afternoon shade protection in hot summers."
  },
  {
    id: 129, name: "Asclepias (Butterfly Weed)", botanical: "Asclepias tuberosa",
    type: "Perennial", height: "18-24 in", width: "12-18 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Bees", "Hummingbirds"], nativeOhio: true,
    gardenStyles: ["Native", "Prairie", "Meadow", "Pollinator Garden"],
    companions: ["Echinacea", "Rudbeckia", "Liatris",  "Goldenrod"],
    yearRound: "Essential monarch butterfly host plant; ornamental seed pods in fall",
    foliageInterest: "Narrow lance-shaped leaves; ornamental seed pods split to reveal silky seeds",
    cultivars: ["Hello Yellow", "Gay Butterflies Mix", "Cinderella"],
    fertilizer: "None needed - poor soil preferred", fertMonth: [],
    care: {Mar:"Late to emerge - mark location",Apr:"Very late to emerge - do not dig up",May:"New growth finally appears",Jun:"Blooms begin",Jul:"Peak bloom; attract monarchs",Aug:"Late bloom; seed pods forming",Sep:"Ornamental seed pods",Oct:"Leave seed pods for interest",Nov:"Cut back or leave standing"},
    video: "asclepias butterfly weed native plant", description: "Essential native pollinator plant and monarch butterfly host. Brilliant orange flower clusters attract numerous butterflies. Extremely drought tolerant once established. Late to emerge in spring - be patient!",
    planted: [], clevelandCultivars: ["Hello Yellow", "Gay Butterflies Mix"],
    whereToBuy: "Proven Winners; Native plant sales", whenAvailable: "May-Jul",
    clevelandLightNote: "Full sun; needs excellent drainage."
  },
  {
    id: 130, name: "Echinops (Globe Thistle)", botanical: "Echinops ritro",
    type: "Perennial", height: "24-36 in", width: "18-24 in",
    bloomMonths: [7, 8], sun: true, partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Mediterranean", "Border", "Dried Flower"],
    companions: ["Russian Sage", "Echinacea", "Rudbeckia", "Yarrow"],
    yearRound: "Architectural steel-blue globe flowers excellent dried; spiny silver foliage",
    foliageInterest: "Spiny, silver-backed deeply cut leaves",
    cultivars: ["Veitch's Blue", "Taplow Blue", "Blue Glow", "Arctic Glow (white)"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"New basal foliage",Apr:"Growing season begins",May:"Foliage fills out",Jun:"Flower buds forming",Jul:"Peak bloom - steel blue globes",Aug:"Deadhead for possible rebloom",Sep:"Cut for dried arrangements",Oct:"Cut back",Nov:"Mulch lightly"},
    video: "echinops globe thistle perennial garden", description: "Striking architectural perennial with perfectly round steel-blue flower globes. Extremely tough, drought tolerant, and deer proof. Excellent fresh or dried cut flower.",
    planted: [], clevelandCultivars: ["Veitch's Blue", "Taplow Blue"],
    whereToBuy: "Regional grower", whenAvailable: "May-Jul",
    clevelandLightNote: "Full sun; tolerates poor, dry soil."
  },
  {
    id: 131, name: "Filipendula (Queen of the Prairie)", botanical: "Filipendula rubra",
    type: "Perennial", height: "48-72 in", width: "24-36 in",
    bloomMonths: [6, 7], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "High", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Bees"], nativeOhio: true,
    gardenStyles: ["Native", "Rain Garden", "Cottage", "Woodland"],
    companions: ["Joe Pye Weed", "Lobelia", "Chelone", "Ligularia", "Iris sibirica"],
    yearRound: "Tall plumes of cotton-candy pink flowers; bold palmate foliage",
    foliageInterest: "Large, deeply cut palmate leaves like a giant astilbe",
    cultivars: ["Venusta (deep pink)", "Venusta Magnifica", "Kahome (compact)"],
    fertilizer: "Compost topdress", fertMonth: [4],
    care: {Mar:"New growth emerges",Apr:"Fertilize with compost",May:"Rapid growth",Jun:"Bloom begins",Jul:"Peak bloom - spectacular plumes",Aug:"Keep moist",Sep:"Foliage interest",Oct:"Cut back",Nov:"Mulch"},
    video: "filipendula queen of the prairie native", description: "Majestic native prairie perennial with towering cotton-candy pink plumes above bold palmate foliage. Perfect for rain gardens and moist meadows. A real showstopper when given adequate moisture.",
    planted: [], clevelandCultivars: ["Venusta", "Kahome"],
    whereToBuy: "Native plant sales; Monrovia", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Part shade to full sun with consistent moisture."
  },
  {
    id: 132, name: "Alcea (Hollyhock)", botanical: "Alcea rosea",
    type: "Perennial (short-lived)", height: "48-72 in", width: "18-24 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: false,
    deerResistant: false, rabbitResistant: false, droughtTolerant: true,
    waterReq: "Medium", ph: "6.0-8.0", reblooming: false, rebloomNote: "",
    attracts: ["Hummingbirds", "Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "English Garden", "Border"],
    companions: ["Roses", "Delphinium", "Foxglove", "Lavender", "Clematis"],
    yearRound: "Iconic tall spires along fences and walls; self-sows readily",
    foliageInterest: "Large, rough-textured rounded leaves",
    cultivars: ["Chater's Double Mix", "Halo Series", "Queeny Purple", "Fiesta Time"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4, 6],
    care: {Mar:"Watch for new rosettes",Apr:"Fertilize",May:"Stake tall varieties early",Jun:"Bloom begins from bottom up",Jul:"Peak bloom",Aug:"Late bloom; watch for rust",Sep:"Allow some to set seed",Oct:"Cut back after frost",Nov:"Mulch new plants"},
    video: "hollyhock alcea perennial care", description: "Classic cottage garden icon with towering spires of single or double blooms in every color. Short-lived perennial that self-sows freely. Susceptible to rust but worth the effort for their unmatched charm.",
    planted: [], clevelandCultivars: ["Chater's Double", "Halo Series"],
    whereToBuy: "Vigoro; seed", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun; plant against south-facing wall or fence for wind protection."
  },
  {
    id: 133, name: "Platycodon (Balloon Flower)", botanical: "Platycodon grandiflorus",
    type: "Perennial", height: "18-24 in", width: "12-18 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.5-7.5", reblooming: true, rebloomNote: "Deadhead for extended bloom",
    attracts: ["Bees", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Border", "Rock Garden"],
    companions: ["Coreopsis", "Veronica", "Dianthus", "Salvia", "Catmint"],
    yearRound: "Charming balloon-shaped buds pop open to star-shaped flowers",
    foliageInterest: "Blue-green oval leaves; golden yellow fall color",
    cultivars: ["Sentimental Blue (dwarf)", "Astra Blue", "Fuji Blue", "Pop Star Mix"],
    fertilizer: "Balanced slow-release", fertMonth: [4],
    care: {Mar:"Very late to emerge - mark location!",Apr:"Still emerging slowly",May:"Growth begins in earnest",Jun:"Balloon buds begin to form",Jul:"Peak bloom",Aug:"Continue deadheading",Sep:"Fall color developing",Oct:"Golden fall foliage",Nov:"Cut back; mark location for spring"},
    video: "platycodon balloon flower perennial", description: "Delightful perennial with puffy balloon-shaped buds that pop open to reveal star-shaped blue, pink, or white flowers. Very late to emerge in spring - mark its location! Long-lived and trouble-free.",
    planted: [], clevelandCultivars: ["Sentimental Blue", "Astra Blue"],
    whereToBuy: "Proven Winners; Vigoro", whenAvailable: "May-Jul",
    clevelandLightNote: "Full sun to part shade; tolerates afternoon shade."
  },
  {
    id: 134, name: "Crocosmia", botanical: "Crocosmia x crocosmiiflora",
    type: "Perennial (bulb/corm)", height: "24-36 in", width: "12-18 in",
    bloomMonths: [7, 8, 9], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Hummingbirds", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Tropical", "Border"],
    companions: ["Daylily", "Russian Sage",  "Echinacea", "Rudbeckia"],
    yearRound: "Arching sprays of fiery flowers; sword-like foliage; interesting seed heads",
    foliageInterest: "Sword-shaped, pleated leaves like gladiolus",
    cultivars: ["Lucifer (hardiest, red)", "Emily McKenzie (orange)", "George Davison (yellow)"],
    fertilizer: "Balanced bulb fertilizer", fertMonth: [4],
    care: {Mar:"New shoots emerge",Apr:"Fertilize with bulb food",May:"Foliage growing",Jun:"Flower stalks developing",Jul:"Bloom begins",Aug:"Peak bloom",Sep:"Late bloom; leave seed heads",Oct:"Cut back after frost",Nov:"Mulch heavily for winter protection in zone 6"},
    video: "crocosmia lucifer perennial care", description: "Dramatic arching sprays of fiery red, orange, or yellow tubular flowers that hummingbirds love. \'Lucifer\' is the hardiest variety for zone 6. Mulch well for winter protection in Cleveland.",
    planted: [], clevelandCultivars: ["Lucifer"],
    whereToBuy: "Monrovia; bulb suppliers", whenAvailable: "Spring bulb planting",
    clevelandLightNote: "Full sun to light shade; needs winter mulch in zone 6."
  },
  {
    id: 135, name: "Papaver (Oriental Poppy)", botanical: "Papaver orientale",
    type: "Perennial", height: "24-36 in", width: "18-24 in",
    bloomMonths: [5, 6], sun: true, partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.5-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Border", "Mediterranean"],
    companions: ["Catmint", "Baby's Breath", "Daylily", "Russian Sage"],
    yearRound: "Spectacular crepe-paper blooms in late spring; goes dormant in summer",
    foliageInterest: "Hairy, deeply cut foliage; goes dormant after bloom - plan companions to fill gap",
    cultivars: ["Brilliant (red)", "Beauty of Livermere", "Patty's Plum", "Royal Wedding (white)"],
    fertilizer: "Balanced 10-10-10", fertMonth: [3],
    care: {Mar:"Fertilize emerging foliage",Apr:"Rapid growth",May:"Spectacular bloom",Jun:"Foliage yellowing - going dormant",Jul:"Dormant - overplant with annuals",Aug:"Dormant",Sep:"New foliage rosette appears",Oct:"Low rosette of foliage",Nov:"Mulch lightly"},
    video: "papaver orientale oriental poppy care", description: "Show-stopping crepe-paper blooms up to 6 inches across in brilliant reds, oranges, pinks, and white. Goes dormant in summer - pair with later-emerging perennials to fill the gap.",
    planted: [], clevelandCultivars: ["Beauty of Livermere", "Brilliant"],
    whereToBuy: "Vigoro; Regional grower", whenAvailable: "Sep-Oct (fall planting best)",
    clevelandLightNote: "Full sun; excellent drainage essential."
  },
  {
    id: 136, name: "Lupinus (Lupine)", botanical: "Lupinus polyphyllus",
    type: "Perennial (short-lived)", height: "24-36 in", width: "18-24 in",
    bloomMonths: [5, 6], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: true, rebloomNote: "Deadhead promptly for second flush",
    attracts: ["Butterflies", "Bees", "Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage", "English Garden", "Border"],
    companions: ["Iris", "Foxglove", "Delphinium", "Peonies", "Geranium"],
    yearRound: "Dramatic spikes of pea-like flowers; palmate foliage; fixes nitrogen",
    foliageInterest: "Attractive palmate (hand-shaped) leaves",
    cultivars: ["Gallery Series (compact)", "Westcountry Series", "Russell Hybrids", "Staircase Mix"],
    fertilizer: "None - fixes nitrogen", fertMonth: [],
    care: {Mar:"New growth emerges",Apr:"Growth accelerates",May:"Peak bloom",Jun:"Deadhead for rebloom",Jul:"Second flush possible",Aug:"May struggle in heat",Sep:"Foliage declines",Oct:"Cut back",Nov:"Mulch; may need replacement after 3-4 years"},
    video: "lupine perennial care tips", description: "Spectacular spires of pea-like flowers in bicolor combinations. Short-lived perennial that dislikes hot, humid summers. Best treated as a 2-3 year plant in Cleveland. Fixes nitrogen in soil.",
    planted: [], clevelandCultivars: ["Gallery Series", "Westcountry Series"],
    whereToBuy: "Proven Winners; seed", whenAvailable: "Apr-May",
    clevelandLightNote: "Full sun with afternoon shade; prefers cool conditions."
  },
  {
    id: 137, name: "Geum (Avens)", botanical: "Geum spp.",
    type: "Perennial", height: "12-18 in", width: "12-18 in",
    bloomMonths: [5, 6, 7], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: true, rebloomNote: "Deadhead for extended bloom into fall",
    attracts: ["Bees", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Border", "Rock Garden"],
    companions: ["Geranium", "Salvia", "Catmint", "Heuchera", "Dianthus"],
    yearRound: "Semi-evergreen rosettes of foliage; bright warm-toned flowers spring-summer",
    foliageInterest: "Semi-evergreen basal rosettes of scalloped leaves",
    cultivars: ["Totally Tangerine", "Mrs. Bradshaw (red)", "Lady Stratheden (yellow)", "Mai Tai"],
    fertilizer: "Balanced slow-release", fertMonth: [4],
    care: {Mar:"Clean old foliage",Apr:"Fertilize",May:"Bloom begins",Jun:"Peak bloom",Jul:"Deadhead for rebloom",Aug:"Water in heat",Sep:"May rebloom",Oct:"Semi-evergreen rosette remains",Nov:"Mulch lightly"},
    video: "geum avens perennial care", description: "Charming cottage garden perennial with warm-toned ruffled flowers on wiry stems above rosettes of scalloped leaves. Long bloom period with deadheading. \'Totally Tangerine\' is a standout performer.",
    planted: [], clevelandCultivars: ["Totally Tangerine", "Mrs. Bradshaw"],
    whereToBuy: "Proven Winners; Monrovia", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun to part shade; mulch in summer to keep roots cool."
  },
  {
    id: 138, name: "Lamium (Dead Nettle)", botanical: "Lamium maculatum",
    type: "Perennial Groundcover", height: "6-12 in", width: "18-24 in",
    bloomMonths: [4, 5, 6], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: true, rebloomNote: "Sporadic rebloom through summer",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Woodland", "Shade Garden", "Groundcover"],
    companions: ["Hosta Blue Mouse Ears", "Brunnera", "Heuchera", "Japanese Painted Fern", "Astilbe"],
    yearRound: "Silver-splashed foliage provides bright accent in shade year-round",
    foliageInterest: "Silver-marked leaves brighten dark corners; semi-evergreen",
    cultivars: ["White Nancy (white/silver)", "Beacon Silver", "Purple Dragon", "Ghost"],
    fertilizer: "Balanced slow-release", fertMonth: [4],
    care: {Mar:"Clean up winter-damaged foliage",Apr:"Fertilize; new growth fills in",May:"Peak bloom",Jun:"Shear after bloom for fresh foliage",Jul:"Water in drought",Aug:"Semi-evergreen in shade",Sep:"Foliage remains attractive",Oct:"Still looking good",Nov:"Semi-evergreen through mild winters"},
    video: "lamium dead nettle groundcover shade", description: "Fast-spreading shade groundcover with silver-splashed foliage that lights up dark corners. Hooded flowers in white, pink, or purple in spring. Semi-evergreen in Cleveland.",
    planted: [], clevelandCultivars: ["White Nancy", "Beacon Silver", "Purple Dragon"],
    whereToBuy: "Proven Winners; Home Depot", whenAvailable: "Apr-Sep",
    clevelandLightNote: "Part to full shade; silver coloring best with some morning light."
  },
  {
    id: 139, name: "Thalictrum (Meadow Rue)", botanical: "Thalictrum spp.",
    type: "Perennial", height: "36-60 in", width: "18-24 in",
    bloomMonths: [6, 7, 8], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "5.5-7.0", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Woodland", "Border"],
    companions: ["Astilbe", "Japanese Anemone", "Hosta Sum and Substance", "Ligularia", "Autumn Fern"],
    yearRound: "Airy clouds of tiny flowers above columbine-like foliage; vertical accent for shade",
    foliageInterest: "Delicate, columbine-like blue-green foliage",
    cultivars: ["Hewitt's Double (lavender)", "Black Stockings", "Splendide", "Elin (tall)"],
    fertilizer: "Balanced 10-10-10", fertMonth: [4],
    care: {Mar:"New growth emerges",Apr:"Fertilize",May:"Foliage developing",Jun:"Bloom begins",Jul:"Peak bloom - airy clouds of flowers",Aug:"Late bloom",Sep:"Cut back spent stems",Oct:"Fall cleanup",Nov:"Mulch"},
    video: "thalictrum meadow rue shade perennial", description: "Tall, graceful shade perennial with airy clouds of tiny lavender or white flowers above delicate columbine-like foliage. Adds wonderful textural contrast and vertical interest to shade gardens.",
    planted: [], clevelandCultivars: ["Hewitt's Double", "Black Stockings"],
    whereToBuy: "Regional grower; Monrovia", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Part shade; morning sun with afternoon shade."
  },
  {
    id: 140, name: "Convallaria (Lily of the Valley)", botanical: "Convallaria majalis",
    type: "Perennial Groundcover", height: "6-12 in", width: "12-18 in",
    bloomMonths: [4, 5], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "5.0-7.0", reblooming: false, rebloomNote: "",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Woodland", "Shade Garden", "Groundcover", "Cottage"],
    companions: ["Hosta Blue Mouse Ears", "Japanese Painted Fern", "Brunnera", "Helleborus", "Epimedium"],
    yearRound: "Intensely fragrant white bells in spring; red berries in fall; aggressive spreader",
    foliageInterest: "Broad, upright oval leaves; yellows in fall",
    cultivars: ["Rosea (pink)", "Flore Pleno (double)", "Bordeaux", "Variegata"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"New pips emerge",Apr:"Rapid growth",May:"Fragrant bloom",Jun:"Foliage fills in",Jul:"Low maintenance",Aug:"Red berries forming",Sep:"Foliage yellowing",Oct:"Cut back",Nov:"Spreads aggressively - contain if needed"},
    video: "lily of the valley convallaria care", description: "Beloved woodland groundcover with intensely fragrant white bell-shaped flowers in spring. Spreads aggressively by rhizomes - excellent for difficult shade areas but may need containment. All parts toxic.",
    planted: [], clevelandCultivars: ["Standard species", "Rosea"],
    whereToBuy: "Home Depot; pips from garden centers", whenAvailable: "Mar-May",
    clevelandLightNote: "Part to full shade; thrives in dry shade under trees."
  },
  {
    id: 141, name: "Gypsophila (Baby's Breath)", botanical: "Gypsophila paniculata",
    type: "Perennial", height: "24-36 in", width: "24-36 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "7.0-7.5 (alkaline)", reblooming: true, rebloomNote: "Shear after first flush for rebloom",
    attracts: ["Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Border", "Cut Flower"],
    companions: ["Roses", "Peonies", "Iris", "Oriental Poppy", "Daylily"],
    yearRound: "Airy cloud of tiny white flowers - classic filler in arrangements and garden",
    foliageInterest: "Fine, blue-green foliage on wispy stems",
    cultivars: ["Bristol Fairy (double white)", "Pink Fairy", "Festival Star", "Perfecta"],
    fertilizer: "Low nitrogen; add lime if soil is acidic", fertMonth: [4],
    care: {Mar:"New growth emerges",Apr:"Fertilize lightly; check soil pH",May:"Rapid growth",Jun:"First flush of bloom",Jul:"Shear after bloom for rebloom",Aug:"Second flush",Sep:"Late bloom possible",Oct:"Cut back",Nov:"Mulch; good drainage essential"},
    video: "gypsophila baby's breath perennial care", description: "Classic airy filler plant creating clouds of tiny white or pink flowers. Excellent cut flower, fresh or dried. Prefers alkaline soil - add lime in Cleveland\'s slightly acidic soils. Needs excellent drainage.",
    planted: [], clevelandCultivars: ["Bristol Fairy", "Festival Star"],
    whereToBuy: "Regional grower", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun; needs alkaline soil and excellent drainage."
  },
  {
    id: 142, name: "Centaurea (Bachelor's Button/Cornflower)", botanical: "Centaurea montana",
    type: "Perennial", height: "18-24 in", width: "12-18 in",
    bloomMonths: [5, 6, 7], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: true, rebloomNote: "Cut back hard after first bloom for fall rebloom",
    attracts: ["Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Meadow", "Cut Flower"],
    companions: ["Salvia", "Catmint", "Coreopsis", "Yarrow", "Shasta Daisy"],
    yearRound: "Bright blue fringed flowers; silvery foliage",
    foliageInterest: "Silver-gray lance-shaped leaves",
    cultivars: ["Gold Bullion (gold foliage)", "Amethyst in Snow", "Black Sprite", "Carnea (pink)"],
    fertilizer: "Minimal - lean soil preferred", fertMonth: [],
    care: {Mar:"New silver foliage emerges",Apr:"Growth begins",May:"First bloom",Jun:"Peak bloom",Jul:"Cut back hard for rebloom",Aug:"Fresh foliage; possible rebloom",Sep:"Fall rebloom",Oct:"Cut back",Nov:"Mulch lightly; may self-sow"},
    video: "centaurea montana perennial cornflower", description: "Charming cottage garden perennial with fringed blue flowers above silver-gray foliage. Extremely easy to grow and drought tolerant. Can spread aggressively - divide every few years.",
    planted: [], clevelandCultivars: ["Species type", "Amethyst in Snow"],
    whereToBuy: "Regional grower; seed", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun to part shade; lean soil is fine."
  },
  {
    id: 143, name: "Sempervivum (Hens & Chicks)", botanical: "Sempervivum tectorum",
    type: "Perennial Succulent", height: "3-6 in", width: "12-18 in",
    bloomMonths: [7, 8], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Rock Garden", "Alpine", "Container", "Groundcover"],
    companions: ["Sedum", "Creeping Thyme", "Dianthus", "Armeria", "Ajuga"],
    yearRound: "Evergreen rosettes year-round; fascinating offsets; architectural texture",
    foliageInterest: "Succulent rosettes in green, red, purple, bronze; evergreen",
    cultivars: ["Black", "Cobweb (Arachnoideum)", "Ruby Heart", "Pacific Blue Ice"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"Rosettes begin growing",Apr:"Remove winter-damaged leaves",May:"Offsets (chicks) forming",Jun:"Rapid offset production",Jul:"Flower stalks on mature rosettes (mother hen dies after)",Aug:"Remove spent flower stalks",Sep:"Offsets fill gaps",Oct:"Evergreen through winter",Nov:"No mulch needed - needs dry conditions"},
    video: "sempervivum hens chicks succulent care", description: "Hardy succulent forming rosettes that produce offsets (chicks) around the mother plant (hen). Incredibly tough - thrives in poor soil, rock walls, and containers. The mother rosette dies after flowering but leaves many offspring.",
    planted: [], clevelandCultivars: ["Various hybrids"],
    whereToBuy: "Home Depot; garden centers", whenAvailable: "Apr-Sep",
    clevelandLightNote: "Full sun; excellent drainage critical - avoid wet winter soil."
  },
  {
    id: 144, name: "Myosotis (Forget-Me-Not)", botanical: "Myosotis sylvatica",
    type: "Perennial (short-lived/biennial)", height: "6-12 in", width: "6-12 in",
    bloomMonths: [4, 5, 6], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Bees", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Woodland", "Shade Garden"],
    companions: ["Tulips", "Bleeding Heart", "Hosta Blue Mouse Ears", "Brunnera", "Primula"],
    yearRound: "Carpet of tiny true-blue flowers in spring; self-sows generously",
    foliageInterest: "Soft, hairy oblong leaves",
    cultivars: ["Blue Ball", "Victoria Blue", "Mon Amie Blue", "Indigo"],
    fertilizer: "Light compost", fertMonth: [3],
    care: {Mar:"Seedlings emerge",Apr:"Rapid growth",May:"Peak bloom - blue carpet",Jun:"Setting seed; pull or let self-sow",Jul:"Declining in heat",Aug:"New seedlings may appear",Sep:"Fall rosettes forming",Oct:"Overwintering rosettes",Nov:"Hardy through winter"},
    video: "myosotis forget-me-not garden care", description: "Charming spring ephemeral creating carpets of tiny sky-blue flowers. Self-sows freely to naturalize. Perfect for underplanting bulbs and filling spring gaps. Short-lived but perpetuates itself.",
    planted: [], clevelandCultivars: ["Victoria Blue"],
    whereToBuy: "Seed; garden centers", whenAvailable: "Mar-May",
    clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 145, name: "Bellis (English Daisy)", botanical: "Bellis perennis",
    type: "Perennial (short-lived)", height: "6-8 in", width: "6-8 in",
    bloomMonths: [3, 4, 5, 6], sun: true, partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-7.0", reblooming: true, rebloomNote: "Deadhead for extended bloom",
    attracts: ["Bees", "Butterflies"], nativeOhio: false,
    gardenStyles: ["Cottage", "Border", "Container"],
    companions: ["Viola", "Primula", "Myosotis", "Muscari", "Narcissus"],
    yearRound: "Cheerful pompom daisies from early spring; compact rosette form",
    foliageInterest: "Low rosettes of spoon-shaped leaves",
    cultivars: ["Pomponette Series", "Tasso Series", "Bellissima Series", "Habanera"],
    fertilizer: "Balanced slow-release", fertMonth: [3],
    care: {Mar:"First blooms appear",Apr:"Peak bloom",May:"Continue blooming",Jun:"Decline in heat",Jul:"May go dormant",Aug:"Dormant in heat",Sep:"May revive with cool weather",Oct:"Fall rosettes",Nov:"Mulch lightly"},
    video: "bellis perennis english daisy care", description: "Cheerful miniature daisies in white, pink, and red that bloom prolifically in cool weather. Treated as biennial in Cleveland - best replanted annually. Perfect for early spring color.",
    planted: [], clevelandCultivars: ["Pomponette", "Tasso"],
    whereToBuy: "Garden centers in spring", whenAvailable: "Mar-Apr",
    clevelandLightNote: "Half-day sun (morning preferred); allow light afternoon sun."
  },
  {
    id: 146, name: "Lysimachia (Creeping Jenny/Loosestrife)", botanical: "Lysimachia nummularia",
    type: "Perennial Groundcover", height: "2-4 in", width: "24-36 in",
    bloomMonths: [6, 7], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "Medium-High", ph: "5.5-7.5", reblooming: false, rebloomNote: "",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Groundcover", "Rain Garden", "Container"],
    companions: ["Hosta Blue Mouse Ears", "Astilbe", "Autumn Fern", "Lobelia", "Chelone"],
    yearRound: "Golden trailing foliage; small yellow flowers; cascading habit for containers",
    foliageInterest: "Round golden-chartreuse leaves on trailing stems ('Aurea' form)",
    cultivars: ["Aurea (golden)", "Standard green"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"New growth emerges",Apr:"Rapid spreading begins",May:"Golden carpet forming",Jun:"Small yellow flowers",Jul:"Peak coverage",Aug:"Keep moist",Sep:"Foliage remains golden",Oct:"Foliage declining",Nov:"Dies back in winter; returns vigorously"},
    video: "lysimachia creeping jenny groundcover", description: "Fast-spreading golden groundcover perfect for containers, between stepping stones, and moist shade areas. \'Aurea\' form has brilliant chartreuse foliage. Can be aggressive - use where spreading is welcome.",
    planted: [], clevelandCultivars: ["Aurea"],
    whereToBuy: "Proven Winners; Home Depot", whenAvailable: "Apr-Sep",
    clevelandLightNote: "Sun to shade; gold color best in part sun."
  },
  {
    id: 147, name: "Artemisia (Wormwood)", botanical: "Artemisia spp.",
    type: "Perennial", height: "18-36 in", width: "18-24 in",
    bloomMonths: [], sun: true, partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: false, rebloomNote: "",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Mediterranean", "Cottage", "Border", "Foliage Garden"],
    companions: ["Lavender", "Russian Sage", "Echinacea", "Salvia", "Roses"],
    yearRound: "Silver-gray aromatic foliage provides year-round textural contrast",
    foliageInterest: "Finely cut silver-gray aromatic leaves; grown primarily for foliage",
    cultivars: ["Silver Mound (compact)", "Powis Castle", "Valerie Finnis", "Silver King"],
    fertilizer: "None - lean soil preferred", fertMonth: [],
    care: {Mar:"New silver growth emerges",Apr:"Rapid foliage growth",May:"Trim to shape if needed",Jun:"Silver foliage at its best",Jul:"May flop in humid weather - shear",Aug:"Shear if open in center",Sep:"Still attractive",Oct:"Leave foliage for winter interest",Nov:"Good winter structure"},
    video: "artemisia silver mound perennial foliage", description: "Grown for its stunning silver-gray aromatic foliage rather than flowers. Excellent textural contrast plant and natural deer/rabbit deterrent. Thrives in poor, dry soil - avoid overwatering.",
    planted: [], clevelandCultivars: ["Silver Mound", "Powis Castle"],
    whereToBuy: "Proven Winners; Monrovia", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun; needs excellent drainage to prevent rot."
  },
  {
    id: 148, name: "Vinca (Periwinkle)", botanical: "Vinca minor",
    type: "Perennial Groundcover", height: "4-6 in", width: "18-24 in",
    bloomMonths: [4, 5], sun: false, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: true, rebloomNote: "Sporadic rebloom through summer",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Woodland", "Groundcover", "Shade Garden"],
    companions: ["Hosta Blue Mouse Ears", "Autumn Fern", "Helleborus", "Daffodils", "Hydrangea"],
    yearRound: "Evergreen trailing groundcover with violet-blue flowers in spring",
    foliageInterest: "Small, glossy, dark evergreen leaves",
    cultivars: ["Bowles Variety (large blue)", "Ralph Shugert (variegated)", "Atropurpurea (purple)", "Alba (white)"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"Spring flowers begin",Apr:"Peak bloom",May:"Late bloom; spreading",Jun:"Evergreen groundcover",Jul:"Low maintenance",Aug:"Low maintenance",Sep:"Occasional fall rebloom",Oct:"Evergreen foliage",Nov:"Remains green through winter"},
    video: "vinca minor periwinkle groundcover", description: "Classic evergreen groundcover with glossy leaves and violet-blue spring flowers. Extremely tough once established - tolerates dry shade, root competition, and neglect. Can be invasive in natural areas.",
    planted: [], clevelandCultivars: ["Bowles Variety", "Ralph Shugert"],
    whereToBuy: "Home Depot; garden centers", whenAvailable: "Apr-Sep",
    clevelandLightNote: "Part to full shade; tolerates dry shade under trees."
  },
  {
    id: 149, name: "Lychnis (Rose Campion)", botanical: "Lychnis coronaria",
    type: "Perennial (short-lived)", height: "24-36 in", width: "12-18 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Cottage", "Meadow", "Border"],
    companions: ["Catmint", "Lavender", "Salvia", "Yarrow"],
    yearRound: "Brilliant magenta flowers against silver-white woolly foliage",
    foliageInterest: "Silver-white woolly rosettes; striking contrast to flowers",
    cultivars: ["Alba (white)", "Angel's Blush (white/pink eye)", "Gardeners' World (double)"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"Silver rosettes emerge",Apr:"Foliage fills in",May:"Flower stalks developing",Jun:"Peak bloom - magenta against silver",Jul:"Continue blooming",Aug:"Allow to self-sow",Sep:"Seedlings appearing",Oct:"Cut back spent stalks",Nov:"Silver rosettes overwinter"},
    video: "lychnis rose campion cottage garden", description: "Eye-catching magenta flowers against silver-white woolly foliage. Short-lived but self-sows freely. Thrives in poor, dry soil. A classic cottage garden plant that adds brilliant color with zero maintenance.",
    planted: [], clevelandCultivars: ["Species type", "Alba"],
    whereToBuy: "Seed; Regional grower", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun to part shade; excellent drainage."
  },
  {
    id: 150, name: "Calluna (Heather)", botanical: "Calluna vulgaris",
    type: "Evergreen Shrub", height: "12-18 in", width: "18-24 in",
    bloomMonths: [8, 9, 10], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "4.5-6.0 (acidic)", reblooming: false, rebloomNote: "",
    attracts: ["Bees"], nativeOhio: false,
    gardenStyles: ["Rock Garden", "Border", "Evergreen", "Foundation"],
    companions: ["Azalea", "Blueberry", "Autumn Fern",  "Erica"],
    yearRound: "Evergreen needle-like foliage year-round; late summer/fall bloom when little else flowers",
    foliageInterest: "Tiny scale-like evergreen leaves in green, gold, orange, or red tones",
    cultivars: ["Firefly (orange foliage)", "Dark Beauty (deep pink)", "Spring Cream (variegated)"],
    fertilizer: "Acid fertilizer (rhododendron type)", fertMonth: [4],
    care: {Mar:"Prune lightly - trim last year's growth by half",Apr:"Fertilize with acid fertilizer",May:"New growth",Jun:"Foliage interest",Jul:"Flower buds forming",Aug:"Bloom begins",Sep:"Peak bloom",Oct:"Late bloom; foliage coloring",Nov:"Evergreen through winter"},
    video: "calluna heather evergreen care zone 6", description: "Hardy evergreen shrub providing late-season bloom when most perennials are finished. Requires acidic soil. Beautiful winter texture and foliage color. From Cleveland\'s Four-Season reference guide.",
    planted: [], clevelandCultivars: ["Firefly", "Dark Beauty"],
    whereToBuy: "Monrovia; garden centers", whenAvailable: "Apr-Sep",
    clevelandLightNote: "Full sun to light shade; needs acidic, well-drained soil."
  },
  {
    id: 151, name: "Verbena (Trailing Verbena)", botanical: "Verbena canadensis",
    type: "Perennial (short-lived)", height: "6-12 in", width: "18-24 in",
    bloomMonths: [6, 7, 8, 9], sun: true, partialShade: false,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low", ph: "6.0-8.0", reblooming: true, rebloomNote: "Continuous bloom May-frost with deadheading",
    attracts: ["Butterflies", "Bees", "Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage", "Groundcover", "Rock Garden", "Container"],
    companions: ["Coreopsis", "Salvia", "Gaillardia",  "Sedum"],
    yearRound: "Long-blooming clusters of vibrant flowers from late spring to frost",
    foliageInterest: "Deeply cut, dark green leaves on spreading stems",
    cultivars: ["Homestead Purple", "Superbena Series", "Lanai Series", "Imagination"],
    fertilizer: "Balanced slow-release", fertMonth: [4, 7],
    care: {Mar:"New growth from base",Apr:"Fertilize",May:"Growth spreading",Jun:"Bloom begins",Jul:"Peak bloom; fertilize again",Aug:"Continue blooming",Sep:"Still going strong",Oct:"Bloom until frost",Nov:"May not survive harsh winters; mulch heavily"},
    video: "verbena canadensis homestead purple", description: "Incredibly long-blooming groundcover with vivid flower clusters from late spring through frost. \'Homestead Purple\' is the hardiest for Cleveland. May be short-lived but worth replanting. From Cleveland\'s Four-Season reference.",
    planted: [], clevelandCultivars: ["Homestead Purple"],
    whereToBuy: "Proven Winners; Vigoro", whenAvailable: "May-Jul",
    clevelandLightNote: "Full sun; needs excellent drainage for winter survival."
  },
  {
    id: 152, name: "Helianthus (Willow-Leaved Sunflower)", botanical: "Helianthus salicifolius",
    type: "Perennial", height: "48-72 in", width: "24-36 in",
    bloomMonths: [9, 10], sun: true, partialShade: false,
    deerResistant: false, rabbitResistant: false, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Bees"], nativeOhio: false,
    gardenStyles: ["Prairie", "Native", "Border", "Meadow"],
    companions: ["Aster", "Goldenrod",  "Joe Pye Weed", "Sedum"],
    yearRound: "Dramatic fine-textured willow-like foliage all season; yellow daisy flowers in fall; winter seed heads",
    foliageInterest: "Unique thread-like drooping leaves create a cascading textural effect",
    cultivars: ["First Light (compact)", "Low Down (dwarf)", "Table Mountain"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"Cut back old stalks",Apr:"New growth",May:"Dramatic foliage developing",Jun:"Architectural foliage interest",Jul:"Foliage at its best",Aug:"Flower buds forming",Sep:"Bright yellow bloom",Oct:"Peak late bloom",Nov:"Leave seed heads for birds"},
    video: "helianthus salicifolius willow sunflower", description: "Unique perennial sunflower grown as much for its dramatic thread-like willow foliage as its late fall yellow blooms. \'First Light\' is a compact selection. From Cleveland\'s Four-Season reference.",
    planted: [], clevelandCultivars: ["First Light", "Low Down"],
    whereToBuy: "Monrovia; native plant sales", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Full sun; tolerates poor soil."
  },
  {
    id: 153, name: "Acorus (Sweet Flag)", botanical: "Acorus gramineus",
    type: "Perennial Grass-like", height: "6-12 in", width: "12-18 in",
    bloomMonths: [], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: false,
    waterReq: "High", ph: "5.0-7.5", reblooming: false, rebloomNote: "",
    attracts: [], nativeOhio: false,
    gardenStyles: ["Rain Garden", "Asian", "Bog Garden", "Border"],
    companions: ["Lobelia", "Chelone", "Ligularia", "Iris sibirica", "Carex"],
    yearRound: "Semi-evergreen grass-like foliage; variegated and golden forms available",
    foliageInterest: "Fan-shaped iris-like leaves; 'Ogon' has striking golden-yellow variegation",
    cultivars: ["Ogon (golden)", "Variegatus", "Minimus Aureus (miniature gold)"],
    fertilizer: "Balanced slow-release", fertMonth: [4],
    care: {Mar:"New growth emerges",Apr:"Fertilize",May:"Foliage fills in",Jun:"Peak foliage color",Jul:"Keep moist",Aug:"Water regularly",Sep:"Foliage still attractive",Oct:"Semi-evergreen",Nov:"May persist through mild winters"},
    video: "acorus ogon sweet flag grass", description: "Elegant grass-like perennial for moist areas. \'Ogon\' is a standout with brilliant golden-yellow fan-shaped foliage. Perfect for rain gardens, pond edges, and containers. Not a true grass.",
    planted: [], clevelandCultivars: ["Ogon"],
    whereToBuy: "Monrovia; water garden specialists", whenAvailable: "Apr-Jun",
    clevelandLightNote: "Sun to part shade; needs consistent moisture."
  },
  {
    id: 154, name: "Silene (Catchfly)", botanical: "Silene regia",
    type: "Perennial", height: "24-36 in", width: "12-18 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: true,
    deerResistant: true, rabbitResistant: true, droughtTolerant: true,
    waterReq: "Low-Medium", ph: "6.0-7.5", reblooming: false, rebloomNote: "",
    attracts: ["Hummingbirds", "Butterflies"], nativeOhio: true,
    gardenStyles: ["Native", "Prairie", "Cottage", "Pollinator Garden"],
    companions: ["Echinacea", "Penstemon", "Salvia", "Monarda", "Baptisia"],
    yearRound: "Brilliant scarlet flowers on upright stems; excellent hummingbird plant",
    foliageInterest: "Opposite oval leaves on sticky stems (catches small insects)",
    cultivars: ["Royal Catchfly (species)"],
    fertilizer: "None needed", fertMonth: [],
    care: {Mar:"New growth from base",Apr:"Growth begins",May:"Stems elongating",Jun:"Bloom begins",Jul:"Peak bloom - brilliant red",Aug:"Late bloom",Sep:"Seed heads",Oct:"Cut back",Nov:"Mulch lightly"},
    video: "silene royal catchfly native perennial", description: "Brilliant scarlet native wildflower that is a magnet for hummingbirds. Sticky stems catch small insects (hence \'catchfly\'). Underused native that deserves wider planting. Mentioned in Petitti\'s hummingbird plant list.",
    planted: [], clevelandCultivars: ["Species type"],
    whereToBuy: "Native plant sales; specialty growers", whenAvailable: "May-Jun",
    clevelandLightNote: "Full sun to part shade; well-drained soil."
  },
  {
    id: 155, name: "Lilium (Lily)", botanical: "Lilium spp.",
    type: "Perennial (bulb)", height: "24-48 in", width: "12-18 in",
    bloomMonths: [6, 7, 8], sun: true, partialShade: true,
    deerResistant: false, rabbitResistant: false, droughtTolerant: false,
    waterReq: "Medium", ph: "6.0-6.5", reblooming: false, rebloomNote: "",
    attracts: ["Butterflies", "Hummingbirds"], nativeOhio: false,
    gardenStyles: ["Cottage", "Border", "Cut Flower"],
    companions: ["Daylily", "Phlox", "Lavender", "Low Groundcovers", "Catmint"],
    yearRound: "Spectacular trumpet or Turk's cap flowers; sequence bloom types for months of color",
    foliageInterest: "Narrow whorled leaves on strong stems; foliage fades after bloom",
    cultivars: ["Stargazer (Oriental)", "Casa Blanca (white Oriental)", "Enchantment (Asiatic)", "Scheherazade (Orienpet)"],
    fertilizer: "Bulb fertilizer", fertMonth: [3, 5],
    care: {Mar:"Fertilize as shoots emerge",Apr:"Rapid growth",May:"Fertilize again; stake tall types",Jun:"Asiatic types bloom",Jul:"Oriental types bloom",Aug:"Late orientals; Orienpets bloom",Sep:"Foliage yellowing - leave to feed bulb",Oct:"Cut back when fully yellow",Nov:"Mulch for winter protection"},
    video: "lily care asiatic oriental zone 6", description: "Classic garden bulb with spectacular fragrant flowers. Plant Asiatics for June, Orientals for July-August, and Orienpets for August for continuous bloom. Deer love them - protect with repellent.",
    planted: [], clevelandCultivars: ["Stargazer", "Casa Blanca", "Enchantment"],
    whereToBuy: "Home Depot; bulb suppliers; Monrovia", whenAvailable: "Fall bulb planting; potted in spring",
    clevelandLightNote: "Full sun to light shade; heads in sun, roots in shade."
  },
];

// ─── MONTHS & HELPERS ────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PLANT_TYPES = [...new Set(PLANTS.map(p => p.type))].sort();
const SUN_OPTIONS = ["Full Sun","Partial Shade","Full Shade"];
const ATTRACTS_OPTIONS = ["Butterflies","Bees","Hummingbirds","Birds"];

// ─── SVG ICON COMPONENTS ─────────────────────────────────────────────────────
function SunIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>);
}
function PartialSunIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m-9-9h1m16 0h1m-2.64-6.36l-.7.7m-12.02 12.02l-.7.7m15.42 0l-.7-.7M5.34 5.34l-.7-.7"/><circle cx="12" cy="12" r="4"/><path d="M16 12a4 4 0 0 1-4 4v-8a4 4 0 0 1 4 4z" fill="currentColor" opacity="0.3"/></svg>);
}
function WaterIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>);
}
function DeerIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2l1 4M16 2l-1 4M7 6c0 0-1-1-2-1s-2 1-2 1M17 6c0 0 1-1 2-1s2 1 2 1M12 6a5 5 0 0 0-5 5c0 3 2 5 5 7 3-2 5-4 5-7a5 5 0 0 0-5-5z"/><circle cx="10" cy="10" r="0.7" fill="currentColor"/><circle cx="14" cy="10" r="0.7" fill="currentColor"/></svg>);
}
function RabbitIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="16" rx="5" ry="4"/><ellipse cx="9" cy="5" rx="1.5" ry="5" transform="rotate(-10 9 5)"/><ellipse cx="15" cy="5" rx="1.5" ry="5" transform="rotate(10 15 5)"/><circle cx="10.5" cy="15" r="0.7" fill="currentColor"/><circle cx="13.5" cy="15" r="0.7" fill="currentColor"/><ellipse cx="12" cy="17" rx="1" ry="0.5" fill="currentColor" opacity="0.5"/></svg>);
}
function DroughtIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5" stroke="currentColor"/></svg>);
}
function HeightIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><polyline points="8 6 12 2 16 6"/><polyline points="8 18 12 22 16 18"/></svg>);
}
function WidthIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><polyline points="6 8 2 12 6 16"/><polyline points="18 8 22 12 18 16"/></svg>);
}
function PhIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" rx="3" width="18" height="18"/><text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold" stroke="none">pH</text></svg>);
}
function CalendarIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
}
function LeafIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>);
}
function FlowerIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6z"/><path d="M17.2 5.8a3 3 0 0 0-4.2 4.2 3 3 0 0 0 4.2-4.2z"/><path d="M22 12a3 3 0 0 0-6 0 3 3 0 0 0 6 0z"/><path d="M17.2 18.2a3 3 0 0 0-4.2-4.2 3 3 0 0 0 4.2 4.2z"/><path d="M12 22a3 3 0 0 0 0-6 3 3 0 0 0 0 6z"/><path d="M6.8 18.2a3 3 0 0 0 4.2-4.2 3 3 0 0 0-4.2 4.2z"/><path d="M2 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0z"/><path d="M6.8 5.8a3 3 0 0 0 4.2 4.2A3 3 0 0 0 6.8 5.8z"/></svg>);
}
function FertilizerIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 21h18"/><path d="M12 21V8"/><path d="M12 8c-3-3-7-3-7 0s3 4 7 2"/><path d="M12 8c3-3 7-3 7 0s-3 4-7 2"/><path d="M12 12c-2-4-5-4-5-1s2.5 4 5 3"/><path d="M12 12c2-4 5-4 5-1s-2.5 4-5 3"/></svg>);
}
function ShoppingIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>);
}
function VideoIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
}
function GardenIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 21h18"/><path d="M5 21V10l7-7 7 7v11"/><rect x="9" y="14" width="6" height="7"/></svg>);
}
function CheckCircleIcon({ className = "w-5 h-5" }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
}

// ─── PRE-FETCHED PLANT IMAGES (Wikimedia Commons) ────────────────────────────
function PlantImage({ plantId, name, size = "md" }) {
  const colors = [
    "from-green-100 to-emerald-200", "from-pink-100 to-rose-200", "from-blue-100 to-sky-200",
    "from-amber-100 to-yellow-200", "from-purple-100 to-violet-200", "from-teal-100 to-cyan-200",
    "from-orange-100 to-amber-200", "from-lime-100 to-green-200"
  ];
  const flowerEmojis = ["🌸","🌻","🌺","🌷","🌼","💐","🌿","🪻"];
  const c = colors[plantId % colors.length];
  const emoji = flowerEmojis[plantId % flowerEmojis.length];
  const initials = name.split(/[\s(]+/).filter(w=>w.length>1).slice(0,2).map(w=>w[0]).join("");
  const heights = { sm: "h-32", md: "h-48", lg: "h-64" };
  const textSizes = { sm: "text-3xl", md: "text-5xl", lg: "text-6xl" };
  return (
    <div className={`w-full ${heights[size] || heights.md} bg-gradient-to-br ${c} rounded-xl flex flex-col items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 50% 80%, white 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
      <span className={`${textSizes[size] || textSizes.md} mb-1 drop-shadow-sm`}>{emoji}</span>
      <span className="text-sm font-semibold text-stone-600 bg-white/50 px-3 py-0.5 rounded-full backdrop-blur-sm">{initials}</span>
    </div>
  );
}



function getBloomColor(months) {
  if (!months.length) return "bg-green-100 text-green-800";
  const first = months[0];
  if (first <= 3) return "bg-purple-100 text-purple-800";
  if (first <= 5) return "bg-pink-100 text-pink-800";
  if (first <= 8) return "bg-yellow-100 text-yellow-800";
  return "bg-orange-100 text-orange-800";
}

function getBloomSeason(months) {
  if (!months.length) return "Non-flowering";
  const seasons = [];
  if (months.some(m => m >= 2 && m <= 4)) seasons.push("Spring");
  if (months.some(m => m >= 5 && m <= 7)) seasons.push("Summer");
  if (months.some(m => m >= 8 && m <= 10)) seasons.push("Fall");
  if (months.some(m => m === 11 || m === 12 || m === 1)) seasons.push("Winter");
  return seasons.join("/");
}

// ─── TASK SYSTEM ─────────────────────────────────────────────────────────────
function generateMonthlyTasks(month) {
  const tasks = [];
  PLANTS.forEach(p => {
    if (p.care && p.care[month]) {
      tasks.push({ plantId: p.id, plantName: p.name, task: p.care[month], month });
    }
    if (p.fertMonth && p.fertMonth.includes(month)) {
      tasks.push({ plantId: p.id, plantName: p.name, task: `Fertilize: ${p.fertilizer}`, month, isFertilizer: true });
    }
  });
  return tasks;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
// ─── DARK MODE STYLE OVERRIDES ──────────────────────────────────────────────
const DarkModeStyle = () => (
  <style>{`
    .dark-mode {
      --tw-bg-opacity: 1;
      color-scheme: dark;
    }
    .dark-mode,
    .dark-mode .bg-stone-50,
    .dark-mode .bg-gradient-to-b { background: #0c0c0f !important; color: #e5e5e5 !important; }
    .dark-mode .bg-white { background: #18181b !important; }
    .dark-mode .bg-stone-100, .dark-mode .bg-stone-50\\/50 { background: #1c1c21 !important; }
    .dark-mode .bg-gradient-to-br { background: #18181b !important; }
    .dark-mode .bg-gradient-to-r.from-green-800 { background: linear-gradient(to right, #052e16, #18181b) !important; }
    .dark-mode .bg-gradient-to-r.from-green-50,
    .dark-mode .bg-gradient-to-r.from-blue-50,
    .dark-mode .bg-gradient-to-r.from-amber-50 { background: #1c1c21 !important; }
    .dark-mode .text-stone-800, .dark-mode .text-stone-900 { color: #e5e5e5 !important; }
    .dark-mode .text-stone-700 { color: #d4d4d8 !important; }
    .dark-mode .text-stone-600 { color: #a1a1aa !important; }
    .dark-mode .text-stone-500 { color: #71717a !important; }
    .dark-mode .text-stone-400 { color: #52525b !important; }
    .dark-mode .text-stone-300 { color: #3f3f46 !important; }
    .dark-mode .border-stone-200, .dark-mode .border-stone-100, .dark-mode .border-stone-300 { border-color: #27272a !important; }
    .dark-mode .bg-green-50 { background: #052e1633 !important; }
    .dark-mode .bg-green-100 { background: #05371b44 !important; }
    .dark-mode .bg-amber-50 { background: #451a0333 !important; }
    .dark-mode .bg-amber-100 { background: #451a0344 !important; }
    .dark-mode .bg-blue-50 { background: #172554 !important; }
    .dark-mode .bg-blue-100 { background: #1e3a5f !important; }
    .dark-mode .bg-violet-50 { background: #2e1065 !important; }
    .dark-mode .bg-violet-100 { background: #3b0764 !important; }
    .dark-mode .bg-purple-100 { background: #3b0764 !important; }
    .dark-mode .bg-fuchsia-100 { background: #4a044e !important; }
    .dark-mode .bg-pink-100 { background: #500724 !important; }
    .dark-mode .bg-rose-100 { background: #4c0519 !important; }
    .dark-mode .bg-red-50 { background: #450a0a33 !important; }
    .dark-mode .bg-indigo-50 { background: #1e1b4b !important; }
    .dark-mode .border-green-200, .dark-mode .border-green-300 { border-color: #166534 !important; }
    .dark-mode .border-blue-200, .dark-mode .border-blue-300 { border-color: #1e40af !important; }
    .dark-mode .border-amber-200 { border-color: #92400e !important; }
    .dark-mode .border-violet-200 { border-color: #5b21b6 !important; }
    .dark-mode .border-purple-200 { border-color: #6b21a8 !important; }
    .dark-mode .border-fuchsia-200 { border-color: #86198f !important; }
    .dark-mode .border-pink-200 { border-color: #9d174d !important; }
    .dark-mode .border-rose-200 { border-color: #9f1239 !important; }
    .dark-mode .text-green-800 { color: #86efac !important; }
    .dark-mode .text-green-700 { color: #4ade80 !important; }
    .dark-mode .text-green-600 { color: #22c55e !important; }
    .dark-mode .text-blue-800 { color: #93c5fd !important; }
    .dark-mode .text-amber-800 { color: #fcd34d !important; }
    .dark-mode .text-amber-700 { color: #f59e0b !important; }
    .dark-mode .text-violet-800 { color: #c4b5fd !important; }
    .dark-mode .text-purple-800 { color: #d8b4fe !important; }
    .dark-mode .text-fuchsia-800 { color: #e879f9 !important; }
    .dark-mode .text-pink-800 { color: #f9a8d4 !important; }
    .dark-mode .text-rose-800 { color: #fda4af !important; }
    .dark-mode .text-red-800 { color: #fca5a5 !important; }
    .dark-mode .shadow-sm, .dark-mode .shadow-md { box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important; }
    .dark-mode input, .dark-mode select { background: #27272a !important; color: #e5e5e5 !important; border-color: #3f3f46 !important; }
    .dark-mode .bg-green-600\\/40 { background: rgba(5,46,22,0.5) !important; }
    .dark-mode .hover\\:bg-stone-50:hover { background: #27272a !important; }
    .dark-mode .hover\\:border-green-300:hover { border-color: #166534 !important; }
    .dark-mode .bg-green-50\\/50 { background: rgba(5,46,22,0.2) !important; }
    .dark-mode .bg-green-100\\/50 { background: rgba(5,46,22,0.3) !important; }
    .dark-mode svg text { fill: currentColor; }
    .dark-mode .bg-gradient-to-r.from-emerald-50 { background: #022c2233 !important; }
    .dark-mode .border-green-200.border-2 { border-color: #16a34a !important; }
  `}</style>
);

export default function PerennialGuide() {
  const [view, setView] = useState("plants"); // plants, calendar, tasks, detail
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    type: "", sun: "", deerResistant: false, rabbitResistant: false,
    droughtTolerant: false, nativeOhio: false, reblooming: false,
    bloomMonth: 0, attracts: "", evergreen: false, inMyGarden: false
  });
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [completedTasks, setCompletedTasks] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const toggleTask = useCallback((key) => {
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const filteredPlants = useMemo(() => {
    return PLANTS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.botanical.toLowerCase().includes(search.toLowerCase()) &&
          !p.description.toLowerCase().includes(search.toLowerCase()) &&
          !(p.cultivars || []).some(c => c.toLowerCase().includes(search.toLowerCase()))) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.sun === "Full Sun" && p.sun !== "Full Sun") return false;
      if (filters.sun === "Partial Shade" && !p.partialShade) return false;
      if (filters.deerResistant && !p.deerResistant) return false;
      if (filters.rabbitResistant && !p.rabbitResistant) return false;
      if (filters.droughtTolerant && !p.droughtTolerant) return false;
      if (filters.nativeOhio && !p.nativeOhio) return false;
      if (filters.reblooming && !p.reblooming) return false;
      if (filters.bloomMonth && !p.bloomMonths.includes(filters.bloomMonth)) return false;
      if (filters.attracts && !p.attracts.includes(filters.attracts)) return false;
      if (filters.inMyGarden && (!p.planted || p.planted.length === 0)) return false;
      return true;
    });
  }, [search, filters]);

  const currentTasks = useMemo(() => generateMonthlyTasks(calendarMonth), [calendarMonth]);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  // Detail view
  if (view === "detail" && selectedPlant) {
    const p = selectedPlant;
    const waterLevels = {"Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5};
    const waterLevel = waterLevels[p.waterReq] || 3;
    const waterDesc = {
      "Low": "Every 10-14 days once established",
      "Low-Medium": "About once a week in summer",
      "Medium": "1-2 times per week in summer",
      "Medium-High": "2-3 times per week; keep soil moist",
      "High": "Every other day; soil should stay consistently moist"
    };
    const seasonColors = {spring: "from-emerald-400 to-green-500", summer: "from-yellow-400 to-orange-500", fall: "from-orange-400 to-red-500", winter: "from-blue-300 to-indigo-400"};
    const getMonthSeason = (m) => m >= 3 && m <= 5 ? "spring" : m >= 6 && m <= 8 ? "summer" : m >= 9 && m <= 11 ? "fall" : "winter";

    return (
      <div className={`min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 transition-colors duration-300 ${darkMode ? "dark-mode" : ""}`}>
        <DarkModeStyle />
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          {/* Theme Toggle (detail view) */}
          <div className="flex justify-end mb-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-green-600 transition-colors" title={darkMode ? "Light mode" : "Dark mode"}>
              {darkMode ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
          </div>
          {/* Back Button */}
          <button onClick={() => setView("plants")} className="mb-4 group flex items-center gap-2 text-green-700 hover:text-green-900 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-stone-200 hover:border-green-300 transition-all">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
            Back to Plants
          </button>

          {/* ─── HERO SECTION ─── */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
            <div className="relative">
              {/* Gradient Banner */}
              <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 p-8 pb-24">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}>
                </div>
              </div>

              {/* Floating Card over Banner */}
              <div className="relative -mt-20 mx-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Plant Image */}
                  <div className="w-full md:w-56 shrink-0">
                    <div className="shadow-xl rounded-xl border-4 border-white overflow-hidden">
                      <PlantImage plantId={p.id} name={p.name} size="lg" />
                    </div>
                  </div>
                  {/* Name & Badges */}
                  <div className="flex-1 pt-0 md:pt-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-stone-100">
                      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">{p.name}</h1>
                      <p className="text-lg text-stone-500 italic mt-0.5">{p.botanical}</p>
                      {p.planted && p.planted.length > 0 && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-sm font-semibold text-green-800">In My Garden: {p.planted.join(", ")}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-200">{p.type}</span>
                        {p.nativeOhio && <span className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-amber-200 flex items-center gap-1"><LeafIcon className="w-3.5 h-3.5" /> Native Ohio</span>}
                        {p.reblooming && <span className="bg-pink-50 text-pink-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-pink-200 flex items-center gap-1"><FlowerIcon className="w-3.5 h-3.5" /> Reblooming</span>}
                        {p.deerResistant && <span className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200 flex items-center gap-1"><DeerIcon className="w-3.5 h-3.5" /> Deer Resistant</span>}
                        {p.rabbitResistant && <span className="bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-indigo-200 flex items-center gap-1"><RabbitIcon className="w-3.5 h-3.5" /> Rabbit Resistant</span>}
                        {p.droughtTolerant && <span className="bg-orange-50 text-orange-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-orange-200 flex items-center gap-1"><DroughtIcon className="w-3.5 h-3.5" /> Drought Tolerant</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── DESCRIPTION ─── */}
            <div className="px-6 md:px-8 pb-2">
              <p className="text-stone-600 text-lg leading-relaxed bg-stone-50 rounded-xl p-5 border border-stone-100 italic">"{p.description}"</p>
            </div>

            {/* ─── QUICK STATS STRIP ─── */}
            <div className="px-6 md:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Height */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0"><HeightIcon /></div>
                  <div><div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Height</div><div className="font-bold text-stone-800 text-lg">{p.height}</div></div>
                </div>
                {/* Width */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100 flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 shrink-0"><WidthIcon /></div>
                  <div><div className="text-xs font-medium text-teal-600 uppercase tracking-wide">Width</div><div className="font-bold text-stone-800 text-lg">{p.width}</div></div>
                </div>
                {/* Sun */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0">{p.sun === "Full Sun" ? <SunIcon /> : <PartialSunIcon />}</div>
                  <div><div className="text-xs font-medium text-amber-600 uppercase tracking-wide">Sun</div><div className="font-bold text-stone-800 text-lg">{p.sun}</div></div>
                </div>
                {/* Water */}
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><WaterIcon /></div>
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Water</div>
                    <div className="font-bold text-stone-800 text-sm">{waterDesc[p.waterReq] || p.waterReq}</div>
                    <div className="flex gap-1 mt-1">{[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-3 h-3 rounded-full ${i <= waterLevel ? 'bg-blue-500' : 'bg-blue-100'}`} />
                    ))}</div>
                  </div>
                </div>
                {/* pH */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100 flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 shrink-0"><PhIcon /></div>
                  <div><div className="text-xs font-medium text-violet-600 uppercase tracking-wide">Soil pH</div><div className="font-bold text-stone-800 text-lg">{p.ph}</div></div>
                </div>
                {/* Deer */}
                <div className={`bg-gradient-to-br rounded-xl p-4 border flex items-start gap-3 ${p.deerResistant ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-rose-50 border-red-100'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.deerResistant ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}><DeerIcon /></div>
                  <div><div className={`text-xs font-medium uppercase tracking-wide ${p.deerResistant ? 'text-green-600' : 'text-red-500'}`}>Deer</div><div className="font-bold text-stone-800 text-lg">{p.deerResistant ? "Resistant" : "Not Resistant"}</div></div>
                </div>
                {/* Rabbit */}
                <div className={`bg-gradient-to-br rounded-xl p-4 border flex items-start gap-3 ${p.rabbitResistant ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-rose-50 border-red-100'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.rabbitResistant ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}><RabbitIcon /></div>
                  <div><div className={`text-xs font-medium uppercase tracking-wide ${p.rabbitResistant ? 'text-green-600' : 'text-red-500'}`}>Rabbit</div><div className="font-bold text-stone-800 text-lg">{p.rabbitResistant ? "Resistant" : "Not Resistant"}</div></div>
                </div>
                {/* Drought */}
                <div className={`bg-gradient-to-br rounded-xl p-4 border flex items-start gap-3 ${p.droughtTolerant ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-rose-50 border-red-100'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.droughtTolerant ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}><DroughtIcon /></div>
                  <div><div className={`text-xs font-medium uppercase tracking-wide ${p.droughtTolerant ? 'text-green-600' : 'text-red-500'}`}>Drought</div><div className="font-bold text-stone-800 text-lg">{p.droughtTolerant ? "Tolerant" : "Needs Water"}</div></div>
                </div>
              </div>
            </div>

            {/* ─── BLOOM TIMELINE ─── */}
            <div className="px-6 md:px-8 pb-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FlowerIcon className="w-5 h-5 text-pink-500" />
                  <h3 className="font-bold text-stone-800 text-lg">Bloom Timeline</h3>
                </div>
                <div className="flex gap-1.5">
                  {MONTHS.map((m, i) => {
                    const isBloom = p.bloomMonths.includes(i + 1);
                    const season = getMonthSeason(i + 1);
                    return (
                      <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className={`w-full h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          isBloom ? `bg-gradient-to-b ${seasonColors[season]} text-white shadow-sm` : 'bg-stone-50 text-stone-300 border border-stone-100'
                        }`}>
                          {isBloom && <FlowerIcon className="w-4 h-4" />}
                        </div>
                        <span className={`text-xs font-medium ${isBloom ? 'text-stone-700' : 'text-stone-400'}`}>{m}</span>
                      </div>
                    );
                  })}
                </div>
                {p.rebloomNote && (
                  <div className="mt-3 bg-pink-50 rounded-lg px-4 py-2 border border-pink-100">
                    <p className="text-sm text-pink-700 flex items-center gap-2"><FlowerIcon className="w-4 h-4 text-pink-400 shrink-0" /> {p.rebloomNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ─── ATTRACTS ─── */}
            {p.attracts.length > 0 && (
              <div className="px-6 md:px-8 pb-6">
                <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                  <h3 className="font-bold text-amber-900 text-lg mb-3 flex items-center gap-2">
                    <span className="text-xl">🦋</span> Attracts Wildlife
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {p.attracts.map(a => {
                      const icons = {Butterflies: "🦋", Bees: "🐝", Hummingbirds: "🐦", Birds: "🐦"};
                      const colors = {Butterflies: "from-orange-100 to-amber-100 border-orange-200 text-orange-900", Bees: "from-yellow-100 to-amber-100 border-yellow-200 text-yellow-900", Hummingbirds: "from-green-100 to-emerald-100 border-green-200 text-green-900", Birds: "from-blue-100 to-sky-100 border-blue-200 text-blue-900"};
                      return (
                        <div key={a} className={`bg-gradient-to-r ${colors[a] || "from-stone-100 to-stone-100 border-stone-200 text-stone-800"} border rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm`}>
                          <span className="text-2xl">{icons[a] || "🐦"}</span>
                          <span className="font-semibold text-sm">{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── FOLIAGE & YEAR-ROUND ─── */}
            <div className="px-6 md:px-8 pb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><LeafIcon className="w-5 h-5 text-green-600" /></div>
                    <h3 className="font-bold text-green-800">Foliage Interest</h3>
                  </div>
                  <p className="text-sm text-green-700 leading-relaxed">{p.foliageInterest}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><CalendarIcon className="w-5 h-5 text-amber-600" /></div>
                    <h3 className="font-bold text-amber-800">Year-Round Interest</h3>
                  </div>
                  <p className="text-sm text-amber-700 leading-relaxed">{p.yearRound}</p>
                </div>
              </div>
            </div>

            {/* ─── COMPANIONS ─── */}
            {(() => {
              const findCompanion = (name) => PLANTS.find(pl => name.toLowerCase().includes(pl.name.split(" ")[0].toLowerCase()) || pl.name.toLowerCase().includes(name.split(" ")[0].toLowerCase()));
              const parseH = (h) => { if (!h) return {min:0,max:0}; const m = h.match(/(\d+)\s*-\s*(\d+)/); return m ? {min:parseInt(m[1]),max:parseInt(m[2])} : {min:0,max:0}; };
              const compData = p.companions.map(name => {
                const found = findCompanion(name);
                const h = found ? parseH(found.height) : {min:0,max:0};
                return { name, plant: found, blooms: found ? (found.bloomMonths||[]) : [], min: h.min, max: h.max, waterReq: found ? (found.waterReq||"") : "" };
              });
              const leftComps = compData.slice(0, Math.ceil(compData.length / 2));
              const rightComps = compData.slice(Math.ceil(compData.length / 2));
              const mainH = parseH(p.height);
              const allHeights = [mainH, ...compData.map(c => ({min:c.min, max:c.max}))].filter(h => h.max > 0);
              const globalMax = allHeights.length ? Math.max(...allHeights.map(h => h.max)) : 48;
              const getMonthSeason2 = (m) => m >= 3 && m <= 5 ? "spring" : m >= 6 && m <= 8 ? "summer" : m >= 9 && m <= 11 ? "fall" : "winter";
              const seasonGrad = {spring: "from-emerald-400 to-green-500", summer: "from-yellow-400 to-orange-500", fall: "from-orange-400 to-red-500", winter: "from-blue-300 to-indigo-400"};
              const flowerEmojis2 = ["🌸","🌻","🌺","🌷","🌼","💐","🪻","🌿"];

              return (
                <div className="px-6 md:px-8 pb-6">
                  <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-stone-100">
                      <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                        <LeafIcon className="w-5 h-5 text-green-500" /> Companion Plants
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">Plants that thrive alongside {p.name.split(" (")[0]}</p>
                    </div>

                    {/* ─── HUB VISUALIZATION: Center plant + companions on sides ─── */}
                    <div className="p-5 bg-gradient-to-b from-stone-50 to-white">
                      <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap md:flex-nowrap">
                        {/* Left companions */}
                        <div className="flex flex-col gap-2 items-end flex-1 min-w-0">
                          {leftComps.map((c, i) => (
                            <button key={c.name}
                              onClick={() => { if (c.plant) { setSelectedPlant(c.plant); window.scrollTo(0,0); } }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all w-full justify-end ${
                                c.plant ? 'hover:bg-green-50 cursor-pointer group' : 'cursor-default'
                              }`}>
                              <div className="text-right min-w-0">
                                <div className={`font-medium truncate ${c.plant ? 'text-stone-700 group-hover:text-green-700' : 'text-stone-500'}`}>{c.name}</div>
                                {c.plant && <div className="text-xs text-stone-400">{c.plant.height} · {c.plant.sun}</div>}
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center text-lg shrink-0 shadow-sm border-2 border-white">
                                {flowerEmojis2[(i * 2) % flowerEmojis2.length]}
                              </div>
                              {/* Connector line */}
                              <div className="hidden md:block w-6 h-0.5 bg-gradient-to-r from-pink-200 to-green-300 rounded-full"></div>
                            </button>
                          ))}
                        </div>

                        {/* Center: Current plant */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg border-4 border-white ring-4 ring-green-100">
                              <div className="text-center text-white">
                                <div className="text-2xl">🌿</div>
                              </div>
                            </div>
                            {/* Pulse ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-20"></div>
                          </div>
                          <div className="mt-2 text-center">
                            <div className="font-bold text-green-800 text-sm">{p.name.split(" (")[0]}</div>
                            <div className="text-xs text-green-600">{p.height} · {p.sun}</div>
                          </div>
                        </div>

                        {/* Right companions */}
                        <div className="flex flex-col gap-2 items-start flex-1 min-w-0">
                          {rightComps.map((c, i) => (
                            <button key={c.name}
                              onClick={() => { if (c.plant) { setSelectedPlant(c.plant); window.scrollTo(0,0); } }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all w-full justify-start ${
                                c.plant ? 'hover:bg-green-50 cursor-pointer group' : 'cursor-default'
                              }`}>
                              <div className="hidden md:block w-6 h-0.5 bg-gradient-to-r from-green-300 to-pink-200 rounded-full"></div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-lg shrink-0 shadow-sm border-2 border-white">
                                {flowerEmojis2[(i * 2 + 1) % flowerEmojis2.length]}
                              </div>
                              <div className="text-left min-w-0">
                                <div className={`font-medium truncate ${c.plant ? 'text-stone-700 group-hover:text-green-700' : 'text-stone-500'}`}>{c.name}</div>
                                {c.plant && <div className="text-xs text-stone-400">{c.plant.height} · {c.plant.sun}</div>}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ─── BLOOM OVERLAP (stacked by height: tallest → shortest, color-matched to height chart) ─── */}
                    {(() => {
                      // Same color arrays as the Height & Bloom chart
                      const bloomCompGrads = [
                        "from-pink-400 to-pink-500", "from-violet-400 to-violet-500", "from-sky-400 to-sky-500",
                        "from-amber-400 to-amber-500", "from-rose-400 to-rose-500", "from-teal-400 to-teal-500"
                      ];
                      const bloomCompDim = [
                        "bg-pink-50", "bg-violet-50", "bg-sky-50", "bg-amber-50", "bg-rose-50", "bg-teal-50"
                      ];
                      // Build unified list with height info, sorted tallest → shortest
                      const allBloomItems = [
                        { name: p.name.split(" (")[0], isMain: true, blooms: p.bloomMonths || [], max: mainH.max, min: mainH.min, plant: null },
                        ...compData.filter(c => c.blooms.length > 0).map(c => ({ name: c.name, isMain: false, blooms: c.blooms, max: c.max, min: c.min, plant: c.plant }))
                      ].sort((a, b) => b.max - a.max || b.min - a.min);
                      // Assign color index to each companion in sorted order (matching height chart)
                      let cIdx = 0;
                      const allWithColor = allBloomItems.map(item => {
                        if (item.isMain) return { ...item, colorIdx: -1 };
                        const ci = cIdx++;
                        return { ...item, colorIdx: ci };
                      });

                      const renderBloomRow = (item) => {
                        const bloomGrad = item.isMain ? "from-green-500 to-green-600" : bloomCompGrads[item.colorIdx % bloomCompGrads.length];
                        const dimBg = item.isMain ? "bg-green-50" : bloomCompDim[item.colorIdx % bloomCompDim.length];
                        return (
                        <div className={`flex items-center gap-2 ${item.isMain ? 'py-1' : ''}`}>
                          <div className="w-28 md:w-36 shrink-0 text-right flex items-center justify-end gap-1.5">
                            {item.isMain && <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0"><LeafIcon className="w-3 h-3 text-white" /></div>}
                            {item.isMain
                              ? <span className="text-xs font-bold text-green-800 truncate block">{item.name}</span>
                              : <button
                                  onClick={() => { if (item.plant) { setSelectedPlant(item.plant); window.scrollTo(0,0); } }}
                                  className={`text-xs font-medium truncate block w-full text-right ${item.plant ? 'text-stone-600 hover:text-green-700 cursor-pointer' : 'text-stone-500'}`}>
                                  {item.name}
                                </button>
                            }
                            <span className="text-xs text-stone-300 shrink-0 w-10 text-right">{item.max > 0 ? `${item.max}"` : ''}</span>
                          </div>
                          <div className={`flex-1 flex gap-0.5 ${item.isMain ? 'ring-2 ring-green-300 ring-offset-1 rounded-lg' : ''}`}>
                            {MONTHS.map((m, mi) => {
                              const month = mi + 1;
                              const isBloom = item.blooms.includes(month);
                              const cellClass = isBloom
                                ? `bg-gradient-to-b ${bloomGrad} text-white`
                                : `${dimBg} text-stone-300`;
                              return (
                                <div key={m} className={`flex-1 h-6 rounded flex items-center justify-center text-xs font-bold ${cellClass}`}>
                                  <span className="hidden md:inline">{m}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        );
                      };

                      return (
                        <div className="p-5 border-t border-stone-100">
                          <div className="flex items-center gap-2 mb-4">
                            <FlowerIcon className="w-4 h-4 text-pink-500" />
                            <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Bloom Overlap</h4>
                            <span className="text-xs text-stone-400 ml-1">tallest → shortest</span>
                          </div>
                          {/* Month header row */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-28 md:w-36 shrink-0"></div>
                            <div className="flex-1 flex gap-0.5">
                              {MONTHS.map(m => (
                                <div key={m} className="flex-1 text-center text-xs font-semibold text-stone-400">{m}</div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {allWithColor.map((item, idx) => renderBloomRow(item))}
                          </div>
                          {/* Legend — show each plant with its color */}
                          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-stone-100 justify-center">
                            {allWithColor.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-500">
                                {item.isMain
                                  ? <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center"><LeafIcon className="w-3 h-3 text-white" /></div>
                                  : <div className={`w-3 h-3 rounded bg-gradient-to-b ${bloomCompGrads[item.colorIdx % bloomCompGrads.length]}`}></div>
                                }
                                <span>{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* ─── HEIGHT COMPARISON (tallest → shortest) ─── */}
                    {mainH.max > 0 && compData.some(c => c.max > 0) && (() => {
                      const allItems = [
                        { name: p.name.split(" (")[0], isMain: true, min: mainH.min, max: mainH.max, plant: null },
                        ...compData.filter(c => c.max > 0).map(c => ({ name: c.name, isMain: false, min: c.min, max: c.max, plant: c.plant }))
                      ].sort((a, b) => b.max - a.max);
                      const compColors = ["from-pink-500 to-pink-400", "from-violet-500 to-violet-400", "from-sky-500 to-sky-400", "from-amber-500 to-amber-400", "from-rose-500 to-rose-400", "from-teal-500 to-teal-400"];
                      const compBgs = ["bg-pink-100", "bg-violet-100", "bg-sky-100", "bg-amber-100", "bg-rose-100", "bg-teal-100"];
                      const compTexts = ["text-pink-600", "text-violet-600", "text-sky-600", "text-amber-600", "text-rose-600", "text-teal-600"];
                      return (
                        <div className="p-5 border-t border-stone-100">
                          <div className="flex items-center gap-2 mb-2">
                            <HeightIcon className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Height Comparison</h4>
                            <span className="text-xs text-stone-400 ml-1">tallest → shortest</span>
                          </div>
                          <p className="text-xs text-stone-400 mb-4">Vertical bars show min/max height range</p>

                          {/* Height bars */}
                          <div className="flex items-end justify-center gap-2 md:gap-3" style={{minHeight: "180px"}}>
                            {(() => { let ci2 = 0; return allItems.map((item, idx) => {
                              const pctMax = Math.round((item.max / globalMax) * 100);
                              const pctMin = Math.round((item.min / globalMax) * 100);
                              const ci = item.isMain ? 0 : ci2++;
                              const barGrad = item.isMain ? "from-green-700 to-green-500" : compColors[ci % compColors.length];
                              const bgColor = item.isMain ? "bg-green-100" : compBgs[ci % compBgs.length];
                              const txtColor = item.isMain ? "text-green-700" : compTexts[ci % compTexts.length];
                              const isClickable = !item.isMain && item.plant;
                              const Tag = isClickable ? "button" : "div";
                              return (
                                <Tag key={item.name + idx}
                                  {...(isClickable ? {onClick: () => { setSelectedPlant(item.plant); window.scrollTo(0,0); }} : {})}
                                  className={`flex flex-col items-center gap-1 flex-1 max-w-[90px] ${isClickable ? 'cursor-pointer group' : ''}`}>
                                  {/* Rank badge */}
                                  {item.isMain
                                    ? <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-sm ring-2 ring-green-200"><LeafIcon className="w-3.5 h-3.5 text-white" /></div>
                                    : <div className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-stone-100 text-stone-500">{idx + 1}</div>
                                  }
                                  {/* Height bar */}
                                  <div className={`relative w-full flex items-end justify-center`} style={{height: "130px"}}>
                                    <div className={`absolute bottom-0 w-4/5 rounded-t-lg ${bgColor} transition-all ${item.isMain ? 'ring-2 ring-green-300 ring-offset-1' : ''}`} style={{height: `${pctMax}%`}} />
                                    <div className={`relative w-2/5 rounded-t-md bg-gradient-to-t ${barGrad} z-10 transition-all ${isClickable ? 'group-hover:opacity-80' : ''}`} style={{height: `${Math.max(pctMin, 4)}%`, minHeight: "4px"}} />
                                  </div>
                                  {/* Height label */}
                                  <div className={`text-xs font-bold ${txtColor}`}>{item.min}-{item.max}"</div>
                                  {/* Name */}
                                  <div className={`text-xs text-center truncate w-full ${item.isMain ? 'font-bold text-green-800' : 'font-medium text-stone-600 group-hover:text-green-700'}`}>
                                    {item.name.split(" ").slice(0, 2).join(" ")}
                                  </div>
                                </Tag>
                              );
                            }); })()}
                          </div>

                          {/* Legend */}
                          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-stone-100 justify-center">
                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                              <div className="w-3 h-6 rounded bg-gradient-to-t from-green-700 to-green-500"></div>
                              <span>Min height</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                              <div className="w-5 h-6 rounded bg-green-100"></div>
                              <span>Max range</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ─── ISOMETRIC 3D CHART: Height (Z) × Months (X) × Plants/Bloom (Y) ─── */}
                    {mainH.max > 0 && compData.some(c => c.max > 0) && (() => {
                      const isoColors = ["#ec4899","#8b5cf6","#0ea5e9","#f59e0b","#f43f5e","#14b8a6"];
                      const mainClr = "#16a34a";
                      const allP3 = [
                        { name: p.name.split(" (")[0], isMain: true, blooms: p.bloomMonths || [], max: mainH.max, min: mainH.min, plant: null },
                        ...compData.filter(c => c.max > 0).map(c => ({ name: c.name, isMain: false, blooms: c.blooms, max: c.max, min: c.min, plant: c.plant }))
                      ].sort((a, b) => b.max - a.max || b.min - a.min);
                      let isoCI = 0;
                      const isoPlants = allP3.map(item => {
                        if (item.isMain) return { ...item, color: mainClr, ci: -1 };
                        const i = isoCI++;
                        return { ...item, color: isoColors[i % isoColors.length], ci: i };
                      });
                      const isoGMax = Math.max(...isoPlants.map(pl => pl.max), 1);

                      // Axes: X = months (12 cols, going right+down), Y = plants (rows, going left+down into depth), Z = height (up)
                      const nMonths = 12;
                      const nPlants = isoPlants.length;
                      const cellX = 30;  // spacing per month along X
                      const cellY = 28;  // spacing per plant along Y (depth)
                      const maxH = 140;  // max bar pixel height for Z
                      const barW = 18;   // bar front face width
                      const barD = 14;   // bar side depth

                      // Isometric projection: col = month (X-axis), row = plant (Y-axis into depth)
                      // leftPad ensures deepest plant row + labels don't clip on the left
                      const leftPad = Math.max(120, nPlants * cellY * 0.65 + 90);
                      // topPad ensures the tallest bar + label + icon never clips
                      const topPad = maxH + 40;
                      const isoSx = (col, row) => leftPad + col * cellX * 1 - row * cellY * 0.65;
                      const isoSy = (col, row, h) => topPad + col * cellX * 0.32 + row * cellY * 0.5 - h;

                      const svgW = isoSx(nMonths, 0) + 80;
                      const svgH = isoSy(nMonths - 1, nPlants - 1, 0) + 90;

                      const darken = (hex, amt) => {
                        const r = Math.max(0, parseInt(hex.slice(1,3),16) - amt);
                        const g = Math.max(0, parseInt(hex.slice(3,5),16) - amt);
                        const b = Math.max(0, parseInt(hex.slice(5,7),16) - amt);
                        return `rgb(${r},${g},${b})`;
                      };
                      const lighten = (hex, amt) => {
                        const r = Math.min(255, parseInt(hex.slice(1,3),16) + amt);
                        const g = Math.min(255, parseInt(hex.slice(3,5),16) + amt);
                        const b = Math.min(255, parseInt(hex.slice(5,7),16) + amt);
                        return `rgb(${r},${g},${b})`;
                      };

                      return (
                        <div className="p-5 border-t border-stone-100">
                          <div className="flex items-center gap-2 mb-2">
                            <HeightIcon className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide">3D Bloom · Height · Season</h4>
                            <span className="text-xs text-stone-400 ml-1">isometric</span>
                          </div>
                          <p className="text-xs text-stone-400 mb-5">Months across (X) · plants into depth (Y) · bar height = plant height (Z). Colored bars = bloom months.</p>

                          <div className="overflow-x-auto pb-2">
                            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{width: `${Math.min(svgW, 750)}px`, height: `${Math.min(svgH, 520)}px`, maxWidth:"100%"}} xmlns="http://www.w3.org/2000/svg">

                              {/* Ground grid lines — plant rows (Y-axis, going into depth) */}
                              {Array.from({length: nPlants + 1}, (_, ri) => {
                                const x1 = isoSx(0, ri);
                                const y1 = isoSy(0, ri, 0);
                                const x2 = isoSx(nMonths, ri);
                                const y2 = isoSy(nMonths, ri, 0);
                                return <line key={"gy"+ri} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ri === 0 ? "#a8a29e" : "#e7e5e4"} strokeWidth={ri === 0 ? 1.5 : 0.5} />;
                              })}
                              {/* Ground grid lines — month columns (X-axis) */}
                              {Array.from({length: nMonths + 1}, (_, ci) => {
                                const x1 = isoSx(ci, 0);
                                const y1 = isoSy(ci, 0, 0);
                                const x2 = isoSx(ci, nPlants);
                                const y2 = isoSy(ci, nPlants, 0);
                                return <line key={"gx"+ci} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ci === 0 ? "#a8a29e" : "#e7e5e4"} strokeWidth={ci === 0 ? 1.5 : 0.5} />;
                              })}

                              {/* Z-axis (height) vertical line from origin */}
                              <line x1={isoSx(0,0)} y1={isoSy(0,0,0)} x2={isoSx(0,0)} y2={isoSy(0,0,maxH + 10)} stroke="#a8a29e" strokeWidth={1.5} />
                              {/* Z-axis ticks */}
                              {[0, 25, 50, 75, 100].map(pct => {
                                const val = Math.round((pct / 100) * isoGMax);
                                const h = (pct / 100) * maxH;
                                const tx = isoSx(0, 0) - 6;
                                const ty = isoSy(0, 0, h);
                                return (
                                  <g key={"zt"+pct}>
                                    <line x1={isoSx(0,0) - 4} y1={ty} x2={isoSx(0,0)} y2={ty} stroke="#a8a29e" strokeWidth={1} />
                                    <text x={tx} y={ty + 3} textAnchor="end" fontSize="8" fill="#a8a29e" fontFamily="monospace">{val}"</text>
                                  </g>
                                );
                              })}
                              {/* Z-axis label removed */}

                              {/* Month labels along X-axis (front edge) */}
                              {MONTHS.map((m, mi) => {
                                const lx = isoSx(mi + 0.5, nPlants) + 2;
                                const ly = isoSy(mi + 0.5, nPlants, 0) + 14;
                                return <text key={"ml"+mi} x={lx} y={ly} textAnchor="middle" fontSize="7" fill="#78716c" fontWeight="500">{m}</text>;
                              })}

                              {/* Plant name labels along Y-axis (left side, going into depth) */}
                              {isoPlants.map((plant, yi) => {
                                const lx = isoSx(0, yi + 0.5) - 8;
                                const ly = isoSy(0, yi + 0.5, 0) + 4;
                                return (
                                  <g key={"pl"+yi}>
                                    {plant.isMain && <circle cx={lx - 2} cy={ly - 5} r={5} fill="#16a34a" />}
                                    {plant.isMain && <text x={lx - 2} y={ly - 3} textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">&#9670;</text>}
                                    <text x={lx - (plant.isMain ? 10 : 0)} y={ly} textAnchor="end" fontSize="7" fill={plant.isMain ? "#166534" : "#78716c"} fontWeight={plant.isMain ? "bold" : "500"}>{plant.name.split(" ").slice(0,2).join(" ")}</text>
                                    <text x={lx - (plant.isMain ? 10 : 0)} y={ly + 9} textAnchor="end" fontSize="6" fill="#a8a29e">{plant.max}"</text>
                                  </g>
                                );
                              })}

                              {/* Bloom lines on the floor (parallel to X-axis) + vertical height markers — render back-to-front */}
                              {Array.from({length: nPlants}).map((_, yi) => nPlants - 1 - yi).map(yi => {
                                const plant = isoPlants[yi];
                                const barHPx = Math.max(Math.round((plant.max / isoGMax) * maxH), 6);
                                const clr = plant.color;
                                const dClr = darken(clr, 50);
                                const lClr = lighten(clr, 60);
                                const bloomMonths = Array.from({length: nMonths}, (_, i) => plant.blooms.includes(i + 1));

                                const segments = [];
                                let start = null;
                                for (let mi = 0; mi <= nMonths; mi++) {
                                  if (mi < nMonths && bloomMonths[mi]) {
                                    if (start === null) start = mi;
                                  } else {
                                    if (start !== null) {
                                      segments.push([start, mi - 1]);
                                      start = null;
                                    }
                                  }
                                }

                                return (
                                  <g key={`row${yi}`}>
                                    {/* Non-bloom dots */}
                                    {Array.from({length: nMonths}, (_, mi) => {
                                      if (bloomMonths[mi]) return null;
                                      const cx = isoSx(mi + 0.5, yi + 0.5);
                                      const cy = isoSy(mi + 0.5, yi + 0.5, 0);
                                      return <circle key={`dot${yi}-${mi}`} cx={cx} cy={cy} r={1.5} fill="#e7e5e4" />;
                                    })}
                                    {/* Bloom segments: lines on the floor (h=0), parallel to X-axis */}
                                    {segments.map(([s, e], si) => {
                                      // Floor line endpoints
                                      const x1 = isoSx(s + 0.15, yi + 0.5);
                                      const y1 = isoSy(s + 0.15, yi + 0.5, 0);
                                      const x2 = isoSx(e + 0.85, yi + 0.5);
                                      const y2 = isoSy(e + 0.85, yi + 0.5, 0);
                                      // Top line endpoints (at full height)
                                      const tx1 = isoSx(s + 0.15, yi + 0.5);
                                      const ty1 = isoSy(s + 0.15, yi + 0.5, barHPx);
                                      const tx2 = isoSx(e + 0.85, yi + 0.5);
                                      const ty2 = isoSy(e + 0.85, yi + 0.5, barHPx);
                                      // Wall polygon: bottom-left, bottom-right, top-right, top-left
                                      const wallPath = `M${x1},${y1} L${x2},${y2} L${tx2},${ty2} L${tx1},${ty1} Z`;
                                      // Plant icon at midpoint top
                                      const midCol = (s + 0.15 + e + 0.85) / 2;
                                      const midTx = isoSx(midCol, yi + 0.5);
                                      const midTy = isoSy(midCol, yi + 0.5, barHPx);
                                      const iconSz = Math.max(8, Math.min(16, barHPx * 0.12));
                                      return (
                                        <g key={`seg${yi}-${si}`} style={{filter: plant.isMain ? `drop-shadow(0 0 4px ${clr}55)` : "none"}}>
                                          {/* Wall left vertical edge */}
                                          <line x1={x1} y1={y1} x2={tx1} y2={ty1} stroke={clr} strokeWidth={1.5} opacity={0.6} />
                                          {/* Glow on floor */}
                                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={clr} strokeWidth={7} strokeLinecap="round" opacity={0.10} />
                                          {/* Floor bloom line */}
                                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={clr} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
                                          {/* Start/end circles on floor */}
                                          <circle cx={x1} cy={y1} r={2.5} fill={clr} stroke="white" strokeWidth={0.8} />
                                          <circle cx={x2} cy={y2} r={2.5} fill={clr} stroke="white" strokeWidth={0.8} />
                                          {/* Height label at top of left riser */}
                                          <text x={tx1} y={ty1 - 4} textAnchor="middle" fontSize="7" fill={dClr} fontWeight="bold">{plant.max}"</text>
                                        </g>
                                      );
                                    })}
                                  </g>
                                );
                              })}

                              {/* Axis labels removed */}
                            </svg>
                          </div>

                          {/* Legend */}
                          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-stone-100 justify-center">
                            {isoPlants.map((plant, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-500">
                                {plant.isMain
                                  ? <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center"><LeafIcon className="w-3 h-3 text-white" /></div>
                                  : <div className="w-3 h-3 rounded" style={{background: plant.color}}></div>
                                }
                                <span>{plant.name}</span>
                              </div>
                            ))}
                            <div className="flex items-center gap-1.5 text-xs text-stone-400 ml-2 pl-2 border-l border-stone-200">
                              <svg width="32" height="20" viewBox="0 0 32 20"><path d="M4,18 L28,18 L28,4 L4,4 Z" fill="#16a34a" opacity="0.18"/><line x1="4" y1="18" x2="28" y2="18" stroke="#16a34a" strokeWidth="2" opacity="0.7"/><line x1="4" y1="4" x2="28" y2="4" stroke="#16a34a" strokeWidth="2" opacity="0.85"/><line x1="4" y1="18" x2="4" y2="4" stroke="#16a34a" strokeWidth="1" opacity="0.6"/><line x1="28" y1="18" x2="28" y2="4" stroke="#16a34a" strokeWidth="1" opacity="0.6"/></svg>
                              <span>Wall height = plant height · floor line = bloom span</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}

            {/* ─── GARDEN STYLES ─── */}
            <div className="px-6 md:px-8 pb-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
                <h3 className="font-bold text-stone-800 text-lg mb-3 flex items-center gap-2">
                  <GardenIcon className="w-5 h-5 text-violet-500" /> Garden Styles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {p.gardenStyles.map((s, i) => {
                    const styleColors = ["bg-violet-100 text-violet-800 border-violet-200", "bg-purple-100 text-purple-800 border-purple-200", "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200", "bg-pink-100 text-pink-800 border-pink-200", "bg-rose-100 text-rose-800 border-rose-200"];
                    return <span key={s} className={`${styleColors[i % styleColors.length]} px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm`}>{s}</span>;
                  })}
                </div>
              </div>
            </div>

            {/* ─── IN MY GARDEN ─── */}
            {p.planted && p.planted.length > 0 && (
              <div className="px-6 md:px-8 pb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    In My Garden
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {p.planted.map((cultivar, i) => (
                      <div key={i} className="bg-white border border-green-200 text-green-800 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> {cultivar}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── CLEVELAND-PROVEN CULTIVARS ─── */}
            {p.clevelandCultivars && p.clevelandCultivars.length > 0 && (
              <div className="px-6 md:px-8 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-blue-500" /> Cleveland-Proven Cultivars
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {p.clevelandCultivars.map((cultivar, i) => (
                      <span key={i} className="bg-white border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-sm font-medium shadow-sm flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        {cultivar}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── POPULAR CULTIVARS ─── */}
            <div className="px-6 md:px-8 pb-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
                <h3 className="font-bold text-stone-800 text-lg mb-3 flex items-center gap-2">
                  <FlowerIcon className="w-5 h-5 text-rose-400" /> Popular Cultivars
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {p.cultivars.map((c, i) => {
                    const isPlanted = p.planted && p.planted.some(pl => c.toLowerCase().includes(pl.toLowerCase()));
                    return (
                      <div key={i} className={`text-sm px-4 py-3 rounded-lg flex items-start gap-2 ${isPlanted ? 'bg-green-50 border border-green-200' : 'bg-stone-50 border border-stone-100'}`}>
                        <span className={`shrink-0 mt-0.5 ${isPlanted ? 'text-green-500' : 'text-stone-300'}`}>{isPlanted ? <CheckCircleIcon className="w-4 h-4" /> : <FlowerIcon className="w-4 h-4" />}</span>
                        <span className={isPlanted ? 'text-green-800 font-medium' : 'text-stone-700'}>{c}{isPlanted && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">planted</span>}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── CLEVELAND LIGHT NOTES ─── */}
            {p.clevelandLightNote && (
              <div className="px-6 md:px-8 pb-6">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0"><SunIcon className="w-6 h-6 text-yellow-600" /></div>
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-1">Light Conditions for Cleveland</h3>
                    <p className="text-sm text-yellow-700 leading-relaxed">{p.clevelandLightNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── WHERE TO BUY ─── */}
            {p.whereToBuy && (
              <div className="px-6 md:px-8 pb-6">
                <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0"><ShoppingIcon className="w-6 h-6 text-purple-600" /></div>
                  <div>
                    <h3 className="font-bold text-purple-800 mb-1">Where to Buy</h3>
                    <p className="text-sm text-purple-700 mb-1">{p.whereToBuy}</p>
                    {p.whenAvailable && (
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                        <CalendarIcon className="w-3 h-3" /> Available: {p.whenAvailable}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── CARE CALENDAR ─── */}
            <div className="px-6 md:px-8 pb-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
                <h3 className="font-bold text-stone-800 text-lg mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-green-500" /> Monthly Care Calendar
                </h3>
                <div className="space-y-2">
                  {Object.entries(p.care || {}).map(([month, task]) => {
                    const season = getMonthSeason(Number(month));
                    const seasonBg = {spring: "bg-emerald-50 border-emerald-200", summer: "bg-amber-50 border-amber-200", fall: "bg-orange-50 border-orange-200", winter: "bg-blue-50 border-blue-200"};
                    const seasonText = {spring: "text-emerald-700", summer: "text-amber-700", fall: "text-orange-700", winter: "text-blue-700"};
                    const seasonBadge = {spring: "bg-emerald-100 text-emerald-800", summer: "bg-amber-100 text-amber-800", fall: "bg-orange-100 text-orange-800", winter: "bg-blue-100 text-blue-800"};
                    return (
                      <div key={month} className={`flex items-start gap-4 text-sm ${seasonBg[season]} border rounded-xl px-4 py-3`}>
                        <span className={`${seasonBadge[season]} font-bold px-3 py-1 rounded-lg shrink-0 text-center min-w-[3.5rem]`}>{MONTHS[month - 1]}</span>
                        <span className={`${seasonText[season]} leading-relaxed`}>{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── FERTILIZER ─── */}
            <div className="px-6 md:px-8 pb-6">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0"><FertilizerIcon className="w-6 h-6 text-amber-600" /></div>
                <div>
                  <h3 className="font-bold text-amber-800 mb-1">Fertilizer</h3>
                  <p className="text-sm text-amber-700">{p.fertilizer}</p>
                  {p.fertMonth.length > 0 && (
                    <div className="flex gap-1.5 mt-2">{p.fertMonth.map(m => (
                      <span key={m} className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg">{MONTHS[m-1]}</span>
                    ))}</div>
                  )}
                </div>
              </div>
            </div>

            {/* ─── VIDEO LINK ─── */}
            <div className="px-6 md:px-8 pb-8">
              <a href={p.video} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg font-semibold">
                <VideoIcon className="w-5 h-5" /> Watch Care Videos on YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-stone-50 transition-colors duration-300 ${darkMode ? "dark-mode" : ""}`}>
      <DarkModeStyle />
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-4 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Joshi Garden Guide</h1>
              <p className="text-green-200 text-sm">Zone 6a/6b • {PLANTS.length} Plants • Year-Round Care</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full transition-colors ${darkMode ? "bg-green-900/50 hover:bg-green-900/70 text-yellow-300" : "bg-green-600/40 hover:bg-green-600/60 text-green-100"}`} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {darkMode ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
          </div>
          <div className="flex gap-1 mt-3">
            {[
              {id: "plants", label: `Plants (${filteredPlants.length})`},
              {id: "calendar", label: "Care Calendar"},
              {id: "tasks", label: `Tasks ${completedCount > 0 ? `(${completedCount} done)` : ""}`}
            ].map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id)}
                className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${
                  view === tab.id ? 'bg-white text-green-800' : 'bg-green-600/40 text-green-100 hover:bg-green-600/60'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Plants View */}
        {view === "plants" && (
          <>
            {/* Search & Filter Bar */}
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <input type="text" placeholder="Search plants, cultivars, descriptions..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 border border-stone-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                <button onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                    showFilters ? 'bg-green-700 text-white border-green-700' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  }`}>
                  Filters {Object.values(filters).some(v => v) ? "●" : ""}
                </button>
              </div>

              {showFilters && (
                <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1">Plant Type</label>
                      <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}
                        className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white">
                        <option value="">All Types</option>
                        {PLANT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1">Sun</label>
                      <select value={filters.sun} onChange={e => setFilters({...filters, sun: e.target.value})}
                        className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white">
                        <option value="">Any Sun</option>
                        {SUN_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1">Bloom Month</label>
                      <select value={filters.bloomMonth} onChange={e => setFilters({...filters, bloomMonth: Number(e.target.value)})}
                        className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white">
                        <option value={0}>Any Month</option>
                        {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1">Attracts</label>
                      <select value={filters.attracts} onChange={e => setFilters({...filters, attracts: e.target.value})}
                        className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white">
                        <option value="">Any</option>
                        {ATTRACTS_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      {key: "inMyGarden", label: "In My Garden"},
                      {key: "deerResistant", label: "Deer Resistant"},
                      {key: "rabbitResistant", label: "Rabbit Resistant"},
                      {key: "droughtTolerant", label: "Drought Tolerant"},
                      {key: "nativeOhio", label: "Native to Ohio"},
                      {key: "reblooming", label: "Reblooming"}
                    ].map(f => (
                      <button key={f.key} onClick={() => setFilters({...filters, [f.key]: !filters[f.key]})}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filters[f.key] ? 'bg-green-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}>
                        {filters[f.key] ? "✓ " : ""}{f.label}
                      </button>
                    ))}
                    <button onClick={() => setFilters({type:"",sun:"",deerResistant:false,rabbitResistant:false,droughtTolerant:false,nativeOhio:false,reblooming:false,bloomMonth:0,attracts:"",evergreen:false,inMyGarden:false})}
                      className="px-3 py-1.5 rounded-full text-sm text-red-600 hover:bg-red-50">
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Plant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPlants.map(p => (
                <div key={p.id} onClick={() => { setSelectedPlant(p); setView("detail"); }}
                  className="bg-white rounded-lg border border-stone-200 p-4 cursor-pointer hover:shadow-md hover:border-green-300 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-stone-800 group-hover:text-green-700 transition-colors">{p.name}</h3>
                      <p className="text-xs text-stone-500 italic">{p.botanical}</p>
                    </div>
                    <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600 shrink-0">{p.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.planted && p.planted.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">In My Garden</span>}
                    {p.bloomMonths.length > 0 ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getBloomColor(p.bloomMonths)}`}>
                        {getBloomSeason(p.bloomMonths)} Bloom
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Foliage</span>
                    )}
                    {p.nativeOhio && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Native</span>}
                    {p.reblooming && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">Reblooms</span>}
                    {p.deerResistant && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Deer✗</span>}
                  </div>
                  <div className="text-xs text-stone-500 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>{p.height}</span>
                    <span>{p.sun}</span>
                    <span>Water: {p.waterReq}</span>
                    {p.attracts.length > 0 && <span>{p.attracts.map(a => a === "Butterflies" ? "🦋" : a === "Bees" ? "🐝" : a === "Hummingbirds" ? "🐦" : "🐦").join("")}</span>}
                  </div>
                </div>
              ))}
            </div>
            {filteredPlants.length === 0 && (
              <div className="text-center py-12 text-stone-500">
                <p className="text-lg">No plants match your filters.</p>
                <button onClick={() => {setFilters({type:"",sun:"",deerResistant:false,rabbitResistant:false,droughtTolerant:false,nativeOhio:false,reblooming:false,bloomMonth:0,attracts:"",evergreen:false,inMyGarden:false}); setSearch("");}}
                  className="mt-2 text-green-600 hover:text-green-700">Clear all filters</button>
              </div>
            )}
          </>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setCalendarMonth(m => m > 1 ? m - 1 : 12)}
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50">←</button>
              <h2 className="text-xl font-bold text-stone-800 flex-1 text-center">{FULL_MONTHS[calendarMonth - 1]} Care Calendar</h2>
              <button onClick={() => setCalendarMonth(m => m < 12 ? m + 1 : 1)}
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50">→</button>
            </div>

            {/* Month Quick Nav */}
            <div className="flex gap-1 mb-4 justify-center">
              {MONTHS.map((m, i) => (
                <button key={m} onClick={() => setCalendarMonth(i + 1)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    calendarMonth === i + 1 ? 'bg-green-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}>{m}</button>
              ))}
            </div>

            {/* What's Blooming */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-pink-800 mb-2">Blooming in {FULL_MONTHS[calendarMonth - 1]}</h3>
              <div className="flex flex-wrap gap-2">
                {PLANTS.filter(p => p.bloomMonths.includes(calendarMonth)).map(p => (
                  <span key={p.id} className="bg-white px-2 py-1 rounded text-sm text-pink-700 border border-pink-200 cursor-pointer hover:bg-pink-100"
                    onClick={() => { setSelectedPlant(p); setView("detail"); }}>
                    {p.name}
                  </span>
                ))}
                {PLANTS.filter(p => p.bloomMonths.includes(calendarMonth)).length === 0 && (
                  <span className="text-sm text-pink-600">No perennials blooming this month — enjoy winter structure!</span>
                )}
              </div>
            </div>

            {/* What to Fertilize */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-amber-800 mb-2">Fertilize in {FULL_MONTHS[calendarMonth - 1]}</h3>
              <div className="space-y-1">
                {PLANTS.filter(p => p.fertMonth.includes(calendarMonth)).map(p => (
                  <div key={p.id} className="flex justify-between items-center text-sm bg-white px-3 py-2 rounded border border-amber-100 cursor-pointer hover:bg-amber-50"
                    onClick={() => { setSelectedPlant(p); setView("detail"); }}>
                    <span className="font-medium text-amber-900">{p.name}</span>
                    <span className="text-amber-700">{p.fertilizer}</span>
                  </div>
                ))}
                {PLANTS.filter(p => p.fertMonth.includes(calendarMonth)).length === 0 && (
                  <span className="text-sm text-amber-600">No fertilizing needed this month.</span>
                )}
              </div>
            </div>

            {/* All Tasks for Month */}
            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <h3 className="font-bold text-stone-800 mb-3">All {FULL_MONTHS[calendarMonth - 1]} Tasks ({currentTasks.length})</h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {currentTasks.map((t, i) => {
                  const key = `${calendarMonth}-${t.plantId}-${i}`;
                  return (
                    <div key={key} className={`flex items-start gap-2 text-sm px-3 py-2 rounded cursor-pointer transition-colors ${
                      completedTasks[key] ? 'bg-green-50 border border-green-200' : t.isFertilizer ? 'bg-amber-50 border border-amber-100' : 'bg-stone-50 border border-stone-100'
                    }`} onClick={() => toggleTask(key)}>
                      <span className="mt-0.5">{completedTasks[key] ? "✅" : "⬜"}</span>
                      <div>
                        <span className="font-medium text-stone-800">{t.plantName}:</span>{" "}
                        <span className={completedTasks[key] ? "line-through text-stone-400" : "text-stone-700"}>{t.task}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {view === "tasks" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-stone-200 p-4">
              <h2 className="text-xl font-bold text-stone-800 mb-2">Task Tracker</h2>
              <p className="text-stone-600 text-sm mb-4">Track your garden care progress. Tasks reset when you change months.</p>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">{currentTasks.length}</div>
                  <div className="text-xs text-blue-600">Total Tasks</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                  <div className="text-2xl font-bold text-green-700">
                    {currentTasks.filter((_, i) => completedTasks[`${calendarMonth}-${currentTasks[i].plantId}-${i}`]).length}
                  </div>
                  <div className="text-xs text-green-600">Completed</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center border border-amber-100">
                  <div className="text-2xl font-bold text-amber-700">
                    {currentTasks.length - currentTasks.filter((_, i) => completedTasks[`${calendarMonth}-${currentTasks[i].plantId}-${i}`]).length}
                  </div>
                  <div className="text-xs text-amber-600">Remaining</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setCalendarMonth(m => m > 1 ? m - 1 : 12)} className="px-2 py-1 bg-stone-100 rounded hover:bg-stone-200">←</button>
                <span className="font-medium">{FULL_MONTHS[calendarMonth - 1]}</span>
                <button onClick={() => setCalendarMonth(m => m < 12 ? m + 1 : 1)} className="px-2 py-1 bg-stone-100 rounded hover:bg-stone-200">→</button>
              </div>

              {/* Pending Tasks */}
              <div className="space-y-1">
                {currentTasks.map((t, i) => {
                  const key = `${calendarMonth}-${t.plantId}-${i}`;
                  const done = completedTasks[key];
                  return (
                    <div key={key} className={`flex items-start gap-2 text-sm px-3 py-2 rounded cursor-pointer transition-all ${
                      done ? 'bg-green-50/50 border border-green-100 opacity-60' : 'bg-white border border-stone-200 hover:border-green-300'
                    }`} onClick={() => toggleTask(key)}>
                      <span className="mt-0.5 text-lg">{done ? "✅" : "⬜"}</span>
                      <div className="flex-1">
                        <span className={`font-medium ${done ? 'text-green-600' : 'text-stone-800'}`}>{t.plantName}</span>
                        <p className={`${done ? "line-through text-stone-400" : "text-stone-600"}`}>{t.task}</p>
                      </div>
                      {t.isFertilizer && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Fertilize</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-stone-200 bg-white p-4 text-center text-stone-500 text-xs">
        <p>Joshi Garden Guide • Zone 6a/6b • {PLANTS.length} Plants</p>
        <p className="mt-1">
          Resources: <a href="https://www.petittigardencenter.com/resources/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Petitti Garden Centers</a>
          {" • "}<a href="https://www.almanac.com/gardening/planting-calendar/oh/Cleveland" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Old Farmer's Almanac - Cleveland</a>
        </p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-4 rounded-xl border border-stone-200 shadow-sm">
      <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</div>
      <div className="font-bold text-stone-800 mt-1">{value}</div>
    </div>
  );
}
