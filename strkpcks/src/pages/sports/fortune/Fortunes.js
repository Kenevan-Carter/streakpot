const fortunes = [
  `The night before the game
  the mind runs faster than the clock,
  counting matchups like rosary beads,
  already halfway to tip-off
  before the lights come on.`,

  `Somewhere a coin is still deciding
  which face it wants to show you.
  Don't rush it. Don't doubt it.
  Some luck needs a running start.`,

  `You feel it in the built-up quiet
  before the anthem, before the whistle —
  that low electric hum
  of something about to happen
  that hasn't happened yet.`,

  `Every underdog was once
  just a name in smaller print,
  waiting for a night
  when the print didn't matter anymore.`,

  `Confidence is a kind of weather.
  Tonight the forecast calls for clear skies,
  a light wind at your back,
  and no rain on the parade
  you haven't thrown yet.`,

  `The scoreboard is still zero to zero.
  In that nothing is every outcome,
  folded up and waiting,
  and one of them has your name on it.`,

  `Somewhere a shooter is warming up hands
  that don't know yet they're about to get hot,
  and somewhere a bettor is warming up nerve
  that doesn't know yet it was right all along.`,

  `Luck doesn't knock.
  It just leans against the doorframe
  until you notice it was always
  standing there, waiting to be let in.`,

  `There's a version of tonight
  where everything breaks your way —
  the bounce, the whistle, the clock.
  Go ahead and act like you already live there.`,

  `The parlay sits on the table
  like a folded letter you haven't opened,
  three legs of hope stacked on top of each other,
  each one whispering: almost, almost, almost.`,

  `Before the puck drops, before the pitch is thrown,
  there's a held breath that belongs to everyone
  watching at once — strangers, all leaning forward
  toward the same small miracle.`,

  `Somewhere a bench is about to empty
  onto the ice, the court, the field,
  arms already halfway into the air,
  celebrating a moment that hasn't happened yet
  but absolutely will.`,

  `You've felt this build before —
  the game inside the game,
  the quiet math of maybe,
  turning slowly, patiently,
  into yes.`,

  `Every streak starts the same small way:
  one decision, made without a safety net,
  followed by another,
  and another,
  until it isn't luck anymore. It's a habit.`,

  `Tonight the odds are just a rumor
  the scoreboard hasn't confirmed yet.
  Sit with your pick a little longer.
  Let it feel true before it has to be.`,
];
  
  export function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
  
    return fortunes[randomIndex];
  }