// processor for sequential numbers per virtual user
module.exports = {
  // Assign a unique username for each bot
  setUsername(context) {
    context.vars.username = "bot" + Math.floor(Math.random() * 1000000);
  },

  // Assign next number in sequence
  initCounter(context) {
    context.vars.counter = 1;
  },

  nextNumber(context) {
    // Initialize counter if missing
    if (!context.vars.counter) context.vars.counter = 1;

    context.vars.number = context.vars.counter++;
  }
};
