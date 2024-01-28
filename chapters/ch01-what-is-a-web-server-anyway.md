[![Read Prev](/assets/imgs/prev.png)](/Readme.md)

# What the heck is a web server any way?

> Note: This chapter gives you a brief overview of the basics of web servers and HTTP. We'll learn about HTTP in more details in an [upcoming chapter](/chapters/ch05.0-http-deep-dive.md).

If you do not wish to read about the basics of web/http, you can safely jump to the [coding section](/chapters/ch02-your-first-nodejs-server.md).

Before diving straight into writing JavaScript code to create web servers, it's essential to grasp the fundamental concepts that are the basic building blocks of web server. Web servers are like the traffic controllers of the internet. They manage requests from users (like you!) and send back the right information. But what makes up a web server, and how does it even work? Let's break it down into simple terms.

## Parts of a Web Server:

Web servers are like friendly translators that help computers understand each other. Imagine if you and a friend speak different languages. To have a conversation, you'd need a common language that both of you understand. In the same way, web servers and computers need a common set of rules to talk to each other effectively. These rules are called protocols, which are like languages specifically designed for computers. When you type a website address in your browser and hit "Enter," your computer sends a message to the web server. This message follows the web's language rules, known as the HTTP protocol (Hypertext Transfer Protocol).

HTTP is like a code that tells the web server what you want (e.g., a webpage or an image) and how to respond. The web server reads your message, understands it because it knows the HTTP protocol too, and then sends back the information you requested using the same rules. This information could be a webpage, a picture, or any other content.

Just like you need to speak the same language to have a successful conversation with someone, computers and web servers need to use the same protocol to communicate effectively. This way, they can understand each other's requests and provide the right responses, allowing you to enjoy the content you're looking for on the internet. HTTP establishes a standardised set of rules for how your computer's request (like asking for a webpage) should be structured and how the server's response (the webpage itself) should be formatted. This ensures seamless communication between different devices, regardless of their underlying technologies.

