<template>
  <div
    v-if="visible"
    class="b-loader"
    :class="[{ 'b-loader--transparent': transparent }, `text-${color}`, `b-loader--${mySize}`, `b-loader--${view}`]"
    :style="styles"
  >
    <svg v-if="view === 'circle'" :width="iconSize" :height="iconSize" :viewBox="`0 0 ${iconSize * 2} ${iconSize * 2}`">
      <linearGradient id="linearColors1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--white)"></stop>
        <stop offset="100%" :stop-color="`var(--${color}-l-4)`"></stop>
      </linearGradient>
      <linearGradient id="linearColors2" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="`var(--${color}-l-4)`"></stop>
        <stop offset="100%" :stop-color="`var(--${color})`"></stop>
      </linearGradient>
      <linearGradient id="linearColors3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="transparent"></stop>
        <stop offset="100%" stop-color="transparent"></stop>
      </linearGradient>
      <linearGradient id="linearColors4" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(255, 255, 255, 0)"></stop>
        <stop offset="100%" stop-color="white"></stop>
      </linearGradient>
      <g>
        <path
          :d="circleTo4Paths(iconSize, iconSize, iconSize - iconStroke).top"
          fill="none"
          :stroke="`url(#linearColors${color === 'white' ? '3' : '1'})`"
          :stroke-width="iconStroke"
        />
        <path
          :d="circleTo4Paths(iconSize, iconSize, iconSize - iconStroke).right"
          fill="none"
          :stroke="`url(#linearColors${color === 'white' ? '4' : '2'})`"
          :stroke-width="iconStroke"
        />
        <path
          :d="circleTo4Paths(iconSize, iconSize, iconSize - iconStroke).bottom"
          fill="none"
          :stroke="`var(--${color})`"
          :stroke-width="iconStroke"
        />
        <path
          :d="circleTo4Paths(iconSize, iconSize, iconSize - iconStroke).left"
          fill="none"
          :stroke="`var(--${color})`"
          :stroke-width="iconStroke"
          stroke-linecap="round"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          :from="`0 ${iconSize} ${iconSize}`"
          :to="`360 ${iconSize} ${iconSize}`"
          dur="1s"
          repeatCount="indefinite"
        ></animateTransform>
      </g>
    </svg>
    <!-- <svg v-if="view === 'circle'" :width="iconSize" :height="iconSize" :viewBox="`0 0 ${iconSize} ${iconSize}`">
      <circle
        :cx="iconSize / 2" :cy="iconSize / 2" :r="r"
        fill="none" stroke="currentColor" :stroke-width="iconStroke" stroke-linecap="round" :stroke-dasharray="`${ 1.5 * 3.1416 * r }`"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          :from="`0 ${ iconSize / 2 } ${ iconSize / 2 }`"
          :to="`360 ${ iconSize / 2 } ${ iconSize / 2 }`"
          dur="1s"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
    </svg> -->
    <svg v-if="view === 'dots'" :width="iconSize" :height="iconSize" :viewBox="`0 0 ${iconSize} ${iconSize}`">
      <g :transform="`translate(${iconSize / 2},${iconSize / 2})`">
          <g transform="rotate(0)">
            <circle :cx="iconSize / 4" cy="0" :r="r" fill="currentColor">
            <animate attributeName="r" :values="`${r};${r + 1};${r}`" dur="1s" repeatCount="indefinite" begin="0s"/>
            </circle>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite"/>
          </g>
          <g transform="rotate(120)">
            <circle :cx="iconSize / 4" cy="0" :r="r" fill="currentColor">
            <animate attributeName="r" :values="`${r};${r + 1};${r}`" dur="1s" repeatCount="indefinite" begin="0.3s"/>
            </circle>
            <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="1s" repeatCount="indefinite"/>
          </g>
          <g transform="rotate(240)">
            <circle :cx="iconSize / 4" cy="0" :r="r" fill="currentColor">
            <animate attributeName="r" :values="`${r};${r + 1};${r}`" dur="1s" repeatCount="indefinite" begin="0.6s"/>
            </circle>
            <animateTransform attributeName="transform" type="rotate" from="240" to="600" dur="1s" repeatCount="indefinite"/>
          </g>
      </g>
    </svg>
  </div>
</template>
<script src="./b-loader.ts"></script>
