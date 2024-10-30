import { computed, onMounted, onUnmounted, ref } from "vue";
import { GameDifficulty, GameStatus, type Pokemon, type PokemonListResponse } from "../interfaces";
import { pokemonApi } from "../api/pokemonApi";
import confetti from 'canvas-confetti'


export const usePokemonGame = () => {

    const gameStatus = ref<GameStatus>( GameStatus.Playing );
    const gameDifficulty = ref<GameDifficulty>();
    const pokemons = ref<Pokemon[]>([]);
    const pokemonsOptions = ref<Pokemon[]>([]);

    const timeLeft = ref<GameDifficulty>(GameDifficulty.Easy);
    let timerId: number;

    const randomPokemon = computed( () => {

      const randomIndex = Math.floor(Math.random() * pokemonsOptions.value.length);
      return pokemonsOptions.value[randomIndex];

    } )
    const isLoading = computed( () => pokemons.value.length === 0 )

    const getPokemons = async(): Promise<Pokemon[]> => {
      const response = await pokemonApi.get<PokemonListResponse>('?limit=494');

      const pokemonsArray = response.data.results.map( pokemon => {
        const urlParts = pokemon.url.split('/');
        const id = urlParts.at(-2) ?? 0;
        return {
          name: pokemon.name,
          id: +id
        }
      } );

      return pokemonsArray.sort( () => Math.random() - 0.5 );
    }

    const getNextRound = ( howMany: number = 3 ) => {
      gameStatus.value = GameStatus.Playing;
      pokemonsOptions.value = pokemons.value.slice(0,howMany);
      pokemons.value = pokemons.value.slice(howMany);
      startTimer(gameDifficulty.value)
    }

    const checkAnswer = ( id: number ) => {
      const hasWon = randomPokemon.value.id === id;

      if( hasWon ){
        gameStatus.value = GameStatus.Won;
        confetti({
          particleCount: 300,
          spread: 150,
          origin: { y: 0.6 },
          colors: ['#77a345'],
        })
        return;
      }

      gameStatus.value = GameStatus.Lost;
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0 },
        colors: ['#bb0000'],
        startVelocity: 20
      })
    }



    const startTimer = ( timer: number = 15 ) => {
      clearInterval(timerId);
      timeLeft.value = timer;

      timerId = setInterval(() => {
        if(timeLeft.value > 0 && gameStatus.value === GameStatus.Playing){
          timeLeft.value--;
        } else if(gameStatus.value !== GameStatus.Playing) {
          clearInterval(timerId);
        } else{
          clearInterval(timerId);
          gameStatus.value = GameStatus.Lost;
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0 },
            colors: ['#bb0000'],
            startVelocity: 20
          })
        }
      }, 1000);
    }

    const selectDifficulty = ( difficulty: number = 3 ) => {

      switch (difficulty) {
        case 3:
          gameDifficulty.value = GameDifficulty.Easy
          break;

        case 6:
          gameDifficulty.value = GameDifficulty.Medium
          break;

        case 10:
          gameDifficulty.value = GameDifficulty.Hard
          break;

        default:
          break;
      }

      getNextRound(difficulty);


    }

    onUnmounted(() => {
      clearInterval(timerId)
    })

    onMounted(async() => {
      await new Promise( r => setTimeout(r, 1000) )

      pokemons.value = await getPokemons()
    })

    return {
      gameStatus,
      isLoading,
      pokemonsOptions,
      randomPokemon,
      timeLeft,

      startTimer,
      getNextRound,
      checkAnswer,
      selectDifficulty
    }
};
