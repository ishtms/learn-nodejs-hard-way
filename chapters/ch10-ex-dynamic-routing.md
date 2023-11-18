# Exercise 4 - Implementing Dynamic Routing

When we're building a server application, dynamic routing is an essential feature for creating flexible and scalable applications. To fully grasp its significance and how we can enhance our router to support dynamic routes like `/users/:id`, let's delve into the concept of dynamic routing.

## Why Dynamic Routing?

At its core, dynamic routing refers to the ability of a web application (not just server) to handle requests to URLs that are not predetermined but rather, are defined by patterns. It allows developers to create routes that can match a range of URL structures, often using parameters. For instance, a URL like `/users/:user_id` can handle requests for any user ID, where `:user_id` is a variable part of the URL.

### Flexibility

Dynamic routing introduces a level of flexibility that static routing cannot match. As applications grow and become more complex, new routes often need to be added. With dynamic routing, you can handle a vast number of routes with just a few route patterns, making the application more scalable and easier to maintain. For example, imagine having to define a route for every kind of asset your website serves.

You may do something like this

```js
// images
app.get('/static/imgs/img1.png', img_handler);
app.get('/static/imgs/img2.png', img_handler);
app.get('/static/imgs/img3.png', img_handler);
app.get('/static/imgs/img4.png', img_handler);

// javascript
app.get('/static/js/main.js', script_handler);
app.get('/static/js/third_party.js', script_handler);

/** And so on**/
```

This is quite tedious, and you cannot expect an application like this to scale. What if we had a dynamic route to serve all the assets?

```js
app.get('/static/img/:image_file_name', img_handler)
app.get('/static/js/:javascript_file_name', img_handler)
```

This is somewhat better than the previous. 

> However, this is still not the best way to handle assets. You may have subdirectories - i.e `/img/compressed/webps/img.webp`. You will get a route not found while doing the method above. To solve this issue, we have a concept of wildcards. You don't need to worry about wildcards just yet. We'll cover them in the next chapter.

### Better User Experience

Dynamic routes allow for creating more personalized user experiences. For example, in a blog application, a dynamic route like `/posts/:postId` can display a specific post based on the ID in the URL. This approach makes it straightforward to link to specific content, improving the navigability and user engagement.

### Better Developer Experience

By using dynamic routes, developers of our framework can avoid the tedium of defining every possible URL path in their application. This not only saves time but also reduces the risk of errors. A single dynamic route can replace dozens, if not hundreds, of static routes, streamlining the development process.

### Better SEO

Dynamic routing can also contribute to better Search Engine Optimization (SEO). With the ability to generate clean and meaningful URLs (e.g., `/game/dota2` instead of `/game?uid=dota2`), dynamic routes make URLs more understandable to both users and search engines, potentially improving search rankings.

## Anatomy of a dynamic route

A dynamic route follows a structure where certain parts of the URL path are variable, known as dynamic segments. 

```
/[Static Path Segment]/[Dynamic Segment]/[More Static or Dynamic Segments]
```

Example URL: https://github.com/:user_id/repos

1. Static Path Segment: 'repos'
   
   - A fixed part of the URL path that doesn't change.

2. Dynamic Segment: `:user_id`
   
   - A variable part of the URL. The `user_id` can be any value, representing a specific user.

## Challenge 1: Update the `getRouteParts()` function

Initially, our `getRouteParts` function converted all parts of the route to lowercase. To support dynamic routes, we have to modify this function to keep dynamic segments (indicated by a colon `:`) as they are, without converting them to lowercase. This is crucial for recognizing dynamic parts in a route.

For example, we should give the developers the flexibility they want with naming their dynamic parameters. 

```js
/account/:UserId
/account/:user_id
```

### Requirement

Currently, the function normalizes the URL path and converts all segments to lowercase. Your goal is to modify the function to identify and preserve dynamic parameter placeholders marked with ":" (e.g., `:id`) while still normalizing other segments.

**More Details:**

1. The `path` parameter passed to the `getRouteParts` function is a string representing a URL path.

2. The function should first replace any consecutive forward slashes (`//`) with a single forward slash (`/`) to ensure proper path normalization.

3. It should then split the path into segments based on the forward slashes (`/`).

4. For each segment:
   
   - If the segment starts with a ":" (e.g., `:id`), it should be treated as a dynamic parameter and preserved as is.
   - If the segment does not start with a ":", it should be converted to lowercase and trimmed of any leading or trailing whitespace.

5. The function should return an array of path segments with dynamic parameters intact and other segments normalized.

6. Example:
   
   - Input: `"/api/user/:id/profile"`
   - Output: `["api", "user", ":id", "profile"]`

7. Another example:
   
   - Input: `"/api/user/:ID/profile"`
   
   - Output: `["api", "user", ":ID", "profile"]`

8. Ensure that your solution is efficient and follows modern JavaScript programming practices.

9. Update the provided `getRouteParts` function to implement this behavior. Make changes only within the function while keeping the function signature the same.

### Solution

Here's the solution I came up with:

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        /* If the segment starts with a semi-colon, return as it is */
        .map((curr) => (curr.startsWith(":") ? curr : curr.toLowerCase().trim()));
}
```

## Challenge 2: Add the dynamic routing functionality in `Router` class
