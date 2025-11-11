<script lang="ts">
  import Checkbox from '$lib/components/form-controls/checkbox.svelte'
  import Form from '$lib/components/form-controls/form.svelte'
  import Input from '$lib/components/form-controls/input.svelte'
  import RadioGroup from '$lib/components/form-controls/radio-group.svelte'

  async function handleSubmit() {}
</script>

<section class="split-content">
  <div class="copy">
    <h1 class="text-sm font-bold mb-4">Kontaktinformation</h1>
    <Form onSubmit={handleSubmit}>
      <div class="flex flex-col gap-4 mb-12">
        <Input autocomplete="email" label="E-mailadresse" name="email" required type="email" />
        <Checkbox label="Tilmeld dig vores nyhedsbrev" name="acceptsNewsletter" />
      </div>
      <h2 class="text-sm font-bold mb-4">Levering</h2>
      <div class="flex flex-col gap-4 mb-12">
        <Input autocomplete="country" label="Land" name="country" required />
        <div class="flex *:flex-1 gap-3">
          <Input autocomplete="given-name" label="Fornavn" name="firstName" required />
          <Input autocomplete="family-name" label="Efternavn" name="lastName" required />
        </div>
        <Input autocomplete="organization" label="Firma (Valgfrit)" name="company" />
        <Input autocomplete="address-line1" label="Adresse" name="address" required />
        <Input
          autocomplete="address-line2"
          label="Lejlighed, etage osv. (valgfrit)"
          name="addressLine2"
        />
        <div class="flex *:flex-1 gap-3">
          <Input
            autocomplete="postal-code"
            label="Postnummer"
            inputmode="numeric"
            maxlength={4}
            minlength={4}
            name="postalCode"
            pattern="\d*"
            required
            type="text"
          />
          <Input autocomplete="address-level2" label="By" name="city" required />
        </div>
        <Input
          autocomplete="tel"
          label="Telefonnummer"
          minlength={8}
          name="phone"
          pattern="\d*"
          required
          type="tel"
        />
        <Checkbox label="Brug en anden faktureringsadresse" name="hasDifferentBillingAddress" />
        <!-- <Checkbox -->
        <!--   label="Gem mine informationer for hurtigere udtjekning næste gang" -->
        <!--   name="acceptsStoreInfo" -->
        <!-- /> -->
        <Checkbox
          label="Send sms-beskeder til mig med ekslusive tilbud"
          name="acceptsExclusiveOffers"
        />
      </div>
      <div class="mb-12">
        <RadioGroup
          groupLabel="Leveringsmetode"
          name="deliveryMethod"
          options={[
            {
              description: '- Du får besked via e-mail og sms',
              label: 'Hjemmelevering (leveringsadresse)',
              value: 'HOME',
            },
            {
              description: '- Du kan afhente med det samme',
              label: 'Café Flindt & Ørsted',
              value: 'PICK_UP',
            },
            {
              description: '- Du får besked via e-mail og sms',
              label: 'Til pakkeshop (nærmest leveringsadresse)',
              value: 'SHOP',
            },
          ]}
          required
        />
      </div>
      <h2 class="text-sm font-bold mb-4">Bekræft betingelser</h2>
      <div class="flex flex-col gap-4 mb-12">
        <Checkbox
          label="Jeg accepterer handelsbetingelserne samt bekræfter, at jeg er over 18 år."
          name="acceptsTerms"
          required
        />
      </div>
      <button class="btn" type="submit">Gå til betaling</button>
    </Form>
  </div>
</section>
