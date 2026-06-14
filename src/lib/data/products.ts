export type Handle =
  | 'forzudo-rojo'
  | 'forzudo-blanco'
  | 'forzudo-combo'
  | 'sardino-rojo'
  | 'sardino-blanco'
  | 'sardino-combo'
  | 'carmeleta-orange'
  | 'carmeleta-blanco'
  | 'carmeleta-rosso'
  | 'carmeleta-combo'
  | 'mix-red'
  | 'mix-white'
  | 'mix-trio'
  | 'tabira'

interface Vermouth {
  extraImages: Array<{ altText: string; url: string }>
  image: string
  brand: string
  origin: string
  recommendation: string
  scores: { body: number; fruityness: number; spiciness: number; sweetness: number }
  sizeAndDegrees: string
  taste: string
}

export const vermouths: Record<Handle, Vermouth> = {
  'forzudo-rojo': {
    brand: 'Forzudo',
    extraImages: [
      {
        altText: 'Bartender forbereder en cocktail med Forzudo Rojo',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/b48bedf5-af9d-4072-85fe-40b225ed8e00',
      },
      {
        altText: 'Statue kigger ned på et glas og en flaske Forzudo Rojo',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/9e05a52c-c26c-41e6-fdc2-29df90153800',
      },
      {
        altText: 'Negroni cocktail lavet med Forzudo Rojo',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/e320c5f1-3b7c-4b6f-b76c-61273e76fc00',
      },
      {
        altText: 'Bordanretning med Forzudo Rojo/Blanco og skiveskåret grape frugt',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/77370af8-a66c-4301-89ed-2aa376436800',
      },
      {
        altText: 'Forzudo Rojo bliver skænket i glas med is og grape',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/e531d91a-1702-4d63-5a3d-0ee5f146fe00',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d9b17e95-18c8-4ded-a15b-182fb859c800',
    origin: 'El Bierzo Leon, Nordvest Spanien 100 cl. / 15%',
    recommendation: 'Bør nydes afkølet og med en skive grape.',
    scores: { sweetness: 1, fruityness: 2, body: 2, spiciness: 3 },
    sizeAndDegrees: '100 cl. / 15%',
    taste:
      'Smagen er levende og koncentreret, hvor især kardemommen og de tørrede frugter er stærke, derudover er der nuancer af lakrids og vanilje. Duften er intens af søde krydderier blandet med tørret frugt som afsluttes med noter af kaffe. Dette gør sig gældende i en lang og vedvarende sødme med et perfekt bitter touch.',
  },
  'forzudo-blanco': {
    brand: 'Forzudo',
    extraImages: [
      {
        altText: 'Forzudo Blanco bliver taget fra en hylde',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/02126de2-3b95-497e-bdc5-d1e6f3a06500',
      },
      {
        altText: 'Bordanretning med Forzudo Rojo/Blanco og skiveskåret grape frugt',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/77370af8-a66c-4301-89ed-2aa376436800',
      },
      {
        altText: 'Vermouth Tonic på Forzudo Blanco med oliven på et café bord',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/9919bc7c-d806-41fa-2af1-98ac6aca7b00',
      },
      {
        altText: 'Vermouth Spritz på Forzudo Blanco med oliven på et café bord',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/dcc14072-7377-4b69-8715-7e9fb7758800',
      },
      {
        altText: 'Forzudo Blanco cocktail',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/7d277bd1-e2c6-4c74-0b97-2a3bab563a00',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/e5eb8eb6-444c-4217-6143-e652c2a9a100',
    origin: 'El Bierzo Leon, Nordvest Spanien 100 cl. / 15%',
    recommendation: 'Bør nydes afkølet og med en skive grape.',
    scores: { sweetness: 2, fruityness: 2, body: 2, spiciness: 2 },
    sizeAndDegrees: '100 cl. / 15%',
    taste:
      'Forzudo Blanco giver en cremet fornemmelse med smagsnuancer af bittert æble, kandiseret citron, grønne urter og et strejf af tropiske frugter. Her fås en meget balanceret Vermouth med lige dele sødme og bitter.',
  },
  'forzudo-combo': {
    brand: 'Forzudo',
    extraImages: [
      {
        altText: 'Bordanretning med Forzudo Rojo/Blanco og skiveskåret grape frugt',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/77370af8-a66c-4301-89ed-2aa376436800',
      },
      {
        altText: 'Forzudo Rojo bliver skænket i glas med is og grape',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/e531d91a-1702-4d63-5a3d-0ee5f146fe00',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d3977254-55e5-47f2-5a20-fbb544816800',
    origin: 'El Bierzo Leon, Nordvest Spanien 2 x 100 cl. / 15%',
    recommendation:
      'Serveres afkølet med is og citrus. Rojo er oplagt som aperitif eller i Negroni og Manhattan, mens Blanco er frisk, aromatisk og perfekt med grape.',
    scores: { sweetness: 2, fruityness: 2, body: 2, spiciness: 3 },
    sizeAndDegrees: '2 x 100 cl. / 15%',
    taste:
      'En pakke med Forzudo Rojo og Blanco fra León. Rojo er fyldig, krydret og bittersød, mens Blanco er lys, frisk og aromatisk med citrus, bitterhed og afrundet sødme.',
  },
  'sardino-rojo': {
    brand: 'Sardino',
    extraImages: [
      {
        altText: 'En hånd tager en flaske Sardino Rojo fra en hylde',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/fd9d8fc9-6d17-4d8a-fe57-adac09891200',
      },
      {
        altText: 'Sardino Rojo Cocktail',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/02f9761c-d8dd-4994-365f-5182984a4400',
      },
      {
        altText: 'Sardino Rojo flasker på en hylde',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/d451ef0b-523a-4cb9-aeaa-dda44e3ebe00',
      },
      {
        altText: '2 Sardino Rojo Cocktails',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/fced61c9-3b8d-4467-7957-1dc723784000',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/89f026f1-f193-45b4-bf8a-a9f9d89c3e00',
    origin: 'Galicien, Nordvestkysten Spanien 75 cl / 15%',
    recommendation:
      'Serveres “on the rocks”, med en skive appelsin eller citron, nydes som aperitif med en lille snack ved hånden f.eks oliven, chips eller “fisk på dåse”',
    scores: { sweetness: 5, fruityness: 3, body: 5, spiciness: 4 },
    sizeAndDegrees: '75 cl. / 15%',
    taste:
      'En rigtig god allround rød Vermouth som hverken er for sød, tør eller bitter - perfekt til enhver lejlighed. Noter af karamel, camille & kanel.',
  },
  'sardino-blanco': {
    brand: 'Sardino',
    extraImages: [
      {
        altText: 'Bakke med Sardino Blanco anretning',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/2ecc64e1-b948-40b1-93a1-83c307b10900',
      },
      {
        altText: 'Sardino Rojo/Blanco på en stige',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/8e2fdb55-16f5-4a44-1708-f2aff1171300',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/910a8496-b9ad-4685-f102-dea0a0e60d00',
    origin: 'Galicien, Nordvestkysten Spanien 75 cl / 15%',
    recommendation:
      'Serveres ved 6-8 grader i glas med oliven og en skive appelsin. Nydes til forretter eller som aperitif med en lille snack ved hånden f.eks oliven, chips eller “fisk på dåse”.',
    scores: { sweetness: 5, fruityness: 3, body: 4, spiciness: 2 },
    sizeAndDegrees: '75 cl. / 15%',
    taste:
      'Halmgul i farven, stor harmoni og balance i smag, sødt og syrligt med friske og frugtige nuancer, meget aromatisk og med en lang smagsudholdenhed. Noter af blomster, planter og botaniske stoffer.',
  },
  'sardino-combo': {
    brand: 'Sardino',
    extraImages: [
      {
        altText: 'Sardino Rojo/Blanco på en stige',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/8e2fdb55-16f5-4a44-1708-f2aff1171300',
      },
      {
        altText: 'Carmeleta Orange, Sardino Rojo & Sardino Blanco på en stige',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/b44ab755-b6ac-440f-c1ae-4faa077fc400',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/ad5d1750-dfa9-4aae-0bf3-b86e9b03b600',
    origin: 'Galicien, Nordvestkysten Spanien 2 x 75 cl / 15%',
    recommendation:
      'Blanco fungerer perfekt som frisk aperitif på terrassen, mens Rojo er oplagt før maden eller i klassiske cocktails som Negroni og Manhattan.',
    scores: { sweetness: 5, fruityness: 3, body: 5, spiciness: 3 },
    sizeAndDegrees: '2 x 75 cl. / 15%',
    taste: 'Blanco er lys, frisk og aromatisk, mens Rojo har mere fylde, krydderi og bitterhed.',
  },
  'carmeleta-orange': {
    brand: 'Carmeleta',
    extraImages: [
      {
        altText: 'Carmeleta Orange Vermouth Tonic cocktails',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/13485ffe-2691-45bc-69e8-3bc54dc6bc00',
      },
      {
        altText: 'Carmeleta Orange serveret i glas med skåret appelsin',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/497dbaa1-1fd1-4868-6a12-d8a440987000',
      },
      {
        altText: 'Carmeleta Orange, Sardino Rojo & Sardino Blanco på en stige',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/b44ab755-b6ac-440f-c1ae-4faa077fc400',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/682acd17-1447-46b6-af38-73a4e9864600',
    origin: 'L’Alquería de la Comtessa Valencia 75cl / 15%',
    recommendation: 'Serveres kold med is, og evt. et jordbær eller appelsin.',
    scores: { sweetness: 4, fruityness: 4, body: 5, spiciness: 1 },
    sizeAndDegrees: '75 cl. / 15%',
    taste:
      'Noter af citrusfrugter, kager, vanille karamel. Intens smag, afbalanceret med syrlighed. Let bitter citrus og krydret eftersmag. Carmeleta Orange har en frisk duft, balanceret med syrlighed samt søde og bitre undertoner.',
  },
  'carmeleta-blanco': {
    brand: 'Carmeleta',
    extraImages: [
      {
        altText: 'Carmeleta Blanco cocktail',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/7d277bd1-e2c6-4c74-0b97-2a3bab563a00',
      },
      {
        altText: 'Carmeleta Blanco med oliven i skål',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/2ed6a141-b110-4101-7a8a-2ae86f9bc100',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/684162e5-028c-4ccd-0057-4f9c9a0f4900',
    origin: 'L’Alquería de la Comtessa Valencia 75cl / 15%',
    recommendation:
      'Serveres kold med is, alternativt i drinks med gin som en forfriskende supplement.',
    scores: { sweetness: 2, fruityness: 3, body: 2, spiciness: 3 },
    sizeAndDegrees: '75 cl. / 15%',
    taste:
      'Smagen er karakteriseret af elegante smage fra de traditionelle smage fra vermouth, men forfriskede med behagelige noter fra Ingefær og Saigon Kanel og afslutningsvis er vermouthen tilsmagt med fennikel og timian. Næsen er forfriskende og har klare noter af timian og fennikel.',
  },
  'carmeleta-rosso': {
    brand: 'Carmeleta',
    extraImages: [
      {
        altText: 'Negroni cocktail lavet med Forzudo Rojo',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/e320c5f1-3b7c-4b6f-b76c-61273e76fc00',
      },
      {
        altText: 'Sardino Rojo Cocktail',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/02f9761c-d8dd-4994-365f-5182984a4400',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/95ec3491-7126-4e90-a732-a8cf64eb5000',
    origin: 'L’Alquería de la Comtessa Valencia 75cl / 15%',
    recommendation:
      'Serveres bedst over is med appelsinskal – eller som fundament i klassiske cocktails som Negroni og Manhattan.',
    scores: { sweetness: 3, fruityness: 2, body: 3, spiciness: 5 },
    sizeAndDegrees: '75 cl. / 15%',
    taste:
      'I næsen opleves Rosso aromatisk og balsamisk med mørke citrusnoter og krydret sødme. Smagen er fyldig og harmonisk med en flot balance mellem syre, bitterhed og sødme. Den lange finish efterlader noter af appelsin, krydderier og et elegant bittert bid.',
  },
  'carmeleta-combo': {
    brand: 'Carmeleta',
    extraImages: [
      {
        altText: 'Carmeleta Orange Vermouth Tonic cocktails',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/13485ffe-2691-45bc-69e8-3bc54dc6bc00',
      },
      {
        altText: 'Carmeleta Blanco med oliven i skål',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/2ed6a141-b110-4101-7a8a-2ae86f9bc100',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/5f386ebe-dbbf-48d3-ec31-bbf48116eb00',
    origin: 'L’Alquería de la Comtessa Valencia 3 x 75 cl / 15%',
    recommendation:
      'Serveres afkølet med is og citrus. Orange er oplagt som frisk spritz, Rosso passer perfekt til Negroni og Manhattan, og Blanco er en lys aperitif til lange dage i solen.',
    scores: { sweetness: 3, fruityness: 3, body: 4, spiciness: 3 },
    sizeAndDegrees: '3 x 75 cl. / 15%',
    taste:
      'En smagskasse med Carmeleta Orange, Rosso og Blanco. Tre moderne spanske vermouther fra Valencia med appelsin, middelhavsurter, frisk citrus, krydderi og balanceret bitterhed.',
  },
  'mix-red': {
    brand: 'Vermouth.NU',
    extraImages: [
      {
        altText: 'Sardino Rojo Cocktail',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/02f9761c-d8dd-4994-365f-5182984a4400',
      },
      {
        altText: 'Forzudo Rojo bliver skænket i glas med is og grape',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/e531d91a-1702-4d63-5a3d-0ee5f146fe00',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/03ff1c99-011f-4978-736f-7e56cc30be00',
    origin: 'Spanien 3 x 75/100 cl. / 15%',
    recommendation:
      'Serveres afkølet med is og appelsin. En oplagt rød vermouth-pakke til aperitif, snacks og klassiske cocktails som Negroni og Manhattan.',
    scores: { sweetness: 3, fruityness: 2, body: 4, spiciness: 4 },
    sizeAndDegrees: '3 flasker / 15%',
    taste:
      'En blandet rød smagskasse med Sardino Rojo, Tabira og Forzudo Rojo. Tre fyldige spanske vermouther med krydderi, bitterhed, sødme og tydelig aperitif-karakter.',
  },
  'mix-white': {
    brand: 'Vermouth.NU',
    extraImages: [
      {
        altText: 'Sardino Rojo/Blanco på en stige',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/8e2fdb55-16f5-4a44-1708-f2aff1171300',
      },
      {
        altText: 'Forzudo Blanco cocktail',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/7d277bd1-e2c6-4c74-0b97-2a3bab563a00',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/68fe27a7-d137-4474-3de0-9441db70bd00',
    origin: 'Spanien 3 x 75/100 cl. / 15%',
    recommendation:
      'Serveres godt afkølet med is, citrus eller grøn oliven. En frisk hvid vermouth-pakke til aperitif, terrasseglas og lette cocktails.',
    scores: { sweetness: 3, fruityness: 3, body: 3, spiciness: 2 },
    sizeAndDegrees: '3 flasker / 15%',
    taste:
      'En blandet hvid smagskasse med Sardino Blanco, Carmeleta Blanco og Forzudo Blanco. Tre friske spanske vermouther med citrus, urter, aromatisk sødme og let bitterhed.',
  },
  'mix-trio': {
    brand: 'Vermouth.NU',
    extraImages: [
      {
        altText: 'Carmeleta Orange serveret i glas med skåret appelsin',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/497dbaa1-1fd1-4868-6a12-d8a440987000',
      },
      {
        altText: 'Tabira Vermouth blandt andre flasker',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/ea8c7c08-b9b5-4b73-89f1-47546bdd7800',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/3a18bbad-4d4e-4ef4-3d55-797154b1fd00',
    origin: 'Spanien 3 x 75/100 cl. / 15%',
    recommendation:
      'Serveres afkølet med is og citrus. En oplagt gavepakke eller startpakke til dig, der vil smage rød, hvid og orange vermouth.',
    scores: { sweetness: 3, fruityness: 3, body: 4, spiciness: 3 },
    sizeAndDegrees: '3 flasker / 15%',
    taste:
      'En blandet smagskasse med Tabira, Carmeleta Orange og Forzudo Blanco. Fra klassisk rød vermouth fra León til solmoden appelsin fra Valencia og frisk hvid vermouth fra El Bierzo.',
  },
  tabira: {
    brand: 'Tabira',
    extraImages: [
      {
        altText: 'Bakke anretning med Tabira Vermouth på en bakke i en båd',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/61e2ed31-8aa3-4cfa-62d9-e424471e2e00',
      },
      {
        altText: 'Tabira Vermouth blandt andre flasker',
        url: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/ea8c7c08-b9b5-4b73-89f1-47546bdd7800',
      },
    ],
    image: 'https://imagedelivery.net/rOTc9tKCTQBc9ztkiBTX_w/214da185-c1c9-4a72-f012-62d5bf8f0600',
    origin: 'Leon Nordvest Spanien 100 cl. / 15%',
    recommendation: 'Kold, med is og oliven som aperitif. Eller til en cocktail med rom, whisky',
    scores: { sweetness: 3, fruityness: 2, body: 4, spiciness: 4 },
    sizeAndDegrees: '100 cl. / 15%',
    taste:
      'Sødlig og blød i sin smag, dens friskhed og duft af appelsin gør den nem at drikke. Eftersmagen ligger langt tilbage i munden og arbejder sig ind, igennem sine mange aromaer og krydderier. Perfekt balance mellem det søde og det friske, som gør denne vermouth meget komplet. Bør nydes kold med is og appelsinskive, og med oliven som snack.',
  },
} as const
