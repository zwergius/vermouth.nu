<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import CancelRequestForm from '$lib/components/cancel-request-form.svelte'
  import ModalDialog from '$lib/components/modal-dialog.svelte'

  let isCancellationRequestOpen = $state(false)
  const locale = $derived(page.data.locale)

  function handleCancellationRequestOpen(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    e.preventDefault()
    isCancellationRequestOpen = true
  }
</script>

<section class="policy">
  <h1>Handelsbetingelser</h1>

  <p>
    Salgs- og leveringsbetingelser ved køb af vermouth, aperitif og beslægtede produkter på <a
      href="https://www.vermouth.nu">www.vermouth.nu</a
    >
  </p>

  <p>
    Disse betingelser omfatter kun aftaler mellem Vermouth.nu (VZ Import) og dig som forbruger (som
    defineret i forbrugeraftalelovens § 3, stk. 1). Er du erhvervsdrivende, bedes du kontakte os via
    e-mail.
  </p>

  <p>
    Du kan kun købe varer på <a href="http://www.vermouth.nu">www.vermouth.nu</a>, hvis du
    accepterer disse salgs- og leveringsbetingelser. Ved ordreafgivelse har du altid adgang til at
    læse og acceptere de gældende betingelser samt at udskrive dem, hvis du ønsker det. Du opfordres
    til at læse betingelserne grundigt igennem og gøre dig bekendt med dine rettigheder og
    forpligtelser, herunder særligt mulighederne for returnering.
  </p>

  <h2>1. Bestilling af varer</h2>

  <p>
    Afgivelse af en ordre forudsætter, at du oprettes som kunde i vores kundekartotek. Når du har
    afgivet en bestilling via vores webshop, sender vores system automatisk en e-mail, der bekræfter
    modtagelsen af din ordre. En elektronisk faktura fremsendes pr. e-mail, når din ordre er
    afsendt.
  </p>

  <h2>2. Priser og betaling</h2>

  <p>
    Alle opgivne priser er inklusive moms og angives i danske kroner. Ved bestilling kan du se den
    samlede pris inklusive moms, afgifter og eventuelle fragtomkostninger.
  </p>

  <p>På <a href="http://www.vermouth.nu">www.vermouth.nu</a> kan der betales med:</p>
  <ul>
    <li>Dankort</li>
    <li>Visa/Dankort</li>
    <li>Visa Electron</li>
    <li>Visa</li>
    <li>MasterCard</li>
    <li>MobilePay</li>
  </ul>

  <h3>Reservation af beløb</h3>

  <p>
    Ved betaling med internationale betalingskort reserveres beløbet med det samme og frigives enten
    ved afsendelse af varen eller i henhold til aftale med din kortudsteder.
  </p>

  <h2>3. Levering</h2>

  <p>
    Levering sker udelukkende til adresser i Danmark. Varer afsendes hurtigst muligt efter
    ordreafgivelse. Forventet leveringstid er 1–3 hverdage.
  </p>

  <p>
    Ved levering til ikke-brofaste øer kan der forekomme forlænget leveringstid og evt. ekstra
    fragtgebyr. Du vil blive kontaktet, hvis dette er relevant.
  </p>

  <h2>4. Risiko</h2>

  <p>
    Risikoen for varerne overgår til dig, når varerne er leveret til den aftalte leveringsadresse.
  </p>

  <h2>5. Fortrydelsesret</h2>

  <p>
    Du har som forbruger 14 dages fortrydelsesret ved køb på <a href="http://www.vermouth.nu"
      >www.vermouth.nu</a
    >.
  </p>

  <p>
    Fortrydelsesfristen udløber 14 dage efter den dag, hvor du eller en af dig angivet tredjemand
    får varen i fysisk besiddelse.
  </p>

  <p>
    Du skal give os besked om fortrydelse via vores online formular eller via e-mail til <a
      href="mailto:info@vermouth.nu">info@vermouth.nu</a
    >.
  </p>

  <div class="mb-2">
    <a
      class="font-bold underline"
      href={resolve('/ordrer/fortryd')}
      onclick={handleCancellationRequestOpen}>Fortryd køb her</a
    >
  </div>

  <h3>Returnering</h3>

  <p>
    Du har 14 dage til at returnere varen efter, at du har meddelt os, at du ønsker at fortryde
    købet. Du afholder selv omkostningerne ved returnering.
  </p>

  <p>Varer returneres til:</p>
  <address>
    VZ Import<br />
    Overgaden Neden Vandet 19 A 1. sal<br />
    1414 København K
  </address>

  <p>Vi modtager ikke pakker sendt pr. efterkrav.</p>

  <h2>6. Reklamationsret</h2>

  <p>
    Der ydes 12 måneders reklamationsret i henhold til købeloven. Reklamation skal ske inden rimelig
    tid efter, at manglen er opdaget.
  </p>

  <p>Ved berettiget reklamation refunderer vi rimelige fragtomkostninger.</p>

  <h2>7. Persondatapolitik</h2>

  <p>
    Ved handel på <a href="http://www.vermouth.nu">www.vermouth.nu</a> registrerer vi nødvendige personoplysninger
    for at kunne gennemføre din bestilling. Oplysninger behandles fortroligt og videregives ikke til
    tredjemand uden samtykke.
  </p>

  <p>VZ Import er dataansvarlig. Oplysninger opbevares i henhold til gældende lovgivning.</p>

  <h2>8. Ansvar og force majeure</h2>

  <p>
    VZ Import er ansvarlig efter dansk rets almindelige regler og tager forbehold for force majeure.
  </p>

  <h2>9. Aldersgrænser, alkohol og lovgivning</h2>

  <p>
    Salg af vermouth, aperitif og andre alkoholholdige drikke sker i overensstemmelse med gældende
    dansk lovgivning.
  </p>

  <p>Du skal være fyldt 18 år for at købe drikkevarer hos os.</p>

  <p>
    VZ Import foretager stikprøvekontrol af alder. Forsøg på at omgå gældende alderskrav kan medføre
    annullering af ordre og politianmeldelse.
  </p>

  <h3>Klageadgang</h3>

  <p>
    Hvis du vil klage over dit køb, bedes du kontakte os på <a href="mailto:info@vermouth.nu"
      >info@vermouth.nu</a
    >. Kan vi ikke finde en løsning, kan du klage via Nævnenes Hus.
  </p>

  <h3>Kontaktoplysninger</h3>

  <p><a href="http://www.vermouth.nu">www.vermouth.nu</a> ejes og drives af VZ Import.</p>

  <address>
    VZ Import<br />
    Overgaden Neden Vandet 49B, st.<br />
    1414 København K<br />
    CVR: 4064 9395
  </address>

  <p>
    Vi opfordrer til at kontakte os via e-mail eller søge hjælp via vores virtuelle vejleder
    (chat-ikonet på forsiden).
  </p>

  <p>e-mail: <a href="mailto:info@vermouth.nu">info@vermouth.nu</a></p>

  <p>Handelsbetingelserne er senest opdateret d. 04.02.2026</p>
</section>

<ModalDialog
  bind:open={isCancellationRequestOpen}
  closeLabel="Luk fortrydelsesformular"
  title="Fortryd køb"
>
  {#snippet children(close)}
    <CancelRequestForm {locale} onClose={close} showDialogActions />
  {/snippet}
</ModalDialog>
