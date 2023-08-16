import sardinoBlanco from '$lib/assets/bottles/sardino-blanco-big.avif'
import sardinoRojo from '$lib/assets/bottles/sardino-rojo-big.avif'
import forzudoRojo from '$lib/assets/bottles/forzudo-rojo-big.webp'
import forzudoBlanco from '$lib/assets/bottles/Frozudo-Blanco_med_skygge_900x.webp'
import carmeletaOrange from '$lib/assets/bottles/orange-carmelta-big.avif'
import carmeletaBlanco from '$lib/assets/bottles/carmeleta-blanco-big.avif'
import tabira from '$lib/assets/bottles/tabira-big.avif'
import sardinoBlancoSmall from '$lib/assets/bottles/sardino-blanco.avif'
import sardinoRojoSmall from '$lib/assets/bottles/sardino-rojo.avif'
import forzudoRojoSmall from '$lib/assets/bottles/forzudo-rojo.avif'
import forzudoBlancoSmall from '$lib/assets/bottles/forzudo-blanco.avif'
import carmeletaOrangeSmall from '$lib/assets/bottles/orange-carmeleta.avif'
import carmeletaBlancoSmall from '$lib/assets/bottles/carmeleta-blanco.avif'
import tabiraSmall from '$lib/assets/bottles/tabira.avif'

