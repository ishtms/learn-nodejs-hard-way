class RouteNode {
  constructor() {
    // Create a Map to store children nodes
    this.children = new Map();

    // Initialize the handler to null
    this.handler = null;
  }
}

class TrieRouter {
  constructor() {
    // Create a root node upon TrieRouter instantiation
    this.root = new RouteNode();
  }

  addRoute(path, handler) {
    // Validate input types
    if (typeof path !== "string" || path[0] !== "/") throw new Error("Malformed path provided.");
    if (typeof handler !== "function") throw new Error("Handler should be a function");

    // Start at the root node of the Trie
    let currentNode = this.root;
    // Split the path into segments and filter out empty segments
    let routeParts = path.split("/").filter(Boolean);

    // Loop through all segments of the route
    for (let idx = 0; idx < routeParts.length; idx++) {
      const segment = routeParts[idx].toLowerCase();
      if (segment.includes(" ")) throw new Error("Malformed path parameter");

      // Attempt to find the next node in the Trie
      let childNode = currentNode.children.get(segment);

      // If the next node doesn't exist, create it
      if (!childNode) {
        childNode = new RouteNode();
        currentNode.children.set(segment, childNode);
      }

      // Move to the next node for the next iteration
      currentNode = childNode;
    }

    // Assign the handler to the last node
    currentNode.handler = handler;
  }

  printTree(node = this.root, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}${segment}`);
      this.printTree(childNode, indentation + 1);
    });
  }
}

const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/user/status/play", function inline() {});

trieRouter.printTree();
