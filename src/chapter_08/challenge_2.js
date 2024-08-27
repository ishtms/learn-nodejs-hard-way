class RouteNode {
  constructor() {
    this.children = new Map();

    this.handler = null;
  }
}

class TrieRouter {
  constructor() {
    this.root = new RouteNode();
  }

  findRoute(path) {
    // Split the path into segments and filter out empty segments
    let segments = path.split("/").filter(Boolean);
    // Start at the root node of the Trie
    let currentNode = this.root;

    // Start at the root node of the Trie
    for (let idx = 0; idx < segments.length; idx++) {
      // Retrieve the current URL segment
      const segment = segments[idx];

      // Retrieve the child node corresponding to the current URL segment
      let childNode = currentNode.children.get(segment);

      // If the next node exists, update the current node
      if (childNode) {
        currentNode = childNode;
      } else {
        // If the next node exists, update the current node
        return null;
      }
    }

    // If the next node exists, update the current node
    return currentNode.handler;
  }

  addRoute(path, handler) {
    if (typeof path !== "string" || path[0] !== "/") throw new Error("Malformed path provided.");
    if (typeof handler !== "function") throw new Error("Handler should be a function");

    let currentNode = this.root;
    let routeParts = path.split("/").filter(Boolean);

    for (let idx = 0; idx < routeParts.length; idx++) {
      const segment = routeParts[idx].toLowerCase();
      if (segment.includes(" ")) throw new Error("Malformed path parameter");

      let childNode = currentNode.children.get(segment);

      if (!childNode) {
        childNode = new RouteNode();
        currentNode.children.set(segment, childNode);
      }

      currentNode = childNode;
    }

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