Think of HTTP as a detailed script for a play. It outlines every step, from introducing characters (your request) to their dialogues (data transmission) and the grand finale (the server's response). This structured script eliminates misunderstandings and ensures that both sides know what to expect at each stage of the conversation.

But the protocol game isn't limited to HTTP. The web's secure version, HTTPS (Hypertext Transfer Protocol Secure), adds an extra layer of protection through encryption. This way, even if someone tries to [eavesdrop](https://en.wikipedia.org/wiki/Eavesdropping) on your conversation, they'll only hear garbled nonsense.

Protocols extend beyond web browsing too. Email, file sharing, and even the way your phone connects to Wi-Fi rely on various protocols to ensure reliable and efficient communication. Each protocol serves a specific purpose, just like different languages for different scenarios in real life.

### Navigating the World of Protocols: A Quick Overview

Like I explained above, to re-iterate - Protocols are like the rules that enable devices to communicate effectively on the internet. They define how data is formatted, transmitted, and understood by different systems. Just as people follow social etiquette during conversations, devices follow protocols to ensure smooth communication. Here's a glimpse into some major types of protocols:

-   **TCP/IP (Transmission Control Protocol/Internet Protocol):** a set of rules for exchanging data over a network.
-   **HTTP (Hypertext Transfer Protocol):** a protocol for transmitting data between a web server and a web client.
-   **HTTPS (Hypertext Transfer Protocol Secure):** an extension of HTTP that encrypts data in transit.
-   **UDP (User Datagram Protocol):** a protocol for transmitting data between networked devices without requiring a connection or reliability guarantees.
-   **FTP (File Transfer Protocol):** a protocol for transferring files between computers on a network.
-   **SMTP (Simple Mail Transfer Protocol):** a protocol for sending email messages between servers.
-   **POP3 (Post Office Protocol 3) and IMAP (Internet Message Access Protocol):** protocols for retrieving email messages from a server.
-   **DNS (Domain Name System):** a protocol for translating domain names into IP addresses.
-   **DHCP (Dynamic Host Configuration Protocol):** a protocol for automatically assigning IP addresses to devices on a network.

In order to become a proficient backend engineer, it is important to have a solid understanding of different networking protocols. While HTTP(s) is the main focus of this guide, having knowledge of other protocols such as FTP, SMTP, and DNS can prove beneficial in the long run. FTP (File Transfer Protocol) is commonly used for transferring files between servers, while SMTP (Simple Mail Transfer Protocol) is used for sending emails. DNS (Domain Name System) is responsible for translating domain names into IP addresses.

> If you're programming game servers, it's important to have a solid understanding of UDP. UDP is faster but less reliable than TCP, making it ideal for applications that can tolerate occasional data loss, such as video streaming or online gaming. Unlike TCP, UDP is a "fire and forget" protocol, meaning data is sent without any error-checking or acknowledgment mechanisms.

### The Relationship Between HTTP and TCP: Ensuring Reliable Web Communication

HTTP (Hypertext Transfer Protocol) and TCP (Transmission Control Protocol) form a strong partnership when it comes to web communication. The reason HTTP prefers TCP lies in the very nature of their roles and responsibilities within the world of networking.

### 1. Data Integrity and Order

HTTP is used to send web content, like web pages, images, and videos, from a server to a user's browser. Imagine if you requested a webpage and the images were missing or the text was scrambled. That wouldn't be a good experience, right? HTTP has to make sure that the data is delivered correctly and in order.

TCP helps with this. It was designed to make sure that data is delivered in the right order and without errors. TCP breaks up the data into small pieces called packets, sends them to the destination, and makes sure they arrive in the correct order. If any packet is lost during the process, TCP asks for it to be sent again. This is important for web pages because everything needs to be presented in a way that makes sense.

> A packet is a small unit of data that is sent over a network. In the context of web communication, TCP breaks up the data into small pieces called packets, sends them to the destination, and makes sure they arrive in the correct order. If any packet is lost during the process, TCP asks for it to be sent again.

### 2. Acknowledgment Mechanism

HTTP is a way to request a webpage, and the server sends back the content you asked for. To make sure the data is received correctly, an [acknowledgment mechanism](<https://en.wikipedia.org/wiki/Acknowledgement_(data_networks)>) is needed.

TCP provides this mechanism by waiting for your browser to confirm that it has received each packet of data sent from the server. If your browser does not confirm, TCP sends the packet again, so that both the server and browser can be sure that the data is being received properly.

### 3. Complex Interactions

HTTP transactions involve multiple steps, like requesting a webpage, receiving the HTML structure, fetching linked assets (images, stylesheets), and more. These interactions require precise data handling and sequencing.

TCP works well with HTTP for handling complex interactions. TCP's mechanisms guarantee that every piece of data reaches its intended destination and fits into the bigger interaction. For instance, when you visit a webpage, your browser makes several HTTP requests for different assets. TCP helps ensure that these requests and responses occur in an orderly and dependable manner.

### 4. Transmission Overhead

TCP adds some extra information to every message to make sure it gets to its destination without errors. This extra information includes acknowledgments, sequence numbers, and error-checking. Even though it adds a little more data to every message, it's still worth it because it helps make sure the data is accurate and in the right order. This is especially important when communicating over the web.

## Asking and Getting: How Web Servers Respond to Your Requests

Imagine you're at home, sitting in front of your computer, and you decide to visit a website, let's say "example.com." This simple action initiates a series of events that highlight the "Asking and Getting" process in web communication.

### The Request:

#### Your Request:

You type "example.com" into your browser's address bar and hit Enter. This is like you telling your computer, "Hey, I want to see what's on this website!"

#### Finding the Address:

Your computer knows the basics of websites, but it needs the exact address of "example.com" to connect to it. So, it reaches out to a special helper called a [DNS resolver](https://en.wikipedia.org/wiki/Domain_Name_System#Address_resolution_mechanism).

#### Resolving the Address:

The DNS resolver is like a digital address book. It takes "example.com" and looks up the actual IP address associated with it. This IP address is like the specific coordinates of the website's location on the internet.

> A website URL like https://google.com also be referred to as a **domain name**

### The Response:

#### Return Address:

The DNS resolver finds the IP address linked to "example.com" and sends it back to your computer. It's like the DNS resolver telling your computer, "The website is located at this IP address."

#### Sending the Request:

Now that your computer knows the IP address, it can send a request to the web server that holds the website's content. This request includes the IP address and a message saying, "Hey, can you please give me the content of your website?"

#### Preparing the Content:

The web server receives your request and understands that you want to see the content of "example.com." It then gathers the necessary files – HTML, images, stylesheets, scripts – to create the webpage.

#### Sending the Response:

The web server packages the content into a response and sends it back to your computer through the internet. It's like the server sending a digital package to your doorstep.

#### Enjoying the Content:

Your computer receives the response from the web server. Your browser interprets the HTML, displays images, and applies styles, creating a complete webpage. This is what you see on your screen – the final result of your request.

> A quick disclaimer: our learning approach will prioritize clarity and thoroughness. I will introduce a topic, break it down, and if we come across any unfamiliar concepts, we will explore them until everything is fully understood.

[![Read Prev](/assets/imgs/next.png)](/chapters/ch02-your-first-nodejs-server.md)
