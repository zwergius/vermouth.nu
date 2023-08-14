<script>
  import sardinoBlanco from '$lib/assets/bottles/sardino-blancoi.avif'
  import sardinoRojo from '$lib/assets/bottles/sardino-rojo-big.avif'
  import forzudoRojo from '$lib/assets/bottles/forzudo-rojo-big.webp'
  import forzudoBlanco from '$lib/assets/bottles/forzudo-blanco-big.webp'
  import carmeletaOrange from '$lib/assets/bottles/sardino-rojo-big.avif'
  import carmeletaBlanco from '$lib/assets/bottles/carmeleta-blanco-big.avif'
  import tabira from '$lib/assets/bottles/tabira-big.avif'

  const vermouths = [
    {
      id: 1,
      brand: 'Forzudo',
      image: forzudoRojo,
      name: 'Rojo',
      intro: 'Klassens frække dreng',
      introtext:
        'Med sin mørke mahogni farve, præsenterer denne vermouth sig på klassisk vis, og dog med et tvist.',
      taste:
        'Smagen er levende og koncentreret, hvor især kardemommen og de tørrede frugter er stærke, derudover er der nuancer af lakrids og vanilje. Duften er intens af søde krydderier blandet med tørret frugt som afsluttes med noter af kaffe. Dette gør sig gældende i en lang og vedvarende sødme med et perfekt bitter touch.',
      recommendation: 'bør nydes afkølet og med en skive grape.',
    },

    {
      id: 2,
      brand: 'Forzudo',
      name: 'Blanco',
      image: forzudoBlanco,
      intro: 'Forfriskende og stærke vanedanende ',
      introtext: 'Forzudo Blanco er yderste populær, og et perfekt følgeskab til en dag i solen.',
      taste:
        'Forzudo Blanco giver en cremet fornemmelse med smagsnuancer af bittert æble, kandiseret citron, grønne urter og et strejf af tropiske frugter. Her fås en meget balanceret Vermouth med lige dele sødme og bitter.',
      recommendation:
        'Serveres “on the rocks”, med en skive appelsin eller citron, nydes som aperitif med en lille snack ved hånden f.eks oliven, chips eller “fisk på dåse”',
    },

    {
      id: 3,
      brand: 'Sardino',
      name: 'Rojo',
      image: sardinoRojo,
      intro: 'Sømandens foretrukne.',
      introtext:
        'Sardino slår sig selv op på at være en maritim vermouth, den kommer helt fra den Spanske vestkyst, hvor der er store fiske traditioner og lækre råvarer.',
      taste:
        'En rigtig god allround rød Vermouth som hverken er for sød, tør eller bitter - perfekt til enhver lejlighed. Noter af karamel, camille & kanel.',
      recommendation: 'bør nydes afkølet og med en skive grape.',
    },
    {
      id: 4,
      brand: 'Sardino',
      name: 'Blanco',
      image: sardinoBlanco,
      intro: 'Maritim Vermouth fra den Spanske vestkyst.',
      introtext:
        'Sardino Blanco, lagret i lerkrukker ved Atlanterhavets kyst - Her i den hvide udgave som er en anelse lettere.',
      taste:
        'Halmgul i farven, stor harmoni og balance i smag, sødt og syrligt med friske og frugtige nuancer, meget aromatisk og med en lang smagsudholdenhed. Noter af blomster, planter og botaniske stoffer.',
      recommendation:
        'Serveres ved 6-8 grader i glas med oliven og en skive appelsin. Nydes til forretter eller som aperitif med en lille snack ved hånden f.eks oliven, chips eller “fisk på dåse”.',
    },

    {
      id: 5,
      brand: 'Carmeleta',
      name: 'Orange ',
      image: carmeletaOrange,
      intro: 'Orange og Trendy',
      introtext:
        'Carmeleta Vermouth Orange præsenterer en levende orange farve, en hyldest til Appelsinen fra Valencia. Brygget på hvide druer fra middelhavsområdet, herunder Malvasía, Moscatel, Planta, udviklet med en original kombination af urter og krydderrier. En klassisk blanding med bløde toner af Malurt, Artemis og Dictamo fra Kreta. Sødere og lettere end en traditionel vermouth, egner sig til alle tidspunkter af dagen. En ny vermouth til nye tider.',
      taste:
        'Noter af citrusfrugter, kager, vanille karamel. Intens smag, afbalanceret med syrlighed. Let bitter citrus og krydret eftersmag. Carmeleta Orange har en frisk duft, balanceret med syrlighed samt søde og bitre undertoner.',
      recommendation: 'Serveres kold med is, og evt. et jordbær eller appelsin.',
    },
    {
      id: 6,
      brand: 'Carmeleta',
      name: 'Blanco',
      image: carmeletaBlanco,
      intro: 'Hvid og Autentisk',
      introtext:
        'Carmeleta Blanco er en autentisk vermouth som kombinerer aromatiske urter og krydderier, hvilet  gør den hvide vermouth til en forfriskende aperitif. Lavet på hvide druer fra middelhavsområdet, herunder Malvasía, Muscat, Planta og udviklet med en original kombination af urter og krydderrier. En klassisk blanding med bløde toner af Malurt, Artemis og Dictamo fra Kreta. Vermouthen er sødere og lettere end en traditionel rød vermouth, og egner sig til alle tidspunkter af dagen. En sand Gane Gentleman.',
      taste:
        'Smagen er karakteriseret af elegante smage fra de traditionelle smage fra vermouth, men forfriskede med behagelige noter fra Ingefær og Saigon Kanel og afslutningsvis er vermouthen tilsmagt med fennikel og timian.Næsen er forfriskende og har klare noter af timian og fennikel.',
      recommendation:
        'Serveres kold med is, alternativt i drinks med gin som en forfriskende supplement.',
    },

    {
      id: 7,
      brand: 'Tabira',
      name: '-',
      image: tabira,
      intro: 'Elegant Vermouth med dragende næse og smag - en absolut favorit',
      introtext:
        'Vinhuset Meoriga, fra byen Leon præsenterer den første vermouth lavet på druen “Prieto Picudo”. En premium vermouth med begrænset årlig produktion, baseret på en original opskrift som er mere end 90 år gammel (1927).',
      taste:
        'Sødlig og blød i sin smag, dens friskhed og duft af appelsin gør den nem at drikke. Eftersmagen ligger langt tilbage i munden og arbejder sig ind, igennem sine mange aromaer og krydderier. Perfekt balance mellem det søde og det friske, som gør denne vermouth meget komplet. Bør nydes kold med is og appelsinskive, og med oliven som snack.',
      recommendation: '',
    },
  ]
</script>

<div class="content">
  <div>
    {vermouths}
    <img src={forzudoRojo} alt="" />
  </div>

  <div class="text">
    <h1>Forzudo Rojo</h1>
    <div class="wrap">
      <div class="info">
        <h2>titulo</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
      <div class="info">
        <h2>Smag & Duft</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
      <div class="info">
        <h2>Anbefaling</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
      <div class="info">
        <h2>Oprindelse</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto, commodi eveniet
          iure facere, nisi consectetur minus quia voluptas at aliquam quis, vero deserunt
          accusamus. A voluptatum nostrum totam rerum.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .info {
    width: 50%;
  }
  h1 {
    text-align: center;
    padding: 20px 10px;
    border-bottom: 2px solid var(--secondary);
  }
  h2 {
    padding: 10px 5px;
  }
  p {
    padding-left: 15px;
  }
  .text {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;

    border-radius: 19px;
  }
  .content {
    padding: 20px 100px;
    color: var(--secondary);
    display: flex;
  }
</style>
