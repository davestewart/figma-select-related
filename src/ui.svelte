<div class="wrapper p-xxsmall">
  <div class="flex" style="padding: .5em; gap: .6em">
    <button id="first" on:click={onClick} on:mouseenter={onMouseOver} on:mouseleave={onMouseOut}>
      {@html First}
    </button>

    <button id="prev" on:click={onClick} on:mouseenter={onMouseOver} on:mouseleave={onMouseOut} title="Hold Alt to select parent">
      {#if isAltDown}
        {@html Parent}
      {:else}
        {@html Prev}
      {/if}
    </button>

    <button id="all" on:click={onClick} on:mouseenter={onMouseOver} on:mouseleave={onMouseOut}>
      {@html All}
    </button>

    <button id="next" on:click={onClick} on:mouseenter={onMouseOver} on:mouseleave={onMouseOut} title="Hold Alt to select children">
      {#if isAltDown}
        {@html Children}
      {:else}
        {@html Next}
      {/if}
    </button>

    <button id="last" on:click={onClick} on:mouseenter={onMouseOver} on:mouseleave={onMouseOut}>
      {@html Last}
    </button>
  </div>
  <Label class="label"><span>{message}</span></Label>
</div>

<script>
import { GlobalCSS } from 'figma-plugin-ds-svelte'
import { Label } from 'figma-plugin-ds-svelte'
import './assets/styles.scss'
import { handleMessage, postMessage } from './utils/messages/ui'

// icons
import First from './assets/icons/first.svg'
import Prev from './assets/icons/prev.svg'
import Children from './assets/icons/children.svg'
import All from './assets/icons/all.svg'
import Next from './assets/icons/next.svg'
import Parent from './assets/icons/parent.svg'
import Last from './assets/icons/last.svg'

// variables
let result = 'Waiting for selection...'
let isAltDown = false
let targetHover = ''
let message = ''

$: message = targetHover
  ? `Select "${getAction(targetHover, isAltDown)}"`
  : result

// helpers
function getAction (id, isAltDown) {
  if (isAltDown) {
    if (id === 'prev') {
      return 'parent'
    }
    else if (id === 'next') {
      return 'children'
    }
  }
  return id
}

// alternate function
window.addEventListener('keydown', function onKeyDown (event) {
  if (event.key === 'Alt') {
    isAltDown = true
  }
})

window.addEventListener('keyup', function onKeyUp (event) {
  if (event.key === 'Alt') {
    isAltDown = false
  }
})

// mouse interaction
function onMouseOver (event) {
  targetHover = event.currentTarget.id
}

function onMouseOut (event) {
  targetHover = ''
}

function onClick (event) {
  const action = getAction(event.currentTarget.id, isAltDown)
  postMessage('select', { action })
}

// focus
window.addEventListener('focus', function () {
  document.body.classList.add('focused')
})

window.addEventListener('blur', function () {
  document.body.classList.remove('focused')
})

// receive
handleMessage({
  result ({ message }) {
    result = message
  }
})
</script>
