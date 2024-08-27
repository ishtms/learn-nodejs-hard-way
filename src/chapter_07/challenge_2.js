class TrieNode {
  isEndOfWord = false;
  children = new Map();
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  search(word) {
    // Initialize 'currentNode' to the root node of the Trie.
    let currentNode = this.root;

    // Loop through each character in the input word.
    for (let index = 0; index < word.length; index++) {
      // Check if the current character exists as a child node
      // of the 'currentNode'.
      if (currentNode.children.has(word[index])) {
        // If it does, update 'currentNode' to this child node.
        currentNode = currentNode.children.get(word[index]);
      } else {
        // If it doesn't, the word is not in the Trie. Return false.
        return false;
      }
    }

    // After looping through all the characters, check if the 'currentNode'
    // marks the end of a word in the Trie.
    return currentNode.isEndOfWord;
  }

  insert(word, node = this.root) {
    const wordLength = word.length;

    if (wordLength === 0) return;

    for (let idx = 0; idx < wordLength; idx++) {
      let char = word[idx];

      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }

      node = node.children.get(char);
    }

    node.isEndOfWord = true;
  }
}
