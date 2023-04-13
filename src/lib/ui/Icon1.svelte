<svg width="183" height="80" viewBox="0 0 183 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="46.7798" cy="40" r="13.7373" stroke="white"/>
    <circle cx="33.2227" cy="40" r="13.7373" stroke="white"/>
    <line y1="39.5" x2="18.9831" y2="39.5" stroke="white"/>
    <line x1="61.0166" y1="39.5" x2="79.9997" y2="39.5" stroke="white"/>
    <circle cx="148.827" cy="40.4668" r="13.7373" stroke="white"/>
    <circle cx="135.27" cy="40.4668" r="13.7373" stroke="white"/>
    <line x1="102.047" y1="39.9668" x2="121.03" y2="39.9668" stroke="white"/>
    <line x1="163.063" y1="39.9668" x2="182.047" y2="39.9668" stroke="white"/>
    <circle cx="91.2739" cy="33.2207" r="13.7373" transform="rotate(-90 91.2739 33.2207)" stroke="white"/>
    <circle cx="91.2739" cy="46.7783" r="13.7373" transform="rotate(-90 91.2739 46.7783)" stroke="white"/>
    <line x1="90.7744" y1="80" x2="90.7744" y2="61.0169" stroke="white"/>
    <line x1="90.7744" y1="18.9834" x2="90.7744" y2="0.000328086" stroke="white"/>
</svg>
<style lang="scss">

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  svg{

    circle:nth-of-type(1){
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: dash 3s ease-in infinite;
    }

    circle:nth-of-type(2){
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: dash 3s 0.5s ease-in infinite;
    }
  }
</style>