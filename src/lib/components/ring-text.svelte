<script>
  // /**
  //  * @param {string | any[]} text
  //  * @param {number} initialFontSize
  //  * @param {number} constantSpace
  //  */
  // function calculateFontSize(text, initialFontSize, constantSpace) {
  //   const numCharacters = text.length
  //   const charDiff = numCharacters - constantSpace
  //   const fontSizeChange = Math.floor(charDiff / 2)
  //   const fontSize = initialFontSize - fontSizeChange
  //   return fontSize
  // }

  const textContent = 'Importeret af venner siden 2019 - Vermouth NU -'
  // const initialFontSize = 23
  // const constantSpace = 45
  // const fontSize = calculateFontSize(textContent, initialFontSize, constantSpace)
</script>

<div class="rotating">
  <svg viewBox="0 0 200 200">
    <path
      id="textPath"
      d="M 41.5,0 A 41.5,41.5 0 0 1 -41.5,0 A 41.5,41.5 0 0 1 41.5,0"
      transform="translate(100,100)"
      fill="none"
      stroke-width="0"
    />
    <g>
      <text>
        <textPath xlink:href="#textPath" startOffset="0%">{textContent}</textPath>
      </text>
    </g>
  </svg>
</div>

<style>
  svg {
    height: auto;
    max-width: 100%;
    width: 100%;
  }
  g {
    font-size: 12px;
    fill: var(--interactive-button);
  }

  @keyframes rotating {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  .rotating {
    animation: rotating 12s linear infinite;
  }
</style>
