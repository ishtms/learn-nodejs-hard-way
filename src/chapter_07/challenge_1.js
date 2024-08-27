class TrieNode {
  isEndOfWord = false;
  children = new Map();
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, node = this.root) {
    const wordLength = word.length;

    // Exit condition: If the word to insert is empty, terminate the recursion.
    if (wordLength === 0) return;

    for (let idx = 0; idx < wordLength; idx++) {
      let char = word[idx];

      // Check if the current node has a child node for the current character.
      if (!node.children.has(char)) {
        // If not, create a new TrieNode for this character and add it to the children of the current node.
        node.children.set(char, new TrieNode());
      }

      // Move to the child node corresponding to the current character.
      node = node.children.get(char);
    }

    node.isEndOfWord = true;
  }
}
