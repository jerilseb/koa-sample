const Router = require("koa-router");
const fs = require("fs");
const Trie = require("../lib/trie");

const router = new Router();

/**
 * Route to check server health
 * @name GET /status
 */
router.get("/status", async ctx => {
  ctx.body = {
    message: "Server running"
  };
});

/**
 * Route to get the word combinations
 * @name POST /findwords
 */
router.post("/findwords", async ctx => {
  if (!ctx.request.body.files || !ctx.request.body.files.dict) {
    ctx.throw(400, "No dictionary file given");
  }

  const file = ctx.request.body.files.dict;

  if (file.size > 1024 * 1024) {
    ctx.throw(400, "Dictionary file size should be less that 1MB");
  }

  const content = fs.readFileSync(file.path, "utf8");

  const array = content
    .split("\n")
    .map(s => s.toLowerCase().trim())
    .filter(s => s !== "");

  const result = findCombinations(array);

  ctx.body = {
    message: result,
    count: Object.keys(result).length
  };
});

/* End of routes */

/**
 * Helper function to get word combinations
 */
function findCombinations(words) {
  const trie = new Trie();

  // Use a dictionary to store the result and avoid duplicates
  const result = {};

  // Insert all words into the trie.
  // Unicode astral characters will go into the trie as 2 characters
  for (let word of words) {
    trie.insert(word);
  }

  // 1. Go through every word in the dictionary and for each word, get the list
  // of words which has the chosen word as a prefix.
  // 2. For every word the above list, substract the prefix word, and check if the
  // remainder string exists in the trie.
  // 3. If found, add the word and suffix to the result dictionary
  for (let word of words) {
    let matches = trie.find(word);
    for (let match of matches) {
      let suffix = match.replace(word, "");
      if (trie.contains(suffix)) {
        result[`${word} + ${suffix}`] = word + suffix;
      }
    }
  }
  return result;
}

module.exports = router;
