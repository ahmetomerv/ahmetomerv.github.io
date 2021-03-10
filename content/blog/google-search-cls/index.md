---
title: Google Search Cumulative Layout Shift
date: "2021-03-09T21:48:03.284Z"
description: A short rant on Google Search's anti-UX recommendation feature. 
---

What I'm about to show and write might sound like a ridiculous joke, but its not. Its one of the biggest UX fails in the history of the web (probably second to the invention of advertisement banners). And, the company that did this amazing job is, you might've heard of it, Google. I haven't been this furious and annoyed about something on the web except for a few things, like unskippable video-ads. There are some things you can let go of or not use that frequently. But Google Search is not one of them. I tried switching to DuckDuckGo a few times, but the search results for anything related to software development are not on point. I didn't even indulge to trying other engines. So, I'm stuck with this.

Now, I shall get to the fun part. You search for something on Google, results come up, you click a link, you go back and want to click the next link where hopefully someone has an answer for the bug you've been struggling with for hours or days. This is where Google decided to put a stupid recommendation list, making you click the wrong link, defying the years-long of experience that users have been used to. It makes you think, doesn't anyone at Google, _use_ Google Search, and not notice this?

#### The infamously anti-UX feature demo:

![Google search cumulative layout shift example](./google-search-cls-example1.gif "Google search cumulative layout shift example")

At most cases, half of the layout shifts without a direct user action except for clicking back, which only should do _that_ without tinkering with anything else.

You'd think that people at Google would know best about good usability, at the end of the day they're a $1.22 trillion company with tens of thousands of employees. But then, you see numbers don't mean anything when it comes to making wrong decisions and insisting on keeping it that way.

Another joke I'd like to tell is that Google itself advocates against Cumulative Layout Shift and recommends minimizing unexpected layout shifts for better usability. Funny, isn't it?

At [web.dev](https://web.dev) (an official Google website for web best practices), the article named [Optimize Cumulative Layout Shift
](https://web.dev/optimize-cls/) starts with the following words: _"Learn how to avoid sudden layout shifts to improve user-experience."_

Someone thought of this feature, talked about it to fellow teammates, and perhaps they agreed on it too, they planned it, approved it, developed it, tested it, and shipped it to billions of users. The only possible and reasonable explanation I can think of for why they don't/wouldn't see this as a major example of CLS, is that they consider it done for purpose. That it's not caused by some JavaScript or CSS loading asynchronously. That it's not a bug. The whole idea that CLS's aren't good is that they cause unexpected behavior without user action, be it intended or not, be it a bug or a feature. It isn't helpful, especially when the said "feature" goes against a behavior that users made a habit of for years — clicking a link on the search page and finding the same results if they go back. It's not even necessary to measure some metrics or score to realize how terrible an idea this is. I do hope Google will come to its senses.