export const vermouths = [
  {
    brand: 'Forzudo Rojo',
    image: forzudoRojo,
    cardImage: forzudoRojoSmall,
    name: 'forzudo-rojo',
    subName: 'Klassens frække dreng',
    introtext:
      'Med sin mørke mahogni farve, præsenterer denne vermouth sig på klassisk vis, og dog med et tvist.',
    taste:
      'Smagen er levende og koncentreret, hvor især kardemommen og de tørrede frugter er stærke, derudover er der nuancer af lakrids og vanilje. Duften er intens af søde krydderier blandet med tørret frugt som afsluttes med noter af kaffe. Dette gør sig gældende i en lang og vedvarende sødme med et perfekt bitter touch.',
    recommendation: 'Bør nydes afkølet og med en skive grape.',
    origin: 'El Bierzo Leon, Nordvest Spanien 100 cl. / 15%',
  },

  {
    brand: 'Forzudo Blanco',
    name: 'forzudo-blanco',
    image: forzudoBlanco,
    cardImage: forzudoBlancoSmall,
    subName: 'Forfriskende og stærke vanedanende ',
    introtext: 'Forzudo Blanco er yderste populær, og et perfekt følgeskab til en dag i solen.',
    taste:
      'Forzudo Blanco giver en cremet fornemmelse med smagsnuancer af bittert æble, kandiseret citron, grønne urter og et strejf af tropiske frugter. Her fås en meget balanceret Vermouth med lige dele sødme og bitter.',
    recommendation: 'Bør nydes afkølet og med en skive grape.',
    origin: 'El Bierzo Leon, Nordvest Spanien 100 cl. / 15%',
  },

  {
    brand: 'Sardino Rojo',
    name: 'sardino-rojo',
    image: sardinoRojo,
    cardImage: sardinoRojoSmall,
    subName: 'Sømandens foretrukne.',
    introtext:
      'Sardino slår sig selv op på at være en maritim vermouth, den kommer helt fra den Spanske vestkyst, hvor der er store fiske traditioner og lækre råvarer.',
    taste:
      'En rigtig god allround rød Vermouth som hverken er for sød, tør eller bitter - perfekt til enhver lejlighed. Noter af karamel, camille & kanel.',
    recommendation:
      'Serveres “on the rocks”, med en skive appelsin eller citron, nydes som aperitif med en lille snack ved hånden f.eks oliven, chips eller “fisk på dåse”',
    origin: 'Galicien, Nordvestkysten Spanien 75 cl / 15%',
  },
  {
    brand: 'Sardino Blanco',
    name: 'sardino-blanco',
    image: sardinoBlanco,
    cardImage: sardinoBlancoSmall,
    subName: 'Maritim Vermouth fra den Spanske vestkyst.',
    introtext:
      'Sardino Blanco, lagret i lerkrukker ved Atlanterhavets kyst - Her i den hvide udgave som er en anelse lettere.',
    taste:
      'Halmgul i farven, stor harmoni og balance i smag, sødt og syrligt med friske og frugtige nuancer, meget aromatisk og med en lang smagsudholdenhed. Noter af blomster, planter og botaniske stoffer.',
    recommendation:
      'Serveres ved 6-8 grader i glas med oliven og en skive appelsin. Nydes til forretter eller som aperitif med en lille snack ved hånden f.eks oliven, chips eller “fisk på dåse”.',
    origin: 'Galicien, Nordvestkysten Spanien 75 cl / 15%',
  },

  {
    brand: 'Carmeleta Ornge',
    name: 'carmeleta-orange',
    image: carmeletaOrange,
    cardImage: carmeletaOrangeSmall,
    subName: 'Orange og Trendy',
    introtext:
      'Carmeleta Vermouth Orange præsenterer en levende orange farve, en hyldest til Appelsinen fra Valencia. Brygget på hvide druer fra middelhavsområdet, herunder Malvasía, Moscatel, Planta, udviklet med en original kombination af urter og krydderrier. En klassisk blanding med bløde toner af Malurt, Artemis og Dictamo fra Kreta. Sødere og lettere end en traditionel vermouth, egner sig til alle tidspunkter af dagen. En ny vermouth til nye tider.',
    taste:
      'Noter af citrusfrugter, kager, vanille karamel. Intens smag, afbalanceret med syrlighed. Let bitter citrus og krydret eftersmag. Carmeleta Orange har en frisk duft, balanceret med syrlighed samt søde og bitre undertoner.',
    recommendation: 'Serveres kold med is, og evt. et jordbær eller appelsin.',
    origin: 'L’Alquería de la Comtessa Valencia 75cl / 15%',
  },
  {
    brand: 'Carmeleta Blanco',
    name: 'carmeleta-blanco',
    image: carmeletaBlanco,
    cardImage: carmeletaBlancoSmall,
    subName: 'Hvid og Autentisk',
    introtext:
      'Carmeleta Blanco er en autentisk vermouth som kombinerer aromatiske urter og krydderier, hvilet  gør den hvide vermouth til en forfriskende aperitif. Lavet på hvide druer fra middelhavsområdet, herunder Malvasía, Muscat, Planta og udviklet med en original kombination af urter og krydderrier. En klassisk blanding med bløde toner af Malurt, Artemis og Dictamo fra Kreta. Vermouthen er sødere og lettere end en traditionel rød vermouth, og egner sig til alle tidspunkter af dagen. En sand Gane Gentleman.',
    taste:
      'Smagen er karakteriseret af elegante smage fra de traditionelle smage fra vermouth, men forfriskede med behagelige noter fra Ingefær og Saigon Kanel og afslutningsvis er vermouthen tilsmagt med fennikel og timian.Næsen er forfriskende og har klare noter af timian og fennikel.',
    recommendation:
      'Serveres kold med is, alternativt i drinks med gin som en forfriskende supplement.',
    origin: 'L’Alquería de la Comtessa Valencia 75cl / 15%',
  },

  {
    brand: 'Tabira',
    name: 'tabira',
    image: tabira,
    cardImage: tabiraSmall,
    subName: 'Elegant Vermouth med dragende næse og smag - en absolut favorit',
    introtext:
      'Vinhuset Meoriga, fra byen Leon præsenterer den første vermouth lavet på druen “Prieto Picudo”. En premium vermouth med begrænset årlig produktion, baseret på en original opskrift som er mere end 90 år gammel (1927).',
    taste:
      'Sødlig og blød i sin smag, dens friskhed og duft af appelsin gør den nem at drikke. Eftersmagen ligger langt tilbage i munden og arbejder sig ind, igennem sine mange aromaer og krydderier. Perfekt balance mellem det søde og det friske, som gør denne vermouth meget komplet. Bør nydes kold med is og appelsinskive, og med oliven som snack.',
    recommendation: '',
    origin: 'Leon Nordvest Spanien 100 cl. / 15%',
  },
]
