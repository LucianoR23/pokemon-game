<template>
  <section v-if="isLoading || randomPokemon?.id === null" class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 v-if="isLoading" class="text-3xl">Espere por favor</h1>
    <h3 v-if="isLoading" class="animate-pulse">Cargando Pokemon</h3>
    <button @click="selectDifficulty()" class="absolute bottom-80 left-1/4">Empezar a jugar - facil</button>
    <button @click=selectDifficulty(6) class="absolute bottom-80">Empezar a jugar - medio</button>
    <button @click=selectDifficulty(10) class="absolute bottom-80 right-1/4">Empezar a jugar - dificil</button>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="m-5">Quien es este Pokemon?</h1>

    <!-- Poke pic -->
    <PokemonPicture :pokemon-id="randomPokemon.id" :show-pokemon="gameStatus !== GameStatus.Playing" />

    <!-- poke options -->
    <span class="bg-red-600 shadow-md rounded-full w-20 h-20 text-center absolute right-1/4 flex items-center justify-center text-3xl">{{ timeLeft }}</span>
    <PokemonOptions :options="options" @selected-option="checkAnswer"
    :block-selection="gameStatus !== GameStatus.Playing"
    :correct-answer="randomPokemon.id"
    :play-again="getNextRound"
    />
    <button v-if="gameStatus !== GameStatus.Playing" @click="selectDifficulty()" class="absolute bottom-64 left-1/4">Jugar de nuevo - facil</button>
    <button v-if="gameStatus !== GameStatus.Playing" @click="selectDifficulty(6)" class="absolute bottom-44 left-1/4">Jugar de nuevo - medio</button>
    <button v-if="gameStatus !== GameStatus.Playing" @click="selectDifficulty(10)" class="absolute bottom-24 left-1/4">Jugar de nuevo - dificil</button>


  </section>
</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const { randomPokemon, isLoading, gameStatus, pokemonsOptions:options, timeLeft, checkAnswer, getNextRound, selectDifficulty } = usePokemonGame()

</script>

<style scoped>
button {
    @apply bg-white shadow-md rounded-lg p-3 m-2 cursor-pointer w-44 text-center transition-all hover:bg-blue-400;
  }
</style>
